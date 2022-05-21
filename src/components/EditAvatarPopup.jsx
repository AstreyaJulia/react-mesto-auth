import React from "react";
import PopupWithForm from "./PopupWithForm";

const EditAvatarPopup = (props) => {

    const refAvatar = React.useRef("");

    function handleSubmit(evt) {
        evt.preventDefault();

        props.onUpdateAvatar({
            avatar: refAvatar.current.value
        })
    }

    React.useEffect(() => {
        refAvatar.current.value = "";
    }, [props.popupOpen]);

    return (
        <PopupWithForm
            popupOpen={props.popupOpen}
            popupType="update-avatar"
            popupTitle="Обновить аватар"
            popupFormName="updateAvatarForm"
            submitButtonText="Сохранить"
            onClose={props.onClose}
            onSubmit={handleSubmit}
            isLoading={props.isLoading}
            loadingText={props.loadingText}
            onOverlayClose={props.onOverlayClose}
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
                    />
                    <span
                        className="popup__error"
                        id="avatar_url-error"
                    />
                </label>
            </fieldset>
        </PopupWithForm>

    );
};

export default EditAvatarPopup;
