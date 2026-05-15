class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleSequelizeError = (error) => {
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err => err.message);
    return new AppError(errors.join(', '), 400);
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return new AppError('Duplicate field value entered', 400);
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return new AppError('Invalid reference to related entity', 400);
  }

  return error;
};

module.exports = {
  AppError,
  handleSequelizeError
};
