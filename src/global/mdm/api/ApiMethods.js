import { Get } from './HttpMethods'
import { Post } from './HttpMethods'
import { URL } from 'global/url'
export const Header = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        // withCredentials:true
    }
}
// export const HeaderWithToken = {
//     headers: {
//         //   Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'WD_SID': localStorage.getItem('WD_SID'),
//         withCredentials: true
//     }
// }

export const LoginMDMHandler = async data => {
    try {
        const res = await Post(URL.MDMAPPLOGIN, data, Header)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}

export const GetCategories = async data => {
    try {
        const res = await Post(URL.GETCATEGORIES, data, Header)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
};

export const SearchCategory = async data => {
    try {
        const res = await Post(URL.SEARCHCATEGORY, data, Header)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
};

export const GetDataObjects = async data => {
    try {
        const res = await Post(URL.GETDATAOBJECTS, data, Header)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
};