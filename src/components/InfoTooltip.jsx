import React from "react";
import Popup from "./Popup";
import Tooltip_error from "../images/tooltip_error.svg";
import Tooltip_success from "../images/tooltip_succes.svg";

/** Всплывашка с уведомлениями
 * @param props - {popupOpen - Открыта или нет, onClose - ф-я колбек закрывающая, type - тип из объекта tooltip_types}
 * @returns {JSX.Element}
 * @constructor
 */
const InfoTooltip = (props) => {

    /** Объект типов ошибок с изображениями и текстами
     * @type {{reg_success: {image: *, text: string}, error: {image: *, text: string}}}
     */
    const tooltip_types = {
        reg_success: {image: Tooltip_success, text: "Вы успешно зарегистрировались!"}, // успешная регистрация
        error: {image: Tooltip_error, text: "Что-то пошло не так! Попробуйте ещё раз."} // просто ошибка
    };

    return (<Popup
            className={props.popupOpen ? "popup popup_opened" : "popup"}
            closeHandler={props.onClose}
        >
            <div
                className={["popup__container"].join(" ")}
            >
                <button
                    className="popup__close-button button"
                    type="button"
                    aria-label="Закрыть всплывающее окно"
                    onClick={props.onClose}
                />
                <div className="popup__tooltip">
                    <img className="popup__tooltip-image" src={tooltip_types[props.type].image}
                         alt={tooltip_types[props.type].text}/>
                    <p className="popup__tooltip-text">{tooltip_types[props.type].text}</p>
                </div>
            </div>
        </Popup>);
};

export default InfoTooltip;