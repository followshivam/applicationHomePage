import React, { useState, Suspense, lazy, Fragment } from 'react'
import {
   Tabs,
   Tab,
   useTranslation,
   Grid,
   Confirmation,
   makeStyles,
   Paper,
   Button,
   FixedFooter,
   Spinner
} from 'component'
import { CreateUpdateReportInput } from 'global/json'
import { useDispatch, useSelector } from 'react-redux'
import { CreateReport } from 'redux/action'
const FieldMapping = lazy(() => import('./FieldMapping/FieldMapping'))
const OutputFields = lazy(() => import('./OutputFields/OutputFields'))
const Batching = lazy(() => import('./Batching/Batching'))
const Sorting = lazy(() => import('./Sorting/Sorting'))
const GroupBy = lazy(() => import('./GroupBy/GroupBy'))
const Filters = lazy(() => import('./Filters/Filters'))
const InputProperties = lazy(() => import('./InputProperties/input_properties'))

const tabHeight = '32px'

const TabPanel = props => {
   const classes = useStyles()
   const { children, value, index } = props

   return <Fragment>{value === index && children}</Fragment>
}

const useStyles = makeStyles(theme => ({
   root: {
      flexGrow: 1,
      margin: '10px'
   },
   paper: {
      backgroundColor: '#EFEFEF'
   },
   tabs: {
      minHeight: tabHeight,
      height: tabHeight
   },
   tab: {
      border: `1px solid ${theme.palette.borderColor}`,
      backgroundColor: theme.palette.common.white,
      color: '#000000',
      fontSize: '12px',
      minWidth: '72px',
      textTransform: 'none',
      minHeight: tabHeight,
      height: tabHeight,
      opacity: 1
   },
   tab_container: {
      flexGrow: 1,
      width: 'calc(97vw - 80)',
      backgroundColor: theme.palette.common.white,
      // padding: theme.spacing(0, 1, 0, 1),
      border: `1px solid ${theme.palette.borderColor}`,
      minHeight: '85vh'
   },
   tabSelected: {
      color: '#000000',
      backgroundColor: '#FFFFFF',
      fontWeight: 600,
      fontSize: '12px'
   },
   mainContainer: {
      // marginTop: '50px'
   }
}))

const Home = props => {
   const classes = useStyles()
   const { onPreviousHandler = null, onNextHandler = null } = props
   const [configValue, setconfigValue] = useState(0)
   const [store, dialogState, snackbarState, fullDialog, globalSetting] = useSelector(
      state => {
         return [
            state.createReportState,
            state.normalDialogState,
            state.snackbarState,
            state.fullDialogState,
            state.globalSettings
         ]
      }
   )

   const { t } = useTranslation(globalSetting.locale_module)
   const [reportStore, setReportStore] = useState(store)
   const dispatch = useDispatch()
   const handleConfigurations = (e, val) => {
      setconfigValue(val)
   }
   const changeStateHandler = data => {
      setReportStore(data)
   }
   const tabsArray =
      reportStore.report_report_query_type === 'F'
         ? [
            { label: `${t('bam:OUTPUT_FIELDS')}`, component: OutputFields, index: 0 },
            { label: `${t('bam:BATCHING')}`, component: Batching, index: 1 },
            { label: `${t('bam:SORTING')}`, component: Sorting, index: 2 },
            { label: `${t('bam:GROUP_BY')}`, component: GroupBy, index: 3 },
            { label: `${t('bam:FILTERS')}`, component: Filters, index: 4 }
         ]
         : reportStore.execution_type === 'Q' &&
            !reportStore.report_input_fields.field.length > 0
            ? [{ label: `${t('bam:OUTPUT_FIELDS')}`, component: OutputFields, index: 0 }]
            : (reportStore.execution_type === 'Q' &&
               reportStore.report_input_fields.field.length > 0) ||
               (reportStore.execution_type === 'P' &&
                  reportStore.report_input_fields.field.length > 0)
               ? [
                  {
                     label: `${t('bam:INPUT_PROPERTIES')}`,
                     component: InputProperties,
                     index: 0
                  },
                  { label: `${t('bam:OUTPUT_FIELDS')}`, component: OutputFields, index: 1 }
               ]
               : reportStore.execution_type === 'P' &&
                  reportStore.proc_batching_info.key_field_info.length > 0 &&
                  reportStore.batching_required
                  ? [
                     { label: `${t('bam:OUTPUT_FIELDS')}`, component: OutputFields, index: 0 },
                     {
                        label: `${t('bam:KEY_FIELD')}`,
                        component: FieldMapping,
                        index: 1
                     }
                  ]
                  : [{ label: `${t('bam:OUTPUT_FIELDS')}`, component: OutputFields, index: 0 }]

   // : reportStore.report_input_fields.field.length > 0 &&
   //   reportStore.execution_type === 'Q'
   // ? [
   //      {
   //         label: 'Input Properties',
   //         component: InputProperties,
   //         index: 0
   //      },
   //      { label: 'Output Field', component: OutputFields, index: 1 }
   //   ]
   // : reportStore.proc_batching_info.length > 0
   // ? [
   //      { label: 'Output Field', component: OutputFields, index: 0 },
   //      {
   //         label: 'Key Field',
   //         component: FieldMapping,
   //         index: 1
   //      }
   //   ]
   // : [
   //      { label: 'Output Field', component: OutputFields, index: 0 }
   //   ]

   const onPrevious = () => {
      dispatch(CreateReport({ ...reportStore, current_step: 1 }))
      onPreviousHandler(1)
   }
   const onNext = () => {
      if (
         !(
            reportStore &&
            reportStore.proc_batching_info &&
            reportStore.proc_batching_info?.key_field_info?.length
         ) > 0
      ) {
         dispatch(CreateReport({ ...reportStore, current_step: 3 }))
         onNextHandler(3)
      } else if (!reportStore.proc_batching_info.sort_field) {
         snackbarState.openSnackbar(
            `Error: Fill Sorting fields to continue.`,
            'error'
         )
      } else if (
         reportStore.proc_batching_info.key_field_info[0].mapped_field
      ) {
         dispatch(CreateReport({ ...reportStore, current_step: 3 }))
         onNextHandler(3)
      } else {
         snackbarState.openSnackbar(
            `Error: Fill required fields to continue.`,
            'error'
         )
      }
   }

   const onCancel = () => {
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

   return (
      <React.Fragment>
         <Paper className={classes.paper}>
            <div className={classes.mainContainer}>
               <Tabs
                  value={configValue}
                  className={classes.tabs}
                  variant='scrollable'
                  onChange={handleConfigurations}
               >
                  {tabsArray.map((res, key) => (
                     <Tab
                        label={res.label}
                        key={key}
                        classes={{
                           selected: classes.tabSelected,
                           root: classes.tab
                        }}
                     />
                  ))}
               </Tabs>
               <div className={classes.tab_container}>
                  {tabsArray.map((res, key) => (
                     <TabPanel value={configValue} index={res.index}>
                        <Suspense
                           fallback={
                              <div style={{ minHeight: '516px' }}>
                                 <Spinner msg='' />
                              </div>
                           }
                        >
                           <res.component
                              t={t}
                              action={res.action}
                              reportStore={reportStore}
                              onChangeState={changeStateHandler}
                           />
                        </Suspense>
                     </TabPanel>
                  ))}
               </div>
            </div>
         </Paper>
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
                     {t('bam:BUTTON_NEXT')}
                  </Button>
               </Grid>
            </Grid>
         </FixedFooter>
      </React.Fragment>
   )
}

export default Home
