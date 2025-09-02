const Donation = require('../model/donations');

// Get all donations
exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.find();
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single donation by ID
// exports.getDonationById = async (req, res) => {
//     try {
//         const donation = await Donation.findById(req.params.id);
//         if (!donation) return res.status(404).json({ message: 'Donation not found' });
//         res.status(200).json(donation);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// Get donation details and log by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).select('title description targetAmount currentAmount donations').populate('donations.userId', 'username');;
    console.log(donation)
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching donation details' });
  }
};




// Create a donation (Admin)
exports.createDonation = async (req, res) => {
    try {
        const donation = new Donation(req.body);
        await donation.save();
        res.status(201).json(donation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a donation (Admin)
exports.updateDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!donation) return res.status(404).json({ message: 'Donation not found' });
        res.status(200).json(donation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a donation (Admin)
exports.deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) return res.status(404).json({ message: 'Donation not found' });
        res.status(200).json({ message: 'Donation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add donation to a campaign
exports.addDonation = async (req, res) => {
    const { amount } = req.body;
    console.log(req)

    try {
        const donation = await Donation.findById(req.params.id);

        if (!donation) return res.status(404).json({ message: 'Donation campaign not found' });

        // Update campaign total
        donation.currentAmount += amount;

        // Save individual donation record with user ID from JWT
        donation.donations.push({ userId:req.user.id, amount });

        await donation.save();
        res.status(200).json({ message: 'Donation successful', donation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

