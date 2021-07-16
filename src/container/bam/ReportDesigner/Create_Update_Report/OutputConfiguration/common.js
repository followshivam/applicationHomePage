import React, { lazy, Suspense } from 'react'
import {
   Paper,
   Checkbox,
   Tooltip,
   Typography,
   Grid,
   useTranslation,
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
   FormControlLabel,
   Spinner
} from 'component'
import RowDragger from 'component/RowDragger'
import { TypeConversion } from 'global/methods'
import { useSelector, useDispatch } from 'react-redux'
import { CreateReport } from 'redux/action'
const CalculatedFieldDialog = lazy(() => import('./OutputFields/FieldEditor'))

const useStyles = makeStyles(theme => ({
   paperRight: {
      textAlign: 'center',
      border: `1px solid ${theme.palette.borderColor}`,
      backgroundColor: theme.palette.backgroundContainer,
      minHeight: '84vh'
   },
   table_left: {
      width: '94%',
      overflowY: 'auto'
   },
   app_root: {
      flex: 1,
      flexGrow: 1,
      width: '100%',
      height: 35,
      boxShadow: `0px 2px 4px -1px rgba(0,0,0,0.1)`
   },
   toolbar: {
      '& > *': {
         marginLeft: theme.spacing(6)
      }
   },
   tableCellStyle: {
      borderBottom: 'none'
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
   },
   empty_logo: {
      textAlign: 'center',
      paddingTop: '10%'
   }
}))

const StyledTableCellBody = withStyles(theme => ({
   sizeSmall: {
      padding: '0px 24px 0px 0px'
   },
   maxWidth: '100px'
}))(TableCell)

const StyledTableCell = withStyles(theme => ({
   stickyHeader: {
      backgroundColor: theme.palette.common.white
   },
   sizeSmall: {
      padding: '6px 24px 6px 0px'
   }
}))(TableCell)

const StyledFormControlLable = withStyles({
   label: {
      marginLeft: '-3px'
   }
})(FormControlLabel)

export const DisplayFields = props => {
   const dispatch = useDispatch()

   const [dialogState, globalSetting] = useSelector(state => {
      return [state.normalDialogState, state.globalSettings]
   })

   const { t } = useTranslation(globalSetting.locale_module)

   const classes = useStyles()
   const {
      selectedData = [],
      displayData = [],
      handleChangeTableRow = null,
      handleAlias = null,
      onDeleteHandler = null
   } = props

   const onEditHandler = res => {
      dialogState.openDialog(
         <Suspense
            fallback={
               <div style={{ height: '450px', minWidth: '600px' }}>
                  <Spinner msg='' />
               </div>
            }
         >
            <CalculatedFieldDialog t={t} data={res} displayData={displayData} />
         </Suspense>,
         'Calculated Field Editor'
      )
   }

   return (
      <TableContainer style={{ maxHeight: '530px' }}>
         <Table stickyHeader className={classes.table_left} size='small'>
            <TableHead>
               <TableRow>
                  <StyledTableCell align='left' width='40%'>
                     <Typography variant='h4'>
                        {t('bam:LABEL_FIELDS')}
                     </Typography>
                  </StyledTableCell>
                  <StyledTableCell align='left' width='15%'>
                     <Typography variant='h4'>{t('bam:TYPE')}</Typography>
                  </StyledTableCell>
                  <StyledTableCell align='left' width='30%'>
                     <Typography variant='h4'>{t('bam:STR_ALIAS')}</Typography>
                  </StyledTableCell>
                  <StyledTableCell align='left' width='8%'>
                     {' '}
                  </StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {displayData.map((res, key) => (
                  <TableRow key={key}>
                     <StyledTableCellBody
                        width='40%'
                        style={{ maxWidth: '160px' }}
                        className={classes.tableCellStyle}
                        align='left'
                     >
                        <Tooltip title={res.name} arrow>
                           <StyledFormControlLable
                              value={res.name}
                              noWrap={true}
                              control={
                                 <Checkbox
                                    color='primary'
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    onChange={e => handleChangeTableRow(e, res)}
                                    checked={
                                       selectedData.filter(
                                          result => result.name === res.name
                                       ).length > 0
                                    }
                                 />
                              }
                              // label={res.name}
                              label={
                                 res.name.length <= 20
                                    ? res.name
                                    : res.name.slice(0, 19) + '...'
                              }
                              labelPlacement='end'
                           />
                        </Tooltip>
                     </StyledTableCellBody>
                     <StyledTableCellBody
                        width='15%'
                        align='left'
                        className={classes.tableCellStyle}
                     >
                        <Typography color='textSecondary' variant='subtitle1'>
                           {TypeConversion(res.type)}
                        </Typography>
                     </StyledTableCellBody>
                     <StyledTableCellBody
                        width='30%'
                        align='left'
                        className={classes.tableCellStyle}
                     >
                        <InputBox
                           form={false}
                           value={res.display_name}
                           onChange={e => handleAlias(e, res)}
                           disabled={
                              !selectedData.filter(
                                 result => result.name === res.name
                              ).length > 0
                           }
                           name={res.name}
                           style={{ width: '121px' }}
                        />
                     </StyledTableCellBody>
                     {res.function_type === 'F' ? (
                        <StyledTableCellBody
                           width='15%'
                           align='left'
                           className={classes.tableCellStyle}
                        >
                           <div
                              style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                                 flexDirection: 'row'
                              }}
                           >
                              <IconsButton
                                 type='EditIcon'
                                 onClick={() => onEditHandler(res)}
                              />
                              <IconsButton
                                 type='DeleteIcon'
                                 onClick={() => onDeleteHandler(res)}
                              />
                           </div>
                        </StyledTableCellBody>
                     ) : null}
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   )
}
export const DraggerComponent = props => {
   const classes = useStyles()
   const { selectedData = [], changeListOrder = null } = props

   const [dialogState, globalSetting] = useSelector(state => {
      return [state.normalDialogState, state.globalSettings]
   })

   const { t } = useTranslation(globalSetting.locale_module)

   return (
      <React.Fragment>
         <Paper className={classes.paperRight} elevation={0}>
            <div className={classes.app_root}>
               <Toolbar variant='dense' className={classes.toolbar}>
                  <Typography variant='h4'>{t('bam:LABEL_FIELDS')}</Typography>
                  <Typography variant='h4' style={{ marginLeft: '150px' }}>
                     {t('bam:TYPE')}
                  </Typography>
                  <Typography variant='h4' style={{ marginLeft: '60px' }}>
                     {t('bam:STR_ALIAS')}
                  </Typography>
               </Toolbar>
            </div>
            {selectedData.length === 0 ? (
               <div className={classes.empty_logo}>
                  <img src='icons/illustration.png' />
                  <Typography variant='subtitle1' color='textSecondary'>
                     {t('bam:SELECT_FIELD_FOR_OUTPUT')}
                  </Typography>
                  <Typography variant='subtitle1' color='textSecondary'>
                     {t('bam:SELECTING_FIELD_FOR_OUTPUT')}
                  </Typography>
               </div>
            ) : (
               <RowDragger items={selectedData} onChange={changeListOrder} />
            )}{' '}
         </Paper>
      </React.Fragment>
   )
}
