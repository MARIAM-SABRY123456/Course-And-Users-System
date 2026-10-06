const {validationResult } = require('express-validator');
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError")
const validatorMiddleware = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
    const error = appError.create(errors.array(), 404, httpStatusText.FAIL);
    return next(error);
    }
    next();
};

module.exports = validatorMiddleware;