import circuitBreaker from '@fastify/circuit-breaker';
import formBody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import { getEnvironment } from '@scripts/env';
import { createTaskRunner } from '@uniform-foundation/cron-runner';
import serveStoplight from '@uniform-foundation/fastify-serve-stoplight';
import Fastify, { RequestGenericInterface } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import multer from 'fastify-multer';
import { ReadStream } from 'fs';
import path, { resolve } from 'path';
import pino from 'pino';
import { PrismaClient } from '@prisma/client';

import { NotFoundError } from './http/apiV1/common/errors/NotFoundError';

// import API from './api';

// Declaration merging
declare module 'fastify' {
    type JsonResponse = {
        data?: unknown | unknown[];
        meta?: Record<string, unknown>;
        errors?: {
            error?: string;
            code: string;
            message: string;
            statusCode?: number;
            stack?: string;
            cause?: unknown;
        }[];
    };

    type ReplyWith = string | JsonResponse | ReadStream | Buffer | Error;

    export interface ReplyGenericInterface {
        Reply?: ReplyWith;
    }

    export interface RouteGenericInterface extends RequestGenericInterface, ReplyGenericInterface {
        Reply?: ReplyWith;
    }

    export interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const rootPath = resolve(__dirname, '../');

async function createServer() {
    const { LOG_LEVEL, APP_NAME } = getEnvironment();

    const app = Fastify({
        return503OnClosing: true,
        pluginTimeout: 1000,
        ignoreTrailingSlash: true,
        ignoreDuplicateSlashes: true,
        logger: pino({
            level: LOG_LEVEL,
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: true,
                },
            },
        }),
    });

    const prisma = new PrismaClient({});
    app.decorate('prisma', prisma);

    await prisma.$connect();

    // TODO: env
    app.register(circuitBreaker, {
        threshold: 3,
        timeout: 10000,
        resetTimeout: 10000,
    });

    app.register(serveStoplight, {
        path: path.resolve(rootPath, 'public/api-docs'),
        prefix: '/docs/api/',
        appName: APP_NAME,
        cachePath: path.resolve(rootPath, 'storage/cache/api-docs'),
    });

    app.setNotFoundHandler(async req => {
        throw new NotFoundError({
            endpoint: req.url,
            params: req.params || null,
            body: req.body || null,
        });
    });

    app.setErrorHandler(async (err, req, reply) => {
        const error = {
            code: err.code,
            error: err.name,
            message: err.message,
            statusCode: err.statusCode || Number(err.code) || 500,
            stack: err.stack,
            cause: err.cause,
        };

        app.log.error(error, `Request #${req.id} (${req.url}) error ${error.code}`);

        await reply.status(error.statusCode).send({
            data: null,
            meta: {},
            errors: [error],
        });
    });

    // TODO: https://www.npmjs.com/package/fastify-multer

    app.register(multer.contentParser);
    app.register(formBody);
    app.register(helmet, {
        global: true,
    });

    app.register(bootstrap, {
        directory: resolve(__dirname, 'http', 'apiV1', 'controllers'),
        mask: /\.controller\./,
        prefix: '/api/v1',
    });

    // app.register(APIv1);

    // app.register(API);
    // app.register(now, {
    //   routesFolder: path.join(__dirname, './routes'),
    // });

    const runner = await createTaskRunner({
        folder: resolve(__dirname, './tasks'),
        pattern: '**/*.ts',
        transpiledFolder: resolve(__dirname, '..', 'storage', 'cache', './tasks'),
        onTaskComplete(task) {
            app.log.info(task, '[task] completed');
        },
        tickTime: 1000,
    });

    app.addHook('onClose', () => runner.stop());

    await app.ready();

    return app;
}

export default createServer;
