const { z } = require('zod');
const { BusinessError } = require('../errors/BusinessError');

const errorHandler = (error, req, res, next) => {
    if(error instanceof z.ZodError) {
        return res.status(400).json({
            message: "Dados de entrada inválidos.",
            errors: error.issues.map(err => ({
                field: err.path[0],
                message: err.message
            }))
        });
    }

    if(error instanceof BusinessError) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor."});
}

module.exports = { errorHandler };