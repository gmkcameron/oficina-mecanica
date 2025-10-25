const express = require('express');
const {
  listOrders, getOrder, createOrder, updateOrder, deleteOrder,
} = require('../controllers/orderController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, listOrders);
router.get('/:id', authMiddleware, getOrder);
router.post('/', authMiddleware, adminOnly, createOrder);
router.put('/:id', authMiddleware, adminOnly, updateOrder);
router.delete('/:id', authMiddleware, adminOnly, deleteOrder);

module.exports = router;