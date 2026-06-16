import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import "../../style.css";
import { usePageContext } from "../../../contexts/MainContext";
import { useHeaderSnackbar } from "../HeaderSnackbar";

import placeholderImage from "../../../assets/placeholder.png";

export function CreateEncontroModal({ isOpen, onClose, onPost }) {
  const { dispatch } = usePageContext();
  const { state } = usePageContext();
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  const [dataError, setDataError] = useState("");
  const [horaError, setHoraError] = useState("");

  const { showMessage } = useHeaderSnackbar();

  useEffect(() => {
    if (data != "") setDataError("");
    if (horaInicio != "") setHoraError("");
    if (horaFim != "") setHoraError("");
  }, [data, horaInicio, horaFim]);

  return (
    <Modal className="create-encontro-modal" isOpen={isOpen}>
      <h2>{state.selectedOficina?.titulo || ""}</h2>
      <div className="modal-fields">
        <div className="data-field">
          <h3>Data</h3>
          <input
            type="date"
            placeholder="Data"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
            }}
          />
          <p className="create-encontro-error">
            {dataError != "" ? dataError : ""}
          </p>
        </div>

        <div className="hora-field">
          <h3>Hora de Início</h3>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => {
              setHoraInicio(e.target.value);
            }}
          />
          <p className="create-encontro-error">
            {horaError != "" ? horaError : ""}
          </p>
        </div>

        <div className="hora-field">
          <h3>Hora de Encerramento</h3>
          <input
            type="time"
            value={horaFim}
            onChange={(e) => {
              setHoraFim(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="modal-buttons">
        <button
          onClick={() => {
            onClose();
            setData("");
            setHoraInicio("");
            setHoraFim("");
          }}
          className="cancel-button"
        >
          Cancelar
        </button>

        <button
          disabled={!data || !horaInicio || !horaFim}
          onClick={() => {
            if (data < new Date().toISOString().split("T")[0]) {
              setDataError(
                "A Data do encontro deve ser posterior à data atual",
              );
              return;
            }

            if (horaInicio >= horaFim) {
              setHoraError(
                "A hora de início não deve ser posterior à hora de encerramento",
              );
              return;
            }

            const dataHorarioInicioLocal = `${data}T${horaInicio}:00`;
            const dataHorarioFimLocal = `${data}T${horaFim}:00`;

            // 2. Converta para Objeto Date (o JS vai entender que é Fuso -3 automaticamente)
            // 3. Use o .toISOString() para converter para o formato do banco (adicionando as 3 horas para virar UTC)
            const dataHorarioInicio = new Date(
              dataHorarioInicioLocal,
            ).toISOString();
            const dataHorarioFim = new Date(dataHorarioFimLocal).toISOString();

            onPost(
              {
                oficina_id: `${state.selectedOficina.id}`,
                data_horario_inicio: dataHorarioInicio,
                data_horario_fim: dataHorarioFim,
              },
              state.accountData.token,
            ).then((res) => {
              if ([200, 201, 204].includes(res.status)) {
                dispatch({
                  type: "SET_HEADER_SNACKBAR",
                  payload: {
                    isOpen: true,
                    message: "Encontro agendado com sucesso!",
                  },
                });
                onClose();
                setData("");
                setHoraInicio("");
                setHoraFim("");
                setTimeout(() => window.location.reload(), 2000);
              } else if (res.status == 401) {
                console.log(res);

                dispatch({
                  type: "SET_HEADER_SNACKBAR",
                  payload: {
                    isOpen: true,
                    message: "Sessão expirada, faça login e tente novamente!",
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

                onClose();
                setData("");
                setHoraInicio("");
                setHoraFim("");
              } else if (res.status == 400) {
                res.json().then((r) => console.log(r));
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
