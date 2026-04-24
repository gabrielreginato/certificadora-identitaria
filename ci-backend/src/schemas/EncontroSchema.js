const { z, email } = require('zod');

const EncontroSchema = z.object({
    oficina_id: z.string({
        error: (issue) => issue.input === undefined ? "Forneça um ID válido de oficina.": "O ID da oficina deve ser uma String."
    })
        .regex(/^[0-9]+$/, "O ID da oficina deve conter apenas números."),

    data_horario_inicio: z.string({
        error: (issue) => issue.input === undefined ? "Forneça uma data válida.": "A data deve ser uma String."
    })
        .datetime({ message: "A data deve estar no formato ISO 8601 (String)" })
        .transform((val) => new Date(val)),

    data_horario_fim: z.string({
        error: (issue) => issue.input === undefined ? "Forneça uma data válida.": "A data deve ser uma String."
    })
        .datetime({ message: "A data deve estar no formato ISO 8601 (String)" })
        .transform((val) => new Date(val)),

}, {
    error: (issue) => {
        if(issue.input === undefined) return "O corpo da requisição (JSON) é obrigatório.";
    }
});

const UpdateEncontroSchema = EncontroSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Pelo menos um campo deve ser preenchido para atualização."
    });

const SearchEncontroSchema = z.object({
    id: z.string().regex(/^[0-9]+$/).transform(Number).optional(),
    data_horario_inicio: z.string().optional(),
    data_horario_fim: z.string().optional(),
    oficina_titulo: z.string().optional(),
    oficina_id: z.string().regex(/^[0-9]+$/).transform(Number).optional(),
    page: z.string().regex(/^[0-9]+$/).transform(Number).optional()
});

module.exports = { EncontroSchema, UpdateEncontroSchema, SearchEncontroSchema };