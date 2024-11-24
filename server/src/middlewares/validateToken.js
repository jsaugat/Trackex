import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

//? Route PROTECTOR Middleware
const validateToken = asyncHandler(async function (req, res, next) {
  const { authorization } = req.headers;
  console.log("authorization :: ", authorization, "- validateToken middleware");
  const token = authorization?.split(" ")[1];

  // console.log("Token :: ", token, "-validateToken middleware");
  //? If token is present
  if (token) {
    try {
      /**
       * @function decoded
       * if token is :
       * valid   @returns an object representing the decoded payload of the JWT.
       * invalid @throws  an error that's why wrapped in try-catch block
       */
      const decodedObject = jwt.verify(token, process.env.JWT_SECRET_KEY);
      //? retrieve user-info from db based on 'decoded.userId' and assign it to a new 'user' property in req obj.
      // finding user by decodedObject.userId because jwt was signed with the 'userId'
      req.user = await User.findById(decodedObject.userId).select("-password");
      //? now req.user can be accessed from any protected routes and perform queries using it, hehehe
      next();
    } catch (error) {
      handleUnauthorized(res, "Invalid token");
    }
  } else {
    handleUnauthorized(res, "Missing token");
  }
});

//? Admin Validator Middleware
const verifyAdmin = asyncHandler(async function (req, res, next) {
  // Assumes validateToken middleware has already set req.user
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    handleUnauthorized(res, "Admin access required");
  }
});

function handleUnauthorized(res, errorMessage) {
  res.status(401);
  throw new Error(`Unauthorized: ${errorMessage}`);
}

export { validateToken, verifyAdmin };
