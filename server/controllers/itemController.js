const Item = require('../models/Item');

const createItem = async (req, res) => {
  const { type, title, description, location } = req.body;
  const newItem = new Item({ type, title, description, location, postedBy: req.user.id });
  await newItem.save();
  res.json({ message: 'Item posted', item: newItem });
};

const getItems = async (req, res) => {
  const items = await Item.find();
  res.json(items);
};

const getItemById = async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.json(item);
};

const updateItem = async (req, res) => {

  const item = await Item.findById(req.params.id);

  if (item.postedBy !== req.user.id) {
    return res.status(403).json({
      message: 'You can update only your own item'
    });
  }

  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({
    message: 'Item updated',
    item: updatedItem
  });

};

const deleteItem = async (req, res) => {

  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.json({
      message: "Item not found"
    });
  }

  if (item.postedBy !== req.user.id) {
    return res.json({
      message: "You can delete only your own item"
    });
  }

  await Item.findByIdAndDelete(req.params.id);

  res.json({
    message: "Item deleted"
  });
};

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem };