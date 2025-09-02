const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/authMiddleware')
const donationController = require('../controllers/donationsController');

// Public routes
router.get('/', donationController.getDonations);
router.get('/:id', donationController.getDonationById);
// User donates to a campaign
router.post('/:id/donate', authenticateToken,donationController.addDonation);


// Admin routes
router.post('/', donationController.createDonation);
router.put('/:id', donationController.updateDonation);
router.delete('/:id', donationController.deleteDonation);

module.exports = router;
