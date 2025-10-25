const express = require('express');
const {
  listPieces, getPiece, createPiece, updatePiece, deletePiece,
} = require('../controllers/pieceController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, listPieces);
router.get('/:id', authMiddleware, getPiece);
router.post('/', authMiddleware, adminOnly, createPiece);
router.put('/:id', authMiddleware, adminOnly, updatePiece);
router.delete('/:id', authMiddleware, adminOnly, deletePiece);

module.exports = router;