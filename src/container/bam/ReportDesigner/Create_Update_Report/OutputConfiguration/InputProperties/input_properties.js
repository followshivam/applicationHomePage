import React, { useState, Fragment, Suspense, lazy } from 'react'
import {
   SelectBox,
   Table,
   TableBody,
   TableCell,
   TableRow,
   TableHead,
   TableContainer,
   FormControlLabel,
   Checkbox,
   Spinner,
   InputBox,
   makeStyles,
   withStyles,
   Typography,
   AssociatedPickList
} from 'component'
import { useSelector } from 'react-redux'
const PopOverAdvancedMenu = lazy(() => import('../Filters/PopoverAdvancedMenu'))
const AssociatedDialog = lazy(() =>
   import('../AssociatedComponent/associated_picklist')
)

const useStyles = makeStyles(theme => ({
   title: {
      padding: '20px 0px 5px 20px'
   },
   table: {
      padding: '0px 10px'
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
   },
   tableCellStyle: {
      padding: '11px 10px 0px 10px',
      verticalAlign: 'top',
      borderBottom: 'none'
      // minWidth: '120px'
   },
   widthStyle: {
      width: '95%',
      textAlign: 'left'
   },
   advancedOption: {
      color: '#0072C6',
      cursor: 'pointer'
   },
   buttonWrapper: {
      marginRight: '5px',
      marginTop: '5px',
      padding: '1px 5px'
   }
}))

const StyledTableCell = withStyles(theme => ({
   root: {
      borderBottom: '1px solid #C4C4C4'
   },
   sizeSmall: {
      padding: '6px 24px 6px 10px',
      color: '#767676'
   }
}))(TableCell)

const StyledFormControlLabel = withStyles(theme => ({
   labelPlacementStart: {
      width: 'inherit',
      marginTop: '-5px'
   }
}))(FormControlLabel)

