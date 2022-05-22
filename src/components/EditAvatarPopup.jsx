import React, {useEffect} from "react";
import PopupWithForm from "./PopupWithForm";

const EditAvatarPopup = (props) => {

    /** Стейт аватара с ссылкой на изображение */
    const [avatar, setAvatar] = React.useState({avatar: ""});

    /* FIXME всю валидацию можно было бы перенести в PopupWithForm */
    /** Стейт валидации всей формы */
    const [formValid, setFormValid] = React.useState(false);

    /** Стейт валидации инпутов формы */
    const [formInputsValid, setFormInputsValid] = React.useState({avatar: false});

    /** Стейт сообщений ошибок валидации формы */
    const [formValidationMessages, setFormValidationMessages] = React.useState({avatar: ""});

    const refAvatar = React.useRef("");

    /** Изменяет стейт avatar */
    function handleInputChange(evt) {
        const {name, value} = evt.target;
        setAvatar({
            ...avatar,
            [name]: value
        })
        handleInputValid(refAvatar);
    }

    function handleSubmit(evt) {
        evt.preventDefault();

        props.onUpdateAvatar({
            avatar: refAvatar.current.value
        })

        setFormInputsValid({avatar: false});
        setFormValid(false);
    }

    /** Хандл на закрытие, сброс состояний валидации */
    function handleOnClose() {
        props.onClose();
        setFormInputsValid({avatar: false});
        setFormValid(false);
    }

    const handleInputValid = (input) => {
        const {name} = input.current;

        if (!input.current.validity.valid) {

            setFormInputsValid({
                ...formInputsValid,
                [name]: false
            });

            setFormValidationMessages({
                ...formValidationMessages,
                [name]: input.current.validationMessage
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
        refAvatar.current.value = "";
    }, [props.popupOpen]);

    useEffect(() => {
        Object.values(formInputsValid).filter(input => !input).length > 0
            ? setFormValid(false)
            : setFormValid(true)
    }, [formInputsValid, props.popupOpen])

    return (
        <PopupWithForm
            popupOpen={props.popupOpen}
            popupType="update-avatar"
            popupTitle="Обновить аватар"
            popupFormName="updateAvatarForm"
            submitButtonText="Сохранить"
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
                    htmlFor="avatar_url"
                >
                    <input
                        className="popup__input"
                        type="url"
                        placeholder="Ссылка на аватар"
                        name="avatar"
                        id="avatar_url"
                        required
                        ref={refAvatar}
                        onChange={handleInputChange}
                        value={avatar.avatar}
                    />
                    <span
                        className={[
                            "popup__error",
                            formValidationMessages.avatar !== "" ? "popup__error_visible" : ""
                        ].join(" ")}
                        id="avatar_url-error"
                    >{formValidationMessages.avatar}</span>
                </label>
            </fieldset>
        </PopupWithForm>

    );
};

export default EditAvatarPopup;
