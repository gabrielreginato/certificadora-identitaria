import { Modal } from "../../header/modal/Modal";
import Button from "@mui/material/Button";

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen}>
      <div className="modal-confirmation">
        <h3>{title}</h3>
        <p style={{ margin: "16px 0", color: "#666" }}>{message}</p>
        <div className={`modal-confirmation-actions ${title == "Sair da Oficina" && 'sair'}`}>
          <Button variant="outlined" onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={onConfirm}
            sx={{ backgroundColor: "#db0000", color: "#fff", "&:hover": { backgroundColor: "#b30000" } }}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}