import React from 'react';
import {makeStyles} from "component";

const useStyle=makeStyles((theme)=>({
    sidebar_root:{
backgroundColor:"white",
// textAlign:"center",
position:"fixed",
// margin:theme.spacing(1.3)
    },
    sidebar:{
        // padding:theme.spacing(1)
    },
        fixed_sidebar_root:{
backgroundColor:"white",textAlign:"center",
position:"fixed",left:0
    },
    fixed_sidebar:{
        padding:theme.spacing(1)
    }
}))
function SidebarFixed(props) {
    const classes=useStyle();
    return (
        <div className={classes.fixed_sidebar_root}>
    <div className={classes.fixed_sidebar}>
    {props.children}
        </div>
            
        </div>
    );
}
function Sidebar(props) {
    const classes=useStyle();
    return (
        <div className={classes.sidebar_root}>
    <div className={classes.sidebar}>
    {props.children}
        </div>
            
        </div>
    );
}

export default Sidebar;