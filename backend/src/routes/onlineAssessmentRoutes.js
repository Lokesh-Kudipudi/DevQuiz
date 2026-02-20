const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createOA,
    getOA,
    startOA,
    submitSection,
    endOA,
    getOAResults,
    deleteOA
} = require('../controllers/onlineAssessmentController');

router.post('/generate-and-create', protect, createOA);
router.get('/:id', protect, getOA);
router.post('/:id/start', protect, startOA);
router.post('/:id/submit-section', protect, submitSection);
router.put('/:id/end', protect, endOA);
router.get('/:id/results', protect, getOAResults);
router.delete('/:id', protect, deleteOA);

module.exports = router;
