import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import TableComponent from 'container/bam/ReportDesigner/TableComponent/table';
import { Spinner } from "component";
import { HomeRoute } from 'container/bam/ReportDesigner/routes';
const Home = (props) => {
    return (<React.Fragment>
        <Switch>
            {HomeRoute.map((route, idx) => {
                return route.component ? (<Route key={idx} path={route.path} exact={route.exact} render={(props) => <Suspense fallback={<div style={{ height: "700px" }}>
                    <Spinner />
                </div>}><route.component {...props} /></Suspense>} />) : (null)
            })}
            {/*<Route path="/report_designer/create" exact component={TableComponent}/>*/}
        </Switch>
    </React.Fragment>)
}
export default Home;