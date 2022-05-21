import React from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

const EditProfilePopup = (props) => {

    /** Имя пользователя, подпись пользователя из контекста currentUser */
    const currentUser = React.useContext(CurrentUserContext);
    const {name, about} = currentUser;

    /** Стейт данных пользователя с имени пользователя и подписи */
    const [userData, setUserData] = React.useState({name: "", about: ""});

    /** Изменяет стейт userData
     * @param evt */
    function handleUserDataChange(evt) {
        const {name, value} = evt.target;
        setUserData({
            ...userData,
            [name]: value
        })
    }

    /** Отправка формы
     * @param evt */
    function handleSubmit(evt) {
        evt.preventDefault();
        props.onUpdateUser(userData);
    }

    React.useEffect(() => {
        setUserData({"name": name, "about": about})
    }, [name, about]);

    return (
        <PopupWithForm
            popupOpen={props.popupOpen}
            popupType="edit_profile"
            popupTitle="Редактировать профиль"
            popupFormName="profileForm"
            submitButtonText="Сохранить"
            onClose={props.onClose}
            onSubmit={handleSubmit}
            isLoading={props.isLoading}
            loadingText={props.loadingText}
            onOverlayClose={props.onOverlayClose}
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
                        value={userData.name ? userData.name : ""}
                    />
                    <span className="popup__error" id="profile_name-error"/>
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
                        value={userData.about ? userData.about : ""}
                    />
                    <span className="popup__error" id="profile_about-error"/>
                </label>
            </fieldset>
        </PopupWithForm>
    );
};

export default EditProfilePopup;
