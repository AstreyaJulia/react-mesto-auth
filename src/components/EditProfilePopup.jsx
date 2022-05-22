import React, {useEffect} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

const EditProfilePopup = (props) => {

    /** Имя пользователя, подпись пользователя из контекста currentUser */
    const currentUser = React.useContext(CurrentUserContext);
    const {name, about} = currentUser;

    /** Стейт данных пользователя с имени пользователя и подписи */
    const [userData, setUserData] = React.useState({name: "", about: ""});

    /* FIXME всю валидацию можно было бы перенести в PopupWithForm */
    /** Стейт валидации всей формы. В этом месте вряд ли будут непрошедшие валидацию поля при открытии, так что форма прошла валидацию */
    const [formValid, setFormValid] = React.useState(true);

    /** Стейт валидации инпутов формы. В этом месте вряд ли будут непрошедшие валидацию поля при открытии, так что они уже прошли валидацию */
    const [formInputsValid, setFormInputsValid] = React.useState({name: true, about: true});

    /** Стейт сообщений ошибок валидации формы */
    const [formValidationMessages, setFormValidationMessages] = React.useState({name: "", about: ""});

    /** Изменяет стейт userData
     * @param evt */
    function handleUserDataChange(evt) {
        const {name, value} = evt.target;
        setUserData({
            ...userData,
            [name]: value
        })
        handleInputValid(evt);
    }

    /** Отправка формы
     * @param evt */
    function handleSubmit(evt) {
        evt.preventDefault();
        props.onUpdateUser(userData);
        setFormInputsValid({name: true, about: true});
        setFormValidationMessages({name: "", about: ""});
        setFormValid(true);
    }

    /** Хандл на закрытие, сброс состояний валидации */
    function handleOnClose() {
        props.onClose();
        setUserData({"name": currentUser.name, "about": currentUser.about})
        setFormInputsValid({name: true, about: true});
        setFormValidationMessages({name: "", about: ""});
        setFormValid(true);
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
        setUserData({"name": name, "about": about})
    }, [name, about]);

    useEffect(() => {
        Object.values(formInputsValid).filter(input => !input).length > 0
            ? setFormValid(false)
            : setFormValid(true)
    }, [formInputsValid, props.popupOpen])

    return (
        <PopupWithForm
            popupOpen={props.popupOpen}
            popupType="edit_profile"
            popupTitle="Редактировать профиль"
            popupFormName="profileForm"
            submitButtonText="Сохранить"
            onClose={handleOnClose}
            onSubmit={handleSubmit}
            isLoading={props.isLoading}
            loadingText={props.loadingText}
            onOverlayClose={props.onOverlayClose}
            isValid={formValid}
        >
            <fieldset className="popup__fieldset">
                <label className="popup__input-group" htmlFor="profile_name">
                    <input
                        className="popup__input"
                        type="text"
                        placeholder="Имя"
                        name="name"
                        id="profile_name"
                        required
                        minLength="2"
                        maxLength="40"
                        onChange={handleUserDataChange}
                        value={userData.name || ""}
                    />
                    <span
                        className={[
                            "popup__error",
                            formValidationMessages.name !== "" ? "popup__error_visible" : ""
                        ].join(" ")}
                        id="profile_name-error">{formValidationMessages.name}</span>
                </label>
                <label className="popup__input-group" htmlFor="profile_about">
                    <input
                        className="popup__input"
                        type="text"
                        placeholder="Подпись"
                        name="about"
                        id="profile_about"
                        required
                        minLength="2"
                        maxLength="400"
                        onChange={handleUserDataChange}
                        value={userData.about || ""}
                    />
                    <span
                        className={[
                            "popup__error",
                            formValidationMessages.about !== "" ? "popup__error_visible" : ""
                        ].join(" ")}
                        id="profile_about-error"
                    >{formValidationMessages.about}</span>
                </label>
            </fieldset>
        </PopupWithForm>
    );
};

export default EditProfilePopup;
