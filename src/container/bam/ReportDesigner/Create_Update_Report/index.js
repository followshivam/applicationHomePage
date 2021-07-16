import React, { useEffect, useState, Suspense, Fragment, lazy } from 'react'
import {
   Button,
   FixedFooter,
   InputBox,
   PickList,
   Confirmation,
   CardRadioButton,
   Alert,
   withStyles,
   Typography,
   Grid,
   Divider,
   Spinner,
   useTranslation,
   makeStyles,
   IconImage,
   IconsButton,
   Tooltip
} from 'component'
import { CreateReport } from 'redux/action'
import { useDispatch, useSelector } from 'react-redux'
import stylesheet from './style.module.css'
import {
   ReportDefinitionInput,
   CreateUpdateReportInput,
   ChartProperties,
   TableProperties
} from 'global/json'
import { GetReportDefinition, GetCategoryList } from 'global/bam/api/ApiMethods'
import EditReportNameModal from './EditReportNameModal'
import AddConstraints from './AddConstraints'
import ManageCategory from '../Category/manage_category'

const useStyle = makeStyles(theme => {
   return {
      numberCircle: {
         height: '25px',
         width: '25px',
         borderRadius: '50%',
         border: `2.5px solid #242526`,
         display: 'flex',
         justifyContent: 'center',
         justifyItems: 'center',
         alignItems: 'center',
         marginRight: theme.spacing(1),
         fontSize: theme.typography.subtitle1.fontSize
      },
      numberCircleCompleted: {
         height: '25px',
         width: '25px',
         borderRadius: '50%',
         fontSize: theme.typography.h4.fontSize,
         color: '#FFFFFF',
         backgroundColor: theme.palette.primary.main,
         display: 'flex',
         justifyContent: 'center',
         justifyItems: 'center',
         alignItems: 'center',
         marginRight: theme.spacing(1)
      },
      reportRoot: {
         width: '512px',
         padding: '12px 22px'
      },
      addReportButton: {
         float: 'right',
         marginBottom: '1px'
         // marginRight: '2px'
      },
      marginTopStyle: {
         marginTop: '10px'
      },
      element: {
         display: 'flex',
         marginRight: theme.spacing(6),
         justifyItems: 'center',
         alignItems: 'center'
      },
      toolbar: { marginTop: '2px' },
      buttonSpacing: {
         '&>*': {
            margin: theme.spacing(1)
         }
      },
      labelCompleted: {
         color: `${theme.palette.primary.main}`
      },
      formMargin: {
         '&>*': {
            margin: '23px 0px'
         }
      },
      report_name: {
         padding: '17px 10px 16px 21px'
      },
      errorOuterDiv: {
         border: '1px solid #e9a9a9',
         borderRadius: '3px',
         backgroundColor: '#f7f7f7'
      },
      errorDiv: {
         padding: '8px 0px',
         fontSize: '12px',
         fontFamily: 'Open Sans',
         color: '#c40505',
         textAlign: 'center'
      }
   }
})

const StyledAlert = withStyles({
   filledError: {
      fontSize: '12px',
      fontWeight: 400,
      backgroundColor: '#C53434'
   }
})(Alert)

const Error = props => {
   const classes = useStyle()

   return (
      <div className={classes.errorOuterDiv}>
         <div className={classes.errorDiv}>{props.children}</div>
      </div>
   )
}

