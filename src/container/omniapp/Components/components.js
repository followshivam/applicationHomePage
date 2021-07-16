import React, { useState, lazy, Suspense } from 'react'
import {
   makeStyles,
   useTranslation,
   Button,
   Typography,
   Grid,
   TableComponent,
   Spinner,
   Dropdown,
   Tooltip
} from 'component'
import { useSelector } from 'react-redux'
import { ActComp } from 'global/omniapp/api/ApiMethods'
import DeleteConfirmation from 'component/Confirmation'
import AddEditAppplicationModal from 'container/omniapp/applications/AddEditAppplicationModal';
import useIntersect from './useIntersect'
const AddComponent = lazy(() => import('./add_component'))

const useStyles = makeStyles(theme => ({
   root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      direction: props => props.direction
   },
   title: {
      flex: '1 1 100%'
   },
   paper: {
      width: '100%',
      minHeight: '509px',
      padding: theme.spacing(2),
      textAlign: 'center',
      marginBottom: theme.spacing(2),
      flexGrow: 1,
      position: 'relative'
   },
   borderBtn: {
      border: '1px solid #338ED1',
      padding: '7.5px',
      borderRadius: '2px',
      marginRight: '15px'
   },
   buttonGrid: {
      marginRight: props => props.direction === "ltr" ? '6px' : undefined,
      marginLeft: props => props.direction === "rtl" ? '6px' : undefined
   },
   button: {
      padding: '6px 14px',
      height: 30,
      color: '#fff'
   },
   addBtn: {
      border: '1px solid #338ED1',
      borderRadius: '2px',
      margin: "0px 6px",
      height: '28px',
      padding: '5px 6px',
      color: '#0072C6',
      fontWeight: 600
   },
   ul: {
      '& ul': {
         justifyContent: 'flex-end'
      }
   },
   label: {
      fontSize: '12px',
      color: '#7D7D7D'
   },
   labelValue: {
      marginLeft: props => props.direction === "ltr" ? '6px' : undefined,
      marginRight: props => props.direction === "rtl" ? '6px' : undefined
      // marginLeft: '6px'
   },
   tableInfo: {
      marginLeft: props => props.direction === "ltr" ? '0.875rem' : undefined,
      marginRight: props => props.direction === "rtl" ? '0.875rem' : undefined,
      marginBottom: 10
   },
   activeClass: {
      fontWeight: 800
   },
   compInfo: {
      display: "inline-flex",
      whiteSpace: "pre",
      maxWidth: '10rem',
      marginRight: props => props.direction === "ltr" ? '16px' : undefined,
      marginLeft: props => props.direction === "rtl" ? '16px' : undefined,
      lineHeight: 1.5
   }
}))

