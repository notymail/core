import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

const app = new OpenAPIHono();

app.get('/docs', swaggerUI({ url: '/docs-json' }));

export default app;
