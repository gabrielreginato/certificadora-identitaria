import { useState } from "react";
import { Modal } from "./Modal";
import "../../style.css";
import { usePageContext } from "../../../contexts/MainContext";
import { useHeaderSnackbar } from "../HeaderSnackbar";

import placeholderImage from "../../../assets/placeholder.png";

export function CreateOficinaModal({ isOpen, onClose, onPost }) {
  const { dispatch } = usePageContext();
  const { state } = usePageContext();
  const [tituloValue, setTituloValue] = useState("");
  const [descricaoValue, setDescricaoValue] = useState("");
  const [imageUrlValue, setImageUrlValue] = useState("");
  const [failMessage, setFailMessage] = useState("");

  const { showMessage } = useHeaderSnackbar();

  return (
    <Modal className="create-oficina-modal" isOpen={isOpen}>
      <h2>Criar Oficina</h2>
      <div className="modal-fields">
        <div className="titulo-field">
          <h3>Título</h3>
          <input
            type="text"
            placeholder="Título da Sua Oficina"
            value={tituloValue}
            onChange={(e) => {
              setTituloValue(e.target.value);
            }}
          />
        </div>

        <div className="descricao-field">
          <h3>Descrição</h3>
          <input
            type="text"
            placeholder="Descreva sua oficina..."
            value={descricaoValue}
            onChange={(e) => {
              setDescricaoValue(e.target.value);
            }}
          />
        </div>

        <div className="image-field">
          <h3>URL da Imagem de Exibição</h3>
          <input
            type="text"
            placeholder="Imagem que será exibida no card da oficina"
            value={imageUrlValue}
            onChange={(e) => {
              setImageUrlValue(e.target.value);
            }}
          />
        </div>

        <div className="preview-image">
          {imageUrlValue && imageUrlValue != "" ? (
            <img src={imageUrlValue} alt="Preview" />
          ) : (
            <img src={placeholderImage} />
          )}
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
            console.log(state.accountData.token)
            onPost({
              titulo: tituloValue,
              descricao: descricaoValue,
              image_url: imageUrlValue,
              tema: "Default"
            }, state.accountData.token).then((res) => {
              if ([200, 201, 204].includes(res.status)) {
                dispatch({
                  type: "SET_HEADER_SNACKBAR",
                  payload: {
                    isOpen: true,
                    message: "Oficina criada com sucesso!",
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
              }
            });
          }}
          className="login-button"
        >
          Criar Oficina
        </button>
      </div>
    </Modal>
  );
}
