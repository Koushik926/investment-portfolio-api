const morgan = require('morgan');

// Custom token for user ID
morgan.token('user-id', (req) => {
  return req.user ? req.user.userId : 'anonymous';
});

// Custom format for development
const devFormat = ':method :url :status :response-time ms - :res[content-length] - User: :user-id';

// Custom format for production
const prodFormat = ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

const requestLogger = (env = 'development') => {
  if (env === 'production') {
    return morgan(prodFormat);
  }
  return morgan(devFormat);
};

module.exports = requestLogger;
