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
export const HeaderWithToken = {
    headers: {
        //   Accept: 'application/json',
        'Content-Type': 'application/json',
        'WD_SID': localStorage.getItem('WD_SID'),
        withCredentials: true
    }
}

export const LoginWDHandler = async data => {
    try {
        const res = await Post(URL.WDAPPLOGIN, data, Header)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}

export const GetRegexHandler = async () => {
    try {
        const res = await Post(URL.WDGETREGEX, {}, HeaderWithToken)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}

export const GetQueueList = async data => {
    try {
        const res = await Post(URL.WDGETQUEUELIST, data, HeaderWithToken)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}

export const GetPrefQueues = async data => {
    try {
        const res = await Post(URL.WDGETPREFQUEUES, data, HeaderWithToken)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}

export const SetPrefQueues = async data => {
    try {
        const res = await Post(URL.WDSETPREFQUEUES, data, HeaderWithToken)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}

export const GetCriteria = async data => {
    try {
        const res = await Post(URL.WDGETCRITERIA, data, HeaderWithToken)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}
export const GetSearchConf = async data => {
    try {
        const res = await Post(URL.WDGETSEARCHCONF, data, HeaderWithToken)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}
export const GetWorkItemList = async data => {
    try {
        const res = await Post(URL.WDGETWORKITEMLIST, data, HeaderWithToken)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}
export const GetAliasList = async data => {
    try {
        const res = await Post(URL.WDGETALIASLIST, data, HeaderWithToken)
        return res && res.data ? res.data : null
    } catch (err) {
        return null
    }
}