const { z } = require('zod');

/*const IdentifierSchema = z.object({
    id: z.int({
        error: (issue) => issue.input === undefined ? "Insira um ID.": "O ID deve ser um inteiro."
    })
});*/

const IdentifierSchema = z.object({
    id: z.string()
        .regex(/^[0-9]+$/, "O ID deve conter apenas números.")
        .transform((val) => parseInt(val, 10))
});

module.exports = { IdentifierSchema };