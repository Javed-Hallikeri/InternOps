# Frontend Global API Error Toasts

## Summary

This change adds a global API error handler for the frontend that surfaces user-friendly toast notifications for failures instead of only logging errors to the console.

## What changed

- Integrated `sonner` for toast notifications in `frontend/src/main.jsx`.
- Added a global axios response interceptor in `frontend/src/lib/axios.js` that detects:
  - network connectivity issues
  - request timeouts
  - 4xx client errors and uses server-provided error text when available
  - 5xx server errors with a generic friendly message
- The interceptor preserves the existing silent refresh flow for 401 responses and suppresses notifications for intentionally handled auth routes.

## Acceptance Criteria

- 4xx errors now show user-friendly toast messages with server error text when available.
- 5xx errors show a generic service failure toast.
- Network or timeout errors show a connectivity-specific toast.
- Notifications are not shown for auth refresh flow or intentionally handled retry logic.

## Files changed

- `frontend/src/lib/axios.js`
- `frontend/src/main.jsx`
- `frontend/package.json`
- `frontend/package-lock.json`

## Validation

- Verified with `npm run build` in `frontend`.
