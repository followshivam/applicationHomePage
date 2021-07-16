import React, { useState, useEffect } from 'react'
import {
   Paper,
   Checkbox,
   Input,
   Typography,
   Grid,
   FormControlLabel,
   Table,
   TableBody,
   TableCell,
   TableRow,
   TableHead,
   TableContainer,
   makeStyles,
   IconsButton,
   Toolbar,
   InputBox
} from 'component'
import { DisplayFields, DraggerComponent } from '../common'
import { FieldsInput } from 'global/json'
const useStyles = makeStyles(theme => ({
   paperLeft: {
      textAlign: 'left',
      minHeight: '620px',
      paddingLeft: '20px',
      marginTop: theme.spacing(1.5)
      // paddingRight: '10px'
   },
   dragger_toolbar: {
      '& > *': {
         marginRight: theme.spacing(10)
         //  marginLeft:theme.spacing(10)
      }
   },
   inputBatching: {
      width: '50px',
      height: '22px',
      border: `1.5px solid ${theme.palette.borderColor}`,
      marginLeft: '8px'
   },
   formMargin: {
      marginTop: '8px'
   },
   checkbox_label: {
      fontSize: theme.typography.h5.fontSize,
      fontWeight: '600',
   },
}))

const LeftContainer = props => {
   const {
      selectedData,
      enableBatching = null,
      setBatchSize = null,
      batchSize = 0,
      batchingRequired = true,
      t
   } = props
   const classes = useStyles()

   return (
      <Paper className={classes.paperLeft} elevation={0}>
         <FormControlLabel
            value='batching'
            noWrap={true}
            control={
               <Checkbox
                  color='primary'
                  disableRipple={true}
                  disableFocusRipple={true}
                  onChange={enableBatching}
                  checked={batchingRequired}
               />
            }
            label={t('bam:ENABLE_BATCHING')}
            labelPlacement='end'
            classes={{ label: classes.checkbox_label }}
         />
         {batchingRequired ? (
            <React.Fragment>
               <Grid container className={classes.formMargin}>
                  <Typography inline textAlign='left' variant='h6' >
                     <b>{t('bam:BATCH_SIZE')}</b>
                  </Typography>
                  <Input
                     type='number'
                     value={batchSize}
                     disableUnderline={true}
                     className={classes.inputBatching}
                     autoFocus={true}
                     onChange={setBatchSize}
                  />
               </Grid>
               <Grid container className={classes.formMargin}>
                  <Typography inline textAlign='left' variant='h5' className={classes.formMargin}>
                     <b>{t('bam:FIELDS_FROM_TABLE')}</b>
                  </Typography>
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
               <DisplayFields t={t} {...props} />
            </React.Fragment>
         ) : null}
      </Paper>
   )
}

const Batching = props => {
   const classes = useStyles()
   const { reportStore, onChangeState = null, t } = props
   const handleChangeTableRow = (e, res) => {
      let checkedStatus = e.target.checked
      if (checkedStatus) {
         let data = [...reportStore.batch_key_fields.field, res]
         let state = { ...reportStore }
         state.batch_key_fields.field = data
         onChangeState(state)
      } else {
         let updatedState = reportStore.batch_key_fields.field.filter(
            result => result.name !== res.name
         )
         let state = { ...reportStore }
         state.batch_key_fields.field = updatedState
         onChangeState(state)
      }
   }
   const changeListOrderHandler = list => {
      let state = { ...reportStore }
      state.batch_key_fields.field = list
      onChangeState(state)
   }
   const enableBatchingHandler = e => {
      if (!e.target.checked) {
         onChangeState({ ...reportStore, batch_key_fields: [], batch_size: 0 })
      }
      onChangeState({ ...reportStore, batching_required: e.target.checked })
   }
   const setBatchSizeHandler = e => {
      onChangeState({ ...reportStore, batch_size: e.target.value.trim() })
   }

   const handleAlias = (e, res) => {
      const index = reportStore.field.findIndex(
         field => field.name === res.name
      )
      const sec_index = reportStore.batch_key_fields.field.findIndex(
         field => field.name === res.name
      )

      var sec_arr = reportStore.batch_key_fields.field
      sec_arr[sec_index] = {
         name: res.name,
         length: res.length,
         display_name: e.target.value.trim(),
         type: res.type
      }

      let sec_state = { ...reportStore.batch_key_fields }
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

   return (
      <Grid container spacing={0}>
         <Grid item sm={4}>
            <LeftContainer
               displayData={reportStore.field}
               batchSize={reportStore.batch_size}
               batchingRequired={reportStore.batching_required}
               setBatchSize={setBatchSizeHandler}
               enableBatching={enableBatchingHandler}
               selectedData={reportStore.batch_key_fields.field}
               handleChangeTableRow={handleChangeTableRow}
               handleAlias={handleAlias}
               t={t}
            />
         </Grid>
         <Grid item sm={8}>
            <DraggerComponent
               selectedData={reportStore.batch_key_fields.field}
               changeListOrder={changeListOrderHandler}
            />
         </Grid>
      </Grid>
   )
}

export default Batching
