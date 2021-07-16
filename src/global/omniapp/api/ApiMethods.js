import { Get } from './HttpMethods'
import { Post } from './HttpMethods'
import { URL } from 'global/url'
import { getWorkSpace, applist } from 'global/json'

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
      'b-sid': localStorage.getItem('b-sid'),
      withCredentials: true
   }
}
export const LoginHandler = async data => {
   try {
      const res = await Post(URL.OMNIAPPLOGIN, data, Header)
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


// Sandeep Singh

export const GetWorkspaceDef = async (data) => {
   try {
      const res = await Post(URL.WORKSPACEDEF, data)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const Logout = async (data) => {
   try {
      const res = await Post(URL.LOGOUT, data)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetApplictionList = async (data) => {
   try {
      const res = await Post(URL.GETAPPLIST, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetConfig = async () => {
   try {
      const res = await Post(URL.GETCONFIG, {}, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActApp = async (data) => {
   try {
      const res = await Post(URL.ACTAPP, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetCabList = async (data) => {
   try {
      const res = await Post(URL.GETCABLIST, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetExternalApplictionList = async () => {
   try {
      const res = await Post(URL.GETEXTAPPLIST, {}, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActExtApp = async (data) => {
   try {
      const res = await Post(URL.ACTEXTAPP, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetLocaleList = async () => {
   try {
      const res = await Post(URL.GETLOCALELIST)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetMultilingualConf = async () => {
   try {
      const res = await Post(URL.GETMULTILINGUALCONF)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActMultilingualDef = async (data) => {
   try {
      const res = await Post(URL.ACTMULTILINGUALDEF, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetEntityList = async (data) => {
   try {
      const res = await Post(URL.GETENTITYLIST, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}



export const ConnectServer = async (data) => {
   try {
      const res = await Post(URL.CONNECTSERVER, data, Header)
      console.log(res);
      return res && res.data ? res.data : null
   } catch (err) {
      console.log(err)
      return null
   }
}

export const ActCab = async (data) => {
   try {
      const res = await Post(URL.ACTCAB, data, Header)
      console.log(res);
      return res && res.data ? res.data : null
   } catch (err) {
      console.log(err)
      return null
   }
}

export const GetAppServers = async () => {
   try {
      const res = await Post(URL.GETAPPSERVERS)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetCompList = async (data) => {
   try {
      const res = await Post(URL.GETCOMPLIST, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const GetCompInsList = async (data) => {
   try {
      const res = await Post(URL.GETCOMPINSLIST, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetCompDetails = async (data) => {
   try {
      const res = await Post(URL.GETCOMPDETAILS, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActComp = async (data) => {
   try {
      const res = await Post(URL.ACTCOMP, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetAppList = async (data) => {
   try {
      const res = await Post(URL.GETAPPLIST, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetWorkspaceList = async () => {
   try {
      const res = await Get(URL.GETWORKSPACELIST)
      return res && res.data ? res.data : null
   } catch (err) {
      console.log(err)
      return null
   }
}

export const ActWorkspace = async (data) => {
   try {
      const res = await Post(URL.ACTWORKSPACE, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetViewList = async (data) => {
   try {
      const res = await Post(URL.GETVIEWLIST, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActView = async (data) => {
   try {
      const res = await Post(URL.ACTVIEW, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetTabList = async (data) => {
   try {
      const res = await Post(URL.GETTABLIST_OMNIAPP, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActTab = async (data) => {
   try {
      const res = await Post(URL.ACTTAB, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetAuditLog = async (data) => {
   try {
      const res = await Post(URL.AUDITHISTORY, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ExportImportConfig = async (data) => {
   try {
      const res = await Post(URL.EXPORTIMPORTCONFIG, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}


export const ActCache = async (data) => {
   try {
      const res = await Post(URL.ACTCACHE, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetCaptcha = async (data) => {
   try {
      const res = await Post(URL.GETCAPTCHA, data, Header)
      return res
   } catch (err) {
      return null
   }
}

export const ExtConnect = async (data) => {
   try {
      const res = await Post(URL.EXTCONNECT, data, Header)
      return res
   } catch (err) {
      return null
   }
}

export const GetApplicationList = async (data) => {
   try {
      const res = await Post(URL.GETAPPLICATIONLIST, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}


