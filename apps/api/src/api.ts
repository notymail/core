import { OpenAPIHono } from '@hono/zod-openapi';
import emailApi from './email';
import infoApi from './info';

const api = new OpenAPIHono();

api.route('/', infoApi);

api.route('/', emailApi);

export default api;
