import React from "react";
import { Redirect } from 'react-router-dom';

export const ProtectedAuth = (props) => {
    if (localStorage.getItem("oap_id") != null || localStorage.getItem("b-sid") !== null)
        return props.children
    else {
        localStorage.clear();
        return (<Redirect to={`/login`} />)
    }
}
export const NormalAuth = (props) => {
    if (localStorage.getItem("oap_id") == null)
        return props.children
    else {
        return (<Redirect to={`${process.env.REACT_APP_CONTEXT_PATH}`} />)
    }
}