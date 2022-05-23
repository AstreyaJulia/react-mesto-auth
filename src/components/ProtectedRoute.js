import React from "react";
import {Redirect, Route} from "react-router-dom";

const ProtectedRoute = ({loggedIn, children, path, exact}) => {
    return (
        <Route exact path={path}>
            {loggedIn ? children : <Redirect to="/sign-in"/>}
        </Route>
    )
}

export default ProtectedRoute;