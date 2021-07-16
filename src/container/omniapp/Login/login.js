import React, { useEffect, useState, lazy, Suspense, useLayoutEffect } from 'react';
import {
    Grid, makeStyles, Button, CardContent, SimpleCard, IconsButton,
    useTheme, useMediaQuery, InputBox, CardHeader, SelectBox, FormControl, FormGroup,
    Checkbox, FormControlLabel, useTranslation, AlertBox, Alert, Typography, Spinner, InputAdornment, IconImage, IconButton, DialogTitle, DialogContent, DialogActions
} from 'component'
import { URL } from 'global/url'
import { encryptPassword } from './password_encrypt';
import { withRouter, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GetCaptcha, LoginConfHandler, LoginHandler } from 'global/omniapp/api/ApiMethods';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { LoginDetails } from 'redux/action';
const ManageCabinetDialog = lazy(() => import('container/omniapp/Cabinet/manage_cabinet'))

const useStyle = makeStyles(theme => ({
    gridBackground: {
        backgroundColor: "#ebebeb",
        // height: "100%",
        padding: 0
    },
    loginContainer: {
        height: "100%"
    },
    ibps: {
        width: 80,
        height: 35,
        marginTop: "1.5rem",
    },
    selectBox: {
        marginTop: "1rem",
        width: "100%",
    },
    selectLocaleBox: {
        "& .MuiInputBase-input": {
            width: "8rem"
        }
    },
    localeContainer: {
        paddingRight: "0.5rem",
        paddingTop: "0.5rem"
    },
    formControl: {
        marginTop: "0.75rem",
        minWidth: "90%",
        maxWidth: "90%",
        fontSize: "1rem"
    },
    loginButton: {
        color: "white",
        marginTop: "0.75rem",
        width: "90%",
        height: "33px",
        borderRadius: "3px",
        backgroundColor: theme.palette.secondary.main,
        "&:hover": {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: 'none'
        },
    },
    forcedLoginButton: {
        color: "white",
        marginTop: "0.75rem",
        width: "90%",
        height: "33px",
        borderRadius: "3px",
        backgroundColor: theme.palette.secondary.main,
        "&:hover": {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: 'none'
        },
    },
    captchBackground: {
        background: 'url(/icons/captchabg.jpg)',
        textAlign: 'center',
        border: '1px #A9A9A9 solid',
        borderRadius: '3px',
        width: '160px',
        height: '28px'
    },
    cardContent: {
        height: props => Math.max(props.height ? 0.45 * props.height : 260, 260)
    },
    card: {
        height: props => Math.max(props.height ? (props.height - 40) : 570, 570)
    },
    leftContainer: {
        paddingBottom: "1.5rem",
        width: "100%",
        backgroundColor: "#ebebeb"
    },
    imageContainer: {
        width: "100%",
        height: "80%",
        paddingLeft: "12%",
        paddingRight: "15%",
        paddingTop: "3%"
    },
    cardContainer: {
        backgroundColor: "#ebebeb",
        height: "100%",
        padding: "20px 1.5rem",
    },
    passwordEndAdornment: {
        marginLeft: "-1.5rem"
    },
    cabinetEndAdornment: {
        marginLeft: "0rem"
    },
    startAdornment: {
        marginRight: 0
    },
    iconImage: {
        width: 25.063,
        height: 25.063,
        border: "1px #dadada solid"
    },
    iconImage2: {
        width: 26.25,
        height: 26.25,
        border: "1px #dadada solid"
    },
    selectIcon: {
        marginRight: "2rem"
    },
    title: {
        borderBottom: "3px solid #97D3FF",
        color: "#606060",
        paddingBottom: "6px"
    },
    errorContainer: {
        width: "90%",
        margin: "auto",
        marginTop: "0.5rem"
    },
    errorOuterDiv: {
        border: "1px solid #e9a9a9",
        borderRadius: "3px",
        backgroundColor: "#f7f7f7"
    },
    errorDiv: {
        padding: "4px",
        fontSize: "13px",
        fontFamily: "Open Sans",
        color: "#c40505",
        textAlign: "center",
    },
    footerText: {
        font: "12px Open Sans",
        textAlign: "center",
        color: "#606060"
    },
    footerContainer: {
        width: "110%",
        paddingLeft: "8%",
        paddingRight: "12%",
        // height: "10%"
    },
    buttonLabel: {
        fontSize: "0.75rem",
        fontFamily: "Open Sans",
        fontWeight: 400,
        lineHeight: 1.5,
    }

}))