const Step1 = props => {
   const classes = useStyle()
   const [store, dialogState, fullDialog, snackbarState] = useSelector(
      state => {
         return [
            state.createReportState,
            state.normalDialogState,
            state.fullDialogState,
            state.snackbarState
         ]
      }
   )

   const [data, setData] = useState('')
   const [loader, setLoader] = useState(true)
   const dispatch = useDispatch()
   const { successEvent, t } = props
   const queryHandler = e => {
      // let data = { ...store, [e.target.name]: e.target.value.trim() };
      // console.log(e.target.value)
      // setData({...data,[e.target.name]: e.target.value.trim()});
      store[e.target.name] = e.target.value.trim()
   }

   const [reportCategory, setReportCategory] = useState({
      loading: true,
      list: null,
      error_msg: ''
   })
   const getReportCategory = () => {
      GetCategoryList({ screenid: 'ReportDesigner' })
         .then(res => {
            let response = res.data
            if (response != null && res.status.maincode === '0') {
               let default_values = [
                  {
                     value: 'GR',
                     label: 'General',
                     category_index: '-1',
                     category_name: 'General'
                  },
                  {
                     value: 'HR',
                     label: 'Hidden',
                     category_index: '0',
                     category_name: 'Hidden'
                  }
               ]

               var list_data = {
                  data: [...default_values, ...res.data.category]
               }
               setReportCategory({
                  ...reportCategory,
                  loading: false,
                  list: list_data
               })
            } else {
               setReportCategory({
                  ...reportCategory,
                  loading: false,
                  error_msg: res.status.errormsg
               })
            }
         })
         .catch(err => {})
   }

   const pickListHandler = val => {
      store['rpt_category_type'] = val.value
      store['rpt_category_index'] = val.category_index
      store['rpt_category_name'] = val.category_name
   }
   const submitHandler = e => {
      e.preventDefault()
      if (
         // store.report_description &&
         store.report_name &&
         store.report_report_query_type &&
         store.rpt_category_name
      ) {
         store['current_step'] = store['current_step'] + 1
         dispatch(CreateReport(store))
         successEvent(store['current_step'])
      } else {
         snackbarState.openSnackbar(
            `${t('bam:ERROR')}: ${t('bam:PLEASE_FILL_REQ_FIELDS')}`,
            'error'
         )
      }
   }

   const onClose = () => {
      dialogState.openDialog(
         <Confirmation
            button_label={` ${t('bam:YES')} `}
            title={t('bam:CANCEL_THE_PROCESS_CONFIRMATION')}
            description={t('bam:LOSE_ALL_CONFIG_MESSAGE')}
            action={() => {
               dispatch(
                  CreateReport({ ...CreateUpdateReportInput.custom_report })
               )
               fullDialog.closeDialog()
            }}
         />,
         ''
      )
   }

   const handleDialogClose = () => {
      dialogState.closeDialog()
   }

   const handleConstraints = (
      reportAvailabiltyConstraint,
      reportDownloadConstraint,
      reportViewConstraint
   ) => {
      store.report_availabilty_constraint = reportAvailabiltyConstraint
      store.report_view_constraint = reportViewConstraint
      store.report_download_constraint = reportDownloadConstraint
      dispatch(CreateReport(store))
      setTimeout(() => dialogState.closeDialog(), 100)
   }

   return (
      <form onSubmit={submitHandler}>
         <Typography component='div' style={{ background: '#EEE' }}>
            <Grid
               container
               style={{ flexGrow: 1 }}
               justify='space-around'
               alignItems='center'
            >
               <Grid item xs={10} lg={5} className={classes.formMargin}>
                  <Typography variant='h3'>{t('bam:CREATE_REPORT')}</Typography>
                  <InputBox
                     label={t('bam:REPORT_NAME')}
                     form
                     name='report_name'
                     fullWidth={true}
                     helpertext={t('bam:20_CHAR_MAX')}
                     required
                     value={store.report_name}
                     onChangeHandler={queryHandler}
                  />
                  <InputBox
                     label={t('bam:DESCRIPTION')}
                     name='report_description'
                     rows='6'
                     // required
                     fullWidth={true}
                     multiline={true}
                     minRows={8}
                     maxRows={10}
                     value={store.report_description}
                     onChangeHandler={queryHandler}
                  />
                  <div>
                     <span
                        className={classes.addReportButton}
                        onClick={() =>
                           dialogState.openDialog(
                              <Suspense
                                 fallback={
                                    <div
                                       style={{
                                          height: '200px',
                                          minWidth: '600px'
                                       }}
                                    >
                                       <Spinner msg='' />
                                    </div>
                                 }
                              >
                                 <ManageCategory fromReport={true} />
                              </Suspense>,
                              'AddReportCategory'
                           )
                        }
                     >
                        <IconsButton type='Add' color='primary' />
                     </span>
                     <PickList
                        label={t('bam:REPORT_CATEGORY')}
                        name='report_category'
                        fullWidth={true}
                        helpertext={t('bam:GENERAL_REPORT_CATEGORY_LABEL')}
                        required
                        labelMinWidth='120px'
                        labelMaxWidth='120px'
                        onOpen={getReportCategory}
                        value={store.rpt_category_name}
                        list={
                           reportCategory.list == null
                              ? null
                              : reportCategory.list
                        }
                        loading={reportCategory.loading}
                        injectLiveValue={true}
                        displayKey='category_name'
                        valueKey='category_index'
                        error_msg={reportCategory.error_msg}
                        onChangeHandler={pickListHandler}
                     />
                  </div>
               </Grid>
               <Divider orientation='vertical' flexItem />
               <Grid item xs={10} lg={5}>
                  <CardRadioButton
                     label={t('bam:SELECT_QUERY_INPUT_TYPE')}
                     name='report_report_query_type'
                     radio_group_array={[
                        {
                           value: 'C',
                           image_url: 'icons/write_query.png',
                           disabled: false,
                           label: `${t('bam:WRITE_QUERY')}`,
                           description: `${t('bam:WRITE_QUERY_DESCRIPTION')}`
                        },
                        {
                           value: 'F',
                           image_url: 'icons/build_query.png',
                           disabled: false,
                           label: `${t('bam:BUILD_QUERY_WIZARD')}`,
                           description: `${t('bam:BUILD_QUERY_DESCRIPTION')}`
                        }
                     ]}
                     value={store.report_report_query_type}
                     onChange={queryHandler}
                     required
                  />
                  {/*<Grid container spacing={2} justify="flex-end" style={{ marginTop: 60 }}>
        <Grid item>
          <Button color="primary" variant="contained" disabled>Close</Button>
        </Grid>
        <Grid item>
          <Button color="primary" variant="contained" type="submit">Proceed</Button>
        </Grid>
      </Grid>*/}
               </Grid>
            </Grid>
         </Typography>
         <Grid container justify='space-around' alignItems='center'>
            <Grid item xs={10} lg={5}></Grid>
            <Divider orientation='vertical' flexItem />
            <Grid item xs={10} lg={5}>
               {/*<Error>
                  <span style={{ fontWeight: 600 }}>
                     {t('bam:CAUTION')} {'  '}
                  </span>
                  : {t('bam:IF_CHANGE_QUERY_TYPE_ALERT')}
               </Error>*/}
               {/* <StyledAlert
                  icon={false}
                  severity='error'
                  style={{ flexGrow: 1, marginTop: 35 }}
               >
                  <span style={{ fontWeight: 600 }}>CAUTION {'  '}</span>: If
                  you change the Query input type and proceed you will loose all
                  your configuration.
               </StyledAlert> */}
            </Grid>
         </Grid>
         <FixedFooter>
            <Grid container spacing={2} justify='space-between'>
               <Grid item>
                  <Button
                     variant='outlined'
                     color='secondary'
                     onClick={() =>
                        dialogState.openDialog(
                           <Suspense
                              fallback={
                                 <div
                                    style={{
                                       height: '200px',
                                       minWidth: '600px'
                                    }}
                                 >
                                    <Spinner msg='' />
                                 </div>
                              }
                           >
                              <AddConstraints
                                 report_view_constraint={
                                    store.report_view_constraint
                                 }
                                 report_availabilty_constraint={
                                    store.report_availabilty_constraint
                                 }
                                 report_download_constraint={
                                    store.report_download_constraint
                                 }
                                 t={t}
                                 action_button={[
                                    {
                                       id: 1,
                                       label: `${t('bam:BUTTON_CLOSE')}`,
                                       type: 'button',
                                       variant: 'outlined',
                                       color: 'primary',
                                       action: handleDialogClose
                                    },
                                    {
                                       id: 2,
                                       label: `${t('bam:BUTTON_SAVE')}`,
                                       type: 'submit',
                                       variant: 'contained',
                                       color: 'primary',
                                       action: handleConstraints
                                    }
                                 ]}
                              />
                           </Suspense>,
                           'Constraints'
                        )
                     }
                  >
                     {t('bam:BUTTON_CONSTRAINTS')}
                  </Button>
               </Grid>
               <Grid item>
                  <Button variant='outlined' color='primary' onClick={onClose}>
                     {t('bam:BUTTON_CLOSE')}
                  </Button>
                  <Button
                     color='primary'
                     variant='contained'
                     type='submit'
                     style={{ marginLeft: '16px' }}
                  >
                     {t('bam:BUTTON_NEXT')}
                  </Button>
               </Grid>
            </Grid>
         </FixedFooter>
      </form>
   )
}

