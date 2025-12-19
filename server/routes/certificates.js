const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getCertificateContract } = require('../config/blockchain');
const { sendCertificateNotification } = require('../utils/whatsapp');

// Configure multer for certificate file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/certificates');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cert-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|png|jpg|jpeg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, PNG, and JPG files are allowed'));
  }
});

// @route   POST /api/certificates
// @desc    Issue a certificate
// @access  Private (club_admin, college_admin, faculty)
router.post('/', authMiddleware, roleMiddleware('club_admin', 'college_admin', 'faculty'), upload.single('certificateFile'), async (req, res) => {
  try {
    const {
      title,
      description,
      recipient,
      event,
      certificateType,
      metadata
    } = req.body;

    // Get recipient details
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    // Create certificate in database
    const certificateData = {
      title,
      description,
      recipient,
      event,
      issuer: req.user.id,
      certificateType,
      metadata
    };

    // Add file information if uploaded
    if (req.file) {
      certificateData.certificateFile = `/uploads/certificates/${req.file.filename}`;
      certificateData.fileType = path.extname(req.file.originalname).substring(1).toLowerCase();
    }

    const certificate = new Certificate(certificateData);

    await certificate.save();

    // Mint certificate on blockchain
    try {
      const certificateContract = getCertificateContract();
      if (certificateContract) {
        const tx = await certificateContract.issueCertificate(
          recipientUser.blockchainId,
          title,
          description,
          certificateType
        );
        const receipt = await tx.wait();

        // Get token ID from event logs
        const tokenId = receipt.logs[0].topics[3];

        certificate.blockchainTxHash = tx.hash;
        certificate.blockchainTokenId = parseInt(tokenId, 16);
        certificate.verificationUrl = `${process.env.FRONTEND_URL}/verify/certificate/${certificate._id}`;
        await certificate.save();
      } else {
        console.log('Certificate contract not deployed - stored in database only');
        certificate.verificationUrl = `${process.env.FRONTEND_URL}/verify/certificate/${certificate._id}`;
        await certificate.save();
      }

      console.log('Certificate minted on blockchain:', tx.hash);
    } catch (blockchainError) {
      console.error('Blockchain minting error:', blockchainError);
      // Continue with certificate creation even if blockchain fails
    }

    // Add certificate to user
    await User.findByIdAndUpdate(recipient, {
      $push: { certificates: certificate._id }
    });

    // Send WhatsApp notification
    await sendCertificateNotification(
      recipientUser.phone,
      title,
      certificate.verificationUrl
    );

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      certificate
    });
  } catch (error) {
    console.error('Issue certificate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/certificates
// @desc    Get certificates (filtered by user)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'student') {
      filter.recipient = req.user.id;
    } else if (req.query.recipient) {
      filter.recipient = req.query.recipient;
    }

    const certificates = await Certificate.find(filter)
      .populate('recipient', 'name email blockchainId')
      .populate('issuer', 'name email')
      .populate('event', 'title')
      .sort({ issuedDate: -1 });

    res.json({ success: true, certificates });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID
// @access  Public (for verification)
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('recipient', 'name email blockchainId')
      .populate('issuer', 'name email')
      .populate('event', 'title startDate');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({ success: true, certificate });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/certificates/verify/:id
// @desc    Verify certificate authenticity
// @access  Public
router.get('/verify/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('recipient', 'name blockchainId')
      .populate('issuer', 'name');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
        verified: false
      });
    }

    // Verify on blockchain if available
    let blockchainVerified = false;
    if (certificate.blockchainTxHash && certificate.blockchainTokenId) {
      try {
        const certificateContract = getCertificateContract();
        const onChainData = await certificateContract.getCertificate(certificate.blockchainTokenId);
        blockchainVerified = onChainData.isValid;
      } catch (error) {
        console.error('Blockchain verification error:', error);
      }
    }

    res.json({
      success: true,
      verified: true,
      blockchainVerified,
      certificate: {
        title: certificate.title,
        recipient: certificate.recipient.name,
        issuedDate: certificate.issuedDate,
        issuer: certificate.issuer.name,
        blockchainTxHash: certificate.blockchainTxHash
      }
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/certificates/claim/:id
// @desc    Mark certificate as claimed
// @access  Private
router.put('/claim/:id', authMiddleware, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Ensure the user owns the certificate
    if (certificate.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    certificate.isClaimed = true;
    await certificate.save();

    res.json({ success: true, message: 'Certificate claimed successfully', certificate });
  } catch (error) {
    console.error('Claim certificate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
