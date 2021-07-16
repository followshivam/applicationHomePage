import React, { Fragment, useState, useEffect } from 'react'

import { makeStyles, Grid, Paper, PickList, Typography } from 'component'
import {
   GetReportList,
   GetReportGenerateData,
   GetReportDefinition
} from 'global/bam/api/ApiMethods'
import { ReportGenerateJson, ReportDefinitionInput } from 'global/json'
import { useSelector } from 'react-redux'

const useStyles = makeStyles(theme => ({
   report_container: {
      height: 290,
      background: theme.palette.backgroundContainer,
      padding: '0px 20px'
   },
   // inputBoxWidth: {
   //    width: '459px'
   // },
   grid_root: {
      marginTop: theme.spacing(2)
   },
   form_spacing: {
      paddingTop: theme.spacing(1.5)
   },
   paper: {
      minHeight: '190px',
      maxHeight: '190px',
      overflowY: 'auto',
      width: '100%',
      textAlign: 'left'
      //   padding: theme.spacing(1)
   },
   mappingContainer: {
      padding: '.3rem',
      borderBottom: `1px solid ${theme.palette.borderColor}`
   }
   // form: {
   //    paddingTop: theme.spacing(1),
   //    display: 'flex',
   //    marginBottom: theme.spacing(1.2)
   // },
   // browswButton: {
   //    padding: '0 5px',
   //    marginLeft: theme.spacing(1.2),
   //    marginTop: theme.spacing(2.4)
   // }
}))

