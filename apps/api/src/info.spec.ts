import app from './app';

describe('Info', () => {
  it('should respond with text "Running notymail! ( ͡° ͜ʖ ͡°) "', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('Running notymail! ( ͡° ͜ʖ ͡°) ');
  });

  it('should respond with JSON info "Running notymail! ( ͡° ͜ʖ ͡°) "', async () => {
    const res = await app.request('/api');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ info: 'Running notymail! ( ͡° ͜ʖ ͡°) ' });
  });
});
