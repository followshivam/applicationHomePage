import React, { useEffect, useState } from 'react'
import {
   makeStyles,
   Button,
   Pagination,
   PickList,
   Dropdown,
   NotFound,
   Spinner,
   IconImage,
   IconsButton,
   DynamicTable,
   Typography,
   useTheme,
   useMediaQuery,
   useTranslation
} from 'component'
import Drawer from '@material-ui/core/Drawer'
import { FilterBox } from './filter_input_screen'
import Chart from 'react-apexcharts'
import { ChartData, GetDownloadInput } from 'global/json'
import { SaveReport } from 'global/bam/api/ApiMethods'
import { useDispatch, useSelector } from 'react-redux'
import { ReportDetails } from 'redux/action'
import { useLayoutEffect } from 'react'
import { withRouter } from 'react-router'


const useStyles = makeStyles(theme => ({
   root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow : 'hidden',
      '& table': {
         // height:'100%'
      }
   },
   head: {
      backgroundColor: '#f0f0f0'
   }
}))
const useToolbarStyles = makeStyles(theme => ({
   root: {
      height: '24px',
      borderRadius: '5px'
   },
   buttonWrapper: {
      marginRight: '12px',
      padding: '2px 9px',
      // borderRadius: "3px",
      backgroundColor: theme.palette.common.white
   },
   graphContainer: {
      padding: theme.spacing(0, 1, 0, 1),
      textAlign: 'start'
      // minHeight: props => props.dynamicHeight,
      // height:"280px",
      // overflow: props => (props.type !== '' ? 'auto' : 'none')
   },
   heading_toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px',
      direction:props=>props.direction
   },
   child_toolbar1: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '30px'
   },
   secondHeader: {
      paddingLeft: '20px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      // justifyContent: "space-between",
      marginBottom: '5px',
      direction:props=>props.direction

   },
   actionWrapper: {
      display: 'flex',
      alignItems: 'center'
      // width: "75% !important"
   },
   filtersWrap: {
      display: 'flex',
      marginRight: '10px'
   },
   picklistWrap: {
      marginRight: '12px'
   },
   ApplyCancelWrap: {
      padding: ' 1px 10px !important'
   },
   child1_toolbar_left: {
      fontSize: '14px !important',
      fontWeight: '700 !important',
      whiteSpace: 'nowrap',
      color: '#000000 !important',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '4px 0px 4px 8px'
   },
   h6: {
      fontSize: '14px !important',
      fontWeight: '700 !important',
      whiteSpace: 'nowrap',
      color: '#000000 !important',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
   },
   child1_toolbar_right: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end',
      marginRight: '5px',
      alignItems: 'center'
   },
   child_toolbar2: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: '30px',
   },
   child2_toolbar_right: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      flexWrap: props => props.column_count !== '3' ? 'wrap' : 'nowrap',
      paddingRight: '12px'
   },
   button: {
      margin: '0 3px',
   },
   toggle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2px 1px 2px 1px',
      backgroundColor: '#e4e4e4',
      borderRadius: '3px',
      margin: '0 3px',
   },
   deleteButton: {
      margin:  '0 3px',
      // paddingBottom: '3px'
   }
}))

