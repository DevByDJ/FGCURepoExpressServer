function log(...args) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}

module.exports = log;
