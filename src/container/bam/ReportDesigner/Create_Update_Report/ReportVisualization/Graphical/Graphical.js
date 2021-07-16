import React, { useState, Fragment, Suspense, lazy, useEffect } from 'react'
import {
   Paper,
   Checkbox,
   Tabs,
   Tab,
   Typography,
   Grid,
   Button,
   makeStyles,
   Radio,
   RadioGroup,
   IconsButton,
   SelectBox,
   FormControlLabel,
   Spinner,
   Tooltip,
   NotFound,
   withStyles,
   useTranslation
} from 'component'

import Box from '@material-ui/core/Box'
import { LeftContainer } from '../common'
import { useSelector } from 'react-redux'
const General = lazy(() => import('./General'))
const DrillDown = lazy(() => import('./DrillDown'))
const Values = lazy(() => import('./Values'))
const Legends = lazy(() => import('./Legends'))
const GridChart = lazy(() => import('./Grid'))
const Label = lazy(() => import('./Label'))

const tabHeight = '27px'
const useStyles = makeStyles(theme => ({
   root: {
      flexGrow: 1
   },
   topBar: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: theme.palette.common.white,
      height: 'auto',
      padding: '.4rem 0 .4rem 0',
      borderBottom: `1px solid ${theme.palette.borderColor}`
   },
   outlinedSelect: {
      borderRadius: '0%',
      maxHeight: '23px',
      minWidth: '25%',
      backgroundColor: theme.palette.common.white
   },
   chartTypeSelect: {
      borderRadius: '1%',
      minHeight: '30px',
      minWidth: '85%',
      backgroundColor: theme.palette.common.white
   },
   saveSelect: {
      borderRadius: '1%',
      minHeight: '24px',
      minWidth: '70%',
      backgroundColor: theme.palette.common.white,
      marginRight: '12px'
   },
   paperRight: {
      // textAlign: 'center',
      // backgroundColor: theme.palette.common.white,
      backgroundColor: theme.palette.backgroundContainer,
      // minHeight: '620px',
      minHeight: '82.5vh',
      paddingLeft: '.2rem',
      borderLeft: `1px solid ${theme.palette.borderColor}`
   },
   fieldsType: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: theme.palette.common.white,
      height: 'auto',
      padding: '.9rem',
      borderBottom: `1px solid ${theme.palette.borderColor}`
   },
   graphTypeTabs: {
      backgroundColor: theme.palette.common.white,
      height: '42.4vh',
      padding: '.5rem .6rem',
      paddingBottom: '2.4rem'
   },
   fieldsTypeSelect: {
      // height: '110px',
      // width: '370px',
      border: `1px solid ${theme.palette.borderColor}`,
      borderRadius: '5px',
      marginTop: '6px'
   },
   chartType: {
      display: 'flex',
      justifyContent: 'flex-start',
      padding: '1rem 1rem',
      backgroundColor: theme.palette.common.white,
      alignItems: 'center'
      // width: '100%'
   },
   save_functions: {
      padding: '.5rem 1rem',
      backgroundColor: theme.palette.common.white,
      cursor: 'pointer',
      '& > *': {
         marginRight: theme.spacing(2)
      }
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
   tabSelected: {
      // fontWeight: 'bold',
      color: '#000000'
   },
   checkbox_label: {
      // fontSize: theme.typography.subtitle1.fontSize
      marginLeft: 0,
      minWidth: '92px'
   },
   radio_label: {
      // fontSize: theme.typography.subtitle1.fontSize
      marginLeft: 0,
      minWidth: '130px'
   },
   tab_container: {
      flexGrow: 1,
      backgroundColor: 'white',
      width: '100%',
      height: '240px',
      overflow: 'auto'
   },

   fieldsBox: {
      // maxWidth: 420,
      width: '100%',
      height: '160px',
      overflow: 'auto'
   },
   field_name: {
      backgroundColor: 'white',
      paddingTop: '.9rem',
      paddingLeft: '.9rem'
   }
}))

const StyledFormControlLable = withStyles({
   root: {
      marginLeft: '0px',
      marginRight: '10px'
   }
})(FormControlLabel)

const TabPanel = props => {
   const { children, value, index } = props

   return <div>{value === index && <Fragment>{children}</Fragment>}</div>
}

const Graphical = props => {
   // const classes = useStyles();

   return (
      <Grid container spacing={0}>
         <Grid item sm={8} xs={12}>
            <LeftContainer type='graph' {...props} />
         </Grid>
         <Grid item sm={4} xs={12}>
            <RightContainer {...props} />
         </Grid>
      </Grid>
   )
}

