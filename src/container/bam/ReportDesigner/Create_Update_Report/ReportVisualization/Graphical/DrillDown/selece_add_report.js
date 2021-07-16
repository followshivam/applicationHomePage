import {
   NotFound,
   Pagination,
   SearchBox,
   SelectBox,
   Spinner,
   TableComponent,
   Button,
   DialogActions,
   Divider,
   makeStyles,
   Typography,
   Grid,
   withStyles
} from 'component'
import { GetCategoryList, GetReportList } from 'global/bam/api/ApiMethods'
import React, { useEffect, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'

const useStyles = makeStyles(theme => ({
   body: {
      padding: '12px 22px 0px 22px'
   },
   textColor: {
      color: '#606060'
   },
   inputBox: {
      width: '140px'
   },
   tableContainer: {
      border: `1px solid ${theme.palette.borderColor}`,
      marginBottom: '10px'
   },
   formSpacing: {
      margin: '16px 0px 23px 0px'
   }
}))

const StyledDialogActions = withStyles({
   root: {
      padding: '8px 22px'
   }
})(DialogActions)

const SelectReport = props => {
   const { t } = props
   const classes = useStyles()
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
         id: '0'
      },
      {
         value: 1,
         label: `${t('bam:HIDDEN_REPORTS')}`,
         id: '-1'
      },
      {
         value: 2,
         label: `${t('bam:TREND_REPORTS')}`,
         id: '-2'
      }
   ])

   const [selected, setSelected] = useState()
   const checkBoxHandler = data => {
      setSelected({
         report_index: data[0].report_index,
         report_name: data[0].report_name
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

   const [store, snackbarState] = useSelector(state => {
      return [state.createReportState, state.snackbarState]
   })

   const [reportStore, setReportStore] = useState(store)
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
                  value: index + 3
               })
            )
            const newReportList = [...reportList, ...additionalCategories]
            setReportList(newReportList)
         } else {
            snackbarState.openSnackbar('Something went wrong', 'error')
         }
      })
   }

   const GetDataFromApi = (opr = '0', last_index = '', last_name = '') => {
      let category_name = '',
         category_id = ''

      if (
         reportList != null &&
         reportList[inputParameters.reportType] != null
      ) {
         category_id = reportList[inputParameters.reportType].id
         category_name = reportList[inputParameters.reportType].label
      }

      const payload = {
         category_id: category_id,
         category_name: category_name,
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

   const onNextHandler = event => {
      event.preventDefault()
      if (selected != null) {
         const index = reportStore.field.findIndex(
            el => el.name === props.field
         )

         reportStore.field[index] = {
            ...reportStore.field[index],
            name: props.field,
            display_name: props.field,
            target_report_index: selected.report_index,
            target_report_name: selected.report_name,
            target_type: 'R',
            link_flag: true,
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
      } else
         snackbarState.openSnackbar(`${t('bam:SELECT_A_REPORT')}`, 'warning')
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
      <Fragment>
         <div className={classes.body}>
            <Typography variant='h5'>{t('bam:SELECT_ADD_REPORT')}</Typography>

            <div className={classes.toolbar}>
               <div className={classes.formSpacing}>
                  <SelectBox
                     list={reportList}
                     label='Report Category'
                     form={false}
                     value={inputParameters.reportType}
                     className={classes.inputBox}
                     onChange={event =>
                        setInputParameters({
                           ...inputParameters,
                           reportType: event.target.value
                        })
                     }
                  />
               </div>
               <SearchBox
                  clearSearchResult={clearSearchResult}
                  onSearchSubmit={onSearchSubmit}
                  name='search'
               />
            </div>
            <Grid
               container
               direction='row'
               justify='flex-end'
               alignItems='center'
            >
               <Grid item>
                  <Pagination
                     disabled_next={
                        apiData != null ? !apiData.enable_next : true
                     }
                     disabled_prev={
                        apiData != null ? !apiData.enable_prev : true
                     }
                     onChange={handlePagination}
                  />
               </Grid>
            </Grid>
            <div className={classes.tableContainer}>
               {isLoading.loading === false ? (
                  apiData != null ? (
                     <TableComponent
                        dynamicHeight='320px'
                        tableData={apiData != null ? apiData.reports : []}
                        headerData={headerData}
                        loading={false}
                        onChangeCheckbox={checkBoxHandler}
                        selectType='radio'
                     />
                  ) : (
                     <div style={{ height: '320px' }}>
                        <NotFound
                           message={t('bam:NO_REPORT_FOR_CATEGORY_MESSAGE')}
                        />
                     </div>
                  )
               ) : (
                  <div style={{ height: '320px', width: '700px' }}>
                     <Spinner message={isLoading.message} />
                  </div>
               )}
            </div>
         </div>
         <Divider fullWidth />
         <StyledDialogActions className={classes.actionBar}>
            <Button
               variant='outlined'
               onClick={() => props.normalDialog.closeDialog()}
            >
               {t('bam:LABEL_CANCEL')}
            </Button>
            <Button variant='contained' onClick={onNextHandler} color='primary'>
               {t('bam:ADD')}
            </Button>
         </StyledDialogActions>
      </Fragment>
   )
}

export default SelectReport
