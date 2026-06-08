const { z, email } = require('zod');

const UsuarioLoginSchema = z.object({
    email: z.string({
        error: (issue) => issue.input === undefined ? "O e-mail é obrigatório.": "O e-mail deve ser uma String."
    })
        .email("Formato de e-mail inválido.")
        .max(100, "O e-mail deve ter no máximo 100 carateres."),

    senha: z.string({
        error: (issue) => issue.input === undefined ? "A senha é obrigatória.": "A senha deve ser uma String."
    })
        .max(100, "A senha deve ter no máximo 100 carateres.")
}, {
    error: (issue) => {
        if(issue.input === undefined) return "O corpo da requisição (JSON) é obrigatório.";
    }
});

const SearchUsuarioSchema = z.object({
    id: z.string().regex(/^[0-9]+$/).transform(Number).optional(),
});

/*const UpdateAlunoSchema = AlunoSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Pelo menos um campo deve ser preenchido para atualização."
    });

const SearchAlunoSchema = z.object({
    id: z.string().regex(/^[0-9]+$/).transform(Number).optional(),
    nome: z.string().optional(),
    ra: z.string().optional(),
    email: z.string().optional(),
    //page: z.string().regex(/^[0-9]+$/).transform(Number).optional()
});*/

module.exports = { UsuarioLoginSchema, SearchUsuarioSchema };