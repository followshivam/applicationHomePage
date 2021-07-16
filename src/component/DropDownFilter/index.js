import React from 'react';
import { Button, Menu, Radio, RadioGroup, FormControlLabel, FormControl, FormGroup, FormLabel, IconImage, Checkbox, makeStyles, useTranslation } from '..';
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  button: {
    lineHeight: "normal",
    fontWeight: 400,
    fontSize: '12px',
    // padding: "2px 9px",
    // height: "27px",
    marginRight: "5px",
    backgroundColor: 'white',
    border: '1px solid transparent',
    '&:hover': {
      border: '1px solid transparent',
      backgroundColor: theme.palette.common.white,
    },
    '& .MuiButton-iconSizeSmall': {
      marginLeft: props => props.direction === "rtl" ? "10px !important" : "-2px"
    },
  },
  checkboxLable: {
      margin: props => props.direction === "rtl" ? "0 0 0 16px !important" : "0 16px 0 0",
  },
  MuiFormLabel: {
    fontSize: "11px",
    padding: props => props.direction === "rtl" ? "4px 6px 0px 0px" : "4px 0px 0px 6px",
    color: '#767676 !important',
  },
  formcontrollabel: {
    height: "29px",
    // display: 'flex',
    // justifyContent: 'space-between',
    flexDirection: "row",
    position: "relative",
    width: "100%",
    padding: "0 10px"
  },
  MuiButton: {
    // left:"40px"
    position: "absolute",
    top: "50%",
    right: props => props.direction === 'ltr' ? "0" : 100,
    height: "27px",
    transform: "translateY(-50%)",
    // borderRadius: "2px"
  },
  form: {
    direction: props => props.direction
  },
  Checkbox: {
    padding: "5px",
    // margin:props=>props.direction==="rtl"?"0 10px 0 0":"0 0 0 10px"
  }
}));

export function RadioButtonsGroup(props) {
  const { onChangeHandler = null,
    inputState = {}, screen = "designer",
    direction,
    handleClose = null, t } = props;
  let status_list;
  let others;
  const onChange = (key, param) => {
    onChangeHandler(key, param)
    handleClose();
  }
  if (screen === "designer") {
    status_list = [
      { id: 1, label: `${t('bam:ALL_STATUS')}`, value: "0" },
      { id: 2, label: `${t('bam:LABEL_GOOD')}`, value: "1" },
      { id: 3, label: `${t('bam:LABEL_AVERAGE')}`, value: "2" },
      { id: 4, label: `${t('bam:LABEL_CRITICAL')}`, value: "3" },
    ];
    others = [
      { id: 1, label: `${t('bam:SHOW_BLOCKED_ON_TOP')}`, value: "show_blocked_on_top" },
      { id: 2, label: `${t('bam:HIDE_BLOCKED_REPORTS')}`, value: "hide_blocked" },
    ]
  }
  else {
    status_list = [
      { id: 1, label: `${t('bam:ALL_STATUS')}`, value: "0" },
      { id: 2, label: `${t('bam:RUNNING')}`, value: "1" },
      { id: 3, label: `${t('bam:STOPPED')}`, value: "2" }
    ]
  }
  const classes = useStyles({ direction });
  return (
    <div className={classes.form} >
      <FormControl component="fieldset"  >
        <FormLabel component="legend" className={classes.MuiFormLabel} >{t('bam:STATUS')}</FormLabel>
        <RadioGroup aria-label="status " name="status1"
          value={inputState.healthstatus_code}
          onChange={(e) => onChange("status", e.target.value)}>

          {status_list.map((res, key) => {
            return (
              <FormControlLabel
                key={key} value={res.value}
                className={classes.formcontrollabel}
                control={<Radio className={classes.MuiButton}
                  icon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin.svg`} width={0} height={0} />}
                  checked={res.value === (screen === "designer" ? inputState.healthstatus_code : inputState.status)}
                  checkedIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/tick.svg`} width={15} height={15} />} />}
                label={res.label} labelPlacement="start" />
            )
          })}
        </RadioGroup>

        {/* <FormLabel component="legend" className={classes.MuiFormLabel} >{t('bam:OTHERS')}</FormLabel>
      <RadioGroup aria-label="status " name="status1"
        value={inputState.healthstatus_code}
        onChange={(e) => onChange(e.target.value,e.target.checked)}>

        {others.map((res, key) => {
          return (
            <FormControlLabel
              key={key} value={res.value}
              className={classes.formcontrollabel}
              control={<Checkbox className={classes.Checkbox}
                checked={res.value === (screen === "designer" ? inputState.showblocked_top : inputState.hide_blocked)}
                />}
              label={res.label} labelPlacement="start" />
          )
        })}
      </RadioGroup> */}

        <FormLabel className={classes.MuiFormLabel} component="legend">{t('bam:OTHERS')}</FormLabel>
        <FormGroup  >
          <FormControlLabel
            className={classes.checkboxLable}
            control={<Checkbox className={classes.Checkbox}
              checked={inputState.showblocked_top}
              onChange={(e) => onChange("show_blocked_on_top", e.target.checked)} name="Show" />}
            label={t('bam:SHOW_BLOCKED_ON_TOP')}
          />
          <FormControlLabel
            className={classes.checkboxLable}
            control={<Checkbox className={classes.Checkbox}
              checked={inputState.hide_blocked}
              onChange={(e) => onChange("hide_blocked", e.target.checked)} name="Hide" />}
            label={t('bam:HIDE_BLOCKED_REPORTS')}
          />
        </FormGroup>

      </FormControl>
    </div>
  );
}


const DropDownFilter = (props) => {
  const {
    label = "Click",
    onChangeHandler = null,
    type,
    direction = "ltr",
    endIcon = null,
    variant = "outlined",
    color = "primary",
    startIcon = null,
    footer_label,
    footerClickHandler,
    onChange = null
  } = props;
  const classes = useStyles({ direction });


  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module)
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // onChange(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;
  return (<React.Fragment>
    <Button className={classes.button}
      variant="outlined" color="primary"
      startIcon={startIcon}
      onClick={handleClick} >{label}</Button>

    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      // PaperProps={{
      //   style: {
      //     maxHeight: ITEM_HEIGHT * 5.1,
      //     //  width: '25px',
      //   },
      // }}
      style={{ top: "32px" }}
    >
      <RadioButtonsGroup direction={direction} t={t} {...props} handleClose={handleClose} />
    </Menu>

  </React.Fragment>
  )
}
export default DropDownFilter;