import { useState } from "react";
import { Modal } from "./Modal";
import "../../style.css";
import { usePageContext } from "../../../contexts/MainContext";
import { useHeaderSnackbar } from "../HeaderSnackbar";

export function LoginModal({ isOpen, onClose, onLogin }) {
  const { dispatch } = usePageContext();
  const { state } = usePageContext();
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [failMessage, setFailMessage] = useState("");

  const { showMessage } = useHeaderSnackbar();

  return (
    <Modal isOpen={isOpen}>
      <h2>Login</h2>
      <div className="modal-fields">
        <div className="email-field">
          <h3>E-mail</h3>
          <input
            type="email"
            placeholder="E-mail"
            value={emailValue}
            onChange={(e) => {
              setEmailValue(e.target.value);
            }}
          />
        </div>
        <div className="password-field">
          <h3>Senha</h3>
          <input
            type="password"
            placeholder="Senha"
            value={passValue}
            onChange={(e) => {
              setPassValue(e.target.value);
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
            onLogin(emailValue, passValue).then((res) => {
              if (res.status == 200) {
                res.json().then((body) => {
                  dispatch({
                    type: "SET_ACCOUNT_DATA",
                    payload: {
                      ...state.accountData,
                      token: body.token,
                      role: body.usuario.tipo,
                      email: body.usuario.email,
                      usuarioId: body.usuario.id,
                      perfilId:
                        body.usuario.tipo == "professor"
                          ? body.usuario.perfil_professor.id
                          : body.usuario.perfil_aluno.id,
                      name:
                        body.usuario.tipo == "professor"
                          ? body.usuario.perfil_professor.nome
                          : body.usuario.perfil_aluno.nome,
                    },
                  });
                  localStorage.setItem("token", body.token);
                  localStorage.setItem("role", body.usuario.tipo);
                  localStorage.setItem("usuarioId", body.usuario.id);
                  localStorage.setItem("email", body.usuario.email);
                  localStorage.setItem(
                    "name",
                    body.usuario.tipo == "professor"
                      ? body.usuario.perfil_professor.nome
                      : body.usuario.perfil_aluno.nome,
                  );
                  localStorage.setItem(
                    "perfilId",
                    body.usuario.tipo == "professor"
                      ? body.usuario.perfil_professor.id
                      : body.usuario.perfil_aluno.id,
                  );
                  localStorage.setItem(
                    "ra",
                    body.usuario.tipo == "aluno"
                      ? body.usuario.perfil_aluno.ra
                      : ""
                  );
                });
                onClose();
                setFailMessage("");
                setEmailValue("");
                setPassValue("");
                showMessage("Loged successfuly");
              } else {
                console.log(res);
                res.json().then((body) => setFailMessage(body.description));
              }
            });
          }}
          className="login-button"
        >
          Entrar
        </button>
      </div>
    </Modal>
  );
}