const InputProperties = props => {
   const classes = useStyles()
   const { reportStore, onChangeState = null, t } = props
   const [normalDialog, store] = useSelector(state => {
      return [state.normalDialogState, state.createReportState]
   })

   // const [reportStore, onChangeState] = useState(store)

   // const addHandler = () => {
   //    let data = [
   //       ...reportStore.report_input_fields.field,
   //       ReportInputPropertiesJson
   //    ]
   //    let state = { ...reportStore }
   //    state['report_input_fields']['field'] = data
   //    onChangeState(state)
   // }

   const getFormValue = (e, key, res) => {
      let currentIndex = [...reportStore.report_input_fields.field]
      currentIndex[key] = {
         ...currentIndex[key],
         [e.target.name]: e.target.value
      }
      let state = { ...reportStore }
      state['report_input_fields']['field'] = currentIndex
      onChangeState(state)
   }



   const handleAddAction = (index, data) => {
      let currentIndex = [...reportStore.report_input_fields.field]
      currentIndex[index] = {
         ...currentIndex[index],
         custom_picklist_def: data
      }
      let state = { ...reportStore }
      state['report_input_fields']['field'] = currentIndex
      onChangeState(state)
      normalDialog.closeDialog()
   }

   const dataFlagHandle = (e, key) => {
      let currentIndex = [...reportStore.report_input_fields.field]
      if (e.target.checked) {
         if (e.target.name == 'hidden_flag') {
            currentIndex[key] = {
               ...currentIndex[key],
               hidden_flag: true,
               custom_picklist_flag: false
            }
         } else {
            currentIndex[key] = {
               ...currentIndex[key],
               custom_picklist_flag: true,
               hidden_flag: false
            }
         }
      } else {
         if (e.target.name == 'hidden_flag') {
            currentIndex[key] = {
               ...currentIndex[key],
               hidden_flag: false
            }
         } else {
            currentIndex[key] = {
               ...currentIndex[key],
               custom_picklist_flag: false
            }
         }
      }
      let state = { ...reportStore }
      state['report_input_fields']['field'] = currentIndex
      onChangeState(state)
   }


   // const [deleteItem, setDeleteItem] = useState([])

   // const handleSelectedRow = (e, res) => {
   //    if (e.target.checked && !deleteItem.includes(res.id)) {
   //       setDeleteItem([...deleteItem, res.id])
   //    } else {
   //       setDeleteItem(deleteItem.filter(el => el != res.id))
   //    }
   // }

   // const handleDeleteRows = () => {
   //    let valuesArr = reportStore.report_input_fields.field.filter(res => {
   //       return deleteItem.indexOf(res.id) == -1
   //    })
   //    let state = { ...reportStore }
   //    state['report_input_fields']['field'] = valuesArr
   //    onChangeState(state)
   //    setDeleteItem([])
   // }

   const handleDialogClose = () => {
      normalDialog.closeDialog()
   }

   const handleAdvancedOptionData = (data, key) => {
      let currentIndex = [...reportStore.report_input_fields.field]
      currentIndex[key] = data
      onChangeState({ ...reportStore, report_input_fields: { ...reportStore.report_input_fields, field: currentIndex } })
      normalDialog.closeDialog()
   }

   return (
      <Fragment>
         <div className={classes.title}>
            <Typography variant='h5'>{t('bam:INPUT_FIELD_PROPERTIES')}</Typography>
         </div>
         {/* <div>
               <Button
                  variant='outlined'
                  className={classes.buttonWrapper}
                  onClick={addHandler}
                  color='primary'
                  startIcon={
                     <IconImage
                        className={classes.icon}
                        url={'icons/plus_blue.svg'}
                        height={10}
                     />
                  }
               >
                  {' '}
                  Add Input Field
               </Button>
               <Button
                  disabled={deleteItem.length < 1}
                  className={classes.buttonWrapper}
                  variant='outlined'
                  onClick={handleDeleteRows}
                  color='primary'
                  startIcon={
                     <IconsButton
                        type='DeleteIcon'
                        color='primary'
                        disabled={deleteItem.length < 1}
                     />
                  }
               >
                  Delete
               </Button>
            </div> */}

         <TableContainer className={classes.table}>
            <Table>
               <TableHead>
                  <TableRow>
                     <StyledTableCell>{t('bam:LABEL_FIELDS')}</StyledTableCell>
                     <StyledTableCell>{t('bam:STR_ALIAS')} </StyledTableCell>
                     <StyledTableCell align='left'>{t('bam:PROPERTIES')}</StyledTableCell>
                     <StyledTableCell align='left'>
                        {t('bam:ASSOCIATED_PICKLIST_COLUMN')}
                     </StyledTableCell>
                     <StyledTableCell align='left'>{t('bam:INPUT_FIELD_TYPE')}</StyledTableCell>
                     <StyledTableCell align='left'>
                        {t('bam:DEFAULT_VALUE')}
                     </StyledTableCell>
                     <StyledTableCell> </StyledTableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {reportStore.report_input_fields.field.map((res, key) => {
                     return (
                        <TableRow key={key}>
                           {/* <TableCell
                              align='left'
                              width='2%'
                              className={classes.tableCellStyle}
                           >
                              <Checkbox
                                 size='small'
                                 color='primary'
                                 disableRipple={true}
                                 disableFocusRipple={true}
                                 onChange={e => handleSelectedRow(e, res, key)}
                                 style={{ marginTop: '-7px' }}
                              />
                           </TableCell> */}
                           <TableCell
                              width='21%'
                              className={classes.tableCellStyle}
                           >
                              {/* <SelectBox
                                 name='display_name'
                                 type='custom'
                                 className={classes.widthStyle}
                                 onChangeHandler={e =>
                                    getFormValue(e, key, res)
                                 }
                              >
                                 {reportStore.field.map((result, key) => (
                                    <option key={key} value={result}>
                                       {result.display_name}
                                    </option>
                                 ))}
                              </SelectBox> */}

                              <InputBox
                                 disabled={true}
                                 value={res.display_name}
                                 className={classes.widthStyle}
                                 name='display_name'
                              />
                           </TableCell>
                           <TableCell
                              width='20%'
                              className={classes.tableCellStyle}
                           >
                              <InputBox
                                 name='name'
                                 // form={false}
                                 // label='Alias'
                                 // labelMaxWidth='35px'
                                 // labelMinWidth='35px'
                                 style={{ width: '222px' }}
                                 value={res.name}
                                 onChangeHandler={e =>
                                    getFormValue(e, key, res)
                                 }
                              />
                           </TableCell>
                           <TableCell
                              align='left'
                              width='17%'
                              className={classes.tableCellStyle}
                           >
                              <div style={{ display: 'flex' }}>
                                 <StyledFormControlLabel
                                    value='hidden'
                                    control={
                                       <Checkbox
                                          name='hidden_flag'
                                          color='primary'
                                          disableRipple={true}
                                          disableFocusRipple={true}
                                          checked={res.hidden_flag}
                                          onChange={e => dataFlagHandle(e, key)}
                                       />
                                    }
                                    label={t('bam:LABEL_HIDDEN')}
                                    labelPlacement='start'
                                    classes={{
                                       label: classes.checkbox_label
                                    }}
                                 />
                                 <StyledFormControlLabel
                                    value='custom_picklist'
                                    control={
                                       <Checkbox
                                          name='custom_picklist_flag'
                                          color='primary'
                                          disableRipple={true}
                                          disableFocusRipple={true}
                                          checked={res.custom_picklist_flag}
                                          onChange={e => dataFlagHandle(e, key)}
                                       />
                                    }
                                    label={t('bam:CUSTOM_PICKLIST')}
                                    labelPlacement='start'
                                    classes={{
                                       label: classes.checkbox_label
                                    }}
                                 />
                              </div>
                           </TableCell>
                           <TableCell
                              align='left'
                              width='13%'
                              className={classes.tableCellStyle}
                           >
                              <AssociatedPickList
                                 style={{ width: '136px' }}
                                 disabled={!res.custom_picklist_flag}
                                 action={() =>
                                    normalDialog.openDialog(
                                       <Suspense
                                          fallback={
                                             <div
                                                style={{
                                                   height: '450px',
                                                   minWidth: '600px'
                                                }}
                                             >
                                                <Spinner msg='' />
                                             </div>
                                          }
                                       >
                                          <AssociatedDialog
                                             index={key}
                                             store={reportStore}
                                             picklistInputData={
                                                res.custom_picklist_def
                                             }
                                             currentData={res}
                                             fromFilter={false}
                                             action_button={[
                                                {
                                                   id: 1,
                                                   label: 'Close',
                                                   type: 'button',
                                                   variant: 'outlined',
                                                   color: 'primary',
                                                   action: handleDialogClose
                                                },
                                                {
                                                   id: 2,
                                                   label: 'Save',
                                                   type: 'submit',
                                                   variant: 'contained',
                                                   color: 'primary',
                                                   action: handleAddAction
                                                }
                                             ]}
                                          />
                                       </Suspense>,
                                       'Associate Picklist'
                                    )
                                 }
                              />
                           </TableCell>
                           <TableCell
                              align='left'
                              width='9%'
                              className={classes.tableCellStyle}
                           >
                              <SelectBox
                                 style={{ width: '85px' }}
                                 name='type'
                                 list={[
                                    { value: 'integer', label: `${t('bam:INTEGER')}` },
                                    { value: 'text', label: `${t('bam:TEXT')}` },
                                    { value: 'decimal', label: `${t('bam:DECIMAL')}` },
                                    { value: 'date', label: `${t('bam:DATE')}` },
                                    { value: 'date_time', label: `${t('bam:DATE_TIME')}` },
                                    { value: 'text_area', label: `${t('bam:TEXTAREA')}` }
                                 ]}
                                 className={classes.widthStyle}
                                 value={res.type}
                                 onChangeHandler={e =>
                                    getFormValue(e, key, res)
                                 }
                              />
                           </TableCell>
                           <TableCell
                              align='left'
                              width='10%'
                              className={classes.tableCellStyle}
                           >
                              {' '}
                              <InputBox
                                 style={{ width: '106px' }}
                                 name='default_value'
                                 form={false}
                                 minLabelWidth={true}
                                 value={res.default_value}
                                 onChangeHandler={e =>
                                    getFormValue(e, key, res)
                                 }
                              />
                           </TableCell>
                           <TableCell
                              width='10%'
                              className={classes.tableCellStyle}
                           >
                              <Typography
                                 variant='subtitle1'
                                 className={classes.advancedOption}
                                 onClick={() =>
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
                                          <PopOverAdvancedMenu
                                             index={key}
                                             closeDialog={
                                                normalDialog.closeDialog
                                             }
                                             handleAdvancedOptionData={handleAdvancedOptionData}
                                             advancedOptionData={res}
                                             reportStore={reportStore}
                                             onChangeState={onChangeState}
                                          />
                                       </Suspense>,
                                       'AdvancedOptions'
                                    )
                                 }
                              >
                                 {t('bam:ADVANCED_OPTIONS')}
                              </Typography>
                           </TableCell>
                        </TableRow>
                     )
                  })}
               </TableBody>
            </Table>
         </TableContainer>
      </Fragment>
   )
}

export default InputProperties
