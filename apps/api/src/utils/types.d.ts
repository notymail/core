declare const process: {
  env: {
    MAIL_SENDER: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_SECURE: string;
    MAIL_AUTH_USER: string;
    MAIL_AUTH_PASSWORD: string;
    MAIL_TIME_OUT_MS: string | undefined;
    API_KEYS: string;
  };
};
