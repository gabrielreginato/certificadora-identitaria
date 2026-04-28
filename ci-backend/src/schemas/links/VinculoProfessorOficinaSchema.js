const { z, email } = require('zod');

const VinculoProfessorOficinaSchema = z.object({
    oficina_id: z.string({
        error: (issue) => issue.input === undefined ? "Forneça um ID válido de oficina.": "O ID da oficina deve ser uma String."
    })
        .regex(/^[0-9]+$/, "O ID da oficina deve conter apenas números."),

    professor_id: z.string({
        error: (issue) => issue.input === undefined ? "Forneça um ID válido de professor.": "O ID do professor deve ser uma String."
    })
        .regex(/^[0-9]+$/, "O ID do professor deve conter apenas números."),
}, {
    error: (issue) => {
        if(issue.input === undefined) return "O corpo da requisição (JSON) é obrigatório.";
    }
});


const SearchVinculoProfessorOficinaSchema = z.object({
    id: z.string().regex(/^[0-9]+$/).transform(Number).optional(),
    oficina_id: z.string().regex(/^[0-9]+$/).transform(Number).optional(),
    professor_id: z.string().regex(/^[0-9]+$/).transform(Number).optional(),
    page: z.string().regex(/^[0-9]+$/).transform(Number).optional()
});

module.exports = { VinculoProfessorOficinaSchema, SearchVinculoProfessorOficinaSchema };