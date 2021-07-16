import React from 'react';
import {Button,MenuIcon,IconButton,Typography,Toolbar,AppBar,makeStyles} from "component"
const useStyles = makeStyles((theme) => ({
  root: {
    flex:1,
    flexGrow: 1,
    width:"100%",
    justifyContent:"flex-end"
  },
  footer:{
          top: 'auto',
          height:40,
    bottom: 0,
    background:"white"
  },
  button_bar:{
     display:"flex",
     justifyContent:"flex-end",
     margin:5
  },
  toolbar:{marginTop:"2px"},
}));
export const FixedFooter=(props)=>{
    const {style,className}=props;
    const classes=useStyles();
    return(    <div className={classes.root}>
      <AppBar position="fixed" className={classes.footer}>
      <Toolbar variant="dense" className={classes.toolbar} >
      {props.children}
      </Toolbar>
          {/*<Typography component="div" color="inherit" className={classes.button_bar}>
            <Button >Next</Button>
          </Typography>*/}
      </AppBar>
    </div>)
}


