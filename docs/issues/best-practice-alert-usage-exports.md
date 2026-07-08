# [Best Practice] Browser `alert()` Usage — `Exports.jsx`

## Summary

Native browser `alert()` dialogs are used for error feedback in `Exports.jsx` at lines 55 and 79. This is discouraged in production applications as it blocks the JS thread, cannot be styled, and is inconsistent with the existing UI component library.

## File

`frontend/src/pages/admin/Exports.jsx`

## Affected Code

**Line 55 — validation error:**
```jsx
alert('Please select both a From and To date before downloading.');
```

**Line 79 — download error:**
```jsx
alert(err.response?.data?.error || 'Download failed');
```

## Why It's a Problem

- `alert()` is a **blocking** browser dialog — freezes the entire page and JS thread until dismissed
- Cannot be styled or themed to match the Tailwind UI
- Looks inconsistent with the rest of the app's polished UI
- Some browsers suppress repeated `alert()` calls triggered in quick succession
- Can be disabled entirely in certain iframe or embedded environments

## Severity

| Field | Detail |
|---|---|
| Severity | Medium |
| Type | Best Practice |
| Rule | `javascript/alert-box` |
| Component | `frontend/src/pages/admin/Exports.jsx` |

## Recommended Fix

Replace both `alert()` calls with inline error state — the same pattern already used in `CreateUserModal.jsx` and `BulkUserModal.jsx`:

```jsx
const [error, setError] = useState('');

const download = async (endpoint, requiresDates) => {
  if (requiresDates && (!from || !to)) {
    setError('Please select both a From and To date before downloading.');
    return;
  }

  try {
    setError('');
    // ...existing download logic
  } catch (err) {
    setError(err.response?.data?.error || 'Download failed');
  }
};
```

Render the error in JSX:

```jsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3">
    {error}
  </div>
)}
```

This removes `alert()` and gives users a styled, non-blocking error message consistent with the rest of the app.

## References

- [MDN — Window.alert()](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)
- [AWS Q Detector — javascript/alert-box](https://docs.aws.amazon.com/amazonq/detector-library/javascript/alert-box)
