import React from 'react';
import {Button,MenuIcon,IconButton,Typography,Toolbar,AppBar,makeStyles} from "component"

const useStyles = makeStyles((theme) => ({
  root: {
    flex:1,
    flexGrow: 1,
    width:"100%"
  }
}));

export default function DenseAppBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" >
        <Toolbar variant="dense">
          <Typography variant="body1" color="inherit">
            {props.label}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
