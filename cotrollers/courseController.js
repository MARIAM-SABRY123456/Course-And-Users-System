const CourseModel = require("../models/courseModel");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

exports.getAllCourses = asyncWrapper( async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page-1)*limit;
  const courses = await CourseModel.find({}, { __v: false }).limit(limit).skip(skip);
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { courses } });
});
exports.getCourse = asyncWrapper( async (req, res, next) => {
  const { id } = req.params;
  const Course = await CourseModel.findById(id);
  if (!Course) {
    const error = appError.create("course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { Course } });
});

exports.createCourse =asyncWrapper( async (req, res, next) => {
  const newCourse = new CourseModel(req.body);
  await newCourse.save();
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { newCourse } });
});
exports.updateCourse = asyncWrapper( async (req, res, next) => {
  const { id } = req.params;
  const Course = await CourseModel.findByIdAndUpdate(
    { _id: id },
    { $set: { ...req.body } },
  );
  if (!Course) {
    const error = appError.create("course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { Course } });
});

exports.deleteCourse = asyncWrapper(async (req, res,next) => {
  const { id } = req.params;
  const course = await CourseModel.findByIdAndDelete(id);
  if (!course) {
    const error = appError.create("course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});