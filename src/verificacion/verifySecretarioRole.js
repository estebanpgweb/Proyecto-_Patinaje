const jwt = require('jsonwebtoken');

const verifySecretarioRole = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'secretario') {
      return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.', error });
  }
};

module.exports = verifySecretarioRole;
