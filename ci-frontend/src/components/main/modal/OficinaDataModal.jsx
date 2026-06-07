import { useState, useEffect } from "react";
import { Modal } from "../../header/modal/Modal";
import "../../style.css";
import { usePageContext } from "../../../contexts/MainContext";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

export function OficinaDataModal({ isOpen, onClose, oficina }) {
  const { dispatch } = usePageContext();
  const { state } = usePageContext();

  const { role, usuarioId } = state.accountData;

  const [tutores, setTutores] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !oficina?.id) return;

    async function carregarDadosModal() {
      setLoading(true);
      try {
        const [resTutores, resParticipantes] = await Promise.all([
          fetch(
            `http://localhost:3000/oficinas/tutores?oficina_id=${oficina.id}`,
          ).then((r) => r.json()),
          fetch(
            `http://localhost:3000/oficinas/participantes?oficina_id=${oficina.id}`,
          ).then((r) => r.json()),
        ]);

        setTutores(resTutores || []);
        setParticipantes(resParticipantes || []);
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
      ? participantes.some((p) => p.aluno?.usuario?.id == usuarioId)
      : oficina?.professor_responsavel_id == usuarioId ||
        tutores.some((t) => t.professor?.usuario?.id == usuarioId);

  return (
    <Modal isOpen={isOpen}>
      <div className="oficina-data-modal">
        <div className="modal-header">
          <h2>{oficina?.titulo}</h2>

          <IconButton
            aria-label="delete"
            size="small"
            className="close-button"
            onClick={() => {
              onClose();
            }}
          >
            <CancelIcon fontSize="inherit" />
          </IconButton>
        </div>

        <div className="modal-content">
          <p className="professor">
            Professor Responsável: {oficina?.professor.perfil_professor.nome}
          </p>
          <p>{oficina?.descricao}</p>
        </div>

        <div className="modal-actions">
          {hasLink && usuarioId != oficina.professor_responsavel_id && (
            <Button
              className="card-button desinscrever"
              size="large"
              sx={{
                backgroundColor: '#ffe8e8',
                color: '#db0000',
                fontWeight: 'bold',
                fontWeight: '500'
              }}
              onClick={() => {}}
            >
              <span>Desinscrever-se</span>
            </Button>
          )}

          {!hasLink && (
            <Button
              className="card-button inscrever"
              size="large"
              sx={{
                backgroundColor: '#c5ffc5',
                color: '#008000',
                fontWeight: '500'
              }}
              onClick={() => {}}
            >
              <span>Inscrever-se</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
