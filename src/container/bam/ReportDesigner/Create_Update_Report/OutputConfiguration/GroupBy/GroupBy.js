import React, { useState, useEffect, lazy, Suspense } from 'react'
import {
   Paper,

   Typography,
   Grid,

   makeStyles,

} from 'component'
import { DisplayFields, DraggerComponent } from '../common'
import { FieldsInput } from 'global/json'
const useStyles = makeStyles(theme => ({
   paperLeft: {
      textAlign: 'left',
      minHeight: '620px',
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
   const { rowData, t } = props
   const classes = useStyles()

   return (
      <Paper className={classes.paperLeft} elevation={0}>
         <Grid container justify='space-between'>
            <Typography
               inline
               textAlign='left'
               className={classes.formMargin}
               variant='h5'
            >
               {t('bam:FIELDS_FROM_TABLE')}
            </Typography>
            <div></div>

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
      </Paper>
   )
}
const GroupBy = props => {
   const classes = useStyles()
   const { reportStore, onChangeState = null, t } = props
   const handleChangeTableRow = (e, res) => {
      let checkedStatus = e.target.checked
      if (checkedStatus) {
         let data = [...reportStore.report_group_by.field, res]
         let state = { ...reportStore }
         state.report_group_by.field = data
         onChangeState(state)
      } else {
         let updatedState = reportStore.report_group_by.field.filter(
            result => result.name !== res.name
         )
         let state = { ...reportStore }
         state.report_group_by.field = updatedState
         onChangeState(state)
      }
   }
   const changeListOrderHandler = list => {
      let state = { ...reportStore }
      state.report_group_by.field = list
      onChangeState(state)
   }

   const handleAlias = (e, res) => {
      const index = reportStore.field.findIndex(
         field => field.name === res.name
      )
      const sec_index = reportStore.report_group_by.field.findIndex(
         field => field.name === res.name
      )

      var sec_arr = reportStore.report_group_by.field
      sec_arr[sec_index] = {
         name: res.name,
         length: res.length,
         display_name: e.target.value.trim(),
         type: res.type
      }

      let sec_state = { ...reportStore.report_group_by }
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
               selectedData={reportStore.report_group_by.field}
               handleChangeTableRow={handleChangeTableRow}
               handleAlias={handleAlias}
               t={t}
            />
         </Grid>
         <Grid item sm={8}>
            <DraggerComponent
               selectedData={reportStore.report_group_by.field}
               changeListOrder={changeListOrderHandler}
            />
         </Grid>
      </Grid>
   )
}
export default GroupBy
