import CriteriaWidget from 'container/webdesktop/CriteriaWidgets';
import SearchComponent from 'container/webdesktop/SearchComponent';
import WorkItemList from 'container/webdesktop/WorkItemList';
import SidePanel from 'container/webdesktop/SidePanel';
import DataModel from 'container/mdm/DataModel';
import React from 'react';

const RouteComponents = new Map();

RouteComponents.set('CriteriaWidget', (props) => <CriteriaWidget {...props} />);
RouteComponents.set('SearchComponent', (props) => <SearchComponent {...props} />);
RouteComponents.set('WorkItemList', (props) => <WorkItemList {...props} />);
RouteComponents.set('SidePanel', (props) => <SidePanel {...props} />);
RouteComponents.set('DataModel', (props) => <DataModel {...props} />);


export default RouteComponents;