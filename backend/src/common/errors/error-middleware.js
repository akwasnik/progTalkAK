module.exports = (err, _req, res, _next) => {
  const status = err.status || 500;

  res.status(status).json({
    status,
    message: err.message,
    details: err.details ?? null
  });
};
