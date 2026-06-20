import { SearchBar } from "../main/SearchBar";
import logo from "../../assets/logo.png";
import "../style.css";

import { useState, useEffect } from "react";
import { usePageContext } from "../../contexts/MainContext";
import { LoginModal } from "./modal/LoginModal";
import { CreateOficinaModal } from "./modal/CreateOficinaModal";
import { UpdateOficinaModal } from "./modal/UpdateOficinaModal";
import { HeaderSnackbar } from "./HeaderSnackbar";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { CreateEncontroModal } from "./modal/CreateEncontroModal";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";

async function _login(email, password) {
  return await fetch(`http://localhost:3000/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha: password }),
  });
}

async function _post(data, token) {
  return await fetch("http://localhost:3000/oficinas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

async function _update(data, token) {
  return await fetch(`http://localhost:3000/oficinas/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

async function _postEncontro(data, token) {
  return await fetch("http://localhost:3000/encontros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

// 🌟 Nova função auxiliar para fazer o check das notificações no backend
async function _checkNotifications(ids, token) {
  return await fetch(`http://localhost:3000/oficinas/notificacoes/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notificacoes: ids }),
  });
}

export function Header({ page }) {
  const { dispatch, state } = usePageContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateOficinaModal, setShowCreateOficinaModal] = useState(false);

  // Estados do Menu do Perfil
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Estados do Menu de Notificações
  const [anchorElNot, setAnchorElNot] = useState(null);
  const openNot = Boolean(anchorElNot);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 🌟 Função ao clicar no botão de notificações revisada
  const handleClickNot = async (event) => {
    setAnchorElNot(event.currentTarget);

    // Filtra apenas os IDs das notificações que ainda não foram vistas
    const naoVistas = state.notificacoes?.filter(not => !not.visto) || [];
    const idsNaoVistas = naoVistas.map(not => not.id);

    // Se houver alguma notificação não vista, envia para a API e atualiza o estado local
    if (idsNaoVistas.length > 0 && state.accountData.token) {
      try {
        const res = await _checkNotifications(idsNaoVistas, state.accountData.token);
        
        if (res.status === 200) {
          // Atualiza o estado global para marcar todas localmente como visto: true
          const notificacoesAtualizadas = state.notificacoes.map(not => 
            idsNaoVistas.includes(not.id) ? { ...not, visto: true } : not
          );
          dispatch({ type: "SET_NOTIFICACOES", payload: notificacoesAtualizadas });
        }
      } catch (error) {
        console.error("Erro ao marcar notificações como vistas:", error);
      }
    }
  };

  const handleCloseNot = () => {
    setAnchorElNot(null);
  };

  const logOut = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("role", "");
    localStorage.setItem("usuarioId", "");
    localStorage.setItem("email", "");
    localStorage.setItem("name", "");
    localStorage.setItem("perfilId", "");

    dispatch({
      type: "SET_ACCOUNT_DATA",
      payload: {
        ...state.accountData,
        token: "",
        role: "",
        email: "",
        usuarioId: "",
        perfilId: "",
        name: "",
      },
    });

    window.location.reload();
  };

  async function fetchNots(token) {
    dispatch({ type: "SET_NOTIFICACOES", payload: [] });

    return await fetch(`http://localhost:3000/oficinas/notificacoes`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  useEffect(() => {
    if (!state.accountData?.usuarioId) return;

    if (state.accountData.token) {
      fetchNots(state.accountData.token).then((res) => {
        if (res.status == 200) {
          res.json().then((res) => {
            console.log("**************************************************");
            console.log(res);
            dispatch({ type: "SET_NOTIFICACOES", payload: res });
          });
        } else {
          dispatch({ type: "SET_NOTIFICACOES", payload: [] });
        }
      });
    }
  }, [state.accountData?.token]);

  return (
    <div className="header">
      <CreateOficinaModal
        isOpen={showCreateOficinaModal}
        onClose={() => setShowCreateOficinaModal(false)}
        onPost={_post}
      />

      <UpdateOficinaModal
        isOpen={state.isUpdating}
        onClose={() => dispatch({ type: "SET_IS_UPDATING", payload: false })}
        onUpdate={_update}
      />

      <CreateEncontroModal
        isOpen={state.isScheduling}
        onClose={() => dispatch({ type: "SET_IS_SCHEDULING", payload: false })}
        onPost={_postEncontro}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={_login}
      />

      <div className="left-side">
        <a href="/">
          <p className="hammersmithOneRegular">Workshop.io</p>
        </a>
      </div>

      <div
        className="right-side"
        style={{ display: "flex", alignItems: "center", gap: "1rem" }}
      >
        {page === "main" && <SearchBar />}

        {state.accountData.token === "" || state.accountData.token === null ? (
          <Button
            variant="outlined"
            className="login-button"
            onClick={() => setShowLoginModal(true)}
          >
            Entrar
          </Button>
        ) : (
          <>
            {/* 🔔 Botão de Notificações */}
            <ListItemButton
              className="notifications-button"
              onClick={handleClickNot}
              sx={{
                borderRadius: "50%",
                width: "3rem",
                height: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                color: "#1447E6",
                ":hover": {
                  backgroundColor: "#0d319e",
                  color: "white",
                },
              }}
            >
              <Badge
                // 🌟 Condição alterada: Só exibe a 'dot' se existir alguma notificação cujo 'visto' seja falso/falsy
                variant={
                  state.notificacoes && state.notificacoes.some(not => !not.visto)
                    ? "dot"
                    : "none"
                }
                color="error"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiBadge-badge": {
                    height: 12,
                    width: 12,
                    borderRadius: "50%",
                  },
                }}
              >
                <NotificationsIcon sx={{ fontSize: "2rem" }} />
              </Badge>
            </ListItemButton>

            {/* 👤 Botão do Perfil */}
            <ListItemButton
              className="perfil-button"
              onClick={handleClick}
              sx={{
                borderRadius: "10px",
                bgcolor: "#F1F7FF",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  bgcolor: "#d8e1ec",
                },
              }}
            >
              <Avatar
                className="avatar"
                sx={{
                  bgcolor: "#155DFC",
                  width: 40,
                  height: 40,
                }}
              >
                {state.accountData.name[0]?.toUpperCase()}
              </Avatar>
              <Box ml={2} sx={{ paddingX: 1.5, textAlign: "left" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "500",
                    color: "#212121",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {state.accountData.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#212121" }}>
                  {state.accountData.role === "professor" ? "Professor" : "Aluno"}
                </Typography>
              </Box>
            </ListItemButton>

            {/* LISTA FLUTUANTE DE NOTIFICAÇÕES */}
            <Menu
              anchorEl={anchorElNot}
              open={openNot}
              onClose={handleCloseNot}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  style: {
                    width: "350px",
                    maxHeight: "400px",
                    overflowY: "auto",
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1, bgcolor: "#f5f5f5" }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", fontWeight: "bold", color: "#333" }}
                >
                  Notificações
                </Typography>
              </Box>
              <Divider />

              {!state.notificacoes || state.notificacoes.length === 0 ? (
                <MenuItem disabled sx={{ justifyContent: "center", py: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Nenhuma notificação nova.
                  </Typography>
                </MenuItem>
              ) : (
                [...state.notificacoes]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((not, index, arr) => (
                    <div key={not.id || index}>
                      <MenuItem
                        onClick={handleCloseNot}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          whiteSpace: "normal",
                          py: 1.5,
                          px: 2,
                          "&:hover": { bgcolor: "#f8fafd" },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "#888", mb: 0.5 }}
                        >
                          {not.createdAt
                            ? new Date(not.createdAt).toLocaleDateString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : ""}
                        </Typography>

                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "600", color: "#1447E6", mb: 0.5 }}
                        >
                          {not.titulo}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#555",
                            fontSize: "0.85rem",
                            lineHeight: "1.3",
                          }}
                        >
                          {not.mensagem}
                        </Typography>
                      </MenuItem>
                      {index < arr.length - 1 && <Divider />}
                    </div>
                  ))
              )}
            </Menu>

            {/* Menu do Perfil */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  style: {
                    minWidth: "180px",
                  },
                },
              }}
            >
              {page !== "perfil" && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    window.location.href = "/perfil";
                  }}
                  sx={{ mb: 1, mt: 1 }}
                >
                  <PersonIcon sx={{ paddingRight: "1rem" }} />
                  Meu perfil
                </MenuItem>
              )}
              {state.accountData.token !== null &&
                state.accountData.role === "professor" && (
                  <MenuItem
                    onClick={() => {
                      setShowCreateOficinaModal(true);
                      handleClose();
                    }}
                    sx={{ mb: 1 }}
                  >
                    <LocalLibraryIcon
                      sx={{ paddingRight: "1rem", color: "#0000D0" }}
                    />
                    Criar Oficina
                  </MenuItem>
                )}
              <MenuItem
                onClick={() => {
                  handleClose();
                  logOut();
                  window.location.href = "/";
                }}
              >
                <LogoutIcon sx={{ paddingRight: "1rem", color: "red" }} />
                Sair
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      <HeaderSnackbar />
    </div>
  );
}