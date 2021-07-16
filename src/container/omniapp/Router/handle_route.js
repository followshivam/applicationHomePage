import React, { useEffect, lazy, Suspense } from 'react'
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { Spinner } from "component"
import Login from '../Login/login';
import LandingPage from 'container/omniapp/landing_page'
import { URL } from "global/url";
import Navigation from '../Navigation/navigation';
import Test from '../Test/test';
import FirstTimeLogin from '../Login/login_ftl';
import ExtendSession from '../Login/extend_session';
const ReportGenerator = lazy(() => import("container/bam/ReportDesigner/ReportGenerator/report_generate.js"));
const RouteHandler = (props) => {

    const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = React.useState(false);
    let history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('session_id') && localStorage.getItem('oap_id') && localStorage.getItem('expiresIn')) {
            console.log("hvhjb")
            const storageDate = new Date(localStorage.getItem('expiresIn'));
            if (Math.abs(new Date() - storageDate) / 1000 < 3600) {
                setIsAlreadyLoggedIn(true);
                return;
            }
            setLoggedOut();
        }
    }, [])

    const setLoggedOut = () => {
        console.log("hi")
        localStorage.clear();
        setIsAlreadyLoggedIn(false);

        //  props.history.push("/")
    }
    const setLoggedIn = (data) => {
        localStorage.setItem('session_id', data.session_id);
        localStorage.setItem('oap_id', data.OAP_Id)
        localStorage.setItem('user_name', data.user_name);
        localStorage.setItem('user_id', data.user_index);
        localStorage.setItem('expiresIn', new Date());
        setIsAlreadyLoggedIn(true);
        // history.replace('/home');
    }

    let routes = (<Switch>
        <Route path="/config" exact>
            {isAlreadyLoggedIn ? <Redirect to="/home" /> : <Login config={true} logIncallback={setLoggedIn} />}
        </Route>
        <Route
            path={`${URL.WAR_URL}/bam/generate/:id`}

            render={props => (
                <Suspense fallback={<div style={{ height: "500px" }}>
                    <Spinner />
                </div>}>
                    <ReportGenerator {...props} />
                </Suspense>
            )}
        />
        <Route path="/home" exact>
            {!isAlreadyLoggedIn ? <Redirect to="/login" /> : <LandingPage logoutCallback={setLoggedOut} />}
        </Route>
        <Route path="/ext_login" exact>
            <ExtendSession />
        </Route>
        <Route path="/login_ftl" exact>
            <FirstTimeLogin />
        </Route>
        <Route path="/navigation" exact >
            <Test />
        </Route>
        <Route path="/login" exact >
            {isAlreadyLoggedIn ? <Redirect to="/home" /> : <Login config={false} logIncallback={setLoggedIn} />}
        </Route>
        <Route path="/" >
            {isAlreadyLoggedIn ? <Redirect to="/home" /> : <Redirect to="/login" />}
        </Route>
    </Switch >);

    return routes;
}
export default RouteHandler