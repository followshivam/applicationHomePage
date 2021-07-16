import React, { useEffect, useState } from "react";
import { PickList, makeStyles, useTranslation, Typography, DialogActions, Button, PickListTable, InputBox, TableComponent, NotFound, Spinner, DatePickers } from "component";
import { useSelector, useDispatch } from "react-redux";
import { CreateTrend } from "redux/action";
import { GetPicklistData, GetReportGenerateData } from "global/bam/api/ApiMethods";
import { PicklistInputJson, ReportGenerateJson } from "global/json";
const useStyles = makeStyles((theme) => ({
    root: {
        margin: `0px ${theme.spacing(2)}px`,
        height: '70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    input_width: {
        width: "240px"
    },
    form: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    inputBox: {
        width: '200px'
    }
}))
const TrendsPreferences = props => {

    const {
        onNext = null,
        onPrev = null,
        onCancel = null,
    } = props
    const classes = useStyles();
    const dispatch = useDispatch()

    const [globalSetting, trendState, snackbarState] = useSelector(state => {
        return [state.globalSettings, state.createTrendsState, state.snackbarState];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const [state, setState] = useState();
    useEffect(() => {
        // trendState.report_instance_list[]
        setState({ ...trendState.report_instance_list })
    }, [trendState])

    // console.log(state);

    const blankNullCheck = field => {
        if (field != null && field !== "") return true;
        return false;
    }

    const inputIsValid = () => {
        if (tableData != null)
            for (let i = 0; i < tableData.length; i++) {
                // console.log(tableData[i])
                if (tableData[i].required === true && blankNullCheck(tableData[i].value) === false) {
                    snackbarState.openSnackbar(`${tableData[i].field_display_name} is required, please enter to proceed`, 'warning', 5000);
                    return false;
                }
            }
        return true;
    }

    const onNextHandler = event => {
        event.preventDefault();

        if (inputIsValid()) {
            let input_fields = tableData != null ? tableData.map((item, index) => ({
                name: item.field_name,
                type: item.field_type2,
                length: item.field_length,
                display_name: item.field_display_name,
                value: item.value
            })) : [];

            dispatch(CreateTrend({
                ...trendState,
                ...state,
                current_step: trendState.current_step + 1,
                input_fields: input_fields,
            }))
        }
        return;
    }


    const actionButtonAddPageCommon = [{
        label: `${t('bam:LABEL_CANCEL')}`,
        action: onCancel,
        variant: "outlined",
        color: "secondary",
        type: "button"
    },
    {
        label: `${t('bam:BUTTON_PREVIOUS')}`,
        action: onPrev,
        variant: "outlined",
        color: "primary",
        type: "button"
    },
    {
        label: `${t('bam:BUTTON_NEXT')}`,
        action: onNextHandler,
        variant: "contained",
        color: "primary",
        type: "button",
        // onClick: ,
    },]

    const [tableData, setTableData] = useState();
    const [isLoading, setIsLoading] = useState({ loading: true, mssg: 'Building Component.' });

    useEffect(() => {
        getData();
    }, [])
    const getTypeFromId = id => {
        switch (id) {
            case "8":
                return `${t('bam:TEXT')}`;
            case "9":
                return `${t('bam:TIME')}`;
            case "2":
                return `${t('bam:INTEGER')}`;
            case "3":
                return `${t('bam:DECIMAL')}`;
            case "50":
                return `${t('bam:SHORT_DATE')}`
            default:
                return id;
        }
    }
    const getFormElementValueFromDisplayName = (display_name, filter) => {
        let value = null;
        for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].display_name === display_name) {
                value = tableData[i].value;
            }
        }
        if ((value == null || value === "") && filter !== true)
            snackbarState.openSnackbar(`Specify value for ${display_name} first!`, 'warning', 3000);
        return value ? value : "";
    }

    const picklistReportGenerate = (index, input_data, filter, params = null) => {
        let data = input_data.custom_picklist_def
        let sub_action = 0;
        let param_info = [];
        if (input_data.custom_picklist_def.report_input_mappings != null) {
            sub_action = 1;
            param_info = input_data.custom_picklist_def.report_input_mappings.map(field => ({
                display_name: field.name,
                value: getFormElementValueFromDisplayName(field.name, filter)
            }));
        }

        if (filter === true && params != null) {
            let success = false;
            for (let i = 0; i < param_info.length; i++) {
                if (param_info[i].display_name === params.display_name) {
                    param_info[i].value = params.value;
                    success = true;
                    break;
                }
            }
            if (!success)
                param_info = [...param_info, params];
        }

        let inputData = {
            ...ReportGenerateJson,
            act: 0,
            sub_action: sub_action,
            report_index: data.rpt_id,
            param_info: { params: param_info },
            report_output_category: 'PR',
        }

        let prevData = [...tableData]
        prevData[index] = {
            ...prevData[index],
            loading: true,
        }

        setTableData(prevData)

        GetReportGenerateData(inputData)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    let data = res.data;
                    let prevData = [...tableData]
                    prevData[index]["list"] = data;
                    prevData[index]["loading"] = false;
                    setTableData(prevData)
                }
                else {
                    let data = res.status;
                    let prevData = [...tableData]
                    prevData[index]["error_msg"] = data.errormsg;
                    prevData[index]["loading"] = false;
                    setTableData(prevData)
                }
            })
            .catch(err => { });
    }

    const getIndexFromKeyName = keyName => {
        for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].field_display_name === keyName)
                return i;
        }
        return -1;
    }
    // console.log(tableData)
    const getValueByMappedName = (val, value, delimiter) => {
        console.log(val, value);
        let valueString = [];

        for (let i = 0; i < val.length; i++) {
            valueString.push(val[i].val[value]);
        }

        valueString = valueString.join(delimiter);
        // console.log(valueString);
        return valueString;
    }
    const onChangePicklistInput = (res, val, key, type, delimiter) => {
        let formInput = [...tableData]
        if (type === "report") {
            // formInput[key] = { ...formInput[key], display_name: res.display_name, name: res.name, value: val.val[res.custom_picklist_def.report_output_mappings[0].mapped_name] }
            for (let i = 0; i < res.custom_picklist_def.report_output_mappings.length; i++) {
                let keyName = res.custom_picklist_def.report_output_mappings[i].field.name;
                let index = getIndexFromKeyName(keyName);
                console.log(keyName, index);
                if (index !== -1) {
                    formInput[index] = { ...formInput[index], value: getValueByMappedName(val, res.custom_picklist_def.report_output_mappings[i].mapped_name, delimiter) }
                }
            }
        }
        else if (type === "table")
            formInput[key] = { ...formInput[key], display_name: res.display_name, name: res.name, value: val.value }
        setTableData(formInput)
    }

    const picklistTableData = (index, input_data, params) => {
        let input_param = [...tableData]
        input_param[index]["loading"] = true;
        setTableData(input_param)
        let { picklist_column_name } = input_data;
        let inputData = { ...PicklistInputJson, column_name: picklist_column_name, table_name: picklist_column_name.split(".")[0] }
        if (params === "next")
            inputData = { ...inputData, opr: "2", last_value: tableData[index].list.last_value }
        else if (params === "prev")
            inputData = { ...inputData, opr: "1", first_value: tableData[index].list.first_value }
        GetPicklistData(inputData)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    let data = res.data;
                    let prevData = [...tableData]
                    prevData[index]["list"] = data;
                    prevData[index]["loading"] = false;
                    setTableData(prevData)
                }
                else {
                    let data = res.status;
                    let prevData = [...tableData]
                    prevData[index]["error_msg"] = data.errormsg;
                    prevData[index]["loading"] = false;
                    setTableData(prevData)
                }
            })
            .catch(err => { });
    }
    const searchHandler = (param, res, index) => {
        let indexOfSearchField = -1;

        let param_info = {}

        for (let i = 0; i < res.custom_picklist_def.report_input_mappings.length; i++) {
            if (res.custom_picklist_def.report_input_mappings[i].type === 'K') {
                indexOfSearchField = i;
                param_info = { display_name: res.custom_picklist_def.report_input_mappings[i].name, value: param };
                break;
            }
        }
        if (indexOfSearchField === -1) return;

        picklistReportGenerate(index, res, true, param_info)

    }

    const getMappedNameFromFieldName = (res, key) => {
        for (let i = 0; i < res.custom_picklist_def.report_output_mappings.length; i++) {
            if (res.custom_picklist_def.report_output_mappings[i].field.name === key) {
                return res.custom_picklist_def.report_output_mappings[i].mapped_name;
            }
        }
        return key;
    }


    const getInputElementFromField = (res, key) => {
        if (res.custom_picklist_flag)
            return (res.hidden_flag ? null : <div className={classes.pinWrapper} key={key}>
                <PickListTable
                    multiSelect={res.multi_selection}
                    // label={res.display_name}
                    labelMinWidth="95px"
                    onOpen={() => picklistReportGenerate(key, res, res.custom_picklist_def.show_filter === "Y")}
                    labelMaxWidth="95px"
                    value={tableData[key].value}
                    list={tableData[key].list == null ? null : tableData[key].list}
                    loading={tableData[key].loading}
                    error_msg={tableData[key].error_msg}
                    name={res.display_name}
                    required={res.mandatory}
                    fullWidth={true}
                    form={false}
                    clearSearchResult={() => searchHandler("", res, key)}
                    search={res.custom_picklist_def.show_filter === "Y"}
                    onSearch={(param) => searchHandler(param, res, key)}
                    valueKey={getMappedNameFromFieldName(res, res.custom_picklist_def.field_name)}
                    onChangeHandler={(result) => onChangePicklistInput(res, result, key, "report", res.delimiter)}
                />
            </div>)
        else if (!res.custom_picklist_flag && res.picklist_column_name !== "" && res.type !== "9")
            return (res.hidden_flag ? null : <div className={classes.pinWrapper} key={key}>
                <PickList
                    onOpen={() => picklistTableData(key, res)}
                    value={tableData[key].value}
                    list={tableData[key].list == null ? [] : tableData[key].list}
                    loading={tableData[key].loading} error_msg={tableData[key].error_msg}
                    name={res.display_name}
                    required={res.mandatory}
                    displayKey="value"
                    valueKey="value"
                    pagination={true}
                    className={classes.inputBox}
                    search={true}
                    onChangePicklist={(params) => picklistTableData(key, res, params)}
                    // error_msg={res.error_msg}
                    fullWidth={true}
                    form={false}
                    onChangeHandler={(result) => onChangePicklistInput(res, result, key, "table")} />
            </div>)
        else if (res.type === "9")
            return (res.hidden_flag ? null :
                <div className={classes.pinWrapper} key={key}>
                    {/* <InputBox
                        type="date"
                        injectLiveValue={true}
                        value={tableData[key].value}
                        name={res.display_name}
                        required={res.mandatory}
                        error_msg={res.error_msg}

                        // className={classes.inputBox}
                        fullWidth={true}
                        form={false}
                        className={classes.inputBox}
                        onChangeHandler={event => onChangeFormInput(event, res, key)}
                    /> */}
                    <DatePickers
                        value={tableData[key].value}
                        error_msg={res.error_msg}
                        className={classes.inputBox}
                        name={res.display_name}
                        required={res.mandatory}
                        injectLiveValue
                        onChange={(e) => {
                            onChangeFormInput(e, res, key)
                        }}
                        timeFormat={false}
                    />
                </div>)
        else {
            return (res.hidden_flag ? null : <div className={classes.pinWrapper} key={key}>
                <InputBox
                    injectLiveValue={true}
                    value={tableData[key].value}
                    required={res.mandatory}
                    error_msg={res.error_msg}
                    fullWidth={true}
                    form={false}
                    className={classes.inputBox}
                    onChangeHandler={event => onChangeFormInput(event, res, key)}
                /></div>)
        }
    }
    const fetchOldValue = (display_name, type) => {
        // console.log(createAddReportState)
        if (trendState.input_fields != null)
            for (let i = 0; i < trendState.input_fields.length; i++) {
                // console.log(1)
                if (trendState.input_fields[i].type === type && trendState.input_fields[i].display_name === display_name) {
                    return trendState.input_fields[i].value;
                }
            }
        return "";
    }


    const getData = () => {
        let payload = {
            ...ReportGenerateJson,
            report_index: trendState.report_index,
        }

        if (trendState.modifyMode) {
            payload["report_index"] = trendState.report_instance_list.report_id;
            payload["report_instance_id"] = trendState.report_instance_list.report_instance_id;
        }
        setIsLoading({ loading: true, message: "Fetching Data from API" })
        GetReportGenerateData(payload).then(response => {
            if (response != null && response.status != null && response.status.maincode === "0") {
                if (response.data.input_req === true) {
                    const newTableData = response.data.report_input_fields.map((field, index) => ({
                        field_display_name: field.display_name,
                        field_type: getTypeFromId(field.type),
                        field_value: field,
                        field_length: "",
                        field_name: field.name,
                        field_type2: field.type,
                        value: fetchOldValue(field.display_name, field.type),
                        required: field.mandatory,
                        hidden_flag: field.hidden_flag
                    }))
                    setTableData(newTableData)
                }
            }
            else if (response != null && response.status != null && response.status.maincode === "0") {
                snackbarState.openSnackbar(response.status.errormsg, 'warning');
            }
            else {
                snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error');
            }
        }).then(() => {
            setIsLoading({ loading: false })
        }).catch(error => { });
    }

    const headerData = [
        {
            id: '',
            label: `${t('bam:FIELD_NAME')}`,
            component: (res, index) => <div style={{ display: 'flex' }}><Typography>{res.field_display_name}</Typography><Typography style={{ color: 'red' }}>{res.required ? '*' : ""}</Typography></div>
        },
        {
            id: 'field_type',
            label: `${t('bam:FIELD_TYPE')}`
        },
        {
            id: '',
            label: `${t('bam:FIELD_VALUE')}`,
            component: (res, index) => getInputElementFromField(res.field_value, index)
        }
    ]
    const onChangeFormInput = (event, res, key) => {
        const newTableData = [...tableData];
        // console.log('Hello', newTableData, key)
        newTableData[key].value = event.target.value.trim();
        setTableData(newTableData);
    }

    return <div className={classes.form}>
        <div className={classes.root}>
            <Typography variant="subtitle1" gutterBottom>{t('bam:REPORT_INPUT_FIELDS')}:</Typography>
            <div className={classes.table}>
                {isLoading.loading === false ?
                    (tableData != null ?
                        <TableComponent
                            dynamicHeight="270px"
                            tableData={tableData != null ? tableData : []}
                            headerData={headerData}
                            loading={false}
                            disableFirstCell={true}
                        />
                        : <div style={{ height: '300px' }}>
                            <NotFound message={t('bam:NO_INSTANCE_FIELD_MESSAGE')} />
                        </div>)
                    : <div style={{ height: '300px' }}>
                        <Spinner msg={isLoading.message} />
                    </div>}
            </div>
        </div>
        <DialogActions>
            {actionButtonAddPageCommon.map((res, key) => <Button key={res.key} type={res.type} variant={res.variant} color={res.color} onClick={res.action}>
                {res.label}
            </Button>)}
        </DialogActions>
    </div>
}

export default TrendsPreferences;