const FromReport = props => {
   const { picklistFunctions, setPicklistFunctions = null, t } = props

   const classes = useStyles()
   const snackbarState = useSelector(state => {
      return state.snackbarState
   })
   const [inputData, setInputData] = useState(ReportGenerateJson)
   const [inputDataReportList, setInputDataReportList] = useState({
      category_id: 0,
      category_name: 'GR',
      filter: '',
      healthstatus_code: '0',
      hide_blocked: false,
      last_blockedstatus: '',
      last_index: '',
      last_name: '',
      opr: 0,
      showblocked_top: false,
      type: 'List'
   })

   const store = useSelector(state => {
      return state.createReportState
   })

   const [reportStore, setReportStore] = useState(store)
   const [loader, setLoader] = useState(true)

   // const handleInput = e => {
   //    setInputData(e.target.value)
   // }

   // const handleSubmit = e => {
   //    e.preventDefault()
   // }

   const [outputMappingData, setOutputMappingData] = useState({
      loading: true,
      list: null,
      error_msg: ''
   })
   const [reportList, setReportList] = useState({
      loading: true,
      list: null,
      error_msg: ''
   })

   const searchHandler = (data) => {
      setInputDataReportList({
         ...inputDataReportList,
         filter: data,
         opr: 0
      })
   }


   const getDataFromApi = () => {
      GetReportList(inputDataReportList)
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               setReportList({ ...reportList, loading: false, list: res.data })
            } else {
               setReportList({
                  ...reportList,
                  loading: false,
                  error_msg: res.status.errormsg
               })
            }
         })
         .catch(err => { })
   }

   useEffect(() => {
      if (inputDataReportList != null) {
         getDataFromApi()
      }
   }, [inputDataReportList])

   const getReportDesignerList = params => {
      if (params === 'next') {
         setInputDataReportList({
            ...inputDataReportList,
            opr: 1,
            last_index: reportList && reportList.list.last_index,
            last_name: reportList && reportList.list.last_name
         })
      }

      if (params === 'prev') {
         setInputDataReportList({
            ...inputDataReportList,
            opr: 2,
            last_index: reportList && reportList.list.first_index,
            last_name: reportList && reportList.list.first_name
         })
      }

   }

   const [reportIndex, setReportIndex] = useState(
      picklistFunctions.assoc_report_id
   )

   useEffect(() => {
      ReportGenerate(reportIndex)
      ReportDefinitionData(reportIndex)
   }, [picklistFunctions.assoc_report_id])

   const ReportGenerate = reportIndex => {
      GetReportGenerateData({ ...inputData, report_index: reportIndex })
         .then(res => {
            if (res != null && res.status.maincode == '0') {
               let data = res.data.report_input_fields ? res.data.report_input_fields.map(field => ({
                  picklist_input_field: field.display_name,
                  mapped_field_type: '',
                  mapped_field_value: '',
                  mapped_field_mandatory: false
               })) : []
               setPicklistFunctions({
                  ...picklistFunctions,
                  picklist_input_mapping: data
               })
            } else {
               snackbarState.openSnackbar(res.status.errormsg, 'error', 5000)
               console.log('error')
            }
         })
         .catch(err => { })
   }

   const ReportDefinitionData = reportIndex => {
      GetReportDefinition({
         ...ReportDefinitionInput,
         report_index: reportIndex
      })
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               var data1 = { data: res.custom_report.field }
               setOutputMappingData({
                  ...outputMappingData,
                  loading: false,
                  list: data1
               })
            } else {
               setOutputMappingData({
                  ...outputMappingData,
                  loading: false,
                  error_msg: res.status.errormsg
               })
            }
         })
         .catch(err => { })
   }

   const onChangePicklistInput = val => {
      let data = []
      if (props.fromFilter) {
         data.push({
            picklist_input_field: props.currentData.display_name,
            mapped_field_display: '',
            mapped_field_name: ''
         })
      } else {
         data = reportStore.report_input_fields.field.map(field => ({
            picklist_input_field: field.display_name,
            mapped_field_display: '',
            mapped_field_name: ''
         }))
      }
      setPicklistFunctions({
         ...picklistFunctions,
         assoc_report_id: val.report_index,
         assoc_report_name: val.report_name,
         picklist_output_mapping: data
      })
      setReportIndex(val.report_index)
   }


   const pickListInputHandler = (result, res) => {
      let obj = {}
      obj.picklist_input_field = res.picklist_input_field
      obj.mapped_field_type = 'C'
      obj.mapped_field_value = result.display_name
      obj.mapped_field_mandatory = false

      const index = props.picklistFunctions.picklist_input_mapping.findIndex(
         input => input.picklist_input_field === res.picklist_input_field
      )

      var arr = props.picklistFunctions.picklist_input_mapping
      arr[index] = obj
      let state = { ...props.picklistFunctions }
      state.picklist_input_mapping = arr
      props.setPicklistFunctions(state)
   }

   const pickListOutputHandler = (result, res) => {
      let obj = {}
      obj.picklist_input_field = res.picklist_input_field
      obj.mapped_field_display = result.display_name
      obj.mapped_field_name = result.name

      const index = props.picklistFunctions.picklist_output_mapping.findIndex(
         input => input.picklist_input_field === res.picklist_input_field
      )
      var arr = props.picklistFunctions.picklist_output_mapping
      arr[index] = obj
      let state = { ...props.picklistFunctions }
      state.picklist_output_mapping = arr
      props.setPicklistFunctions(state)
   }
   let input_column_pik_data = {}
   if (props.fromFilter) {
      input_column_pik_data.data = [{
         display_name: props.currentData.display_name
      }]
   } else {
      input_column_pik_data.data = reportStore.report_input_fields.field
   }


   return (
      <Fragment>
         <div className={classes.report_container}>
            {/* <form onSubmit={handleSubmit} className={classes.form}>
               <InputBox
                  form
                  label='Select Report'
                  name='width'
                  fullWidth={true}
                  value={inputData}
                  className={classes.inputBoxWidth}
                  onChange={handleInput}
               />
               <div className={classes.browswButton}>
                  <Button variant='contained' color='primary' type='submit'>
                     Browse Report
                  </Button>
               </div>
            </form> */}
            <div className={classes.form_spacing}>
               <PickList
                  style={{ width: '459px' }}
                  label={t('bam:SELECT_REPORT')}
                  onOpen={params => getReportDesignerList(params)}
                  value={props.picklistFunctions.assoc_report_name}
                  name='select_report'
                  list={reportList.list == null ? null : reportList.list}
                  loading={reportList.loading}
                  injectLiveValue={true}
                  displayKey='report_name'
                  valueKey='report_index'
                  pagination={true}
                  search={true}
                  onSearch={(query) => searchHandler(query)}
                  clearSearchResult={() => setInputDataReportList({
                     ...inputDataReportList,
                     filter: '',
                     opr: 0
                  })}
                  onChangePicklist={params => getReportDesignerList(params)}
                  error_msg={reportList.error_msg}
                  form={true}
                  onChangeHandler={onChangePicklistInput}
               />
            </div>
            <div className={classes.grid_root}>
               <Grid container spacing={2}>
                  <Grid item sm={6}>
                     <Typography
                        vairant='h4'
                        style={{
                           marginBottom: '5px',
                           fontSize: 12,
                           fontWeight: 600,
                           color: '#606060'
                        }}
                     >
                        {t('bam:MAPPING_INPUT_COL')}
                     </Typography>
                     <Paper className={classes.paper} elevation={0}>
                        <div style={{ padding: '10px' }}>
                           {picklistFunctions.picklist_input_mapping &&
                              picklistFunctions.picklist_input_mapping.map(
                                 (res, key) => {
                                    return (
                                       <Fragment key={key}>
                                          <Grid
                                             container
                                             direction='row'
                                             justify='space-between'
                                             alignItems='center'
                                             className={
                                                classes.mappingContainer
                                             }
                                          >
                                             <Typography variant='subtitle1'>
                                                {res.picklist_input_field}
                                             </Typography>
                                             <PickList
                                                name='report_category'
                                                onChangeHandler={result =>
                                                   pickListInputHandler(
                                                      result,
                                                      res
                                                   )
                                                }
                                                value={res.mapped_field_value}
                                                pagination={false}
                                                search={false}
                                                loading={loader}
                                                list={
                                                   input_column_pik_data == null
                                                      ? null
                                                      : input_column_pik_data
                                                }
                                                injectLiveValue={true}
                                                displayKey='display_name'
                                                valueKey='display_name'
                                                onOpen={() => {
                                                   setTimeout(
                                                      () => setLoader(false),
                                                      800
                                                   )
                                                }}
                                             />
                                          </Grid>
                                       </Fragment>
                                    )
                                 }
                              )}
                        </div>
                     </Paper>
                  </Grid>
                  <Grid item sm={6}>
                     <Typography
                        vairant='h4'
                        style={{
                           marginBottom: '5px',
                           fontSize: 12,
                           fontWeight: 600,
                           color: '#606060'
                        }}
                     >
                        {t('bam:MAPPING_OUTPUT_COL')}
                     </Typography>
                     <Paper className={classes.paper} elevation={0}>
                        <div style={{ padding: '10px' }}>
                           {picklistFunctions.picklist_output_mapping &&
                              picklistFunctions.picklist_output_mapping.map(
                                 (res, key) => {
                                    return (
                                       <Fragment key={key}>
                                          <Grid
                                             container
                                             direction='row'
                                             justify='space-between'
                                             alignItems='center'
                                             className={
                                                classes.mappingContainer
                                             }
                                          >
                                             <Typography variant='subtitle1'>
                                                {res.picklist_input_field}
                                             </Typography>
                                             <PickList
                                                name='output_mapping'
                                                onChangeHandler={result =>
                                                   pickListOutputHandler(
                                                      result,
                                                      res
                                                   )
                                                }
                                                loading={loader}
                                                list={
                                                   outputMappingData.list ==
                                                      null
                                                      ? null
                                                      : outputMappingData.list
                                                }
                                                injectLiveValue={true}
                                                value={res.mapped_field_name}
                                                displayKey='name'
                                                valueKey='name'
                                                onOpen={() => {
                                                   setTimeout(
                                                      () => setLoader(false),
                                                      800
                                                   )
                                                }}
                                             />
                                          </Grid>
                                       </Fragment>
                                    )
                                 }
                              )}
                        </div>
                     </Paper>
                  </Grid>
               </Grid>
            </div>
         </div>
      </Fragment>
   )
}

export default FromReport
