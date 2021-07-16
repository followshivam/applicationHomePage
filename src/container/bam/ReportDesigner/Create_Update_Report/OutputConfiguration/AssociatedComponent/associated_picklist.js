import React, { useState, Suspense, lazy, useEffect } from 'react'
import {
   DialogActions,
   DialogTitle,
   DialogContent,
   Typography,
   Button,
   SelectBox,
   Spinner,
   makeStyles,
   Grid,
   FormControlLabel,
   Checkbox,
   InputBox,
   withStyles,
   useTranslation
} from 'component'
import { useSelector } from 'react-redux'
import { ReportInputPropertiesJson } from 'global/json'
const FromReport = lazy(() => import('./from_report'))
const FromTable = lazy(() => import('./from_table'))
const CustomMade = lazy(() => import('./custom_made'))
const useStyles = makeStyles(theme => ({
   dialogContent: {
      width: '850px',
      height: '490px',
      '&>*': {
         marginBottom: '20px'
      }
   },
   dialog_title: {
      padding: '9px 20px'
   },
   select_box: {
      width: '459px'
   },
   select_box_spacing: {
      padding: '8px 20px 0px 20px'
   },
   inputBoxWidth: {
      width: '80px'
   },
   footer: {
      paddingLeft: '20px'
   }
}))

const StyledDialogContent = withStyles({
   root: {
      padding: '0px'
   }
})(DialogContent)


const AssociatedPicklist = props => {
   const { action_button = [], index = null, picklistInputData = {} } = props

   const [store, globalSetting] = useSelector(state => {
      return [state.createReportState, state.globalSettings]
   })

   const { t } = useTranslation(globalSetting.locale_module)

   const TypeSelection = [
      {
         id: 1,
         label: `${t('bam:FROM_TABLE')}`,
         value: 'T'
      },
      {
         id: 2,
         label: `${t('bam:CUSTOM_MADE')}`,
         value: 'C'
      },
      {
         id: 3,
         label: `${t('bam:FROM_REPORT')}`,
         value: 'R'
      }
   ]

   const [reportStore, setReportStore] = useState(store)

   // const [picklistData,setPickListData]=useState(store.report_filter_options[0].value);
   const [picklistData, setPickListData] = useState({
      field_type: 'R'
   })
   const classes = useStyles()
   const changeHandler = e => {
      setPickListData({ ...picklistData, [e.target.name]: e.target.value })
   }

   const [picklistFunctions, setPicklistFunctions] = useState(picklistInputData)
   useEffect(() => {
      setPicklistFunctions(picklistInputData)
   }, [picklistInputData])

   const handleCheckBox = e => {
      if (e.target.name === 'batch') {
         setPicklistFunctions({
            ...picklistFunctions,
            batching: e.target.checked
         })
      } else if (e.target.name === 'search') {
         setPicklistFunctions({
            ...picklistFunctions,
            show_filter: e.target.checked
         })
      }
   }

   const handleFormFields = e => {
      if (e.target.name === 'picklist_height') {
         setPicklistFunctions({
            ...picklistFunctions,
            picklist_height: e.target.value.trim()
         })
      } else {
         setPicklistFunctions({
            ...picklistFunctions,
            picklist_width: e.target.value.trim()
         })
      }
   }

   const fields = picklistFunctions && picklistFunctions


   return (
      <React.Fragment>
         <DialogTitle classes={{ root: classes.dialog_title }}>
            <Typography variant='h6'>
               <strong>{t('bam:ASSOCIATED_PICKLIST_COLUMN')}</strong>
            </Typography>
         </DialogTitle>
         <StyledDialogContent dividers>
            <div className={classes.dialogContent}>
               <div className={classes.select_box_spacing}>
                  <SelectBox
                     type='custom'
                     label={t('bam:SELECT_TYPE')}
                     className={classes.select_box}
                     value={picklistData.field_type}
                     name='field_type'
                     onChangeHandler={changeHandler}
                  >
                     {TypeSelection.map((res, key) => (
                        <option key={key} value={res.value}>
                           {res.label}
                        </option>
                     ))}
                  </SelectBox>
               </div>
               {picklistData.field_type == 'T' && (
                  <Suspense fallback={<Spinner />}>
                     <FromTable />
                  </Suspense>
               )}
               {picklistData.field_type == 'R' && (
                  <Suspense fallback={<Spinner />}>
                     <FromReport
                        t={t}
                        setPicklistFunctions={setPicklistFunctions}
                        picklistFunctions={picklistFunctions}
                        currentData={props.currentData}
                        fromFilter={props.fromFilter}
                     />
                  </Suspense>
               )}
               {picklistData.field_type == 'C' && (
                  <Suspense fallback={<Spinner />}>
                     <CustomMade />
                  </Suspense>
               )}

               {/* footer -------- */}
               <div className={classes.footer}>
                  <Grid container justify='flex-start' alignItems='center'>
                     <FormControlLabel
                        value='add_search_func'
                        control={
                           <Checkbox
                              name='search'
                              color='primary'
                              disableRipple={true}
                              disableFocusRipple={true}
                              onChange={handleCheckBox}
                              checked={picklistFunctions.show_filter}
                           />
                        }
                        label='Add Search Functionality'
                        labelPlacement='end'
                        classes={{ label: classes.checkbox_label }}
                     />
                     <FormControlLabel
                        value='batching'
                        control={
                           <Checkbox
                              name='batch'
                              color='primary'
                              disableRipple={true}
                              disableFocusRipple={true}
                              onChange={handleCheckBox}
                              checked={picklistFunctions.batching}
                           />
                        }
                        label={t('bam:BATCHING')}
                        labelPlacement='end'
                        classes={{ label: classes.checkbox_label }}
                     />
                     {picklistFunctions.batching ? (
                        <InputBox
                           className={classes.inputBoxWidth}
                           name='batching_value'
                        // onChange={handleFormFields}
                        />
                     ) : null}
                  </Grid>
                  <div style={{ display: 'flex' }}>
                     <InputBox
                        label={t('bam:PICKLIST_HEIGHT')}
                        form
                        name='picklist_height'
                        fullWidth={true}
                        value={fields && fields.picklist_height}
                        className={classes.inputBoxWidth}
                        onChange={handleFormFields}
                     />
                     <div style={{ marginLeft: '20px' }}>
                        <InputBox
                           label={t('bam:PICKLIST_WIDTH')}
                           form
                           name='picklist_width'
                           value={fields && fields.picklist_width}
                           fullWidth={true}
                           className={classes.inputBoxWidth}
                           onChange={handleFormFields}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </StyledDialogContent>
         <DialogActions>
            {action_button.map((res, key) => {
               return (
                  <Button
                     key={key}
                     variant={res.variant}
                     color={res.color}
                     onClick={() => res.action(props.index, picklistFunctions)}
                     type={res.type}
                  >
                     {res.label}
                  </Button>
               )
            })}
            {/* <Button
                     
                     variant='outlined'
                     color='primary'
                     onClick={() => res.action(props.index, picklistFunctions)}
                     type={res.type}
                  >
                     {res.label}
                  </Button><Button
                     key={key}
                     variant={res.variant}
                     color={res.color}
                     onClick={() => res.action(props.index, picklistFunctions)}
                     type={res.type}
                  >
                     {res.label}
                  </Button> */}
         </DialogActions>{' '}
      </React.Fragment>
   )
}
export default AssociatedPicklist