const DataSelection = React.lazy(() => import('./DataSelection'))
const OutputConfiguration = React.lazy(() => import('./OutputConfiguration'))
const ReportVisualization = React.lazy(() => import('./ReportVisualization'))
const QueryWriting = React.lazy(() => import('./QueryWriting/query_writing'))

const USE = makeStyles(theme => ({
   labelRoot: {
      height: '50px',
      width: `calc(100% - ${theme.spacing(2)})`,
      borderBottom: props =>
         props.disable_container
            ? `0.5px solid ${theme.palette.borderColor}`
            : '',
      overflow: 'auto',
      display: 'flex',
      direction: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: theme.spacing(2)
   },
   element: {
      display: 'flex',
      marginRight: theme.spacing(4),
      justifyItems: 'center',
      alignItems: 'center',
      height: '100%'
   },
   numberCircle: {
      height: '25px',
      width: '25px',
      borderRadius: '50%',
      border: `2.5px solid #242526`,
      display: 'flex',
      justifyContent: 'center',
      justifyItems: 'center',
      alignItems: 'center'
   },
   numberCircleCompleted: {
      height: '25px',
      width: '25px',
      borderRadius: '50%',
      color: '#FFFFFF',
      backgroundColor: theme.palette.primary.main,
      display: 'flex',
      justifyContent: 'center',
      justifyItems: 'center',
      alignItems: 'center'
   },
   circleContainer: props => {
      return {
         marginRight: theme.spacing(1),
         height: '100%',
         width: 'fit-content',
         display: 'flex',
         alignItems: 'center',
         borderBottom: `3px solid ${
            props.active === true ? theme.palette.primary.main : 'transparent'
         }`
      }
   },
   bottomActiveBar: {
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      height: '4px'
   },
   label: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '3px solid transparent'
   }
}))

