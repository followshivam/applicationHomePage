import React, { useState, Fragment, Suspense, lazy, useEffect } from 'react'
import {
   makeStyles,
   Grid,
   Paper,
   SelectBox,
   Typography,
   Spinner,
   Tabs,
   Tab,
   Toolbar,
   Checkbox,
   FormControlLabel,
   Button,
   useTranslation,
   InputBox
} from 'component'
import { LeftContainer } from '../common'
import { useSelector } from 'react-redux'
import RowDragger from 'component/RowDraggerV2'

const General = lazy(() => import('./General'))
const DrillDown = lazy(() => import('./DrillDown'))
const HeaderRow = lazy(() => import('./HeaderRows'))
const OtherRows = lazy(() => import('./OtherRows'))

const useStyles = makeStyles(theme => ({
   root: {
      flexGrow: 1
   },
   paperRight: {
      // textAlign: 'center',
      backgroundColor: theme.palette.backgroundContainer,
      minHeight: '82.5vh',
      paddingLeft: '.2rem',
      borderLeft: `1px solid ${theme.palette.borderColor}`
   },
   chartType: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '.5rem .6rem',
      backgroundColor: 'white',
      alignItems: 'center'
   },
   tableTypeTabs: {
      backgroundColor: 'white',
      height: '46.5vh',
      padding: '.5rem .6rem',
      paddingBottom: '1.8rem'
   },
   tabs: {
      minHeight: tabHeight,
      // height: tabHeight,
      borderBottom: '1px solid lightgrey',
      fontWeight: 'bold'
   },
   tab: {
      fontSize: '12px',
      minWidth: '11px',
      textTransform: 'none',
      minHeight: tabHeight,
      height: tabHeight
      // fontWeight: 'bold'
   },
   tab_container: {
      flexGrow: 1,
      backgroundColor: 'white',
      width: '100%',
      height: '200px',
      overflow: 'auto'
   },
   app_root: {
      flex: 1,
      flexGrow: 1,
      width: '100%',
      height: 300,
      borderBottom: `1px solid ${theme.palette.borderColor}`,
      boxShadow: `0px 2px 4px -1px rgba(0,0,0,0.1)`,
      backgroundColor: theme.palette.common.white
   },
   toolbar: {
      display: 'flex',
      '& > h6:nth-child(1)': {
         flexBasis: '35%'
      },
      '& > h6:nth-child(2)': {
         flexBasis: '20%'
      },
      '& > h6:nth-child(3)': {
         flexBasis: '20%'
      },
      '& > h6:nth-child(4)': {
         flexBasis: '25%',
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         '&>b': {
            marginRight: '5px'
         }
      }
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
   },
   tabSelected: {
      color: '#000000'
   },
   fieldContainer: {
      overflow: 'auto',
      height: '260px'
   }
}))
const tabHeight = '27px'
const TabPanel = props => {
   const { children, value, index } = props

   return <div>{value === index && <Fragment>{children}</Fragment>}</div>
}

const Tabular = props => {
   const classes = useStyles()

   const [snackbarState, globalSetting] = useSelector(state => {
      return [state.snackbarState, state.globalSettings]
   })

   const { t } = useTranslation(globalSetting.locale_module)

   return (
      <Grid container>
         <Grid item sm={8} xs={12}>
            <LeftContainer t={t} {...props} />
         </Grid>
         <Grid item sm={4} xs={12}>
            <RightContainer {...props} />
         </Grid>
      </Grid>
   )
}

