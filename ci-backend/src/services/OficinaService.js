const { 
    OficinaRepository,
    VinculoAlunoOficinaRepository, 
    VinculoProfessorOficinaRepository,
    UsuarioRepository,
    ProfessorRepository,
    AlunoRepository
} = require('../repositories/index');
const sequelize = require('sequelize');
const { BusinessError } = require('../errors/BusinessError');
const { Professor, Aluno, Usuario } = require('../../models/index');

class OficinaService {
    constructor() {
        this.oficinaRepository = new OficinaRepository();
        this.vinculoAlunoOficinaRepository = new VinculoAlunoOficinaRepository();
        this.vinculoProfessorOficinaRepository = new VinculoProfessorOficinaRepository();
        this.usuarioRepository = new UsuarioRepository();
        this.professorRepository = new ProfessorRepository();
        this.alunoRepository = new AlunoRepository();
    }
    
    async find(filtros) {
        const where = {};
        const include = [];
        
        if(filtros.id) where.id = filtros.id;
        if(filtros.titulo) where.titulo = { [sequelize.Op.like]: `%${filtros.titulo}%` };
        if(filtros.tema) where.tema = { [sequelize.Op.like]: `%${filtros.tema}%` };
        if(filtros.professor_responsavel_id) where.professor_responsavel_id = filtros.professor_responsavel_id;

        if(filtros.professor_responsavel_nome) {
            where['$professor.nome$'] = { [sequelize.Op.like]: `%${filtros.professor_responsavel_nome}%` };
        }

        include.push({
            model: Professor,
            as: 'professor'
        });

        return await this.oficinaRepository.find(where, include);
    }

