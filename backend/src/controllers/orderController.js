const Order = require('../models/order');

async function listOrders(req, res) {
  const orders = await Order.find()
    .populate('client')
    .populate('pieces.piece');
  res.json(orders);
}

async function getOrder(req, res) {
  const order = await Order.findById(req.params.id)
    .populate('client')
    .populate('pieces.piece');
  if (!order) return res.status(404).json({ message: 'Ordem não encontrada' });
  res.json(order);
}

async function createOrder(req, res) {
  const order = await Order.create(req.body);
  res.status(201).json(order);
}

async function updateOrder(req, res) {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!order) return res.status(404).json({ message: 'Ordem não encontrada' });
  res.json(order);
}

async function deleteOrder(req, res) {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ message: 'Ordem não encontrada' });
  res.status(204).send();
}

module.exports = { listOrders, getOrder, createOrder, updateOrder, deleteOrder };