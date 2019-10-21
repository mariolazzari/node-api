// get all bootcamps
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Get all bootcamps" });
};

// get  bootcamp
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get bootcamp ${req.params.id}` });
};

// add new bootcamp
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
};

// update bootcamp
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// delete bootcamp
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
