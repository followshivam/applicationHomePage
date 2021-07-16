import React, { useState, Fragment } from 'react'
import {
   Button,
   Grid,
   makeStyles,
   FixedFooter,
   Paper,
   Typography,
   RadioGroup,
   Radio,
   FormControlLabel,
   InputBox,
   Confirmation,
   Checkbox,
   withStyles,
   Spinner,
   useTranslation
} from 'component'
import { useDispatch, useSelector } from 'react-redux'
import { CreateReport } from 'redux/action'
import { ValidateQuery } from 'global/bam/api/ApiMethods'
import {
   report_input_field_structure,
   CreateUpdateReportInput
} from 'global/json'

const useStyle = makeStyles(theme => ({
   root: {
      // marginTop: 57,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      backgroundColor: 'transparent'
   },
   query_box: {
      backgroundColor: theme.palette.common.white,
      height: 390,
      padding: theme.spacing(2)
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
   },
   marginStyle: {
      margin: '10px 0'
   },
   inputBoxWidth: {
      width: '80px'
   },
   spinner: {
      height: '500px',
      width: '1380px'
   }
}))

const StyledInputBox = withStyles({
   input: {
      padding: '19px 25px',
      fontSize: '14px'
   }
})(InputBox)

const StyledFormControlLabel = withStyles(theme => ({
   label: {
      fontSize: '14px'
   }
}))(FormControlLabel)

const QueryBox = props => {
   const { store = null, t } = props
   const classes = useStyle()
   const dispatch = useDispatch()
   const [reportStore, setReportStore] = useState(store)

   const executeHandler = e => {
      setReportStore({ ...reportStore, [e.target.name]: e.target.value.trim() })
   }

   const executeHandlerQuery = e => {
      setReportStore({
         ...reportStore,
         [e.target.name]: e.target.value.trim(),
         batching_required: false
      })
   }

   const batchingHandler = e => {
      setReportStore({ ...reportStore, batching_required: e.target.checked })
   }

   return (
      <Fragment>
         <Paper className={classes.root} elevation={0}>
            <Typography
               variant='h6'
               color='textSecondary'
               className={classes.marginStyle}
            >
               <b>{t('bam:WRITE_QUERY_HERE')}</b>
            </Typography>

            <StyledInputBox
               name='complex_query'
               rows='26'
               fullWidth={true}
               multiline={true}
               minRows={26}
               maxRows={32}
               required={true}
               value={props.query}
            />
            <div style={{ display: 'flex' }} className={classes.marginStyle}>
               <Typography variant='h6' color='textSecondary'>
                  <b>{t('bam:EXECUTE_AS')} :</b>
               </Typography>
               <div
                  style={{
                     display: 'block',
                     marginTop: '-5px',
                     marginLeft: '10px'
                  }}
               >
                  <RadioGroup row name='execution_type' required>
                     <StyledFormControlLabel
                        value='Q'
                        control={
                           <Radio
                              color='primary'
                              checked={reportStore.execution_type === 'Q'}
                              onChange={executeHandlerQuery}
                           />
                        }
                        label={t('bam:QUERY')}
                     />
                     <StyledFormControlLabel
                        value='P'
                        control={
                           <Radio
                              color='primary'
                              checked={reportStore.execution_type === 'P'}
                              onChange={executeHandler}
                           />
                        }
                        label={t('bam:PROCEDURE')}
                     />
                  </RadioGroup>
                  <div style={{ display: 'flex' }}>
                     <StyledFormControlLabel
                        disabled={reportStore.execution_type === 'Q'}
                        control={
                           <Checkbox
                              color='primary'
                              disableRipple={true}
                              disableFocusRipple={true}
                              name='batching_required'
                              checked={reportStore.batching_required}
                              disabled={reportStore.execution_type === 'Q'}
                              onChange={batchingHandler}
                           />
                        }
                        label={t('bam:BATCHING')}
                        labelPlacement='end'
                        classes={{ label: classes.checkbox_label }}
                        style={{ marginTop: '-10px' }}
                     />{' '}
                     {reportStore.batching_required ? (
                        <InputBox
                           name='batch_size'
                           value={reportStore.batch_size}
                           form={false}
                           className={classes.inputBoxWidth}
                           onChange={executeHandler}
                        />
                     ) : null}
                  </div>
               </div>
            </div>
         </Paper>
      </Fragment>
   )
}

