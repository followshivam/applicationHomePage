import React, { Suspense } from "react";
import {
    DialogTitle, Button, DialogActions, DialogContent,
    makeStyles, IconImage, Typography, Dialog, Spinner
} from "component"
import { useSelector } from "react-redux";
import { useEffect } from "react";


const useStyles = makeStyles(theme => ({
    root: {
        margin: 0,
        color: 'black',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        direction: props => props.direction

    },
    actionBar: {
        backgroundColor: '#F7F7F7',
        direction: props => props.direction,

    },
    closeButton: {
        color: '#A2A2A2',
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2),
    },

    miniButton: {
        color: '#A2A2A2',
        position: 'absolute',
        right: theme.spacing(5),
        top: theme.spacing(2),
    },
    maxButton: {
        color: '#A2A2A2',
        position: 'absolute',
        right: theme.spacing(5),
        top: theme.spacing(2),
    },
    button: {
        margin: props => props.direction === "rtl" ? "0 0 0 8px" : "0 8px 0 0"
    }
}));



const StyledDialogTitle = (props) => {
    const {
        children,
        onClose,
        heading,
        direction,
        close = false,
        refresh = false,
        onRefresh,
        ...other }
        = props;
    const classes = useStyles({ direction });

    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{heading}</Typography>
            {close ? (
                <IconImage className={classes.closeButton}
                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/close_icon.svg`}
                    onClick={onClose} height={16} />
            ) : null}
            {refresh ? (
                <IconImage className={classes.closeButton}
                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/refresh.svg`}
                    onClick={onRefresh} height={16} />
            ) : null}

        </DialogTitle>
    );
};


const CustomDialogBox = props => {
    const {
        disableEscapeKeyDown = true,
        disableBackdropClick = true,
        header = {
            title:'',
            close:false,
            refresh:false,
            onRefresh:null
        },
        handleClose,
        storeHandled,
        open,
        footer = {},
        direction = "ltr",
        content = {
            contentHeight: "200px",
            contentWidth: "700px",
            data: null
        },
        ...rest
    } = props;
    const { actionList = [] } = footer;
    const store = useSelector(state => {
        return state.normalDialogState;
    });

    const classes = useStyles({ direction });


    return (

        <Dialog
            open={storeHandled ? store.open : open}
            onClose={handleClose}
            maxWidth={'1000px'}
            disableBackdropClick={disableBackdropClick}
            disableEscapeKeyDown={disableEscapeKeyDown}
            {...rest}
            style={{ borderRadius: "20px" }}
        >
            <StyledDialogTitle
                onClose={handleClose}
                direction={direction}
                heading={header?.title}
                close={header?.close}
                refresh={header?.refresh}
                onRefresh={header?.onRefresh}
            />

            <DialogContent
                style={{
                    height: content?.contentHeight,
                    width: content?.contentWidth,
                    direction: direction
                }}>{content?.data}</DialogContent>

            <div className={classes.actionBar}>
                <DialogActions>
                    {actionList.map(action => (
                        <Button className={classes.button} key={action.label} type={action?.type}
                            onClick={action.clickHandler}
                            variant={action.class === "primary" ? "contained" : "outlined"} color={action.class}>
                            {action.label}
                        </Button>
                    ))}
                </DialogActions></div>
        </Dialog>
    )
}



const CustomDialogWrapper = (props) => {
    const {
        storeHandled = false,
        open = false,
        setOpen,
        ...rest
    } = props

    const normalDialogStore = useSelector(state => state.normalDialogState);
    const handleClose = () => {
        if (storeHandled) {
            normalDialogStore.closeDialog();
        }
        setOpen(false);
    }

    useEffect(() => {
        if (storeHandled && normalDialogStore && !normalDialogStore.open) {
            normalDialogStore.openDialog(
                <Suspense
                    fallback={
                        <div
                            style={{ height: '250px', minWidth: '600px' }}>
                            <Spinner msg='' />
                        </div>
                    }>
                    <CustomDialogBox storeHandled={storeHandled} {...rest} handleClose={handleClose} />
                </Suspense>,
                'Add External Application',
                "NEW"
            )
        }
    }, [])

    return <>
        {open && !storeHandled && <CustomDialogBox storeHandled={storeHandled}
            {...rest} handleClose={handleClose} open={open} />}
    </>
}

export default CustomDialogWrapper;



