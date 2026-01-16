const User = require("../models/usermodel");

const getPendingRequests = async (req, res) => {
    try {
        const pendingUsers = await User.findAll({ 
            where: { status: 'pending',
                role: 'travelagent' 
             },
            attributes: { exclude: ["password"] } 
        });
        res.status(200).json({ 
            message: "Pending requests fetched", 
            requests: pendingUsers 
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching requests", error: error.message });
    }
};

const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update({ status: 'approved' });

        res.status(200).json({ message: `${user.fullName} has been approved successfully.` });
    } catch (error) {
        res.status(500).json({ message: "Approval failed", error: error.message });
    }
};

// Reject/Delete a user request
const rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // We delete the record if they are rejected
        await user.destroy();

        res.status(200).json({ message: "Registration request rejected and removed." });
    } catch (error) {
        res.status(500).json({ message: "Rejection failed", error: error.message });
    }
};
const { Op } = require('sequelize');

const getActivePartners = async (req, res) => {
    try {
        const partners = await User.findAll({
            where: {
                status: 'approved',
                role: {
                    [Op.or]: ['travelagent', 'guide']
                }
            },
            attributes: ['id', 'fullName', 'email', 'role'] 
        });
        res.status(200).json({ partners });
    } catch (error) {
        res.status(500).json({ message: "Error fetching active partners" });
    }
};

module.exports = { 
    getPendingRequests, 
    getActivePartners, 
    approveUser, 
    rejectUser 
};
