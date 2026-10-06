const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createCourseVlaidator = [
    check('title')
    .notEmpty()
    .withMessage("Course required")
    .isLength({min: 3})
    .withMessage("Too short Course name")
    .isLength({max: 32})
    .withMessage("Too short Course name"),
    validatorMiddleware
];
