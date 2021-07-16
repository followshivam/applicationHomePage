import ACTION from '../constant';
// export const CreateReport=(data)=>{
//     return async (dispatch,getState)=>{
//       dispatch({type:ACTION.CREATE_REPORT,payload:data})
//     }
// }
export const CreateReport = (data) => {
    return { type: ACTION.CREATE_REPORT, payload: data }
}
export const CreateTrend = (data) => {
    return { type: ACTION.CREATE_TREND, payload: data }
}
export const ResetTrend = (data) => {
    return { type: ACTION.RESET_TREND, payload: data }
}
export const FullScreenDialogInitialState = (data) => {
    return { type: ACTION.FULL_DIALOG, payload: data }
}

export const FullScreenDialogOpen = (component, label) => {
    return { type: ACTION.FULL_DIALOG_OPEN, payload: { component, label } }
}
export const FullScreenDialogClose = (data) => {
    return { type: ACTION.FULL_DIALOG_CLOSE, payload: data }
}
export const NormalScreenDialogInitialState = (data) => {
    return { type: ACTION.NORMAL_DIALOG, payload: data }
}

export const NormalScreenDialogOpen = (component, label) => {
    return { type: ACTION.NORMAL_DIALOG_OPEN, payload: { component, label } }
}
export const NormalScreenDialogClose = (data) => {
    return { type: ACTION.NORMAL_DIALOG_CLOSE, payload: data }
}
export const SnackBarInitialState = (data) => {
    return { type: ACTION.SNACKBAR, payload: data }
}
export const SnackBarOpen = (content, type, duration) => {
    return { type: ACTION.SNACKBAR_OPEN, payload: { content, type, duration } }
}
export const SnackBarClose = (data) => {
    return { type: ACTION.SNACKBAR_CLOSE, payload: data }
}
//added by rishu.trivedi

export const CreateAddReport = data => {
    return { type: ACTION.CREATE_ADD_REPORT, payload: data }
}

export const ResetAddReport = data => {
    return { type: ACTION.RESET_ADD_REPORT, payload: data }
}

export const CreateSchedule = data => {
    return { type: ACTION.CREATE_SCHEDULE, payload: data }
}

export const ResetSchedule = data => {
    return { type: ACTION.RESET_SCHEDULE, payload: data }
}

// Added By sandeep Singh
export const LoginDetails = data => {
    return { type: ACTION.LOGIN_DETAILS, payload: data }
}
// Added by Manik
export const LogoutDetails = data => {
    return { type: ACTION.LOGOUT_DETAILS, payload: data }
}

export const GlobalSettings = data => {
    return { type: ACTION.GLOBAL_SETTINGS, payload: data }
}

export const ReportDetails = data => {
    return { type: ACTION.REPORT_DETAILS, payload: data }
}

export const SetRegexDetails = data => {
    return { type: ACTION.SET_REGEX, payload: data }
}
