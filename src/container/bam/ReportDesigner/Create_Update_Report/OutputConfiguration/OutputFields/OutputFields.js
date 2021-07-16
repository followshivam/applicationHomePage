import React, { useState, useEffect, lazy, Suspense } from 'react'
import {
   Paper,
   Checkbox,
   CustomDialog,
   Typography,
   Grid,
   Button,
   Table,
   TableBody,
   TableCell,
   TableRow,
   TableHead,
   TableContainer,
   makeStyles,
   IconsButton,
   Toolbar,
   withStyles,
   InputBox,
   Spinner,
   FormControlLabel
} from 'component'

import { DisplayFields, DraggerComponent } from '../common'
// import { FieldsInput } from 'global/json'
import { useSelector } from 'react-redux'
const CalculatedFieldDialog = lazy(() => import('./FieldEditor'))
const useStyles = makeStyles(theme => ({
   paperLeft: {
      textAlign: 'left',
      minHeight: '620px',
      // height: '100%',
      paddingLeft: '20px',
      marginTop: theme.spacing(1.5)
   },
   dragger_toolbar: {
      '& > *': {
         marginRight: theme.spacing(10)
         //  marginLeft:theme.spacing(10)
      }
   },
   formMargin: {
      marginTop: '8px'
   }
}))

const LeftContainer = props => {
   const classes = useStyles()
   const { distinctRecord = false, onChangeDistinct = null, displayData = [], t } = props
   const [createReportState, dialogState] = useSelector(state => {
      return [state.createReportState, state.normalDialogState]
   })



   return (
      <Paper className={classes.paperLeft} elevation={0}>
         <Grid container justify='space-between' style={{ width: '94%' }}>
            <Typography
               inline
               textAlign='left'
               className={classes.formMargin}
               variant='h5'
            >
               {t('bam:FIELDS_FROM_TABLE')}
            </Typography>
            {
               createReportState.report_report_query_type === "F" &&
               <Typography
                  textAlign='right'
                  inline
                  variant='subtitle1'
                  color='primary'
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                     dialogState.openDialog(
                        <Suspense
                           fallback={
                              <div style={{ height: '450px', minWidth: '600px' }}>
                                 <Spinner msg='' />
                              </div>
                           }
                        >
                           <CalculatedFieldDialog displayData={displayData} t={t} />
                        </Suspense>,
                        'Calculated Field Editor'
                     )
                  }
               >
                  {t('bam:CALCULATED_FIELD')}
               </Typography>
            }
         </Grid>
         <Grid container justify='space-between'>
            <Typography
               inline
               textAlign='left'
               color='textSecondary'
               variant='subtitle1'
               style={{ marginTop: '4px', marginBottom: '12px' }}
            >
               {t('bam:SELECT_FIELD_FOR_OUTPUT')}
            </Typography>
            <div></div>
            {/* <Typography
               textAlign='right'
               inline
               variant='subtitle1'
               color='primary'
            >
               Invert
            </Typography> */}
         </Grid>
         {/* <Typography textAlign='left' variant='subtitle1'>
            <Checkbox
               size='small'
               onChange={onChangeDistinct}
               color='primary'
               disableRipple={true}
               disableFocusRipple={true}
               style={{ marginLeft: '-10px' }}
               checked={distinctRecord}
            />
            Select the Only Distinct Records
         </Typography> */}
         <DisplayFields t={t} {...props} />
      </Paper>
   )
}

const OutputFields = props => {
   const classes = useStyles()
   const { reportStore, onChangeState = null, t } = props;
   const createReportState = useSelector(state => {
      return state.createReportState
   })

   const updateFeild = (data) => {
      let a = []; let obj = {}
      data.map((item, key) => {
         obj = {
            min_char_length: "",
            pdf_col_length: "",
            show_total: false,
            ...item,
         }
         a.push(obj)
      })
      return a;
   }

   const handleChangeTableRow = (e, res) => {
      let checkedStatus = e.target.checked
      if (checkedStatus) {
         let data = [...reportStore.output_fields.field, res]
         let state = { ...reportStore }
         state['output_fields']['field'] = updateFeild(data)
         onChangeState(state)
      } else {
         let updatedState = reportStore.output_fields.field.filter(
            result => result.name !== res.name
         )
         let state = { ...reportStore }
         state['output_fields']['field'] = updatedState
         onChangeState(state)
      }
   }
   const changeListOrderHandler = list => {
      let state = { ...reportStore }
      state['output_fields']['field'] = list
      onChangeState(state)
   }
   const distinctRecordHandler = e => {
      onChangeState({ ...reportStore, distinct: e.target.checked })
   }

   const handleAlias = (e, res) => {
      const index = reportStore.field.findIndex(
         field => field.name === res.name
      )
      const sec_index = reportStore.output_fields.field.findIndex(
         field => field.name === res.name
      )

      var sec_arr = reportStore.output_fields.field
      sec_arr[sec_index] = {
         name: res.name,
         length: res.length,
         display_name: e.target.value.trim(),
         type: res.type
      }

      let sec_state = { ...reportStore.output_fields }
      sec_state.field = sec_arr
      onChangeState(sec_state)

      var arr = reportStore.field
      arr[index] = {
         ...res,
         display_name: e.target.value.trim(),
      }
      let state = { ...reportStore }
      state.field = arr
      onChangeState(state)
   }

   const onDeleteHandler = (res) => {
      let updatedField = reportStore.field.filter((item) => item.name !== res.name)
      let updatedOutputField = reportStore.output_fields.field.filter((item) => item.name !== res.name)
      onChangeState({ ...reportStore, field: updatedField, output_fields: { field: updatedOutputField } })
      // dispatch(CreateReport({ ...createReportState, field: updatedField }));
   }

   return (
      <Grid container spacing={0}>
         <Grid item sm={4}>
            <LeftContainer
               t={t}
               distinctRecord={reportStore.distinct}
               onChangeDistinct={distinctRecordHandler}
               displayData={reportStore.field}
               selectedData={reportStore.output_fields.field}
               handleChangeTableRow={handleChangeTableRow}
               handleAlias={handleAlias}
               onDeleteHandler={onDeleteHandler}
            />
         </Grid>
         <Grid item sm={8}>
            <DraggerComponent
               selectedData={reportStore.output_fields.field}
               changeListOrder={changeListOrderHandler}
            />
         </Grid>
      </Grid>
   )
}

export default OutputFields
