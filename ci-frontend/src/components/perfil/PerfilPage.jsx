import "../style.css";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { PageProvider } from "../../contexts/MainContext";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { OficinasGrid } from "../main/OficinasGrid";

import { useEffect } from "react";

import { usePageContext } from "../../contexts/MainContext";

export function PerfilPage() {
  const { state, dispatch } = usePageContext();

  useEffect(() => {
    if (!state.accountData?.usuarioId) return;

    async function fetchDados() {
      const usuarioId = state.accountData.usuarioId;

      dispatch({ type: "SET_OFICINAS_VINCULADAS", payload: [] });
      if (state.accountData.role == "professor") {
        try {
          const [resResponsavel, resTutor] = await Promise.all([
            fetch(
              `http://localhost:3000/oficinas/?professor_responsavel_id=${usuarioId}`,
            ).then((r) => r.json()),
            fetch(
              `http://localhost:3000/oficinas/tutores?usuario_id=${usuarioId}`,
            )
              .then((r) => r.json())
              .then(async (vinculos) => {
                if (!vinculos || vinculos.length === 0) return [];

                const promessasOficinas = vinculos.map((vinculo) =>
                  fetch(
                    `http://localhost:3000/oficinas?id=${vinculo.oficina_id}`,
                  ) // Ajuste a URL se o seu backend usar Query (?oficina_id=)
                    .then((res) => res.json())
                    .then((res) => res[0])
                );

                const oficinasCarregadas = await Promise.all(promessasOficinas);
                return oficinasCarregadas;
              }),
          ]);

          const todasOficinasProf = [...resResponsavel, ...resTutor];
          dispatch({
            type: "SET_OFICINAS_VINCULADAS",
            payload: todasOficinasProf,
          });
        } catch (error) {
          console.error("Erro ao buscar oficinas do professor:", error);
        }
      } else {
        fetch(
          `http://localhost:3000/oficinas/participantes?usuario_id=${usuarioId}`,
        )
          .then((res) => res.json())
          .then(async (vinculos) => {
            if (!vinculos || vinculos.length === 0) return [];

            const promessasOficinas = vinculos.map((vinculo) =>
              fetch(
                `http://localhost:3000/oficinas?id=${vinculo.oficina_id}`,
              )
                .then((res) => res.json())
                .then((res) => res[0])
            );

            const oficinasCarregadas = await Promise.all(promessasOficinas);
            return oficinasCarregadas;
          })
          .then((res) => {
            dispatch({ type: "SET_OFICINAS_VINCULADAS", payload: res });
          })
          .catch((error) =>
            console.error("Erro ao buscar oficinas do aluno:", error),
          );
      }
    }

    fetchDados();
  }, [state.accountData?.usuarioId]);

  return (
    <div className="body">
      <div className="app-main">
        <Header page="perfil" />
        <div className="app-main">
          <div className="info-pessoal">
            <h2>Informações Pessoais</h2>
            <div className="info-content">
              <div className="info-item">
                <PersonIcon
                  className="icon"
                  sx={{ color: "green", backgroundColor: "#d9ffd9" }}
                />
                <div className="info-text">
                  <p>Nome Completo</p>
                  <p>{state.accountData.name}</p>
                </div>
              </div>
              <div className="info-item">
                <EmailIcon
                  className="icon"
                  sx={{ color: "purple", backgroundColor: "#ffdaff" }}
                />
                <div className="info-text">
                  <p>E-mail</p>
                  <p>{state.accountData.email}</p>
                </div>
              </div>
              {state.accountData.role == "aluno" && (
                <div className="info-item">
                  <SchoolIcon
                    className="icon"
                    sx={{ color: "blue", backgroundColor: "#e2e2ff" }}
                  />
                  <div className="info-text">
                    <p>Registro Acadêmico</p>
                    <p>{state.accountData.ra}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="linked-oficinas">
            <div className="title">
              <div className="left">
                <AutoStoriesIcon className="icon" sx={{ color: "#1447E6" }} />
                <h2>Oficinas Vinculadas</h2>
              </div>
              <h3 className="right">{state.oficinasVinculadas.length}</h3>
            </div>

            <div className="content">
              {state.oficinasVinculadas.length == 0 && (
                <h3>Você não possui vínculo com nenhuma oficina no momento!</h3>
              )}

              {state.oficinasVinculadas.length > 0 && (
                <OficinasGrid oficinas={state.oficinasVinculadas} page="perfil" />
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
