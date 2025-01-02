import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_URL,
  integrations: [Sentry.browserTracingIntegration(), Sentry.browserProfilingIntegration(), Sentry.replayIntegration()],

  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})
