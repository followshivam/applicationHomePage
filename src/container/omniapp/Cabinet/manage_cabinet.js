import React, { useState, useEffect } from 'react'
import {
    InputBox, SelectBox, Grid, makeStyles, Button, StyledTab as StyledTabs, TableComponent, Divider,
    Checkbox, InputLabel, Typography, Spinner, DialogContent, MuiDialogTitle, IconsButton
} from 'component'
import { registeredCabinetsData } from 'global/json';
import { useSelector } from 'react-redux';
import { GetCabList, ConnectServer, ActCab, GetAppServers } from 'global/omniapp/api/ApiMethods';
import { encryptPassword } from '../Login/password_encrypt';

/**
 * Style for Regsiter Cabinet Tab
 */
const useStyle = makeStyles(theme => (
    {
        tabContainer: {
            marginTop: "1rem",
            padding: theme.spacing(1, 1, 0, 1)
        },
        registerTabContainer: {
            minHeight: "22rem"
        },
        unregisterFormContainer: {
            marginTop: "1rem",
            marginBottom: "1rem"
        },
        input_label_root: {
            display: "contents"
        },
        input_label: {
            ...theme.typography.input_label,
            fontSize : '0.75rem',
            minWidth: "120px",
            maxWidth: "120px"
        },
        inputBox: {
            "& .MuiInputBase-input": {
                width: "15rem"
            }
        },
        selectBox: {
            minWidth: "90px"
        },
        connectSelectBox: {
            width: "15.6rem",
        },
        button: {
            color: "white",
            width: "5rem",
            backgroundColor: theme.palette.secondary.main,
            "&:hover": {
                backgroundColor: theme.palette.secondary.main,
                boxShadow: 'none'
            },
        },
        root: {
            margin: 0,
            padding: 0
        }
        , title: {
            fontWeight: '600 !important',
            padding: theme.spacing(2, 2, 1, 2),
        }
        // closeButton: {
        //     position: 'absolute',
        //     right: theme.spacing(1),
        //     top: theme.spacing(1),
        //     color: theme.palette.secondary.main,
        // },
    }
))