const TableInfo = props => {
   const {
      extendedInfo: { body, action, heading },
      classes,
      data
   } = props

   const globalSettings = useSelector(store => store.globalSettings);
   const { t } = useTranslation(
      globalSettings.locale_module
         ? globalSettings.locale_module
         : ['bam', 'omniapp']
   )

   const normalDialogStore = useSelector(state => state.normalDialogState)
   const handleClose = () => {
      normalDialogStore.closeDialog()
   };

   return (
      <div className={classes.tableInfo}>
         <Grid
            container
            direction='row'
            justify='flex-start'
            alignItems='flex-end'
            wrap='nowrap'
         >
            <Grid
               item
               // container
               // direction='column'
               // spacing={1}
               xs={9}
               sm={9}
               md={9}
               lg={9}
               container
               alignItems='stretch'
            >
               <Grid
                  item
                  container
                  xs={3}
                  justify='flex-start'
                  alignItems='stretch'>
                  <Typography variant='h6' style={{ lineHeight: 1.4 }}>
                     {heading}
                  </Typography>
               </Grid>
               <div style={{ display: "inline-flex", whiteSpace: "pre" }}>
                  {Object.keys(body).map((key, i) => (
                     // <Grid item direction='row' xs container wrap="nowrap" justify='flex-start'>
                     <div key={i} className={classes.compInfo}>
                        <Typography
                           variant='subtitle1'
                           className={classes.label}
                        >
                           {key} :
                        </Typography>
                        <Tooltip
                           title={body[key]}
                           placement="top"
                           arrow
                           disableHoverListener={(i === 0 || i === 2)}>
                              <Typography
                                 variant='subtitle1'
                                 noWrap= {(i === 0 || i === 2) ? false:true}
                                 //ref={textElementRef}
                                 className={classes.labelValue}
                              >
                                 {body[key]}
                              </Typography>
                        </Tooltip>
                     </div>
                  ))}
               </div>
            </Grid>
            <Grid
               item
               container
               xs={3}
               justify='flex-end'
               alignItems='stretch'
               className={classes.buttonGrid}>
               {action && (
                  <Button
                     variant='outlined'
                     className={classes.addBtn}
                     onClick={action.clickHandler}
                  >
                     {action.label}
                  </Button>
               )}
               <Dropdown
                  image_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/more1.svg`}
                  height={28}
                  width={28}
                  list={[
                     {
                        id: 1,
                        value: 'Modify',
                        label: `${t('omniapp:MODIFY')}`,
                        labelFontSize: '12px',
                        action: () => {
                           console.log("item", data);
                           normalDialogStore.openDialog(
                              <Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}>
                                 <AddEditAppplicationModal
                                    modalType="EDIT"
                                    data={data}
                                    handleClose={handleClose}
                                 // onSuccessCallback={getData}
                                 />
                              </Suspense>,
                           )
                        },
                     }
                  ]} />
            </Grid>
         </Grid>
      </div>
   )
}

const Components = props => {
   const globalSettings = useSelector(store => store.globalSettings);
   const { t } = useTranslation(
      globalSettings.locale_module
         ? globalSettings.locale_module
         : ['bam', 'omniapp']
   )
   // const [isOverflowed, setIsOverflow] = useState(true);
   // const textElementRef = useRef();
   // useEffect(() => {
   //    setIsOverflow(textElementRef.current.innerText.length > 8);
   // }, []);


   const [direction] = useState(`${t('bam:HTML_DIR')}`)
   const classes = useStyles({ direction });
   const { componentsData, id, onSuccessCallback } = props

   // eslint-disable-next-line no-unused-vars
   const [loading, setLoading] = useState(props.loading)
   // eslint-disable-next-line no-unused-vars
   const [ref, entry] = useIntersect({
      activeClass: classes.activeClass
   })
   const normalDialogStore = useSelector(state => state.normalDialogState)

   const snackbarStore = useSelector(state => {
      return state.snackbarState
   })
   const headCells = [
      { id: 'name', label: `${t('omniapp:COMPONENT')}` },
      { id: 'comp_name', label: `${t('omniapp:COMPONENT_TYPE')}` },
      { id: 'description', label: `${t('omniapp:DESCRIPTION')}` },
      { id: 'views', label: `${t('omniapp:VIEW')}` },
      { id: 'last_modified', label: `${t('omniapp:LAST_MODIFIED')}` }
   ]

   const deleteClicked = component => {
      let component_name = component.comp_name;
      normalDialogStore.openDialog(
         <Suspense
            fallback={
               <div style={{ height: '250px', minWidth: '600px' }}>
                  <Spinner msg='' />
               </div>
            }
         >
            <DeleteConfirmation
               action={() => handleDelete(component)}
               title={`${t("omniapp:DELETE")}`}
               button_label={`${t("omniapp:DELETE_BUTTON")}`}
               direction={`${t("bam:HTML_DIR")}`}
               description={
                  `${t("omniapp:DELETE_CONFIRMATION")} ${component_name} ${t("omniapp:COMPONENT")}?`
               }
            />
         </Suspense>,
         'Confirmation Dialog'
      )
   }

   const handleDelete = component => {
      console.log(component)
      const comp_ins_id = component.ins_id
      const payload = {
         opr: '3',
         comp_ins_id: comp_ins_id
      }
      ActComp(JSON.stringify(payload))
         .then(res => {
            console.log(res)
            if (res != null && res.status.maincode === '0') {
               const description = res.status.description
                  ? res.status.description
                  : 'Success'
               snackbarStore.openSnackbar(description, 'success', 2000)
               onSuccessCallback()
            } else if (res != null) {
               const errorMsg = res.status.errormsg
                  ? res.status.errormsg
                  : res.status.description
               snackbarStore.openSnackbar(
                  errorMsg
                     ? errorMsg
                     : 'Something went wrong, Please contact Admin',
                  'error',
                  2000
               )
            }
         })
         .catch(err => {
            console.log(err)
            snackbarStore.openSnackbar(
               'Something went wrong, Please contact Admin',
               'error',
               2000
            )
         })
   }

   const editViewHandler = res => {
      let app_name = componentsData.app_code
      normalDialogStore.openDialog(
         <Suspense
            fallback={
               <div style={{ height: '250px', minWidth: '600px' }}>
                  <Spinner msg='' />
               </div>
            }
         >
            <AddComponent
               modalType='EDIT'
               currentEdit={res}
               appName={app_name}
               onSuccessCallback={onSuccessCallback}
            />
         </Suspense>,
         `${t('omniapp:EDIT_COMPONENT')}`
      )
   }

   const openDialogBoxFromStore = () => {
      let app_name = componentsData.app_code
      normalDialogStore.openDialog(
         <Suspense
            fallback={
               <div style={{ height: '250px', minWidth: '600px' }}>
                  <Spinner msg='' />
               </div>
            }
         >
            <AddComponent
               modalType='ADD'
               appName={app_name}
               onSuccessCallback={onSuccessCallback}
            />
         </Suspense>,
         `${t('omniapp:ADD_COMPONENT')}`
      )
   }

   return (
      componentsData && (
         <div id={`t_${id}`} ref={ref}>
            <TableInfo
               classes={classes}
               data={componentsData}
               //isOverflowed={isOverflowed}
               extendedInfo={{
                  heading: componentsData.name,
                  body: {
                     [`${t('omniapp:LOCATION')}`]:
                        componentsData.app_loc === '1'
                           ? 'OmniApp Server'
                           : 'Other Server',
                     [`${t('omniapp:DOMAIN')}`]:
                        componentsData.app_domain === ''
                           ? '192.168.153.130'
                           : componentsData.app_domain,
                     [`${t('omniapp:SSL_SECURED')}`]:
                        componentsData.ssl_secured === 'Y' ? 'Yes' : 'No',
                     [`${t('omniapp:CONTEXT')}`]:
                        componentsData.app_context,
                  },
                  action: {
                     label: `${t('omniapp:ADD_COMPONENT')}`,
                     clickHandler: openDialogBoxFromStore
                  }
               }}
            />
            <TableComponent
               backgroundColor='white'
               notFound={{
                  iconUrl: `${process.env.REACT_APP_CONTEXT_PATH}/icons/info.svg`,
                  messageColor: '#828282',
                  messageFontSize: '12px',
                  backgroundColor: 'white',
                  iconSize: 24,
                  message: `${t('omniapp:NO_COMPONENT_AVAILABLE')}`
               }}
               loading={loading}
               minWidth='100%'
               disableFirstCell={false}
               tableData={componentsData.components}
               headerData={headCells}
               boldFirstColumn='true'
               dynamicHeight='fit-content'
               direction={direction}
               paddingBottom="45px"
               selectType={'img'}
               imageInfo={{
                  path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                  ext: '.svg',
                  img_type: 'report'
               }}
               action={[
                  {
                     action_type: 'icon',
                     icon_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`,
                     height: '',
                     onClick: res => deleteClicked(res),
                     className: ''
                  },
                  {
                     action_type: 'icon',
                     icon_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.svg`,
                     height: '',
                     onClick: res => editViewHandler(res),
                     className: ''
                  }
               ]}
            />
         </div>
      )
   )
}

export default Components
