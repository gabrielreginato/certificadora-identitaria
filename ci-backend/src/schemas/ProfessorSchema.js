const { z, email } = require('zod');

const ProfessorSchema = z.object({
    nome: z.string({
        error: (issue) => issue.input === undefined ? "O nome é obrigatório.": "O nome deve ser uma String."
    })
        .min(3, "O nome deve ter no mínimo 3 caracteres.")
        .max(100, "O nome deve ter no máximo 100 carateres.")
        .nonempty("O nome não deve ser nulo."),

    email: z.string({
        error: (issue) => issue.input === undefined ? "O e-mail é obrigatório.": "O e-mail deve ser uma String."
    })
        .email("Formato de e-mail inválido."),
}, {
    error: (issue) => {
        if(issue.input === undefined) return "O corpo da requisição (JSON) é obrigatório.";
    }
}); 

const UpdateProfessorSchema = ProfessorSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Pelo menos um campo deve ser preenchido para atualização."
    });

const SearchProfessorSchema = z.object({
    nome: z.string().optional(),
    email: z.string().optional(),
    page: z.string().regex(/^[0-9]+$/).transform(Number).optional()
});

module.exports = { ProfessorSchema, SearchProfessorSchema, UpdateProfessorSchema };