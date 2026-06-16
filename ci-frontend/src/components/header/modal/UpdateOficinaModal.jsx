import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import "../../style.css";
import { usePageContext } from "../../../contexts/MainContext";
import { useHeaderSnackbar } from "../HeaderSnackbar";

import placeholderImage from "../../../assets/placeholder.png";

export function UpdateOficinaModal({ isOpen, onClose, onUpdate }) {
  const { dispatch } = usePageContext();
  const { state } = usePageContext();
  const [tituloValue, setTituloValue] = useState(
    state.selectedOficina?.titulo || "",
  );
  const [descricaoValue, setDescricaoValue] = useState(
    state.selectedOficina?.descricao || "",
  );
  const [imageUrlValue, setImageUrlValue] = useState(
    state.selectedOficina?.image_url || "",
  );
  const [idValue, setIdValue] = useState(state.selectedOficina?.id || "");

  const [tituloError, setTituloError] = useState("");
  const [descricaoError, setDescricaoError] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");

  const { showMessage } = useHeaderSnackbar();

  useEffect(() => {
    if (isOpen && state.selectedOficina) {
      setTituloValue(state.selectedOficina.titulo || "");
      setDescricaoValue(state.selectedOficina.descricao || "");
      setImageUrlValue(state.selectedOficina.image_url || "");
      setIdValue(state.selectedOficina.id || "");
    }

    console.log(state.selectedOficina);
  }, [isOpen, state.selectedOficina]);

  useEffect(() => {
    if (tituloValue != "") setTituloError("");
    if (descricaoValue != "") setDescricaoError("");
    if (imageUrlValue != "") setImageUrlError("");
  }, [tituloValue, descricaoValue, imageUrlValue]);

  return (
    <Modal className="create-oficina-modal" isOpen={isOpen}>
      <h2>Atualizar Dados da Oficina</h2>
      <div className="modal-fields">
        <div className="titulo-field">
          <h3>Título</h3>
          <input
            className={`${tituloError != "" ? "error" : "comum"}`}
            type="text"
            placeholder={
              tituloError != "" ? tituloError : "Título da Sua Oficina"
            }
            value={tituloValue}
            onChange={(e) => {
              setTituloValue(e.target.value);
            }}
          />
        </div>

        <div className="descricao-field">
          <h3>Descrição</h3>
          <input
            className={`${descricaoError != "" ? "error" : "comum"}`}
            type="text"
            placeholder={
              descricaoError != "" ? descricaoError : "Descreva sua oficina..."
            }
            value={descricaoValue}
            onChange={(e) => {
              setDescricaoValue(e.target.value);
            }}
          />
        </div>

        <div className="image-field">
          <h3>URL da Imagem de Exibição</h3>
          <input
            className={`${imageUrlError != "" ? "error" : "comum"}`}
            type="text"
            placeholder={
              imageUrlError != ""
                ? imageUrlError
                : "Imagem que será exibida no card da oficina"
            }
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
      <div className="modal-buttons">
        <button
          onClick={() => {
            onClose();
            setTituloValue("");
            setDescricaoValue("");
            setImageUrlValue("");
            setTituloError("");
            setDescricaoError("");
            setImageUrlError("");
          }}
          className="cancel-button"
        >
          Cancelar
        </button>

        <button
          onClick={() => {
            onUpdate(
              {
                id: idValue,
                titulo: tituloValue,
                descricao: descricaoValue,
                image_url: imageUrlValue,
                tema: "Default",
              },
              state.accountData.token,
            ).then((res) => {
              if ([200, 201, 204].includes(res.status)) {
                dispatch({
                  type: "SET_HEADER_SNACKBAR",
                  payload: {
                    isOpen: true,
                    message: "Dados atualizados com sucesso!",
                  },
                });

                dispatch({
                  type: "SET_IS_UPDATING",
                  payload: false,
                });

                onClose();
                setTimeout(() => window.location.reload(), 2000);
              } else if (res.status == 401) {
                onClose();
                setTituloValue("");
                setDescricaoValue("");
                setImageUrlValue("");
                setTituloError("");
                setDescricaoError("");
                setImageUrlError("");

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

                  dispatch({
                    type: "SET_IS_UPDATING",
                    payload: false,
                  });

                  window.location.href = "/";
                }, 2000);
              } else if (res.status == 400) {
                res.json().then((res) => {
                  const errors = res.errors;

                  errors.forEach((error) => {
                    switch (error.field) {
                      case "titulo":
                        setTituloError(error.message);
                        setTituloValue("");
                        break;
                      case "descricao":
                        setDescricaoError(error.message);
                        setDescricaoValue("");
                        break;
                      case "image_url":
                        setImageUrlError(error.message);
                        setImageUrlValue("");
                        break;
                    }
                  });
                });
              }
            });
          }}
          className="login-button"
        >
          Atualizar Dados
        </button>
      </div>
    </Modal>
  );
}
