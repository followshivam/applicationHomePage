import React, { useState } from 'react';
import { StyledTab as StyledTabs,useTranslation, makeStyles } from 'component';
import Workspaces from '../Workspaces/workspaces';
import Views from '../Views/views';
import Tabs from '../Tabs/tabs'
import { Breadcrumbs, Typography, Button, useTheme } from '@material-ui/core';
import NavigateNextIcons from '@material-ui/icons/NavigateNext'
import { useSelector } from "react-redux";


// used empty tab container to override existing.
const useStyle = makeStyles(theme => (
    {
        tabContainer: {
            // marginTop: "1rem",
            // padding: theme.spacing(1, 1, 0, 1)
        },
        tabs: {
            minHeight: props => props.tabHeight,
            height: props => props.tabHeight,
            backgroundColor: '#EFEFEF'
        },
        tab: {
            fontSize: '14px',
            minWidth: '10px',
            fontWeight: '200',
            textTransform: 'none',
            color: theme.palette.common.black,
        },
        tabSelected: {
            color: theme.palette.primary.main,
            borderBottom: `1px solid ${theme.palette.primary.main}`
        },
        separator: {
            marginLeft: 0,
            marginRight: 0
        },


    }
))

const CustomBreadcrumbs = (props) => {

    const { breadcrumbs } = props
    const classes = useStyle();
    const theme = useTheme()
    const length = breadcrumbs.length;
    return (
        <Breadcrumbs separator={<NavigateNextIcons fontSize="small" />} classes={{ separator: classes.separator }} >
            {
                breadcrumbs.map((breadcrumb, index) => {
                    if (index === length - 1) {
                        return <Typography variant="h6" color={theme.palette.common.black}>
                            {breadcrumb.name}{breadcrumb.data}
                        </Typography>
                    }
                    return <Button onClick={() => breadcrumb.handleClick(breadcrumb.name)}>
                        <Typography variant="h6" color="primary">{breadcrumb.name}{breadcrumb.data}</Typography>
                    </Button>
                })
            }
        </Breadcrumbs>
    )
}



const Navigation = (props) => {

    const tabHeight = " 30px"
    const classes = useStyle({ tabHeight })
    const [showBreadcrumbs, setShowBreadcrumbs] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const [workspace, setWorkspace] = useState();
    const [view, setView] = useState();
    const [index, setIndex] = useState(-1);
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const showStyledTabs = () => {
        setIndex(-1);
        setShowBreadcrumbs(false);
        setBreadcrumbs([]);
    }

    const showViewList = (workspaceParam) => {
        setIndex(1)
        setShowBreadcrumbs(true)
        setWorkspace(workspaceParam);
        const breadcrumbs = [
            {
                name: "",
                data:`${t('omniapp:WORKSPACES_LIST')}`,
                handleClick: showStyledTabs,
            },
            {
                name: workspaceParam.workspaceName,
                data:`${t('omniapp:LIST_OF_VIEWS')}`,
            }
        ]
        setBreadcrumbs(breadcrumbs);
    }

    const showTabList = (viewParam) => {
        setIndex(2)
        setShowBreadcrumbs(true)
        setView(viewParam)
        const breadcrumbs = [
            {
                name: "",
                data: `${t('omniapp:WORKSPACES_LIST')}`,
                handleClick: showStyledTabs,
            },
            {
                name: workspace.workspaceName,
                data:  `${t('omniapp:LIST_OF_VIEWS')}`,
                handleClick: () => showViewList(workspace),
            },
            {
                name: viewParam.viewName,
                data:  `${t('omniapp:LIST_OF_TABS')}`,
            }
        ]
        setBreadcrumbs(breadcrumbs);
    }

    const tabs = [
        {
            index: 0,
            component: Workspaces,
            label: `${t('omniapp:WORKSPACES')}` ,
            componentProps: {
                showViewList: showViewList,
                setWorkspace: setWorkspace
            }
        },
        {
            index: 1,
            component: Views,
            label:  `${t('omniapp:VIEWS')}` ,
            componentProps: {
                showTabList: showTabList,
                setView: setView
            }
        },
        {
            index: 2,
            component: Tabs,
            label:  `${t('omniapp:TABS')}` ,
        }
    ]

    return (
        <div>
            {showBreadcrumbs && <CustomBreadcrumbs breadcrumbs={breadcrumbs} />}
            {!showBreadcrumbs && <StyledTabs tabsArray={tabs} tabHeight={tabHeight} container={true}
                tabsClasses={classes.tabs}
                tabContainerClasses={classes.tabContainer}
                tabClasses={classes.tab}
                tabSelectedClasses={classes.tabSelected}
            />}
            {index === 0 && <Workspaces showViewList={showViewList} setWorkspace={setWorkspace} />}
            {index === 1 && <Views showTabList={showTabList} workspace={workspace} setView={setView}/>}
            {index === 2 && <Tabs view={view} />}
        </div>
    )
}

export default Navigation