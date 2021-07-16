// const CLIENTURL = 'http://192.168.38.66:9001'
//const BAM_BASEURL = 'http://192.168.142.21:8080/api';
// const BAM_BASEURL = 'http://192.168.142.21:9080/bam-ws/app';
//const BAM_BASEURL = 'http://192.168.38.66:9080/bam-ws/app';
// const BAM_BASEURL = 'http://192.168.38.66:8180/bam-ws/app'
// const BAM_BASEURL = 'http://192.168.153.130:8080/bam-ws/app';

//const BAM_BASEURL = 'http://192.168.142.21:8080/api';
// const BAM_BASEURL = 'http://192.168.142.21:9080/bam-ws/app';
//const BAM_BASEURL = 'http://localhost:9080/bam-ws/app';
// const BAM_BASEURL = 'http://localhost:8180/bam-ws/app'
// const BAM_BASEURL = 'http://192.168.153.130:8080/bam-ws/app';

//! For Deployment
// const OMNIAPP_BASEURL = '/oap-rest/app';
// const CLIENTURL = ''
// const BAM_BASEURL = '/bam-ws/app';

//! For Development
const OMNIAPP_BASEURL = '/oap-rest/app'
const CLIENTURL = ''
const BAM_BASEURL = '/bam-ws/app'
const WAR_URL = ''
const WD_BASEURL = '/wd-rest/app'
const MDM_BASEURL = '/mdm-rest/app'

/*-----------------  OMNIAPP URL-------------------*/
const GETAPPLICATIONLIST = OMNIAPP_BASEURL + '/getapplicationlist'
const APPLOGINCONF = OMNIAPP_BASEURL + '/getloginconf'
const OMNIAPPLOGIN = OMNIAPP_BASEURL + '/login'
const WORKSPACEDEF = OMNIAPP_BASEURL + '/getworkspacedef'
const LOGOUT = OMNIAPP_BASEURL + '/logout'
const APPLICATION_LIST = OMNIAPP_BASEURL + '/applications'
const GETCABLIST = OMNIAPP_BASEURL + '/getcablist'
const GETAPPSERVERS = OMNIAPP_BASEURL + '/getappservers'
const GETLOCALELIST = OMNIAPP_BASEURL + '/getlocalelist'
const CONNECTSERVER = OMNIAPP_BASEURL + '/connectserver'
const ACTCAB = OMNIAPP_BASEURL + '/actcab'
const GETCOMPLIST = OMNIAPP_BASEURL + '/getcomplist'
const ACTCOMP = OMNIAPP_BASEURL + '/actcomp'
const GETCOMPINSLIST = OMNIAPP_BASEURL + '/getcompinslist'
const GETAPPLIST = OMNIAPP_BASEURL + '/getapplist'
const ACTAPP = OMNIAPP_BASEURL + '/actapp'
const GETWORKSPACELIST = OMNIAPP_BASEURL + '/getworkspacelist'
const ACTWORKSPACE = OMNIAPP_BASEURL + '/actworkspace'
const GETVIEWLIST = OMNIAPP_BASEURL + '/getviewlist'
const ACTVIEW = OMNIAPP_BASEURL + '/actview'
const GETTABLIST_OMNIAPP = OMNIAPP_BASEURL + '/gettablist'
const ACTTAB = OMNIAPP_BASEURL + '/acttab'
const AUDITHISTORY = OMNIAPP_BASEURL + '/audithistory'
const GETEXTAPPLIST = OMNIAPP_BASEURL + '/getextapplist'
const ACTEXTAPP = OMNIAPP_BASEURL + '/actextapp'
const EXPORTIMPORTCONFIG = OMNIAPP_BASEURL + '/exportimportconfig'
const GETCOMPDETAILS = OMNIAPP_BASEURL + '/getcompdetails'
const GETMULTILINGUALCONF = OMNIAPP_BASEURL + '/getmultilingualconf'
const GETENTITYLIST = OMNIAPP_BASEURL + '/getentitylist'
const ACTMULTILINGUALDEF = OMNIAPP_BASEURL + '/actmultilingualdef'
const ACTCACHE = OMNIAPP_BASEURL + '/actcache'
const GETCAPTCHA = OMNIAPP_BASEURL + '/getcaptcha'
const EXTCONNECT = OMNIAPP_BASEURL + '/extconnect'
const GETCONFIG = BAM_BASEURL + '/getconfig'
const GETSTAGINGCABDETAILS = BAM_BASEURL + '/get_staging_cabdetails'

