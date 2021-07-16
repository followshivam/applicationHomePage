import { Grid, makeStyles, SearchBox, StyledTab, Typography, useTranslation } from 'component';
import React from 'react';
import { lazy } from 'react';
import { useSelector } from 'react-redux';
const Applications = lazy(() => import('container/omniapp/applications/applications'))
const ExternalApplications = lazy(() => import('container/omniapp/external_applications/external_applications'))

const tabHeight = "34px"
const useStyles = makeStyles(theme => ({
    tabClasses: {
        fontSize: "0.8rem",
        fontWeight: 800,
        minWidth: '10px',
        textTransform: 'none',
        paddingLeft: 0,
        paddingRight: 0,
        margin: '0px 15px'
        // marginLeft: props => props.direction === 'ltr' ? 15 : '',
        // marginRight: props => props.direction === 'rtl' ? 15 : '',
    },
    tabsClasses: {
        minHeight: tabHeight,
        height: tabHeight
    },
}))

const ApplicationsAndComponents = props => {

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });


    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const direction = t('omniapp:HTML_DIR')
    const classes = useStyles({direction});
    const tabsArray = [
        { id: 0, index: 0, label: `${t('omniapp:APPLICATIONS')}`, component: <Applications />, icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/tab_sel_icon.svg` , inactive_icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/tab_icon.svg` },
        { id: 1, index: 1, label: `${t('omniapp:EXTERNAL_COMPONENTS')}`, component: <ExternalApplications />, icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/tab_sel_icon.svg` , inactive_icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/tab_icon.svg` },
    ]

    return (<div id="applicationandcomponents" style={{overflow:'hidden'}}><Grid direction="column" container wrap="nowrap" >
        <Grid direction="row" container item justify="flex-start" alignItem="flex-start" wrap="nowrap"
            style={{ [direction === 'ltr' ? "marginLeft" : "marginRight"]: "20px" }}>
            <Grid item>
                <Typography variant="h6" style={{ fontWeight: 600, fontSize: "16px" }}>{`${t('omniapp:APPLICATION_AND_COMPONENTS')}`}</Typography>
            </Grid>
            <Grid item style={{ [direction === 'rtl' ? "marginRight" : "marginLeft"]: "16px" }}>
                <SearchBox direction={direction} height="14px !important" background="#FFFFFF !important" color="#606060"/>
            </Grid>
        </Grid>
        <Grid item style={{ marginTop: 10 }}>
            <StyledTab tabsArray={tabsArray} tabHeight={tabHeight} tabsClasses={classes.tabsClasses} tabClasses={classes.tabClasses} direction={direction} />
        </Grid>
    </Grid></div>)
}

export default ApplicationsAndComponents;