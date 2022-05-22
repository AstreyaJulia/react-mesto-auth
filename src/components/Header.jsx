import React from "react";
import headerLogo from "../images/header__logo.png";
import {Link, useLocation} from "react-router-dom";

const Header = (props) => {

    /** Стейт видимости кнопки меню на маленьких разрешениях */
    const [menuButtonActive, setMenuButtonActive] = React.useState(false);
    const location = useLocation();

    /** Открывалка меню */
    function handleOpenMenu() {
        setMenuButtonActive(!menuButtonActive);
    }

    return (<header className={props.loggedIn ? "header header_open" : "header"}>
        <nav className="header__nav">
            <div className="header__nav-wrapper">
                <a className="header__link" href="/" title="Mesto Russia">
                    <img className="header__logo" src={headerLogo} alt="Логотип Место"/>
                </a>
                {props.loggedIn && (<button
                    className={menuButtonActive ? "header__menu-button header__menu-button_active button" : "header__menu-button button"}
                    type="button"
                    aria-label="Меню"
                    onClick={handleOpenMenu}
                />)}
                {!props.loggedIn && (<>

                    {location.pathname === "/register" && (
                        <Link to="/login" className="header__button button">Войти</Link>)}
                    {location.pathname === "/login" && (
                        <Link to="/register" className="header__button button">Регистрация</Link>)}
                </>)}
            </div>
            {props.loggedIn &&
                (
                    <div className={menuButtonActive ? "header__menu header__menu_open" : "header__menu"}>
                        <p className="header__email">{props.userEmail}</p>
                        { /* eslint-disable-next-line */}
                        <a onClick={props.onSignOut} className="header__button header__button-logout button">
                            Выйти
                        </a>
                    </div>
                )}
        </nav>
    </header>)
};

export default Header
