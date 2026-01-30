// const User = require("../models/UserModels");
// const crypto = require("crypto");
// const sendEmail = require("../utils/sendEmail");

// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 1. Generate a random reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");

//     // 2. Save token and expiry to DB
//     user.verificationToken = resetToken;
//     user.TokenExpires = new Date(Date.now() + 3600000); // 1 hour expiry
//     await user.save();

//     // 3. Create the Reset Link (Matches your ResetPassword component's useSearchParams)
//     const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

//     // 4. Email Template
//     const htmlContent = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
//         <h2 style="color: #2563eb;">Reset Your Password</h2>
//         <p>You requested a password reset for your Nepal TrekMate account. Click the button below to proceed:</p>
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
//         </div>
//         <p style="color: #666; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
//       </div>
//     `;

//     await sendEmail(email, "Password Reset Request - Nepal TrekMate", htmlContent);

//     res.status(200).json({ message: "Reset link sent to your email." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = forgotPassword;