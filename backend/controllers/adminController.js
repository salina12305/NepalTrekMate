
const User = require("../models/usermodel");

const adminUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, role, status } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.update({ fullName, email, role, status });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE USER
const adminDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.destroy();
        return res.status(200).json({ success: true, message: "User deleted permanently" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    adminUpdateUser,
    adminDeleteUser
};