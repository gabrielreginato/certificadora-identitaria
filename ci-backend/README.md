# Projeto - Certificadora de Competência Identitária - API Back-end

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