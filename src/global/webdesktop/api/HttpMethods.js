import React from 'react';
import { Redirect } from "react-router-dom"
import axios from 'axios';

const redirectHandler = (err) => {
    if (err && err.response.status == 401) {
        localStorage.clear(); return <Redirect to={`/login`} />
    } else {

        throw (err)
    }
}
export const Get = (url, header) => {
    return axios.get(url, header).then(res => res.status === 200 ? res : null, err => redirectHandler(err));
}

export const Post = (url, data, header) => {
    axios.defaults.headers.common['WD_SID'] = localStorage.getItem("WD_SID");
    return axios.post(url, data).then(res => res.status === 200 ? res : null).catch((err) => redirectHandler(err));

}
