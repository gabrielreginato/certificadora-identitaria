import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { usePageContext } from "../../contexts/MainContext";
import { OficinaCard } from "./OficinaCard";
import { OficinaDataModal } from "./modal/OficinaDataModal";

export function OficinasGrid({ oficinas, page = "main" }) {
  const { state } = usePageContext();
  const [showOficinaDataModal, setShowOficinaDataModal] = useState(false);
  const [selectedOficina, setSelectedOficina] = useState(null);

  console.log(showOficinaDataModal);

  return (
    <div className="card-grid">
      <OficinaDataModal
        isOpen={showOficinaDataModal}
        onClose={() => setShowOficinaDataModal(false)}
        oficina={selectedOficina}
      />

      {oficinas.length === 0 && (
        <Typography variant="h5" textAlign="center" color="black" mt={4}>
          Fim da visualização...
        </Typography>
      )}

      <Grid
        container
        spacing={3}
        sx={{ display: "flex", justifyContent: "space-arround" }}
      >
        {oficinas.map((oficina, index) => (
          <Grid
            className="card-grid-content"
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
          >
            <OficinaCard
              oficina={oficina}
              onOpenModal={() => {
                setShowOficinaDataModal(true);
                setSelectedOficina(oficina);
              }}
              page={page}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
