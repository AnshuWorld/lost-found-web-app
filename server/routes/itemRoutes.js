const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { uploadSingleImage } = require('../middleware/uploadMiddleware');
const { createItem, getItems, getItemById, updateItem, deleteItem, markAsFound } = require('../controllers/itemController');

router.post('/', protect, uploadSingleImage, createItem);
router.get('/', getItems);
router.get('/:id', getItemById);
router.put('/:id', protect, uploadSingleImage, updateItem);
router.delete('/:id', protect, deleteItem);
router.patch('/:id/mark-found', protect, markAsFound);

module.exports = router;
