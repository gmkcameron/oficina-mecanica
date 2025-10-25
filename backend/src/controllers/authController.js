const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const isValid = await user.comparePassword(password);
  if (!isValid) return res.status(401).json({ message: 'Credenciais inválidas' });

  const token = generateToken({ id: user._id, role: user.role });
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = { login };