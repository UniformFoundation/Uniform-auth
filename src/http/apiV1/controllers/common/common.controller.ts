import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, POST } from 'fastify-decorators';

import { DownloadProtectedFileSchema, DownloadProtectedFileSchemaType } from './schemas';

@Controller({ route: '/common' })
export default class CommonController {
    @POST({
        url: '/files/download-protected',
        options: {
            schema: DownloadProtectedFileSchema,
        },
    })
    async downloadProtectedFileHandler(req: FastifyRequest<DownloadProtectedFileSchemaType>, res: FastifyReply) {
        // TODO: user code goes here
        throw new Error('Not implemented');
    }
}
