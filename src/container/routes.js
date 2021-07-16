import React, { lazy } from 'react';
import { URL } from "global/url";
const PrintReport = lazy(() => import("container/bam/ReportDesigner/ReportGenerator/print_report"))
const TestingWindow = lazy(() => import("container/bam/ReportDesigner/testingwindow"))
// import Navigation from "container/omniapp/Navigation/navigation";
// import Login from "container/omniapp/Login/login";
// import LandingPage from "container/omniapp/landing_page";
// import FirstTimeLogin from "container/omniapp/Login/login_ftl";
// import ReportGenerator from "container/bam/ReportDesigner/ReportGenerator/report_generate.js";


const Navigation = lazy(() => import("container/omniapp/Navigation/navigation"));
const Test = lazy(() => import("container/omniapp/Test/test"))
const Login = lazy(() => import("container/omniapp/Login/login"));
const LandingPage = lazy(() => import("container/omniapp/landing_page"));
// const Login = lazy(() => import("container/omniapp/external_applications/external_applications"));
const FirstTimeLogin = lazy(() => import("container/omniapp/Login/login_ftl"));
const ExtendSession = lazy(() => import("container/omniapp/Login/extend_session"));
const ReportGenerator = lazy(() => import("container/bam/ReportDesigner/ReportGenerator/report_generate.js"));
const Error = lazy(() => import("../global/error/error.js"));
const Data = lazy(() => import("./omniapp/Test/chart/HeatChart"));
const TemplateDemo = lazy(() => import("./webdesktop/TemplateDemo"));
const NotFound = () => {
    return (<h3>Not Found</h3>)
}
export const HomeRoute = [
    { path: `/login`, exact: true, component: Login, protected: false },
    { path: `${URL.WAR_URL}/navigation`, exact: true, component: Navigation, protected: false },
    { path: `${URL.WAR_URL}/test`, exact: true, component: Test, protected: true },
    { path: `${URL.WAR_URL}/config`, exact: true, component: Login, protected: false },
    { path: `${URL.WAR_URL}/login_ftl`, exact: true, component: FirstTimeLogin, protected: false },
    { path: `${URL.WAR_URL}/extendsession`, exact: true, component: ExtendSession, protected: false },
    { path: `${URL.WAR_URL}/testingWindow`, exact: true, component: TestingWindow, protected: true },
    { path: "/", exact: true, component: LandingPage, protected: true },
    { path: "/bam/generate/:id", exact: true, component: ReportGenerator, protected: true, locale: 'en_US' },
    { path: "/bam/generate/:id/print", exact: true, component: PrintReport, protected: true },
    { path: "/error", exact: false, component: Error, protected: false },
    { path: "/data", exact: false, component: Data, protected: false },
    { path: "/template_demo", exact: false, component: TemplateDemo, protected: false },
    { path: "*", exact: true, component: NotFound, protected: false }
]