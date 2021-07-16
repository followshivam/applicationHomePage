import React from 'react';
import { Button, Typography, Popover, makeStyles, IconImage, IconsButton, useTranslation, Tooltip, withStyles } from "component";
import { useSelector } from "react-redux";
import { Divider } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  typography: {
    // padding: `${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0 ${theme.spacing(0.5)}px`,
  },
  selectiontoolbar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    // paddingTop: `${theme.spacing(0.75)}px`,
    paddingRight: `${theme.spacing(0.5)}px`,
    borderTop: '1px solid #E7E7E7'
  },
  input_label: {
    ...theme.typography.input_label,
    fontSize : '0.75rem'
  },
  dark_color: {
    color: '#000000'
  },
  titleBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(0.75)
  },
  // content: {
  //   height: '200px',
  //   overflow: 'auto'
  // }
}));

export function SimplePopover(props) {
  const classes = useStyles();
  const { children = null, value = false, onClosePickList = () => console.warn('component/Popover/index.js: Picklist cleanup function not passed'), icon_url = null, onEnter = null, onSelect = null, title = "Data Picklist", width = "250px", list = null } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });

  const { t, i18n } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    onClosePickList();
    setAnchorEl(null);

  };
  const onSelectHandler = () => {
    setAnchorEl(null);
    onSelect();
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <React.Fragment>

      <IconImage url={props.icon_url} onClick={handleClick} id={id} />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onEnter={onEnter}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={classes.typography} style={{ width: width }}>
          <div className={classes.titleBar} >
            <Typography className={[classes.input_label, classes.dark_color].join(' ')}>{title} </Typography>
            <IconsButton style={{ color: '#606060' }} type="CloseIcon" onClick={handleClose} />
          </div>
          <div className={classes.content}>
            {children}
          </div>
          <div variant="div" className={classes.selectiontoolbar}>
            <Button color="" onClick={handleClose}><Typography className={classes.input_label}>{t('bam:CANCEL')}</Typography></Button>
            <Button color="primary" disabled={!value || list == null} onClick={onSelectHandler} style={{ fontWeight: '600' }}>{t('bam:LABEL_OK')}</Button>
          </div>
        </div>
      </Popover>
    </React.Fragment>
  );
}

const StylesTooltip = withStyles({
  tooltip: {
    margin: -5,
    borderRadius: 2
  },
})(Tooltip);

export const StyledTooltip = (props) => {
  const { title = '', ...rest } = props

  return (
    <StylesTooltip title={title} {...rest} >
      {props.children}
    </StylesTooltip>
  )
}