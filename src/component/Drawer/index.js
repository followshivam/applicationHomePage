// import React from 'react'

import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import stylesheet from './style.module.css';
import './style.css';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
export const CustomDrawer=(props)=>{
    const {data,className,style,show=false,onClose}=props;
    console.log(data);
    return(      <CSSTransition
    in={show}
           classNames="slide"                                    
           timeout={{ enter: 1000, exit: 1000 }}                                 
      unmountOnExit
         >
         
         <div  id="mySidenav"  className={classNames(stylesheet.slide,className)} style={style}>
  <a href="javascript:void(0)" className={stylesheet.closebtn} onClick={onClose}>&times;</a>

          </div>
         </CSSTransition>)
}


  const TemporaryDrawer=()=> {
  const [state, setState] = React.useState({ right: false});

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
        <React.Fragment >
          <Button onClick={toggleDrawer("right", true)}>{"right"}</Button>
          <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false)}>
          </Drawer>
        </React.Fragment>
    </div>
  );
}

export default TemporaryDrawer;