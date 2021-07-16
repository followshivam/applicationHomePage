import React, { lazy } from 'react';
import {URL} from "global/url";
const TableComponent = lazy(() => import("./TableComponent/table"));
const CreateUpdateReport = lazy(() => import("./Create_Update_Report"));

const TestingWindow = lazy(() => import("./testingwindow"))
const NotFound = () => {
    return (<h3>Not Found</h3>)
}
export const HomeRoute = [
    { path:`${URL.WAR_URL}/report_designer`, exact: true, component: TableComponent },
    //  { path: "/report_designer/generate/:id", exact: true, component: ReportGenerator },
    { path: `${URL.WAR_URL}/report_designer/testingwindow`, exact: true, component: TestingWindow },
    { path: `${URL.WAR_URL}/report_designer/create`, exact: true, component: CreateUpdateReport },
    { path: "*", exact: true, component: NotFound }
]
// export const CreateReportRoute=[
//     {path:"/report_designer/create",exact:true,component:CreateUpdateReport},
//     {path:"/report_designer/create",exact:true,component:CreateUpdateReport},
//     {path:"*",exact:true,component:NotFound}  
// ]