const RightContainer = props => {
   const [syncFinished, setSyncFinished] = useState(false)
   const [state, setState] = useState({ ...props.state })

   const [snackbarState, globalSetting] = useSelector(state => {
      return [state.snackbarState, state.globalSettings]
   })

   const { t } = useTranslation(globalSetting.locale_module)

   useEffect(() => {
      setState({ ...props.state })
      setSyncFinished(true)
   }, [props.state])

   const chartType = [
      { value: 'bar', label: `${t('bam:CHART_BAR')}` },
      { value: 'line', label: `${t('bam:CHART_LINE')}` },
      { value: 'donut', label: `${t('bam:CHART_DONUT')}` },
      { value: 'area', label: `${t('bam:CHART_AREA')}` },
      { value: 'pie', label: `${t('bam:CHART_PIE')}` },
      { value: 'scatter', label: `${t('bam:CHART_SCATTER')}` },
      { value: 'heatmap', label: `Heat Map` }
   ]

   const classes = useStyles()
   const [configValue, setconfigValue] = useState(0)

   var fieldsDataArray = []
   var len = state.field.length
   for (var i = 0; i < len; i++) {
      fieldsDataArray.push({
         value: state.field[i].display_name,
         label: state.field[i].display_name
      })
   }

   const tabsArray = [
      { label: `${t('bam:GENERAL')}`, index: 0, component: General },
      { label: `${t('bam:DRILLDOWN')}`, index: 1, component: DrillDown },
      { label: `${t('bam:LABEL')}`, index: 2, component: Label },
      { label: `${t('bam:VALUES')}`, index: 3, component: Values },
      { label: `${t('bam:GRID')}`, index: 4, component: GridChart },
      { label: `${t('bam:LEGENDS')}`, index: 5, component: Legends }
   ]

   const handleConfigurations = (e, val) => {
      setconfigValue(val)
   }

   useEffect(() => {
      setFinalFields([])
      // props.syncGraphState('chart_display_fields', [])
   }, [props.state.chart_properties.chart_type])

   const [valueRadio, setvalueRadio] = useState('')

   useEffect(() => {
      setvalueRadio(
         state.chart_properties.chart_display_fields.length > 0
            ? state.chart_properties.chart_display_fields[0].name
            : ''
      )
   }, [
      state.chart_properties.chart_display_fields &&
         state.chart_properties.chart_display_fields
   ])
   const handleChangeRadio = (e, data) => {
      setvalueRadio(e.target.value)
      let dataArr = []
      dataArr.push(data)
      setFinalFields(dataArr)

      setSyncFinished(false)
   }

   const [finalFields, setFinalFields] = useState(
      state.chart_properties.chart_display_fields
   )
   useEffect(() => {
      setFinalFields(state.chart_properties.chart_display_fields)
   }, [state.chart_properties.chart_display_fields])

   const handleFields = (e, data) => {
      if (e.target.checked) {
         setFinalFields([...finalFields, data])
      } else {
         setFinalFields(finalFields.filter(res => res.name !== data.name))
      }
      setSyncFinished(false)
   }

   const applyFieldsToParent = () => {
      const selectedFieldItems = [...finalFields].map(item => ({
         name: item.name,
         display_name: item.display_name
      }))

      props.syncGraphState('chart_display_fields', selectedFieldItems)
      setSyncFinished(false)
   }

   const handleKeyField = event => {
      const keyField = event.target.value
      const index = state.field.findIndex(el => el.display_name === keyField)
      props.handleChangeKeyFields([
         ['key_field_name', 'key_field'],
         [state.field[index].name, state.field[index].display_name]
      ])
   }

   const handleChartTypeChange = event => {
      props.handleChartTypeChange('chart_type', event.target.value)
      // setState({
      //    ...state,
      //    chart_properties: {
      //       ...state.chart_properties,
      //       chart_type: event.target.value
      //    }
      // })
   }
   console.log(state)

   const fieldTypeInt = state.field.filter(res => res.type == '4')
   const chartTypeState = props.state.chart_properties.chart_type
   const isStacked = props.state.chart_properties.is_stacked

   return (
      <Fragment>
         <Paper className={classes.paperRight} elevation={0}>
            <div className={classes.field_name}>
               <SelectBox
                  form={false}
                  label={`${t('bam:KEYFIELD')} `}
                  name='key_field'
                  value={state.chart_properties.key_field}
                  list={fieldsDataArray}
                  onChange={handleKeyField}
                  style={{ width: '327px' }}
               />
            </div>
            <div className={classes.fieldsType}>
               <Typography variant='h4'>{t('bam:LABEL_FIELDS')}</Typography>
               <div className={classes.fieldsTypeSelect}>
                  <Box
                     display='flex'
                     flexWrap='wrap'
                     m={0.5}
                     bgcolor='background.paper'
                  >
                     <div className={classes.fieldsBox}>
                        {fieldTypeInt.length > 0 ? (
                           chartTypeState == 'bar' ||
                           chartTypeState == 'scatter' ||
                           chartTypeState == 'line' ||
                           (chartTypeState == 'bar' && isStacked) ||
                           (chartTypeState == 'area' && isStacked) ? (
                              fieldTypeInt &&
                              fieldTypeInt.map((data, i) => {
                                 return (
                                    <Tooltip
                                       title={data.display_name}
                                       arrow
                                       key={i}
                                    >
                                       <StyledFormControlLable
                                          value={data.display_name}
                                          control={
                                             <Checkbox
                                                color='primary'
                                                checked={
                                                   finalFields.filter(
                                                      result =>
                                                         result.name ===
                                                         data.name
                                                   ).length > 0
                                                }
                                                disableRipple={true}
                                                disableFocusRipple={true}
                                                onChange={e =>
                                                   handleFields(e, data)
                                                }
                                             />
                                          }
                                          label={
                                             data.display_name
                                             // data.name.length <= 13
                                             //    ? data.name
                                             //    : data.name.slice(0, 12) + '...'
                                          }
                                          labelPlacement='end'
                                          classes={{
                                             label: classes.checkbox_label
                                          }}
                                       />
                                    </Tooltip>
                                 )
                              })
                           ) : (
                              <div
                                 style={{
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                 }}
                              >
                                 {fieldTypeInt &&
                                    fieldTypeInt.map((data, i) => {
                                       return (
                                          <Tooltip
                                             title={data.display_name}
                                             arrow
                                             key={i}
                                          >
                                             <RadioGroup
                                                row
                                                aria-label='display_field'
                                                name='display_field'
                                                value={valueRadio}
                                                onChange={e =>
                                                   handleChangeRadio(e, data)
                                                }
                                             >
                                                <StyledFormControlLable
                                                   value={data.name}
                                                   classes={{
                                                      root: classes.radio_label
                                                   }}
                                                   control={<Radio />}
                                                   label={
                                                      data.display_name
                                                      // data.name.length <= 13
                                                      //    ? data.name
                                                      //    : data.name.slice(
                                                      //         0,
                                                      //         12
                                                      //      ) + '...'
                                                   }
                                                />
                                             </RadioGroup>
                                          </Tooltip>
                                       )
                                    })}
                              </div>
                           )
                        ) : (
                           <div
                              style={{
                                 padding: '15px 0',
                                 margin: 'auto'
                              }}
                           >
                              <NotFound iconSize={60} messageFontSize='13px' />
                           </div>
                        )}
                     </div>
                  </Box>
               </div>
               <div>
                  <Grid
                     container
                     direction='row'
                     justify='space-between'
                     alignItems='center'
                     style={{ marginTop: '8px' }}
                  >
                     <Button
                        color='primary'
                        disabled={syncFinished === true}
                        onClick={applyFieldsToParent}
                        variant='contained'
                     >
                        {t('bam:APPLY_FIELDS')}
                     </Button>
                     <Typography variant='h4'>
                        {syncFinished === true ? (
                           <IconsButton
                              type='CheckIcon'
                              style={{
                                 color: '#00AF1D',
                                 marginBottom: '5px'
                              }}
                           />
                        ) : null}
                        {state.chart_properties.chart_display_fields.length}{' '}
                        {t('bam:FIELDS_APPLIED')}
                     </Typography>
                     {/* <Typography variant="subtitle1" ><b>1 display</b></Typography>
                                    <Typography variant="subtitle1"><b>2 values</b></Typography> */}
                     {/* <div>{'  '}</div> */}
                  </Grid>
               </div>
            </div>
            <div className={classes.chartType}>
               <Typography variant='h4'>
                  {t('bam:SELECT_CHART_TYPE')}:
               </Typography>
               <SelectBox
                  list={chartType}
                  name='chart_type'
                  value={state.chart_properties.chart_type}
                  onChange={handleChartTypeChange}
                  style={{ width: '275px', marginLeft: '10px' }}
               />
            </div>
            <Grid
               container
               direction='row'
               justify='flex-start'
               alignItems='center'
               // spacing={1}
               className={classes.save_functions}
            >
               <Grid item>
                  <SelectBox
                     disabled={true}
                     list={[{ value: 1, label: 'Test' }]}
                     style={{ width: '270px' }}
                  />
               </Grid>
               <Grid item>
                  <Typography variant='subtitle1' color='textSecondary'>
                     {t('bam:SAVE')}
                  </Typography>
               </Grid>
               <Grid item>
                  <Typography variant='subtitle1' color='primary'>
                     {t('bam:SAVE_AS_NEW')}
                  </Typography>
               </Grid>
            </Grid>
            <div className={classes.graphTypeTabs}>
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
                              <div style={{ height: '300px' }}>
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

export default Graphical
