import React, { useState, useEffect, lazy, Suspense } from 'react'
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
   },
   // toolbar: {
   //    '& > *': {
   //       // marginRight:theme.spacing(15),
   //       marginLeft: theme.spacing(10)
   //    }
   // },
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
const Sorting = props => {
   const classes = useStyles()
   const { reportStore, onChangeState = null, t } = props
   const handleChangeTableRow = (e, res) => {
      let checkedStatus = e.target.checked
      if (checkedStatus) {
         let data = [...reportStore.report_sort_on.field, res]
         let state = { ...reportStore }
         state.report_sort_on.field = data
         onChangeState(state)
      } else {
         let updatedState = reportStore.report_sort_on.field.filter(
            result => result.name !== res.name
         )
         let state = { ...reportStore }
         state.report_sort_on.field = updatedState
         onChangeState(state)
      }
   }
   const changeListOrderHandler = list => {
      let state = { ...reportStore }
      state.report_sort_on.field = list
      onChangeState(state)
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
               selectedData={reportStore.report_sort_on.field}
               handleChangeTableRow={handleChangeTableRow}
               handleAlias={handleAlias}
               t={t}
            />
         </Grid>
         <Grid item sm={8}>
            <DraggerComponent
               selectedData={reportStore.report_sort_on.field}
               changeListOrder={changeListOrderHandler}
            />
         </Grid>
      </Grid>
   )
}
export default Sorting