const RegisterCabinet = (props) => {

    const [formData, setFormData] = useState({
        app_server_ip: '',
        app_server_port: '',
        app_server_type: '',
        multitenancy: false,
        user_name: '',
        user_cred: '',
        cabinet_alias: '',
        volume_id: '0'
    })
    const [site_id, setSite_id] = useState('0');
    const [site_name, setSite_name] = useState('<None>')
    const [volume_name, setVolume_name] = useState('<None>')
    const [cabinet_name, setCabinet_name] = useState()
    const initialValue = { value: '0', label: "<None>" };
    const { handleRefresh, isRefreshRequired, token, inis } = props;
    const [isConnected, setIsConnected] = useState(false);
    const [cabinets, setCabinets] = useState([]);
    const [sites, setSites] = useState([initialValue]);
    const [volumes, setVolumes] = useState([initialValue]);
    const [loading, setLoading] = useState({
        loading: false,
        msg: "connecting..."
    })
    const [appServerTypes, setAppServerTypes] = useState([]);
    const normalDialogStore = useSelector(state => state.normalDialogState);

    const classes = useStyle();

    useEffect(() => {
        GetAppServers()
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    const data = res.data
                    // setAppServerTypes(data.AppServers);
                    // Need to uncomment below for present changes
                    // -------------------------
                    const modifiedAppServers = data.appservers.map(appserver => {
                        return { label: appserver.name, value: appserver.value }
                    })
                    setAppServerTypes(modifiedAppServers);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    useEffect(() => {
        if (!isEmpty(formData)) {
            ConnectServer(JSON.stringify({ ...formData, site_id: '', cabinet_name: cabinet_name }))
                .then(res => {
                    if (res != null && res.status.maincode === "0") {
                        const data = res.data;
                        let siteList = []
                        if (data.cabinets) {
                            const firstCabinet = data.cabinets[0];
                            const sites = firstCabinet.sites
                            if (sites) {
                                sites.forEach(site => {
                                    siteList.push({ value: site.id, label: site.name });
                                })
                                setSites([initialValue, ...siteList]);
                                setSite_id('0')
                                setSite_name('<None>')
                                setVolume_name('<None>')
                                setFormData(() => {
                                    return {
                                        ...formData,
                                        cabinet_alias: firstCabinet.alias,
                                        volume_id: "0"
                                    }
                                })
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [cabinet_name])

    useEffect(() => {
        if (!isEmpty(formData)) {
            ConnectServer(JSON.stringify({ ...formData, cabinet_name: cabinet_name, site_id: site_id }))
                .then(res => {
                    if (res != null && res.status.maincode === "0") {
                        const data = res.data;
                        let volumeList = []
                        if (data.cabinets) {
                            const firstCabinet = data.cabinets[0];
                            const sites = firstCabinet.sites
                            if (sites) {
                                const firstSite = sites[0];
                                const volumes = firstSite.volumes
                                if (volumes) {
                                    volumes.forEach(volume => volumeList.push({ value: volume.id, label: volume.name }))
                                }
                                setSite_id(firstSite.id)
                                setSite_name(firstSite.name)
                                setVolume_name('<None>')
                                setFormData({
                                    ...formData,
                                    volume_id: "0"
                                })
                                setVolumes([initialValue, ...volumeList])
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [site_id])

    const isEmpty = (data) => {
        return data['app_server_ip'] === '' && data['app_server_port'] === '' && data['app_server_type'] === '';
    }

    const handleChange = event => {
        const name = event.target.name
        setFormData({
            ...formData,
            [name]: event.target.value
        })
    }

    const connectCabinet = () => {
        setLoading({
            ...loading,
            loading: true
        })
        if (formData && formData.app_server_ip != '' && formData.app_server_port !== ''
            && formData.app_server_type != '') {
            ConnectServer(JSON.stringify(formData))
                .then(res => {
                    if (res != null && res.status.maincode === "0") {
                        const data = res.data;
                        let cabinetList = [];
                        let siteList = []
                        snackbarStore.openSnackbar("Connected !", "success", 2000)
                        if (data.cabinets) {
                            data.cabinets.forEach(cabinet => {
                                cabinetList.push({ value: cabinet.alias, label: cabinet.name })
                            })
                            const firstCabinet = data.cabinets[0];
                            const sites = firstCabinet.sites
                            if (sites) {
                                sites.forEach(site => {
                                    siteList.push({ value: site.id, label: site.name });
                                })
                            }
                            setCabinets(cabinetList);
                            setCabinet_name(firstCabinet.alias)
                            setSites([initialValue, ...siteList]);
                            setFormData(() => {
                                return {
                                    ...formData,
                                    cabinet_alias: firstCabinet.alias,
                                }
                            })
                            setIsConnected(true);
                            setLoading({
                                ...loading,
                                loading: false
                            })
                        }
                    } else {
                        const description = res.status && res.status.description ? res.status.description : "Something went wrong, Please contact Admin"
                        snackbarStore.openSnackbar(description, "error", 2000)
                        setLoading({
                            ...loading,
                            loading: false
                        })
                    }

                })
                .catch(err => {
                    setLoading({
                        ...loading,
                        loading: false
                    })
                    console.log(err)
                })
        } else {
            setIsConnected(false);
            alert('Some fields might be empty');
            setLoading({
                ...loading,
                loading: false
            })
        }
    }
    const snackbarStore = useSelector(state => {
        return state.snackbarState;
    });

    const registerCabinet = () => {

        if (formData && formData.cabinet !== '' && formData.user_name !== '' && formData.user_cred !== '') {
            encryptPassword(formData.user_cred, token, inis["PWDENCRYPT"])
                .then(password => {
                    const payload = {
                        ...formData,
                        register: true,
                        site_id: site_id,
                        cabinet_name: cabinet_name,
                        volume_name: volume_name,
                        site_name: site_name,
                        user_cred: password
                    }
                    ActCab(JSON.stringify(payload))
                        .then(res => {
                            console.log(res, formData);
                            if (res != null && res.status.maincode === "0") {
                                const description = res.status.description !== '' ? res.status.description : 'Success';
                                snackbarStore.openSnackbar(description, "success", 2000)
                                handleRefresh(!isRefreshRequired);
                                normalDialogStore.closeDialog();
                            } else if (res != null) {
                                const description = res.status && res.status.description ? res.status.description : "Something went wrong.Please contact admin";
                                snackbarStore.openSnackbar(description, "error", 2000)
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            snackbarStore.openSnackbar('Something went wrong.Please contact admin.', "error", 2000)
                        })
                })
        }
        else {
            alert("Some fields are empty");
        }

    }
    return <div className={classes.registerTabContainer}>
        <Grid container direction="column" spacing={1}>
            <Grid item>
                <InputBox
                    onChangeHandler={handleChange}
                    className={classes.inputBox}
                    value={formData.app_server_ip}
                    label={"AppServer IP"}
                    form={false}
                    type="text"
                    required={true}
                    disabled={isConnected}
                    labelMinWidth="120px"
                    labelMaxWidth="120px"
                    name="app_server_ip"
                />
            </Grid>
            <Grid item>
                <InputBox
                    onChangeHandler={handleChange}
                    className={classes.inputBox}
                    value={formData.app_server_port}
                    label={"AppServer Port"}
                    form={false}
                    type="text"
                    labelMinWidth="120px"
                    labelMaxWidth="120px"
                    required={true}
                    disabled={isConnected}
                    name="app_server_port"
                />
            </Grid>
            <Grid item container spacing={2}>
                <Grid item>
                    <SelectBox
                        onChangeHandler={handleChange}
                        className={classes.selectBox}
                        value={formData.app_server_type}
                        list={appServerTypes}
                        label={"AppServer Type"}
                        labelMinWidth="120px"
                        labelMaxWidth="120px"
                        name="app_server_type"
                        required={true}
                        disabled={isConnected}
                        form={false}
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        size="small"
                        className={classes.button}
                        labelMinWidth="120px"
                        labelMaxWidth="120px"
                        type="submit"
                        disabled={loading.loading || isConnected}
                        onClick={connectCabinet}>
                        Connect
                </Button>
                </Grid>
            </Grid>
        </Grid>
        {loading.loading && <div style={{ marginTop: "0.75rem" }}> <Spinner msg={loading.msg} /> </div>}
        {isConnected && <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />}
        {isConnected && <Grid item container direction="column" spacing={1}>
            <Grid item>
                <input type="hidden" value="none" />
                <SelectBox
                    onChangeHandler={(event) => setCabinet_name(event.target.value)}
                    className={classes.connectSelectBox}
                    value={cabinet_name}
                    list={cabinets}
                    labelMinWidth="120px"
                    labelMaxWidth="120px"
                    label={"Cabinet"}
                    name="cabinet_name"
                    form={false}
                />
            </Grid>
            <Grid item>
                <InputBox
                    onChangeHandler={handleChange}
                    className={classes.inputBox}
                    value={formData.cabinet_alias}
                    label={"Cabinet Alias"}
                    form={false}
                    labelMinWidth="120px"
                    injectLiveValue={true}
                    labelMaxWidth="120px"
                    type="text"
                    required={true}
                    name="cabinet_alias"
                />
            </Grid>
            <Grid item>
                <SelectBox
                    onChangeHandler={(event) => setSite_id(event.target.value)}
                    className={classes.connectSelectBox}
                    value={site_id}
                    list={sites}
                    label={"Site"}
                    placeholderRequired={false}
                    name="site_id"
                    labelMinWidth="120px"
                    labelMaxWidth="120px"
                    form={false}
                />
            </Grid>
            <Grid item>
                <SelectBox
                    onChangeHandler={
                        event => {
                            handleChange(event);
                            const index = event.nativeEvent.target.selectedIndex;
                            const volume_name = event.nativeEvent.target[index].text;
                            setVolume_name(volume_name)
                        }
                    }
                    className={classes.connectSelectBox}
                    value={formData.volume_id}
                    list={volumes}
                    label={"Volume"}
                    placeholderRequired={false}
                    name="volume_id"
                    labelMinWidth="120px"
                    labelMaxWidth="120px"
                    form={false}
                />
            </Grid>
            <Grid item>
                <InputBox
                    onChangeHandler={handleChange}
                    className={classes.inputBox}
                    value={formData.user_name}
                    label={"Username"}
                    form={false}
                    type="text"
                    labelMinWidth="120px"
                    labelMaxWidth="120px"
                    required={true}
                    name="user_name"
                />
            </Grid>
            <Grid item>
                <InputBox
                    onChangeHandler={handleChange}
                    className={classes.inputBox}
                    value={formData.user_cred}
                    label={"Password"}
                    form={false}
                    autoComplete="new-password"
                    type="password"
                    labelMinWidth="120px"
                    labelMaxWidth="120px"
                    required={true}
                    name="user_cred"
                />
            </Grid>
            <Grid item>
                <InputLabel
                    shrink
                    htmlFor={"multitenancy"}
                    classes={{ root: classes.input_label_root }}>
                    <Typography noWrap={true} variant="div" className={classes.input_label}>Multitenancy</Typography>
                </InputLabel>
                <Checkbox name="multitenancy" checked={formData.multitenancy} onChange={() => setFormData({ ...formData, multitenancy: !formData.multitenancy })} style={{ marginLeft: "2.25rem" }} />
            </Grid>
            <Grid item container direction="column" alignItems="flex-end">
                <Grid item>
                    <Button
                        variant="contained"
                        size="small"
                        className={classes.button}
                        type="submit"
                        onClick={registerCabinet}>
                        Register
                    </Button>
                </Grid>
            </Grid>
        </Grid>}
    </div>
}

const UnRegisterForm = (props) => {

    const classes = useStyle();

    const { onClickUnregisterButton } = props;
    const [formData, setFormData] = useState({
        user_name: '',
        user_cred: '',
    })

    const handleChange = event => {
        const name = event.target.name
        setFormData({
            ...formData,
            [name]: event.target.value
        })
    }

    return (
        <div className={classes.unregisterFormContainer}>
            <input type="hidden" value="none" />
            <Grid container direction="column" spacing={1} alignItems="center" justify="center">
                <Grid item>
                    <InputBox
                        onChangeHandler={handleChange}
                        className={classes.inputBox}
                        value={formData.user_name}
                        label={"Username"}
                        form={false}
                        type="text"
                        required={true}
                        name="user_name"
                    />
                </Grid>
                <Grid item>
                    <InputBox
                        onChangeHandler={handleChange}
                        className={classes.inputBox}
                        value={formData.user_cred}
                        label={"Password"}
                        form={false}
                        type="password"
                        required={true}
                        name="user_cred"
                        autoComplete="new-password"
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => onClickUnregisterButton(formData)}
                        className={classes.button}
                        style={{ marginLeft: "16.5rem" }}
                        type="submit">
                        Unregister
                    </Button>
                </Grid>
            </Grid>
        </div>
    )

}


const UnregisterCabinet = (props) => {

    const [isVisible, setIsVisible] = useState(false);
    const [selectedCabinet, setSelectedCabinet] = useState('');
    const [headCells, setHeadCells] = useState(registeredCabinetsData.data.tableHeader);
    const [cabinets, setCabinets] = useState([]);
    const { handleRefresh, isRefreshRequired, token, inis } = props;
    const normalDialogStore = useSelector(state => state.normalDialogState);

    useEffect(() => {
        const inputData = { opr: "2" }
        GetCabList(JSON.stringify(inputData))
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    const data = res.data;
                    setCabinets(data.cabinets)
                }
            })
            .catch(err => console.log(err))
    }, [])

    const handleCheckBox = (selectedCabinet) => {

        setSelectedCabinet(selectedCabinet[0]);
        if (selectedCabinet && selectedCabinet.length >= 1) {
            setIsVisible(true);
        } else {
            setIsVisible(false)
        }
    }
    const snackbarStore = useSelector(state => {
        return state.snackbarState;
    });
    const handleUnregister = (formData) => {
        if (formData && formData.user_name !== '' && formData.user_cred !== '') {
            encryptPassword(formData.user_cred, token, inis["PWDENCRYPT"])
                .then(password => {
                    const payload = {
                        ...formData,
                        cabinet_name: selectedCabinet.name,
                        cabinet_alias: selectedCabinet.alias,
                        volume_name: selectedCabinet.volume,
                        site_name: selectedCabinet.site,
                        register: false,
                        user_cred: password
                    }
                    ActCab(JSON.stringify(payload))
                        .then(res => {
                            console.log(res);
                            if (res != null && res.status.maincode === "0") {
                                const description = res.status.description ? res.status.description : "Success";
                                snackbarStore.openSnackbar(description, "success", 2000)
                                handleRefresh(!isRefreshRequired)
                                normalDialogStore.closeDialog();
                            } else if (res != null && res.status.maincode === "1") {
                                const description = res.status.description ? res.status.description : "Error";
                                snackbarStore.openSnackbar(description, "error", 2000)
                            }
                        })
                        .catch(err => {
                            snackbarStore.openSnackbar('Something went wrong. Please contact Admin', "error", 2000)
                            console.log(err)
                        })
                })
        }
        else {
            alert("Some fields are empty");
        }

    }
    return (
        <div>
            <div style={{ marginBottom: "1rem" }}>
                <TableComponent dynamicHeight="180px" loading={false} tableData={cabinets} headerData={headCells} selectType="Radio" onChangeCheckbox={handleCheckBox} />
            </div>
            {isVisible && <UnRegisterForm onClickUnregisterButton={handleUnregister} />}
        </div>
    )
}
/**
 * Manage Cabinet Component having two tabs
 * 
 * Register Cabinet
 * UnRegister Cabinet
 * 
 * @param {*} props 
 */


const ManageCabinet = (props) => {

    const classes = useStyle();
    const { handleRefresh, isRefreshRequired, token, inis } = props;
    const normalDialogStore = useSelector(state => state.normalDialogState);
    const tabs = [
        {
            label: "Register",
            component: RegisterCabinet,
            index: 0,
            componentProps: {
                handleRefresh: handleRefresh,
                isRefreshRequired: isRefreshRequired,
                token: token,
                inis: inis
            }
        },
        {
            label: "Unregister",
            component: UnregisterCabinet,
            index: 1,
            componentProps: {
                handleRefresh: handleRefresh,
                isRefreshRequired: isRefreshRequired,
                token: token,
                inis: inis
            }
        },
    ]

    return (<div style={{ minWidth: "30rem" }}>
        <MuiDialogTitle className={classes.root}>
            <Grid item container direction="row" justify="space-between" alignItems="flex-start">
                <Grid item>
                    <Typography variant="h6" className={classes.title}>Manage Cabinet</Typography>
                </Grid>
                <Grid item style={{ paddingRight: 10, paddingTop: 10 }}>
                    <IconsButton type="CloseIcon" color="primary" disableRipple={true} onClick={() => normalDialogStore.closeDialog()} />
                </Grid>
            </Grid>
        </MuiDialogTitle>
        <DialogContent >
            <StyledTabs tabsArray={tabs} tabHeight={'32px'} container={true} tabContainerClasses={classes.tabContainer} />
        </DialogContent>
    </div>)
}



export default ManageCabinet;