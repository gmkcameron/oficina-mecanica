const Client = require('../models/client');

async function listClients(req, res) {
  const clients = await Client.find();
  res.json(clients);
}

async function createClient(req, res) {
  const client = await Client.create(req.body);
  res.status(201).json(client);
}

async function updateClient(req, res) {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!client) return res.status(404).json({ message: 'Cliente não encontrado' });
  res.json(client);
}

async function deleteClient(req, res) {
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) return res.status(404).json({ message: 'Cliente não encontrado' });
  res.status(204).send();
}

module.exports = { listClients, createClient, updateClient, deleteClient };