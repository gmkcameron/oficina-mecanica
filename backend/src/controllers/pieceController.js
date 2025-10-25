const Piece = require('../models/piece');

async function listPieces(req, res) {
  const pieces = await Piece.find();
  res.json(pieces);
}

async function getPiece(req, res) {
  const piece = await Piece.findById(req.params.id);
  if (!piece) return res.status(404).json({ message: 'Peça não encontrada' });
  res.json(piece);
}

async function createPiece(req, res) {
  const piece = await Piece.create(req.body);
  res.status(201).json(piece);
}

async function updatePiece(req, res) {
  const piece = await Piece.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!piece) return res.status(404).json({ message: 'Peça não encontrada' });
  res.json(piece);
}

async function deletePiece(req, res) {
  const piece = await Piece.findByIdAndDelete(req.params.id);
  if (!piece) return res.status(404).json({ message: 'Peça não encontrada' });
  res.status(204).send();
}

module.exports = { listPieces, getPiece, createPiece, updatePiece, deletePiece };