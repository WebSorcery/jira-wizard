import * as Sentry from "@sentry/gatsby"
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: process.env.GATSBY_SENTRY_DSN,
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.

  integrations: [
    new Sentry.Feedback({
      // Additional SDK configuration goes in here
      colorScheme: "light",
     }),
     new BrowserTracing(),
     new Sentry.Replay({
      // Additional SDK configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  beforeSend: event => {
    // Check if it is an exception, and if so, show the report dialog
    if (event.exception) {
      Sentry.showReportDialog({ eventId: event.event_id })
    }
    return event
  },
})
