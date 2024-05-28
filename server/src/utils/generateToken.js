import jwt from "jsonwebtoken";

// userId to interact with db to get or set user-specific data, i guess...
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  //
  //? It means we're logged if a cookie names "jwt" is set on response.
  res.cookie("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV !== "development", // HTTPS is used only in production
    // sameSite: "strict", // prevents CSRF attacks
    // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;
