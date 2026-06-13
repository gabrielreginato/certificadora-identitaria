import { useState, useEffect } from "react";
import { Modal } from "../../header/modal/Modal";
import "../../style.css";
import { usePageContext } from "../../../contexts/MainContext";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";

export function OficinaDataModal({ isOpen, onClose, oficina }) {
  // Correção: Destruturando juntos para evitar múltiplas chamadas do contexto
  const { state, dispatch } = usePageContext();
  const { role, usuarioId } = state.accountData;

  const [vinculosTutores, setVinculosTutores] = useState([]);
  const [vinculosParticipantes, setVinculosParticipantes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tutores, setTutores] = useState([]);
  const [participantes, setParticipantes] = useState([]);

  useEffect(() => {
    if (!isOpen || !oficina?.id) return;

    async function carregarDadosModal() {
      setLoading(true);
      try {
        // 1. Busca os vínculos primeiro
        const [resVinculosTutores, resVinculosParticipantes] =
          await Promise.all([
            fetch(
              `http://localhost:3000/oficinas/tutores?oficina_id=${oficina.id}`,
            ).then((r) => r.json()),
            fetch(
              `http://localhost:3000/oficinas/participantes?oficina_id=${oficina.id}`,
            ).then((r) => r.json()),
          ]);

        const dadosTutores = resVinculosTutores || [];
        const dadosParticipantes = resVinculosParticipantes || [];

        // Atualiza os estados de vínculos
        setVinculosTutores(dadosTutores);
        setVinculosParticipantes(dadosParticipantes);

        // 2. CORREÇÃO: Usa as variáveis locais da resposta (dadosTutores/dadosParticipantes)
        // em vez de ler o estado do React que ainda não atualizou.
        const [resTutores, resParticipantes] = await Promise.all([
          dadosTutores.length > 0
            ? Promise.all(
                dadosTutores.map((vinculo) => {
                  return fetch(
                    `http://localhost:3000/usuarios?id=${vinculo.professor?.usuario?.id}`,
                  ).then((r) => r.json());
                }),
              )
            : [],
          dadosParticipantes.length > 0
            ? Promise.all(
                dadosParticipantes.map((vinculo) => {
                  return fetch(
                    `http://localhost:3000/usuarios?id=${vinculo.aluno?.usuario?.id}`,
                  ).then((r) => r.json());
                }),
              )
            : [],
        ]);

        // Trata os dados finais limpando possíveis arrays aninhados
        setTutores(resTutores.flat() || []);
        setParticipantes(resParticipantes.flat() || []);
      } catch (error) {
        console.error("Erro ao carregar dados do modal:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosModal();
  }, [isOpen, oficina?.id]); // Mantido limpo sem loops infinitos

  // Tratamento preventivo com Optional Chaining (?.) para evitar quebras se o dado falhar
  const hasLink =
    role === "aluno"
      ? vinculosParticipantes.some((p) => p.aluno?.usuario?.id == usuarioId)
      : oficina?.professor_responsavel_id == usuarioId ||
        vinculosTutores.some((t) => t.professor?.usuario?.id == usuarioId);

  return (
    <Modal isOpen={isOpen}>
      <div className="oficina-data-modal">
        <div className="modal-header">
          <h2>
            {oficina?.professor_responsavel_id == usuarioId && (
              <IconButton
                aria-label="edit"
                size="small"
                className="edit-button"
                onClick={() => {
                  dispatch({
                    type: "SET_IS_UPDATING",
                    payload: true,
                  });
                  dispatch({
                    type: "SET_SELECTED_OFICINA",
                    payload: oficina,
                  });

                  console.log(state.selectedOficina)
                  onClose();
                }}
              >
                <BorderColorIcon fontSize="inherit" />
              </IconButton>
            )}
            {oficina?.titulo}{" "}
          </h2>

          <IconButton
            aria-label="delete"
            size="small"
            className="close-button"
            onClick={onClose}
          >
            <CancelIcon fontSize="inherit" />
          </IconButton>
        </div>

        {/* Feedback visual de carregamento para o usuário */}
        {loading ? (
          <div className="modal-content">
            <p>Carregando dados...</p>
          </div>
        ) : (
          <div className="modal-body-scroll">
            <div className="modal-content">
              <p className="professor">
                Professor Responsável:{" "}
                {oficina?.professor?.perfil_professor?.nome}
              </p>
              <p>{oficina?.descricao}</p>

              <div className="tutores">
                <h3>
                  <span>Tutores </span>
                  {tutores.length > 0 && (
                    <span className="tutores-num">{tutores.length}</span>
                  )}
                </h3>
                {tutores.length > 0 ? (
                  <ul>
                    {tutores.map((tutor) => (
                      // Acessa a estrutura correta: perfil_professor -> nome
                      <li key={tutor.id}>
                        <p className="nome">
                          {tutor?.perfil_professor?.nome ||
                            "Professor sem nome"}
                        </p>{" "}
                        - {tutor?.email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhum tutor inscrito nesta oficina.</p>
                )}
              </div>

              <div className="participantes">
                <h3>
                  <span>Participantes </span>
                  {participantes.length > 0 && (
                    <span className="participantes-num">
                      {participantes.length}
                    </span>
                  )}
                </h3>
                {participantes.length > 0 ? (
                  <ul>
                    {participantes.map((participante) => (
                      // Acessa a estrutura correta: perfil_aluno -> nome
                      <li key={participante.id}>
                        <p className="nome">
                          {participante?.perfil_aluno?.nome || "Aluno sem nome"}
                        </p>{" "}
                        - {participante?.email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhum participante inscrito nesta oficina.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="modal-actions">
          {oficina?.professor_responsavel_id == usuarioId && (
            <Button
              className="card-button apagar"
              size="large"
              sx={{
                backgroundColor: "#ffe8e8",
                color: "#db0000",
                fontWeight: "500",
              }}
              onClick={() => {
                fetch(`http://localhost:3000/oficinas/${oficina.id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${state.accountData.token}`,
                  },
                }).then((res) => {
                  if ([200, 201, 204].includes(res.status)) {
                    dispatch({
                      type: "SET_HEADER_SNACKBAR",
                      payload: {
                        isOpen: true,
                        message: "Oficina apagada com sucesso!",
                      },
                    });
                    onClose();
                    setTimeout(() => window.location.reload(), 2000);
                  } else if (res.status == 401) {
                    dispatch({
                      type: "SET_HEADER_SNACKBAR",
                      payload: {
                        isOpen: true,
                        message:
                          "Sessão expirada, faça login e tente novamente!",
                      },
                    });

                    setTimeout(() => {
                      dispatch({
                        type: "SET_HEADER_SNACKBAR",
                        payload: { isOpen: false, message: "" },
                      });

                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      localStorage.removeItem("email");
                      localStorage.removeItem("name");
                      localStorage.removeItem("usuarioId");
                      localStorage.removeItem("perfilId");
                      localStorage.removeItem("ra");

                      dispatch({
                        type: "SET_ACCOUNT_DATA",
                        payload: {
                          token: null,
                          role: null,
                          name: null,
                          email: null,
                          usuarioId: null,
                          perfilId: null,
                          ra: null,
                        },
                      });

                      window.location.href = "/";
                    }, 2000);
                  }
                });
              }}
            >
              <span>Apagar Oficina</span>
            </Button>
          )}
          {hasLink && usuarioId != oficina?.professor_responsavel_id && (
            <Button
              className="card-button desinscrever"
              size="large"
              sx={{
                backgroundColor: "#ffe8e8",
                color: "#db0000",
                fontWeight: "500",
              }}
              onClick={() => {
                fetch(
                  `http://localhost:3000/oficinas/inscricao/${role == "professor" ? "professores" : "alunos"}`,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${state.accountData.token}`,
                    },
                    body: JSON.stringify({
                      oficina_id: String(oficina.id),
                    }),
                  },
                ).then((res) => {
                  if ([200, 201, 204].includes(res.status)) {
                    dispatch({
                      type: "SET_HEADER_SNACKBAR",
                      payload: {
                        isOpen: true,
                        message: "Desinscrição realizada com sucesso!",
                      },
                    });
                    onClose();
                    setTimeout(() => window.location.reload(), 2000);
                  } else if (res.status == 401) {
                    dispatch({
                      type: "SET_HEADER_SNACKBAR",
                      payload: {
                        isOpen: true,
                        message:
                          "Erro ao realizar desinscrição, faça login novamente!",
                      },
                    });

                    setTimeout(() => {
                      dispatch({
                        type: "SET_HEADER_SNACKBAR",
                        payload: { isOpen: false, message: "" },
                      });

                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      localStorage.removeItem("email");
                      localStorage.removeItem("name");
                      localStorage.removeItem("usuarioId");
                      localStorage.removeItem("perfilId");
                      localStorage.removeItem("ra");

                      dispatch({
                        type: "SET_ACCOUNT_DATA",
                        payload: {
                          token: null,
                          role: null,
                          name: null,
                          email: null,
                          usuarioId: null,
                          perfilId: null,
                          ra: null,
                        },
                      });

                      window.location.href = "/";
                    }, 2000);
                  }
                });
              }}
            >
              <span>Desinscrever-se</span>
            </Button>
          )}

          {!hasLink && (
            <Button
              className="card-button inscrever"
              size="large"
              sx={{
                backgroundColor: "#c5ffc5",
                color: "#008000",
                fontWeight: "500",
              }}
              onClick={() => {
                fetch(
                  `http://localhost:3000/oficinas/inscricao/${role == "professor" ? "professores" : "alunos"}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${state.accountData.token}`,
                    },
                    body: JSON.stringify({
                      oficina_id: String(oficina.id),
                    }),
                  },
                ).then((res) => {
                  if ([200, 201, 204].includes(res.status)) {
                    dispatch({
                      type: "SET_HEADER_SNACKBAR",
                      payload: {
                        isOpen: true,
                        message: "Inscrição realizada com sucesso!",
                      },
                    });
                    onClose();
                    setTimeout(() => window.location.reload(), 2000);
                  } else if (res.status == 401) {
                    dispatch({
                      type: "SET_HEADER_SNACKBAR",
                      payload: {
                        isOpen: true,
                        message:
                          "Sessão expirada, faça login e tente novamente!",
                      },
                    });

                    setTimeout(() => {
                      dispatch({
                        type: "SET_HEADER_SNACKBAR",
                        payload: { isOpen: false, message: "" },
                      });

                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      localStorage.removeItem("email");
                      localStorage.removeItem("name");
                      localStorage.removeItem("usuarioId");
                      localStorage.removeItem("perfilId");
                      localStorage.removeItem("ra");

                      dispatch({
                        type: "SET_ACCOUNT_DATA",
                        payload: {
                          token: null,
                          role: null,
                          name: null,
                          email: null,
                          usuarioId: null,
                          perfilId: null,
                          ra: null,
                        },
                      });

                      window.location.href = "/";
                    }, 2000);
                  }
                });
              }}
            >
              <span>Inscrever-se</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
