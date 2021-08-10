import React, { Suspense } from 'react';
import { ResetAddReport } from 'redux/action';
import { IconsButton, Typography, Button, Menu, MenuItem, Spinner, ListItemIcon, IconImage, ListItemText, withStyles, makeStyles } from '../';
import stylesheet from './style.module.css';
const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    padding: 2,
    margin: 2,
    color: "black",
    boxShadow: "none",
    '&:hover': {
      boxShadow: "0px 1px 1px -2px rgba(0,0,0,0.2),0px 2px 1px 0px rgba(0,0,0,0.14),0px 1px 1px 0px rgba(0,0,0,0.12)",
    },
  },
  MuiListItemIcon: {
    minWidth: theme.spacing(3)    
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  category: {
    lineHeight: "normal",
    fontWeight: 400,
    fontSize: '12px',
    padding: "2px 9px",
    backgroundColor: "#F6F6F6",
    height: "27px",
    backgroundColor: "#F6F6F6"

  },
  button: {
    lineHeight: "normal",
    fontWeight: 400,
    fontSize: '12px',
    padding: "2px 9px",
    marginRight: "5px",
    // backgroundColor: "#F6F6F6",
    // borderRadius: "3px",
    backgroundColor: theme.palette.common.white,
    '& .MuiButton-iconSizeSmall': {
      marginLeft: props => props.direction === "rtl" ? "10px !important" : "-2px"
    },
  },

  MuiListItem: {
    height:"28px",
    root: {
      height:"28px",
      '&:focus': {
        height:"28px",
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
    '&:hover': {
      height:"28px",
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    }
  },
  MuiListItemEmpty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "150px",
    width: "150px",
  }
}));


const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
 
}))(MenuItem);
const DropDown = (props) => {
  const {
    label = "Click",
    classname = "button",
    list = [],
    image_url = null,
    type, list_type = "",
    endIcon = null,
    variant = "outlined",
    direction="ltr",
    color = "primary",
    startIcon = null,
    width = "16",
    height = "16",
    footer_label,
    footerClickHandler,
    onChange = null } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles({direction});

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // onChange(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;
  return (<React.Fragment>

    {type === "button" ? <React.Fragment>
      {classname === "category" ? <Button className={classes.category} variant={variant} color={color} startIcon={startIcon} endIcon={endIcon} onClick={handleClick} >{label}</Button> :
        <Button className={classes.button} variant={variant} color={color} startIcon={startIcon} endIcon={endIcon} onClick={handleClick} >{label}</Button>} </React.Fragment>
      : image_url != null ? <IconImage url={image_url} height={height} width={width} onClick={handleClick} /> : <IconsButton className={classes.icon} type={endIcon} onClick={handleClick} />}

    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        style: {
          maxHeight: ITEM_HEIGHT * 5.1,
          minWidth: "auto",
          minHeight: "auto",
          borderRadius: "3px"
          // width: '20ch',
        },
      }}
      style={{ top: "30px" }}
    >
      {list.length == 0 && <Typography className={classes.MuiListItemEmpty} >
        No Record Found
         </Typography>}
      {list_type === "" ? (list.map((res, key) => {
        return (
          <MenuItem onClick={handleClose} classes={{ root: [classes.MuiListItem, res.className].join(' ') }} key={key} onClick={() => { handleClose(); return res.action != null ? res.action() : null }} disabled={res.disabled != null ? res.disabled : false}>
            {res.startIcon != null && 
            
            <ListItemIcon classes={{ root: classes.MuiListItemIcon }} >
              <IconImage url={res.startIcon} height={res.iconHeight != null ? res.iconHeight : height } width={res.iconWidth != null ? res.iconWidth : width} />
            </ListItemIcon>}
            <ListItemText primary={res.label} primaryTypographyProps={{ variant: "subtitle2", style: { fontSize: res.labelFontSize , color: res.labelColor} }} />
          
          </MenuItem>)
      }))
        : list.map((res, key) => {
          return (
            <MenuItem key={key} classes={{ root: classes.MuiListItem }} onClick={() => { res.action({ id: res.category_index, name: "CR" }); handleClose() }} >
              {res.startIcon != null && <ListItemIcon classes={{ root: classes.MuiListItemIcon }} >
                <IconImage url={res.startIcon} />
              </ListItemIcon>}
              <ListItemText primary={res.category_name} primaryTypographyProps={{ variant: "subtitle2", style: { fontSize: ResetAddReport.labelFontSize } }} />
            </MenuItem>)
        })}

      {footer_label != null && <div className={stylesheet.dropdown_footer} onClick={footerClickHandler}>
        {footer_label}
      </div>}
    </Menu>

  </React.Fragment>
  )
}
export default DropDown;