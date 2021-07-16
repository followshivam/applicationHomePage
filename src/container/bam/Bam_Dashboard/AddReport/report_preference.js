import { Button, DialogActions, IconButton, makeStyles, Typography, CloseIcon, ColorPicker, InputBox, PickList, SelectBox, TableComponent, NotFound, Spinner, DatePickers, PickListTable, useTranslation } from "component";
import { GetPicklistData, GetReportGenerateData } from "global/bam/api/ApiMethods";
import { PicklistInputJson, ReportGenerateJson } from "global/json";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateAddReport } from "redux/action";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
    },
    actionBar: {
        position: 'absolute',
        bottom: '0',
        right: '0',
    },
    inputBox: {
        width: '123px'
    },
    body: {
        // width: '100%',
        height: 'calc(100% - 50px)',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
        "& > *": {
            marginTop: theme.spacing(1),
        }
    },
    upperControls: {
        display: 'flex',
        alignItems: 'center',
        "& > *": {
            marginRight: theme.spacing(3),
            minWidth : "230px"
        }
    },
    reportType: {
        display: 'flex',
        alignItems: 'center',
        // minWidth: '200px'
    },
    colorPicker: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        "& > *": {
            marginRight: theme.spacing(1)
        }
    },
    numberInput: {
        width: '50px'
    },
    numberInputContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    input_label: {
        ...theme.typography.input_label,
        fontSize : '0.75rem' 
    }
}))


