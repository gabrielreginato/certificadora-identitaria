const { z, email } = require('zod');

const EncontroSchema = z.object({
    oficina_id: z.string({
        error: (issue) => issue.input === undefined ? "Forneça um ID válido de oficina.": "O ID da oficina deve ser uma String."
    })
        .regex(/^[0-9]+$/, "O ID da oficina deve conter apenas números."),

    data_horario_inicio: z.coerce.date({
        errorMap: () => ({ message: "Data de início inválida ou ausente." }),
        error: (issue) => issue.input === undefined ? "Forneça uma data válida.": "A data deve estar no formato ISO 8601 (ex: 2026-04-22T19:00:00Z)"
    }),

    data_horario_fim: z.coerce.date({
        errorMap: () => ({ message: "Data de início inválida ou ausente." }),
        error: (issue) => issue.input === undefined ? "Forneça uma data válida.": "A data deve estar no formato ISO 8601 (ex: 2026-04-22T19:00:00Z)"
    }),

}, {
    error: (issue) => {
        if(issue.input === undefined) return "O corpo da requisição (JSON) é obrigatório.";
    }
}).refine((data) => data.data_horario_fim > data.data_horario_inicio, {
    message: "A data de término deve ser posterior à data de início.",
    path: ["data_horario_fim"]
});

module.exports = { EncontroSchema };