const Charts = props => {
   const { dynamicHeight = 300, type = '',  report_id,
      data, divId, drillHandler } = props
   const theme = useTheme();
   // index is here current report from redirected.
   const [vertically, setVertically] = useState(false);
   const matches = useMediaQuery(theme.breakpoints.down('sm'))

   useEffect(() => {
      setVertically(matches)
   }, [matches])

   const classes = useToolbarStyles({
      dynamicHeight: dynamicHeight,
      type: type,
   })
   const [chartData, setChartData] = useState({})
   const [size, setSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight
   });
   const [chartType, setChartType] = useState('')
   const [isLoading, setIsLoading] = useState({ msg: '', loading: true })
   const { loading, msg } = isLoading
   let is_valid = data && data.data && data.data.length > 0

   useLayoutEffect(() => {
      function updateSize() {
         const el = document.getElementById(divId ? divId : "1");
         if (el)
            setSize({ width: el.clientWidth, height: el.clientHeight });
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
   }, []);

   useEffect(() => {
      is_valid = data && data.data && data.data.length > 0
      if (is_valid) {
         let updatedData = { ...data }
         updatedData = {
            ...updatedData,
            chart_type:
               updatedData.chart_type === 'ring'
                  ? 'donut'
                  : updatedData.chart_type,
            events: {
               dataPointSelection: dataPointSelection
            },
            report_id : report_id,
            show_legend: !data.is_half ? size && (size.height <= 350 && size.width <= 500) ? false : true : true,
            legend_position:  !data.is_half && size && (size.height > 350 || size.width > 500) && (size.width > size.height) ? 'right' : data.legend_position
         }
         setChartType(
            updatedData.chart_type === 'ring' ? 'donut' : updatedData.chart_type
         )
         if (setChartData && ChartData && updatedData)
            setChartData(ChartData(updatedData))
      }
      console.log('reportId',report_id,typeof report_id)
      setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500)
   }, [data, size])


   const dataPointSelection = (e, chart, opts) => {
      if (data?.link_data[0]?.link_data_details !== undefined) {
         drillHandler(data?.link_data[0])
      }
   }
   return (
      <div id="chart" className={classes.graphContainer}>
         {isLoading.loading ? (
            <div style={{ height: '300' }}>
               <Spinner />
            </div>
         ) : !is_valid ? (
            <NotFound msg='' />
         ) : chartType === 'bar' ||
            chartType === 'donut' ||
            chartType === 'line' ||
            chartType === 'scatter' ||
            chartType === 'area' ||
            chartType === 'pie' ? (
            <Chart
               options={chartData ? chartData.options : null}
               series={chartData ? chartData.series : null}
               type={chartType ? chartType : 'bar'}
               height={
                  type !== ''
                     ? chartType === 'donut' || chartType === 'pie'
                        ? size.height - 50
                        : size.height - 50
                     : chartType === 'donut' || chartType === 'pie'
                        ? document.body.clientHeight - 40
                        : document.body.clientHeight - 60
               }
            />
         ) : (
            <NotFound msg='' />
         )}
      </div>
   )
}

const SecondHeader = props => {
   const {
      filterList = null,
      t = null,
      showPinnedConfig = null,
      direction,
      formNewData = null,
      loader,
      setIsLoading = null,
      onChangeEvent = null
   } = props
   const classes = useToolbarStyles({ direction })
   const { loading, msg } = loader

   const filterHandler = res => {
      let data = res.report_input_fields
      let filterData = [...formNewData]
      for (let i in data) {
         for (let j = 0; j < filterData.length; j++) {
            if (data[i].display_name === filterData[j].display_name) {
               filterData[j].value = data[i].value
            }
         }
      }
      setIsLoading({ ...loader, loading: true })
      onChangeEvent('generate', filterData)
   }

   return (
      <form className={classes.secondHeader}>
         <div className={classes.actionWrapper}>
            {/* <div className={classes.filtersWrap}>
          <span>
            <IconImage url={"${process.env.REACT_APP_CONTEXT_PATH}/icons/filter2.svg"} height={16} width={16} />
          </span>
          <span style={{ marginLeft: "8px" }}>
            <IconImage url={"${process.env.REACT_APP_CONTEXT_PATH}/icons/filter.svg"} height={16} width={16} />
          </span>
        </div> */}
            {/* <div className={classes.picklistWrap} >
          <PickList label="Department" name="report_name" value={"processing"} fullWidth={true} form={false} />
        </div>
        <div className={classes.picklistWrap}>
          <PickList label="Deleted Flag" value={"Y"} fullWidth={true} form={false} />
        </div> */}
         </div>

         {/* </form> */}
         {/* <form className={classes.secondHeader}> */}
         {/* <div className={classes.actionWrapper}> */}
         <div className={classes.filtersWrap}>
            {showPinnedConfig?.pinned === true ? (
               <React.Fragment>
                  {filterList?.map((res, key) => {
                     return (
                        <React.Fragment>
                           {res.pinned === true ? (
                              <Button
                                 className={classes.buttonWrapper}
                                 variant='outlined'
                                 color='primary'
                                 onClick={() => filterHandler(res)}
                              >
                                 <Typography variant='subtitle1'>
                                    {res?.filter_name}
                                 </Typography>
                              </Button>
                           ) : null}
                        </React.Fragment>
                     )
                  })}
               </React.Fragment>
            ) : null}
         </div>
         {/* </div> */}

         {/* <div className={classes.ApplyCancelWrap}>
        <Button size="small">Cancel </Button>
        <Button size="small" style={{ background: "#F46A0F", color: "white" }}>Apply </Button>
      </div> */}
      </form>
   )
}

