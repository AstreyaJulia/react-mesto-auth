import {useEffect, useState} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {api} from "../utils/api";
import * as auth from "../utils/auth";

/** Компоненты приложения */
import Header from "./Header";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

/** Компонент private route */
import Main from "./Main";

/** Страницы public routes */
import Login from "./Login";
import Register from "./Register";

/** Роутинг */
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

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
    const [selectedCard, setSelectedCard] = useState({
        name: "", link: "",
    });

    /** Состояние выбранной для удаления карточки */
    const [deleteCard, setDeleteCard] = useState({_id: ""});

    /** Состояние всплывашки редактирования профиля */
    const [editProfilePopupOpen, setEditProfilePopupOpen] = useState(false);

    /** Состояние всплывашки добавления карточки */
    const [newPlacePopupOpen, setNewPlacePopupOpen] = useState(false);

    /** Состояние всплывашки редактирования аватара */
    const [updateAvatarPopupOpen, setUpdateAvatarPopupOpen] = useState(false);

    /** Состояние всплывашки удаления карточки */
    const [deletePlacePopupOpen, setDeletePlacePopupOpen] = useState(false);

    /** Состояние всплывашки Tooltip карточки */
    const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);

    /** Тип всплывашки Tooltip карточки */
    const [infoTooltipType, setInfoTooltipType] = useState("error");

    /** Состояние сохранения данных */
    const [isLoading, setIsLoading] = useState(false);

    /** Состояние входа пользователя */
    const [loggedIn, setLoggedIn] = useState(false);

    /** Состояние Email пользователя, для шапки */
    const [userEmail, setUserEmail] = useState("");

    /** Стейт состояния получения данных пользователя и карточек */
    const [isLoadingAllData, setIsLoadingAllData] = useState(false);

    /** История переходов страниц */
    const history = useHistory();

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

    /** Открывает всплывашку Tooltip */
    function handleInfoTooltipPopupOpen() {
        setInfoTooltipOpen(true);
    }

    /** Закрывает все всплывашки / сбрасывает состояния */
    function closeAllPopups() {
        setSelectedCard({name: "", link: ""});
        setDeleteCard({_id: ""});
        setEditProfilePopupOpen(false);
        setNewPlacePopupOpen(false);
        setUpdateAvatarPopupOpen(false);
        setDeletePlacePopupOpen(false);
        setInfoTooltipOpen(false);
    }

    /** Ставит/удаляет лайк
     * @param card - объект карточки */
    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
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

    /** Регистрация
     * @param registerData - рег. данные {email: string, password: string}
     */
    const handleRegister = (registerData) => {
        auth.register(registerData)
            .then(() => {
                handleInfoTooltipPopupOpen();
                setInfoTooltipType("reg_success");
                setInfoTooltipOpen(true);
                history.push("/sign-in");
            })
            .catch((err) => {
                handleInfoTooltipPopupOpen();
                setInfoTooltipType("error");
                setInfoTooltipOpen(true);
                console.log(err)
            });
    }

    /** Вход, запись полученного токена
     * @param loginData - данные входа {email: string, password: string}
     */
    const handleLogin = (loginData) => {
        auth.authorize(loginData)
            .then((res) => {
                setLoggedIn(true);
                localStorage.setItem("jwt", res.token);
                setUserEmail(loginData.email);
                history.push("/");
            })
            .catch((err) => {
                handleInfoTooltipPopupOpen();
                setInfoTooltipType("error");
                setInfoTooltipOpen(true);
                console.log(err);
            })
    }

    /** Получает email по токену, проверка валидности токена */
    const tokenCheck = () => {
        const token = localStorage.getItem("jwt");
        if (token) {
            auth.getContent(token)
                .then((res) => {
                    if (res.data) {
                        setUserEmail(res.data.email);
                        setLoggedIn(true);
                    }
                })
                .catch(err => console.log(err));
        }
    }

    /** Выход из приложения. Удаление токена */
    const handleSignOut = () => {
        localStorage.removeItem("jwt");
        setLoggedIn(false);
    }

    /** Перенаправление на главную для зарег. пользователя и на login для незарег. пользователя */
    useEffect(() => {
        loggedIn ? history.push("/") : history.push("/sign-in")
        // eslint-disable-next-line
    }, [loggedIn]);

    /** Проверка токена, получение email */
    useEffect(() => {
        tokenCheck();
    }, []);

    /** Получаем данные залогиненного пользователя, пишем в состояние currentUser */
    /** Получаем массив карточек, пишем в состояние cards */
    useEffect(() => {
        if (loggedIn) {
            setIsLoadingAllData(true);
            api.getAllData()
                .then((data) => {
                    const [userData, cardsData] = data;
                    setCards(cardsData);
                    setCurrentUser(userData);
                })
                .catch(error => console.log(error))
                .finally(() => {
                    setIsLoadingAllData(false);
                })
        }
    }, [loggedIn]);

    return (<CurrentUserContext.Provider value={currentUser}>
        <div className="page__wrapper">
            <Header onSignOut={handleSignOut} userEmail={userEmail} loggedIn={loggedIn}/>
            <Switch>
                <ProtectedRoute exact path="/" loggedIn={loggedIn}>
                    <Main
                        cards={cards}
                        onCardClick={handleCardClick} // нажатие на карточку
                        onEditProfile={handleEditProfileClick} // редактирование профиля
                        onNewPlace={handleNewPlaceClick} // добавление карточки
                        onUpdateAvatar={handleUpdateAvatarClick} // редактирование аватара
                        onDeleteCard={handleDeletePlaceClick} // удаление карточки
                        onCardLike={handleCardLike} // лайк/дизлайк
                        isLoadingAllData={isLoadingAllData}
                    />
                </ProtectedRoute>
                <Route exact path="/sign-in">
                    <Login handleLogin={handleLogin} tokenCheck={tokenCheck}/>
                </Route>
                <Route exact path="/sign-up">
                    <Register handleRegister={handleRegister}/>
                </Route>
                <Route>
                    {loggedIn ? <Redirect to="/"/> : <Redirect to="/sign-in"/>}
                </Route>
            </Switch>
            <Footer/>

            {/** Всплывашка редактирования профиля */}
            <EditProfilePopup
                popupOpen={editProfilePopupOpen}
                isLoadingAllData={isLoadingAllData}
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
            <InfoTooltip
                popupOpen={infoTooltipOpen}
                onClose={closeAllPopups}
                type={infoTooltipType}
            />
        </div>
    </CurrentUserContext.Provider>);
}

export default App;
