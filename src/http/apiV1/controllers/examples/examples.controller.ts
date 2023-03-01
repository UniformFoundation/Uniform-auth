import { FastifyRequest, FastifyReply } from 'fastify';
import { GET, Controller } from 'fastify-decorators';
import { GetExampleEntitySchema, GetExampleEntitySchemaType } from './schemas';

@Controller({ route: '/examples' })
export default class ExamplesController {
    @GET({
        url: '/:id',
        options: {
            schema: GetExampleEntitySchema,
        },
    })
    async getExampleEntityHandler(req: FastifyRequest<GetExampleEntitySchemaType>, res: FastifyReply) {
        // TODO: user code goes here
        throw new Error('Not implemented');
    }
}