const QueryWriting = props => {
   const classes = useStyle()
   const { onPreviousHandler = null, onNextHandler = null } = props
   const [isLoading, setIsLoading] = useState({
      msg: '',
      loading: false
   })
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

   const dispatch = useDispatch()
   const onPrevious = () => {
      dialogState.openDialog(
         <Confirmation
            button_label={t('bam:YES_CHANGE_IT')}
            title={t('bam:CHANGE_INPUT_TYPE_MESSAGE')}
            description={t('bam:CHANGE_INPUT_TYPE_MESSAGE_DESCRIPTION')}
            action={() => {
               dispatch(CreateReport({ ...store, current_step: 0 }))
               onPreviousHandler(0)
            }}
         />,
         ''
      )
   }

   const [state, setState] = useState(store)
   const performValidationOfQuery = (
      inputJson,
      batching_required,
      complex_query,
      execute_type,
      // field = [],
      fieldVariables,
      keyFieldVariables
   ) => {
      if (
         !state.complex_query ||
         (state.complex_query && state.complex_query !== complex_query)
      ) {
         // setIsLoading({ ...isLoading, loading: true })
         ValidateQuery(inputJson)
            .then(res => {
               if (res != null && res.status.maincode === '0') {
                  // setTimeout(
                  //    () => setIsLoading({ ...isLoading, loading: false }),
                  //    100
                  // )
                  if (fieldVariables) {
                     const fields = fieldVariables.map(field => ({
                        ...report_input_field_structure,
                        display_name: field
                     }))

                     dispatch(
                        CreateReport({
                           ...store,
                           current_step: 2,
                           field: res.data.fields,
                           batching_required: batching_required,
                           complex_query: complex_query,
                           execution_type: execute_type,
                           output_fields: { field: [] },
                           report_input_fields: {
                              field: fields
                           },
                           proc_batching_info: {
                              key_field_info: []
                           }
                        })
                     )
                     onNextHandler(2)
                  } else if (keyFieldVariables) {
                     const keyFields = keyFieldVariables.map(field => ({
                        ...store.proc_batching_info.key_field_info,
                        key_field: field,
                        mapped_field: ''
                     }))
                     dispatch(
                        CreateReport({
                           ...store,
                           current_step: 2,
                           field: res.data.fields,
                           batching_required: batching_required,
                           complex_query: complex_query,
                           execution_type: execute_type,
                           output_fields: { field: [] },
                           proc_batching_info: {
                              key_field_info: keyFields,
                              sort_field: '',
                              sort_order: 'A'
                           },
                           report_input_fields: {
                              field: []
                           }
                        })
                     )

                     onNextHandler(2)
                  }
                  else if (keyFieldVariables && fieldVariables) {
                     const keyFields = keyFieldVariables.map(field => ({
                        key_field: field,
                        mapped_field: ''
                     }))

                     const fields = fieldVariables.map(field => ({
                        ...report_input_field_structure,
                        display_name: field
                     }))

                     dispatch(
                        CreateReport({
                           ...store,
                           current_step: 2,
                           field: res.data.fields,
                           batching_required: batching_required,
                           complex_query: complex_query,
                           output_fields: { field: [] },
                           execution_type: execute_type,
                           proc_batching_info: keyFields,
                           report_input_fields: {
                              field: fields
                           }
                        })
                     )
                     onNextHandler(2)
                  }
                  else {
                     dispatch(
                        CreateReport({
                           ...store,
                           current_step: 2,
                           field: res.data.fields,
                           batching_required: batching_required,
                           output_fields: { field: [] },
                           complex_query: complex_query,
                           execution_type: execute_type,
                           report_input_fields: {
                              field: []
                           }
                        })
                     )
                     onNextHandler(2)
                  }
               } else {
                  snackbarState.openSnackbar(
                     `${t('bam:ERROR')}: ${res.status.errormsg}`,
                     'error'
                  )
                  // setTimeout(
                  //    () => setIsLoading({ ...isLoading, loading: false }),
                  //    100
                  // )
               }
            })
            .catch(err => { })
      } else if (state.complex_query === complex_query) {
         dispatch(
            CreateReport({
               ...store,
               current_step: 2
            })
         )
         onNextHandler(2)
      } else {
         console.log('something went wrong')
      }
   }

   const checkReportVariables = complex_query => {
      let reportVariables = complex_query.match(/#\((.*?)\)#/g)
      if (reportVariables != null) {
         reportVariables = reportVariables.map(
            item => item.split('(')[1].split(')')[0]
         )
      }
      return reportVariables
   }

   const checkFieldVariables = complex_query => {
      var fieldVariables = complex_query.match(/\$\{(.*?)\}\$/g)
      if (fieldVariables != null) {
         fieldVariables = fieldVariables.map(
            item => item.split('{')[1].split('}')[0]
         )
      }
      return fieldVariables
   }

   const checkKeyField = complex_query => {
      let keyFieldVariables = complex_query.match(/\$\((.*?)\)\$/g)
      if (keyFieldVariables != null) {
         keyFieldVariables = keyFieldVariables.map(
            item => item.split('(')[1].split(')')[0]
         )
      }
      return keyFieldVariables
   }

   const onNext = e => {
      e.preventDefault()
      let complex_query = e.target.complex_query.value.trim()
      let batching_required = e.target.batching_required.checked
      let execute_type = e.target.execution_type.value
      let batch_size = e.target.batch_size ? e.target.batch_size.value : null


      if (complex_query) {
         let inputJson = {}
         if (execute_type === 'Q') {
            inputJson = { ...inputJson, flag: 2, query: complex_query }
            let fieldVariables = checkFieldVariables(complex_query)
            performValidationOfQuery(
               inputJson,
               batching_required,
               complex_query,
               execute_type,
               fieldVariables
            )
         } else if (execute_type === 'P' && batching_required === false) {
            inputJson = {
               ...inputJson,
               flag: '4',
               data_required: '',
               execution_type: 'P',
               query: complex_query,
               health_status_enabled: 'Y',
               report_gen_id: '-1',
               query_time_out: '90'
            }
            let fieldVariables = checkFieldVariables(complex_query)
            let keyFieldVariables = checkKeyField(complex_query)
            performValidationOfQuery(
               inputJson,
               batching_required,
               complex_query,
               execute_type,
               fieldVariables,
               keyFieldVariables
            )
         } else if (execute_type === 'P' && batching_required === true) {
            inputJson = {
               ...inputJson,
               flag: '4',
               data_required: '',
               execution_type: 'P',
               query: complex_query,
               health_status_enabled: 'Y',
               report_gen_id: '-1',
               query_time_out: '90'
            }
            let reportVariables = checkReportVariables(complex_query)
            let fieldVariables = checkFieldVariables(complex_query)
            let keyFieldVariables = checkKeyField(complex_query)
            if (
               reportVariables === null ||
               !reportVariables.includes('BatchingReq')
            ) {
               snackbarState.openSnackbar(
                  `${t('bam:BATCHING_PARAMETER')} #(BatchingReq)# ${t('bam:NOT_SPECIFIED')}`,
                  'warning'
               )
               return false
            } else if (
               reportVariables === null ||
               !reportVariables.includes('BatchSize')
            ) {
               snackbarState.openSnackbar(
                  `${t('bam:BATCHING_PARAMETER')} #(BatchSize)# ${t('bam:NOT_SPECIFIED')}`,
                  'warning'
               )
               return false
            } else if (
               reportVariables === null ||
               !reportVariables.includes('OrderBy')
            ) {
               snackbarState.openSnackbar(
                  `${t('bam:BATCHING_PARAMETER')} #(OrderBy)# ${t('bam:NOT_SPECIFIED')}`,
                  'warning'
               )
               return false
            } else if (
               reportVariables === null ||
               !reportVariables.includes('SortField')
            ) {
               snackbarState.openSnackbar(
                  `${t('bam:BATCHING_PARAMETER')} #(SortField)# ${t('bam:NOT_SPECIFIED')}`,
                  'warning'
               )
               return false
            } else if (
               reportVariables === null ||
               !reportVariables.includes('SortFieldValue')
            ) {
               snackbarState.openSnackbar(
                  `${t('bam:BATCHING_PARAMETER')} #(SortFieldValue)# ${t('bam:NOT_SPECIFIED')}`,
                  'warning'
               )
               return false
            } else if (
               reportVariables === null ||
               !reportVariables.includes('SortOrder')
            ) {
               snackbarState.openSnackbar(
                  `${t('bam:BATCHING_PARAMETER')} #(SortOrder)# ${t('bam:NOT_SPECIFIED')}`,
                  'warning'
               )
               return false
            } else if (!batch_size) {
               snackbarState.openSnackbar(
                  `${t('bam:SPECIFY_BATCH_SIZE')}`,
                  'warning'
               )
               return false
            } else {
               performValidationOfQuery(
                  inputJson,
                  batching_required,
                  complex_query,
                  execute_type,
                  fieldVariables,
                  keyFieldVariables
               )
            }
         }
      } else {
         snackbarState.openSnackbar(
            `${t('bam:ERROR')}: ${t('bam:REQUIRED_QUERY_FIELD')}`,
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
      <Fragment>
         {isLoading.loading ? (
            <div className={classes.spinner}>
               <Spinner />
            </div>
         ) : (
            <form onSubmit={onNext}>
               <QueryBox query={store.complex_query} store={store} t={t} />
               <FixedFooter>
                  <Grid container spacing={2} justify='flex-end'>
                     <Grid item>
                        <Button
                           variant='outlined'
                           color='primary'
                           onClick={onCancel}
                        >
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
                        <Button
                           color='primary'
                           variant='contained'
                           type='submit'
                        >
                           {t('bam:BUTTON_NEXT')}
                        </Button>
                     </Grid>
                  </Grid>
               </FixedFooter>
            </form>
         )}
      </Fragment>
   )
}
export default QueryWriting
