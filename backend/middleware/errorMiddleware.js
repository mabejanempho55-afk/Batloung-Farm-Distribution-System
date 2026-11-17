function errorMiddleware(err, req, res, next) {
    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'This record already exists';
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        message = 'The related record does not exist';
    }

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        statusCode = 409;
        message = 'This record cannot be deleted because it is being used';
    }

    if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
        statusCode = 400;
        message = 'The supplied data does not meet the database requirements';
    }

    res.status(statusCode).json({
        success: false,
        message
    });
}

module.exports = errorMiddleware;