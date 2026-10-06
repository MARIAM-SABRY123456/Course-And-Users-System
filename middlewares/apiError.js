const golbalError = (error, req, res, next) =>{
    error.statusCode = error.statusCode || 500;
    error.status = error.statuse || 'error';
    res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
    })
}
module.exports = golbalError;