const Login = (props) => {


    const theme = useTheme();
    // const matches = useMediaQuery('(min-width:700px)')
    const mediaQuery = useMediaQuery(theme.breakpoints.up("sm"));

    const dispatch = useDispatch();
    const snackbarState = useSelector(state => state.snackbarState)
    const [cabList, setCabList] = useState([]);
    const [localeList, setLocaleList] = useState([])
    const [inis, setInis] = useState({});
    const [error, setError] = useState();
    const [forcedLogin, setForcedLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [tk, setTK] = useState();
    const [src, setSrc] = useState();
    const [captchaValue, setCaptchaValue] = useState();
    const [height, setHeight] = useState(window.innerHeight);
    const classes = useStyle({ height })
    const location = useLocation();
    const config = location.pathname === '/config';
    const history = useHistory();
    const [cabinetParam, setCabinetParam] = useState();
    const [isCabinetsVisible, setIsCabinetVisible] = useState(true);
    const [isRefreshRequired, setIsRefreshRequired] = useState(false);
    const [loading, setLoading] = useState({
        loading: false,
        msg: ""
    })

    const [formData, setFormData] = useState({
        user_name: '',
        user_cred: '',
        cab_name: '',
        locale: localStorage.getItem('locale') ? localStorage.getItem('locale') : 'en_US',
        forced_login: "N",
        remember_me: false,
        dom_host: window.location.hostname,
        dom_port: window.location.port,
        dom_protocol: window.location.protocol.substring(0, window.location.protocol.length - 1)
    })

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t, i18n } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])

    const [loginPageLoading, setLoginPageLoading] = useState({
        loading: true,
        msg: `${t('bam:LOADING')}...`
    })

    const handleLocaleChange = (event) => {
        const locale = event.target.value;
        setFormData(prevData => ({
            ...prevData,
            locale: locale
        }))
        localStorage.setItem('locale', locale);
        // window.location.reload();
    }

    const currentLang = localStorage.getItem('locale') && localStorage.getItem('locale')
    useEffect(() => {
        i18n.changeLanguage(currentLang)
    }, [currentLang])


    const renderCaptchaImage = () => {
        // GetCaptcha()
        //     .then(res => {
        //         console.log(res.data);

        //         const data = btoa(unescape(encodeURIComponent(res.data)));
        //         setSrc(`data:image/png;base64,${data}`)
        //     })
        // console.log('renderCaptcha', src)
        setCaptchaValue("");
        setSrc(`${URL.GETCAPTCHA}?id=${Math.random()}`)
    }

    const normalDialogStore = useSelector(state => state.normalDialogState);
    const openDialogBoxFromStore = () => {
        normalDialogStore.openDialog(
            <Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}>
                <ManageCabinetDialog handleRefresh={setIsRefreshRequired} isRefreshRequired={isRefreshRequired} token={tk} inis={inis} />
            </Suspense>,
            "Manage Cabinet"
        )
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.has('cabinetName') && inis["DisableCabinetInfo"] === "Y") {
            setCabinetParam(params.get('cabinetName'));
            setIsCabinetVisible(false);
        }
    }, [location, inis])

    useEffect(() => {
        function handleResize() {
            setHeight(window.innerHeight);
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [window.innerHeight])

    useEffect(() => {
        setLoginPageLoading({
            ...loginPageLoading,
            loading: false
        })
        renderCaptchaImage();
        LoginConfHandler().then((res) => {
            if (res != null && res.status.maincode === "0") {
                const data = res.data;

                const inis = res.inis;
                setInis(inis)
                const cabinetList = data.cabinets;
                const modifiedCabinetList = cabinetList.map(cabinet => {
                    return { value: cabinet.alias, label: cabinet.name }
                })
                setCabList(modifiedCabinetList);
                setFormData({ ...formData, cab_name: modifiedCabinetList[0].value })
                if (inis && inis["ShowLangSelection"] === "Y") {
                    const localeList = data.locales;
                    const modifiedLocaleList = localeList.map(locale => {
                        return { value: locale.name, label: locale.display_string }
                    })
                    setLocaleList(modifiedLocaleList);
                }
                const custom_cookie_info = data.custom_cookie_info;
                if (custom_cookie_info) {
                    setFormData(prevData => ({
                        ...prevData,
                        remember_me: custom_cookie_info.rem_uid_cab,
                        user_name: custom_cookie_info.rem_uid_name,
                        cab_name: custom_cookie_info.rem_cab_name == null ? prevData.cab_name : custom_cookie_info.rem_cab_name
                    }))
                }
                setTK(res.tk)
            }

        }).catch((err) => {
            console.log('Errror in Back End', err);
            setError("Some error encountered. Please contact admin.")
        })
    }, [isRefreshRequired]);


    const handleChange = event => {
        const name = event.target.name;
        setError('');
        setFormData({
            ...formData,
            [name]: event.target.value,
        })
    }
    const handleLogin = (event) => {
        event.preventDefault();
        setLoading({
            ...loading,
            loading: true
        })
        encryptPassword(formData.user_cred, tk, inis["PWDENCRYPT"])
            .then(password => {
                const payload = {
                    ...formData,
                    forced_login: forcedLogin ? "Y" : "N",
                    cab_name: !isCabinetsVisible ? cabinetParam : formData.cab_name,
                    captcha_text: captchaValue,
                    user_cred: password
                }
                LoginHandler(JSON.stringify(payload)).then((res) => {
                    if (res != null && !res.data) {
                        if (res.status.maincode === "1" && res.status.suberrorcode === "-50167") {
                            setForcedLogin(true)
                            setError('The specified user is already logged in on some other machine. Do you still want to continue?')
                        } else if (res.status.suberrorcode === "-50222") {
                            const description = res.status.description ? res.status.description : "First Time login, Redirecting to Set Password";
                            setError(description);
                            history.replace('/login_ftl', {
                                user_name: formData.user_name
                            })
                            return;
                        } else {
                            const description = res.status.description ? res.status.description : res.status.errormsg;
                            setError(description)
                        }
                        renderCaptchaImage();
                    } else if
                        (res != null && res.status.maincode === "0") {
                        localStorage.setItem('session_id', res.data.session_id);
                        localStorage.setItem('oap_id', res.data.OAP_Id)
                        localStorage.setItem('user_name', res.data.user_name);
                        localStorage.setItem('user_id', res.data.user_index);
                        localStorage.setItem('expiresIn', new Date());
                        dispatch(LoginDetails(res.data))
                        props.history.push("/")
                        setForcedLogin(false);
                    }
                    setLoading({
                        ...loading,
                        loading: false
                    });


                }).catch((err) => {
                    console.log('err : ', err);

                    setLoading({
                        ...loading,
                        loading: false
                    })
                    setError('Some error encounter. Please contact admin')
                    renderCaptchaImage();
                })
            })


    }
    const cancelForcedLogin = event => {
        setForcedLogin(false);
        setError('')
    }

    const handleForgotPassword = () => {
        normalDialogStore.openDialog(
            <Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}>
                <ForgotPassword />
            </Suspense>,
            "Forgot Password"
        )
    }

    let components = <div style={{ height: "100vh", margin: "0 auto" }}><Spinner msg={loginPageLoading.msg} /></div>

    if (!loginPageLoading.loading) {
        components = (<div className={classes.gridBackground} style={{ minHeight: height }}>
            <input type="hidden" value="none" />
            <Grid container direction="row" className={classes.loginContainer}>
                {mediaQuery && <Grid item className={classes.leftContainer}
                    direction="column" justify="space-between" alignItems="flex-start" container md={7} sm={7} xs lg={8}>
                    <Grid item className={classes.imageContainer}>
                        <img src="icons/background.png" />
                    </Grid>
                    <Grid item className={classes.footerContainer} >
                        <Typography className={classes.footerText}> {t('omniapp:PRODUCT_BEST_VIEWED_ON')}</Typography>
                        <Typography className={classes.footerText}>
                            {t('omniapp:NEWGEN_COPYRIGHT_TEXT')}
                        </Typography>
                    </Grid>
                </Grid>
                }
                <Grid container item direction="column" justify="space-between"
                    md={5} lg={4} xs={12} sm={5} className={classes.cardContainer} >
                    <SimpleCard classes={{ root: classes.card }} >

                        {inis && inis["ShowLangSelection"] === "Y" &&
                            <Grid container item justify="flex-end" >
                                <Grid item className={classes.localeContainer}>
                                    {localeList &&
                                        <SelectBox list={localeList} inputFontSize={12}
                                            value={formData.locale} onChangeHandler={handleLocaleChange} className={classes.selectLocaleBox} />}
                                </Grid>
                            </Grid>}
                        <div style={{ paddingTop: "2.5%", paddingBottom: "3%" }}>
                            <Grid item container justify="center" alignItems="center">
                                <Grid item>
                                    <img
                                        className={classes.ibps}
                                        src="icons/ibps.png"
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container justify="center" alignItems="center"
                                style={{ marginTop: (error || loading.loading) ? "2rem" : "3rem" }}>
                                <Grid item>
                                    <Typography variant="h5" className={classes.title}>{t('omniapp:LOGIN')}</Typography>
                                </Grid>
                            </Grid>
                            <Grid item container justify="center" alignItems="center" style={{ maxHeight: "70%", minHeight: "50%" }}>
                                <form onSubmit={handleLogin}>
                                    <CardContent classes={{ root: classes.cardContent }}
                                        style={{ textAlign: "center", marginLeft: "2rem", marginRight: "2rem" }}>
                                        <Grid item>
                                            <FormControl classes={{ root: classes.formControl }}>
                                                <InputBox onChangeHandler={handleChange}
                                                    placeholder={t('omniapp:USERNAME')}
                                                    inputProps={{ tabIndex: "1" }}
                                                    startAdornment={
                                                        <InputAdornment position="start" classes={{ positionStart: classes.startAdornment }}>
                                                            <IconButton>
                                                                <img src={"icons/user_image.png"} className={classes.iconImage} tabIndex="-1" />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    value={formData.user_name} fullWidth type="text" required={true} name="user_name" />
                                            </FormControl>
                                            <FormControl classes={{ root: classes.formControl }}>
                                                <InputBox
                                                    onChangeHandler={handleChange}
                                                    value={formData.user_cred}
                                                    placeholder={t('omniapp:PASSWORD')}
                                                    autoComplete="new-password"
                                                    inputProps={{ tabIndex: "2" }}
                                                    endAdornment={
                                                        <InputAdornment position="end" classes={{ positionEnd: classes.passwordEndAdornment }}>
                                                            <IconButton
                                                                style={{ marginRight: "0.5rem" }}
                                                                aria-label="toggle password visibility"
                                                                onClick={() => setShowPassword(showPassword => !showPassword)}
                                                                onMouseDown={(event) => event.preventDefault()}
                                                            // edge="end"
                                                            >
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    startAdornment={
                                                        <InputAdornment position="start" classes={{ positionStart: classes.startAdornment }}>
                                                            <IconButton>
                                                                <img src={"icons/pass_image.png"} className={classes.iconImage} tabIndex="-1" />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    fullWidth type={showPassword ? "text" : "password"} required={true} name="user_cred" />
                                            </FormControl>
                                            {isCabinetsVisible && <FormControl classes={{ root: classes.formControl }} style={{ marginTop: "0rem" }}>
                                                {cabList && <SelectBox
                                                    inputProps={{ tabIndex: "2" }}
                                                    injectLiveValue={true} list={cabList} value={formData.cab_name}
                                                    iconClass={config ? classes.selectIcon : undefined}
                                                    startAdornment={
                                                        <InputAdornment position="start" classes={{ positionStart: classes.startAdornment }}>
                                                            <IconButton style={{ cursor: "initial" }}>
                                                                <img src={"icons/cabinet_image.png"} className={classes.iconImage2} tabIndex="-1" />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    endAdornment={
                                                        (config &&
                                                            <InputAdornment position="end" classes={{ positionEnd: classes.cabinetEndAdornment }}>
                                                                <IconButton onClick={openDialogBoxFromStore}>
                                                                    <img src={"icons/settings.png"} tabIndex="-1" style={{ backgroundColor: "#f7f7f7", borderLeft: "1px #ececec solid" }} className={classes.iconImage2} />
                                                                </IconButton>
                                                            </InputAdornment>)
                                                    }
                                                    onChangeHandler={handleChange} name="cab_name"
                                                    inputFontSize={12} required={true} className={classes.selectBox} />}
                                            </FormControl>}

                                            {inis && inis["CaptchaAuthentication"] === "Y" && !forcedLogin && <Grid container direction="row" style={{ width: "90%", margin: "auto", marginTop: "0.5rem" }}>
                                                <Grid item className={classes.captchBackground} xs={5}>
                                                    <img src={src} width="70%" height="90%" />
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <IconsButton type="RefreshOutlinedIcon" onClick={renderCaptchaImage} />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <InputBox onChangeHandler={event => { setError(''); setCaptchaValue(event.target.value) }}
                                                        placeholder="Enter Captcha"
                                                        value={captchaValue}
                                                        fullWidth type="text"
                                                        required={true} name="captcha" />
                                                </Grid>
                                            </Grid>}
                                            {error && <Grid item container>
                                                <Grid item className={classes.errorContainer}>
                                                    <Error>{error}</Error>
                                                </Grid>
                                            </Grid>}
                                            {!forcedLogin && <Button variant="contained" disabled={loading.loading} size="large" className={classes.loginButton} tabIndex="4" type="submit">{t('omniapp:LOGIN')}</Button>}
                                            {!forcedLogin && <Grid item container direction="row" justify="space-between"
                                                style={{ width: "90%", margin: "auto", marginTop: "0.5rem" }}>
                                                {inis && inis["RemeberUidCab"] === "Y" && <Grid item>
                                                    <FormControlLabel label={t('omniapp:REMEMBER_USERID_CAB')} value={formData.remember_me} control={<Checkbox name="rememberMe" checked={formData.remember_me} onClick={() => setFormData({ ...formData, remember_me: !formData.remember_me })} />} />
                                                </Grid>}
                                                {inis && inis["ForgetPasswordLink"] === "Y" && <Grid item>
                                                    <Button onClick={handleForgotPassword} style={{ marginTop: "0.35rem", paddingTop: "3px", paddingBottom: "3px", paddingRight: "1px" }} classes={{ label: classes.buttonLabel }}>Forgot Password?</Button>
                                                </Grid>}
                                            </Grid>}
                                        </Grid>
                                        {forcedLogin && <Grid item container direction="column" justify="space-between">
                                            <Grid item>
                                                <Button variant="contained" size="large" className={classes.forcedLoginButton} type="submit">{`${t('omniapp:YES')}, ${t('omniapp:LOGIN')}`}</Button>
                                            </Grid>
                                            <Grid item>
                                                <Button color="primary" size="large" onClick={cancelForcedLogin}>{t('omniapp:NO')}</Button>
                                            </Grid>
                                        </Grid>}
                                        {(inis && inis["ShowBanner"] === "Y") && <div style={{ width: "90%", margin: "auto", marginTop: "0.5rem", }}>
                                            <marquee style={{ font: "10pt Open Sans" }}>Newgen Software Technologies Limited</marquee>
                                        </div>}
                                        {loading.loading && <div> <Spinner msg={loading.msg} /></div>}
                                    </CardContent>
                                </form>
                            </Grid>
                            <Grid item container justify="center" alignItems="center"
                            >
                                <Grid item>
                                    <img src="icons/newgen_logo_new.png" />
                                </Grid>
                            </Grid>
                        </div>
                    </SimpleCard>
                </Grid>
            </Grid>
            {snackbarState.open && <AlertBox t={t} />}
        </div>)
    }

    return components;
}
// 
const Error = (props) => {

    const classes = useStyle();

    return (<div className={classes.errorOuterDiv}>
        <div className={classes.errorDiv}>
            {props.children}
        </div>
    </div>)
}

const ForgotPassword = () => {

    const normalDialogStore = useSelector(state => state.normalDialogState);

    return (<div style={{ minWidth: "25rem" }}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent style={{ textAlign: "center", margin: "5rem" }}>
            Coming Soon...
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={() => normalDialogStore.closeDialog()} color="primary" style={{ width: "62px", height: "24px" }}>
                Close
            </Button>
        </DialogActions>
    </div >)
}
export default withRouter(Login);