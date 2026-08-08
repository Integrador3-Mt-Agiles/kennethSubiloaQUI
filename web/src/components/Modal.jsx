function Modal({ abierto, titulo, children, onClose }) {
    if (!abierto) return null;
    return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal-panel" role="dialog" aria-modal="true" aria-label={titulo}><div className="modal-header"><h2>{titulo}</h2><button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">×</button></div>{children}</section></div>;
}
export default Modal;
