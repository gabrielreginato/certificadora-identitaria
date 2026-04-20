const { Aluno } = require('../../models/Aluno');
const { Professor } = require('../../models/Professor');

const entities = [Aluno, Professor];

//Ex: EmailDuplicatesCheck([Aluno, Professor]);
async function verifyEmailDuplicate(email) {
    for(const entity of entities) {
        const found = await entity.findOne({ where: { email: email } });

        if(found) {
            return true;
        }
    }

    return false;
}

module.exports = { verifyEmailDuplicate };