const aluno1 = fetch('http://localhost:3000/usuarios/alunos/signin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nome: 'Aluno 1',
        email: 'aluno1@email.com',
        senha: '123123',
        ra: '123456'
    })
}).then(res => res.json())
.then(data => console.log(data))
.catch(e => console.error(e));

const aluno2 = fetch('http://localhost:3000/usuarios/alunos/signin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nome: 'Aluno 2',
        email: 'aluno2@email.com',
        senha: '123123',
        ra: '654321'
    })
}).then(res => res.json())
.then(data => console.log(data))
.catch(e => console.error(e));

const aluno3 = fetch('http://localhost:3000/usuarios/alunos/signin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nome: 'Aluno 3',
        email: 'aluno3@email.com',
        senha: '123123',
        ra: '987654'
    })
}).then(res => res.json())
.then(data => console.log(data))
.catch(e => console.error(e));




const professor1 = fetch('http://localhost:3000/usuarios/professores/signin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nome: 'Professor 1',
        email: 'professor1@email.com',
        senha: '123123',
    })
}).then(res => res.json())
.then(data => console.log(data))
.catch(e => console.error(e));

const professor2 = fetch('http://localhost:3000/usuarios/professores/signin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nome: 'Professor 2',
        email: 'professor2@email.com',
        senha: '123123',
    })
}).then(res => res.json())
.then(data => console.log(data))
.catch(e => console.error(e));

const professor3 = fetch('http://localhost:3000/usuarios/professores/signin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nome: 'Professor 3',
        email: 'professor3@email.com',
        senha: '123123',
    })
}).then(res => res.json())
.then(data => console.log(data))
.catch(e => console.error(e));