    async create(data) {
        try {
            return await this.oficinaRepository.create(data);
        } catch(error) {
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    professor_responsavel_id: "ID de professor não encontrado.",
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }

            throw error;
        }
    }

    async updateById(id, data) {
        try {
            const oficina = await this.oficinaRepository.find({ id: id });

            if(!oficina || oficina.length === 0) throw new BusinessError("ID não encontrado", 404);

            if(oficina[0].professor_responsavel_id != data.userId) throw new BusinessError("Professores podem alterar apenas as próprias oficinas.", 403);
            
            delete data.userId;
            return await this.oficinaRepository.updateById(id, data);
        } catch(error) {
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    professor_responsavel_id: "ID de professor não encontrado.",
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }

            throw error;
        }
    }

    async deleteById(userId, oficinaId) {
        try {
            const oficina = await this.oficinaRepository.find({ id: oficinaId });

            if(!oficina || oficina.length === 0) throw new BusinessError("ID não encontrado", 404);

            if(oficina[0].professor_responsavel_id != userId) throw new BusinessError("Professores podem deletar apenas as próprias oficinas.", 403);
            
            const deleted = await this.oficinaRepository.deleteById(oficinaId);

            return deleted;
        } catch(error) {
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    professor_responsavel_id: "ID de professor não encontrado.",
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }

            throw error;
        }
    }

    async toLinkProfessores(data) {
        try {
            const oficina = await this.oficinaRepository.find({ id: data.oficina_id });
            if(!oficina || oficina.length === 0) throw new BusinessError('ID de oficina não encontrado', 409);
            
            const professor = await this.professorRepository.find({ usuario_id: data.user.id });
            if(!professor || professor.length === 0) throw new BusinessError('ID de professor não encontrado', 409);

            if(oficina[0].professor_responsavel_id == professor[0].id) {
                throw new BusinessError("Este professor já é responsável por esta oficina, portanto não pode se inscrever como tutor.", 409);
            }

            const vinculo = await this.vinculoProfessorOficinaRepository.find({ 
                professor_id: professor[0].id,
                oficina_id: oficina[0].id
            });
            if(vinculo.length > 0) {
                throw new BusinessError("Este professor já é tutor desta oficina.", 409);
            } 

            return await this.vinculoProfessorOficinaRepository.create({ 
                professor_id: professor[0].id, 
                oficina_id: oficina[0].id 
            });
        } catch(error){
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    //professor_id: "ID de professor não encontrado.",
                    //oficina_id: "ID de oficina não encontrado."
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }
            
            throw error;
        }
    }

    async toUnlinkProfessores(data) {
        try {
            const oficina = await this.oficinaRepository.find({ id: data.oficina_id });
            if(!oficina || oficina.length === 0) throw new BusinessError('ID de oficina não encontrado', 409);
            
            const professor = await this.professorRepository.find({ usuario_id: data.user.id });
            if(!professor || professor.length === 0) throw new BusinessError('ID de professor não encontrado', 409);

            const vinculo = await this.vinculoProfessorOficinaRepository.find({ 
                professor_id: professor[0].id, 
                oficina_id: oficina[0].id 
            });
            if(!vinculo || vinculo.length == 0) throw new BusinessError('Vínculo não encontrado, portanto não foi possível apagá-lo.', 409);

            return await this.vinculoProfessorOficinaRepository.deleteById(vinculo[0].id);
        } catch(error){
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    //professor_id: "ID de professor não encontrado.",
                    //oficina_id: "ID de oficina não encontrado."
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }
            
            throw error;
        }
    }

    async toLinkAlunos(data) {
        try {
            const oficina = await this.oficinaRepository.find({ id: data.oficina_id });
            if(!oficina || oficina.length === 0) throw new BusinessError('ID de oficina não encontrado', 409);
            
            const aluno = await this.alunoRepository.find({ usuario_id: data.user.id });
            if(!aluno || aluno.length === 0) throw new BusinessError('ID de aluno não encontrado', 409);

            const vinculo = await this.vinculoAlunoOficinaRepository.find({ 
                aluno_id: aluno[0].id,
                oficina_id: oficina[0].id
            });
            if(vinculo.length > 0) {
                throw new BusinessError("Este aluno já é participante desta oficina.", 409);
            } 


            return await this.vinculoAlunoOficinaRepository.create({ 
                aluno_id: aluno[0].id, 
                oficina_id: oficina[0].id
            });
        } catch(error){
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    //oficina_id: "ID de oficina não encontrado."
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }
            
            throw error;
        }
    }

    async toUnlinkAlunos(data) {
        try {
            const oficina = await this.oficinaRepository.find({ id: data.oficina_id });
            if(!oficina || oficina.length === 0) throw new BusinessError('ID de oficina não encontrado', 409);
            
            const aluno = await this.alunoRepository.find({ usuario_id: data.user.id });
            if(!aluno || aluno.length === 0) throw new BusinessError('ID de aluno não encontrado', 409);

            const vinculo = await this.vinculoAlunoOficinaRepository.find({ 
                aluno_id: aluno[0].id, 
                oficina_id: oficina[0].id 
            });

            if(!vinculo || vinculo.length == 0) throw new BusinessError('Vínculo não encontrado, portanto não foi possível apagá-lo.', 409);

            return await this.vinculoAlunoOficinaRepository.deleteById(vinculo[0].id);
        } catch(error){
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    //oficina_id: "ID de oficina não encontrado."
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }
            
            throw error;
        }
    }

    async findTutores(filtros) {
        const where = {};
        
        if(filtros.oficina_id) where.oficina_id = filtros.oficina_id;

        if(filtros.usuario_id) {
            const professor = await this.professorRepository.find({ usuario_id: filtros.usuario_id });
            
            if(professor.length > 0) {
                where.professor_id = professor[0].id;
            } else {
                where.professor_id = 0
            }
        }

        const include = [
            {
                model: Professor,
                as: 'professor',
                attributes: ['nome'],
                include: [
                    {
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['id', 'email', 'tipo']
                    }
                ]
            }
        ];

        return await this.vinculoProfessorOficinaRepository.find(where, { include });
    }

    async findParticipantes(filtros) {
        const where = {};
        
        if(filtros.oficina_id) where.oficina_id = filtros.oficina_id;

        if(filtros.usuario_id) {
            const aluno = await this.alunoRepository.find({ usuario_id: filtros.usuario_id });
            
            if(aluno.length > 0) {
                where.aluno_id = aluno[0].id;
            } else {
                where.aluno_id = 0;
            }
        }

        const include = [
            {
                model: Aluno,
                as: 'aluno',
                attributes: ['nome', 'ra'],
                include: [
                    {
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['id', 'email', 'tipo']
                    }
                ]
            }
        ];

        return await this.vinculoAlunoOficinaRepository.find(where, { include });
    }
}

module.exports = { OficinaService };