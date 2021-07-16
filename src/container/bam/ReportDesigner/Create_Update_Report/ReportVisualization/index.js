import React, { useState, Suspense, lazy, Fragment, useEffect } from 'react'
import {
   makeStyles,
   Paper,
   IconsButton,
   SelectBox,
   Spinner,
   Button,
   useTranslation,
   Typography,
   clsx,
   IconImage,
   Toolbar,
   Grid,
   Checkbox,
   FixedFooter,
   Confirmation
} from 'component'
import { useDispatch, useSelector } from 'react-redux'
import { CreateUpdateReportInput } from 'global/json'
import { CreateReport } from 'redux/action'
import { ReportAction } from 'global/bam/api/ApiMethods'
const Graphical = lazy(() => import('./Graphical/Graphical'))
const Tabular = lazy(() => import('./Tabular/Tabular'))
const RulesPopuUp = lazy(() => import('./rules_popup'))
const DownloadRport = lazy(() => import('./download_config'))
const tabHeight = '37px'

const useStyles = makeStyles(theme => ({
   root: {
      flexGrow: 1
      // margin: '10px'
   },
   paper: {
      backgroundColor: theme.palette.backgroundContainer,
      // marginTop: theme.spacing(4),
      minHeight: '580px'
      // marginTop: '50px'
      // position: 'fixed'
   },
   tabs: {
      height: tabHeight,
      // height: '100%',
      // padding:  '7px 5px 5px 10px',

      backgroundColor: '#F6F6F6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0px 5px',
      border: `1px solid ${theme.palette.borderColor}`
   },
   tab: {
      cursor: 'pointer'
      // fontSize: '12px',
   },
   tab_container: {
      flexGrow: 1,
      // height: '90vh',
      backgroundColor: theme.palette.common.white,
      // padding: theme.spacing(0, 1, 0, 1),
      borderTop: `1px solid ${theme.palette.borderColor}`
   },
   tabSelected: {
      color: theme.palette.primary.main,
      borderRight: `2px solid ${theme.palette.borderColor}`,
      borderLeft: `2px solid ${theme.palette.borderColor}`,
      borderBottom: `3px solid ${theme.palette.primary.main}`,
      backgroundColor: '#ffffff'
   },
   right_container: {
      flexGrow: 1,
      width: '35vw',
      height: '76vh',
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(1, 1, 1, 1),
      border: `1px solid ${theme.palette.borderColor}`
   },
   additional_tools: {
      width: '35%',
      minWidth: '500px',
      right: '0',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center'
   },
   download_button: {
      width: '100px',
      display: 'flex',
      justifyContent: 'space-evenly',
      cursor: 'pointer',
      alignItems: 'center',
      '& < *': {
         marginRight: theme.spacing(1)
      }
   },
   outlinedSelect: {
      // borderRadius: '2%',
      // height: '23px',
      width: '173px'
      // backgroundColor: 'white',
      // fontSize: '12px'
   },
   container: {
      // marginTop: theme.spacing(5)
      // marginLeft: "10px",
      // marginRight: '10px',
      // height: '615px',
   },
   tabs_toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      backgroundColor: '#EfEfEf',
      border: `1px solid ${theme.palette.borderColor}`
      // height: '37px'
   },
   spinnerLoad: {
      height: '440px',
      width: '1380px'
   },
   buttonWrapper: {
      // marginRight: "12px",
      padding: '2px 9px',
      borderRadius: '3px',
      backgroundColor: theme.palette.common.white
   }
}))

