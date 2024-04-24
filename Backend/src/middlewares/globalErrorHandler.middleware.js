const devErrors = (res, err) => {
    return res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
        stackTrace: err.stack,
        error: err,
    });
};

const prodErrors = (res, err) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({ status: err.statusCode, message: err.message });
    } else {
        return res.status(err.statusCode).json({
            status: 'error',
            message: 'Something went wrong! Please try again later',
        });
    }
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.ENV === 'development') {
        devErrors(res, err);
    } else if (process.env.ENV === 'production') {
        prodErrors(res, err);
    } else {
        res.status(500).json({ message: 'Check the ENV environment' });
    }
};

export default globalErrorHandler;
