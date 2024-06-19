import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

app.get('/docs', swaggerUI({ url: '/docs-json' }));

export default app;