const EnhancedTableToolbar = props => {
   const {
      data = null,
      t = null,
      formNewData = null,
      reportId = null,
      setIsLoading = null,
      onChangeEvent = null,
      showPinnedConfig = null,
      filterList = null,
      loader,
      direction,
      onRefresh = null,
      filter_enable = false,
      showGraph = false,
      type = '',
      redirectedData,
      setDashboardRedirectBack,
      column_count
   } = props

   const classes = useToolbarStyles({ column_count, direction })
   const { base_report_type = '', report_title = '' } = data
   // const { b_enable_prev, b_enable_next, b_show_batching } = data?.table?.batch_info
   const { loading, msg } = loader
   const [inputData, setInputData] = React.useState(GetDownloadInput)


   const onDownload = type => {
      let data = {
         ...inputData,
         act: 7,
         save_format: type,
         report_index: reportId
      }
      SaveReport(data)
         .then(res => {
            if (res != null) {
               var blob = new Blob([res], { type: 'application/pdf' })
               var link = document.createElement('a')
               link.href = window.URL.createObjectURL(blob)
               var fileName = report_title + '.' + type.toLowerCase()
               link.download = fileName
               link.click()
            }

            //  var fileDownload = require('js-file-download');
            //  fileDownload(bufferObj, report_title + '.' + type.toLowerCase());
         })
         .catch(err => { })
   }

   const dispatch = useDispatch()
   const redirectHandler = () => {
      if (redirectedData && redirectedData.reportIndex && type === '') {
         props.history.push({ pathname: `/bam/generate/${redirectedData.reportIndex}` })
      } else if (redirectedData && redirectedData.reportIndex && type === 'dashboard') {
         setDashboardRedirectBack({ report_index: redirectedData.reportIndex })
      }
   }

   const [ReportDetail] = useSelector(state => {
      return [state.reportDetails]
   })
   return (
      <React.Fragment>
         <div className={classes.heading_toolbar}>
            <div className={classes.child_toolbar1}>
               <div className={classes.child1_toolbar_left}>
                  <label className={classes.h6}>{report_title}</label>
                  <div style={{ marginLeft: '8px' }}>
                     <IconImage
                        style={{ marginRight: '8px' }}
                        url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/refresh.svg`}
                        height={16}
                        width={16}
                        onClick={() => onRefresh('refresh')}
                     />
                     {/* <IconsButton
                        type='LaunchIcon'
                        onClick={() => {
                           dispatch(
                              ReportDetails({
                                 ...ReportDetail,
                                 [`${report_title}`]: `${report_title} test for dummy`
                              })
                           )
                           window.open(
                              `${process.env.REACT_APP_CONTEXT_PATH}/test`,
                              '_blank',
                              'top=400,left=400,width=850,height=590'
                           )
                        }}
                     /> */}
                  </div>
               </div>
               <div className={classes.child1_toolbar_right}></div>
            </div>
            <div className={classes.child_toolbar2}>
               <div className={classes.child2_toolbar_right}>
                  {redirectedData && (redirectedData.reportIndex) && <IconsButton
                     className={classes.button}
                     type='ArrowBackIcon'
                     onClick={redirectHandler}
                  />}
                  {/* <IconsButton
                     className={classes.button}
                     type='PrintOutlinedIcon'
                     onClick={props.printHandler}
                  /> */}
                  {type === 'dashboard' && !(redirectedData && redirectedData.reportIndex) ? (
                     <div className={classes.deleteButton}>
                        <IconImage
                           height={16}
                           width={16}
                           url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/modify.svg`}
                           onClick={() => props.editReportInstance()}
                        />
                     </div>
                  ) : null}
                  {filter_enable && (
                     <IconsButton
                        style={{ margin: "0px 8px" }}
                        type='FilterListIcon'
                        onClick={() => props.drawerView(true)}
                     />
                  )}
                  <span className={classes.button}>
                     <Dropdown
                        list={[
                           {
                              id: 1,
                              label: `${t('bam:HTML')}`,
                              value: 'HTML',
                              action: () => {
                                 props.handlePrint(
                                    'download',
                                    'HTML'
                                 ) /* onDownload("HTML") */
                              }
                           },
                           // {
                           //    id: 2,
                           //    label: `${t('bam:PDF')}`,
                           //    value: 'PDF',
                           //    action: () => {
                           //       onDownload(
                           //          'PDF'
                           //       ) /* props.generatePostRequest(window, `${process.env.REACT_APP_CONTEXT_PATH}/bam-ws/app/save_report`, 'PDF')  */
                           //    }
                           // },
                           {
                              id: 3,
                              label: `${t('bam:XLSX')}`,
                              value: 'XLSX',
                              action: () => {
                                 onDownload('XLSX')
                              }
                           },
                           {
                              id: 4,
                              label: `${t('bam:CSV')}`,
                              value: 'CSV',
                              action: () => {
                                 onDownload('CSV')
                              }
                           },
                           {
                              id: 5,
                              label: `${t('bam:TXT')}`,
                              value: 'TXT',
                              action: () => {
                                 onDownload('TXT')
                              }
                           }
                        ]}
                        list_type=''
                        type='icons'
                        image_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/download_grey.svg`}
                     />
                  </span>
                  {/* <Dropdown list={List} type="icons" endIcon="MoreVertIcon" /> */}

                  {base_report_type === 'TG' ? (<div className={classes.toggle}>

                     <React.Fragment>
                        <IconImage
                           selected={!showGraph}
                           disabled={!showGraph}
                           url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/toggle_list_unselected.svg`}
                           height={14}
                           width={16}
                           onClick={() => {
                              props.toggleView(false)
                              props.ChangeHandler('tab')
                           }}
                        />

                        <IconImage
                           url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/toggle_graph_unselected.svg`}
                           selected={showGraph}
                           disabled={showGraph}
                           height={14}
                           width={16}
                           onClick={() => {
                              props.toggleView(true)
                              props.ChangeHandler('graph')
                           }}
                        />
                     </React.Fragment>
                  </div>) : null}
                  {type === 'dashboard' ? (
                     <div className={classes.deleteButton}>
                        <IconImage
                           height={16}
                           width={16}
                           url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/delete_grey.svg`}
                           onClick={() => props.deleteReportInstance()}
                        />
                     </div>
                  ) : null}
                  {data?.table?.batch_info?.b_show_batching || data && data?.batch_info && data?.batch_info?.b_show_batching ? (
                     // <Pagination
                     //    disabled_prev={!data?.table?.batch_info.b_enable_prev}
                     //    disabled_next={!data?.table?.batch_info.b_enable_next}
                     //    batchVal={data?.table?.batch_values_xml}
                     //    onChange={props.ChangeHandler}
                     // />

                     <Pagination
                        disabled_prev={!(data?.table?.batch_info.b_enable_prev || data && data?.batch_info && data?.batch_info.b_enable_prev)}
                        disabled_next={!(data?.table?.batch_info.b_enable_next || data && data?.batch_info && data?.batch_info.b_enable_next)}
                        batchVal={(data?.table?.batch_values_xml || data && data?.batch_info && data?.batch_values_xml)}
                        onChange={props.ChangeHandler}
                     />
                  ) : null}
               </div>
            </div>
         </div>
         {filterList.length > 0 && <SecondHeader
            t={t}
            filterList={filterList}
            showPinnedConfig={showPinnedConfig}
            formNewData={formNewData}
            loader={loader}
            setIsLoading={setIsLoading}
            onChangeEvent={onChangeEvent}
            direction={direction}
         />}
      </React.Fragment>
   )
}