const ReportPreferences = props => {


    const {
        onCancel,
        modifyMode = false
    } = props;

    const classes = useStyles();

    const [isLoading, setIsLoading] = useState({ loading: true, message: 'rendering components...' })
    const [tableData, setTableData] = useState();
    useEffect(() => {
        getData();
    }, [])
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)
    const createAddReportState = useSelector(store => store.createAddReportState);
    const snackbarState = useSelector(store => store.snackbarState);

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


    // const [tableData, setTableData] = useState();


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
                    if(setTableData && prevData)
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
    // console.log(tableData);

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

    const getMappedNameFromFieldName = (res, key) => {
        for (let i = 0; i < res?.custom_picklist_def?.report_output_mappings?.length; i++) {
            if (res.custom_picklist_def.report_output_mappings[i].field.name === key) {
                return res.custom_picklist_def.report_output_mappings[i].mapped_name;
            }
        }
        return key;
    }
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

    const getInputElementFromField = (res, key) => {
        if (res.custom_picklist_flag)
            return (res.hidden_flag ? null : <div className={classes.pinWrapper} key={key}>
                {/* <PickListTable
                    onOpen={() => picklistReportGenerate(key, res)}
                    value={tableData[key].value}
                    list={tableData[key].list == null ? null : tableData[key].list}
                    loading={tableData[key].loading}
                    error_msg={tableData[key].error_msg}
                    name={res.display_name}
                    required={res.mandatory}
                    className={classes.inputBox}
                    fullWidth={true}
                    form={false}
                    search={false}
                    valueKey={getMappedNameFromFieldName(res, res.custom_picklist_def.field_name)}
                    onChangeHandler={(result) => onChangePicklistInput(res, result, key, "report")}
                    /> */}
                <PickListTable
                style={{width:"123px"}}
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
                    // fullWidth={true}
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
                        fullWidth={true}
                        form={false}
                        onChangeHandler={event => onChangeFormInput(event, res, key)}
                    /> */}
                    <DatePickers
                        value={tableData[key].value}
                        error_msg={res.error_msg}
                        className={classes.inputBox}
                        name={res.display_name}
                        required={res.mandatory}
                        align="top"
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
        if (createAddReportState.input_fields != null)
            for (let i = 0; i < createAddReportState.input_fields.length; i++) {
                // console.log(1)
                if (createAddReportState.input_fields[i].type === type && createAddReportState.input_fields[i].display_name === display_name) {
                    return createAddReportState.input_fields[i].value;
                }
            }
        return "";
    }


    const getData = () => {
        let payload = {
            ...ReportGenerateJson,
            report_index: createAddReportState.report_index,
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


    let displayAdditionalSettings = createAddReportState != null && createAddReportState.report_type === `${t('bam:LABEL_TABULAR_AND_GRAPHICAL')}` ? true : false;
    let displayGraphicalSettings = createAddReportState != null && (createAddReportState.report_type === `${t('bam:LABEL_GRAPHICAL')}` || createAddReportState.report_type === `${t('bam:LABEL_TABULAR_AND_GRAPHICAL')}`) ? true : false;



    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value.trim(),
        })
    }

    const getList = () => {
        if (createAddReportState == null) return null;
        if (createAddReportState.report_type === "Tabular and Graphical") {
            return [
                { value: "G", label: `${t('bam:LABEL_GRAPHICAL')}` },
                { value: "T", label: `${t('bam:LABEL_TABULAR')}` }
            ];
        }
        else if (createAddReportState.report_type === "Tabular") {
            return [
                { value: "T", label: `${t('bam:LABEL_TABULAR')}` }
            ];
        }
        else {
            return [
                { value: "G", label: `${t('bam:LABEL_GRAPHICAL')}` },
            ];
        }
    }
    const dispatch = useDispatch();

    const blankNullCheck = field => {
        if (field != null && field !== "") return true;
        return false;
    }

    const [state, setState] = useState({
        default_display: getList()[0].value,
        display_name: createAddReportState.display_name,
        chart_title: createAddReportState.chart_title,
        refresh_interval: createAddReportState.refresh_interval,
        chart_title_color: blankNullCheck(createAddReportState.chart_title_color) === true ? createAddReportState.chart_title_color : "#000000"
    });




    const validateInput = () => {
        // console.log(tableData);

        // let newTableData =
        if (tableData != null)
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i].required && (tableData[i].value === "" || tableData[i].value == null)) {
                    snackbarState.openSnackbar(`Please Specify the value of ${tableData[i].field_display_name}`, 'warning')
                    return false;
                }
            }
        return true;
    }

    const isValid = () => {
        if (validateInput() === true) {
            // console.log(validateInput());
            if (state.default_display === "T" && blankNullCheck(state.display_name)) {
                return true;
            }
            else if (state.default_display === "G" && blankNullCheck(state.chart_title) && blankNullCheck(state.display_name)) {
                return true;
            }
            else if (state.default_display === "TG" && blankNullCheck(state.chart_title) && blankNullCheck(state.display_name)) {
                return true;
            }
            else {
                snackbarState.openSnackbar('Please fill all fields marked with \'*\'', 'warning')
            }
        }
        return false;
    }

    // console.log(state)

    const inputIsValid = () => {
        if (tableData != null)
            for (let i = 0; i < tableData.length; i++) {
                // console.log(tableData[i])
                if (tableData[i].required === true && blankNullCheck(tableData[i].value) === false) {
                    // console.log(tableData[i].value)
                    snackbarState.openSnackbar(`${tableData[i].field_display_name} is required, please enter to proceed`, 'warning', 5000);
                    return false;
                }
            }
        return true;
    }

    const onNextHandler = event => {
        event.preventDefault();

        if (isValid() && inputIsValid()) {
            let input_fields = tableData != null ? tableData.map((item, index) => ({
                name: item.field_name,
                type: item.field_type2,
                length: item.field_length,
                display_name: item.field_display_name,
                value: item.value
            })) : [];

            dispatch(CreateAddReport({
                ...createAddReportState,
                ...state,
                current_step: createAddReportState.current_step + 1,
                input_fields: input_fields,
                refresh_interval: state.refresh_interval == null ? "" : state.refresh_interval,
                alert_delay_interval: "10"
            }))
        }
        return;
    }


    const onPreviousHandler = () => {
        dispatch(CreateAddReport({
            current_step: createAddReportState.current_step - 1,
        }))
    }

    const colorChangeHandler = (color, itemIndex) => {
        setState({
            ...state,
            [itemIndex]: color.hex,
        })
        // alert(color.hex)
    }



    return <div className={classes.root}>
        <div className={classes.body}>
            <div className={classes.upperControls}>
                <div className={classes.reportType}>
                    <Typography className={classes.input_label} style={{ marginRight: '8px' }}>{t('bam:LABEL_REPORT_TYPE')}:</Typography>
                    <Typography variant="subtitle1"><b>{createAddReportState != null ? createAddReportState.report_type : ""}</b></Typography>
                </div>
                {/* <Button onClick={() => console.log(tableData)}>Console</Button> */}
                <SelectBox list={getList()}
                    value={state != null ? state.default_display : null}
                    label={t('bam:DEFAULT_DISPLAY_TYPE')}
                    labelMaxWidth="100px"
                    labelMinWidth="100px"
                    form={false}
                    className={classes.inputBox}
                    name="default_display"
                    onChange={handleChange}
                    required={true}
                />

                <InputBox
                    label={t('bam:DISPLAY_NAME')}
                    required={true}
                    labelMaxWidth="110px"
                    labelMinWidth="110px"
                    form={false}
                    className={classes.inputBox}
                    value={state != null ? state.display_name : null}
                    name="display_name"
                    onChange={handleChange}
                />
            </div>
            <div className={classes.upperControls}>
                {displayGraphicalSettings === true ?
                    <InputBox
                        label={t('bam:CHART_TITLE')}
                        required={true}
                        labelMaxWidth="80px"
                        labelMinWidth="80px"
                        form={false}
                        className={classes.inputBox}
                        value={state != null ? state.chart_title : null}
                        name="chart_title"
                        onChange={handleChange}
                    /> : null}
                {displayGraphicalSettings === true ?
                    <div className={classes.colorPicker}>
                        <Typography className={classes.input_label}>{t('bam:CHART_TITLE_COLOR')}</Typography>
                        <ColorPicker
                            displayColorCode={true}
                            color={state != null && state.chart_title_color != null ? state.chart_title_color : "#000000"}
                            colorChanger={colorChangeHandler}
                            itemIndex="chart_title_color"
                        />
                        <IconButton
                            onClick={() => setState({
                                ...state,
                                chart_title_color: '#000000'
                            })}
                        ><CloseIcon /></IconButton>
                    </div> : null}
                {/* <div className={classes.numberInputContainer}>
                    <InputBox
                        type="number"
                        label={t('bam:ALERTREFRESHINTERVAL')}
                        labelMaxWidth="110px"
                        labelMinWidth="110px"
                        form={false}
                        className={classes.numberInput}
                        helperText="(min)"
                        value={state != null ? state.refresh_interval : null}
                        name="refresh_interval"
                        onChange={handleChange}
                    />
                    <Typography variant="subtitle1">{t('bam:MINUTES')}</Typography>
                </div> */}

            </div>
            <div className={classes.tableContainer}>
                <Typography variant="subtitle1">{t('bam:REPORT_INPUT_FIELDS')}:</Typography>
                {isLoading.loading === false ?
                    (tableData != null ?
                        <TableComponent
                            dynamicHeight="190px"
                            tableData={tableData != null ? tableData : []}
                            headerData={headerData}
                            loading={false}
                            disableFirstCell={true}
                        />
                        : <div style={{ height: '220px' }}>
                            <NotFound message={t('bam:NO_INPUT_FIELD_MESSAGE')} />
                        </div>)
                    : <div style={{ height: '220px' }}>
                        <Spinner message={isLoading.message} />
                    </div>}
            </div>
        </div>
        <DialogActions className={classes.actionBar}>
            <Button variant="outlined" onClick={onCancel}>{t('bam:CANCEL')}</Button>
            {!modifyMode && <Button variant="outlined" color="primary" onClick={onPreviousHandler}>{t('bam:BUTTON_PREVIOUS')}</Button>}
            <Button variant="contained" disabled={isLoading.loading} type="submit" onClick={onNextHandler} color="primary">{t('bam:BUTTON_NEXT')}</Button>
        </DialogActions>
    </div>
}

export default ReportPreferences;