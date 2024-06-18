import { prettyJSON } from 'hono/pretty-json';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { OpenAPIHono } from '@hono/zod-openapi';
import api from './api';
import { timeout } from 'hono/timeout';
import swagger from './swagger';

const app = new OpenAPIHono();

// Setup
app.use(prettyJSON());
app.use(trimTrailingSlash());
app.use('/api', timeout(5000));

// Swagger
app.doc('/docs-json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'notymail',
  },
});
app.openAPIRegistry.registerComponent(
  'securitySchemes',
  'AuthorizationApiKey',
  {
    type: 'apiKey',
    name: 'X-API-KEY',
    in: 'header',
  },
);
app.route('/', swagger);

// Info
app.get('/', (c) => {
  return c.text('Running notymail! ( ͡° ͜ʖ ͡°) ');
});

// API
app.route('/', api);

export default app;
