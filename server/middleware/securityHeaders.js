// middleware/securityHeaders.js
const helmet = require('helmet');

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://www.gstatic.com",
        "https://accounts.google.com",
        "https://apis.google.com"
      ],
      frameSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://content.googleapis.com"
      ],
      connectSrc: [
        "'self'",
        "https://www.googleapis.com",
        "https://accounts.google.com",
        "https://oauth2.googleapis.com"
      ],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
});

module.exports = securityHeaders;