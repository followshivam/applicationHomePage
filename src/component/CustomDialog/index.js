import React from "react";
import { DialogTitle, IconButton, makeStyles, Typography, Dialog, withStyles, CloseIcon } from "component"
import DialogContent from '@material-ui/core/DialogContent';
import { Button, DialogActions } from "@material-ui/core";
import {useSelector } from "react-redux";


const styles = (theme) => ({
    root: {
        margin: 0,
        color: 'black',
        maxHeight: '30px',
        // padding: '7px 25px',
        fontSize: '0.875rem',
        backgroundColor: '#F7F7F7',
        fontWeight: 'bold',
        // borderBottom: `1px solid #f8f8f8`

    },
    closeButton: {
        color: '#A2A2A2',
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2),
    },
});



const StyledDialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
});

const StyledDialogContent = withStyles((theme) => ({
    root: {
        height: '100%',
        padding: '0',
        backgroundColor: '#F7F7F7',
    },
}))(DialogContent);

const useStyles = makeStyles({
    root: {
        backgroundColor: '#F7F7F7',
    },
    actionBar: {
        backgroundColor: '#F7F7F7',
    }
})




const CustomDialog = props => {
    const classes = useStyles();
    const {actionList=[],disableEscapeKeyDown=true,disableBackdropClick=true,...rest} = props;
         const store = useSelector(state => {
    return state.normalDialogState;
  });
  const handleClose = () => {
    store.closeDialog()
  };
    return (<Dialog
        open={store.open}
        onClose={handleClose}
        maxWidth={'1000px'}
        disableBackdropClick={disableBackdropClick}
        disableEscapeKeyDown={disableEscapeKeyDown}
        {...rest}
        style={{borderRadius:"20px"}}
    >
    {store.component}
        {/*<StyledDialogTitle onClose={handleClose}>
            <strong>{store.label}</strong>
        </StyledDialogTitle>
        <StyledDialogContent>{store.component}</StyledDialogContent>*/}

        {/*<div className={classes.actionBar}>
            <DialogActions>
                {actionList.map(action => (
                    <Button key={action.label} onClick={action.clickHandler} variant="outlined" color={action.color}>
                        {action.label}
                    </Button>
                ))}
                                    <Button  onClick={handleClose} variant="outlined" color="primary">
                       Close
                    </Button>
            </DialogActions></div> */}
    </Dialog>)
}

export default CustomDialog;




// import React from 'react'
// import {
//    DialogTitle,
//    IconButton,
//    makeStyles,
//    Typography,
//    Dialog,
//    withStyles,
//    CloseIcon
// } from 'component'
// import DialogContent from '@material-ui/core/DialogContent'
// import { Button, CssBaseline, DialogActions } from '@material-ui/core'
// import { useSelector } from 'react-redux'

// const styles = theme => ({
//    root: {
//       margin: 0,
//       color: 'black',
//       maxHeight: '30px',
//        padding: '4px 25px',
//       margin:"10px 0 10px 0",
//       fontSize: '0.875rem',
//       //   backgroundColor: '#F7F7F7',
//       fontWeight: 'bold'
//    },
//    closeButton: {
//       color: '#A2A2A2',
//       position: 'absolute',
//       right: theme.spacing(2),
//       top: theme.spacing(2.2)
//    }
// })

// const StyledDialogTitle = withStyles(styles)(props => {
//    const { children, classes, onClose, ...other } = props
//    return (
//       <DialogTitle disableTypography className={classes.root} {...other}>
//       <Typography variant='h6'>{children}</Typography>
//          {onClose ? (
//             <IconButton
//                aria-label='close'
//                className={classes.closeButton}
//                onClick={onClose}
//             >
//                <CloseIcon />
//             </IconButton>
//          ) : null}
    
//       </DialogTitle>
//    )
// })

// const StyledDialogContent = withStyles(theme => ({
//    root: {
//       height: '100%',
//       padding: '0',

//       //   backgroundColor: '#F7F7F7'
//    }
// }))(DialogContent)

// const useStyles = makeStyles({
//    root: {
//       //   backgroundColor: '#F7F7F7'
//    },
//    actionBar: {
//       backgroundColor: '#F7F7F7'
//    }
// })

// const CustomDialog = props => {
//    const classes = useStyles()
//    const {
//       actionList = [],
//       disableEscapeKeyDown = true,
//       disableBackdropClick = true,
//       ...rest
//    } = props
//    const store = useSelector(state => {
//       return state.normalDialogState
//    })
//    const handleClose = () => {
//       store.closeDialog()
//    }

//    return (
//       <Dialog
//          open={store.open}
//          onClose={handleClose}
//          maxWidth={'1000px'}
//          disableBackdropClick={disableBackdropClick}
//          disableEscapeKeyDown={disableEscapeKeyDown}
//          {...rest}
//          style={{ borderRadius: '20px' }}
//       >
//                <CssBaseline />

//          {/* {store.component} */}
//          {store.label ? (
//             <StyledDialogTitle onClose={handleClose}>
//                <strong>{store.label}</strong>
//             </StyledDialogTitle>
//          ) : null}
//          <StyledDialogContent>{store.component}</StyledDialogContent>

//          {/*<div className={classes.actionBar}>
//             <DialogActions>
//                 {actionList.map(action => (
//                     <Button key={action.label} onClick={action.clickHandler} variant="outlined" color={action.color}>
//                         {action.label}
//                     </Button>
//                 ))}
//                                     <Button  onClick={handleClose} variant="outlined" color="primary">
//                        Close
//                     </Button>
//             </DialogActions></div> */}
//       </Dialog>
//    )
// }

// export default CustomDialog
