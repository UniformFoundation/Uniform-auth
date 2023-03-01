import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';

import {
    GetCurrentUserSchema,
    GetCurrentUserSchemaType,
    LoginSchema,
    LoginSchemaType,
    LogoutSchema,
    LogoutSchemaType,
    RefreshSchema,
    RefreshSchemaType,
} from './schemas';

@Controller({ route: '/auth' })
export default class AuthController {
    @POST({
        url: '/login',
        options: {
            schema: LoginSchema,
            bodyLimit: 1024 * 1024 * 8,
        },
    })
    async loginHandler(req: FastifyRequest<LoginSchemaType>, res: FastifyReply) {
        // TODO: user code goes here
        throw new Error('Not implemented');
    }

    @GET({
        url: '/logout',
        options: {
            schema: LogoutSchema,
        },
    })
    async logoutHandler(req: FastifyRequest<LogoutSchemaType>, res: FastifyReply) {
        // TODO: user code goes here
        throw new Error('Not implemented');
    }

    @POST({
        url: '/refresh',
        options: {
            schema: RefreshSchema,
        },
    })
    async refreshHandler(req: FastifyRequest<RefreshSchemaType>, res: FastifyReply) {
        // TODO: user code goes here
        throw new Error('Not implemented');
    }

    @GET({
        url: '/current-user',
        options: {
            schema: GetCurrentUserSchema,
        },
    })
    async getCurrentUserHandler(req: FastifyRequest<GetCurrentUserSchemaType>, res: FastifyReply) {
        // TODO: user code goes here
        throw new Error('Not implemented');
    }
}
