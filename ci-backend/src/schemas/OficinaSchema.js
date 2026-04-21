const { z, email } = require('zod');

const OficinaSchema = z.object({
    titulo: z.string({
        error: (issue) => issue.input === undefined ? "O título é obrigatório.": "O título deve ser uma String."
    })
        .min(3, "O título deve ter no mínimo 3 caracteres.")
        .max(100, "O título deve ter no máximo 100 carateres.")
        .nonempty("O título não deve ser nulo."),

    tema: z.string({
        error: (issue) => issue.input === undefined ? "O tema é obrigatório.": "O tema deve ser uma String."
    })
        .min(3, "O tema deve ter no mínimo 3 caracteres.")
        .max(100, "O tema deve ter no máximo 100 carateres.")
        .nonempty("O tema não deve ser nulo."),
    
    descricao: z.string({
        error: (issue) => issue.input === undefined ? "A descrição é obrigatória.": "A descrição deve ser uma String."
    })
        .min(3, "A descrição deve ter no mínimo 3 caracteres.")
        .max(255, "A descrição deve ter no máximo 255 carateres.")
        .nonempty("A descrição tema não deve ser nula."),
    professor_responsavel: z.string({
        error: (issue) => issue.input === undefined ? "É necessário fornecer o ID do professor responsável.": "O ID do professor responsável deve ser uma String."
    })
        .regex(/^[0-9]+$/, "O ID do professor responsável deve conter apenas números.")
}, {
    error: (issue) => {
        if(issue.input === undefined) return "O corpo da requisição (JSON) é obrigatório.";
    }
});

const UpdateOficinaSchema = OficinaSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Pelo menos um campo deve ser preenchido para atualização."
    });

const SearchOficinaSchema = z.object({
    titulo: z.string().optional(),
    tema: z.string().optional(),
    page: z.string().regex(/^[0-9]+$/).transform(Number).optional()
});

module.exports = { OficinaSchema, UpdateOficinaSchema, SearchOficinaSchema };