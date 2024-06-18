import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import sendMail from './mail';

describe('Email Sending', () => {
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
  }, 20 * 1000);

  afterAll(async () => {
    await container.stop();
  });

  it('should work"', async () => {
    const mail = await sendMail(
      'test@test.at',
      'Test Subject',
      undefined,
      undefined,
    );

    const res = await fetch(`${mailChecker}/messages`);
    const json = await res.json();

    expect(json.count).toEqual(1);
    expect(json.messages.length).toEqual(1);
    expect(mail.messageId).toEqual(`<${json.messages[0].MessageID}>`);

    const mailCheck = json.messages.find(
      (it) => mail.messageId === `<${it.MessageID}>`,
    );

    expect(mailCheck).toBeDefined();
    expect(json.messages[0].From.Address).toEqual('notymail@test.at');
    expect(json.messages[0].To[0].Address).toEqual('test@test.at');
    expect(json.messages[0].Subject).toEqual('Test Subject');
  });
});
