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
      'b-sid': localStorage.getItem('b-sid'),
      withCredentials: true
   }
}
export const LoginHandler = async data => {
   try {
      const res = await Post(URL.BAMAPPLOGIN, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetReportList = async data => {
   //     return Post("http://192.168.142.21:9080/bam-ws/app/getreportlist",data,HeaderWithToken).then((res)=>{return (res&&res.data)?res.data:[]}).catch((err)=>{
   // console.log(err);
   // return err
   //     })

   try {
      const res = await Post(URL.GETREPORTLIST, data, HeaderWithToken)
      //const res= await Post("http://192.168.142.21:9080/bam-ws/app/getreportlist",data,HeaderWithToken);
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const HomeTiles = async data => {
   try {
      const res = await Post(URL.HOMETILES, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ReportAction = async data => {
   try {
      const res = await Post(URL.REPORTACTION, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const SchedulertAction = async data => {
   try {
      const res = await Post(URL.SCHEDULERACTION, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const GetCategoryList = async data => {
   try {
      const res = await Post(URL.GETCATEGORYLIST, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const CategoryAction = async data => {
   try {
      const res = await Post(URL.CATEGORYACTION, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const GetHealth = async data => {
   try {
      const res = await Post(URL.GETHEALTHSTATUS, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const FetchSqlPlan = async data => {
   try {
      const res = await Post(URL.FETCHSQLPLAN, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActHealthStatus = async data => {
   try {
      const res = await Post(URL.ACTHEALTH, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetHealthConfigData = async data => {
   try {
      const res = await Post(URL.GETHEALTHCONFIG, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const CreateNewHealthException = async (
   duplicateExcetption,
   newSelectedException
) => {
   try {
      await GetHealthConfigData(duplicateExcetption)
         .then(res => {
            const payload = {
               ...res.data.data,
               block_frequency_time_bound: new Date(
                  res.data.data.block_frequency_time_bound * 1000
               )
                  .toISOString()
                  .substr(11, 8),
               report_index: newSelectedException.report_index,
               operation: 'I'
            }
            GetHealthConfigData(payload).then(res => {
               return res && res.data ? res.data : null
            })
         })
         .catch(err => {})
   } catch (err) {
      return null
   }
}

export const GetReportGenerateData = async data => {
   try {
      const res = await Post(URL.GETREPORTGENDATA, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetTableData = async data => {
   try {
      const res = await Post(URL.TABLE_DATA, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ValidateQuery = async data => {
   try {
      const res = await Post(URL.VALIDATEQUERY, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetTabAction = async data => {
   try {
      const res = await Post(URL.TABACTION, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const SaveReport = async data => {
   try {
      const res = await Post(URL.SAVEREPORT, data, {
         headers: {
            ...HeaderWithToken.headers,
            Accept: 'application/json, application/pdf'
         }
      })
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const ImportExportReport = async data => {
   try {
      const res = await Post(URL.IMPORTEXPORT, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const ImportReport = async data => {
   try {
      const res = await Post(URL.IMPORTREPORT, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const GetTemplateList = async data => {
   try {
      const res = await Post(URL.TEMPLATELIST, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const GetTabList = async data => {
   try {
      const res = await Post(URL.GETTABLIST, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GroupList = async data => {
   try {
      const res = await Post(URL.GROUPLIST, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const UserPrefrencesList = async data => {
   try {
      const res = await Post(URL.USERPREFERENCESLIST, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const TemplateAction = async data => {
   try {
      const res = await Post(URL.TEMPLATEACTION, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const DashboardAction = async data => {
   try {
      const res = await Post(URL.DASHBOARDACTION, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

//shantanu
export const GetTrendList = async data => {
   try {
      const res = await Post(URL.GETTRENDLIST, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const GetReportDefinition = async data => {
   try {
      const res = await Post(URL.GETREPORTDEFINITION, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetSchedulerList = async data => {
   try {
      const res = await Post(URL.GETREPORTSCHEDULERLIST, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const AuthenticateUser = async data => {
   try {
      const res = await Post(URL.AUTHENTICATEUSER, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActTrend = async data => {
   try {
      const res = await Post(URL.ACTTREND, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetTrendDefinition = async data => {
   try {
      const res = await Post(URL.GETTRENDDEFINITION, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetPicklistData = async data => {
   try {
      const res = await Post(URL.GETPICKLISTDATA, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const GetUserList = async data => {
   try {
      const res = await Post(URL.GETUSERLIST, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const SchedulerManagement = async data => {
   try {
      const res = await Post(URL.SCHEDULER_MANAGEMENT, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetAuditLog = async data => {
   try {
      const res = await Post(URL.AUDITLOG, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetDashboardList = async data => {
   try {
      const res = await Post(URL.GETDASHBOARDLIST, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}
export const GetDashboardDef = async data => {
   try {
      const res = await Post(URL.GETDASHBOARDDEF, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActReportInstance = async data => {
   try {
      const res = await Post(URL.ACTREPORTINSTANCE, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetReportInstanceDefinition = async data => {
   try {
      const res = await Post(
         URL.GETREPORTINSTANCEDEFINITION,
         data,
         HeaderWithToken
      )
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetAlertList = async data => {
   try {
      const res = await Post(URL.GETALERTLIST, data, Header)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetSchedulerDefinition = async data => {
   try {
      const res = await Post(URL.GETSCHEDULERDEF, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetUserPref = async data => {
   try {
      const res = await Post(URL.GETUSERPEF, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActUserPref = async data => {
   try {
      const res = await Post(URL.ACTUSERPEF, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const GetStagingCabDetails = async data => {
   try {
      const res = await Post(URL.GETSTAGINGCABDETAILS, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ActStagingCab = async data => {
   try {
      const res = await Post(URL.ACTSTAGINGCAB, data, HeaderWithToken)
      return res && res.data ? res.data : null
   } catch (err) {
      return null
   }
}

export const ExtConnect = async data => {
   window.open(`${URL.EXTERNALCONNECT}?${serialize(data)}`, '_blank')
}

const serialize = obj => {
   var str = []
   for (var p in obj)
      if (obj.hasOwnProperty(p)) {
         str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
   return str.join('&')
}
