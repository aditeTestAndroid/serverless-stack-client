import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const isLocal = process.env.NODE_ENV === "development";
export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({
    dsn:
      "https://c4be93924c9946d6b47dabb0f4bcc3f1@o452328.ingest.sentry.io/5439525",
    integrations: [Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

export function logError(error, errorInfo = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope((scope) => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

export const onError = (error) => {
  let errorInfo = {};
  let message = error.toString();

  // Auth errors
  if (!(error instanceof Error) && error.message) {
    errorInfo = error;
    message = error.message;
    error = new Error(message);
    // API errors
  } else if (error.config && error.config.url) {
    errorInfo.url = error.config.url;
  }

  logError(error, errorInfo);

  alert(message);
};
