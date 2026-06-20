require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado, token inválido.' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch(error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Sessão expirada. Por favor, faça login novamente.' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token inválido ou assinatura incorreta.' });
        }

        return res.status(500).json({ message: "Erro interno do servidor."});
    }
};

module.exports = { authMiddleware };