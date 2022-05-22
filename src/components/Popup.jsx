import React, {useEffect, useRef} from "react";

/** Корень всех всплывашек с прослушивателями
 * @param props - {closeHandler - ф-я закрытия, className - класс/ы всплывашки, children - содержимое}
 * @returns {JSX.Element}
 * @constructor */
const Popup = (props) => {

    const {closeHandler, className, children} = props;
    const popup = useRef(null);

    /** Закрытие модала по оверлею
     * @param evt */
    const handleOverlayClose = (evt) => {
        if (evt.target.classList.contains("popup")) {
            closeHandler();
        }
    };

    /** Закрытие модала по оверлею
     * @param evt */
    const closeByEsc = (evt) => {
        if (evt.key === "Escape") {
            closeHandler();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleOverlayClose, false);
        document.addEventListener("keydown", closeByEsc, false);

        return () => {
            document.removeEventListener("click", handleOverlayClose, false);
            document.removeEventListener("keydown", closeByEsc, false);
        };
    });

    return (
        <div className={className} ref={popup}>
            {children}
        </div>
    );
};

export default Popup;