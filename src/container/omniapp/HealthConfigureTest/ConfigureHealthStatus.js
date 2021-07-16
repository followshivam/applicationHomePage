import React, { useEffect } from 'react'
import { makeStyles, useTranslation } from 'component';
import { InputBox, SelectBox } from "component/Form";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import HealthPickList from './HealthPickList.js'
import TimePicker from 'component/TimePicker'
import { useSelector } from "react-redux";
//Common Component
import {
    Button, Typography, List, ListItem, ListSubheader, ListItemText, FormControlLabel,
    Checkbox, Popover, DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';
import { Spinner, TableComponent } from 'component';
import { GetHealthConfigData, GetReportList, CreateNewHealthException } from 'global/bam/api/ApiMethods';


const useDailogStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: '4px',
        width: '799px',
        minHeight: '562px',
        display: 'flex',
        flexDirection: 'column'
    },
    spacing: {
        padding: theme.spacing(1, 3, 2, 1),
        alignItems: 'stretch'
    },
    title: {
        padding: theme.spacing(2, 2, 1, 2),
        fontWeight: '600 !important',
    },
    form: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        flex: 1
    },
    dividers: {
        borderBottom: 'none',
    },
    checkboxRoot: {
        justifyContent: 'flex-end',
        '& .MuiCheckbox-root': {
            padding: theme.spacing(1, 0)
        },
        '& .MuiTypography-root': {
            flexBasis: '120px'
        }
    },

    //Update Style
    MuiDialogContent: {
        padding: 0,
        display: 'flex',
        justifyContent: 'space-between',
        '&:first-child': {
            paddingTop: 0
        },
        '& .MuiSelect-root': {
            padding: '4px',
            height: 'auto'
        },
        '& .MuiFormControlLabel-root': {
            marginRight: theme.spacing(.5)
        },
        '& .MuiCheckbox-root': {
            padding: '6px 9px',
        },
        '& .MuiTable-root>div': {
            marginTop: 0
        }
    },
}));


const useSidebarStyle = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1, 0, 1, 2),
        '& .MuiListSubheader-root': {
            fontSize: '10px',
            lineHeight: '20px',
            color: '#606060',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        '& .MuiListSubheader-gutters': {
            padding: theme.spacing(0, 1, 0, 0),
        },
        '& .MuiListItem-root': {
            padding: theme.spacing(.5, 1),
        },
        '& .Mui-selected': {
            background: '#FF66001A'
        }
    },
}))

const useHealthColorStyle = makeStyles((theme) => ({
    boxColor: {
        display: 'block', width: '20px', height: '20px',
        background: props => props.color,
        border: '1px solid #c1c1c1', borderRadius: '2px', cursor: 'pointer'
    },
}))


const HealthColorPicker = (props) => {
    const classes = useHealthColorStyle({ color: props.color });
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    var colors = ['#FF4600', '#FF1100', '#FF2300', '#FF3400', '#FF4600', '#FF5700',
        '#FF6900', '#FF7B00', '#FF8C00', '#FF9E00', '#FFAF00', '#FFC100',
        '#FFD300', '#FFE400', '#FFF600', '#F7FF00', '#E5FF00', '#DFFF00',
        '#C2FF00', '#B0FF00', '#9FFF00', '#8DFF00', '#7CFF00', '#6AFF00',
        '#58FF00', '#47FF00', '#35FF00', '#24FF00', '#12FF00', '#00FF00',
    ];

    return (
        <React.Fragment>
            <div className={classes.boxColor} onClick={(event) => setAnchorEl(event.currentTarget)}></div>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div style={{
                    width: '60px', boxShadow: '0px 3px 6px #00000029', display: 'flex', flexWrap: 'wrap'
                }}>
                    {colors.map((item, index) => (
                        <div key={index} style={{
                            display: 'block', width: '10px', height: '10px',
                            cursor: 'pointer', background: item
                        }} onClick={() => props.colorChanger(item)}></div>
                    ))}
                </div>
            </Popover>
        </React.Fragment>
    )
}

