import { useState, useEffect } from "react";
import { Modal } from "../../header/modal/Modal";
import "../../style.css";
import { usePageContext } from "../../../contexts/MainContext";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import { ConfirmationModal  } from "./ConfirmationModal";

export function OficinaDataModal({ isOpen, onClose, oficina }) {
  const { state, dispatch } = usePageContext();
  const { role, usuarioId } = state.accountData;

  const [vinculosTutores, setVinculosTutores] = useState([]);
  const [vinculosParticipantes, setVinculosParticipantes] = useState([]);
  const [encontros, setEncontros] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tutores, setTutores] = useState([]);
  const [participantes, setParticipantes] = useState([]);

  // ESTADO PARA CONTROLAR A CONFIRMAÇÃO
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Função auxiliar para abrir o aviso de confirmação
  const handleOpenConfirm = (title, message, action) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        action();
        setConfirmConfig((prev) => ({ ...prev, isOpen: false })); // fecha o de confirmação
      },
    });
  };

  useEffect(() => {
    if (!isOpen || !oficina?.id) return;

    async function carregarDadosModal() {
      setLoading(true);
      try {
        const [resVinculosTutores, resVinculosParticipantes, resEcontros] =
          await Promise.all([
            fetch(
              `http://localhost:3000/oficinas/tutores?oficina_id=${oficina.id}`,
            ).then((r) => r.json()),
            fetch(
              `http://localhost:3000/oficinas/participantes?oficina_id=${oficina.id}`,
            ).then((r) => r.json()),
            fetch(`http://localhost:3000/encontros?oficina_id=${oficina.id}`)
              .then((r) => r.json())
              .then((encontros) => {
                const encontrosOrdenados = encontros.sort((a, b) => {
                  return (
                    new Date(a.data_horario_inicio) -
                    new Date(b.data_horario_inicio)
                  );
                });

                return encontrosOrdenados.map((encontro) => {
                  const beginTimestamp = encontro.data_horario_inicio;
                  const endTimestamp = encontro.data_horario_fim;

                  const dataFormatada = new Intl.DateTimeFormat("pt-BR").format(
                    new Date(beginTimestamp),
                  );

                  const horaFormatada = new Intl.DateTimeFormat("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(beginTimestamp));

                  const horaFimFormatada = new Intl.DateTimeFormat("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(endTimestamp));

                  return {
                    ...encontro,
                    data: dataFormatada,
                    hora: horaFormatada,
                    horaFim: horaFimFormatada,
                  };
                });
              }),
          ]);

        const dadosTutores = resVinculosTutores || [];
        const dadosParticipantes = resVinculosParticipantes || [];
        const dadosEncontros = resEcontros || [];

        setEncontros(dadosEncontros);
        setVinculosTutores(dadosTutores);
        setVinculosParticipantes(dadosParticipantes);

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

        setTutores(resTutores.flat() || []);
        setParticipantes(resParticipantes.flat() || []);
      } catch (error) {
        console.error("Erro ao carregar dados do modal:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosModal();
  }, [isOpen, oficina?.id]);

  const hasLink =
    role === "aluno"
      ? vinculosParticipantes.some((p) => p.aluno?.usuario?.id == usuarioId)
      : oficina?.professor_responsavel_id == usuarioId ||
        vinculosTutores.some((t) => t.professor?.usuario?.id == usuarioId);

  // FUNÇÕES ISOLADAS DE REQUISIÇÃO (Para deixar o HTML limpo)
  const handleDeletarEncontro = (encontroId) => {
    fetch(`http://localhost:3000/encontros/${encontroId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.accountData.token}`,
      },
    }).then((res) => {
      if ([200, 201, 204].includes(res.status)) {
        dispatch({
          type: "SET_HEADER_SNACKBAR",
          payload: { isOpen: true, message: "Encontro desmarcado com sucesso!" },
        });
        onClose();
        setTimeout(() => window.location.reload(), 2000);
      } else if (res.status == 401) {
         handleSessionExpired();
      }
    });
  };

  const handleApagarOficina = () => {
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
          payload: { isOpen: true, message: "Oficina apagada com sucesso!" },
        });
        onClose();
        setTimeout(() => window.location.reload(), 2000);
      } else if (res.status == 401) {
        handleSessionExpired();
      }
    });
  };

  const handleDesinscrever = () => {
    fetch(`http://localhost:3000/oficinas/inscricao/${role == "professor" ? "professores" : "alunos"}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.accountData.token}`,
      },
      body: JSON.stringify({ oficina_id: String(oficina.id) }),
    }).then((res) => {
      if ([200, 201, 204].includes(res.status)) {
        dispatch({
          type: "SET_HEADER_SNACKBAR",
          payload: { isOpen: true, message: "Desinscrição realizada com sucesso!" },
        });
        onClose();
        setTimeout(() => window.location.reload(), 2000);
      } else if (res.status == 401) {
        handleSessionExpired();
      }
    });
  };

  const handleSessionExpired = () => {
    onClose();
    dispatch({
      type: "SET_HEADER_SNACKBAR",
      payload: { isOpen: true, message: "Sessão expirada, faça login novamente!" },
    });
    setTimeout(() => {
      dispatch({ type: "SET_HEADER_SNACKBAR", payload: { isOpen: false, message: "" } });
      localStorage.clear();
      dispatch({
        type: "SET_ACCOUNT_DATA",
        payload: { token: null, role: null, name: null, email: null, usuarioId: null, perfilId: null, ra: null },
      });
      window.location.href = "/";
    }, 2000);
  };

  return (
    <>
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
                    dispatch({ type: "SET_SELECTED_OFICINA", payload: oficina });
                    dispatch({ type: "SET_IS_UPDATING", payload: true });
                    onClose();
                  }}
                >
                  <BorderColorIcon fontSize="inherit" />
                </IconButton>
              )}
              {oficina?.titulo}{" "}
            </h2>

            <IconButton aria-label="delete" size="small" className="close-button" onClick={onClose}>
              <CancelIcon fontSize="inherit" />
            </IconButton>
          </div>

          {loading ? (
            <div className="modal-content">
              <p>Carregando dados...</p>
            </div>
          ) : (
            <div className="modal-body-scroll">
              <div className="modal-content">
                <p className="professor">
                  Professor Responsável: {oficina?.professor?.perfil_professor?.nome}
                </p>
                <p>{oficina?.descricao}</p>

                {/* TUTORES */}
                <div className="tutores">
                  <h3>
                    <span>Tutores </span>
                    {tutores.length > 0 && <span className="tutores-num">{tutores.length}</span>}
                  </h3>
                  {tutores.length > 0 ? (
                    <ul>
                      {tutores.map((tutor) => (
                        <li key={tutor.id}>
                          <p className="nome">{tutor?.perfil_professor?.nome || "Professor sem nome"}</p> - {tutor?.email}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhum tutor inscrito nesta oficina.</p>
                  )}
                </div>

                {/* PARTICIPANTES */}
                <div className="participantes">
                  <h3>
                    <span>Participantes </span>
                    {participantes.length > 0 && <span className="participantes-num">{participantes.length}</span>}
                  </h3>
                  {participantes.length > 0 ? (
                    <ul>
                      {participantes.map((participante) => (
                        <li key={participante.id}>
                          <p className="nome">{participante?.perfil_aluno?.nome || "Aluno sem nome"}</p>
                          {" - "}{participante?.perfil_aluno?.ra}
                          {" - "}{participante?.email}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhum participante inscrito nesta oficina.</p>
                  )}
                </div>

                {/* ENCONTROS */}
                <div className="encontros">
                  <h3>
                    <div>
                      {oficina?.professor_responsavel_id == usuarioId ? (
                        <>
                          <IconButton
                            className="add-encontro-button"
                            onClick={() => {
                              dispatch({ type: "SET_SELECTED_OFICINA", payload: oficina });
                              dispatch({ type: "SET_IS_SCHEDULING", payload: true });
                              onClose();
                            }}
                          >
                            <EditCalendarIcon />
                          </IconButton>
                          <span className="tipo1">Encontros Agendados</span>
                        </>
                      ) : (
                        <span>Encontros Agendados</span>
                      )}
                    </div>
                    {encontros.length > 0 && <span className="encontros-num">{encontros.length}</span>}
                  </h3>

                  {encontros.length > 0 ? (
                    <ul>
                      {encontros.map((encontro) => (
                        <li key={encontro.id}>
                          {oficina?.professor_responsavel_id == usuarioId && (
                            <IconButton
                              className="delete-encontro-button"
                              sx={{ backgroundColor: "#FFE8E8", color: "#DB0000" }}
                              // MODIFICADO: CONFIRMAÇÃO DE ENCONTRO
                              onClick={() => handleOpenConfirm(
                                "Desmarcar Encontro",
                                `Tem certeza que deseja desmarcar o encontro do dia ${encontro.data}?`,
                                () => handleDeletarEncontro(encontro.id)
                              )}
                            >
                              <EventBusyIcon />
                            </IconButton>
                          )}
                          <p className="data-hora">
                            <span className="encontro-data-with-margin">{encontro?.data}</span>
                            <span className="encontro-inicio-hora">{encontro?.hora}</span>
                            {" - "}
                            <span className="encontro-fim-hora">{encontro?.horaFim}</span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhum encontro agendado nesta oficina.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AÇÕES DO MODAL (BOTÕES INFERIORES) */}
          <div className="modal-actions">
            {oficina?.professor_responsavel_id == usuarioId && (
              <Button
                className="card-button apagar"
                size="large"
                sx={{ backgroundColor: "#ffe8e8", color: "#db0000", fontWeight: "500" }}
                // MODIFICADO: CONFIRMAÇÃO DE APAGAR OFICINA
                onClick={() => handleOpenConfirm(
                  "Apagar Oficina",
                  "Esta ação é permanente. Tem certeza que deseja apagar esta oficina e remover todos os vínculos?",
                  handleApagarOficina
                )}
              >
                <span>Apagar Oficina</span>
              </Button>
            )}

            {hasLink && usuarioId != oficina?.professor_responsavel_id && (
              <Button
                className="card-button desinscrever"
                size="large"
                sx={{ backgroundColor: "#ffe8e8", color: "#db0000", fontWeight: "500" }}
                // MODIFICADO: CONFIRMAÇÃO DE DESINSCREVER
                onClick={() => handleOpenConfirm(
                  "Sair da Oficina",
                  "Tem certeza que deseja cancelar sua inscrição nesta oficina?",
                  handleDesinscrever
                )}
              >
                <span>Desinscrever-se</span>
              </Button>
            )}

            {!hasLink && (
              <Button
                className="card-button inscrever"
                size="large"
                sx={{ backgroundColor: "#c5ffc5", color: "#008000", fontWeight: "500" }}
                onClick={() => {
                  fetch(`http://localhost:3000/oficinas/inscricao/${role == "professor" ? "professores" : "alunos"}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${state.accountData.token}`,
                    },
                    body: JSON.stringify({ oficina_id: String(oficina.id) }),
                  }).then((res) => {
                    if ([200, 201, 204].includes(res.status)) {
                      dispatch({
                        type: "SET_HEADER_SNACKBAR",
                        payload: { isOpen: true, message: "Inscrição realizada com sucesso!" },
                      });
                      onClose();
                      setTimeout(() => window.location.reload(), 2000);
                    } else if (res.status == 401) {
                      handleSessionExpired();
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

      {/* COMPONENTE DE CONFIRMAÇÃO RENDERIZADO FORA DO MODAL PRINCIPAL */}
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}