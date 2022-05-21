import React from "react";
import Popup from "./Popup";

/** Всплывашка с изображением
 * @param props:
 * card - объект карточки
 * onClose - ф-я на закрытие формы
 * @returns {JSX.Element}
 * @constructor
 */
const ImagePopup = (props) => {

    /** Название карточки, ссылка на изображение */
    const {name, link} = props.card;

    return (
        <Popup
            className={link !== "" ? "popup popup_opened popup_view_image" : "popup popup_view_image"}
            closeHandler={props.onClose}
        >
            <div className="popup__container popup__container_view_image">
                <button className="popup__close-button button" type="button"
                        aria-label="Закрыть всплывающее окно" onClick={props.onClose}/>
                <figure className="popup__figure">
                    <img className="popup__image" src={link}
                         alt={name}/>
                    <figcaption className="popup__caption">{name}</figcaption>
                </figure>
            </div>
        </Popup>
    )
};

export default ImagePopup
