import {
   NotFound,
   Pagination,
   SearchBox,
   SelectBox,
   Button,
   DialogActions,
   Divider,
   makeStyles,
   Typography,
   Spinner,
   TableComponent
} from 'component'
import { GetCategoryList, GetReportList } from 'global/bam/api/ApiMethods'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CreateSchedule } from 'redux/action'

const useStyles = makeStyles(theme => ({
   root: {
      width: '100%',
      height: '390px'
   },
   actionBar: {
      position: 'absolute',
      bottom: '0',
      right: '0'
   },
   body: {
      height: 'calc(100% - 50px)',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(1)
   },
   toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(0.5)
   },
   textColor: {
      color: '#606060'
   },
   inputBox: {
      width: '140px'
   },
   toolbarControls: {
      display: 'flex',
      alignItems: 'center',
      '& > *': {
         marginLeft: theme.spacing(1)
      }
   }
}))

const SelectReportList = props => {
   const { data = {}, t = null } = props
   const classes = useStyles()
   const createScheduleState = useSelector(store => store.createScheduleState)

   const headerData = [
      {
         id: 'report_name',
         numeric: false,
         disablePadding: true,
         label: `${t('bam:REPORT_NAME')}`
      },
      {
         id: 'report_type',
         numeric: true,
         disablePadding: true,
         label: `${t('bam:LABEL_REPORT_TYPE')}`
      },
      {
         id: 'description',
         numeric: false,
         disablePadding: false,
         label: `${t('bam:DESCRIPTION')}`
      }
   ]

   const [reportList, setReportList] = useState([
      {
         value: 0,
         label: `${t('bam:GENERAL_REPORTS')}`,
         category_name: 'GR',
         id: '0'
      },
      {
         value: 1,
         label: `${t('bam:HIDDEN_REPORTS')}`,
         category_name: 'HR',
         id: '-1'
      },
      {
         value: 2,
         category_name: 'TR',
         label: `${t('bam:TREND_REPORTS')}`,
         id: '-2'
      }
   ])

   const [selected, setSelected] = useState()
   const checkBoxHandler = data => {
      setSelected({
         report_index: data[0].report_index,
         report_type: data[0].report_type,
         chart_title: data[0].report_name,
         display_name: data[0].report_name,
         description: data[0].description
      })
   }

   const [apiData, setApiData] = useState()
   const [isLoading, setIsLoading] = useState({
      loading: true,
      message: 'Rendering Component'
   })
   const [inputParameters, setInputParameters] = useState({
      reportType: 0,
      filter: ''
   })

   const snackbarState = useSelector(store => store.snackbarState)
   useEffect(() => {
      GetCategoryListData()
   }, [])

   useEffect(() => {
      GetDataFromApi()
   }, [inputParameters])

   const clearSearchResult = () => {
      setInputParameters({ ...inputParameters, filter: '' })
   }

   const GetCategoryListData = () => {
      GetCategoryList({ screenid: 'ReportDesigner' }).then(response => {
         if (
            response != null &&
            response.status != null &&
            response.status.maincode === '0'
         ) {
            let additionalCategories = response.data.category.map(
               (category, index) => ({
                  id: category.category_index,
                  label: category.category_name,
                  category_name: 'CR',
                  value: index + 3
               })
            )
            const newReportList = [...reportList, ...additionalCategories]
            setReportList(newReportList)
         } else {
            snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error')
         }
      })
   }

   const GetDataFromApi = (opr = '0', last_index = '', last_name = '') => {
      let category = '',
         category_id = ''

      if (
         reportList != null &&
         reportList[inputParameters.reportType] != null
      ) {
         category_id = reportList[inputParameters.reportType].id
         category = reportList[inputParameters.reportType].category_name
      }

      const payload = {
         // ...getReportJson,
         category_id: category_id,
         category: category,
         filter: inputParameters.filter,
         opr: opr,
         last_index: last_index,
         last_name: last_name,
         type: 'Design',
         last_blockedstatus: '',
         hide_blocked: false,
         showblocked_top: false,
         healthstatus_code: '0'
      }

      setIsLoading({ loading: true, message: 'Loading data from server' })

      GetReportList(payload)
         .then(response => {
            if (
               response != null &&
               response.status != null &&
               response.status.maincode === '0'
            ) {
               setApiData(response.data)
            } else if (
               response != null &&
               response.status != null &&
               response.status.maincode !== '0'
            ) {
               snackbarState.openSnackbar(
                  `${response.status.errormsg}`,
                  'warning'
               )
            } else {
               snackbarState.openSnackbar(
                  `${t('bam:WENT_WRONG_ERROR')}`,
                  'error'
               )
            }
         })
         .then(() => {
            setIsLoading({ loading: false, message: '' })
         })
         .catch(error => {})
   }

   const handlePagination = action => {
      switch (action) {
         case 'next':
            GetDataFromApi(1, apiData.last_index, apiData.last_name)
            break
         case 'prev':
            GetDataFromApi(2, apiData.first_index, apiData.first_name)
            break
         default:
            break
      }
   }

   const dispatch = useDispatch()

   const onNextHandler = event => {
      event.preventDefault()
      if (selected != null) {
         dispatch(
            CreateSchedule({
               ...createScheduleState,
               current_sub_step: createScheduleState.current_sub_step + 1,
               ...data,
               ...selected
            })
         )
      } else
         snackbarState.openSnackbar(`${t('bam:SELECT_A_REPORT')}`, 'warning')
   }
   const onCancelHandler = () => {
      dispatch(
         CreateSchedule({
            ...createScheduleState,
            current_sub_step: createScheduleState.current_sub_step - 1,
            current_step: 2,
            report_instance_list: createScheduleState.report_instance_list
         })
      )
   }

   const onSearchSubmit = data => {
      let param = data.searchString.trim()
      if (param !== '')
         setInputParameters({
            ...inputParameters,
            filter: param
         })
   }

   return (
      <div className={classes.root}>
         <div className={classes.body}>
            <Typography variant='subtitle1' className={classes.textColor}>
               {t('bam:LIST_OF_REPORTS')}:
            </Typography>

            <div className={classes.toolbar}>
               <div className={classes.toolbarText}>
                  <Typography variant='subtitle1' className={classes.textColor}>
                     {t('bam:SELECT_A_REPORT_TO_ADD')}:
                  </Typography>
               </div>
               <div className={classes.toolbarControls}>
                  <SearchBox
                     width='180px'
                     onSearchSubmit={onSearchSubmit}
                     clearSearchResult={clearSearchResult}
                     name='search'
                  />
                  <SelectBox
                     list={reportList}
                     value={inputParameters.reportType}
                     className={classes.inputBox}
                     onChange={event =>
                        setInputParameters({
                           ...inputParameters,
                           reportType: event.target.value
                        })
                     }
                  />
                  <Pagination
                     disabled_next={
                        apiData != null ? !apiData.enable_next : true
                     }
                     disabled_prev={
                        apiData != null ? !apiData.enable_prev : true
                     }
                     onChange={handlePagination}
                  />
               </div>
            </div>
            <Divider fullWidth />
            <div className={classes.tableContainer}>
               {isLoading.loading === false ? (
                  apiData != null && apiData.reports.length > 0 ? (
                     <TableComponent
                        dynamicHeight='275px'
                        overflowRequired={true}
                        tableData={apiData != null ? apiData.reports : []}
                        headerData={headerData}
                        loading={false}
                        onChangeCheckbox={checkBoxHandler}
                        selectType='radio'
                     />
                  ) : (
                     <div style={{ height: '275px' }}>
                        <NotFound message='It looks like no report for this category exists, try changing report type or modify search query.' />
                     </div>
                  )
               ) : (
                  <div style={{ height: '275px' }}>
                     <Spinner message={isLoading.message} />
                  </div>
               )}
            </div>

            <DialogActions className={classes.actionBar}>
               <Button variant='outlined' onClick={onCancelHandler}>
                  {t('bam:LABEL_CANCEL')}
               </Button>
               {/* <Button variant="outlined" onClick={onPreviousHandler}>Previous</Button> */}
               <Button
                  variant='contained'
                  onClick={onNextHandler}
                  color='primary'
               >
                  {t('bam:BUTTON_NEXT')}
               </Button>
            </DialogActions>
         </div>
      </div>
   )
}

export default SelectReportList
