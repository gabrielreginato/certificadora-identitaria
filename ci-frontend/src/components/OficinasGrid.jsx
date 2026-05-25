import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { usePageContext } from "../contexts/MainContext";
import { OficinaCard } from "./OficinaCard";

export function OficinasGrid() {
  const { state } = usePageContext();

  return (
    <div className="card-grid">
      {state.oficinas.length === 0 && (
        <Typography variant="h5" textAlign="center" mt={4}>
          Fim da visualização...
        </Typography>
      )}

      <Grid  container spacing={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {state.oficinas.map((oficina, index) => (
          <Grid
            className="card-grid-content"
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
          >
            <OficinaCard
              titulo={oficina.titulo}
              descricao={oficina.descricao}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}