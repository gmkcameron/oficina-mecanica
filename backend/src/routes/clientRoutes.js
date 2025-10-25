const express = require('express');
const {
  listClients, createClient, updateClient, deleteClient,
} = require('../controllers/clientController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, adminOnly, listClients);
router.post('/', authMiddleware, adminOnly, createClient);
router.put('/:id', authMiddleware, adminOnly, updateClient);
router.delete('/:id', authMiddleware, adminOnly, deleteClient);

module.exports = router;