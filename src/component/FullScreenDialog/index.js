import React  from "react";
import {  makeStyles, Dialog } from "component";
import {useSelector } from "react-redux";
import Slide from '@material-ui/core/Slide';
const useStyles = makeStyles(theme => ({
  dialogRoot:{
maxWidth: "1600px",
margin:"0 auto",
  },
      appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    color:"white",
    flex: 1,
  },
}))
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const FullScreenDialog=(props)=>{
    const {children}=props;
         const [store] = useSelector(state => {
    return [state.fullDialogState]
  });
    const classes=useStyles()
  const handleClose = () => {

    store.closeDialog();

  };

    return(
<Dialog fullScreen open={store.open} onClose={handleClose} TransitionComponent={Transition} fullWidth={true} className={classes.dialogRoot}>
        {children}
       </Dialog>)
}
export default FullScreenDialog