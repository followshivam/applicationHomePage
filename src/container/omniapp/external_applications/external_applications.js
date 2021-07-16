import React, { useState, Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
   Toolbar,
   makeStyles,
   Tooltip,
   Button,
   AddIcon,
   IconButton,
   TableComponent,
   Spinner,
   useTranslation,
   // Paper,
   Typography,
   NotFound,
   Confirmation
} from 'component'
import Pagination from '@material-ui/lab/Pagination'
// import SearchBox from 'component/GenericComponet/SearchBox'
// import Checkbox from '@material-ui/core/Checkbox'
import AddEditExternalAppplicationModal from './AddEditExternalApplicationModal'

import {
   GetExternalApplictionList,
   ActExtApp
} from 'global/omniapp/api/ApiMethods'
import ApplicationIFrame from 'component/ApplicationIFrame'
import CustomDialogWrapper from 'component/GenericComponet/CustomDialog'

const useStyles = makeStyles(theme => ({
   root: {
      paddingLeft: props => props.direction === 'rtl' ? theme.spacing(1) : theme.spacing(2),
      paddingRight: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
   },
   paper: {
      width: '100%',
      minHeight: '509px',
      padding: theme.spacing(2),
      textAlign: 'center',
      background: '#f8f8f8', //theme.palette.common.white,
      marginBottom: theme.spacing(2),
      flexGrow: 1,
      position: 'relative'
   },
   table: {
      flexGrow: '1',
      width: '100%'
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
      width: 1
   },
   container: {
      boxShadow: "inset 0px 1px 0px 0px #e0e0e0",
      marginTop: "-8px"
      //  padding: '0 8px 0 8px'
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
      color: '#fff',

   },
   ul: {
      '& ul': {
         justifyContent: props => props.direction === 'rtl' ? 'flex-start' : 'flex-end',
         flexDirection: props => props.direction === 'rtl' ? 'row-reverse' : 'row'
      }
   }
}))

