const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const geocoder = require("../utils/geocoder");
const path = require("path");

// get all bootcamps
exports.getBootcamps = asyncHandler(async (req, res, next) =>
  res.status(200).json(res.advancedResults)
);

// get  bootcamp
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// add new bootcamp
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // add user to req body
  req.body.user = req.user;
  // check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  // if user is not an admin, one bootcamp only allowed
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp.`
      )
    );
  }

  // save new bootcamp
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// update bootcamp
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// delete bootcamp
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //const bootcamp = await Bootcamp.findByIdAndDelete(id); -> do not trigger pre remove!!!
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }
  bootcamp.remove(); // triggers pre remove

  res.status(200).json({ success: true, data: {} });
});

// get bootcamps by radius
exports.getBootcampsInRadius = asyncHandler(async (req, res, netxt) => {
  const { zipcode, distance } = req.params;
  // get lat and long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  // compute radius in radians : dist / earth radius
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// upload bootcamp photo
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //const bootcamp = await Bootcamp.findByIdAndDelete(id); -> do not trigger pre remove!!!
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  // check if file uploaded
  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  // upload file settings
  const { file } = req.files;
  const { MAX_FILE_UPLOAD, FILE_UPLOAD_PATH } = process.env;

  // check file type
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload an image file.", 400));
  }

  // check file size
  if (file.size > MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${MAX_FILE_UPLOAD}.`,
        400
      )
    );
  }

  // rename uploaded file
  const fileExt = path.parse(file.name).ext;
  file.name = `photo_${bootcamp._id}${fileExt}`;

  // move file to upload path
  file.mv(`${FILE_UPLOAD_PATH}/${file.name}`, async err => {
    // check for errors
    if (err) {
      console.error(err);
      return next(new ErrorResponse("File upload error.", 500));
    }

    // save file into database
    await Bootcamp.findByIdAndUpdate(id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
