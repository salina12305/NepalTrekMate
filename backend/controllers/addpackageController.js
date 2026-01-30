const Package = require('../models/packagemodel'); 

const addPackage = async (req, res) => {
    try {
        console.log("Parsed Body:", req.body);
        console.log("Parsed File:", req.file);

        if (!req.body || !req.body.packageName) {
            return res.status(400).json({ 
                success: false, 
                message: "Form data not received. Check if frontend key matches 'packageImage'" 
            });
        }

        const { packageName, description, destination, price, durationDays, agentId } = req.body;
        const filename = req.file ? req.file.filename : null;

        if (!filename) {
            return res.status(400).json({ success: false, message: "Image upload failed" });
        }

        const newPackage = await Package.create({
            packageName,
            description,
            destination,
            price: parseFloat(price),
            durationDays: parseInt(durationDays),
            packageImage: filename,
            agentId: parseInt(agentId)
        });
        res.status(201).json({ success: true, message: "Package created!", data: newPackage });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ success: false, message: "Failed to create package", error: error.message });
    }
};

const getAgentPackages = async (req, res) => {
    try {
        const { agentId } = req.params;       
        const packages = await Package.findAll({ 
            where: { agentId: agentId } 
        });
        res.status(200).json({
            success: true,
            count: packages.length,
            packages: packages
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching packages", 
            error: error.message 
        });
    }
};

const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.findAll();
        res.status(200).json({ success: true, packages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching all packages" });
    }
};

const getPackageById = async (req, res) => {
    try {
        const id = req.params.uid; 
        
        // THIS CHECK: Prevent crash if ID is not a number
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid Package ID format" });
        }

        const packageData = await Package.findByPk(id);
        if (!packageData) {
            return res.status(404).json({ message: "Package not found" });
        }

        // Increment view count
        packageData.views = (packageData.views || 0) + 1;
        await packageData.save();

        res.json(packageData);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const pkg = await Package.findByPk(id);

        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        // 2. Prepare update object (Handling strings from FormData)
        const updateData = {
            packageName: req.body.packageName || pkg.packageName,
            description: req.body.description || pkg.description,
            destination: req.body.destination || pkg.destination,
        };

        // 3. Prevent NaN errors during conversion
        if (req.body.price) {
            const parsedPrice = parseFloat(req.body.price);
            if (!isNaN(parsedPrice)) updateData.price = parsedPrice;
        }

        if (req.body.durationDays) {
            const parsedDays = parseInt(req.body.durationDays);
            if (!isNaN(parsedDays)) updateData.durationDays = parsedDays;
        }

        // 4. Handle image update
        if (req.file) {
            updateData.packageImage = req.file.filename;
        }
        await pkg.update(updateData);
        return res.status(200).json({ 
            success: true, 
            message: "Package updated successfully", 
            data: pkg 
        });

    } catch (error) {
        console.error("CRITICAL BACKEND ERROR:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error during update", 
            error: error.message 
        });
    }
};

const deletePackage = async (req, res) => {
    try {
        const { id } = req.params; 
        const pkg = await Package.findByPk(id);
        if (!pkg) {
            return res.status(404).json({
              success:false,
              message: "Package not found",
            });
        }
          await pkg.destroy();
          return res.status(200).json({
            success:true,
            message: "Package deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting user",
            error: error.message,
        });
    }
};

module.exports = { 
    addPackage, 
    getAgentPackages, 
    getAllPackages ,
    getPackageById,
    updatePackage,
    deletePackage
};