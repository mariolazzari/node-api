const router = require("express").Router({ mergeParams: true }); // enable re-routeing from
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courses");

// middleware
const advancedResults = require("../middleware/advancedResults");
const Course = require("../models/Course");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description"
    }),
    getCourses
  )
  .post(addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
