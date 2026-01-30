// const User = require("../models/UserModels");
// const bcrypt = require("bcrypt");

// const resetPassword = async (req, res) => {
//   try {
//     const { token, password } = req.body;

//     if (!token || !password) {
//       return res.status(400).json({ message: "Token and password are required" });
//     }

//     // 1. Find user with the matching token and check if token hasn't expired
//     // We look for a user where verificationToken matches AND TokenExpires is in the future
//     const user = await User.findOne({
//       where: {
//         verificationToken: token,
//       }
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired reset token" });
//     }

//     // 2. Check Expiry manually (if not handled by the DB query)
//     const now = new Date();
//     if (user.TokenExpires && user.TokenExpires < now) {
//       return res.status(400).json({ message: "Reset token has expired" });
//     }

//     // 3. Hash the new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // 4. Update user and clear reset fields so the token can't be used again
//     user.password = hashedPassword;
//     user.verificationToken = null;
//     user.TokenExpires = null;
    
//     await user.save();

//     res.status(200).json({ message: "Password has been reset successfully" });

//   } catch (error) {
//     console.error("Reset Password Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = resetPassword;