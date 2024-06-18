import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

const InfoResponseScheme = z
  .object({
    info: z.string().openapi({
      example: 'Running notymail! ( ͡° ͜ʖ ͡°) ',
    }),
  })
  .openapi('APIResponse');

export const infoRoute = createRoute({
  method: 'get',
  path: '/api',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: InfoResponseScheme,
        },
      },
      description: 'Retrieve server info successfully',
    },
  },
});

const infoApi = new OpenAPIHono();

infoApi.openapi(infoRoute, (c) =>
  c.json(
    {
      info: 'Running notymail! ( ͡° ͜ʖ ͡°) ',
    },
    200,
  ),
);

export default infoApi;