function ReportScreen(props) {
   const {
      data = null,
      formNewData = null,
      showPinnedConfig = null,
      filterList = null,
      filterData = [],
      snackbarState = null,
      dynamicHeight = '100%',
      onChangeEvent = null,
      filter_enable = false,
      toolbar = true,
      setFilterList = null,
      setShowPinnedConfig = null,
      type,
      setDashboardRedirect,
      dashboardRedirect,
      setDashboardRedirectBack,
      dashboardRedirectBack,
      redirectedData,
      setRedirectedData,
      divId,
      column_count,
      t = null
   } = props

   const [direction, setDirection] = useState(`${t('bam:HTML_DIR')}`);
   const classes = useStyles()
   const [reportId, setReportId] = useState(props?.report_id)
   const [reportData, setReportData] = useState({})
   const [isLoading, setIsLoading] = useState({ msg: '', loading: true })
   const { loading, msg } = isLoading
   const [showGraph, setShowGraph] = useState()
   const [globalSetting] = useSelector(state => {
      return [state.globalSettings]
   })

   useEffect(() => {
      setReportData(data)
      setShowGraph(data.table == null ? true : false)
      setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500)
   }, [data])

   const [showDrawer, setShowDrawer] = useState(false)
   const ChangeHandler = (key, param, data) => {
      setIsLoading({ ...isLoading, loading: true })
      onChangeEvent(key, param, data)
   }

   const filterChangeHandler = params => {
      let validateInput = params.filter(res => res.value === '').length > 0
      if (validateInput) {
         snackbarState.openSnackbar(
            `${t('bam:ALL_FILEDS_MUST_BE_FILLED')}`,
            'error',
            5000
         )
         return false
      }
      setIsLoading({ ...isLoading, loading: true })
      onChangeEvent('generate', params)
      drawerCloseHandler()
   }
   const drawerCloseHandler = () => {
      setShowDrawer(false)
   }

   const dispatch = useDispatch()
   const [serverOrder, setServerOrder] = useState('asc')
   const [serverOrderBy, setServerOrderBy] = useState('');
   useEffect(() => {
      window.onbeforeunload = function () {
         dispatch(ReportDetails({}))
         return
      }
      return () => {
         window.onbeforeunload = null
      }
   }, [true])

   useEffect(() => {
      if (serverOrderBy !== '') {
         let params = {
            order: serverOrder,
            orderby: serverOrderBy
         }
         onChangeEvent('sort', params)
      }
   }, [serverOrder, serverOrderBy])

   const drillHandler = (data) => {
      const reportData = data.link_data_details;
      dispatch(ReportDetails({ [`${reportData.report_index}`]: reportData }))
      if (data.open_in_new_window) {
         let new_window = window.open(`${process.env.REACT_APP_CONTEXT_PATH}/bam/generate/${reportData.report_index}`, "_blank", "top=400,left=400,width=850,height=590")
         new_window.reportData = data;
      } else if (!data.open_in_new_window && !type) {
         props.history.push({ pathname: `/bam/generate/${reportData.report_index}`, state: { reportData: { reportData: data, reportIndex: reportId } } })
      } else if (!data.open_in_new_window && type === 'dashboard' && setDashboardRedirect) {
         setDashboardRedirect({ reportData: { reportData: data, reportIndex: reportId } })
      }
   }

   useEffect(() => {
      let redirectedData;
      if (window.reportData) {
         redirectedData = window.reportData
      } else if (props.location.state && props.location.state.reportData) {
         redirectedData = props.location.state.reportData
      }
      if (setRedirectedData && redirectedData)
         setRedirectedData(redirectedData)
   }, [props.location.state, window.reportData])

   return (
      <div className={classes.root} id="1">
         {filter_enable ? (
            <Drawer
               anchor={'right'}
               open={showDrawer}
               onClose={drawerCloseHandler}
            >
               <FilterBox
                  data={filterData}
                  reportId={reportId}
                  setFilterList={setFilterList}
                  showPinnedConfig={showPinnedConfig}
                  filterList={filterList}
                  snackbarState={snackbarState}
                  onFormSubmit={filterChangeHandler}
                  drawer={true}
                  onDrawerClose={drawerCloseHandler}
                  setShowPinnedConfig={setShowPinnedConfig}
               />
            </Drawer>
         ) : null}
         {toolbar ? (
            <EnhancedTableToolbar
               t={t}
               column_count={column_count}
               data={reportData}
               direction={direction}
               printHandler={props.handlePrint}
               generatePostRequest={props.generatePostRequest}
               loader={isLoading}
               setIsLoading={setIsLoading}
               type={type}
               dashboardRedirectBack={dashboardRedirectBack}
               setDashboardRedirectBack={setDashboardRedirectBack}
               redirectedData={redirectedData}
               setRedirectedData={setRedirectedData}
               formNewData={formNewData}
               filterList={filterList}
               showPinnedConfig={showPinnedConfig}
               reportId={reportId}
               toggleView={val => {
                  setShowGraph(val)
               }}
               drawerView={val => {
                  setShowDrawer(val)
               }}
               showGraph={showGraph}
               ChangeHandler={ChangeHandler}
               onChangeEvent={onChangeEvent}
               onRefresh={ChangeHandler}
               filter_enable={filter_enable}
               deleteReportInstance={props.deleteReportInstance}
               editReportInstance={props.editReportInstance}
               {...props}
            />
         ) : null}
         {isLoading.loading ? (
            <div style={{ height: dynamicHeight }}>
               <Spinner msg={msg} />
            </div>
         ) : showGraph ? (
            <Charts {...props}
               t={t}

               data={reportData}
               divId={divId}
               drillHandler={drillHandler}
            />
         ) : (
            <DynamicTable
               {...props}
               divId={divId}
               direction={`${t('bam:HTML_DIR')}`}
               ChangeHandler={ChangeHandler}
               showBatching={data?.table?.batch_info?.b_show_batching}
               data={reportData}
               type={type}
               serverOrder={serverOrder}
               serverOrderBy={serverOrderBy}
               setServerOrder={setServerOrder}
               setServerOrderBy={setServerOrderBy}
               drillHandler={drillHandler}
            />
         )}
      </div>
   )
}

export default withRouter(ReportScreen)