const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  pieces: [{
    piece: { type: mongoose.Schema.Types.ObjectId, ref: 'Piece', required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],
  description: { type: String },
  status: { type: String, enum: ['aberta', 'em_andamento', 'concluida'], default: 'aberta' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

OrderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);