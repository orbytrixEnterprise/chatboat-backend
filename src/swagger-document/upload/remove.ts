import tags from '../tag-constant';
import response from '../../configs/response';
const updateUpload = {
    put: {
        tags: [tags.upload],
        description: 'Check and if not exists update upload',
        operationId: 'updateUpload',
        security: [
            {
                'bearerAuth': []
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/removeFileInput'
                    }
                }
            }
        },
        responses: {
            '200': {
                description: response['502'],
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/removeFileOutput'
                        }
                    }
                }
            }
        }
    }
};

export default { ...updateUpload };