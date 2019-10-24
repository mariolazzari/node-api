const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");

// register new user
exports.register = asyncHandler(async (req, res, next) => {
  // create user
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });

  // create user token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});

// login user
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate user and password
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide an email and a password.", 400)
    );
  }

  // check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials.", 401));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials.", 401));
  }

  // return user token
  sendTokenResponse(user, 200, res);
});

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

// get current logged user
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user);

  res.status(200).json({ success: true, data: user });
});
