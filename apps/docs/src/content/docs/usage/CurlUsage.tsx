import { createMemo, createSignal } from 'solid-js';

type CountComponentOptions = {
  url: string;
  apiKey?: string;
  to: string;
  subject: string;
  body?: string;
};

const inputClassName =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

export default function () {
  const [state, setState] = createSignal({
    url: 'notymail.yourdomain.your_tld',
    to: 'test@1.1.1.1',
    subject: 'Hello world!',
  } as CountComponentOptions);

  const curlCommand = createMemo(
    () => `curl -X 'POST' '${state().url}/api/email' \\
  -H 'accept: application/json' \\${
    state().apiKey ? (
      `
  -H 'x-api-key: ${state().apiKey}' \\`
    ) : (
      <></>
    )
  }
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify({
    to: state().to,
    subject: state().subject,
    body: state().body,
  })}'`,
  );

  return (
    <div>
      <h4>Input:</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="pt-4">
          <label htmlFor="url">URL</label>
          <input
            id="url"
            value={state().url}
            type="text"
            onInput={(e) =>
              setState((state) => ({ ...state, url: e.target.value }))
            }
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="apiKey">API-Key</label>
          <input
            id="apiKey"
            type="text"
            value={state().apiKey}
            onInput={(e) =>
              setState((state) => ({ ...state, apiKey: e.target.value }))
            }
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="to">To</label>
          <input
            id="to"
            value={state().to}
            type="text"
            onInput={(e) =>
              setState((state) => ({ ...state, to: e.target.value }))
            }
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="subject">Subject</label>
          <input
            value={state().subject}
            id="subject"
            type="text"
            onInput={(e) =>
              setState((state) => ({ ...state, subject: e.target.value }))
            }
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            value={state().body ?? ''}
            id="content"
            className="min-h-40"
            type="text"
            onInput={(e) =>
              setState((state) => ({ ...state, body: e.target.value }))
            }
            className={inputClassName}
          />
        </div>
      </div>
      <h4>Output:</h4>
      <pre>{curlCommand()}</pre>
    </div>
  );
}