/*-----------------END OMNIAPP URL-------------------*/

const BAMAPPLOGIN = BAM_BASEURL + '/applogin'
const SAVEREPORT = BAM_BASEURL + '/save_report'
const GETREPORTLIST = BAM_BASEURL + '/getreportlist'
const GROUPLIST = BAM_BASEURL + '/group_list'
const REPORTACTION = BAM_BASEURL + '/act_report'
const SCHEDULERACTION = BAM_BASEURL + '/act_scheduler'
const TABACTION = BAM_BASEURL + '/act_tab'
const TEMPLATELIST = BAM_BASEURL + '/get_template_list'
const TEMPLATEACTION = BAM_BASEURL + '/act_template'
const DASHBOARDACTION = BAM_BASEURL + '/act_dashboard'
const GETCATEGORYLIST = BAM_BASEURL + '/getcategorylist'
const IMPORTEXPORT = BAM_BASEURL + '/import_export_report'
const IMPORTREPORT = BAM_BASEURL + '/import_report'
const USERPREFERENCESLIST = BAM_BASEURL + '/userpreferences_list'
const CATEGORYACTION = BAM_BASEURL + '/act_category'
const FETCHSQLPLAN = BAM_BASEURL + '/fetchsqlplan'
const ACTHEALTH = BAM_BASEURL + '/act_health'
const GETHEALTHCONFIG = BAM_BASEURL + '/health_status_config'
const GETHEALTHSTATUS = BAM_BASEURL + '/gethealthstatus'
const GETREPORTGENDATA = BAM_BASEURL + '/generate_report'
const TABLE_DATA = BAM_BASEURL + '/fetch_db_def'
const GETREPORTSCHEDULERLIST = BAM_BASEURL + '/getschedulerlist'
const GETTABLIST = BAM_BASEURL + '/get_tab_list'
const VALIDATEQUERY = BAM_BASEURL + '/validate_query'
const AUTHENTICATEUSER = BAM_BASEURL + '/authenticate_user'
const ACTTREND = BAM_BASEURL + '/act_trend'
const ACTSTAGINGCAB = BAM_BASEURL + '/act_staging_cab'
const GETTRENDDEFINITION = BAM_BASEURL + '/get_trend_definition'
const GETSCHEDULERDEF = BAM_BASEURL + '/get_scheduler_def'
const ACTUSERPEF = BAM_BASEURL + '/act_user_pref'
const GETUSERPEF = BAM_BASEURL + '/get_user_pref'
const GETTRENDLIST = BAM_BASEURL + '/get_trendlist'
const GETREPORTDEFINITION = BAM_BASEURL + '/get_report_definition'
const GETPICKLISTDATA = BAM_BASEURL + '/fetch_picklist_data'
const SCHEDULER_MANAGEMENT = BAM_BASEURL + '/sch_mgmt'
const GETUSERLIST = BAM_BASEURL + '/user_list'
const AUDITLOG = BAM_BASEURL + '/audit_log'
const GETDASHBOARDLIST = BAM_BASEURL + '/get_dashboard_list'
const GETDASHBOARDDEF = BAM_BASEURL + '/get_dashboard_def'
const ACTREPORTINSTANCE = BAM_BASEURL + '/act_report_instance'
const HOMETILES = BAM_BASEURL + '/gethometiles'

const GETREPORTINSTANCEDEFINITION = BAM_BASEURL + '/get_report_instance_definition'
const GETALERTLIST = BAM_BASEURL + '/get_alert_list'
const EXTERNALCONNECT = '/bam-ws' + '/ExtendSession'

