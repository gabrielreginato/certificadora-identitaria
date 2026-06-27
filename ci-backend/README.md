# 📚 Documentação da API - Sistema de Oficinas

Esta API gerencia o ciclo de vida de oficinas acadêmicas, desde o cadastro de usuários até o vínculo de participação entre alunos, professores e oficinas.
## 🚀 Tecnologias Utilizadas

    - Node.js com Express;
    - Sequelize ORM (MySQL);
    - JWT para Autenticação;
    - Zod para Validação de Schemas.

## 🔐 Autenticação

A maioria dos endpoints (exceto as rotas _get_) requer um token JWT enviado via Header.

    Tipo: Bearer Token

    Header: Authorization: Bearer <seu_token>

## 🛠 Endpoints
1. Usuários

🆕 POST /usuarios/alunos/signin

Cria um novo usuário do tipo 'aluno'.

Body:
```
{
  "nome": "Aluno",
  "email": "aluno@email.com",
  "ra": "123456"
  "senha": "senha"
}
```

    Exemplo de Resposta: 201 Created
    
    {
        "message": "Aluno cadastrado com sucesso.",
        "data": {
            "id": 1,
            "email": "aluno@email.com",
            "tipo": "aluno",
            "updatedAt": "2026-05-09T18:04:26.479Z",
            "createdAt": "2026-05-09T18:04:26.479Z"
        }
    }



🆕 POST /usuarios/professores/signin

Cria um novo usuário do tipo 'professor'.

Body:
```
{
  "nome": "Professor",
  "email": "professor@email.com",
  "senha": "senha"
}
```

    Exemplo de Resposta: 201 Created
    
    {
        "message": "Professor cadastrado com sucesso.",
        "data": {
            "id": 2,
            "email": "professor@email.com",
            "tipo": "professor",
            "updatedAt": "2026-05-09T18:04:26.479Z",
            "createdAt": "2026-05-09T18:04:26.479Z"
        }
    }

👤 POST /usuarios/login

Obtém um _token_ de validação para um usuário existente.

