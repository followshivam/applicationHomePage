
import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Spinner } from "component";
import { ProtectedAuth, NormalAuth } from "container/authentication";
import { HomeRoute } from 'container/routes';
const Home = (props) => {
  const currentLang = localStorage.getItem('locale') && localStorage.getItem('locale')
  return (<React.Fragment>
    <Switch>
      {HomeRoute.map((route, idx) => {
        return route.component ? (<Route key={idx} path={route.path} exact={route.exact} render={(props) => route.protected ? <ProtectedAuth>
          <Suspense fallback={<div style={{ height: "100vh" }}>
            <Spinner />
          </div>}><route.component currentLang={currentLang} {...props} /></Suspense></ProtectedAuth> :
          <Suspense fallback={<div style={{ height: "100vh" }}>
            <Spinner />
          </div>}><route.component  {...props} /></Suspense>
        } />) : (null)
      })}
      {/*<Route path="/report_designer/create" exact component={TableComponent}/>*/}
    </Switch>
  </React.Fragment>)
}
export default Home;