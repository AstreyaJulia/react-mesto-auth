import React from "react";
import headerLogo from "../images/header__logo.png";

const Header = () => {
    return (
        <header className="header">
            <a className="header__link" href="/" title="Mesto Russia">
                <img className="header__logo" src={headerLogo} alt="Логотип Место"/>
            </a>
        </header>
    )
};

export default Header