Body:
```
{
  "email": "email@email.com",
  "senha": "senha"
}
```

    Exemplo de Resposta: 200 Ok
    
    {
    "message": "Login realizado com sucesso.",
    "usuario": {
        "id": 1,
        "email": "email@email.com",
        "tipo": "aluno",
        "createdAt": "2026-05-09T00:18:09.000Z",
        "updatedAt": "2026-05-09T00:18:09.000Z",
        "perfil_aluno": {
            "id": 1,
            "nome": "Aluno1",
            "ra": "123456",
            "usuario_id": 1,
            "createdAt": "2026-05-09T00:18:09.000Z",
            "updatedAt": "2026-05-09T00:18:09.000Z"
        },
        "perfil_professor": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidGlwbyI6ImFsdW5vIiwiaWF0IjoxNzc4MzUwMDM1LCJleHAiOjE3NzgzNTM2MzV9.uFPq7HYUssNL6HVE2tzRCPUr41OCRkWtq1r5YskZZgg"
}

📝 PUT /usuarios/alunos

Atualiza os dados de um aluno já existente. Restrito a Alunos.

Body:

Obs: Todos estes campos são opcionais. No entanto, pelo menos um campo deve ser enviado no JSON.

```
{
  "nome": "Aluno",
  "email": "aluno@email.com",
  "ra": "123456"
  "senha": "senha"
}
```
    Exemplo de Resposta: 201 Created

    {
        "message": "Aluno atualizado com sucesso.",
        "data": {
            "id": 1,
            "email": "aluno@email.com",
            "tipo": "aluno",
            "createdAt": "2026-05-09T15:39:22.000Z",
            "updatedAt": "2026-05-09T18:10:39.000Z",
            "perfil_aluno": {
                "id": 3,
                "nome": "Aluno",
                "ra": "123456",
                "usuario_id": 1,
                "createdAt": "2026-05-09T15:39:22.000Z",
                "updatedAt": "2026-05-09T18:10:39.000Z"
            },
            "perfil_professor": null
        }
    }

📝 PUT /usuarios/professores

Atualiza os dados de um professor já existente. Restrito a Professores.

Body:

Obs: Todos estes campos são opcionais. No entanto, pelo menos um campo deve ser enviado no JSON.

```
{
  "nome": "Professor",
  "email": "professor@email.com",
  "senha": "senha"
}
```

    Exemplo de Resposta: 201 Created

    {
        "message": "Professor atualizado com sucesso.",
        "data": {
            "id": 2,
            "email": "professor@email.com",
            "tipo": "professor",
            "createdAt": "2026-05-09T15:39:22.000Z",
            "updatedAt": "2026-05-09T18:10:39.000Z",
            "perfil_professor": {
                "id": 3,
                "nome": "Professor",
                "ra": "3245235",
                "usuario_id": 2,
                "createdAt": "2026-05-09T15:39:22.000Z",
                "updatedAt": "2026-05-09T18:10:39.000Z"
            },
            "perfil_aluno": null
        }
    }

🗑 DELETE /usuarios

Apaga a conta de um usuário existente.

    Exemplo de Resposta: 204 OK


2. Oficinas

🔍 GET /oficinas

Retorna uma lista de todas as oficinas cadastradas.

    Query Params (Opcionais): tema, titulo.

```
Exemplo de Resposta: 200 OK

[
    {
        "id": 2,
        "titulo": "Introdução ao Java",
        "descricao": "Introdução à logica de programação e POO com Java",
        "tema": "Default",
        "professor_responsavel_id": 5,
        "image_url": "https://imagem.png",
        "createdAt": "2026-05-24T21:04:55.000Z",
        "updatedAt": "2026-06-20T18:10:10.000Z",
        "professor": {
            "id": 5,
            "email": "professor2@email.com",
            "tipo": "professor",
            "perfil_professor": {
                "id": 2,
                "nome": "Professor2"
            }
        }
    }
]
```
🆕 POST /oficinas

Cria uma nova oficina. Restrito a Professores.

Body:
```
{
  "titulo": "React Avançado",
  "tema": "Frontend",
  "descricao": "Oficina focada em Hooks e Performance."
}
```

```
Exepemplo de resposta: 201 Created

{
    "message": "Oficina criada com sucesso.",
    "data": {
        "id": 4,
        "titulo": "Introdução ao C#",
        "tema": "Programação",
        "descricao": "Introdução à logica de programação e POO com C#",
        "professor_responsavel_id": "2",
        "updatedAt": "2026-05-09T18:53:29.213Z",
        "createdAt": "2026-05-09T18:53:29.213Z"
    }
}
```

📝 PUT /oficinas/:id

Atualiza um oficina existente. Restrito a Professores.

Body:

Obs: Todos estes campos são opcionais. No entanto, pelo menos um campo deve ser enviado no JSON.

```
{
  "titulo": "React Avançado",
  "tema": "Frontend",
  "descricao": "Oficina focada em Hooks e Performance."
}
```
```
Exemplo de Resposta: 201 Created 
{
    "message": "Oficina atualizada com sucesso."
}
```

🗑 DELETE /oficinas

Apaga uma oficina existente. Restrito a Professores.

    Query Param (Obrigatório): id (ID da oficina).

    Exemplo de Resposta: 204 No Content

📋 POST /oficinas/inscricao/alunos

Inscreve usuário como participante em uma oficina. Restrito a Alunos.

Body:
```
{
  "oficina_id": "1"
}
```
```
Exemplo de Resposta: 201 Created 
{
    "message": "Aluno inscrito com sucesso.",
    "data": [
        {
            "id": 1,
            "oficina_id": 1,
            "professor_id": 2,
            "createdAt": "2026-05-09T18:35:37.688Z",
            "updatedAt": "2026-05-09T18:35:37.688Z"
        }
    ]
}
```

📋 POST /oficinas/inscricao/professores

Inscreve usuário como tutor em uma oficina. Restrito a Professores.

Body:
```
{
  "oficina_id": "1"
}
```
```
Exemplo de Resposta: 201 Created 
{
    "message": "Professor inscrito com sucesso.",
    "data": [
        {
            "id": 3,
            "oficina_id": 1,
            "professor_id": 2,
            "createdAt": "2026-05-09T18:35:37.688Z",
            "updatedAt": "2026-05-09T18:35:37.688Z"
        }
    ]
}

```

🔍 GET /oficinas/tutores

Retorna uma lista de todos os vínculos tutor/oficina.

    Query Params (Opcionais): oficina_id, usuario_id.

```
Exemplo de Resposta: 200 OK

[
    {
        "id": 7,
        "oficina_id": 3,
        "professor_id": 3,
        "createdAt": "2026-05-09T14:52:22.000Z",
        "updatedAt": "2026-05-09T14:52:22.000Z",
        "professor": {
            "nome": "Professor3",
            "usuario": {
                "id": 3,
                "email": "professor3@email.com",
                "tipo": "professor"
            }
        }
    }
]
```

🔍 GET /oficinas/participantes

Retorna uma lista de todos os vínculos participante/oficina.

    Query Params (Opcionais): oficina_id, usuario_id.

```
Exemplo de Resposta: 200 OK

[
    {
        "id": 3,
        "oficina_id": 3,
        "aluno_id": 1,
        "createdAt": "2026-05-09T15:05:04.000Z",
        "updatedAt": "2026-05-09T15:05:04.000Z",
        "aluno": {
            "nome": "Aluno1",
            "ra": "123456",
            "usuario": {
                "id": 4,
                "email": "aluno1@email.com",
                "tipo": "aluno"
            }
        }
    }
]
```

🗑 DELETE /oficinas/inscricao/alunos

Apaga o vínculo de participante de usuário em uma oficina. Restrito a Alunos.

Body:
```
{
  "oficina_id": "1"
}
```
```
Exemplo de Resposta: 200 Ok
{
    "message": "Aluno desinscrito com sucesso.",
}
```

🗑 DELETE /oficinas/inscricao/professores

Apaga o vínculo de tutor de usuário em uma oficina. Restrito a Professores.

Body:
```
{
  "oficina_id": "1"
}
```
```
Exemplo de Resposta: 200 Ok

{
    "message": "Professor desinscrito com sucesso.",
}
```

3. Encontros

🗓 POST /encontros

Cria um novo encontro para um oficina. Restrito a Professores.

Body:
```
{
    "oficina_id": "3",
    "data_horario_inicio": "2026-05-23T19:00:00.000Z",
    "data_horario_fim": "2026-05-23T21:00:00.000Z"
}
```

```
Exemplo de Resposta: 201 Created

{
    "message": "Encontro criado com sucesso.",
    "data": {
        "id": 2,
        "oficina_id": "3",
        "data_horario_inicio": "2026-05-23T19:00:00.000Z",
        "data_horario_fim": "2026-05-23T21:00:00.000Z",
        "updatedAt": "2026-05-09T18:49:00.437Z",
        "createdAt": "2026-05-09T18:49:00.437Z"
    }
}
```

🔍 GET /encontros

Retorna uma lista de todos os encontros de oficinas cadastradas.

    Query Params (Opcionais): oficina_id, data_horario_inicio, data_horario_fim.


```
Exemplo de Resposta: 200 Ok

[
    {
        "id": 2,
        "oficina_id": 3,
        "data_horario_inicio": "2026-05-23T19:00:00.000Z",
        "data_horario_fim": "2026-05-23T21:00:00.000Z",
        "createdAt": "2026-05-09T18:49:00.000Z",
        "updatedAt": "2026-05-09T18:49:00.000Z"
    }
]
```


🔍 GET /oficinas/notificacoes

Retorna uma lista com todas as notificações do usuário autenticado.

```
Exemplo de Resposta: 200 Ok

[
    {
        "id": 7,
        "titulo": "Oficina Atualizada",
        "mensagem": "A oficina \"Introdução ao Python!\" teve seus detalhes alterados pelo professor. Confira as novidades!",
        "usuario_id": 4,
        "visto": true,
        "createdAt": "2026-06-20T17:53:01.000Z",
        "updatedAt": "2026-06-20T20:42:03.000Z",
        "usuario": {
            "id": 4,
            "email": "professor1@email.com"
        }
    },
    {
        "id": 11,
        "titulo": "Oficina Atualizada",
        "mensagem": "A oficina \"Introdução ao Python\" teve seus detalhes alterados pelo professor. Confira as novidades!",
        "usuario_id": 4,
        "visto": true,
        "createdAt": "2026-06-20T18:10:10.000Z",
        "updatedAt": "2026-06-20T21:26:50.000Z",
        "usuario": {
            "id": 4,
            "email": "professor1@email.com"
        }
    },
    {
        "id": 16,
        "titulo": "Encontro Agendado",
        "mensagem": "Um novo encontro de \"Introdução ao Python!\" foi agendado para 6",
        "usuario_id": 4,
        "visto": true,
        "createdAt": "2026-06-20T18:16:25.000Z",
        "updatedAt": "2026-06-20T21:26:50.000Z",
        "usuario": {
            "id": 4,
            "email": "professor1@email.com"
        }
    }
]
```

📋 POST /oficinas/notificacoes/check

Altera a coluna "visto" de notificações de usuários autenticados para __true__ com base nos IDs  enviados no body.

Body:
```
{
    "notificacoes": [7, 11, 16]
}
```

```
Exemplo de Resposta: 200 Ok
```

## ⚠️ Tratamento de Erros

A API utiliza códigos de status HTTP padronizados:

|Código|Descrição|Motivo Comum|
|------|------------|----------|
|200|OK|Sucesso na requisição.|
|201|Created|Recurso criado com sucesso (ex: novo usuário).|
|400|Bad Request|Dados inválidos enviados pelo cliente (Validação Zod).|
|401|Unauthorized|Token ausente, inválido ou expirado.|
|403|Forbidden|O usuário está logado, mas não tem permissão para a ação.|
|404|Not Found|O recurso solicitado não existe no banco de dados.|
|409|Conflict|Violação de regra (ex: e-mail ou RA já cadastrado).|

    
```
Exemplo de Resposta de Erro (400)

{
  "message": "Erro de validação.",
  "errors": [
    {
      "path": "titulo",
      "message": "O título deve ter no mínimo 3 caracteres."
    }
  ]
}
```

## Como executar

### Aplicações Necessárias

- Node.js
- MySql Server

### Passo a Passo

1. Após clonar a pasta __ci-backend__, crie um arquivo *__.env__* com as seguintes informações:
- DB_NAME=nome_do_banco
- DB_USER=seu_usuario
- DB_PWD=sua_senha
- DB_HOST=seu_host (ex: localhost)
- DB_PORT=porta_do_seu_mysql (padrão: 3306)
- DB_DIALECT=mysql
- DB_ENV=development

2. Instale as dependências necessárias:
- __npm install__

3. Execute os comandos do sequelize-cli para a criação de banco de dados e migração de tabelas:
- __npx sequelize-cli db:create__
- __npx sequelize-cli db:migrate__

4. Execute o projeto
- __npm start__

5. Com a API em execução, execute o seeder para criar usuários de exemplo:
- __node seed/seed.js__ <br>
professor1@email.com - 123123... <br>
aluno1@email.com - 123123...
