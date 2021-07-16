import axios from 'axios';

export const Get = (url) => {
    return axios.get(url).then(
        res => {
            return res.status === 200 ? res : null
        }, err => {
            return err
        });
}

export const Post = (url, data, header) => {
    if (header == null)
        return axios.post(url, data).then(res => res.status === 200 ? res : null, err => err);
    else {
        // return axios.post(url,data,header).then(res=>res.status===200?res:null,err=>err);
        return axios.post(url, data, header).then(res => res.status === 200 ? res : null).catch((err) => { throw (err) });
        // console.log(x) ;
        // return x   
    }
}
