import React, {useEffect} from "react";
import PopupWithForm from "./PopupWithForm";

const AddPlacePopup = (props) => {

    /** Стейт карточки с названием и ссылкой на изображение */
    const [card, setCard] = React.useState({name: "", link: ""});

    /* FIXME всю валидацию можно было бы перенести в PopupWithForm */
    /** Стейт валидации всей формы */
    const [formValid, setFormValid] = React.useState(false);

    /** Стейт валидации инпутов формы */
    const [formInputsValid, setFormInputsValid] = React.useState({name: false, link: false});

    /** Стейт сообщений ошибок валидации формы */
    const [formValidationMessages, setFormValidationMessages] = React.useState({name: "", link: ""});

    /** Изменяет стейт card */
    function handleCardChange(evt) {
        const {name, value} = evt.target;
        setCard({
            ...card,
            [name]: value
        })
        handleInputValid(evt);
    }

    /** Отправка формы
     * @param evt */
    function handleSubmit(evt) {
        evt.preventDefault();
        props.onAddPlace(card);
        setFormInputsValid({name: false, link: false});
        setFormValidationMessages({name: "", link: ""});
        setFormValid(false);
    }

    /** Хандл на закрытие, сброс состояний валидации */
    function handleOnClose() {
        props.onClose();
        setFormInputsValid({name: false, link: false});
        setFormValidationMessages({name: "", link: ""});
        setFormValid(false);
    }

    const handleInputValid = (evt) => {
        evt.preventDefault();
        const {name} = evt.target;

        if (!evt.target.validity.valid) {

            setFormInputsValid({
                ...formInputsValid,
                [name]: false
            });

            setFormValidationMessages({
                ...formValidationMessages,
                [name]: evt.target.validationMessage
            });

        } else {
            setFormInputsValid({
                ...formInputsValid,
                [name]: true
            });

            setFormValidationMessages({
                ...formValidationMessages,
                [name]: ""
            });
        }
    }

    useEffect(() => {
        setCard({name: "", link: ""});
    }, [props.popupOpen])

    useEffect(() => {
        Object.values(formInputsValid).filter(input => !input).length > 0
            ? setFormValid(false)
            : setFormValid(true)
    }, [formInputsValid, props.popupOpen])

    return (
        <PopupWithForm
            popupOpen={props.popupOpen}
            popupType="new-place"
            popupTitle="Новое место"
            popupFormName="newPlaceForm"
            submitButtonText="Создать"
            onClose={handleOnClose}
            onSubmit={handleSubmit}
            isLoading={props.isLoading}
            loadingText={props.loadingText}
            onOverlayClose={props.onOverlayClose}
            isValid={formValid}
        >
            <fieldset className="popup__fieldset">
                <label
                    className="popup__input-group"
                    htmlFor="place_name"
                >
                    <input
                        className="popup__input"
                        type="text"
                        placeholder="Имя"
                        value={card.name || ""}
                        name="name"
                        id="place_name"
                        required
                        minLength="2"
                        maxLength="30"
                        onChange={handleCardChange}
                    />
                    <span
                        className={[
                            "popup__error",
                            formValidationMessages.name !== "" ? "popup__error_visible" : ""
                        ].join(" ")}
                        id="place_name-error"
                    >{formValidationMessages.name}</span>
                </label>
                <label
                    className="popup__input-group"
                    htmlFor="place_url"
                >
                    <input
                        className="popup__input"
                        type="url"
                        placeholder="Ссылка на место"
                        value={card.link || ""}
                        name="link"
                        id="place_url"
                        required
                        onChange={handleCardChange}
                    />
                    <span
                        className={[
                            "popup__error",
                            formValidationMessages.link !== "" ? "popup__error_visible" : ""
                        ].join(" ")}
                        id="place_url-error"
                    >{formValidationMessages.link}</span>
                </label>
            </fieldset>
        </PopupWithForm>
    );
};
export default AddPlacePopup;
