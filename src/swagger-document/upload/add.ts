import tags from '../tag-constant';
import response from '../../configs/response';
const addUpload = {
    post: {
        tags: [tags.upload],
        description: 'Check and if not exists add a new upload',
        operationId: 'addUpload',
        security: [
            {
                'bearerAuth': []
            }
        ],
        requestBody: {
            required: true,
            content: {
                 'multipart/form-data': {
                    schema: {
                        $ref: '#/components/schemas/uploadFileInput'
                    }
                }
            }
        },
        responses: {
            '200': {
                description: response['501'],
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/uploadFileOutput'
                        }
                    }
                }
            }
        }
    }
};

export default { ...addUpload };