const RenderSideBar = (props) => {
    const { t } = props;
    const classes = useSidebarStyle();
    const [selectedTab, setselectedTab] = React.useState(0)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [objectList, setObjectList] = React.useState({ loading: true, list: null, error_msg: "" })
    const [targerElement, setTargerElement] = React.useState(null)
    const [showReportPopover, setshowReportPopover] = React.useState(false)
    const snackbarState = useSelector(store => store.snackbarState);

    const open = Boolean(anchorEl);

    const onOpenPicklist = (opr, filter) => {
        let payload = {
            "type": "List",
            "opr": opr,
            "category": "GR",
            "category_id": "7",
            "last_blockedstatus": "",
            "showblocked_top": false,
            "hide_blocked": false,
            "healthstatus_code": "0",
            "filter": filter ? filter : "",
            "last_index": opr === "0" ? "" : (opr === "1" ? objectList.list.last_index : objectList.list.first_index),
            "last_name": opr === "0" ? "" : (opr === "1" ? objectList.list.last_name : objectList.list.first_name),
        }
        GetReportList(payload).then((res) => {
            if (res != null && res.status.maincode === "0") {
                setObjectList({ ...objectList, loading: false, list: res.data })
            }
            else {
                setObjectList({ ...objectList, loading: false, error_msg: res.status.errormsg })
            }
        }).catch((err) => { })
    }

    const hanldeInsert = (reportSelected, arg) => {
        const duplicateExcetption = { "report_index": reportSelected }
        const newSelectedException = { "report_index": arg.report_index }
        CreateNewHealthException(duplicateExcetption, newSelectedException)
            .then(res => {
                props.setPayload({ report_index: arg.report_index })
                snackbarState.openSnackbar('Successfully added new exception', 'success');
            }).catch(err => { })
    }

    return (
        <React.Fragment>
            <List
                component="nav"
                aria-labelledby="Default-Configuration"
                subheader={<ListSubheader component="div" id="Default-Configuration">{t('omniapp:DEFAULT_CONFIGURATION')}</ListSubheader>}
                className={classes.root}
                style={{ borderBottom: '1px solid #F8F8F8' }}
            >
                <ListItem style={{ cursor: 'pointer' }} onClick={() => {
                    props.setPayload({ report_index: "0" })
                    setselectedTab(0)
                }} selected={selectedTab == 0}>
                    <ListItemText primary="All Reports" />
                </ListItem>
            </List>
            <List
                component="nav"
                aria-labelledby="Exceptional-Configuration"
                subheader={
                    <ListSubheader component="div" id="Exceptional-Configuration">{t('omniapp:EXCEPTIONAL_CONFIGURATION')}
                        <AddIcon color='primary' onClick={(event) => {
                            setTargerElement(event.currentTarget)
                            setshowReportPopover(true);
                            setselectedTab("0")
                        }} />
                    </ListSubheader>
                }
                className={classes.root}
            >
                <div style={{ height: '370px', overflow: 'scroll' }}>
                    {props.list.map((item, index) => {
                        return (
                            <ListItem key={index} style={{ cursor: 'pointer' }} onClick={() => {
                                if (item.report_id !== selectedTab)
                                    props.setPayload({ report_index: item.report_id })
                                setselectedTab(item.report_id)
                            }}
                                selected={selectedTab == item.report_id}>
                                <ListItemText primary={item.name} />
                                <MoreVertIcon onClick={(event) => {
                                    setAnchorEl(event.currentTarget);
                                    setTargerElement(event.currentTarget)
                                }} />
                            </ListItem>
                        )
                    })}
                </div>
            </List>
            <HealthPickList
                name="reports"
                targerElement={showReportPopover ? targerElement : null}
                onOpen={() => onOpenPicklist("0")}
                onClose={() => {
                    setTargerElement(null);
                    setshowReportPopover(false);
                }}
                onSearchSubmit = {(str) => onOpenPicklist("0", '')}
                onSearchChange={(str) => onOpenPicklist("0", str.searchString)}
                list={objectList.list == null ? null : objectList.list}
                loading={objectList.loading}
                displayKey={"report_name"}
                valueKey={"report_index"}
                onChangeHandler={(result) => hanldeInsert(selectedTab, result)}
                onChangePicklist={(params) => onOpenPicklist((params === "next") ? "1" : "2")}
            />

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div style={{ minWidth: '100px', minHeight: '20px', padding: '8px', boxShadow: '0px 3px 6px #00000029', cursor: 'pointer' }}
                    onClick={(event) => { setshowReportPopover(true); setAnchorEl(null) }}>
                    Duplicate Exception
                </div>
            </Popover>
        </React.Fragment>
    )
}

