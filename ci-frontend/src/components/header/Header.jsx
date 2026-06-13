import { SearchBar } from "../main/SearchBar";
import logo from "../../assets/logo.png";
import "../style.css";

import { useState } from "react";
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
import ListItemButtom from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

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

export function Header({ page }) {
  const { dispatch } = usePageContext();
  const { state } = usePageContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateOficinaModal, setShowCreateOficinaModal] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        oficina={state.selectedOficina}
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

      <div className="right-side">
        {page === "main" && <SearchBar />}

        {(state.accountData.token === null) ? (
          <Button
            variant="outlined"
            className="login-button"
            onClick={() => setShowLoginModal(true)}
          >
            Entrar
          </Button>
        ) : (
          <>
            <ListItemButtom
              onClick={handleClick}
              sx={{
                borderRadius: "10px",
                bgcolor: "#F1F7FF",
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
                {state.accountData.name[0].toUpperCase()}
              </Avatar>
              <Box
                ml={2}
                sx={{
                  paddingX: 1.5,
                }}
              >
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
                <Typography
                  variant="body2"
                  sx={{
                    color: "#212121",
                  }}
                >
                  {state.accountData.role == "professor"
                    ? "Professor"
                    : "Aluno"}
                </Typography>
              </Box>
            </ListItemButtom>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {page != "perfil" && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    window.location.href = "/perfil";
                  }}
                  sx={{ mb: 3, mt: 1 }}
                >
                  <PersonIcon sx={{ paddingRight: "1rem" }} />
                  Meu perfil
                </MenuItem>
              )}
              {(state.accountData.token != null && state.accountData.role == "professor") && (
                <MenuItem
                  onClick={() => {
                    setShowCreateOficinaModal(true);
                    handleClose();
                    //window.location.href = "/perfil";
                  }}
                  sx={{ mb: 3, mt: 1 }}
                >
                  <LocalLibraryIcon sx={{ paddingRight: "1rem", color: "#0000D0" }} />
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
