import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import placeholderImg from "../../assets/placeholder.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../style.css";

import { usePageContext } from "../../contexts/MainContext";

export function OficinaCard({ oficina, onOpenModal, page = "main" }) {
  const { state } = usePageContext();

  return (
    <Card className="card">
      <div className="card-media-container">
        <CardMedia
          className="card-media"
          component="img"
          height="140"
          image={placeholderImg}
          alt={`"${oficina.titulo}"'s oficina card`}
        />
        {page == "perfil" &&
          (state.role == "professor" ? (
            oficina.professor_responsavel_id == state.accountData.usuarioId ? (
              <p className="card-label professor-label">Professor</p>
            ) : (
              <p className="card-label tutor-label">Tutor</p>
            )
          ) : (
            <p className="card-label tutor-label">Participante</p>
          ))}
      </div>

      <CardContent className="card-content">
        <Typography
          className="card-titulo"
          gutterBottom
          variant="h5"
          component="div"
          title={oficina.titulo}
        >
          {oficina.titulo}
        </Typography>

        <Typography className="card-descricao" variant="body2">
          {oficina.descricao}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          className="card-button"
          size="large"
          color="primary"
          onClick={() => {
            onOpenModal();
          }}
        >
          <span>Ver detalhes</span>{" "}
          <ArrowForwardIcon sx={{ paddingLeft: "0.5rem" }} />
        </Button>
      </CardActions>
    </Card>
  );
}
