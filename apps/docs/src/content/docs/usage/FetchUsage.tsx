import { createMemo } from 'solid-js';
import { Inputs, InputsProvider, useInputs } from '../Inputs.tsx';

export default function () {
  return (
    <InputsProvider>
      <Inputs />
      <Output />
    </InputsProvider>
  );
}

function Output() {
  const [state] = useInputs();

  const fetchCommand = createMemo(
    () => `await fetch('${state().url}/api/email', {
  method: "POST",
  headers: {
    "Content-Type": "application/json"${
      state().apiKey ? (
        `,
    "x-api-key": "${state().apiKey}"`
      ) : (
        <></>
      )
    }
  },
  body: JSON.stringify({
    to: "${state().to}",
    subject: "${state().subject}"${
      state().body ? (
        `,
    body: "${state().body}",`
      ) : (
        <></>
      )
    }
  })
})`,
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="my-0 mt-3">Output:</h4>
        </div>

        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
        ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
        disabled:opacity-50 bg-white text-black hover:bg-white/90 h-10 px-4 py-2"
          onClick={() =>
            navigator.clipboard.writeText(
              document.getElementById('fetch-command').innerText,
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-copy mr-2"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
            />
          </svg>
          Copy
        </button>
      </div>
      <pre id="fetch-command">{fetchCommand()}</pre>
    </>
  );
}
