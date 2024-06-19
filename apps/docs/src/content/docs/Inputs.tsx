import { createContext, createSignal, useContext } from 'solid-js';

type InputsState = {
  url: string;
  apiKey?: string;
  to: string;
  subject: string;
  body?: string;
};

const InputsContext = createContext();

export function InputsProvider(props) {
  const [state, setState] = createSignal({
      url: 'notymail.yourdomain.your_tld',
      to: 'test@1.1.1.1',
      subject: 'Hello world!',
    } as InputsState),
    inputs = [state, setState];

  return (
    <InputsContext.Provider value={inputs}>
      {props.children}
    </InputsContext.Provider>
  );
}

export function useInputs() {
  return useContext(InputsContext);
}

const inputClassName =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

export function Inputs() {
  const [state, setState] = useInputs();

  return (
    <>
      <h4>Input:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
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
          <label htmlFor="body">Body</label>
          <textarea
            value={state().body ?? ''}
            id="body"
            type="text"
            onInput={(e) =>
              setState((state) => ({ ...state, body: e.target.value }))
            }
            className={inputClassName + ' min-h-40'}
          />
        </div>
      </div>
    </>
  );
}