function ConfigureHealthStatus(props) {
    const classes = useDailogStyles();
    const { handleClose, modalType, id } = props;
    const snackbarState = useSelector(store => store.snackbarState);
    const [payload, setPayload] = React.useState({ "report_index": "0" })
    const [mailText, setmailText] = React.useState("")
    const [values, setvalues] = React.useState({})
    const [emails, setEmails] = React.useState([])
    const [reportListException, setReportListException] = React.useState([])
    const [healthStatusData, sethealthStatusData] = React.useState([])
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const [isLoading, setIsLoading] = React.useState({
        msg: `${t('bam:LOADING')}...`,
        loading: true
    });

    const { loading, msg } = isLoading;


    const healthStatus = [
        { value: "1", label: `${t('omniapp:GOOD')}` },
        { value: "2", label: `${t('omniapp:AVERAGE')}` },
        { value: "3", label: `${t('omniapp:BAD')}` },
    ]


    useEffect(() => {
        setIsLoading({ ...isLoading, loading: true })
        GetHealthConfigData(payload).then(res => {
            const { data, report_list_exception } = res.data;

            if (data !== undefined) {
                let time = new Date(data.block_frequency_time_bound * 1000).toISOString().substr(11, 8)

                setReportListException(report_list_exception)
                sethealthStatusData(data.health_status)
                setEmails(data.mail_ids)
                setvalues({
                    block_frequency: data.block_frequency,
                    block_frequency_time_bound: time,
                    block_if_frequency: data.block_if_frequency,
                    block_if_gen_time_avg: data.block_if_gen_time_avg,
                    block_if_range: data.block_if_range,
                    block_range: data.block_range,
                    send_mail: data.send_mail,
                    peak_hours_from: data.peak_hours_from,
                    peak_hours_to: data.peak_hours_to,
                    peak_minutes_from: data.peak_minutes_from,
                    peak_minutes_to: data.peak_minutes_to,
                })
            }
            setIsLoading({ ...isLoading, loading: false })

        }).catch(err => { })

    }, [payload])

    const updateHealthStatusValuehandler = (value, obj, type) => {
        const currentID = obj.id;
        let upateArr = [];

        healthStatusData.forEach((element, index) => {
            if (type == 'COLOR') {
                if (element.id == currentID) {
                    element.colour = value;
                }
            } else {
                if (element.id == currentID) {
                    element.to_range = value;
                    healthStatusData[index + 1].from_range = value
                }
            }
            upateArr.push(element)
        });

        sethealthStatusData(upateArr)
    }

    const headCells = healthStatusData.length > 0
        ? [
            {
                id: "", numeric: false, disablePadding: false, label: `${t('omniapp:STATUS_NAME')}`,
                component: (res) => <SelectBox list={healthStatus}
                    value={res.id} disabled={true}
                    labelMaxWidth="95px" labelMinWidth="95px" name="status"
                    style={{ width: '105px' }} onChange={() => console.log("change")}
                />
            },
            {
                id: "", numeric: false, disablePadding: false, label: `${t('omniapp:RANGE')} (SS-SS)`,
                component: (res) => <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InputBox
                        name={"from_range"}
                        value={res.from_range ? res.from_range : '0'}
                        onChangeHandler={(e) => console.log("Change")}
                        form={true}
                        injectLiveValue={true}
                        endAdornment={false}
                        disabled={true}
                        style={{ width: '48px', height: '24px' }}
                        type="number"
                        placeholder={'SS'}
                    />
                    <div style={{ padding: '0 6px' }}>-</div>
                    {
                        (res.to_range !== "-1")
                            ? <InputBox
                                name={"to_range"}
                                value={res.to_range}
                                onChangeHandler={(e) => updateHealthStatusValuehandler(e.target.value, res)}
                                style={{ width: '48px', height: '24px' }}
                                form={true}
                                type="number"
                                placeholder={'SS'}
                            />
                            : <AllInclusiveIcon />
                    }
                </div>
            },
            {
                id: "", numeric: false, disablePadding: false, label: `${t('omniapp:COLOR')}`,
                component: (res) => <HealthColorPicker
                    color={res.colour}
                    colorChanger={(val) => updateHealthStatusValuehandler(val, res, 'COLOR')} />
            },
            {
                id: "", numeric: false, disablePadding: false, label: `${t('omniapp:PREVIEW')}`,
                component: (res) => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ background: res.colour, width: '12px', height: '12px', borderRadius: '50%', marginRight: '8px' }}></div>
                            <div>{healthStatus.filter(item => item.value == res.id)[0].label}</div>
                        </div>
                    )
                }
            },
        ]
        : []

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading({ ...isLoading, loading: true })
        const param = {
            "report_index": payload.report_index,
            "operation": "U",
            "health_status": healthStatusData,
            "mail_ids": emails,
            ...values,
        }

        GetHealthConfigData(param).then(res => {
            setIsLoading({ ...isLoading, loading: false })
            snackbarState.openSnackbar('Successfully updated the exception', 'success');
        }).catch(err => { })

        return false;
    }

    const handleDelete = () => {
        setIsLoading({ ...isLoading, loading: true })
        let param = {
            "report_index": payload.report_index,
            "operation": "D"
        }

        GetHealthConfigData(param).then(res => {
            if (res !== null) {
                setPayload({ "report_index": "0" })
                snackbarState.openSnackbar('Successfully deleted the exception', 'success');
            } else {
                setIsLoading({ ...isLoading, loading: false })
                snackbarState.openSnackbar('Something went wrong.', 'error');
            }
        }).catch(err => {
            console.log('err : ', err);
            snackbarState.openSnackbar(err, 'error');
        })
    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const addEmailHandler = () => {

        const isEmail = validateEmail(mailText);
        if (isEmail) {
            const updateEmails = emails.filter(item => item === mailText)
            if (updateEmails.length === 0) {
                setEmails([...emails, mailText])
                setmailText("")
            }
        } else {
            snackbarState.openSnackbar('Please enter a valid emali.', 'warning');
        }
    }

    const removeEmailHandler = (val) => {
        const updateEmails = emails.filter(item => item !== val)
        setEmails(updateEmails)
    }

    return (
        <div className={classes.paper}>
            <DialogTitle id="dialog-title" className={classes.title}>{t('omniapp:CONFIGURE_HEALTH_STATUS')}</DialogTitle>
            <form className={classes.form} onSubmit={handleSubmit}>
                <DialogContent dividers classes={{ dividers: classes.dividers, root: classes.MuiDialogContent }}>
                    <div style={{ width: '207px', height: '100%', borderRight: '1px solid #F8F8F8' }}>
                        <RenderSideBar list={reportListException} t={t} setPayload={setPayload} />
                    </div>
                    {loading
                        ? <div style={{ margin: "0 auto" }}><Spinner msg={msg} /></div>
                        : <div style={{ flex: 1, padding: '16px' }}>
                            <Typography style={{ color: '#606060', borderBottom: '1px solid #F8F8F8', paddingBottom: '10px' }}>{t('omniapp:HEALTH_CONFIG_HEADING')}</Typography>
                            <div style={{ width: '100%', borderBottom: '1px solid #F8F8F8' }}>
                                <TableComponent
                                    dynamicHeight="160px"
                                    minWidth='560px'
                                    tableData={healthStatusData}
                                    headerData={headCells}
                                    loading={false}
                                    disableFirstCell={true}
                                />
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                <Typography style={{ color: '#606060', paddingBottom: '5px' }}>{t('omniapp:BLOCKING_COND')}</Typography>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={values.block_if_frequency} name="block_if_frequency"
                                            onChange={() => setvalues({ ...values, block_if_frequency: !values.block_if_frequency })} />}
                                        label={t('omniapp:BLOCKING_COND_TIME')}
                                    />
                                    <InputBox
                                        name={"block_frequency"}
                                        injectLiveValue={true}
                                        endAdornment={false}
                                        value={values.block_frequency}
                                        onChangeHandler={(e) => setvalues({ ...values, block_frequency: e.target.value })}
                                        style={{ width: '44px', height: '24px' }}
                                        type="number"
                                        disabled={!values.block_if_frequency}
                                    />
                                    <Typography style={{ padding: '0 4px' }}>{t('omniapp:TIME_WITHIN')}</Typography>
                                    <TimePicker
                                        name={"block_frequency_time_bound"}
                                        value={values.block_frequency_time_bound}
                                        placeholder={'HH:MM:SS'}
                                        format={'(hh:mm:ss)'}
                                        hasSecond={true}
                                        style={{ width: '74px', height: '24px' }}
                                        injectLiveValue={true}
                                        endAdornment={false}
                                        disabled={!values.block_if_frequency}
                                        onCloseHandler={(val) => setvalues({
                                            ...values,
                                            block_frequency_time_bound: val
                                        })}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={values.block_if_range} name="block_if_range"
                                            onChange={() => setvalues({ ...values, block_if_range: !values.block_if_range })} />}
                                        label={t('omniapp:BLOCKING_COND_TIME_MORE')}
                                    />
                                    <SelectBox
                                        name={"block_range"}
                                        injectLiveValue={true}
                                        value={values.block_range}
                                        onChangeHandler={(e) => setvalues({ ...values, block_range: e.target.value })}
                                        list={healthStatus}
                                        style={{ width: '115px', height: '24px' }}
                                        form={false}
                                        disabled={!values.block_if_range}
                                    />
                                </div>
                                {/* block_if_gen_time_avg */}
                                <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={values.block_if_gen_time_avg} name="block_if_gen_time_avg"
                                            onChange={() => setvalues({ ...values, block_if_gen_time_avg: !values.block_if_gen_time_avg })} />}
                                        label={t('omniapp:BLOCKING_COND_CURRENT')}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                                        <Typography style={{ padding: '0 4px' }}>{t('omniapp:PEAK_HOURS')}</Typography>

                                        <TimePicker
                                            name={"peak_from"}
                                            injectLiveValue={true}
                                            endAdornment={false}
                                            value={values.peak_hours_from + " : " + values.peak_minutes_from}
                                            disabled={!values.block_if_gen_time_avg}
                                            onCloseHandler={(val) => setvalues({
                                                ...values,
                                                peak_hours_from: val.split(":")[0],
                                                peak_minutes_from: val.split(":")[1],
                                            })}
                                        />

                                        <Typography style={{ padding: '0 4px' }}>-</Typography>

                                        <TimePicker
                                            name={"peak_to"}
                                            injectLiveValue={true}
                                            endAdornment={false}
                                            value={values.peak_hours_to + " : " + values.peak_minutes_to}
                                            disabled={!values.block_if_gen_time_avg}
                                            onCloseHandler={(val) => setvalues({
                                                ...values,
                                                peak_hours_to: val.split(":")[0],
                                                peak_minutes_to: val.split(":")[1],
                                            })}
                                            format={'(hh:mm - hh:mm)'}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={values.send_mail} name="send_mail"
                                            onChange={() => setvalues({ ...values, send_mail: !values.send_mail })} />}
                                        label={t('omniapp:SEND_EMAIL')}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <InputBox
                                            name={"mailText"}
                                            value={mailText}
                                            injectLiveValue={true}
                                            onChangeHandler={(e) => setmailText(e.target.value)}
                                            style={{ width: '200px', height: '24px' }}
                                            type="email"
                                            endAdornment={false}
                                            disabled={!values.send_mail}
                                            placeholder={t('omniapp:ENTER_EMAIL')}
                                        />
                                        <div style={{
                                            display: 'grid', placeItems: 'center', width: '24px', height: '27px', cursor: 'pointer',
                                            borderRadius: '0 2px 2px 0', border: '1px solid #DADADA', borderLeft: 'none',
                                        }}
                                            onClick={addEmailHandler}
                                        ><AddIcon /></div>
                                    </div>
                                </div>

                                {emails && emails.map((item, index) => {
                                    return (
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', height: '23px', margin: '0 12px 10px 0',
                                            background: '#F8F8F8', borderRadius: '15px', padding: '0  12px', flexWrap: 'wrap'
                                        }} key={index}>
                                            <Typography>{item}</Typography>
                                            <CloseIcon stye={{ marginLeft: '8px' }} onClick={() => removeEmailHandler(item)} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    }
                </DialogContent>
                <DialogActions className={classes.spacing}>
                    <Button onClick={handleClose} variant="outlined">{t('omniapp:LABEL_CANCEL')}</Button>
                    {
                        payload.report_index != 0 &&
                        <Button onClick={handleDelete} variant="contained"
                            style={{ background: 'red', borderColor: 'red', color: 'white', padding: '0 10px' }}
                        >{t('omniapp:DELETE')}</Button>
                    }
                    <Button type="submit" variant="contained" color="primary" style={{ width: '60px' }}>{t('omniapp:SAVE')}</Button>
                </DialogActions>
            </form>
        </div>
    )
}

export default ConfigureHealthStatus