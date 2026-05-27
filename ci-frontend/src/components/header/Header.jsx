import { SearchBar } from "../main/SearchBar";
import logo from "../../assets/logo.png";
import "../style.css";

import { useState } from "react";
import { usePageContext } from "../../contexts/MainContext";
import { LoginModal } from "./modal/LoginModal";
import { PostOficinaModal } from "./modal/PostOficinaModal";
import { HeaderSnackbar } from "./HeaderSnackbar";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";

async function _login(name, password) {
  return await fetch(`https://localhost:3000/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  });
}

async function _post({ data, token }) {
  return await fetch("https://localhost:3000/oficinas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export function Header() {
  const { state } = usePageContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <div className="header">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={_login}
      />

      <PostOficinaModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onPost={_post}
        onOpenLoginModal={() => setShowLoginModal(true)}
      />

      <div className="left-side">
        <a href="index.html">
          <p className="hammersmithOneRegular">Workshop.io</p>
        </a>
      </div>

      <div className="right-side">
        <SearchBar />

        {state.token.length === 0 ? (
          <Button
            variant="outlined"
            className="login-button"
            onClick={() => setShowLoginModal(true)}
          >
            Entrar
          </Button>
        ) : (
          <Button
            variant="outlined"
            className="add-button"
            onClick={() => setShowPostModal(true)}
          >
            <UploadIcon></UploadIcon>
          </Button>
        )}
      </div>

      <HeaderSnackbar />
    </div>
  );
}
