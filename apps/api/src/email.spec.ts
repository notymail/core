import app from './app';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

describe('Email Validation', () => {
  it('should fail on invalid to email"', async () => {
    const res = await app.request('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'not_an_email',
        subject: 'Test',
      }),
    });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      code: 400,
      message: 'Validation Error',
    });
  });
  it('should fail on missing subject"', async () => {
    const res = await app.request('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'test@test.at',
        body: 'Hello world',
      }),
    });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      code: 400,
      message: 'Validation Error',
    });
  });

  it('should fail on missing api key"', async () => {
    const res = await app.request('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'test@test.at',
        subject: 'Hello worlds',
      }),
    });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      code: 401,
      message: 'API-Token required but not found',
    });
  });
});

describe('Working email', () => {
  let container: StartedTestContainer;
  let mailChecker: string;

  beforeAll(async () => {
    container = await new GenericContainer('axllent/mailpit')
      .withExposedPorts(1025, 8025)
      .withWaitStrategy(Wait.forHttp('/', 8025))
      .start();

    process.env.MAIL_HOST = container.getHost();
    process.env.MAIL_PORT = String(container.getMappedPort(1025));

    // noinspection HttpUrlsUsage
    mailChecker = `http://${container.getHost()}:${container.getMappedPort(8025)}/api/v1`;
  }, 10 * 1000);

  afterAll(async () => {
    await container.stop();
  });

  it('should work without body', async () => {
    const res = await app.request('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': '1234' },
      body: JSON.stringify({
        to: 'test@test.at',
        subject: 'Hello world',
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      sent: true,
      messageId: json.messageId,
      to: 'test@test.at',
      subject: 'Hello world',
    });

    const mailCheckRes = await fetch(`${mailChecker}/messages`);
    const mailCheckJson = await mailCheckRes.json();

    const mail = mailCheckJson.messages.find(
      (it) => json.messageId === it.MessageID,
    );

    expect(mail.From.Address).toEqual('notymail@test.at');
    expect(mail.To[0].Address).toEqual('test@test.at');
    expect(mail.Subject).toEqual('Hello world');
  });

  it('should work with body', async () => {
    const res = await app.request('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': '1234' },
      body: JSON.stringify({
        to: 'test@test.at',
        subject: 'Hello world',
        body: 'Hello body world',
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.messageId).toContain('@test.at');
    expect(json).toEqual({
      sent: true,
      messageId: json.messageId,
      to: 'test@test.at',
      subject: 'Hello world',
      text: 'Hello body world\n\n',
      html: '<p>Hello body world</p>\n',
    });

    const mailCheckRes = await fetch(`${mailChecker}/messages`);
    const mailCheckJson = await mailCheckRes.json();

    const mail = mailCheckJson.messages.find(
      (it) => json.messageId === it.MessageID,
    );

    expect(mail.From.Address).toEqual('notymail@test.at');
    expect(mail.To[0].Address).toEqual('test@test.at');
    expect(mail.Subject).toEqual('Hello world');
    expect(mail.Snippet).toEqual('Hello body world');
  });

  it('should work without api key', async () => {
    process.env.API_KEYS = '';

    const res = await app.request('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'test@test.at',
        subject: 'Hello world',
        body: 'Hello body world',
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.messageId).toContain('@test.at');
    expect(json).toEqual({
      sent: true,
      messageId: json.messageId,
      to: 'test@test.at',
      subject: 'Hello world',
      text: 'Hello body world\n\n',
      html: '<p>Hello body world</p>\n',
    });

    const mailCheckRes = await fetch(`${mailChecker}/messages`);
    const mailCheckJson = await mailCheckRes.json();

    const mail = mailCheckJson.messages.find(
      (it) => json.messageId === it.MessageID,
    );

    expect(mail.From.Address).toEqual('notymail@test.at');
    expect(mail.To[0].Address).toEqual('test@test.at');
    expect(mail.Subject).toEqual('Hello world');
    expect(mail.Snippet).toEqual('Hello body world');
  });
});
