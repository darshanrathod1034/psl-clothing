const jwt = require('jsonwebtoken');
const userModel = require('../models/users-model');

module.exports = async (req, res, next) => {
  // Check if the token exists in cookies
  if (!req.cookies.token) {
    return res.redirect('/?error=Please login first');
  }

  try {
    // Verify the token
    const decoded = jwt.verify(req.cookies.token, 'highhook');
    const user = await userModel.findOne({ email: decoded.email }).select('-password');

    // Attach the user to the request
    req.user = user;
    next();
  } catch (error) {
    // Handle errors during token verification
    return res.redirect('/?error=Something went wrong');
  }
};