const RightContainer = props => {
   const classes = useStyles()
   const [configValue, setconfigValue] = useState(0)
   const [isAutoWidthEnable, setIsAutoWidthEnable] = useState(false)

   const [snackbarState, globalSetting] = useSelector(state => {
      return [state.snackbarState, state.globalSettings]
   })

   const { t } = useTranslation(globalSetting.locale_module)

   const tabsArray = [
      { label: `${t('bam:GENERAL')}`, index: 0, component: General },
      // { label: 'DrillDown', index: 1, component: DrillDown },
      {
         label:
            // `${t('bam:HEADER_ROWS')}`
            'Header',
         index: 1,
         component: HeaderRow
      }
      // { label: `${t('bam:OTHER_ROWS')}`, index: 3, component: OtherRows }
   ]

   const handleConfigurations = (e, val) => {
      setconfigValue(val)
   }

   const changeListOrder = newList => {
      props.handleRootChange('output_fields', newList)
   }

   const fieldsData = props.state.output_fields.field

   const handleChange = (name, value, obj) => {
      let t = [],
         o = {}
      fieldsData.map((item, index) => {
         if (item.name === obj.name) {
            o = {
               ...item,
               [name]: value
            }
         } else o = item
         t.push(o)
      })

      changeListOrder({ field: t })
   }

   var result = fieldsData.map((field, key) => ({
      unique_id: field.name,
      component: (
         <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div
               style={{
                  flexBasis: '32%',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  padding: '0 10px 0 0'
               }}
            >
               <Typography variant='subtitle1'>{field.display_name}</Typography>
            </div>
            <div style={{ flexBasis: '20%' }}>
               <Typography variant='subtitle1'>
                  {field.type === '16' ? 'Text' : 'Integer'}
               </Typography>
            </div>
            <div style={{ flexBasis: '20%' }}>
               <Typography variant='subtitle2'>
                  <Checkbox
                     color='primary'
                     value={field.show_total ? field.show_total : false}
                     disableRipple={true}
                     disabled={field.type === '16'}
                     disableFocusRipple={true}
                     onChange={e => {
                        if (field.type === '16')
                           snackbarState.openSnackbar(
                              `${t('bam:FIELD_TOTAL_MESSAGE')}`,
                              'warning'
                           )
                        else handleChange('show_total', e.target.checked, field)
                     }}
                  />
               </Typography>
            </div>
            <div>
               <InputBox
                  name={'pdf_col_length'}
                  injectLiveValue={true}
                  type='number'
                  value={field.pdf_col_length ? field.pdf_col_length : ''}
                  disabled={isAutoWidthEnable}
                  onChange={e =>
                     handleChange('pdf_col_length', e.target.value, field)
                  }
                  style={{ width: '68px' }}
               />
            </div>
         </div>
      )
   }))

   const [draggerData, setdraggerData] = useState(result)

   useEffect(() => {
      setdraggerData(result)
   }, [fieldsData])

   useEffect(() => {
      setdraggerData(result)
   }, [isAutoWidthEnable])

   const onChangeHandlerDragger = (newData, startIndex, endIndex) => {
      setdraggerData(newData)

      const result = Array.from(fieldsData)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      changeListOrder({ field: result })
   }

   const handleAutoWidthCheck = value => {
      setIsAutoWidthEnable(value)
      props.setIsAutoWidthEnable(value)
   }

   return (
      <Fragment>
         <Paper className={classes.paperRight} elevation={0}>
            <div className={classes.app_root}>
               <Toolbar variant='dense' className={classes.toolbar}>
                  <Typography variant='subtitle1'>
                     <b>{t('bam:FIELD_NAME')}</b>
                  </Typography>
                  <Typography variant='subtitle1'>
                     <b>{t('bam:TYPE')}</b>
                  </Typography>
                  <Typography variant='subtitle1'>
                     <b>{t('bam:FIELD_TOTAL')}</b>
                  </Typography>
                  <Typography variant='subtitle1'>
                     <b>{t('bam:COL_RATIO')}</b>
                     <FormControlLabel
                        value='auto'
                        control={
                           <Checkbox
                              color='primary'
                              disableRipple={true}
                              value={isAutoWidthEnable}
                              disableFocusRipple={true}
                              onChange={e =>
                                 handleAutoWidthCheck(e.target.checked)
                              }
                           />
                        }
                        label='Auto'
                        labelPlacement='end'
                        classes={{ label: classes.checkbox_label }}
                     />
                  </Typography>
               </Toolbar>
               <div className={classes.fieldContainer}>
                  {/* <RowDragger variant="tabular" items={fieldsData} onChange={changeListOrder} /> */}
                  <RowDragger
                     data={draggerData}
                     onChange={onChangeHandlerDragger}
                  />
               </div>
            </div>
            <div className={classes.chartType}>
               <SelectBox
                  disabled={true}
                  list={[{ value: 1, label: 'Test' }]}
                  style={{ width: '250px' }}
               />
               <Button variant='filled'>
                  <Typography variant='subtitle1'>
                     <b>{t('bam:SAVE')}</b>
                  </Typography>
               </Button>
               <Button variant='filled'>
                  <Typography variant='subtitle1' color='primary'>
                     <b>{t('bam:SAVE_AS_NEW')}</b>
                  </Typography>
               </Button>
               <div></div>
            </div>
            <div className={classes.tableTypeTabs}>
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
                              <div style={{ height: '200px' }}>
                                 <Spinner msg='' />
                              </div>
                           }
                        >
                           <res.component t={t} {...props} />
                        </Suspense>
                     </TabPanel>
                  ))}
               </div>
            </div>
         </Paper>
      </Fragment>
   )
}

export default Tabular
