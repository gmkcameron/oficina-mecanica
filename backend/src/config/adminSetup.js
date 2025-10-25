const User = require('../models/user');

async function ensureAdminExists() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) return;

  const admin = new User({
    name: 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });

  await admin.save();
  console.log('Administrador padrão criado');
}

module.exports = { ensureAdminExists };