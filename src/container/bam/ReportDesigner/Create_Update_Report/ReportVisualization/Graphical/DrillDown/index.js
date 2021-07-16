import React, { useState, Suspense, Fragment } from 'react'
import {
   makeStyles,
   SelectBox,
   Button,
   Grid,
   IconsButton,
   Spinner,
   Divider,
   Popover,
   Typography,
   Paper,
   MenuItem,
   DialogActions,
   InputBox,
   ColorPicker,
   NotFound
} from 'component'

import SelectAddReport from './selece_add_report'
import { useSelector } from 'react-redux'

const useStyles = makeStyles(theme => ({
   root: {
      padding: theme.spacing(1)
   },
   drillDownPaper: {
      minHeight: '195px',
      maxHeight: '195px',
      overflowY: 'scroll',
      padding: theme.spacing(2),
      border: `1px solid ${theme.palette.borderColor}`,
      borderRadius: '5px'
   },
   marginTopStyle: {
      marginTop: theme.spacing(1)
   },
   link_root: {
      // height: '100px',
      padding: theme.spacing(1, 2)
      // width: '350px'
   }
}))

const PasteLink = props => {
   const { t } = props
   const classes = useStyles()
   const [field, setField] = useState('')
   const store = useSelector(state => {
      return state.createReportState
   })

   const [reportStore, setReportStore] = useState(store)

   const submitHandler = e => {
      e.preventDefault()
      const index = reportStore.field.findIndex(el => el.name === props.field)

      reportStore.field[index] = {
         ...reportStore.field[index],
         name: props.field,
         display_name: props.field,
         target_report_index: field,
         target_report_name: field,
         link_flag: true,
         target_type: 'E',
         open_in_new_window: false,
         target_report_inputs: '',
         field_type: '',
         min_char_length: '',
         pdf_col_length: '',
         show_total: false,
         hidden_flag: false,
         sort_flag: false,
         sort_order: ''
      }
      let data = reportStore.field
      let state = { ...reportStore }
      state.field = data

      setReportStore(state)
      props.normalDialog.closeDialog()
   }

   const onChangeHandler = e => {
      setField(e.target.value)
   }

   return (
      <div className={classes.link_root}>
         <Typography variant='h6'>
            <b>{t('bam:PATE_EXETRENAL_LINK')}</b>
         </Typography>
         <form onSubmit={submitHandler}>
            <div className={classes.marginTopStyle}>
               <InputBox
                  form={false}
                  onChangeHandler={onChangeHandler}
                  value={field}
                  label={`${t('bam:TARGET_INPUT')} `}
                  style={{ width: '280px' }}
                  labelMaxWidth='45px'
                  labelMinWidth='45px'
               />
            </div>
            <DialogActions className={classes.marginTopStyle}>
               <Button
                  variant='outlined'
                  onClick={() => props.normalDialog.closeDialog()}
               >
                  {' '}
                  {t('bam:LABEL_CANCEL')}
               </Button>
               <Button variant='contained' color='primary' type='submit'>
                  {t('bam:ADD')}
               </Button>
            </DialogActions>
         </form>
      </div>
   )
}

