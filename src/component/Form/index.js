import React, { useState, useEffect } from "react";
import stylesheet from "./style.module.css";
import classNames from "classnames";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Popover from '@material-ui/core/Popover';

import {
  Autocomplete,
  Radio,
  RadioGroup,
  SimplePopover,
  SearchBox,
  Spinner,
  Pagination,
  FormControlLabel,
  IconImage,
  FormHelperText,
  Select,
  InputAdornment,
  useTranslation,
  InputLabel,
  InputBase,
  TextField,
  TextareaAutosize,
  Typography,
  makeStyles,
  Card,
  Grid,
  withStyles,
  fade,
  DynamicTable,
  clsx,
  Button as RegularButton
} from "component";
import { IconButton, Tooltip } from "@material-ui/core";
import { useSelector } from "react-redux";
const useStyle = makeStyles(theme => {
  return {
    // textarea:{
    //   border:`2px solid rgba(201,201,201,1)`,
    // "&:focus":{
    //   border:`2px solid ${theme.palette.primary.main}`
    // }
    // },
    // formLabel:{
    // position:"relative"
    // },
    // root: {
    //     '&:hover': {
    //       backgroundColor: 'transparent',
    //     },
    //   },

    container: {
      // height:props=>props.multiline?null:"24px",
      // marginBottom: '2px',
    },

    container1: {
      display: "flex",
      flexDirection: "row",
      alignItems: props => props.alignItems ? props.alignItems : "center",
      //marginRight:props => props.direction==='rtl'?"-40px":0
    },
    input_label: (props) => {
      return { ...theme.typography.input_label, minWidth: props.labelMinWidth, maxWidth: props.labelMaxWidth, fontSize: props.fontSize, fontWeight: props.fontWeight, color: props.fontColor, lineHeight: 2.1876 }
    },
    date: {
      borderColor: 'transparent',
      borderRadius: '2px',
      minHeight: '27px'
    },
    input_label_root: { display: "contents" },
    helper_text: () => {
      return theme.typography.helper_text
    },
    required_field: {
      color: "red"
    },
    formcontrollabel: {
      marginRight: 0
    },
    formgroup: {
      flexDirection: "row"
    },
    adormentPositionEnd: {
      right: 10,
      position: "absolute",
      // backgroundColor: "red"
    },
    picklistAdorementPosition: {
      right: "0px",
      position: "absolute",
      // background: theme.palette.primary.main,
      border: `1px solid ${theme.palette.borderColor}`,
      width: "15px",
      height: "25px"
    },
    picklist_clicked: {
      // background: theme.palette.primary.main
    },
    picklist_item: {
      height: "148px",
      overflow: "auto",
      // border: `1px solid ${theme.palette.borderColor}`
      padding: '2px'
    },

    picklist_table_item: {
      // height: "200px",
      overflow: "auto",
      // border: `1px solid ${theme.palette.borderColor}`
      padding: '2px'
    },
    picklist_table: {
      height: "250px",
      overflow: "none",
      border: `1px solid ${theme.palette.borderColor}`
    },
    picklist_pagination: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      paddingLeft: '3px'
    },
    listItemText: {
      fontSize: "0.675rem"
    },
    picklist_item_list: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    },
    select_icon: {
      top: "0.2rem",
      transform:props=>props.rotate? "rotate(270deg)":"rotate(0deg)",

    },
    selectClass: {
      lineHeight: "1.1876em"
    },
    radio_desc: {
      fontFamily: 'Open Sans',
      color: '#000000',
      fontSize: '12px',
      width: "177px"
    },
    MuiListItemIcon: {
      minWidth: "20px"
    },
    list_dense: {
      padding: 2,
      paddingLeft: 6
    },
    margin: {
      margin: theme.spacing(1)
    },
    labelType: {
      marginBottom: '2px !important'
    },
    picklist_search: {
      padding: '4px 2px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
    },
    iconImage: {
      width: 25.063,
      height: props => props.height != null ? props.height : 27.063,
      border: "1px #e0e0e0 solid",
      borderRight: props => props.direction === 'ltr' ? 0 : undefined,
      borderLeft: props => props.direction === 'rtl' ? 0 : undefined
    },
    startAdornment: {
      marginRight: 0
    }
  };
});
export const StyledInput = withStyles(theme => ({
  root: {
    height: props => (props.multiline ? null : "24px"),
    "label + &": {
      marginTop: theme.inputSpacing
    }
  },
  input: {
    borderRadius: props => props.borderRadius ? "0 2px 2px 0" : "2px",
    height: props => props.height,
    position: "relative",
    backgroundColor: theme.palette.common.white,
    // lineHeight: 'initial',
    border: `1px solid ${theme.palette.borderColor}`,
    borderLeft: props => props.borderLeftTrimmed ? "0px !important" : null,
    borderRight: props => props.borderRightTrimmed ? "0px !important" : null,
    fontSize: props => props.fontSize ? props.fontSize : 11,
    color: props => props.fontColor ? props.fontColor : "#606060",
    padding: "6px 4px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    // fontFamily: [
    //   '-apple-system',
    //   'BlinkMacSystemFont',
    //   '"Segoe UI"',
    //   'Roboto',
    //   '"Helvetica Neue"',
    //   'Arial',
    //   'sans-serif',
    //   '"Apple Color Emoji"',
    //   '"Segoe UI Emoji"',
    //   '"Segoe UI Symbol"',
    // ].join(','),
    "&:focus": {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main
    }
  },
  disabled: {
    backgroundColor: "#f8f8f8",
    cursor: "pointer"
  }
}))(InputBase);
export const InputBox = props => {
  const {
    label = null,
    helpertext = null,
    value = "",
    onChangeHandler = null,
    name = "input_box",
    labelMinWidth = "95px",
    labelMaxWidth = "95px",
    alignItems = "center",
    disabled = false,
    info = false,
    form = true,
    required = false,
    direction = "ltr",
    endAdornment = null,
    injectLiveValue = false,
    fontSize = '12px',
    fontWeight = 600,
    fontColor = 'rgb(96, 96, 96)',
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, fontWeight, labelMaxWidth, alignItems, fontSize, direction, fontColor });

  return (
    <div className={form ? classes.container : classes.container1}>
      {/* </div>*/}
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={classes.input_label}
          classes={{ root: classes.input_label_root }}>
          <Typography noWrap={true}
            variant="div"
            className={['fieldlabel', classes.input_label, form ? classes.labelType : classes.labelType1].join(' ')}>
            {label}{required && <span className={classes.required_field}>*</span>}
            {info ? <IconImage style={{ margin: direction === "ltr" ? "0 0 0 5px" : "0 5px 0 0" }} height={16} width={16} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/info_icon.svg`} /> : null}
          </Typography>
        </InputLabel>
      )}
      <div style={{ width: '100%' }}>
        <StyledInput
          id={name}
          defaultValue={value}
          name={name}
          value={injectLiveValue === true ? value : null}
          disabled={disabled}
          onChange={onChangeHandler}
          margin="dense"
          required={required}
          endAdornment={
            endAdornment === false
              ? null
              : disabled ? null : endAdornment
          }
          autoComplete={false}
          {...rest}
        />
        {helpertext != null &&
          form && (
            <FormHelperText id="my-helper-text" className
              ={classes.helper_text}>{helpertext}</FormHelperText>
          )}
      </div>
    </div>
  );
};
{
  /*<div className={` ${stylesheet.input_group} `} >
      <input
        type="text"
        className={` ${stylesheet.input_area} ${className}`}
        required
        id="inputField"
        style={style}
        value={value}
        onChange={onChange}
      />
      <label for="inputField" className={stylesheet.label}  >
        {label}``
      </label>
    </div>*/
}

export const SelectBox = props => {

  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });

  const { t, i18n } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])

  const {
    label = null,
    helpertext = null,
    value = null,
    list = [],
    placeholder = `${t('bam:SELECT')}`,
    labelMinWidth = "95px",
    labelMaxWidth = "95px",
    onChangeHandler = null,
    name = "select_box",
    alignItems = "center",
    disabled = false,
    form = true,
    required = false,
    rotate=false,
    type = "",
    injectLiveValue = false,
    iconClass = undefined,
    placeholderRequired = true,
    fontSize,
    fontColor,
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth, alignItems, t, fontSize,rotate, fontColor });
  return (
    <div className={form ? classes.container : classes.container1}>
      {/* </div>*/}
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} className={classes.input_label}> {label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <Select
        native
        // error
        defaultValue={value}
        value={injectLiveValue === true ? value : null}
        name={props.name}
        disabled={disabled}
        input={<StyledInput notched required={required} fontSize={props.inputFontSize} />}
        onChange={onChangeHandler}
        classes={{ icon: clsx(classes.select_icon, iconClass), select: classes.selectClass }}
        {...rest}
      // inputProps={{
      //   name: 'age',
      //   id: 'age-native-simple',
      // }}
      >
        {placeholderRequired && <option aria-label="None" value="" selected disabled>
          {placeholder}
        </option>}
        {type === "" ? list.map((res, key) => {
          return (
            <option key={key} value={res.value}>
              {res.label}
            </option>
          );
        }) : props.children}
      </Select>
      {helpertext != null &&
        form && <FormHelperText id="my-helper-text" className={classes.helper_text}>{helpertext}</FormHelperText>}
    </div>
    // {/*<Select
    //       labelId="demo-customized-select-label"
    //       native
    //       id="demo-customized-select"
    //       value={value}
    //       onChange={onChangeHandler}
    //       input={<StyledInput />}
    //       label={<InputLabel shrink htmlFor={name} classes={{formControl:classes.formLabel}}>
    //       {label}
    //     </InputLabel>}
    //     >

    //       //  <option aria-label="None" value="" />
    //       // {list.map((res,key)=>{return(<option key={key} value={res.value}>{res.label}</option>)})}
    //      //list.map((res,key)=>{return(<MenuItem key={key} value={res.value}>{res.label}</MenuItem>)})
    //     </Select>*/}
  );
};

export const SelectBoxWithIcon = props => {

  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });

  const { t, i18n } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])

  const {
    label = null,
    helpertext = null,
    value = null,
    list = [],
    placeholder = `${t('bam:SELECT')}`,
    labelMinWidth = "95px",
    labelMaxWidth = "95px",
    onChangeHandler = null,
    name = "select_box",
    alignItems = "center",
    disabled = false,
    form = true,
    required = false,
    height = "25px",
    type = "",
    injectLiveValue = false,
    iconClass = undefined,
    placeholderRequired = true,
    iconRequired = true,
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth, alignItems, direction: t('bam:HTML_DIR') });
  return (
    <div className={form ? classes.container : classes.container1}>
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} className={classes.input_label}> {label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <Select
        native
        defaultValue={value}
        value={injectLiveValue === true ? value : null}
        name={props.name}
        disabled={disabled}
        startAdornment={
          <InputAdornment position="start" classes={{ positionStart: classes.startAdornment }}>
            <IconButton>
              <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/schedule_icon.svg`} className={classes.iconImage} />
            </IconButton>
          </InputAdornment>
        }
        input={<StyledInput height={height} notched required={required} fontSize={props.inputFontSize} borderLeftTrimmed={t('bam:HTML_DIR') === 'ltr'} borderRightTrimmed={t('bam:HTML_DIR') === 'rtl'} borderRadius={true} />}
        onChange={onChangeHandler}
        classes={{ icon: clsx(classes.select_icon, iconClass), select: classes.selectClass }}
        {...rest}
      // inputProps={{4
      //   name: 'age',
      //   id: 'age-native-simple',
      // }}
      >
        {placeholderRequired && <option aria-label="None" value="" selected disabled>
          {placeholder}
        </option>}
        {type === "" ? list.map((res, key) => {
          return (
            <option key={key} value={res.value}>
              {res.label}
            </option>
          );
        }) : props.children}
      </Select>
      {helpertext != null &&
        form && <FormHelperText id="my-helper-text" className={classes.helper_text}>{helpertext}</FormHelperText>}
    </div>
  );
};
export const TemplateSelectBox = props => {
  const {
    label = null,
    helpertext = null,
    value = null,
    list = [],
    placeholder = "Select",
    labelMinWidth = "95px",
    labelMaxWidth = "95px",
    onChangeHandler = null,
    name = "select_box",
    disabled = false,
    form = true,
    required = false,
    type = "",
    injectLiveValue = false,
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth });
  return (
    <div className={form ? classes.container : classes.container1}>
      {/* </div>*/}
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} className={classes.input_label}> {label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <Select
        native
        defaultValue={value}
        value={injectLiveValue === true ? value : null}
        name={props.name}
        disabled={disabled}
        input={<StyledInput required={required} />}
        onChange={onChangeHandler}
        classes={{ icon: classes.select_icon }}
        {...rest}
      // inputProps={{
      //   name: 'age',
      //   id: 'age-native-simple',
      // }}
      >
        <option aria-label="None" value="" selected disabled>
          {placeholder}
        </option>
        {type === "" ? list.map((res, key) => {
          return (
            <option key={key} value={res.template_id}>
              {res.template_name}
            </option>
          );
        }) : props.children}
      </Select>
      {helpertext != null &&
        form && <FormHelperText id="my-helper-text" className={classes.helper_text}>{helpertext}</FormHelperText>}
    </div>
    // {/*<Select
    //       labelId="demo-customized-select-label"
    //       native
    //       id="demo-customized-select"
    //       value={value}
    //       onChange={onChangeHandler}
    //       input={<StyledInput />}
    //       label={<InputLabel shrink htmlFor={name} classes={{formControl:classes.formLabel}}>
    //       {label}
    //     </InputLabel>}
    //     >

    //       //  <option aria-label="None" value="" />
    //       // {list.map((res,key)=>{return(<option key={key} value={res.value}>{res.label}</option>)})}
    //      //list.map((res,key)=>{return(<MenuItem key={key} value={res.value}>{res.label}</MenuItem>)})
    //     </Select>*/}
  );
};
export const PickListTable = props => {
  const {
    label = null,
    helpertext = null,
    loading = true,
    value = "",
    list = null,
    onOpen = null,
    form = true,
    labelMinWidth = "80px",
    labelMaxWidth = "80px",
    onChangeHandler = null,
    name = "picklist",
    pagination = false,
    main_title = "",
    disabled = true,
    search = true,
    required = false,
    displayKey = "label",
    valueKey = "val",
    error_msg = "",
    onChangePicklist = null,
    onSearch = (query) => console.log('Hl'),
    multiSelect = false,
    clearSearchResult = () => console.warn('clearSearchResult not passed'),
    // value = "something"
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth });
  const [inputList, setInputList] = useState(list);
  const [inputValue, setInputValue] = useState(value);
  const [checked, setChecked] = React.useState([]);
  const handleToggle = (res, index) => {
    // console.log(res, valueKey);
    if (multiSelect === true) {
      for (let i = 0; i < checked.length; i++) {
        if (checked[i].index === index) {
          let newChecked = checked.filter(item => item.index !== index);
          setChecked(newChecked);
          return;
        }
      }
      setChecked([...checked, { val: res, index: index, selected_row: res }]);
    }
    else
      setChecked([{ val: res, index: index, selected_row: res }]);
  };
  // console.log(checked);
  useEffect(() => {
    setInputValue(value)
  }, [value])
  const handleSelect = (e) => {
    // let selectedValue = inputList.filter((res, key) => res[valueKey] === checked)[0];
    if (!multiSelect)
      setInputValue(
        checked[0].val[valueKey] == null ? checked[0].val : checked[0].val[valueKey]
      );
    else {
      let displayString = "";
      for (let i = 0; i < checked.length; i++) {
        displayString += `, ${checked[i].val[valueKey] == null ? checked[i].val : checked[i].val[valueKey]}`
      }
      setInputValue(
        displayString
      )
    }
    if (onChangeHandler != null) onChangeHandler(checked);
  };

  const onSearchSubmit = data => {
    let param = data.searchString.trim();
    if (param !== '')
      onSearch(param)
  }

  return (
    <div className={form ? classes.container : classes.container1}>
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} className={classes.input_label}>{label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <div>
        <StyledInput
          id={name}
          defaultValue={inputValue}
          value={inputValue}
          name={name}
          disabled={disabled}
          margin="dense"
          required={required}
          endAdornment={
            <InputAdornment
              position="end"
              classes={{ positionEnd: classes.picklistAdorementPosition }}
              className={classes.picklist_clicked}
            >
              <SimplePopover
                value={checked != null}
                icon_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/ellipsis.svg`}
                width="200px"
                title={main_title != '' ? main_title : label ? label : 'Picklist'}
                onEnter={onOpen}
                onSelect={handleSelect}
                list={list}
              >
                <div variant="div" style={{ height: '100%', width: '100%' }}>
                  {(search) &&
                    <div
                      className={classes.picklist_search}>
                      <SearchBox
                        clearSearchResult={clearSearchResult}
                        onSearchSubmit={onSearchSubmit}
                        name="search"
                        width="190px"
                      />
                    </div>
                  }
                  {pagination && (
                    <div className={classes.picklist_pagination}>
                      <Typography variant="subtitle2" style={{ color: '#767676' }}>{'<Select Option>'}</Typography>
                      <div><Pagination disabled_next={list && !list.enable_next} disabled_prev={list && !list.enable_prev} onChange={onChangePicklist} /></div>
                    </div>
                  )}
                  <div className={classes.picklist_table_item}>
                    {list != null ? loading === false ? <DynamicTable multiSelect={multiSelect} sort={false} data={list} dynamicHeight="200px" handleToggle={handleToggle} picklist={true} picklist_val={checked} /> :
                      <div style={{ height: "200px" }} >
                        <Spinner msg="" />
                      </div> :
                      <div style={{ height: '200px', color: 'red', overflow: 'auto' }}>
                        <Typography variant="subtitle1">{error_msg}</Typography>
                      </div>
                    }
                  </div>
                </div>
              </SimplePopover>
            </InputAdornment>
          }
          {...rest}
        />
        {helpertext != null &&
          form && (
            <FormHelperText id="my-helper-text" className={classes.helper_text}>{helpertext}</FormHelperText>
          )}
      </div>
    </div>
  );
};
export const PickList = props => {

  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });

  const { t, i18n } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])


  const {
    label = null,
    helpertext = null,
    loading = true,
    value = "",
    list = null,
    onOpen = null,
    form = true,
    labelMinWidth = "80px",
    labelMaxWidth = "80px",
    onChangeHandler = null,
    name = "picklist",
    pagination = true,
    main_title = '',
    disabled = true,
    search = true,
    required = false,
    displayKey = "label",
    onChangePicklist = null,
    valueKey = "value",
    onSearch = (param) => console.log(param),
    clearSearchResult = () => console.warn('Picklist: clearSearchResult not passed'),
    disablePickList = false,
    setValue = null,
    error_msg = "",
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth });
  const [inputList, setInputList] = useState([]);
  const [inputValue, setInputValue] = useState();
  const [checked, setChecked] = useState();
  useEffect(() => {
    setInputList(list != null ? (list.data && list.data.length > 0 ? list.data : []) : []);
  }, [list])

  useEffect(() => {
    setInputValue(value);
  }, [value])
  const handleToggle = res => () => {
    setChecked(res[valueKey]);
  };
  const handleSelect = () => {
    let selectedValue = inputList.filter((res, key) => res[valueKey] === checked)[0];
    setInputValue(
      selectedValue[displayKey]
    );
    if (onChangeHandler != null) onChangeHandler(selectedValue);
  };

  const handleChange = event => {
    setInputValue(event.target.value);
    if (setValue != null)
      setValue(event.target.value);
  }

  const handleSelectCombined = () => {
    handleSelect();
    setChecked();
  }

  const onSearchSubmit = data => {
    let param = data.searchString.trim();
    if (param !== '') {
      setChecked();
      onSearch(param);
    }
  }

  return (
    <div className={form ? classes.container : classes.container1}>
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} className={classes.input_label}>{label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <div>
        <StyledInput
          id={name}
          defaultValue={inputValue}
          value={inputValue}
          name={name}
          disabled={disabled}
          margin="dense"
          required={required}
          onChange={handleChange}
          endAdornment={
            <InputAdornment
              position="end"
              classes={{ positionEnd: classes.picklistAdorementPosition }}
              className={classes.picklist_clicked}
              disablePointerEvents={disablePickList}
              disabled={disablePickList}
            >
              <SimplePopover
                value={checked != null && checked !== ""}
                icon_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/ellipsis.svg`}
                width="200px"
                title={main_title != '' ? main_title : label ? label : `${t('bam:TITLE_PICKIST')}`}
                onEnter={onOpen}
                onSelect={handleSelectCombined}
                list={list}
                onClosePickList={clearSearchResult}
              >
                <div variant="div" style={{ height: '100%', width: '100%' }}>
                  {(search) &&
                    <div
                      className={classes.picklist_search}>
                      <SearchBox
                        name="search"
                        clearSearchResult={
                          () => {
                            setChecked();
                            clearSearchResult()
                          }}
                        onSearchSubmit={onSearchSubmit}
                        width="190px"
                      />
                    </div>
                  }
                  {(pagination) && (
                    <div className={classes.picklist_pagination}>
                      {/* <Typography variant="subtitle2" style={{ color: '#767676' }}>{`<${t('bam:SELECT_OPTION')}>`}</Typography> */}
                      <div><Pagination disabled_next={list != null && !list.enable_next} disabled_prev={list != null && !list.enable_prev} onChange={(param) => {
                        setInputValue();
                        setChecked();
                        onChangePicklist(param)
                      }} /></div>
                    </div>
                  )}
                  <div className={classes.picklist_item}>
                    <List
                      className={classes.picklist_item_list}
                      disablePadding
                    >
                      {loading ? <div style={{ height: search ? "128px" : "148px" }}><Spinner /></div> : inputList.length === 0 ? <Typography>{error_msg}</Typography> : inputList.map((res, key) => {
                        return (
                          <ListItem
                            selected={res[valueKey] === checked}
                            key={key}
                            role={undefined}
                            dense
                            button
                            onClick={handleToggle(res)}
                            classes={{ dense: classes.list_dense }}
                          >
                            <Tooltip title={res[displayKey]}>
                              <Typography variant="subtitle1" noWrap style={{ width: '180px' }}>
                                {/* <ListItemText primary={res[displayKey]} classes={{ primary: classes.listItemText }} /> */}
                                {res[displayKey]}
                              </Typography>
                            </Tooltip>
                          </ListItem>
                        );
                      })}
                    </List>
                  </div>
                </div>
              </SimplePopover>
            </InputAdornment>
          }
          {...rest}
        />
        {helpertext != null &&
          form && (
            <FormHelperText id="my-helper-text" className={classes.helper_text}>{helpertext}</FormHelperText>
          )}
      </div>
    </div>
  );
};
export const DualInputPickList = props => {
  const {
    label = null,
    helpertext = null,
    loading = true,
    value = "",
    list = null,
    onOpen = null,
    form = true,
    labelMinWidth = "80px",
    labelMaxWidth = "80px",
    onChangeHandler = null,
    name = "picklist",
    pagination = true,
    main_title = "",
    disabled = false,
    search = true,
    required = false,
    displayKey = "label",
    onChangePicklist = null,
    valueKey = "value",
    onSearch = (param) => console.log(param),
    clearSearchResult = () => console.warn('Picklist: clearSearchResult not passed'),
    disablePickList = false,
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth });
  const [inputList, setInputList] = useState([]);
  const [inputValue, setInputValue] = useState(value);
  const [checked, setChecked] = React.useState();
  useEffect(() => {
    setInputList(list != null ? (list.data && list.data.length > 0 ? list.data : []) : []);
  }, [list])

  useEffect(() => {
    setInputValue(value);
  }, [value])
  const handleToggle = res => () => {
    setChecked(res[valueKey]);
  };
  const handleSelect = () => {
    let selectedValue = inputList.filter((res, key) => res[valueKey] === checked)[0];
    setInputValue(
      selectedValue[displayKey]
    );
    if (onChangeHandler != null) onChangeHandler(selectedValue);
  };

  const onSearchSubmit = data => {
    let param = data.searchString.trim();
    if (param !== '')
      onSearch(param)
  }

  return (
    <div className={form ? classes.container : classes.container1}>
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} className={classes.input_label}>{label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <div>
        <StyledInput
          id={name}
          defaultValue={inputValue}
          value={inputValue}
          name={name}
          disabled={disabled}
          margin="dense"
          required={required}
          endAdornment={
            <InputAdornment
              position="end"
              classes={{ positionEnd: classes.picklistAdorementPosition }}
              className={classes.picklist_clicked}
              disablePointerEvents={disablePickList}
              disabled={disablePickList}
            >
              <SimplePopover
                value={checked != null}
                icon_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/ellipsis.svg`}
                width="200px"
                title={main_title != '' ? main_title : label ? label : 'Picklist'}
                onEnter={onOpen}
                onSelect={handleSelect}
                list={list}
                onClosePickList={clearSearchResult}
              >
                {loading ? (
                  <div style={{ height: "200px" }}>
                    <Spinner msg="" />
                  </div>
                ) : (
                    <div variant="div" style={{ height: '100%', width: '100%' }}>
                      {(search) &&
                        <div
                          className={classes.picklist_search}>
                          <SearchBox
                            name="search"
                            clearSearchResult={clearSearchResult}
                            onSearchSubmit={onSearchSubmit}
                            width="190px"
                          />
                        </div>
                      }
                      {(pagination && list != null) && (
                        <div className={classes.picklist_pagination}>
                          {/* <Typography variant="subtitle2" style={{ color: '#767676' }}>{'<Select Option>'}</Typography> */}
                          <div><Pagination disabled_next={!list.enable_next} disabled_prev={!list.enable_prev} onChange={onChangePicklist} /></div>
                        </div>
                      )}
                      <div className={classes.picklist_item}>
                        <List
                          className={classes.picklist_item_list}
                          disablePadding
                        >
                          {inputList.map((res, key) => {
                            return (
                              <ListItem
                                selected={res[valueKey] === checked}
                                key={key}
                                role={undefined}
                                dense
                                button
                                onClick={handleToggle(res)}
                                classes={{ dense: classes.list_dense }}
                              >
                                <Tooltip title={res[displayKey]}>
                                  <Typography variant="subtitle1" noWrap style={{ width: '180px' }}>
                                    {/* <ListItemText primary={res[displayKey]} classes={{ primary: classes.listItemText }} /> */}
                                    {res[displayKey]}
                                  </Typography>
                                </Tooltip>
                              </ListItem>
                            );
                          })}
                        </List>
                      </div>
                    </div>
                  )}
              </SimplePopover>
            </InputAdornment>
          }
          {...rest}
        />
        {helpertext != null &&
          form && (
            <FormHelperText id="my-helper-text" className={classes.helper_text}>{helpertext}</FormHelperText>
          )}
      </div>
    </div>
  );
};
export const AdvancedUserPickList = props => {
  const {
    label = null,
    helpertext = null,
    loading = true,
    value = "",
    list = null,
    onOpen = null,
    form = true,
    labelMinWidth = "80px",
    labelMaxWidth = "80px",
    onChangeHandler = null,
    name = "picklist",
    pagination = true,
    main_title = "",
    disabled = true,
    search = true,
    required = false,
    displayKey = "label",
    onChangePicklist = null,
    valueKey = "value",
    onSearch = (param) => console.log(param),
    clearSearchResult = () => console.warn('Picklist: clearSearchResult not passed'),
    disablePickList = false,
    handleSearchToggle = () => console.warn('Picklist: handleSearchToggle not passed'),
    Picklist = null,
    hitGoAction = null,
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth });
  const [inputList, setInputList] = useState([]);
  const [inputValue, setInputValue] = useState(value);
  const [checked, setChecked] = React.useState();
  useEffect(() => {
    setInputList(list != null ? (list.data.length > 0 ? list.data : []) : []);
  }, [list])
  useEffect(() => {
    setInputValue(value);
  }, [value])
  const handleToggle = res => () => {
    setChecked(res[valueKey]);
  };
  const handleSelect = () => {
    let selectedValue = inputList.filter((res, key) => res[valueKey] === checked)[0];
    setInputValue(
      selectedValue[displayKey]
    );
    if (onChangeHandler != null) onChangeHandler(selectedValue);
  };

  const [radioKey, setRadioKey] = useState("2");

  const setRadio = (event) => {
    setRadioKey(event.target.value);
    handleSearchToggle(event.target.value);
  }

  const onSearchSubmit = data => {
    let param = data.searchString.trim();
    if (param !== '') {
      // setInputValue();
      setChecked();
      onSearch(param);
    }
  }

  return (
    <div className={form ? classes.container : classes.container1}>
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} className={classes.input_label}>{label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <div>
        <StyledInput
          id={name}
          defaultValue={inputValue}
          value={inputValue}
          name={name}
          disabled={disabled}
          margin="dense"
          required={required}
          endAdornment={
            <InputAdornment
              position="end"
              classes={{ positionEnd: classes.picklistAdorementPosition }}
              className={classes.picklist_clicked}
              disablePointerEvents={disablePickList}
              disabled={disablePickList}
            >
              <SimplePopover
                value={checked != null}
                icon_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/ellipsis.svg`}
                // width="300px"
                title={main_title != '' ? main_title : label ? label : 'Picklist'}
                onEnter={onOpen}
                onSelect={handleSelect}
                list={list}
                onClosePickList={clearSearchResult}
              >
                {(
                  <div variant="div" style={{ height: '100%', width: '250px', padding: '0 10px' }}>
                    <RadioGroup
                      row
                      value={radioKey}
                      onChange={event => setRadio(event)}
                    >
                      <FormControlLabel
                        value="2"
                        label="UserID"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="3"
                        label="User Name"
                        control={<Radio />}
                      />
                    </RadioGroup>
                    {(search) &&
                      <div
                        className={classes.picklist_search}>
                        <SearchBox
                          name="search"
                          clearSearchResult={
                            () => {
                              setChecked();
                              clearSearchResult()
                            }}
                          onSearchSubmit={onSearchSubmit}
                          width="100%"
                        />
                      </div>
                    }
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {Picklist}
                      <RegularButton variant="contained" color="primary" onClick={() => hitGoAction()}>Go</RegularButton>
                    </div>
                    {(pagination) && (
                      <div className={classes.picklist_pagination}>
                        {/* <Typography variant="subtitle2" style={{ color: '#767676' }}>{'<Select Option>'}</Typography> */}
                        <div><Pagination disabled_next={list != null && !list.enable_next} disabled_prev={list != null && !list.enable_prev} onChange={(param) => {
                          setInputValue();
                          setChecked();
                          onChangePicklist(param)
                        }} /></div>
                      </div>
                    )}
                    <div className={classes.picklist_item}>
                      <List
                        className={classes.picklist_item_list}
                        disablePadding
                      >
                        {loading ? (
                          <div style={{ height: "120px" }}>
                            <Spinner msg="" />
                          </div>
                        ) : inputList.map((res, key) => {
                          return (
                            <ListItem
                              selected={res[valueKey] === checked}
                              key={key}
                              role={undefined}
                              dense
                              button
                              onClick={handleToggle(res)}
                              classes={{ dense: classes.list_dense }}
                            >
                              <Tooltip title={`${res[displayKey]}(${res["personal_name"]})`} >
                                <Typography variant="subtitle1" noWrap style={{ width: '180px' }}>
                                  {/* <ListItemText primary={res[displayKey]} classes={{ primary: classes.listItemText }} /> */}
                                  {`${res[displayKey]}(${res["personal_name"]})`}
                                </Typography>
                              </Tooltip>
                            </ListItem>
                          );
                        })}
                      </List>
                    </div>
                  </div>
                )}
              </SimplePopover>
            </InputAdornment>
          }
          {...rest}
        />
        {helpertext != null &&
          form && (
            <FormHelperText id="my-helper-text" className={classes.helper_text}>{helpertext}</FormHelperText>
          )}
      </div>
    </div>
  );
};

