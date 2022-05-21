import React, {useEffect, useState} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {api} from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

/**
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
    /** Состояние текущего пользователя */
    const [currentUser, setCurrentUser] = useState({});

    /** Состояние массива карточек */
    const [cards, setCards] = useState([]);

    /** Состояние выбранной для просмотра карточки */
    const [selectedCard, setSelectedCard] = React.useState({
        name: "",
        link: "",
    });

    /** Состояние выбранной для удаления карточки */
    const [deleteCard, setDeleteCard] = React.useState({_id: ""});

    /** Состояние всплывашки редактирования профиля */
    const [editProfilePopupOpen, setEditProfilePopupOpen] =
        React.useState(false);

    /** Состояние всплывашки добавления карточки */
    const [newPlacePopupOpen, setNewPlacePopupOpen] = React.useState(false);

    /** Состояние всплывашки редактирования аватара */
    const [updateAvatarPopupOpen, setUpdateAvatarPopupOpen] =
        React.useState(false);

    /** Состояние всплывашки удаления карточки */
    const [deletePlacePopupOpen, setDeletePlacePopupOpen] =
        React.useState(false);

    /** Состояние сохранения данных */
    const [isLoading, setIsLoading] = React.useState(false);

    /** Устанавливает выбранную карточку по нажатию
     * @param card */
    function handleCardClick(card) {
        setSelectedCard(card);
    }

    /** Открывает всплывашку редактирования профиля */
    function handleEditProfileClick() {
        setEditProfilePopupOpen(true);
    }

    /** Открывает всплывашку добавления карточки */
    function handleNewPlaceClick() {
        setNewPlacePopupOpen(true);
    }

    /** Открывает всплывашку редактирования аватара */
    function handleUpdateAvatarClick() {
        setUpdateAvatarPopupOpen(true);
    }

    /** Открывает всплывашку удаления карточки */
    function handleDeletePlaceClick(card) {
        setDeleteCard(card);
        setDeletePlacePopupOpen(true);
    }

    /** Закрывает все всплывашки / сбрасывает состояния */
    function closeAllPopups() {
        setSelectedCard({name: "", link: ""});
        setDeleteCard({_id: ""});
        setEditProfilePopupOpen(false);
        setNewPlacePopupOpen(false);
        setUpdateAvatarPopupOpen(false);
        setDeletePlacePopupOpen(false);
    }

    /** Ставит/удаляет лайк
     * @param card - объект карточки */
    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, isLiked)
            .then((newCard) => {
                setCards((state) =>
                    state.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => console.log(err));
    }

    /** Удаляет карточку - объект карточки */
    function handleCardDelete(evt) {
        evt.preventDefault();
        setIsLoading(true);
        api.deleteCard(deleteCard._id)
            .then(() => {
                setCards(cards.filter((currentCard) => currentCard._id !== deleteCard._id && currentCard));
                closeAllPopups();
            })
            .catch((err) => console.log("Ошибка" + err))
            .finally(() => {
                setIsLoading(false);
            });
    }

    /** Отправка данных пользователя, обновление стейта currentUser
     * @param inputValues - введенные значения */
    function handleUpdateUser(inputValues) {
        setIsLoading(true);
        api.sendUserInfo(inputValues.name, inputValues.about)
            .then((user) => {
                setCurrentUser(user);
                closeAllPopups();
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsLoading(false);
            });
    }

    /** Обновление аватара, обновление стейта currentUser
     * @param avatar - аватар */
    function handleUpdateAvatar(avatar) {
        setIsLoading(true);
        api.updateAvatar(avatar.avatar)
            .then((avatar) => {
                setCurrentUser(avatar);
                closeAllPopups();
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsLoading(false);
            });
    }

    /** Добавление карточки, обновление стейта cards
     * @param inputValues - введенные значения */
    function handleAddPlaceSubmit(inputValues) {
        setIsLoading(true);
        api.sendCard(inputValues.name, inputValues.link)
            .then((data) => {
                setCards([data, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsLoading(false);
            });
    }

    /** Получаем данные залогиненного пользователя, пишем в состояние currentUser */
    useEffect(() => {
        api.getUserInfo()
            .then((res) => {
                setCurrentUser(res);
            })
            .catch((err) => console.log(err));
    }, []);

    /** Получаем массив карточек, пишем в состояние cards */
    useEffect(() => {
        api.getCards()
            .then((cardsArray) => {
                setCards(cardsArray);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="App">
                <Header/>
                <Main
                    cards={cards}
                    onCardClick={handleCardClick} // нажатие на карточку
                    onEditProfile={handleEditProfileClick} // редактирование профиля
                    onNewPlace={handleNewPlaceClick} // добавление карточки
                    onUpdateAvatar={handleUpdateAvatarClick} // редактирование аватара
                    onDeleteCard={handleDeletePlaceClick} // удаление карточки
                    onCardLike={handleCardLike} // лайк/дизлайк
                />
                <Footer/>

                {/** Всплывашка редактирования профиля */}
                <EditProfilePopup
                    popupOpen={editProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    isLoading={isLoading}
                    loadingText="Сохранение..."
                />

                {/** Всплывашка добавления новой карточки */}
                <AddPlacePopup
                    popupOpen={newPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                    isLoading={isLoading}
                    loadingText="Добавление..."
                >
                </AddPlacePopup>
                {/** Всплывашка просмотра карточки */}
                <ImagePopup
                    card={selectedCard}
                    onClose={closeAllPopups}
                />
                {/** Всплывашка удаления карточки */}
                <PopupWithForm
                    popupOpen={deletePlacePopupOpen}
                    popupType="delete-place"
                    popupTitle="Вы уверены?"
                    submitButtonText="Да"
                    onClose={closeAllPopups}
                    isLoading={isLoading}
                    loadingText="Удаление..."
                    onSubmit={handleCardDelete}
                />
                {/** Всплывашка редактирования аватара */}
                <EditAvatarPopup
                    popupOpen={updateAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                    isLoading={isLoading}
                    loadingText="Сохранение..."
                >
                </EditAvatarPopup>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
