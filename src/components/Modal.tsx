import "../styles/modal.scss";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
     
        return () => {
            document.body.style.overflow = 'auto';
        };
      }, [isOpen]);
    
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal_content">
                {children}
                <button onClick={onClose} className="modal_button">Fechar</button>
            </div>
      </div>
    );
};