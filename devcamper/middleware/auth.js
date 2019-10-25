const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }
  /*
  else if(req.cookies.token){
      token = req.cookies.token
  }
  */

  // check token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to acces this route"), 401);
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error(error);
    return next(new ErrorResponse("Not authorized to acces this route"), 401);
  }
});

// grant access to specific role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      return next(
        new ErrorResponse(
          `User role ${role} is not authorized to access this route..`
        ),
        403
      );
    }
    next();
  };
};
