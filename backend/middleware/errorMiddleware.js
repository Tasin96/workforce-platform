const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Sequelize / PostgreSQL specific errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors && err.errors.length > 0
      ? err.errors.map((e) => e.message).join(', ')
      : 'A record with that unique key already exists';
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors && err.errors.length > 0
      ? err.errors.map((e) => e.message).join(', ')
      : 'Validation error';
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Referenced resource does not exist';
  } else if (
    err.name === 'SequelizeDatabaseError' &&
    String(err.message).toLowerCase().includes('invalid input syntax for type uuid')
  ) {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Legacy Mongo/Mongoose catchers
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