export const ExternalApplications = props => {
   const [selected, setSelected] = React.useState([])
   const [apiData, setApiData] = useState([])
   const [rows, setRows] = React.useState([])
   const [page, setPage] = React.useState(0)
   const [data, setData] = React.useState({})
   const [modalType, setModalType] = React.useState("ADD")
   const [rowsPerPage] = React.useState(10)
   const [loading, setLoading] = useState(true)
   const [store, snackbarState, globalSetting] = useSelector(state => {
      return [state.normalDialogState, state.snackbarState, state.globalSettings];
   });


   const { t } = useTranslation(
      globalSetting.locale_module
         ? globalSetting.locale_module
         : ['bam', 'omniapp']
   )
   const classes = useStyles({ direction: t('omniapp:HTML_DIR') })
   const [open, setOpen] = useState(false);
   const headCells = [
      // {
      //    id: '',
      //    icon:'icons/file.svg',
      //    numeric: false,
      //    disablePadding: true,
      // },
      {
         id: 'app_name',
         // icon: 'icons/file.svg',
         label: `${t('omniapp:COMPONENT_NAME')}`,
         numeric: false,
         disablePadding: false
      },
      {
         id: 'app_url',
         label: `${t('omniapp:URL')}`,
         numeric: false,
         disablePadding: false
      },
      {
         id: '',
         numeric: false,
         disablePadding: false,
         label: `${t('omniapp:AUTHENTICATION_TOKEN')}`,
         component: item => {
            return (
               <Typography>{item.app_sys_var === 'true' ? 'Sent' : 'Not Sent'}</Typography>
            )
         },
      },
      {
         id: 'views',
         label: `${t('omniapp:View')}`,
         numeric: false,
         disablePadding: false
      }, {
         id: 'last_modified',
         label: `${t('omniapp:Last Modified')}`,
         numeric: false,
         disablePadding: false
      },
   ]

   useEffect(() => {
      getData()
   }, [])

   const getData = () => {
      setLoading(true)

      GetExternalApplictionList()
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               setRows(res.data.apps)
               setApiData(res.data.apps)
               setLoading(false)
            } else if (res === null) {
               snackbarState.openSnackbar(
                  'Something went wrong. Please contact Admin',
                  'error',
                  3000
               )
               setLoading(false)
            }
         })
         .catch(err => {
            snackbarState.openSnackbar(
               'Something went wrong. Please contact Admin.',
               'error',
               3000
            )
            console.log(err)
            setLoading(false)
         })
   }

   const normalDialogStore = useSelector(state => {
      return state.normalDialogState
   })

   const handleClose = () => {
      normalDialogStore.closeDialog()
      setOpen(false)
   }

   const handleChangePage = (event, newPage) => setPage(newPage - 1)

   const onSearchSubmit = value => {
      const key = 'app_name'
      const updatedRows = apiData.filter(row =>
         row[key].toLowerCase().includes(value.searchString.toLowerCase())
      )
      setRows(updatedRows)
   }

   const handleDelete = (item) => {
      let param = {
         opr: '3',
         app_id: item?.app_id
      }
      store.openDialog(<Confirmation title={t('bam:BUTTON_DELETE')}
         description="Would you like to delete the Process Modeler?" button_label={t('bam:BUTTON_DELETE')}
         action={() => {
            setLoading(true)
            ActExtApp(param)
               .then(res => {
                  if (res.status.maincode == '0') {
                     setLoading(false)
                     snackbarState.openSnackbar(
                        `Successfully Unregister ${item?.app_name}`,
                        'success'
                     )
                     getData()
                  } else if (res === null) {
                     setLoading(false)
                     snackbarState.openSnackbar(
                        res.status.description,
                        'warning',
                        5000
                     )
                  } else {
                     const description = res.status.description
                     snackbarState.openSnackbar(description, 'error', 3000)
                     setLoading(false)
                  }
               })
               .catch(err => {
                  snackbarState.openSnackbar(
                     'Something went wrong. Please contact Admin.',
                     'error',
                     3000
                  )
                  setLoading(false)
               })
         }
         } />,
         "")
      setSelected([])
   }

   return (
      // <Paper className={classes.paper}>
      <div className={classes.container}>
         {rows.length > 0 && (
            <Toolbar className={classes.root}>
               {/* <SearchBox
               onSearchSubmit={onSearchSubmit}
               clearSearchResult={() => setRows(apiData)}
               placeholder={`${t('omniapp:SEARCH_EXTERNAL_APPLICATION')}`}
            /> */}
               <div>
                  {selected.length === 1 ? (
                     <Tooltip title='Delete'>
                        <IconButton
                           aria-label='delete'
                           color='disabled'
                           className={classes.borderBtn}
                           onClick={(item) => handleDelete(item)}
                        >
                           <img src='icons/trash_bin.svg' alt='trash' />
                        </IconButton>
                     </Tooltip>
                  ) : null}

                  <Button
                     variant='contained'
                     color='secondary'
                     className={classes.button}
                     startIcon={<AddIcon />}
                     onClick={() => {
                        setOpen(true)
                        setData({})
                        setModalType("ADD")
                     }
                     }
                  >
                     {t('omniapp:ADD_EXTERNAL_COMPONENT')}
                  </Button>
               </div>
            </Toolbar>)}

         {rows.length > 0 ? (<TableComponent
            tableData={rows.slice(
               page * rowsPerPage,
               page * rowsPerPage + rowsPerPage
            )}
            headerData={headCells}
            loading={loading}
            selectType={'img'}
            direction={`${t('bam:HTML_DIR')}`}
            disableFirstCell={false}
            onChangeCheckbox={data => setSelected(data)}
            headerColor={'#fff'}
            imageInfo={{
               path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
               ext: '.svg',
               img_type: 'report'
            }}
            action={[
               {
                  action_type: 'icon',
                  icon_url: 'icons/trash_bin.svg',
                  height: '13',
                  onClick: handleDelete
               },
               {
                  action_type: 'icon',
                  icon_url: 'icons/logs.svg',
                  height: '13',
                  onClick: item =>
                     normalDialogStore.openDialog(
                        <Suspense
                           fallback={
                              <div
                                 style={{ height: '250px', minWidth: '600px' }}>
                                 <Spinner msg='' />
                              </div>
                           }
                        >
                           <ApplicationIFrame
                              screenType="application"
                              instance_data={{
                                 load_url: item.app_url,
                                 name: item?.app_name,
                              }}
                              minimize={true}
                              direction={`${t('bam:HTML_DIR')}`}
                           />
                        </Suspense>,
                     ),
               },
               {
                  action_type: 'icon',
                  icon_url: 'icons/new_edit.svg',
                  height: '13',
                  onClick: (item) => {
                     setOpen(true)
                     setModalType("EDIT")
                     setData(item)
                  },

                  className: ''
               }

            ]}
         />) : <div> <NotFound
            iconSize={270}
            message={`No External Components are available!`}
            messageFontSize="16px"
            messageFontWeight={600}
            iconUrl={`${process.env.REACT_APP_CONTEXT_PATH}/icons/external_comp.svg`}
         />
            <div style={{ textAlign: "center" }}>
               <div>No custom application and its components are available in your workspace.</div>
               <div>  Want to create a new custom and its component?</div>
               <div style={{ marginTop: "25px" }}>
                  <Button
                     variant='contained'
                     color='secondary'
                     className={classes.button}
                     startIcon={<AddIcon />}
                     onClick={() => {
                        setOpen(true)
                        setModalType("ADD")
                        setData({})
                     }
                     }
                  >
                     {t('omniapp:ADD_EXTERNAL_COMPONENT')}
                  </Button>
               </div>
            </div>
         </div>}
         {
            open && <AddEditExternalAppplicationModal
               modalType={modalType}
               data={data}
               onSuccessCallback={getData}
               open={open} 
               setOpen={setOpen}
               handleClose={handleClose}
            />
         }
         {
            rows.length > 0 && (
               <Pagination
                  component='div'
                  count={
                     Number.isInteger(rows.length / rowsPerPage)
                        ? rows.length / rowsPerPage
                        : Math.trunc(rows.length / rowsPerPage) + 1
                  }
                  page={page + 1}
                  onChange={handleChangePage}
                  color='primary'
                  className={classes.ul}
                  style={{ marginLeft: 'right', paddingTop: '20px' }}
               />
            )
         }
      </div >
      // </Paper>
   )
}

export default ExternalApplications

