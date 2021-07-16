import { combineReducers } from 'redux'
import {
   ScheduleState,
   ReportState,
   TrendState,
   FullDialogState,
   NormalDialogState,
   SnackbarState,
   AddReportState,
   GlobalSettings
} from '../action/initialstate'
import ACTION from '../constant'
const CreateReportReducer = (state = ReportState, action) => {
   switch (action.type) {
      case ACTION.CREATE_REPORT:
         return action.payload
      default:
         return state
   }
}
const CreateTrendReducer = (state = TrendState, action) => {
   switch (action.type) {
      case ACTION.CREATE_TREND:
         return action.payload
      case ACTION.RESET_TREND:
         return action.payload
      default:
         return state
   }
}
const FullDialogReducer = (state = FullDialogState, action) => {
   switch (action.type) {
      case ACTION.FULL_DIALOG:
         return action.payload
      case ACTION.FULL_DIALOG_OPEN:
         return {
            ...state,
            open: true,
            label: action.payload.label,
            component: action.payload.component
         }
      case ACTION.FULL_DIALOG_CLOSE:
         return { ...state, open: false, component: null, label: '' }
      default:
         return state
   }
}
const NormalDialogReducer = (state = NormalDialogState, action) => {
   switch (action.type) {
      case ACTION.NORMAL_DIALOG:
         return action.payload
      case ACTION.NORMAL_DIALOG_OPEN:
         return {
            ...state,
            open: true,
            label: action.payload.label,
            component: action.payload.component
         }
      case ACTION.NORMAL_DIALOG_CLOSE:
         return { ...state, open: false, component: null, label: '' }
      default:
         return state
   }
}
const SnackbarReducer = (state = SnackbarState, action) => {
   switch (action.type) {
      case ACTION.SNACKBAR:
         return action.payload
      case ACTION.SNACKBAR_OPEN:
         return {
            ...state,
            open: true,
            content: action.payload.content,
            type: action.payload.type,
            duration: action.payload.duration
         }
      case ACTION.SNACKBAR_CLOSE:
         return { ...state, open: false, content: '', type: '', duration: 2000 }
      default:
         return state
   }
}

//added
const createAddReportStateReducer = (state = AddReportState, action) => {
   switch (action.type) {
      case ACTION.CREATE_ADD_REPORT:
         return action.payload
      case ACTION.RESET_ADD_REPORT:
         return action.payload
      default:
         return state
   }
}
const createScheduleStateReducer = (state = ScheduleState, action) => {
   switch (action.type) {
      case ACTION.CREATE_SCHEDULE:
         return action.payload
      case ACTION.RESET_SCHEDULE:
         return action.payload
      default:
         return state
   }
}

const loginDetails = (state = {}, action) => {
   switch (action.type) {
      case ACTION.LOGIN_DETAILS:
         return action.payload
      case ACTION.LOGOUT_DETAILS:
         return {};
      default:
         return state
   }
}

const globalSettingsReducer = (state = GlobalSettings, action) => {
   switch (action.type) {
      case ACTION.GLOBAL_SETTINGS:
         return action.payload
      default:
         return state
   }
}

const reportDetailsReducer = (state = {}, action) => {
   switch (action.type) {
      case ACTION.REPORT_DETAILS:
         return action.payload
      default:
         return state
   }
}

// new regex reducer 
// const regex = {
//    "BAM" : {

//    },
//    "WD" : {

//    }
// }
const regexDetailsReducer = (state = {}, action) => {
   switch (action.type) {
      case ACTION.SET_REGEX:
         const updatedRegex = { ...state, ...action.payload };
         return updatedRegex;
      default:
         return state
   }
}

const reducers = combineReducers({
   createReportState: CreateReportReducer,
   createTrendsState: CreateTrendReducer,
   fullDialogState: FullDialogReducer,
   normalDialogState: NormalDialogReducer,
   snackbarState: SnackbarReducer,
   createAddReportState: createAddReportStateReducer,
   createScheduleState: createScheduleStateReducer,
   loginDetails: loginDetails,
   globalSettings: globalSettingsReducer,
   reportDetails: reportDetailsReducer,
   regexDetails: regexDetailsReducer
})

export default reducers
