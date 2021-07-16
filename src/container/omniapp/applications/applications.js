/* eslint-disable no-unused-vars */
import React, { useState, Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
    makeStyles, useTranslation, AddIcon, Spinner, Typography, Grid
} from "component";
import Checkbox from '@material-ui/core/Checkbox';
import { ActApp, GetApplicationList } from 'global/omniapp/api/ApiMethods'
import ListComponent from 'component/List';
import { lazy } from 'react';
const AddEditAppplicationModal = lazy(() => import('container/omniapp/applications/AddEditAppplicationModal'))
const Components = lazy(() => import('container/omniapp/Components/components'))


const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paper: {
        width: "100%",
        minHeight: '509px',
        padding: theme.spacing(2),
        textAlign: 'center',
        background: theme.palette.common.white,
        marginBottom: theme.spacing(2),
        flexGrow: 1,
        position: 'relative'
    },
    table: {
        flexGrow: '1',
        width: "100%",
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    body: {
        padding: '9.5px 12px',
        color: '#000000'
    },
    borderBtn: {
        border: '1px solid #D3D3D3',
        padding: '8px',
        borderRadius: '2px',
        marginRight: '15px',
        marginTop: '-1px'
    },
    button: {
        padding: '6px 14px',
        borderRadius: '2px',
        color: '#fff'
    },
    ul: {
        '& ul': {
            justifyContent: 'flex-end'
        }
    },
    myinput: {
        border: '1px solid grey',
        padding: '6px 10px'
    },
    container: {
        background: "#e6f2f547",
        boxShadow: "inset 0px 1px 0px 0px #e0e0e0",
        padding: 10,
        paddingRight: props => props.direction === 'ltr' ? 0 : '',
        paddingLeft: props => props.direction === 'rtl' ? 0 : '',
        minHeight: 'auto' //"calc(100vh - 100px)"
    },
    selectBox: {
        width: "100%",
        height: "24px"
    },
    filterIcon: {
        boxShadow: "1px 1px 1px 0px #e0e0e0",
        backgroundColor: "white",
        height: 24,
        width: 24
    },
    leftContainer: {
        boxShadow: "1px 0px 1px 0px #e0e0e0",
        backgroundColor: "white",
        maxHeight: "calc(100vh - 160px)",
        position: "sticky",
        top: "8px"
    },
    iconClass: {
        right: props => props.direction === 'ltr' ? 0 : 'auto',
        left: props => props.direction === 'rtl' ? 0 : 'auto',
    },
    activeClass: {
        fontWeight: 800
    }
}));

