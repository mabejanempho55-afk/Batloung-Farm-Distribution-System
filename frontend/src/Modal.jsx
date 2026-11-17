
function Modal({ title, children, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button type="button" className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

export default Modal;