const MultiStep = props => {
   const {
      step_list = [],
      active,
      onPreviousHandler,
      onNextHandler,
      disable_container = true,
      t
   } = props
   const classesOld = useStyle()
   const store = useSelector(state => {
      return state.createReportState
   })
   const [fullDialogStore, normalDialogStore] = useSelector(state => {
      return [state.fullDialogState, state.normalDialogState]
   })

   const normalStoreDialog = useSelector(state => {
      return state.normalDialogState
   })

   const handleClose = () => {
      normalStoreDialog.closeDialog()
   }

   let classes = USE({ disable_container, active: false })
   return (
      <React.Fragment>
         <div className={stylesheet.stepper}>
            <div
               style={{
                  width: '37%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
               }}
            >
               <Tooltip title={store.report_name}>
                  <Typography
                     className={classesOld.report_name}
                     variant='h3'
                     noWrap={true}
                     style={{ maxWidth: '320px' }}
                  >
                     {store.report_name}
                  </Typography>
               </Tooltip>
               <Tooltip title={store.rpt_category_name}>
                  <Typography
                     variant='h4'
                     noWrap={true}
                     style={{
                        maxWidth: '100px',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        background: '#EBEBEB',
                        marginRight: '12px'
                     }}
                  >
                     {store.rpt_category_name}
                  </Typography>
               </Tooltip>
               <IconImage
                  className={classes.icon}
                  url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.svg`}
                  height={15}
                  onClick={() =>
                     normalDialogStore.openDialog(
                        <Suspense
                           fallback={
                              <div
                                 style={{ height: '250px', minWidth: '600px' }}
                              >
                                 <Spinner msg='' />
                              </div>
                           }
                        >
                           <EditReportNameModal
                              t={t}
                              handleClose={handleClose}
                           />
                        </Suspense>,
                        'Add Application'
                     )
                  }
               />
            </div>

            {/* <div className={stylesheet.name_pane}>
               <Typography variant='h6' className={stylesheet.stepper_title}>
                  {store.report_name}
               </Typography>
               <span className={stylesheet.stepper_subtitle}>
                  <Typography variant='subtitle2'>
                     {props.subTitle}
                     General
                  </Typography>
               </span>
               <IconImage
                  className={classes.icon}
                  url={'icons/edit.svg'}
                  height={15}
               />
               <div></div>
            </div> */}
            <div style={{ height: '100%' }}>
               {step_list.map((res, key) => {
                  classes = USE({
                     disable_container,
                     active: active === key + 1
                  })
                  return (
                     <div key={key} className={classes.element}>
                        <div className={classes.circleContainer}>
                           <div
                              className={
                                 active >= key + 1
                                    ? classes.numberCircleCompleted
                                    : classes.numberCircle
                              }
                           >
                              <Typography
                                 variant='h6'
                                 style={{
                                    color: active >= key + 1 ? 'white' : 'black'
                                 }}
                              >
                                 <b>{key + 1}</b>
                              </Typography>
                           </div>
                        </div>
                        <div className={classes.label}>
                           <Typography variant='h5' noWrap={true}>
                              {res.label}
                           </Typography>
                        </div>
                     </div>
                  )
               })}
            </div>
            <div style={{ width: '150px' }}></div>
         </div>
         <Divider variant='fullWidth' />
         {step_list.map((res, key) => {
            return (
               <Fragment key={key}>
                  {key + 1 === active ? (
                     <Suspense
                        fallback={
                           <div style={{ height: '100vh' }}>
                              <Spinner />
                           </div>
                        }
                     >
                        <res.component
                           onPreviousHandler={onPreviousHandler}
                           onNextHandler={onNextHandler}
                        />
                     </Suspense>
                  ) : null}
               </Fragment>
            )
         })}
      </React.Fragment>
   )
}

const Step2 = props => {
   const { successEvent = null, step = 0, t } = props
   const store = useSelector(state => {
      return state.createReportState
   })

   const step_list_wizard = [
      { label: `${t('bam:DATA_SELECTION')}`, component: DataSelection },
      {
         label: `${t('bam:OUTPUT_CONFIGURATION')}`,
         component: OutputConfiguration
      },
      {
         label: `${t('bam:REPORT_VISUALIZATION')}`,
         component: ReportVisualization
      }
   ]
   const step_list_query = [
      { label: `${t('bam:WRITE_QUERY')}`, component: QueryWriting },
      {
         label: `${t('bam:OUTPUT_CONFIGURATION')}`,
         component: OutputConfiguration
      },
      {
         label: `${t('bam:REPORT_VISUALIZATION')}`,
         component: ReportVisualization
      }
   ]

   const dispatch = useDispatch()
   const classes = useStyle()

   const onNextHandler = step_no => {
      successEvent(step_no)
   }
   const onPreviousHandler = step_no => {
      successEvent(step_no)
   }
   const query_type = store.report_report_query_type === 'F'
   const step_list = query_type ? step_list_wizard : step_list_query
   const query_type_status = { query_type }
   return (
      <React.Fragment>
         <MultiStep
            t={t}
            active={step}
            step_list={step_list}
            onPreviousHandler={onPreviousHandler}
            onNextHandler={onNextHandler}
         />
         {/* {step != 3 && query_type_status && (
            <ExpandableFooter
               heading='Query'
               data=' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.'
            />
         )}
         {step === 2 && !query_type_status && (
            <ExpandableFooter
               heading='Query'
               data=' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.'
            />
         )} */}
      </React.Fragment>
   )
}
const ReportCreate = props => {
   const { report_index = null } = props
   const [globalSetting] = useSelector(state => {
      return [state.globalSettings]
   })

   const { t } = useTranslation(globalSetting.locale_module)
   const [isLoading, setIsLoading] = useState({
      msg: `${t('bam:LOADING')}...`,
      loading: true
   })
   const { loading, msg } = isLoading
   const [nextStep, setNextStep] = useState(null)
   const dispatch = useDispatch()

   useEffect(() => {
      if (report_index != null) {
         getReportDefinition()
      } else {
         dispatch(
            CreateReport({
               ...CreateUpdateReportInput.custom_report,
               current_step: 0,
               chart_properties: ChartProperties,
               table_properties: TableProperties,
               report_index: report_index
            })
         )
         setNextStep(0)
         setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500)
      }
   }, [report_index])

   const getReportDefinition = () => {
      GetReportDefinition({
         ...ReportDefinitionInput,
         report_index: report_index
      })
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               let report_type = res.custom_report.report_display_type
               if (report_type === 'TG') {
                  dispatch(
                     CreateReport({
                        ...res.custom_report,
                        current_step: 0,
                        report_index: report_index
                     })
                  )
               } else if (report_type === 'T') {
                  dispatch(
                     CreateReport({
                        ...res.custom_report,
                        current_step: 0,
                        // chart_properties: ChartProperties,
                        report_index: report_index
                     })
                  )
               } else if (report_type === 'G') {
                  dispatch(
                     CreateReport({
                        ...res.custom_report,
                        current_step: 0,
                        table_properties: TableProperties,
                        report_index: report_index
                     })
                  )
               }
               setNextStep(0)
               setTimeout(
                  () => setIsLoading({ ...isLoading, loading: false }),
                  500
               )
            }
         })
         .catch(err => {})
   }

   return (
      <div
         style={{
            background: '#EFEFEF ',
            height: '100vh',
            overflow: 'auto'
         }}
      >
         {loading ? (
            <Spinner msg={msg} />
         ) : nextStep === 0 ? (
            <Step1
               t={t}
               successEvent={val => setNextStep(val)}
               step={nextStep}
            />
         ) : (
            <Step2
               t={t}
               successEvent={val => setNextStep(val)}
               step={nextStep}
            />
         )}
      </div>
   )
}
export default ReportCreate
