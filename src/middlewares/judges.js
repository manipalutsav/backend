const jwt = require("jsonwebtoken");
const secretKey = process.env.HMAC_SECRET_KEY || "your-secret-key";

const requireAdmin = (req, res, next) => {
  // Retrieve token from HTTP-only cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized. Token is missing.",
    });
  }

  try {
    // Verify and decode the token
    const userData = jwt.verify(token, secretKey);
    // Check if the user type is 1
    if (userData.type === 1) {
      // Optionally, attach the user data to req for later use
      req.user = userData;
      return next();
    } else {
      return res.status(403).json({
        status: 403,
        message: "Forbidden. Only users of type 1 can delete judges.",
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized. Token is invalid or expired.",
    });
  }
};

module.exports = requireAdmin;