export const Applications = (props) => {
    const [selected, setSelected] = React.useState([]);
    const [apiData, setApiData] = React.useState([])
    const [groupedData, setGroupedData] = React.useState()
    const [rows, setRows] = React.useState([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [loading, setLoading] = useState(true)
    const snackbarState = useSelector(store => store.snackbarState);
    const [error, setError] = useState(false)


    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const [direction] = useState(`${t('bam:HTML_DIR')}`)
    const classes = useStyles({ direction });
    const activeClass = classes.activeClass
    const headCells = [
        { id: "app_name", numeric: false, disablePadding: false, label: `${t('omniapp:APPLICATION_NAME')}` },
        {
            id: "", numeric: false, disablePadding: false, label: `${t('omniapp:LOCATION')}`, component: (item) => {
                return <Typography>{item.app_loc === "1" ? "OmniApp Server" : "Other Server"}</Typography>
            }
        },
        { id: "app_domain", numeric: false, disablePadding: false, label: `${t('omniapp:APPLICATION_DOMAIN')}` },
        { id: "app_port", numeric: false, disablePadding: false, label: `${t('omniapp:PORT')}` },
        { id: "app_context", numeric: false, disablePadding: false, label: `${t('omniapp:APPLICATION_CONTEXT')}` },
        {
            id: "", numeric: false, disablePadding: false, label: `${t('omniapp:SSL_SECURED')}`, component: (item) => {
                return <Checkbox checked={item.ssl_secured === "Y" ? true : false} name="ssl_secured" color="primary" style={{ padding: '5px 0' }} />
            }
        },
    ];

    let temp = [];
    let context = [];
    apiData.forEach(element => {
        const contData = { label: element.app_context, value: element.app_context }
        if (!temp.includes(element.app_context)) {
            context.push(contData);
            temp.push(
                element.app_context
            )
        }
    })

    useEffect(() => { getData() }, [])

    const getData = () => {
        setLoading(true);

        GetApplicationList()
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    setApiData(res.data.apps)
                    setLoading(false)
                } else if (res === null) {
                    snackbarState.openSnackbar('Something went wrong. Please contact Admin', "error", 3000)
                    setLoading(false)
                }
            })
            .catch(err => {
                snackbarState.openSnackbar('Something went wrong. Please contact Admin.', "error", 3000)
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(() => {
        handleGroupBy('group_by_server');
    }, [apiData])

    const handleGroupBy = (k) => {
        const grpData = [[...new Set(apiData.map(value => value.app_domain))].map(domain => (
            {
                key: domain === '' ? "OmniApp Server" : domain,
                list: apiData.filter(val => val.app_domain === domain)
            }
        ))]

        switch (k) {
            case 'group_by_server': setGroupedData(...grpData)
                break;
            default:
                break;
        }
    }

    // const handleGroupBy = (key) => {
    //     switch (key) {
    //         case 'group_by_server': {
    //             setGroupedData([[...new Set(apiData.map(value => value.app_domain))].map(domain => (
    //                 {
    //                     key: domain === '' ? "OmniApp Server" : domain,
    //                     list: apiData.filter(val => val.app_domain === domain)
    //                 }
    //             ))])
    //             console.log(groupedData)
    //         }
    //             break;
    //         default:
    //             break;
    //     }
    // }


    const [fullDialogStore, normalDialogStore] = useSelector(state => {
        return [state.fullDialogState, state.normalDialogState];
    });

    const normalStoreDialog = useSelector(state => {
        return state.normalDialogState;
    });

    const handleClose = () => {
        normalStoreDialog.closeDialog()
    };

    const handleChangePage = (event, newPage) => setPage(newPage - 1)

    const onSearchChange = (value) => {
        const key = 'app_name';
        const updatedRows = apiData.filter(row => row[key].toLowerCase().includes(value.toLowerCase()));
        setRows(updatedRows)
    }


    const handleDelete = () => {
        let param = {
            opr: '3',
            app_id: selected[0].app_id
        }
        setLoading(true);
        ActApp(param)
            .then((res) => {
                if (res.status.maincode === "0") {
                    setLoading(false);
                    snackbarState.openSnackbar(`Successfully Unregister ${selected[0].app_name}`, 'success');
                    getData();
                } else if (res === null) {
                    setLoading(false);
                    snackbarState.openSnackbar(res.status.description, 'warning', 5000);
                } else {
                    const description = res.status.description;
                    snackbarState.openSnackbar(description, "error", 3000)
                    setLoading(false)
                }
            })
            .catch((err) => {
                snackbarState.openSnackbar('Something went wrong. Please contact Admin.', "error", 3000)
                console.log(err)
                setLoading(false)
            })
        setSelected([])
    }

    const scrollHandler = (id) => {
        const element = document.getElementById(`t_${id}`);
        element.scrollIntoView({ behavior: "smooth", block: "start", });

    }

    const suggestionData = [
        { id: '1', label: 'Suggestion Search 2' },
        { id: '2', label: 'Very Long Previous Search result' },
        { id: '3', label: 'Suggestion Search 4' },
        { id: '4', label: 'Suggestion Search 5' },
        { id: '4', label: 'Suggestion Search 5' },
        { id: '3', label: 'Suggestion Search 4' },
        { id: '4', label: 'Suggestion Search 5' },
        { id: '4', label: 'Suggestion Search 5' }, { id: '3', label: 'Suggestion Search 4' },
        { id: '4', label: 'Suggestion Search 5' },
        { id: '4', label: 'Suggestion Search 5' }
    ]

    const recentData = [
        { id: '1', label: 'Recents Search 2' },
        { id: '2', label: 'Very Long Previous Search result' },
        { id: '3', label: 'Recents Search 4' },
        { id: '4', label: 'Recents Search 2' },
        { id: '5', label: 'Very Long Previous Search result' },
        { id: '6', label: 'Recents Search 4' },
        { id: '7', label: 'Recents Search 5' },
        { id: '9', label: 'Very Long Previous Search result' },
        { id: '10', label: 'Recents Search 4' },
        { id: '8', label: 'Recents Search 5', searchString: "appthsg" }
    ]
    const openDialogBoxFromStore = () => {
        normalDialogStore.openDialog(
            <Suspense
                fallback={
                    <div style={{ height: '250px', minWidth: '600px' }}>
                        <Spinner msg='' />
                    </div>
                }
            >
                <AddEditAppplicationModal
                    onSuccessCallback={getData}
                    handleClose={handleClose}
                    contextData={context}
                />
            </Suspense>,
            `${t('omniapp:ADD_APPLICATION')}`
        )
    }

    return (<Grid container direction="row" wrap="nowrap" spacing={2} className={classes.container}>
        <Grid direction="column" item container xs={3} lg={3} md={3} sm={3} className={classes.leftContainer} wrap="nowrap" style={{ padding: "10px 0px" }}>
            <Grid item container direction="row" justify="space-between" alignItems="flex-start" style={{ padding: "0px 8px" }}>
                <Grid item>
                    <Typography variant="body1" style={{ fontWeight: 800 }}>{`${t('omniapp:APPLICATIONS')}`}</Typography>
                </Grid>
                <Grid item>
                    <AddIcon style={{ color: "#0072c6", height: "20", width: "20" }} onClick={openDialogBoxFromStore} />
                </Grid>
            </Grid>
            {/* <Grid item container spacing={2} wrap="nowrap" justify="space-between" alignItems="flex-start" direction="row" style={{ marginTop: "8px" }}>
                <Grid item xs={10}>
                    <SelectBox
                        className={classes.selectBox}
                        value={"group_by_server"}
                        list={[
                            {
                                label: `${t('omniapp:GROUP_BY_SERVER')}`,
                                value: "group_by_server"
                            }
                        ]}
                        // height="13px"
                        // iconClass={classes.iconClass}
                        name="group_by"
                        form={false} />
                </Grid>
                <Grid item xs={2} style={{ paddingLeft: 8 }}>
                    <SortIcon className={classes.filterIcon} />
                </Grid>
            </Grid> */}
            <Grid item>
                {loading ? (<div style={{ minHeight: "100vh" }}>
                    <Spinner />
                </div>) : <ListComponent data={groupedData} scrollHandler={scrollHandler} icon_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`} direction={direction} />}
            </Grid>
        </Grid>
        <Grid id="rightContainer" direction="column" container style={{ padding: 10, margin: 2, display: 'inline-grid', overflow: 'auto', maxHeight: 'calc( 100vh - 160px )' }} item xs={9} lg={9} md={9} sm={9}>
            {loading ?
                (<div style={{ minHeight: "100vh" }}>
                    <Spinner />
                </div>) :
                groupedData && groupedData.map(data => {
                    return (<div key={data.key}>
                        {data.list.map(item => <Components onSuccessCallback={getData} key={item.app_id} loading={loading} id={item.app_id} componentsData={item} />)}
                    </div>)
                })}
        </Grid>
    </Grid>)

    // return (
    //     <Paper className={classes.paper}>
    //         <Toolbar className={classes.root}>
    //             <SearchBox
    //                 placeholder={`${t('omniapp:SEARCH_APPLICATION')}`}
    //                 onSearchChange={onSearchChange}
    //                 haveSuggestions={true}
    //                 suggestionData={suggestionData}
    //                 haveRecents={true}
    //                 direction="ltr"
    //                 recentData={recentData}
    //             />
    //             <form>
    //                 <input
    //                     type="text"
    //                     // className={classes.myinput}
    //                     onChange={(e) => {
    //                         let isTrue = validateRegex(e.target.value, REGEX.NumericPositive)
    //                         if (!isTrue) setError(true)
    //                         else setError(false)
    //                     }}
    //                     className={clsx(error ? 'red-border' : 'custom-class')}
    //                 />
    //             </form>

    //             <div>
    //                 {selected.length === 1 ? (
    //                     <Tooltip title="Delete">
    //                         <IconButton aria-label="delete" color="disabled" className={classes.borderBtn}
    //                             onClick={handleDelete}>
    //                             <img src="icons/trash_2.svg" alt="trash" />
    //                         </IconButton>
    //                     </Tooltip>
    //                 ) : null}

    //                 <Button
    //                     variant="contained"
    //                     color="secondary"
    //                     className={classes.button}
    //                     startIcon={<AddIcon />}
    //                     onClick={() => normalDialogStore.openDialog(
    //                         <Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}>
    //                             <AddEditAppplicationModal handleClose={handleClose} onSuccessCallback={getData} />
    //                         </Suspense>,
    //                         "Register Application"
    //                     )}
    //                 >{t('omniapp:ADD_APPLICATION')}</Button>
    //             </div>
    //         </Toolbar>

    //         <TableComponent
    //             tableData={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
    //             headerData={headCells}
    //             loading={loading}
    //             disableFirstCell={false}
    //             onChangeCheckbox={(data) => setSelected(data)}
    //             style={{ minWidth: '560px' }}
    //             action={[
    //                 {
    //                     action_type: "icon",
    //                     icon_url: "icons/edit.svg",
    //                     height: "15",
    //                     onClick: (item) => normalDialogStore.openDialog(
    //                         <Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}>
    //                             <AddEditAppplicationModal
    //                                 modalType="EDIT"
    //                                 data={item}
    //                                 handleClose={handleClose}
    //                                 onSuccessCallback={getData}
    //                             />
    //                         </Suspense>,
    //                         `${t('omniapp:EDIT_APPLICATION')}`
    //                     ),
    //                     className: ""
    //                 },
    //             ]}
    //         />
    //         {
    //             rows.length > 0 &&
    //             <Pagination
    //                 component="div"
    //                 count={Number.isInteger((rows.length / rowsPerPage)) ? (rows.length / rowsPerPage) : Math.trunc((rows.length / rowsPerPage)) + 1}
    //                 page={page + 1}
    //                 onChange={handleChangePage}
    //                 color="primary"
    //                 className={classes.ul}
    //                 style={{ marginLeft: 'right', paddingTop: '20px' }}
    //             />
    //         }
    //     </Paper>
    // )
}

export default Applications;
