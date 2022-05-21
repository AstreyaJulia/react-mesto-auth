import React from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

/** Карточка изображения
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Card = (props) => {

    /** Контекст currentUser */
    const currentUser = React.useContext(CurrentUserContext);

    /** Название карточки, ссылка на изображение, владелец карточки, массив лайков */
    const {name, link, owner, likes} = props.card;

    /** Есть ли лайк текущего пользователя на карточке */
    const isLiked = likes.some(i => i._id === currentUser._id);

    /** Нажатие на карточку */
    function handleClick() {
        props.onCardClick(props.card);
    }

    /** Лайк/дизлайк */
    function handleLikeClick() {
        props.onCardLike(props.card);
    }

    /** Удаление карточки */
    function handleDeleteClick() {
        props.onDeleteCard(props.card);
    }

    return (
        <li>
            <article className="photo-card">
                {owner._id === currentUser._id
                    ? <button className="photo-card__delete button" type="button" aria-label="Удалить место"
                              onClick={handleDeleteClick}/>
                    : null
                }
                <img className="photo-card__image button" alt={name}
                     src={`${link}`} onClick={handleClick}/>
                <div className="photo-card__footer">
                    <p className="photo-card__title">{name}</p>
                    <div className="photo-card__like-container">
                        <button
                            className={["photo-card__like-button button", isLiked ? "photo-card__like-button_active" : ""].join(" ")}
                            type="button"
                            aria-label="Поставить лайк" onClick={handleLikeClick}/>
                        <p className="photo-card__like-counter">{likes.length}</p>
                    </div>
                </div>
            </article>
        </li>
    )
};

export default Card