const Home = props => {
   const classes = useStyles()
   const { onPreviousHandler = null, onNextHandler = null } = props
   const [currentTab, setCurrentTab] = useState(0)

   const [isAutoWidthEnable, setIsAutoWidthEnable] = useState(false)
   const [state, setState] = useState({ isLoading: true })

   const [
      reportState,
      normalDialog,
      snackbarState,
      fullDialog,
      globalSetting
   ] = useSelector(state => {
      return [
         state.createReportState,
         state.normalDialogState,
         state.snackbarState,
         state.fullDialogState,
         state.globalSettings
      ]
   })

   const { t } = useTranslation(globalSetting.locale_module)

   const [reportStore, setReportStore] = useState(reportState)
   const dispatch = useDispatch()
   useEffect(() => {
      setState({ isLoading: false, ...reportState })
   }, [reportState])

   const handleTabChange = val => {
      setCurrentTab(val)
   }
   const tabsArray = [
      {
         label: `${t('bam:LABEL_TABULAR')}`,
         component: Tabular,
         index: 0,
         store: state.table_properties
      },
      {
         label: `${t('bam:LABEL_GRAPHICAL')}`,
         component: Graphical,
         index: 1,
         store: state.chart_properties
      }
   ]

   const handleChange = event => {
      setState({
         ...state,
         [event.target.name]: event.target.value
      })
      setReportStore({
         ...reportStore,
         [event.target.name]: event.target.value
      })
   }

   const handleReportDisplayChange = index => {
      let reportDisplayType = state.report_display_type

      if (index === 0) {
         if (reportDisplayType.includes('T')) {
            reportDisplayType = reportDisplayType.replace('T', '')
         } else {
            reportDisplayType = 'T' + reportDisplayType
         }
      } else {
         if (reportDisplayType.includes('G')) {
            reportDisplayType = reportDisplayType.replace('G', '')
         } else {
            reportDisplayType = reportDisplayType + 'G'
         }
      }

      setState({
         ...state,
         report_display_type: reportDisplayType
      })
      return
   }

   const handleRootChange = (parameterName, parameterValue) => {
      setState({
         ...state,
         [parameterName]: parameterValue
      })
      setReportStore({
         ...reportStore,
         [parameterName]: parameterValue
      })
   }

   const syncGraphState = (fieldName, fieldValue) => {
      setState({
         ...state,
         chart_properties: {
            ...state.chart_properties,
            [fieldName]: fieldValue
         }
      })
   }

   const handleChartTypeChange = (field, value) => {
      setState({
         ...state,
         chart_properties: {
            ...state.chart_properties,
            [field]: value,
            chart_display_fields: []
         }
      })
   }

   const handleChangeKeyFields = data => {
      setState({
         ...state,
         chart_properties: {
            ...state.chart_properties,
            [data[0][0]]: data[1][0],
            [data[0][1]]: data[1][1]
         }
      })
   }

   const syncTableState = (fieldName, fieldValue) => {
      setState({
         ...state,
         table_properties: {
            ...state.table_properties,
            [fieldName]: fieldValue
         }
      })
   }
   const onPrevious = () => {
      dispatch(CreateReport({ ...reportStore, current_step: 2 }))
      onPreviousHandler(2)
   }

   const updateFeild = data => {
      let a = []
      let obj = {}
      data.map((item, key) => {
         obj = {
            ...item,
            pdf_col_length: ''
         }
         a.push(obj)
      })
      return a
   }

   const [isLoading, setIsLoading] = useState({ msg: '', loading: false })

   const onNext = () => {
      let inputJson = {
         ...state,
         opr: reportStore.report_index ? '1' : '0'
      }
      if (isAutoWidthEnable) {
         inputJson = {
            ...inputJson,
            output_fields: {
               field: updateFeild(inputJson.output_fields.field)
            }
         }
      }
      setIsLoading({ ...isLoading, loading: true })
      ReportAction(inputJson)
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               snackbarState.openSnackbar(
                  `${
                     reportStore.report_index
                        ? t('bam:REPORT_UPDATE_SUCCESS')
                        : t('bam:REPORT_ADDED_SUCCESS')
                  }`,
                  'success'
               )
               dispatch(CreateReport({ ...reportStore, current_step: 0 }))
               fullDialog.closeDialog()
               setTimeout(
                  () =>
                     setIsLoading({
                        ...isLoading,
                        loading: false,
                        msg: 'Saving...'
                     }),
                  500
               )
            } else {
               snackbarState.openSnackbar(
                  `${t('bam:ERROR')}: ${res.status.description}`,
                  'error'
               )
               setTimeout(
                  () =>
                     setIsLoading({
                        ...isLoading,
                        loading: false,
                        msg: `${t('bam:LOADING')}...`
                     }),
                  240
               )
            }
         })
         .catch(err => {
            console.log(err)
         })
   }

   const onCancel = () => {
      normalDialog.openDialog(
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

   const toggleExecuteRules = value => {
      setState({ ...state, execute_rules: !value })
   }

   const onSave = rules => {
      setState({ ...state, rules: rules })
      setTimeout(() => normalDialog.closeDialog(), 100)
   }

   return (
      <React.Fragment>
         {isLoading.loading ? (
            <React.Fragment>
               <div className={classes.spinnerLoad}>
                  <Spinner msg={isLoading.msg} />
               </div>
            </React.Fragment>
         ) : (
            <Paper className={classes.paper}>
               {state.isLoading === false ? (
                  <div className={classes.container}>
                     <div className={classes.tabs_toolbar}>
                        <Toolbar disableGutters={true} variant='dense'>
                           {tabsArray.map((res, key) => (
                              <div
                                 key={key}
                                 className={clsx(
                                    classes.tabs,
                                    currentTab === res.index
                                       ? classes.tabSelected
                                       : null
                                 )}
                              >
                                 <Typography
                                    align='center'
                                    className={classes.tab}
                                    value={res.index}
                                    onClick={() => handleTabChange(res.index)}
                                    variant='h5'
                                 >
                                    {res.label}
                                 </Typography>
                                 <Checkbox
                                    checked={
                                       (state.report_display_type.includes(
                                          'T'
                                       ) &&
                                          res.index === 0) ||
                                       (state.report_display_type.includes(
                                          'G'
                                       ) &&
                                          res.index === 1)
                                    }
                                    icon={
                                       <IconsButton
                                          type='CheckBoxOutlineBlankIcon'
                                          fontSize='small'
                                       />
                                    }
                                    checkedIcon={
                                       <IconsButton
                                          type='CheckBoxIcon'
                                          color='primary'
                                          fontSize='small'
                                       />
                                    }
                                    onClick={() =>
                                       handleReportDisplayChange(res.index)
                                    }
                                 />
                              </div>
                           ))}
                        </Toolbar>
                        {/* <Tabs value={configValue} className={classes.tabs} variant="standard" onChange={handleConfigurations} style={{flexGrow:1}}>
                 

                </Tabs>*/}
                        <div className={classes.additional_tools}>
                           <SelectBox
                              label={t('bam:SCHEDULER_OUTPUT_FORMAT')}
                              name='OutputFormat'
                              value={state.output_format}
                              form={false}
                              list={[
                                 { value: 'HTML', label: `${t('bam:HTML')}` },
                                 { value: 'PDF', label: `${t('bam:PDF')}` }
                              ]}
                              onChange={handleChange}
                              className={classes.outlinedSelect}
                           />

                           <Button
                              className={classes.buttonWrapper}
                              variant='outlined'
                              color='primary'
                              onClick={() => {
                                 normalDialog.openDialog(
                                    <Suspense
                                       fallback={
                                          <div
                                             style={{
                                                minHeight: '440px',
                                                minWidth: '1072px'
                                             }}
                                          >
                                             <Spinner msg='' />
                                          </div>
                                       }
                                    >
                                       <DownloadRport
                                          closeDialog={normalDialog.closeDialog}
                                          t={t}
                                       />
                                    </Suspense>,
                                    'Download'
                                 )
                              }}
                              startIcon={
                                 <IconImage
                                    className={classes.icon}
                                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/settings_icon.svg`}
                                    height={15}
                                 />
                              }
                           >
                              {t('bam:DOWNLOAD')}
                           </Button>
                           {/* <div
                              className={classes.download_button}
                              
                           >
                              <Typography variant='h4'>Download</Typography>
                              <IconButton>
                                 <img
                                    src='icons/settings_icon.svg'
                                    alt='settings'
                                 />
                              </IconButton>
                           </div> */}
                           <Button
                              color='primary'
                              variant='contained'
                              onClick={() => {
                                 normalDialog.openDialog(
                                    <Suspense
                                       fallback={
                                          <div
                                             style={{
                                                minHeight: '640px',
                                                minWidth: '1472px'
                                             }}
                                          >
                                             <Spinner msg='' />
                                          </div>
                                       }
                                    >
                                       <div
                                          style={{
                                             height: '600px',
                                             width: '1200px'
                                          }}
                                       >
                                          <RulesPopuUp
                                             t={t}
                                             onCancel={() =>
                                                normalDialog.closeDialog()
                                             }
                                             onSave={onSave}
                                             fieldList={state.field}
                                             showPreviousKey={false}
                                             execute_rules={state.execute_rules}
                                             toggleExecuteRules={
                                                toggleExecuteRules
                                             }
                                             rules={state.rules}
                                          />
                                       </div>
                                    </Suspense>,
                                    'Rules'
                                 )
                              }}
                           >
                              {t('bam:ADD_RULES')}
                           </Button>
                        </div>
                     </div>
                     {/* <div className={classes.main_container}>
                    <div className={classes.tab_container}>
                        <div className={classes.tab_header}>
                            <IconButton className={classes.refresh_button}><CachedIcon /></IconButton>
                            <StyledFormControlLable
                                control={<Select
                                    value={0}
                                    className={classes.outlinedSelect}
                                    variant="outlined"
                                >
                                    <MenuItem value={0}>1366X768</MenuItem>
                                </Select>}
                            />
                        </div>
                        {tabsArray.map((res, key) => <TabPanel value={configValue} index={res.index}>
                            <Suspense fallback={<div style={{ height: "300px" }}>
                                <Spinner msg="" />
                            </div>}><res.component /></Suspense>
                        </TabPanel>)}
                    </div>
                    <div className={classes.right_container}>
                        place all tools here
                    </div>
                </div> */}
                     <div className={classes.tab_container}>
                        {tabsArray.map((res, key) =>
                           res.index === currentTab ? (
                              <div>
                                 <Suspense
                                    fallback={
                                       <div style={{ height: '100vh' }}>
                                          <Spinner msg='' />
                                       </div>
                                    }
                                 >
                                    <res.component
                                       state={state}
                                       handleRootChange={handleRootChange}
                                       setIsAutoWidthEnable={value =>
                                          setIsAutoWidthEnable(value)
                                       }
                                       handleChange={handleChange}
                                       syncGraphState={syncGraphState}
                                       handleChartTypeChange={
                                          handleChartTypeChange
                                       }
                                       handleChangeKeyFields={
                                          handleChangeKeyFields
                                       }
                                       syncTableState={syncTableState}
                                    />
                                 </Suspense>
                              </div>
                           ) : null
                        )}
                     </div>
                  </div>
               ) : null}
            </Paper>
         )}
         <FixedFooter>
            <Grid container spacing={2} justify='flex-end'>
               <Grid item>
                  <Button color='primary' variant='outlined' onClick={onCancel}>
                     {t('bam:LABEL_CANCEL')}
                  </Button>
               </Grid>
               <Grid item>
                  <Button
                     color='secondary'
                     variant='outlined'
                     onClick={onPrevious}
                  >
                     {t('bam:BUTTON_PREVIOUS')}
                  </Button>
               </Grid>
               <Grid item>
                  <Button color='primary' variant='contained' onClick={onNext}>
                     {t('bam:BUTTON_SAVE')}
                  </Button>
               </Grid>
            </Grid>
         </FixedFooter>
      </React.Fragment>
   )
}
export default Home
