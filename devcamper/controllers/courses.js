const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");

// get all courses
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// get single course
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    return next(new ErrorResponse(`No course with id ${id}`, 404));
  }

  res.status(200).json({ success: true, data: course });
});

// add new course
exports.addCourse = asyncHandler(async (req, res, next) => {
  // save bootcamp id
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id ${req.params.bootcampId}`)
    );
  }

  // create new course
  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// update course
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // check if course exists
  let course = await Course.findById(id);
  if (!course) {
    return next(new ErrorResponse(`No course with id ${id}`));
  }

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: course });
});

// delete course
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // check if course exists
  const course = await Course.findById(id);
  if (!course) {
    return next(new ErrorResponse(`No course with id ${id}`));
  }
  // remove course
  await course.remove();

  res.status(200).json({ success: true, data: {} });
});
