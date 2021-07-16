import React, { useEffect, useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Spinner, NotFound, makeStyles, IconImage, useTranslation } from "component";
import { ActReportInstance, GetReportGenerateData } from "global/bam/api/ApiMethods";
import { ReportGenerateJson, ChartData, GetDownloadInput } from "global/json";
import { EmptyObject } from "global/methods";
import ApexCharts from "apexcharts";
import { useLocation, useParams } from "react-router-dom";
import { SaveReport } from "global/bam/api/ApiMethods";
import { afterLoadWindow, PrintReport } from "./print_report";
const FilterInputScreen = lazy(() => import("./filter_input_screen"));
const ReportScreen = lazy(() => import("./report_screen"));
const ModifyReportInstance = lazy(() => import("./../../Bam_Dashboard/ModifyReportInstance/modify_report_instance"))
const useStyle = makeStyles(theme => ({
  deleteButton: {
    margin: '0 8px',
  },
  error_page: {
    display: "flex",
    height: "30px",
    padding: "4px",
    justifyContent: "flex-end"
  }
}))
const ReportGenerate = (props) => {
  const { dynamicHeight = "100%", type = "", input_info = {}, onCallBack = null, divId='1',column_count = '3',
    report_data = { report_instance_id: null } } = props;
  const location = useLocation();
  const [reportData, setReportData] = useState({});
  const [filterData, setFilterData] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [showPinnedConfig, setShowPinnedConfig] = useState([]);
  const [formNewData, setFormNewData] = useState();
  const [step, setStep] = useState(0);
  const [notFound, setNotFound] = useState(false);

  const [activeScreen, setActiveScreen] = useState("T")
  const [inputData, setInputData] = useState(ReportGenerateJson);

  const [globalSetting, snackbarState] = useSelector(state => {
    return [state.globalSettings, state.snackbarState];
  });

  const { t, i18n } = useTranslation(globalSetting.locale_module)

  const currentLang = localStorage.getItem('locale') && localStorage.getItem('locale')
  useEffect(() => {
    i18n.changeLanguage(currentLang)
  }, [currentLang])
  // console.log(props.currentLang)

  const [isLoading, setIsLoading] = useState({ msg: `${t('bam:LOADING')}...`, loading: true });
  const { loading, msg } = isLoading;
  const [isFromExt, setIsFromExt] = useState(false);
  const [showFiltersExt, setShowFilterExt] = useState(true);
  const [report_id, setReport_Id] = useState();
  const [dashboardRedirect, setDashboardRedirect] = useState();
  const [dashboardRedirectBack, setDashboardRedirectBack] = useState()
  const [redirectedData, setRedirectedData] = useState();
  /**
  * 
  * use report_id instead of props.params.match.id
  * 
  */

  useEffect(() => {

    const id = props.match.params.id;
    if (id) {
      const index = id.indexOf(';');
      if (index > -1) {
        setReport_Id(id.substring(0, index))
      } else {
        setReport_Id(id);
      }
    }
    setIsLoading({...isLoading,loading: true})
  }, [props.match.params.id])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.has('b-sid') && params.get('b-sid') !== '') {
      setIsFromExt(true);
      if (localStorage.getItem('b-sid') === null || localStorage.getItem('b-sid') === '') {
        localStorage.setItem('b-sid', params.get('b-sid'))
      }
    }
  }, [location])

  useEffect(() => {
    if (dashboardRedirect) {
      const reportData = dashboardRedirect.reportData;
      const data = reportData?.reportData?.link_data_details;
      setIsLoading({...isLoading,loading: true})
      setReport_Id(data?.report_index)
      setRedirectedData(reportData)
    }
  }, [dashboardRedirect])

  useEffect(() => {
    if (dashboardRedirectBack) {
      setIsLoading({...isLoading,loading: true})
      setReport_Id(dashboardRedirectBack.report_index);
      setRedirectedData({})
    }
  }, [dashboardRedirectBack])
  useEffect(() => {
    let act = "0";
    let sub_action = "0";
    let params = {};
    if (type === "dashboard" && input_info.is_param) {
      params = { params: input_info.params }
      setFilterData({ ...filterData, report_input_fields: input_info.params })
    }
    if (type === "dashboard" && input_info.is_param != null) {
      if (input_info.default_display === "T")
        act = "6"
      else
        act = "5"
    }
    if (report_id !== undefined) {
      setInputData({ ...inputData, act: act, sub_action: sub_action, param_info: params, report_index: report_id });
    }

  }, [report_id]);

  useEffect(() => {
    if (inputData.report_index !== "") {
      getData();
    }
  }, [inputData]);

  const checkForParamsInRequest = data => {
    if (EmptyObject(reportData) && isFromExt) {
      const searchParams = new URLSearchParams(location.search)
      const reportInputFields = data.report_input_fields;
      const input_req = data.input_req;
      const params = [];
      let isAnyParamMatched = false;
      if (searchParams && reportInputFields && input_req === true) {
        reportInputFields.forEach(reportInputField => {
          if (searchParams.has(reportInputField.display_name) || searchParams.has(reportInputField.display_name.toUpperCase())) {
            isAnyParamMatched = true;
            params.push({ ...reportInputField, value: searchParams.get(reportInputField.display_name) && searchParams.get(reportInputField.display_name.toUpperCase()) })
          } else {
            params.push(reportInputField)
          }
        });
      }
      setIsFromExt(false);
      return { isAnyParamMatched: isAnyParamMatched, params: params };
    }
  }

  const getData = () => {
    setNotFound(false);
    GetReportGenerateData({ ...inputData, report_instance_id: report_data.report_instance_id })
      .then(res => {
        if (res != null && res.status.maincode === "0") {
          let data = res.data;
          if (data.input_req != null) {
            setStep(1);
            if (isFromExt) {
              const { isAnyParamMatched, params } = checkForParamsInRequest(data);
              if (isAnyParamMatched) {
                setShowFilterExt(false);
                ChangeHandler('generate', params);
              } else {
                setFilterData(data);
              }
            } else {
              setFilterData(data);
            }
          }
          else {
            setStep(2);
            if (!EmptyObject(inputData.param_info)) {
              setFilterData({ ...filterData, report_input_fields: inputData.param_info.params })
            }
            setReportData(data);
          }
          setIsLoading({ ...isLoading, loading: false });
        }
        else {
          snackbarState.openSnackbar(res.status.errormsg, "error", 5000);
          setNotFound(true);
          setIsLoading({ ...isLoading, loading: false });
        }
      })
      .catch(err => {
        // snackbarState.openSnackbar("Something went wrong","error")
      });
  }

  const ChangeHandler = (key, param) => {
    if (key === "prev") {
      setInputData({ ...inputData, act: "3", sub_action: "0", current_type: activeScreen, batch_info: param })
    }
    if (key === "next") {
      setInputData({ ...inputData, act: "2", sub_action: "0", current_type: activeScreen, batch_info: param });
    }
    if (key === "graph") {
      setActiveScreen('G')
      setInputData({ ...inputData, act: "5", type: "TG", current_type: "T", sub_action: "0" });
    }
    if (key === "tab") {
      setActiveScreen('T')
      setInputData({ ...inputData, act: "6", type: "TG", current_type: "G", sub_action: "0" });
    }
    if (key === "generate") {

      setInputData({ ...inputData, act: "0", sub_action: "1", param_info: { params: param } });
    }
    if (key === "sort") {
      setInputData({
        ...inputData, act: "0", sub_action: "1",
        // current_type: "T",
        new_sort_field: param.orderby,
        new_sort_order: param.order === "asc" ? "A" : "D"
      }
      );
    }
    if (key === "refresh") {
      if (EmptyObject(inputData.param_info)) {
        getData()
        // setInputData({ ...inputData, act: "0", sub_action: "0", param_info: {} });
      }
      else {
        setInputData({ ...inputData, act: "0", sub_action: "1" });
      }
    }
  }

  const handlePrint = (functionType, documentType) => {
    if (activeScreen === "T") {
      GetReportGenerateData({ ...inputData, act: "5", type: "TG", current_type: "T", sub_action: "0", report_instance_id: report_data.report_instance_id })
        .then(res => {
          if (res != null && res.status.maincode === "0")
            getBuffer(res.data, functionType, documentType)
          else
            snackbarState.openSnackbar(res.status.errormsg, "error", 5000);
        })
        .catch(err => snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, "error"));
    } else
      getBuffer(reportData, functionType, documentType)
  }

  const getBuffer = (data, functionType, documentType) => {
    let updatedData = { ...data }
    if (updatedData.chart_type !== undefined) {
      updatedData = { ...updatedData, chart_type: updatedData.chart_type === "ring" ? "donut" : updatedData.chart_type }
      let chartData = ChartData(updatedData);

      const el = document.getElementById('chart_test')

      let options = {
        ...chartData.options,
        chart: {
          ...chartData.options.chart,
          animations: {
            enabled: false,
          }
        },
        legend: {
          ...chartData.options.legend,
          fontSize: '18px',
        },
        series: chartData.series
      }

      var chart = new ApexCharts(el, options);
      chart.render()

      chart.dataURI().then(({ imgURI }) => {
        callPrintApiHandler(imgURI, functionType, documentType)
      })
      chart.destroy();

    } else {
      callPrintApiHandler('', functionType, documentType)
    }
  }

  const callPrintApiHandler = (buffer, functionType, documentType) => {
    let data = {
      ...GetDownloadInput,
      act: 7,
      save_format: documentType ? documentType : 'HTML',
      report_index: report_id,
      print_flag: functionType == "download" ? false : true,
      graph_buffer: buffer
    }
    SaveReport(data)
      .then(res => {
        if (res != null) {
          if (functionType == "download") {
            var blob = new Blob([res], { type: "application/pdf" });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            var fileName = reportData?.report_title + '.' + documentType.toLowerCase();
            link.download = fileName;
            link.click();
          } else {
            localStorage.setItem('print', res)
            window.open(`${process.env.REACT_APP_CONTEXT_PATH}/bam/generate/${report_id}/print`, "_blank", "top=400,left=400,width=850,height=590")
          }
        }
      })
      .catch(err => {
        console.log('err : ', err);
      });
  }

  const generatePostRequest = (window, sURL, type) => {
    handlePrint();
    let formElement = window.document.getElementById("postSubmit");
    if (formElement != undefined)
      window.document.body.removeChild(formElement);
    formElement = window.document.createElement("form");
    formElement = window.document.body.appendChild(formElement);
    formElement.action = sURL;
    formElement.encoding = 'application/x-www-form-urlencoded';
    formElement.method = "post";
    formElement.id = 'postSubmit';
    let listParam = new Object();

    listParam = {
      ...GetDownloadInput, act: 7,
      save_format: type,
      report_index: report_id,
      "b-sid": localStorage.getItem("b-sid"),
    }

    Object.entries(listParam).forEach(
      ([key, value]) => {
        let srcInput = window.document.createElement("input");
        srcInput.setAttribute("type", "hidden");
        srcInput.setAttribute("name", key);
        srcInput.setAttribute("id", key);
        srcInput.setAttribute("value", value);
        formElement.appendChild(srcInput);
      }
    );

    window.document.forms['postSubmit'].submit();
  }

  const deleteReportInstance = () => {
    ActReportInstance({ opr: '2', report_instance_id: report_data.report_instance_id }).then(response => {
      if (response != null && response.status.maincode === "0") {
        onCallBack()
        snackbarState.openSnackbar(`${t('bam:REPORT_INSTANCE_REMOVED_SUCCESS')}`, 'success');
      }
      else if (response != null && response.status.maincode !== "0") {
        snackbarState.openSnackbar(response.status.errormsg, 'error');
      }
    }).catch(err => { })
  }

  const normalDialogState = useSelector(store => store.normalDialogState);
  const editReportInstance = () => {
    normalDialogState.openDialog(<Suspense fallback={<div><Spinner /></div>}><ModifyReportInstance onCallBack={onCallBack} report_instance_id={report_data.report_instance_id} /></Suspense>)
  }

  const Error = () => {
    const classes = useStyle();
    const { type = "", dynamicHeight = null } = props;
    return (<div style={{ height: props.dynamicHeight }}>
      {type === "dashboard" ? <div className={classes.error_page}><div className={classes.deleteButton}>
        <IconImage height={16} width={16} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/delete_grey.svg`} onClick={deleteReportInstance} />
      </div></div> : null}
      <NotFound />
    </div>)
  }

  return (
    <React.Fragment>
      {
        loading
          ? <div style={{ height: dynamicHeight }}><Spinner msg={msg} /></div>
          : notFound ? <Error {...props} /> : <React.Fragment>

            {step === 1 && showFiltersExt && <Suspense fallback={<div style={{ height: dynamicHeight }}><Spinner msg={msg} /></div>}>
              <FilterInputScreen
                divId={divId}
                {...props} report_id={report_id}
                data={filterData} setFilterList={setFilterList} filterList={filterList}
                setShowPinnedConfig={setShowPinnedConfig} setFormNewData={setFormNewData}
                onChangeEvent={ChangeHandler} snackbarState={snackbarState} /></Suspense>}

            {step === 2 && <Suspense fallback={<div style={{ height: dynamicHeight }}><Spinner msg={msg} /></div>}>
              <ReportScreen {...props} report_id={report_id}
                divId={divId}
                deleteReportInstance={deleteReportInstance}
                type={type}
                column_count={column_count}
                redirectedData={redirectedData}
                setRedirectedData={setRedirectedData}
                setDashboardRedirect={setDashboardRedirect}
                setDashboardRedirectBack={setDashboardRedirectBack}
                dashboardRedirect={dashboardRedirect}
                formNewData={formNewData} showPinnedConfig={showPinnedConfig}
                filterList={filterList} editReportInstance={editReportInstance}
                filter_enable={type !== "dashboard" && !EmptyObject(inputData.param_info)}
                data={reportData} filterData={!EmptyObject(inputData.param_info) && filterData}
                onChangeEvent={ChangeHandler} snackbarState={snackbarState}
                handlePrint={handlePrint} setFilterList={setFilterList} generatePostRequest={generatePostRequest}
                setShowPinnedConfig={setShowPinnedConfig} t={t}
              /></Suspense>}
          </React.Fragment>
      }
      <div id="chart_test" className="chartsTest" width="100%" style={{ display: 'hidden' }}></div>
    </React.Fragment>
  )
}
export default ReportGenerate;