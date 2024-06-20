import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { Marked } from 'marked';
import { isAPIKeyInvalid } from './utils/api-keys';

import sendMail from './utils/mail';

const htmlRenderer = new Marked({
  gfm: true,
  breaks: true,
  async: true,
});

const EmailDtoSchema = z
  .object({
    to: z.string().email().openapi({
      example: 'test@1.1.1.1',
    }),
    subject: z.string().min(3).max(988).openapi({ example: 'Hello world!' }),
    body: z.string().optional().openapi({
      example: 'Hello world! **This** _is_ markdown!',
    }),
  })
  .openapi('EmailDTO');

const ValidationErrorSchema = z.object({
  code: z.number().openapi({
    example: 400,
  }),
  message: z.string().openapi({
    example: 'Bad Request',
  }),
});

const AuthorizationErrorSchema = z.object({
  code: z.number().openapi({
    example: 401,
  }),
  message: z.string().openapi({
    example: 'API-Token required but not found',
  }),
});

const InternalServerErrorSchema = z.object({
  code: z.number().openapi({
    example: 500,
  }),
  message: z.string().openapi({
    example: 'Could not deliver mail',
  }),
});

const EmailResponseSchema = z
  .object({
    sent: z.boolean().openapi({
      example: true,
      description:
        'True when the email has been sent, false when an error occurred.',
    }),
    messageId: z.string().openapi({
      description: 'ID of the message',
    }),
    to: z.string().email().openapi({
      example: 'test@1.1.1.1',
    }),
    subject: z.string().min(3).max(988).openapi({ example: 'Hello world!' }),
    plain: z.string().optional().openapi({
      example: 'Hello world! This is markdown!',
    }),
    html: z.string().optional().openapi({
      example:
        '<p>Hello world! <strong>This</strong> <em>is</em> markdown!</p>',
    }),
  })
  .openapi('EmailResponse');

export const emailRoute = createRoute({
  method: 'post',
  path: '/api/email',
  security: [
    {
      AuthorizationApiKey: [],
    },
  ],
  summary: 'Send email',
  request: {
    headers: z.object({
      'x-api-key': z.string().optional(),
    }),
    body: {
      content: {
        'application/json': {
          schema: EmailDtoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: EmailResponseSchema,
        },
      },
      description: 'Sent email successfully',
    },
    500: {
      content: {
        'application/json': {
          schema: InternalServerErrorSchema,
        },
      },
      description: 'Internal server error response',
    },
    400: {
      content: {
        'application/json': {
          schema: ValidationErrorSchema,
        },
      },
      description: 'Validation error response',
    },
    401: {
      content: {
        'application/json': {
          schema: AuthorizationErrorSchema,
        },
      },
      description: 'Unauthorized Response',
    },
  },
});

function removeMarkdown(text: string): string {
  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`[^`\n]+`/g, '');
  // Remove images
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');
  // Remove links
  text = text.replace(/\[.*?\]\(.*?\)/g, '');
  // Remove bold and italics
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  text = text.replace(/(\*|_)(.*?)\1/g, '$2'); // Italics
  // Remove strikethrough
  text = text.replace(/~~(.*?)~~/g, '$1');
  // Remove headers
  text = text.replace(/^\s*(#{1,6})\s*(.*)/gm, '$2');
  // Remove horizontal rules
  text = text.replace(/^-{3,}/gm, '');
  // Remove blockquotes
  text = text.replace(/^\s*>+\s?/gm, '');
  // Remove unordered lists
  text = text.replace(/^\s*[-+*]\s+/gm, '');
  // Remove ordered lists
  text = text.replace(/^\s*\d+\.\s+/gm, '');

  return text;
}

const emailApi = new OpenAPIHono();

emailApi.openapi(
  emailRoute,
  async (c) => {
    const { to, subject, body } = (await c.req.json()) as z.infer<
      typeof EmailDtoSchema
    >;
    const { 'x-api-key': apiKey } = c.req.valid('header');

    if (isAPIKeyInvalid(apiKey)) {
      return c.json(
        {
          code: 401,
          message: 'API-Token required but not found',
        },
        401,
      );
    }

    const html = body ? await htmlRenderer.parse(body) : undefined;
    const text = body ? removeMarkdown(body) : undefined;

    try {
      const mail = await sendMail(to, subject, html, text);

      return c.json(
        {
          sent: true,
          messageId: mail.messageId.replace(/[<>]/g, ''),
          to,
          subject,
          text,
          html,
        },
        200,
      );
    } catch (e) {
      console.warn(e);

      return c.json(
        {
          code: 500,
          message: 'Could not deliver mail',
        },
        500,
      );
    }
  },
  (result, c) => {
    if (!result.success) {
      // @ts-expect-error Weird type error -> it works
      return c.json(
        {
          code: 400,
          message: 'Validation Error',
        },
        400,
      );
    }
  },
);

export default emailApi;
