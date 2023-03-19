import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';

import { GetExampleEntitySchema, GetExampleEntitySchemaType } from './schemas';

@Controller({ route: '/examples' })
export default class ExamplesController {
    @GET({
        url: '/:id',
        options: {
            schema: GetExampleEntitySchema,
            onResponse: (req, repl, done) => {
                console.log('   sending to statistics server info about request...');
                done();
            },
        },
    })
    async getExampleEntityHandler(req: FastifyRequest<GetExampleEntitySchemaType>, res: FastifyReply) {
        // TODO: user code goes here
        throw new Error('Not implemented');
    }
}
