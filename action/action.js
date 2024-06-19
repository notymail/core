const core = require('@actions/core');

try {
  const url = core.getInput('url');
  const to = core.getInput('to');
  const subject = core.getInput('subject');
  const body = core.getInput('body');
  const apiKey = core.getInput('apiKey');
  let headers = {
    'Content-Type': 'application/json',
    'User-Agent': `notymail-action@${process.env['GITHUB_ACTION_REF']}`,
  };
  if (apiKey) {
    headers = {
      ...headers,
      'x-api-key': apiKey,
    };
  }
  const response = await fetch(`${url}/send/email`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      to,
      subject,
      body,
    }),
  });
  if (response.status >= 300) {
    core.setFailed(JSON.stringify(await response.json()));
  }
} catch (error) {
  core.setFailed(error.message);
}
