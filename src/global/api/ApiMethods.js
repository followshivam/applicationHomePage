import { Get } from './HttpMethods'
import { Post } from './HttpMethods'
import { URL } from 'global/url'

export const Header = {
   headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // withCredentials:true
   }
}
export const HeaderWithToken = {
   headers: {
      //   Accept: 'application/json',
      'Content-Type': 'application/json',
      'b-sid': localStorage.getItem('token'),
      withCredentials: true
   }
}
export const LoginHandler = async data => {
   try {
      const res = await Post(URL.APPLOGIN, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const LoginConfHandler = async () => {
   try {
      const res = await Get(URL.APPLOGINCONF)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}