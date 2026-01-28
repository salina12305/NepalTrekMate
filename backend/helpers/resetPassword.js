const User = require("../models/UserModels")
const bcrypt = require("bcrypt")

const resetPassword = async (req, res) => {
  try {
    //  FIXED: req.body instead of res.body
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "token or password cannot be null"
      });
    }

    const user = await User.findOne({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error while resetting password",
      error: error.message,
    });
  }
}

module.exports = resetPassword;