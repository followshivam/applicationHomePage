import React from 'react';
import {Redirect} from "react-router-dom"
import axios from 'axios';

const redirectHandler=(err)=>{
    if(err && err.response.status==401){
        localStorage.clear();window.location.replace("/login")
    }else{
        throw(err)
    }
}
export const Get = (url) => {
    return axios.get(url).then(
        res => {
            return res.status === 200 ? res : null
        }, err => {
            redirectHandler(err)
        });
}

export const Post = (url, data, header) => {
    if (header == null)
        return axios.post(url, data).then(res => res.status === 200 ? res : null, err => redirectHandler(err));
    else {
        // return axios.post(url,data,header).then(res=>res.status===200?res:null,err=>err);
        return axios.post(url, data, header).then(res => res.status === 200 ? res : null).catch((err) =>redirectHandler(err));
        // console.log(x) ;
        // return x   
    }
}