/*-----------------START WEBDESKTOP URL-------------------*/
const WDAPPLOGIN = WD_BASEURL + '/applogin'
const WDGETREGEX = WD_BASEURL + '/getregex'
const WDGETQUEUELIST = WD_BASEURL + '/getqueuelist'
const WDGETPREFQUEUES = WD_BASEURL + '/getpreferredqueues'
const WDSETPREFQUEUES = WD_BASEURL + '/setpreferredqueues'
const WDGETCRITERIA = WD_BASEURL + '/getcriterialist'
const WDGETSEARCHCONF = WD_BASEURL + '/getsearchconf'
const WDGETWORKITEMLIST = WD_BASEURL + '/getworkitemlist'
const WDGETALIASLIST = WD_BASEURL + '/getaliaslist'
/*-----------------END WEBDESKTOP URL-------------------*/

const MDMAPPLOGIN = MDM_BASEURL + '/applogin'
const GETCATEGORIES = MDM_BASEURL + '/categories'
const GETDATAOBJECTS = MDM_BASEURL + '/dataobjects'
const SEARCHCATEGORY = MDM_BASEURL + '/search'


export const URL = {
   GETREPORTSCHEDULERLIST,
   WAR_URL,
   TABLE_DATA,
   ACTUSERPEF,
   GETSTAGINGCABDETAILS,
   ACTSTAGINGCAB,
   GETUSERPEF,
   VALIDATEQUERY,
   GETCATEGORYLIST,
   IMPORTREPORT,
   GETTABLIST,
   CLIENTURL,
   REPORTACTION,
   SCHEDULERACTION,
   DASHBOARDACTION,
   GETREPORTGENDATA,
   GETHEALTHCONFIG,
   TEMPLATELIST,
   BAMAPPLOGIN,
   IMPORTEXPORT,
   SAVEREPORT,
   GETREPORTLIST,
   FETCHSQLPLAN,
   GROUPLIST,
   ACTHEALTH,
   GETSCHEDULERDEF,
   USERPREFERENCESLIST,
   TEMPLATEACTION,
   TABACTION,
   GETHEALTHSTATUS,
   CATEGORYACTION,
   GETTRENDLIST,
   GETREPORTDEFINITION,
   AUTHENTICATEUSER,
   ACTTREND,
   GETTRENDDEFINITION,
   GETPICKLISTDATA,
   SCHEDULER_MANAGEMENT,
   AUDITLOG,
   GETUSERLIST,
   GETDASHBOARDLIST,
   GETDASHBOARDDEF,
   ACTREPORTINSTANCE,
   GETREPORTINSTANCEDEFINITION,
   GETALERTLIST,

   OMNIAPPLOGIN,
   LOGOUT,
   ACTAPP,
   APPLOGINCONF,
   WORKSPACEDEF,
   APPLICATION_LIST,
   GETCABLIST,
   GETLOCALELIST,
   CONNECTSERVER,
   GETAPPSERVERS,
   ACTCAB,
   GETCOMPLIST,
   ACTCOMP,
   GETCOMPINSLIST,
   GETVIEWLIST,
   GETWORKSPACELIST,
   ACTWORKSPACE,
   GETAPPLIST,
   GETEXTAPPLIST,
   ACTEXTAPP,
   ACTVIEW,
   GETTABLIST_OMNIAPP,
   ACTTAB,
   AUDITHISTORY,
   EXPORTIMPORTCONFIG,
   GETCOMPDETAILS,
   GETMULTILINGUALCONF,
   GETENTITYLIST,
   ACTMULTILINGUALDEF,
   ACTCACHE,
   GETCAPTCHA,
   EXTCONNECT,
   GETCONFIG,
   EXTERNALCONNECT,
   HOMETILES,
   GETAPPLICATIONLIST,
   WDAPPLOGIN,
   WDGETREGEX,
   MDMAPPLOGIN,
   WDGETQUEUELIST,
   WDGETPREFQUEUES,
   WDSETPREFQUEUES,
   WDGETCRITERIA,
   WDGETSEARCHCONF,
   WDGETWORKITEMLIST,
   WDGETALIASLIST,
   GETDATAOBJECTS,
   SEARCHCATEGORY,
   GETCATEGORIES
}
