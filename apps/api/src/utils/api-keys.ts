export function isAPIKeyInvalid(apiToken?: string): boolean {
  const API_KEYS = process.env.API_KEYS.split(',').filter(
    (it) => it.length > 0,
  );

  return API_KEYS.length > 0 && (!apiToken || !API_KEYS.includes(apiToken));
}
