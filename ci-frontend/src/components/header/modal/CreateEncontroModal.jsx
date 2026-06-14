import { useState } from "react";
import { Modal } from "./Modal";
import "../../style.css";
import { usePageContext } from "../../../contexts/MainContext";
import { useHeaderSnackbar } from "../HeaderSnackbar";

import placeholderImage from "../../../assets/placeholder.png";

export function CreateEncontroModal({ isOpen, onClose, onPost }) {
  const { dispatch } = usePageContext();
  const { state } = usePageContext();
  const [dataValue, setDataValue] = useState("");
  const [horaInicioValue, setHoraInicioValue] = useState("");
  const [horaFimValue, setHoraFimValue] = useState("");
  const [failMessage, setFailMessage] = useState("");

  const { showMessage } = useHeaderSnackbar();

  return (
    <Modal className="create-oficina-modal" isOpen={isOpen}>
      <h2>{state.selectedOficina?.titulo || ""}</h2>
      <div className="modal-fields">
        <div className="data-field">
          <h3>Data</h3>
          <input
            type="date"
            value={dataValue}
            onChange={(e) => {
              setDataValue(e.target.value);
            }}
          />
        </div>

        <div className="hora-field">
          <h3>Hora de Início</h3>
          <input
            type="time"
            value={horaInicioValue}
            onChange={(e) => {
              setHoraInicioValue(e.target.value);
            }}
          />
        </div>

        <div className="hora-field">
          <h3>Hora de Encerramento</h3>
          <input
            type="time"
            value={horaFimValue}
            onChange={(e) => {
              setHoraFimValue(e.target.value);
            }}
          />
        </div>
      </div>

      {failMessage != "" && <p className="fail-message">{failMessage}</p>}
      <div className="modal-buttons">
        <button
          onClick={() => {
            onClose();
            setFailMessage("");
            setEmailValue("");
            setPassValue("");
          }}
          className="cancel-button"
        >
          Cancelar
        </button>

        <button
          onClick={() => {
            const dataHorarioInicio = `${dataValue}T${horaInicioValue}:00.00Z`;
            const dataHorarioFim = `${dataValue}T${horaFimValue}:00.00Z`;
            
            onPost({
              oficina_id: `${state.selectedOficina.id}`,
              data_horario_inicio: dataHorarioInicio,
              data_horario_fim: dataHorarioFim
            }, state.accountData.token).then((res) => {
              if ([200, 201, 204].includes(res.status)) {
                dispatch({
                  type: "SET_HEADER_SNACKBAR",
                  payload: {
                    isOpen: true,
                    message: "Encontro agendado com sucesso!",
                  },
                });
                onClose();
                setTimeout(() => window.location.reload(), 2000);
              } else if (res.status == 401) {
                console.log(res)

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

                  //window.location.href = "/";
                }, 2000);
              } else if (res.status == 400) {
                res.json().then(r => console.log(r))
              }
            });
          }}
          className="login-button"
        >
          Agendar Encontro
        </button>
      </div>
    </Modal>
  );
}