export const AssociatedPickList = props => {
  const {
    label = null,
    helpertext = null,
    loading = true,
    value = "",
    list = [],
    onOpen = null,
    form = true,
    labelMinWidth = "80px",
    labelMaxWidth = "80px",
    onChangeHandler = null,
    name = "picklist",
    pagination = true,
    main_title = "",
    disabled = true,
    search = true,
    required = false,
    action = null,
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth });
  return (
    <div className={form ? classes.container : classes.container1}>
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} className={classes.input_label}>{label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <div>
        <StyledInput
          id={name}
          defaultValue={value}
          name={name}
          disabled={disabled}
          margin="dense"
          required={required}
          endAdornment={
            <InputAdornment
              position="end"
              classes={{ positionEnd: classes.picklistAdorementPosition }}
              className={classes.picklist_clicked}
            >
              <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/ellipsis.svg`} onClick={action} disabled={disabled} />
            </InputAdornment>
          }
          {...rest}
        />
        {helpertext != null &&
          form && (
            <FormHelperText id="my-helper-text" className={classes.helper_text}>{helpertext}</FormHelperText>
          )}
      </div>
    </div>
  );
};

export const TextArea = props => {
  const {
    minRows,
    maxRows,
    style,
    label = "Enter Field",
    value,
    onChange = null,
    name
  } = props;
  const [inputValue, setInputValue] = useState(value != null ? value : "");
  const onChangeHandler = e => {
    setInputValue(e.target.value.trim());
    if (onChange != null) {
      onChange(e);
    }
  };
  const classes = useStyle();
  return (
    <div className={stylesheet.container}>
      <label for="text_area" className={stylesheet.label}>
        <Typography variant="caption">{label}</Typography>
      </label>
      <TextareaAutosize
        id="text_area"
        name={name}
        value={inputValue}
        onChange={onChangeHandler}
        className={classes.textarea}
        rowsMin={minRows}
        rowsMax={maxRows}
        placeholder={label}
        label=""
        style={{ minWidth: "100%" }}
      />
    </div>
  );
};

export const RadioButton = props => {
  const { label, value, name, checked, onChange } = props;
  return (
    <label class={stylesheet.radio_container}>
      {label}
      <input
        type="radio"
        name={name}
        checked={checked}
        value={value}
        onChange={onChange}
      />
      <span className={stylesheet.checkmark} />
    </label>
  );
};

export const CardRadioButton = props => {
  const {
    radio_group_array = [],
    label = "Enter Label",
    value,
    name,
    onChange = null
  } = props;
  const [inputValue, setInputValue] = useState(value != null ? value : "");
  const onChangeHandler = e => {
    setInputValue(e.target.value);
    if (onChange != null) {
      onChange(e);
    }
  };
  const classes = useStyle();
  const StyledRadio = props => {
    return (
      <Radio
        className={classes.root}
        disableRipple
        color="default"
        checkedIcon={<Card checked={true} {...props} />}
        icon={<Card {...props} />}
        {...props}
        required={true}
      />
    );
  };
  return (
    <div className={stylesheet.container}>
      <InputLabel htmlFor={name} style={{ fontWeight: 600, fontSize: '12px', color: '#606060', marginBottom: '10px' }}>
        {label}
      </InputLabel>
      {/*<label for="radio_group" className={stylesheet.label}><Typography variant="caption">{label}</Typography></label>*/}
      <RadioGroup
        id={name}
        classes={{ root: classes.formgroup }}
        aria-label="gender"
        name="customized-radios"
        value={inputValue}
        onChange={onChangeHandler}
      >
        <Grid container>
          {radio_group_array.map((res, key) => (
            <Grid item sm={6}>
              <FormControlLabel
                value={res.value}
                name={name}
                control={<StyledRadio image_url={res.image_url} />}
                disabled={res.disabled}
                classes={{ root: classes.formcontrollabel }}
              />
              <Typography className={classes.input_label} style={{ margin: '8px 0', color: '#000000' }}>
                {res.label}
              </Typography>
              <Typography className={classes.radio_desc}>
                {res.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </div>
  );
};

export const Button = props => {
  const {
    className,
    style,
    label = "Enter Field",
    size = "medium",
    disabled = false
  } = props;
  const button_size =
    size == "medium" ? "12px 20px" : size == "small" ? "5px 10px" : "18px 25px";
  let styleData =
    style == null
      ? { padding: button_size }
      : { padding: button_size, ...style };
  return (
    <div className={stylesheet.input_group}>
      <a
        href="javascript:"
        className={classNames(stylesheet.button, className)}
        style={styleData}
        onClick={disabled ? "" : props.onClick}
      >
        {label}
      </a>
    </div>
  );
};


export const SelectBox1 = (props) => {
  const {
    label = null,
    helpertext = null,
    value = "",
    onChangeHandler = null,
    name = "input_box",
    labelMinWidth = "95px",
    labelMaxWidth = "95px",
    disabled = false,
    form = true,
    required = false,
    injectLiveValue = false,
    list: [],
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth });
  return (
    <div className={form ? classes.container : classes.container1}>
      {/* </div>*/}
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} variant="div" className={classes.input_label}> {label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <div>
        <Autocomplete
          multiple
          limitTags={2}
          id="multiple-limit-tags"
          // options={props.list}
          // getOptionLabel={(option) => option.label}
          // getOptionSelected={(option)=>option.value}
          options={top100Films}
          getOptionLabel={(option) => option.title}
          defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="limitTags" placeholder="Favorites" />
          )}
        />

        {helpertext != null &&
          form && (
            <FormHelperText id="my-helper-text" className
              ={classes.helper_text}>{helpertext}</FormHelperText>
          )}
      </div>
    </div>
  );
}


const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];

// Added by sandeep singh
const useMultiSelectStyle = makeStyles(theme => {
  return {
    root: {
      height: '20px',
      margin: '0',
      '& .MuiCheckbox-root': {
        padding: theme.spacing(.5, 1, .5, .5)
      }
    },
    head: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      '& .MuiFormControlLabel-root': {
        '& .MuiTypography-root': {
          color: '#B1B1B1',
        }
      },
      '& .MuiTypography-colorPrimary': {
        color: '#0072C6',
        cursor: 'pointer'
      }
    }
  }
})

const getInitialValues = (data) => {
  let obj = {};

  data.map((item, index) => obj = {
    ...obj,
    [item.id]: false,
  })
  return obj
}

export const MultiSelectBox = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [values, setValues] = useState(getInitialValues(props.options))
  const [allTrue, setAllTrue] = useState(false)
  const [selectedValue, setselectedValue] = useState([])

  const myClass = useMultiSelectStyle();
  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });

  const { t, i18n } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])


  const {
    label = null,
    helpertext = null,
    value = null,
    list = [],
    placeholder = `${t('bam:SELECT')}`,
    labelMinWidth = "95px",
    labelMaxWidth = "95px",
    onChangeHandler = null,
    name = "select_box",
    disabled = false,
    form = true,
    required = false,
    type = "",
    injectLiveValue = false,
    ...rest
  } = props;
  const classes = useStyle({ labelMinWidth, labelMaxWidth });
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (value === "" || value === []) {
      handleAll("CLEARALL")
    }
  }, [value])


  const hanldeChange = (key) => {
    const obj = {
      ...values,
      [key]: !values[key]
    }
    setValues(obj)
    setAllTrue(false);
    handleChangeHandler(obj);
  }

  const handleAll = (type) => {
    let obj = {};
    props.options.map((item, index) => obj = {
      ...obj,
      [item.id]: type === "CLEARALL" ? false : !allTrue,
    })
    setValues(obj)
    setAllTrue(type === "CLEARALL" ? false : !allTrue)
    handleChangeHandler(obj);
  }

  const handleChangeHandler = (obj) => {
    let ar = [];
    props.options.map((item, index) => {
      if (obj[item.id]) ar.push(item.id)
    })

    setselectedValue(ar)

    props.onChange(ar);
  }

  return (
    <div className={form ? classes.container : classes.container1}>
      {/* </div>*/}
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography noWrap={true} className={classes.input_label}> {label}{required && <span className={classes.required_field}>*</span>}</Typography>
        </InputLabel>
      )}
      <StyledInput
        id={name}
        defaultValue={'Select'}
        name={name}
        placeholder={t('bam:PLEASE_SELECT')}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        value={injectLiveValue === true
          ? value.length == 0
            ? `${t('bam:PLEASE_SELECT')}`
            : value.length + ` ${t('bam:ITEM_SELECTED')}`
          : selectedValue.length !== 0
            ? selectedValue.length + ` ${t('bam:ITEM_SELECTED')}`
            : `${t('bam:PLEASE_SELECT')}`
        }
        disabled={disabled}
        onChange={onChangeHandler}
        margin="dense"
        required={required}
        endAdornment={
          (
            <InputAdornment position="end" classes={{ positionEnd: classes.adormentPositionEnd }}>
              <ArrowDropDownIcon />
            </InputAdornment>
          )
        }
        {...rest}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div style={{ padding: '8px 8px 8px 0', minWidth: '206px', minHeight: '50px', maxHeight: '400px' }}>
          {/* //* To render the select all and clear all in multiselect */}
          <div className={myClass.head}>
            <FormControlLabel
              className={myClass.root}
              control={
                <Checkbox
                  checked={allTrue}
                  onChange={handleAll}
                  name={'selectAll'}
                />
              }
              label={`<${t('bam:SELECT_ALL')}>`}
            />
            <Typography color="primary" onClick={() => handleAll('CLEARALL')}>{t('bam:CLEAR_ALL')}</Typography>
          </div>
          {/* //* To render all the multiselect options */}
          {props.options.map((item, index) => {
            return (
              <div key={index}>
                <FormControlLabel
                  className={myClass.root}
                  control={
                    <Checkbox
                      checked={values[item.id]}
                      onChange={() => hanldeChange(item.id)}
                      name={item.id}
                    />
                  }
                  label={item.label
                  }
                />
              </div>
            )
          })}
        </div>
      </Popover>
      {
        helpertext != null &&
        form && <FormHelperText id="my-helper-text" className={classes.helper_text}>{helpertext}</FormHelperText>
      }
    </div >
  );
};