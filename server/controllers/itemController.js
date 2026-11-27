const Item = require('../models/Item');
const { uploadImageBuffer, deleteCloudinaryImage } = require('../config/cloudinary');

const createItem = async (req, res) => {
  try {
    const { type, title, description, location } = req.body;
    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const uploaded = await uploadImageBuffer(req.file.buffer);
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    const newItem = new Item({
      type,
      title,
      description,
      location,
      imageUrl,
      imagePublicId,
      postedBy: req.user.id,
    });

    await newItem.save();
    res.status(201).json({ message: 'Item posted', item: newItem });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: error.message || 'Failed to post item' });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item' });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy !== req.user.id) {
      return res.status(403).json({
        message: 'You can update only your own item',
      });
    }

    const updates = {
      type: req.body.type ?? item.type,
      title: req.body.title ?? item.title,
      description: req.body.description ?? item.description,
      location: req.body.location ?? item.location,
    };

    if (req.file) {
      const uploaded = await uploadImageBuffer(req.file.buffer);
      if (item.imagePublicId) {
        await deleteCloudinaryImage(item.imagePublicId).catch((err) =>
          console.error('Failed to remove old Cloudinary image:', err.message)
        );
      }
      updates.imageUrl = uploaded.secure_url;
      updates.imagePublicId = uploaded.public_id;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json({
      message: 'Item updated',
      item: updatedItem,
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: error.message || 'Failed to update item' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    if (item.postedBy !== req.user.id) {
      return res.status(403).json({
        message: 'You can delete only your own item',
      });
    }

    if (item.imagePublicId) {
      await deleteCloudinaryImage(item.imagePublicId).catch((err) =>
        console.error('Failed to delete Cloudinary image:', err.message)
      );
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Item deleted',
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
};

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem };
