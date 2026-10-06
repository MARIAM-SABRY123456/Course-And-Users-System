const express = require('express');
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");

const {createCourseVlaidator} = require("../utils/validators/courseValidator")
const {getAllCourses, createCourse, getCourse, updateCourse, deleteCourse} = require("../cotrollers/courseController");

router.route('/')
                .get(getAllCourses)
                .post(verifyToken,createCourseVlaidator,createCourse);
router.route('/:id')
                .get(getCourse)
                .put(updateCourse)
                .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), deleteCourse);
module.exports = router;