import { OpenAPIHono } from '@hono/zod-openapi';
import infoApi from './info';
import emailApi from './email';

const api = new OpenAPIHono();

api.route('/', infoApi);

api.route('/', emailApi);

export default api;