const DrillDown = props => {
   const { t } = props

   const classes = useStyles()
   const [anchorEl, setAnchorEl] = useState(null)
   const [store, normalDialog] = useSelector(state => {
      return [state.createReportState, state.normalDialogState]
   })

   const [reportStore, setReportStore] = useState(store)
   const handleClick = event => {
      setAnchorEl(event.currentTarget)
   }

   const handleClose = () => {
      setAnchorEl(null)
   }

   const open = Boolean(anchorEl)
   const id = open ? 'simple-popover' : undefined

   const fieldsData = reportStore.field.filter(
      res => !res.hasOwnProperty(res.link_flag)
   )
   var fieldsDataArray = []
   var len = fieldsData.length
   for (var i = 0; i < len; i++) {
      fieldsDataArray.push({
         value: fieldsData[i].name,
         label: fieldsData[i].name
      })
   }
   const [fieldsArray, setFieldsArray] = useState([])
   const fieldValueChange = (e, res) => {
      let data = [...fieldsArray]
      data.find(v => v.id === res.id).selectedField = true
      data.find(v => v.id === res.id).field = e.target.value
      setFieldsArray(data)

      // const index = reportStore.field.findIndex(
      //    el => el.name === e.target.value
      // )
      // reportStore.field[index] = {
      //    name: e.target.value,
      //    display_name: e.target.value,
      //    target_report_index: '',
      //    target_report_name: '',
      //    target_type: '',
      //    open_in_new_window: '',
      //    target_report_inputs: ''
      // }
      // console.log(reportStore.field)
   }

   const handleToggleTarget = res => {
      normalDialog.openDialog(
         <PasteLink normalDialog={normalDialog} field={res.field} t={t} />
      )
      setAnchorEl(null)
   }

   const handleToggleReport = res => {
      normalDialog.openDialog(
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
            <SelectAddReport normalDialog={normalDialog} field={res.field} t={t} />
         </Suspense>,
         'SelectAddReport'
      )
      setAnchorEl(null)
   }

   const handleFieldsArray = () => {
      let data = {
         id: new Date().getTime(),
         selectedField: false
      }
      setFieldsArray([...fieldsArray, data])
   }

   const drill_down_fields = reportStore.field.filter(res => res.link_flag)
   console.log(drill_down_fields)
   return (
      <div className={classes.root}>
         <Grid container direction='row' justify='space-between' wrap='nowrap'>
            <Grid item>
               <Typography vairant='h6'>{t('bam:DRILLDOWN_TREE')}:</Typography>
            </Grid>
            <Grid item>
               {fieldsArray.length < reportStore.field.length ? (
                  <IconsButton
                     type='Add'
                     color='primary'
                     onClick={handleFieldsArray}
                  />
               ) : null}
            </Grid>
         </Grid>

         <Paper className={classes.drillDownPaper} elevation={0}>
            {fieldsArray.length > 0 ? (
               fieldsArray.map((res, key) => (
                  <Grid
                     key={key}
                     container
                     direction='row'
                     justify='flex-start'
                     spacing={2}
                     wrap='nowrap'
                  >
                     <Grid item>
                        <SelectBox
                           onChange={e => fieldValueChange(e, res)}
                           style={{ width: '200px' }}
                           list={fieldsDataArray}
                           injectLiveValue={true}
                           value={res.field}
                        />
                     </Grid>
                     <Grid item>
                        {res.selectedField ? (
                           <Button
                              style={{ marginTop: '-2px' }}
                              variant='outlined'
                              disableRipple
                              onClick={handleClick}
                           >
                              <IconsButton type='Add' />
                           </Button>
                        ) : null}
                        <Popover
                           id={id}
                           open={open}
                           anchorEl={anchorEl}
                           onClose={handleClose}
                           anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'center'
                           }}
                           transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right'
                           }}
                        >
                           {/* <MenuItem onClick={handleClose}>
                           <Typography variant='h6'>Existing Fields</Typography>
                        </MenuItem>
                        <Divider /> */}
                           <MenuItem onClick={() => handleToggleReport(res)}>
                              <Typography variant='subtitle1'>
                                 {t('bam:REPORT')}
                              </Typography>
                           </MenuItem>
                           <Divider />
                           <MenuItem onClick={() => handleToggleTarget(res)}>
                              <Typography variant='subtitle1'>
                                 {t('bam:TARGET_INPUT')}
                              </Typography>
                           </MenuItem>
                        </Popover>
                     </Grid>
                  </Grid>
               ))
            ) : (
               <div style={{ marginTop: '30px' }}>
                  <NotFound iconSize={60} messageFontSize='12px' message={t('bam:NOT_FOUND_MESSAGE')} />
               </div>
            )}
         </Paper>
         {/* <Typography vairant='h6' className={classes.marginTopStyle}>
            Highlighted Text Format:
         </Typography>
         <div style={{ display: 'flex' }} className={classes.marginTopStyle}>
            <Typography variant='subtitle1'>Font Size</Typography>
            <InputBox />
         </div>
         <div style={{ display: 'flex' }} className={classes.marginTopStyle}>
            <Typography variant='subtitle1'>Font Color</Typography>
            <ColorPicker
               displayColorCode={true}
               color={'#ffff'}
               itemIndex='TableBorderColor'
               colorChanger={handleColorChange}
            />
         </div> */}
      </div>
   )
}

export default DrillDown
