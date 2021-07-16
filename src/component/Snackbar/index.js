import React from 'react';
import { makeStyles,Snackbar,MuiAlert,Button } from 'component';
import {useSelector} from "react-redux";
export const Alert=(props)=>{
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  }
}));

export  const AlertBox=()=> {
  const classes = useStyles();
const store = useSelector(state => {
    return state.snackbarState;
  });
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    store.closeSnackbar()
  }
//autoHideDuration={store.duration}
  return (
    <div className={classes.root}>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={store.open}  autoHideDuration={1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={store.type!=""?store.type:"success"} >
          {store.content}
        </Alert>
      </Snackbar>
    </div>
  );
}
