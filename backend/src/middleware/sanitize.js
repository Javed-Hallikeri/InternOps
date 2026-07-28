// Basic input sanitization for common injection patterns
const sanitizeHtml = require('sanitize-html');

const EXCLUDED_FIELDS = [
  'password',
  'oldpassword',
  'newpassword',
  'confirmpassword',
  'token',
  'resettoken',
  'accesstoken',
  'refreshtoken',
  'verificationtoken',
  'apikey',
  'clientsecret',
  'email',
  'recipient_email',
  'avatar_url',
  'thumbnail_url',
  'qr_code_url',
  'pdf_path',
  'url',
  'link',
  'actionurl',
  'redirecturi',
  'redirect_uri',
];

function isExcludedField(key) {
  if (typeof key !== 'string') return false;
  const lowerKey = key.toLowerCase();
  return (
    EXCLUDED_FIELDS.includes(lowerKey) ||
    lowerKey.includes('password') ||
    lowerKey.includes('token') ||
    lowerKey.includes('secret') ||
    lowerKey.includes('key') ||
    lowerKey.includes('signature') ||
    lowerKey.endsWith('url') ||
    lowerKey.endsWith('uri') ||
    lowerKey.endsWith('path')
  );
}

function sanitizeInput(obj, allowedFields = []) {
  if (typeof obj !== 'object' || obj === null) return;

  for (const key of Object.keys(obj)) {
    if (isExcludedField(key)) {
      continue;
    }
    const val = obj[key];

    if (typeof val === 'string') {
      if (allowedFields.length === 0 || allowedFields.includes(key)) {
        obj[key] = sanitizeHtml(val, {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    } else if (val && typeof val === 'object') {
      sanitizeInput(val, allowedFields);
    }
  }
}

function sanitizationMiddleware(request, reply, done) {
  if (request.body) {
    sanitizeInput(request.body);
  }

  if (request.query) {
    sanitizeInput(request.query);
  }

  if (request.params) {
    sanitizeInput(request.params);
  }

  done();
}

module.exports = { sanitizeInput, sanitizationMiddleware, isExcludedField };
