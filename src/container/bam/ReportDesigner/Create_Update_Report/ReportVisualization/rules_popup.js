import React, { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, AddIcon, Button, Checkbox, ColorPicker, DialogActions, DialogTitle, Divider, ExpandMoreIcon, FormControlLabel, Grid, IconImage, useTranslation, InputBox, makeStyles, NotFound, PickList, Radio, RadioGroup, SelectBox, Table, TableCell, TableComponent, TableHead, TableRow, Typography, withStyles } from "component";
import { useSelector } from "react-redux";
import { ruleConditionJson, ruleJson, UserListInput } from "global/json";
import { IconButton, Switch, Tooltip } from "@material-ui/core";
import RowDragger from "component/RowDraggerV2";
import { GetUserList, GroupList } from "global/bam/api/ApiMethods";
import { AdvancedUserPickList } from "component/Form";
import { TypeConversion } from "global/methods";



const findIndexById = (rules, id) => {
    for (let i = 0; i < rules.length; i++) {
        if (rules[i].id === id) {
            return i;
        }
    }
    return -1;
}


const StyledAccordionSummary = withStyles({
    root: {
        '&$expanded': {
            minHeight: '50px'
        },
        backgroundColor: '#F8F8F8',
        // margin: '0'
    },
    content: {
        margin: '0'
    }
})(AccordionSummary)

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
    },
    header: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    },
    body: (props) => {
        return {
            height: `calc(100% - ${theme.spacing(2)}px - ${props.disableHead === true ? '0px' : '40px'} - 22.4px - 10px)`,
            display: 'flex'
        }
    },
    leftContainer: {
        width: '189.5px',
        borderRight: '0.5px solid #E1E1E1',
        height: '100%'
    },
    rootLeft: {
        height: '100%',
        width: '100%'
    },
    addAndDeleteMenuLeft: {
        height: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        "& > *": {
            margin: `0 ${theme.spacing(1)}px`
        }
    },
    addRuleButton: {
        width: '45px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: theme.palette.primary.main,
        curson: 'pointer'
    },
    topTitleLeft: {
        height: '20px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        "& > *": {
            marginRight: theme.spacing(1.5)
        }
    },
    tabContainer: {
        height: 'calc(100% - 60px)',
        width: '100%',
        overflow: 'auto'
    },
    tab: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '27px',
        "& > *": {
            marginRight: theme.spacing(1)
        }
    },
    tabSelected: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FF66001A',
        height: '27px',
        "& > *": {
            marginRight: theme.spacing(1)
        }
    },
    clickableArea: {
        cursor: 'pointer',
        width: '150px'
    },
    rightContainer: {
        width: 'calc(100% - 190px)',
        height: '100%',
    },
    topRightContainerTitle: {
        height: "41px",
        borderBottom: '0.5px solid #E1E1E1',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        "& > *": {
            marginLeft: theme.spacing(2)
        }
    },
    rightMiddleContainer: {
        height: 'calc(100% - 41px)',
        width: '100%',
        display: 'flex'
    },
    rightInnerLeftContainer: {
        width: '70%',
        height: '100%',
        borderRight: '0.5px solid #E1E1E1'
    },
    rightInnerRightContainer: {
        width: '30%',
        height: '100%',
        overflow: 'auto'
    },
    rootRightInnerLeft: {
        height: 'calc(100% - 40px)',
        width: '100%'
    },
    rightInnerLeftTitle: {
        height: '40px',
        color: '#606060',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        "& > *": {
            margin: `0 ${theme.spacing(2)}px`
        }
    },
    addAndDeleteMenuRightInnerLeft: {
        display: 'flex',
        width: '40px',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tableContainer: {
        height: 'calc(100% - 40px)',
        overflow: 'auto'
    },
    accordianStyle: {
        margin: '0'
    },
    bottomActionBar: (disableHead) => {
        return disableHead === true ? { padding: '4px 0 0 0' } : { padding: '4px 8px' }
    },
    input_label: {
        ...theme.typography.input_label,
        fontSize : '0.75rem'
    },
    tableElement: {
        display: 'flex',
        // justifyContent: 'space-between'
        "& > *": {
            marginRight: '15px'
        }
    },
    tooltipLimit: {
        width: '120px'
    },
    alertListControls: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '10px 0',
        "& > *": {
            marginLeft: '15px'
        }
    }
}));




const LeftContainer = props => {


    const classes = useStyles();
    const {
        activeIndex,
        handleParameterChange,
        addNewRule,
        setActiveIndex,
        deleteSelectedRules,
        state = { rules: [] },
        setState,
        handleRuleToggle,
        t,
        ...rest
    } = props;

    const [data, setData] = useState();

    const [displayDeleteButton, setDisplayDeleteButton] = useState(false);

    useEffect(() => {
        let rules = [...state.rules];
        rules.sort((first, second) => {
            const first_order = parseInt(first.rule_order), second_order = parseInt(second.rule_order);
            if (first_order > second_order) return 1;
            else return -1;
        })

        setDisplayDeleteButton(false);
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].rule_selected === true && rules[i].rule_operation !== 'D') {
                setDisplayDeleteButton(true);
                break;
            }
        }

        let data = rules.filter(rule => rule.rule_operation !== 'D').map((rule, index) => (
            {
                unique_id: `${rule.id}`,
                component: <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <Checkbox
                        checked={rule.rule_selected}
                        onClick={() => handleRuleToggle(rule.id, "rule_selected")}
                    />

                    <Tooltip style={{ cursor: 'pointer' }} title={rule.rule_name} onClick={() => {
                        setActiveIndex(rule.id);
                    }}>
                        <Typography noWrap={true} style={{ width: '60px' }}>
                            {rule.rule_name}
                        </Typography>
                    </Tooltip>

                    <Checkbox
                        checked={rule.rule_enabled}
                        onClick={() => {
                            handleRuleToggle(rule.id, "rule_enabled")
                            // alert(rule.id)
                        }}
                    />
                </div>
            }))
        setData(data);
    }, [state.rules])



    const onChangeHandlerDragger = (newData) => {
        setData(newData)
        let rules = [...state.rules]

        for (let i = 0; i < newData.length; i++) {
            const index = findIndexById(rules, parseInt(newData[i].unique_id))
            let rule = Object.assign({}, rules[index]);
            rule.rule_order = i + 1;
            rules[index] = rule;
        }
        setState({ rules: rules })
    }




    return <div className={classes.rootLeft}>
        <div className={classes.addAndDeleteMenuLeft}>
            <div className={classes.addRuleButton} onClick={() => addNewRule()}>
                <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/plus_blue.svg`} height="11px" width="11px" />
                <Typography variant="subtitle1" style={{ cursor: 'pointer' }}><b>{t('bam:RULES')}</b></Typography>
            </div>
            {displayDeleteButton === true ? <IconImage onClick={deleteSelectedRules} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_3.svg`} height="14px" /> : null}
        </div>
        {data != null && data.length > 0 && <div className={classes.topTitleLeft}>
            <Typography variant="subtitle1"><b>{t('bam:RULE_NAME')}</b></Typography>
            <Typography variant="subtitle1"><b>{t('bam:ON_OFF')}</b></Typography>
        </div>}
        <div className={classes.tabContainer}>
            <RowDragger data={data} onChange={onChangeHandlerDragger} active={activeIndex} />
        </div>
    </div>
}

const RightInnerContainerLeft = props => {
    const classes = useStyles();

    const {
        rule,
        addNewCondition,
        deleteConditions,
        rule_conditions = [],
        fieldList = [],
        handleConditionChange,
        handleFieldChange,
        handleValueChange,
        t,
        ...rest
    } = props;

    const [selectedConditions, setSelectedConditions] = useState([]);

    const handleSelections = (index) => {
        if (selectedConditions.includes(index) === true) {
            let newSelectedConditions = selectedConditions.filter(item => item !== index);
            setSelectedConditions(newSelectedConditions);
        }
        else {
            let newSelectedConditions = [...selectedConditions];
            newSelectedConditions.push(index);
            setSelectedConditions(newSelectedConditions);
        }
    }
    const [newFieldList, setNewFieldList] = useState([...fieldList, { value: fieldList.length, label: '' }]);

    const getConditionField = key => {
        for (let i = 0; i < newFieldList.length; i++) {
            if (newFieldList[i].label === key) {
                return newFieldList[i].value;
            }
        }
        return fieldList.length + 1;
    }

    const [list, setList] = useState({ data: [], loading: true })



    const onOpenValuePickList = (type) => {
        let fields = [...fieldList];
        if (type === "") {
            snackbarState.openSnackbar(`${t('bam:PLEASE_SELECT_FIELD')}`, 'warning', 2000);
            setList({ ...list, error_msg: `${t('bam:PLEASE_SELECT_OPERAND')}`, loading: false });
            return;
        }
        else {
            if (type !== '8') {
                fields = fields.filter(field => field.type === type);
            }
            if (type === '3') {
                fields = fields.filter(field => (field.type === '2' || field.type === '3'));
            }
        }
        console.log(fields);
        setList({ ...list, data: fields, loading: false });
    }

    const snackbarState = useSelector(store => store.snackbarState);

    const handleDisable = (type) => {
        if (type === "" || type == null) {
            snackbarState.openSnackbar(`${t('bam:PLEASE_SELECT_FIELD')}`, 'warning', 2000);
            return true;
        }
        return false;
    }

    const preventOpen = type => {
        if (type === "" || type == null) {
            snackbarState.openSnackbar(`${t('bam:PLEASE_SELECT_FIELD')}`, 'warning', 2000);
            // return true;
        }
        // return false;
    }

    return <div className={classes.rootRightInnerLeft}>
        <div className={classes.rightInnerLeftTitle}>
            <Typography variant="subtitle1">{t('bam:CONDITIONS')}:</Typography>
            <div className={classes.addAndDeleteMenuRightInnerLeft}>
                <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/plus_blue.svg`} height="14px" onClick={() => addNewCondition()} />
                {selectedConditions.length !== 0 ? <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_3.svg`} height="14px" onClick={() => { deleteConditions(selectedConditions); setSelectedConditions([]) }} /> : null}
            </div>
        </div>
        <div className={classes.tableContainer}>
            <TableHead>
                <TableCell width="5%" padding="checkbox"></TableCell>
                <TableCell width="10%" style={{ padding: '5px' }}></TableCell>
                <TableCell width="25%" style={{ padding: '5px' }}>{t('bam:LABEL_FIELD')}</TableCell>
                <TableCell width="10%" style={{ padding: '5px' }}>{t('bam:OPERATOR')}</TableCell>
                <TableCell width="25%" style={{ padding: '5px' }}>{t('bam:VALUE')}</TableCell>
                <TableCell width="10%" style={{ padding: '5px' }}></TableCell>
                <TableCell width="5%" style={{ padding: '5px' }}></TableCell>
            </TableHead>
            {rule_conditions !== [] ? rule_conditions.map((condition, index) => (
                <TableRow>
                    <TableCell width="5%" padding="checkbox">
                        <Checkbox
                            checked={selectedConditions.includes(index) === true}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleSelections(index)
                            }
                            }
                        />
                    </TableCell>
                    <TableCell width="10%" style={{ padding: '5px' }}>
                        <SelectBox
                            list={[
                                {
                                    value: '1',
                                    label: "("
                                },
                                {
                                    value: '0',
                                    label: ''
                                }
                            ]}
                            value={condition.opening_brace ? '1' : '0'}
                            onChange={(event) => { handleConditionChange({ target: { name: "opening_brace", value: event.target.value === '1' } }, index); event.stopPropagation() }}
                            style={{ width: '100%' }} />
                    </TableCell>
                    <TableCell width="25%" style={{ padding: '5px' }}>
                        <SelectBox
                            list={newFieldList}
                            style={{ width: '100%' }}
                            onChange={event => {
                                if (event.target.value < fieldList.length)
                                    handleFieldChange("condition", event.target.value, index)
                            }
                            }
                            value={getConditionField(condition.operand1.name)}
                        />
                    </TableCell>
                    <TableCell width="10%" style={{ padding: '5px' }}>
                        <SelectBox
                            list={[
                                {
                                    label: "",
                                    value: ""
                                },
                                {
                                    label: "<",
                                    value: "1"
                                },
                                {
                                    label: "<=",
                                    value: "2"
                                },
                                {
                                    label: "==",
                                    value: "3"
                                },
                                {
                                    label: ">",
                                    value: "4"
                                },
                                {
                                    label: ">=",
                                    value: "5"
                                },
                                {
                                    label: "LIKE",
                                    value: "6"
                                },
                                {
                                    label: "NOT LIKE",
                                    value: "7"
                                },
                            ]}
                            style={{ width: '100%' }}
                            value={condition.operator}
                            name="operator"
                            onChange={(event) => { handleConditionChange(event, index); event.stopPropagation() }}
                        />
                    </TableCell>
                    <TableCell width="25%" style={{ padding: '5px' }}>
                        <PickList
                            key={`${index}-${condition.operand1.type}`}
                            disabled={false}
                            onClick={() => preventOpen(condition.operand1.type)}
                            // disablePickList={() => handleDisable(condition.operand1.type)}
                            disablePickList={condition.operand1.type === ""}
                            list={list}
                            pagination={false}
                            search={false}
                            loading={list.loading}
                            onOpen={() => onOpenValuePickList(condition.operand1.type)}
                            value={condition.operand2.value}
                            onChangeHandler={(res) => handleValueChange({ target: { value: res.label } }, index, 'C')}
                            onChange={event => handleValueChange(event, index, 'K')}
                            error_msg={list.error_msg}
                        />
                    </TableCell>
                    <TableCell width="10%" style={{ padding: '5px' }}>
                        <SelectBox
                            list={[
                                { label: ")", value: '1' },
                                { label: '', value: '0' }
                            ]}
                            style={{ width: '100%' }}
                            value={condition.closing_brace ? '1' : '0'}
                            onChange={(event) => { handleConditionChange({ target: { name: "closing_brace", value: event.target.value === '1' } }, index); event.stopPropagation() }}
                        />
                    </TableCell>
                    <TableCell width="10%" style={{ padding: '5px' }}>
                        <SelectBox
                            list={[
                                {
                                    label: "",
                                    value: '0'
                                },
                                {
                                    label: "AND",
                                    value: '1'
                                },
                                {
                                    label: "OR",
                                    value: '2'
                                }
                            ]}
                            style={{ width: '100%' }}
                            value={condition.logical_op}
                            name="logical_op"
                            onChange={(event) => { handleConditionChange(event, index); event.stopPropagation() }}
                        />
                    </TableCell>
                    <TableCell width="5%" style={{ padding: '5px' }}>
                        <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_3.svg`} onClick={() => deleteConditions([index])} />
                    </TableCell>
                </TableRow>
            )) : null}
        </div>
    </div>
}
const RightInnerContainer = props => {
    const classes = useStyles();

    const {
        displayAlert = true,
        displayGraphical = true,
        displayTabular = true,
        fieldList = [],
        rule = {},
        onChangeHandler = null,
        handleFieldChange = null,
        userAndGroupUpdate = null,
        t
    } = props;

    const [tableData, setTableData] = useState();

    useEffect(() => {
        // let newTableData = [];
        if (displayAlert === true && rule.alert != null) {
            let userList = rule.alert.user.map(user => ({
                component: <div className={classes.tableElement}>
                    <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/user_grey.svg`} height={16} width={16} />
                    <Tooltip title={`${user.user_name} ${user.user_mail_id}`}>
                        <Typography className={classes.tooltipLimit} noWrap>
                            {user.user_name}
                        </Typography>
                    </Tooltip>
                </div>,
                type: 'U',
                object_id: user.user_id
            }));
            let groupList = rule.alert.group.map(group => ({
                component: <div className={classes.tableElement}>
                    <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/group_grey.svg`} height={16} width={16} />
                    <Tooltip title={`${group.group_name} ${group.group_mail_id}`}>
                        <Typography className={classes.tooltipLimit} noWrap>
                            {group.group_name}
                        </Typography>
                    </Tooltip>
                </div>,
                type: 'G',
                object_id: group.group_id
            }));

            setTableData([...userList, ...groupList])
        }
    }, [rule])

    const headerData = [{
        id: 'component',
        label: `${t('bam:NAME')}`
    }]

    const [selected, setSelected] = useState([]);

    const isIncluded = (object_id, type) => {
        for (let i = 0; i < selected.length; i++) {
            if (selected[i].object_id === object_id && selected[i].type === type) {
                return true;
            }
        }
        return false;
    }

    const deleteSelected = () => {
        let userList = [...rule.alert.user.filter(user => !isIncluded(user.user_id, "U"))];
        let groupList = [...rule.alert.group.filter(group => !isIncluded(group.group_id, "G"))];

        userAndGroupUpdate(userList, groupList);

        setSelected([])
    }

    const onChangeCheckbox = (res) => {
        setSelected(res);
    }

    const colorChangerHandlerGraphical = (color, itemIndex) => {
        onChangeHandler({ target: { name: itemIndex, value: color.hex } }, "graphical")
    }
    const colorChangerHandlerTabular = (color, itemIndex) => {
        onChangeHandler({ target: { name: itemIndex, value: color.hex } }, "tabular")
    }

    const [state, setState] = useState({ mode: 'U', label: "" })

    const onChange = event => {
        setState({ mode: event.target.value, label: "" })
    }

    const snackbarState = useSelector(store => store.snackbarState)

    const addObjectToList = () => {
        if (state.value == null) {
            snackbarState.openSnackbar(`${t('bam:SELECT_USER_OR_GROUP')}`, 'warning');
            return;
        }

        if (state.mode === "G" && state.type === "G") {
            let groupList = [...rule.alert.group, state.value];
            onChangeHandler({ target: { name: 'group', value: groupList } }, 'alert')
        }
        else if (state.mode === "U" && state.type === "U") {
            let userList = [...rule.alert.user, state.value];
            onChangeHandler({ target: { name: 'user', value: userList } }, 'alert')
        }

        setState({ ...state, value: null })
    }

    const [list, setList] = useState({ loading: true, list: null, errorMessage: "" });

    const [query, setQuery] = useState({ query: "", load: false });

    useEffect(() => {
        if (query.load === true)
            onOpenPicklist(query.type, "0")
    }, [query])

    const searchHandler = (input, type) => {
        // onOpenPicklist(1, "report", 0, input)
        setQuery({ query: input, type: type, load: true })
    }

    const clearSearchResult = () => {
        setQuery({ ...query, query: "", load: true });
    }

    const findIndex = value => {
        // console.log(value);
        for (let i = 0; i < fieldList.length; i++) {
            if (value === fieldList[i].label) return fieldList[i].value;
        }
    }
    // console.log(fieldList);
    const [userPicklistSettings, setUserPicklistSettings] = useState({ order_by: "2", group_index: "4" });

    const onOpenPicklist = (type, opr = "0") => {


        setList({ ...list, loading: true })
        if (type === "U") {
            let payload = { ...UserListInput };
            payload.opr = opr;
            payload.last_sort_field = opr === "0" ? "" : (opr === "1" ? userPicklistSettings.order_by === '2' ? list.list.last_name : list.list.last_personal_name : userPicklistSettings.order_by === '2' ? list.list.first_name : list.list.first_personal_name);
            payload.previous_index = opr === "0" ? "" : (opr === "1" ? list.list.last_user_index : list.list.first_user_index);
            payload.prefix = query.query;
            payload.order_by = userPicklistSettings.order_by;
            payload.group_index = userPicklistSettings.group_index;
            GetUserList(payload).then(response => {
                if (response != null && response.status.maincode === "0") {
                    setList({ loading: false, list: response.data, errorMessage: "" })
                }
                else if (response != null && response.status.maincode !== "0") {
                    setList({ loading: false, list: null, errorMessage: response.status.errormsg })
                }
            }).catch(error => { })
        }
        else {
            let payload = {
                "opr": opr,
                "order_by": "1",
                "sort_order": "D",
                "last_index": opr === "0" ? "" : (opr === "1" ? list.list.last_id : list.list.first_id),
                "last_value": opr === "0" ? "" : (opr === "1" ? list.list.last_group_name : list.list.first_group_name),
                "prefix": query.query,
                "no_of_records_to_fetch": "5"
            }
            GroupList(payload).then(response => {
                if (response != null && response.status.maincode === "0") {
                    setList({ loading: false, list: response.data, errorMessage: "" })
                }
                else if (response != null && response.status.maincode !== "0") {
                    setList({ loading: false, list: null, errorMessage: response.status.errormsg })
                }
            }).catch(error => { })
        }
    }

    const onChangePicklist = (type, params) => {

        if (params === "next") {
            onOpenPicklist(type, "1")
        }
        else {
            onOpenPicklist(type, "2")
        }
    }

    const onChangePicklistInput = (type, res) => {
        if (type === "U") {
            setState({
                ...state, value: {
                    user_name: res.name,
                    user_id: res.user_index,
                    user_mail_id: res.mail_id
                },
                label: res.name,
                type: type,
            });
        }
        else {
            setState({
                ...state, value: {
                    group_name: res.group_name,
                    group_id: res.id,
                    group_mail_id: res.group_mail_id
                },
                label: res.group_name,
                type: type,
            });
        }
    }
    const handleSearchToggle = (value) => {
        setUserPicklistSettings({
            ...userPicklistSettings,
            order_by: value
        })
    }
    const onChangePicklistInputSubGroup = (res) => {
        // console.log(res);
        setUserPicklistSettings({ ...userPicklistSettings, group_index: res.id })
    }

    const onChangePicklistSubGroup = action => {
        if (action === 'prev') {
            onOpenSubGroupPicklist('2');
        }
        else {
            onOpenSubGroupPicklist('1');
        }
    }

    const [subGroupList, setSubGroupList] = useState({ list: null, loading: true });
    const [subGroupQuery, setSubGroupQuery] = useState({ query: "", load: false });


    useEffect(() => {
        if (subGroupQuery.load)
            onOpenSubGroupPicklist();
    }, [subGroupQuery])

    const searchHandlerSubGroup = query => {
        setSubGroupQuery({ ...subGroupQuery, query: query, load: true });
    }

    const clearSearchResultSubGroup = () => {
        setSubGroupQuery({ ...subGroupQuery, query: "", load: true })
    }

    const onOpenSubGroupPicklist = (opr = "0") => {
        setSubGroupList({ ...subGroupList, list: null, loading: false });
        let payload = {
            "opr": opr,
            "order_by": "1",
            "sort_order": "D",
            "last_index": opr === "0" ? "" : (opr === "1" ? subGroupList.list.last_id : subGroupList.list.first_id),
            "last_value": opr === "0" ? "" : (opr === "1" ? subGroupList.list.last_group_name : subGroupList.list.first_group_name),
            "prefix": subGroupQuery.query,
            "no_of_records_to_fetch": "5"
        }
        GroupList(payload).then(response => {
            if (response != null && response.status.maincode === "0") {
                setSubGroupList({ loading: false, list: response.data, errorMessage: "" })
            }
            else if (response != null && response.status.maincode !== "0") {
                setSubGroupList({ loading: false, list: null, errorMessage: response.status.errormsg })
            }
        }).catch(error => { })
    }

    return <div className={classes.rootRightInner}>
        {displayTabular && <Accordion
            style={{ borderRadius: '0', margin: '5px' }}
        // expanded={expanded === 'panel1'}
        // onChange={handleChange('panel1')}
        >
            <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label='Expand'
                aria-controls='additional-actions1-content'
                id='additional-actions1-header'
                className={classes.accordianStyle}
            // disabled={props.rules != null && ruleIndex != null && props.rules[ruleIndex].tabular.enabled === true}
            >
                {/* <FormControlLabel
                    aria-label='Acknowledge'
                    name="enabled"
                    onFocus={event => event.stopPropagation()}
                    control={<Checkbox
                        checked={rule !== {} ? rule.tabular.enabled : false}
                    />}
                    onClick={event => {
                        event.stopPropagation();
                        onChangeHandler({ target: { name: "enabled", value: !rule.tabular.enabled } }, "tabular");
                    }}
                    label='Tabular'
                /> */}
                <Typography variant="subtitle1">{t('bam:LABEL_TABULAR')}</Typography>
            </StyledAccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
                <div
                    style={{
                        display: 'flex'
                    }}
                >
                    <SelectBox
                        list={fieldList}
                        label={t('bam:FIELD_NAME')}
                        form={false}
                        value={findIndex(rule.tabular.field_name)}
                        labelMinWidth="90px"
                        labelMaxWidth="90px"
                        onChange={event => {
                            event.stopPropagation();
                            handleFieldChange("tabular", event.target.value);
                        }}
                    />
                </div>
                <div>
                    <RadioGroup row aria-label='position' name='style_type'
                        value={rule !== {} ? rule.tabular.style_type : "C"}
                        onChange={(event) => onChangeHandler(event, "tabular")}
                    >
                        <FormControlLabel
                            value='D'
                            classes={{ label: classes.checkbox_label }}
                            control={<Radio />}
                            label={t('bam:SYSTEM_DEFAULT')}
                        />
                        <FormControlLabel
                            value='C'
                            classes={{ label: classes.checkbox_label }}
                            control={<Radio />}
                            label={t('bam:CUSTOM_STYLE')}
                        />
                    </RadioGroup>
                </div>
                {
                    rule !== {} && rule.tabular.style_type === "D" ? <React.Fragment>
                        <Grid container justify='flex-start' alignItems='center' spacing={1}>
                            <Typography
                                variant='subtitle1'
                                style={{ marginRight: '.5rem' }}
                            >
                                <b>{t('bam:LABEL_LABELCOLOR')}</b>
                            </Typography>
                            <ColorPicker displayRemoveColorButton color={rule !== {} ? rule.tabular.label_color : "white"} itemIndex="label_color" colorChanger={colorChangerHandlerTabular} displayColorCode />
                        </Grid>
                        <FormControlLabel
                            label={t('bam:COLOR_COMPLETE_CELL')}
                            control={<Checkbox
                                checked={rule !== {} ? rule.tabular.do_color_complete_cell : false}
                            />}
                            onClick={event => {
                                event.stopPropagation();
                                onChangeHandler({ target: { name: "do_color_complete_cell", value: !rule.tabular.do_color_complete_cell } }, "tabular");
                            }}
                        />
                        <br />
                        {rule !== {} && rule.tabular.do_color_complete_cell && <Grid container justify='flex-start' alignItems='center'>
                            <ColorPicker displayRemoveColorButton color={rule !== {} ? rule.tabular.color_complete_cell : "white"} itemIndex="color_complete_cell" colorChanger={colorChangerHandlerTabular} displayColorCode />
                        </Grid>}
                        <FormControlLabel
                            label={t('bam:COLOR_COMPLETE_ROW')}
                            control={<Checkbox
                                checked={rule !== {} ? rule.tabular.do_color_complete_row : false}
                            />}
                            onClick={event => {
                                event.stopPropagation();
                                onChangeHandler({ target: { name: "do_color_complete_row", value: !rule.tabular.do_color_complete_row } }, "tabular");
                            }}
                        />
                        <br />
                        {rule !== {} && rule.tabular.do_color_complete_row && <Grid container justify='flex-start' alignItems='center'>
                            <ColorPicker displayRemoveColorButton color={rule !== {} ? rule.tabular.color_complete_row : "white"} itemIndex="color_complete_row" colorChanger={colorChangerHandlerTabular} displayColorCode />
                        </Grid>}
                    </React.Fragment> :
                        <InputBox
                            name="custom_style"
                            value={rule !== {} ? rule.tabular.custom_style : ""}
                            onChange={(event) => onChangeHandler(event, "tabular")}
                            multiline={true}
                            form={false}
                            fullWidth={true}
                            rows={4}
                        />
                }
            </AccordionDetails>
        </Accordion>}
        {displayGraphical && <Accordion
            style={{ borderRadius: '0', margin: '5px' }}
        >
            <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label='Expand'
                aria-controls='additional-actions1-content'
                id='additional-actions1-header'
                className={classes.accordianStyle}
            // disabled={rule !== {} ? rule.graphical.enabled : false}
            >
                {/* <FormControlLabel
                    aria-label='Acknowledge'
                    name="enabled"
                    onFocus={event => event.stopPropagation()}
                    control={<Checkbox
                        checked={rule !== {} ? rule.graphical.enabled : false}
                    />}
                    onClick={event => {
                        event.stopPropagation();
                        onChangeHandler({ target: { name: "enabled", value: !rule.graphical.enabled } }, "graphical");
                    }}
                    label='Graphical'
                /> */}
                <Typography variant="subtitle1">{t('bam:LABEL_GRAPHICAL')}</Typography>

            </StyledAccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
                <div
                    style={{
                        display: 'flex'
                    }}
                >
                    <SelectBox
                        list={fieldList}
                        label={t('bam:FIELD_NAME')}
                        form={false}
                        labelMinWidth="90px"
                        labelMaxWidth="90px"
                        value={findIndex(rule.graphical.field_name)}
                        onChange={event => {
                            event.stopPropagation();
                            handleFieldChange("graphical", event.target.value);
                        }}
                    />
                </div>
                <div>
                    <RadioGroup row aria-label='position' name='style_type'
                        value={rule !== {} ? rule.graphical.style_type : "C"}
                        onChange={(event) => onChangeHandler(event, "graphical")}
                    >
                        <FormControlLabel
                            value='D'
                            classes={{ label: classes.checkbox_label }}
                            control={<Radio />}
                            label={t('bam:SYSTEM_DEFAULT')}
                        />
                        <FormControlLabel
                            value='C'
                            classes={{ label: classes.checkbox_label }}
                            control={<Radio />}
                            label={t('bam:CUSTOM_STYLE')}
                        />
                    </RadioGroup>
                </div>
                {rule !== {} && rule.graphical.style_type === "D" ? <React.Fragment>
                    <Grid container justify='flex-start' alignItems='center' spacing={1}>
                        <Typography
                            variant='subtitle1'
                            style={{ marginRight: '.5rem' }}
                        >
                            <b>{t('bam:LABEL_LABELCOLOR')}</b>
                        </Typography>
                        <ColorPicker displayRemoveColorButton color={rule !== {} ? rule.graphical.label_color : "white"} itemIndex="label_color" colorChanger={colorChangerHandlerGraphical} displayColorCode />
                    </Grid>
                    <FormControlLabel
                        label={t('bam:COLOR_COMPLETE_CELL')}
                        control={<Checkbox
                            checked={rule !== {} ? rule.graphical.do_color_complete_area : false}
                        />}
                        onClick={event => {
                            event.stopPropagation();
                            onChangeHandler({ target: { name: "do_color_complete_area", value: !rule.graphical.do_color_complete_area } }, "graphical");
                        }}
                    />
                    {rule !== {} && rule.graphical.do_color_complete_area && <Grid container justify='flex-start' alignItems='center'>
                        <ColorPicker displayRemoveColorButton color={rule !== {} ? rule.graphical.color_complete_area : "white"} itemIndex="color_complete_area" colorChanger={colorChangerHandlerGraphical} displayColorCode />
                    </Grid>}
                </React.Fragment>
                    : <InputBox
                        name="custom_style"
                        value={rule !== {} ? rule.graphical.custom_style : ""}
                        onChange={(event) => onChangeHandler(event, "graphical")}
                        multiline={true}
                        form={false}
                        fullWidth={true}
                        rows={4}
                    />}
            </AccordionDetails>
        </Accordion>
        }{displayAlert && <Accordion
            style={{ borderRadius: '0', margin: '5px' }}
        // disabled={true}
        // expanded={expanded === 'panel1'}
        // onChange={handleChange('panel1')}
        >
            <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label='Expand'
                aria-controls='additional-actions1-content'
                id='additional-actions1-header'
                className={classes.accordianStyle}
            // disabled={props.rules != null && ruleIndex != null && props.rules[ruleIndex].graphical.enabled === true}
            >
                {/* <FormControlLabel
                    aria-label='Acknowledge'
                    name="enabled"
                    onFocus={event => event.stopPropagation()}
                    control={<Checkbox
                        checked={rule !== {} ? rule.alert.enabled : false}
                    />}
                    onClick={event => {
                        event.stopPropagation();
                        onChangeHandler({ target: { name: "enabled", value: !rule.alert.enabled } }, "alert");
                    }}
                    label='Alert'
                /> */}
                <Typography variant="subtitle1">{t('bam:ALERT')}</Typography>

            </StyledAccordionSummary>
            <AccordionDetails style={{
                display: 'block',
                padding: '5px'
            }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <InputBox
                        form={true}
                        label={t('bam:MAIL_IDS')}
                        multiline
                        rows={3}
                        name="mail_id"
                        value={rule !== {} ? rule.graphical.mail_id : ""}
                        onChange={(event) => onChangeHandler(event, "alert")}
                        fullWidth
                        placeholder={t('bam:TYPE_MAIL_IDS_HERE')}
                    />
                    <Typography className={classes.input_label} gutterBottom>{t('bam:MAIL_TO_USER_GROUP')}</Typography>
                    <RadioGroup row aria-label='position' name='style_type'
                        value={state != null ? state.mode : "G"}
                        onChange={onChange}
                    >
                        <FormControlLabel
                            value='G'
                            classes={{ label: classes.checkbox_label }}
                            control={<Radio />}
                            label={
                                <PickList
                                    label={t('bam:GROUPS')}
                                    labelMinWidth="50px"
                                    labelMaxWidth="50px"
                                    form={false}
                                    style={{ width: '110px' }}
                                    onOpen={() => onOpenPicklist("G")}
                                    list={list.list == null ? null : list.list}
                                    value={state.mode === "G" ? state.label : ""}
                                    loading={list.loading}
                                    displayKey="group_name"
                                    valueKey="id"
                                    onChangeHandler={(res) => onChangePicklistInput("G", res)}
                                    onChangePicklist={(res) => onChangePicklist("G", res)}
                                    injectLiveValue={true}
                                    onSearch={(query) => searchHandler(query, "G")}
                                    disablePickList={state.mode === "U"}
                                    clearSearchResult={() => clearSearchResult()}
                                />}
                        />
                        <FormControlLabel
                            value='U'
                            classes={{ label: classes.checkbox_label }}
                            control={<Radio />}
                            label={<AdvancedUserPickList
                                key={state.mode}
                                label={t('bam:USER')}
                                labelMinWidth="50px"
                                labelMaxWidth="50px"
                                form={false}
                                disablePickList={state.mode === "G"}
                                injectLiveValue
                                value={state.mode === "G" ? state.group_index : ""}
                                style={{ width: '110px' }}
                                onOpen={() => onOpenPicklist("U")}
                                list={list.list == null ? null : list.list}
                                loading={list.loading}
                                displayKey="name"
                                valueKey="user_index"
                                onChangeHandler={(res) => onChangePicklistInput("U", res)}
                                onChangePicklist={(res) => onChangePicklist("U", res)}
                                onSearch={(query) => searchHandler(query, "U")}
                                clearSearchResult={() => clearSearchResult()}
                                handleSearchToggle={handleSearchToggle}
                                hitGoAction={() => onOpenPicklist("U")}
                                Picklist={<PickList
                                    label={t('bam:GROUPS')}
                                    labelMinWidth="50px"
                                    labelMaxWidth="50px"
                                    form={false}
                                    style={{ width: '110px' }}
                                    onOpen={() => onOpenSubGroupPicklist()}
                                    list={subGroupList.list == null ? null : subGroupList.list}
                                    // value={userPicklistSettings.group_index}
                                    loading={subGroupList.loading}
                                    displayKey="group_name"
                                    valueKey="id"
                                    onChangeHandler={(res) => onChangePicklistInputSubGroup(res)}
                                    onChangePicklist={(res) => onChangePicklistSubGroup(res)}
                                    injectLiveValue={true}
                                    onSearch={(query) => searchHandlerSubGroup(query)}
                                    // disablePickList={state.mode === "U"}
                                    clearSearchResult={() => clearSearchResultSubGroup()}
                                />}
                            />}
                        />
                    </RadioGroup>
                    <div className={classes.alertListControls}>
                        {selected.length !== 0 && <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`} height={16} width={16} onClick={deleteSelected} />}
                        <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/plus_blue.svg`} height={16} width={16} onClick={addObjectToList} />
                    </div>

                    {tableData != null && tableData.length !== 0 ? <TableComponent
                        onChangeCheckbox={onChangeCheckbox}
                        headerData={headerData}
                        tableData={tableData}
                        loading={false}
                        minWidth="180px"
                    /> : <NotFound message={t('bam:ADD_USER_OR_GROUP')} messageFontSize="10px" iconSize={50} />}

                </div>
            </AccordionDetails>
        </Accordion>
        }
    </div>
}

const Rules = props => {
    const {
        rules = [],
        switchChange = false,
        execute_rules = true,
        toggleExecuteRules = console.warn('Rules: No toggleExecuteRules passed.'),
        fieldList = [{
            value: 0,
            label: 'No List Provided',
            type: ''
        }],
        onCancel = console.error('Rules Popup: No close handler passed.'),
        displayAlert = false,
        displayGraphical = true,
        displayTabular = true,
        onSave = console.error('Rules: onSave() not passed'),
        disableHead = false,
        showPreviousKey = false,
        setSwitchChange = null,
        onPrevious = console.warn('Rules: onPrevious() not passed'),

    } = props;
    const classes = useStyles({ disableHead });

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const [activeIndex, setActiveIndex] = useState(-1);

    const [counter, setCounter] = useState(() => rules.length)
    const [ruleEnabled, setRuleEnabled] = useState(execute_rules);

    const toggleExecuteRulesHandler = () => {
        let value = ruleEnabled;
        setRuleEnabled(!value);
        toggleExecuteRules(value);
    }

    const produceInitialRules = () => {
        const updatedRules = rules.map((rule, index) => ({
            ...rule,
            id: index,
            rule_order: index + 1,
            rule_operation: rule?.rule_operation === '' ? 'U' : rule?.rule_operation
        }))
        if (rules.length !== 0) setActiveIndex(0)
        return { rules: updatedRules };
    }

    const [state, setState] = useState(produceInitialRules);

    useEffect(() => {
        if (switchChange === true) {
            // onSave(state.rules)
            console.log("rules-in")

            validateAndSave();
        }
        console.log("rules-out")

    }, [switchChange])

    const addNewRule = () => {
        const newRule = { ...ruleJson };
        newRule.rule_name = `Rule ${state != null ? state.rules.length + 1 : 1}`;
        newRule.rule_order = state != null ? state.rules.length + 1 : 1;
        newRule.id = counter + 1;
        setCounter(counter + 1);
        const newRules = [...state.rules, newRule];
        setState({ rules: newRules });
        if (activeIndex === -1) {
            setActiveIndex(newRules[newRules.length - 1].id);
        }
    }

    const handleRuleToggle = (id, checkbox_field) => {
        let rules = [...state.rules]
        let index = findIndexById(rules, parseInt(id))
        let rule = Object.assign({}, rules[parseInt(index)]);
        if (rule.rule_operation === 'U') {
            rule.rule_operation = 'M';
        }
        if (checkbox_field === "rule_enabled")
            rule.rule_enabled = !rule.rule_enabled;
        else {
            if (rule.rule_selected == null) {
                rule["rule_selected"] = true;
            }
            else {
                rule.rule_selected = !rule.rule_selected;
            }
        }
        rules[parseInt(index)] = rule;
        setState({ rules: rules });
    }

    const deleteSelectedRules = () => {
        let selectedDeleted = false;
        let rules = [], oldRules = [...state.rules];
        // for (let i = 0; i < oldRules.length; i++) {
        //     if (oldRules[i].rule_selected === true) {
        //         if (activeIndex === oldRules[i].id) {
        //             setActiveIndex(-1);
        //             selectedDeleted = true;
        //         }
        //     }
        //     else {
        //         rules.push(oldRules[i])
        //     }
        // }
        for (let i = 0; i < oldRules.length; i++) {
            if (oldRules[i].rule_selected === true) {
                if (activeIndex === oldRules[i].id) {
                    setActiveIndex(-1);
                    selectedDeleted = true;
                }
                if (oldRules[i].rule_operation !== 'I')
                    oldRules[i].rule_operation = 'D';
                else
                    oldRules[i].rule_operation = 'Z';
                oldRules[i].rule_order = -1 * (i + 1);
            }
            if (oldRules[i].rule_operation !== 'Z')
                rules.push(oldRules[i])
        }

        rules.sort((first, second) => {
            let first_order = first.rule_order, second_order = second.rule_order;
            if (first_order > second_order) return 1;
            else return -1;
        })

        let rule_order = 1;

        for (let i = 0; i < rules.length; i++) {
            if (rules[i].rule_operation === 'D') continue;
            rules[i].rule_order = rule_order++;
        }

        // if (rules.length === 0) {
        //     setActiveIndex(-1)
        // }
        // else {

        if (selectedDeleted === true) {
            // setActiveIndex(rules[0].id)

            let found = false;
            for (let i = 0; i < rules.length; i++) {
                if (rules[i].rule_operation !== 'D') {
                    setActiveIndex(rules[i].id);
                    found = true;
                    break;
                }
            }
            if (found === false) {
                setActiveIndex(-1)
            }
        }

        setState({ rules: rules })
    }

    const handleStateChangeByIndex = event => {
        const index = findIndexById(state.rules, activeIndex);
        let rule = Object.assign({}, state.rules[index]);
        rule = {
            ...rule,
            [event.target.name]: event.target.value.trim(),
        }
        if (rule.rule_operation === 'U') {
            rule.rule_operation = 'M';
        }

        let rules = [...state.rules];
        rules[index] = rule;

        setState({ rules: rules })
    }
    const handleFieldChange = (type = "condition", value, index) => {
        console.log(type, value, index);
        if (type !== "condition") {
            onChangeHandler({ target: { name: "field_name", value: fieldList[parseInt(value)].display_name } }, type);
        }
        else {
            const ruleIndex = findIndexById(state.rules, activeIndex);
            let rule = Object.assign({}, state.rules[ruleIndex]);
            if (rule.rule_operation === 'U') {
                rule.rule_operation = 'M';
            }
            let ruleCondition = Object.assign({}, rule.rule_conditions[index]);
            ruleCondition = {
                ...ruleCondition,
                operand1: {
                    name: fieldList[parseInt(value)].display_name,
                    type: fieldList[parseInt(value)].type,
                    length: fieldList[parseInt(value)].length,
                }
            }

            rule.rule_conditions[index] = ruleCondition;
            let rules = [...state.rules];
            rules[ruleIndex] = rule;

            setState({ rules: rules });
        }
        return;
    }


    const addNewCondition = () => {
        const index = findIndexById(state.rules, activeIndex);
        let rule = Object.assign({}, state.rules[index]);

        if (rule.rule_operation === 'U') {
            rule.rule_operation = 'M';
        }
        let ruleConditions = [...rule.rule_conditions];
        ruleConditions.push({ ...ruleConditionJson });

        rule.rule_conditions = ruleConditions;
        let rules = [...state.rules];
        rules[index] = rule;

        setState({ rules: rules });
    }

    const onChangeHandler = (event, nestedKey = "") => {
        let rules = [...state.rules];
        const index = findIndexById(state.rules, activeIndex);
        let rule = Object.assign({}, rules[index]);

        if (rule.rule_operation === 'U') {
            rule.rule_operation = 'M';
        }
        if (nestedKey === "") {
            rule = {
                ...rule,
                [event.target.name]: event.target.value,
            }
        }
        else {
            rule = {
                ...rule,
                [nestedKey]: {
                    ...rule[nestedKey],
                    [event.target.name]: event.target.value,
                }
            }
        }

        rules[index] = rule;
        setState({ rules: rules })
    }

    const deleteConditions = (selectedConditions) => {
        const index = findIndexById(state.rules, activeIndex);
        let rule = Object.assign({}, state.rules[index]);

        if (rule.rule_operation === 'U') {
            rule.rule_operation = 'M';
        }
        let ruleConditions = rule.rule_conditions.filter((rule, index) => selectedConditions.includes(index) === false);
        rule.rule_conditions = ruleConditions;
        let rules = [...state.rules];
        rules[index] = rule;

        setState({ rules: rules });
    }

    const handleConditionChange = (event, index) => {
        const ruleIndex = findIndexById(state.rules, activeIndex);
        let rule = Object.assign({}, state.rules[ruleIndex]);

        if (rule.rule_operation === 'U') {
            rule.rule_operation = 'M';
        }
        let ruleCondition = Object.assign({}, rule.rule_conditions[index]);
        ruleCondition = {
            ...ruleCondition,
            [event.target.name]: event.target.value,
        }

        rule.rule_conditions[index] = ruleCondition;
        let rules = [...state.rules];
        rules[ruleIndex] = rule;

        setState({ rules: rules });
    }

    const userAndGroupUpdate = (userList, groupList) => {
        const ruleIndex = findIndexById(state.rules, activeIndex);
        let rule = Object.assign({}, state.rules[ruleIndex]);
        rule = {
            ...rule,
            alert: {
                ...rule.alert,
                user: userList,
                group: groupList
            }
        }
        if (rule.rule_operation === 'U') {
            rule.rule_operation = 'M';
        }

        let rules = [...state.rules];
        rules[ruleIndex] = rule;
        setState({ rules: rules });
    }

    const handleValueChange = (event, index, Type = 'C') => {
        const ruleIndex = findIndexById(state.rules, activeIndex);
        let rule = Object.assign({}, state.rules[ruleIndex]);
        if (rule.rule_operation === 'U') {
            rule.rule_operation = 'M';
        }
        let ruleCondition = Object.assign({}, rule.rule_conditions[index]);
        ruleCondition = {
            ...ruleCondition,
            operand2: {
                ...ruleCondition.operand2,
                value: event.target.value,
                type: Type,
            }
        }
        rule.rule_conditions[index] = ruleCondition;
        let rules = [...state.rules];
        rules[ruleIndex] = rule;

        setState({ rules: rules });
    }
    const snackbarState = useSelector(store => store.snackbarState);

    const validateInputType = (type, input) => {



        //checks for data type of input
        return true;
    }

    const areRuleConditionsValid = rule_conditions => {
        let leftBrackets = 0, rightBrackets = 0;

        if (rule_conditions.length === 0) {
            snackbarState.openSnackbar(`${t('bam:DEFINE_SOME_CONDITION')}`, 'warning', 5000);
            return false;
        }


        for (let i = 0; i < rule_conditions.length; i++) {
            if (rule_conditions[i].opening_brace === true) leftBrackets++;
            if (rule_conditions[i].closing_brace === true) rightBrackets++;

            if (rule_conditions[i].operator === "") {
                snackbarState.openSnackbar(`${t('bam:PLEASE_SELECT_OPERATOR')}`, 'warning', 5000);
                return false;
            }

            if (rule_conditions[i].operand1.name === "") {
                snackbarState.openSnackbar(`${t('bam:PLEASE_SELECT_FIELDS')}`, 'warning', 5000);
                return false;
            }
            if (rule_conditions[i].operand2.value === "") {
                snackbarState.openSnackbar(`${t('bam:PLEASE_ENTER_VALUE')}`, 'warning', 5000);
                return false;
            }
            if (validateInputType(rule_conditions[i].operand2.value, rule_conditions[i].operand1.type) === false) {
                snackbarState.openSnackbar(`${t('bam:INPUT_VALUE_TYPE')} ${TypeConversion(rule_conditions[i].operand1.type)}`, 'warning', 5000);
                return false;
            }
        }

        if (leftBrackets !== rightBrackets) {
            console.log(leftBrackets, rightBrackets)
            snackbarState.openSnackbar(`${t('bam:EQUAL_OPEN_CLOSE_BRACKETS')}`, 'warning', 5000);
            return false;
        }

        return true;
    }

    const validTabular = data => {
        if (data.field_name === "") {
            snackbarState.openSnackbar(`${t('bam:SELECT_FIELD_VALUE_TABULAR')}`, 'warning', 5000);
            return false;
        }
        if (data.style_type === 'D' && data.label_color === "") {
            snackbarState.openSnackbar(`${t('bam:SELECT_COLOR_LABEL_TABULAR')}`, 'warning', 5000);
            return false;
        }
        if (data.do_color_complete_cell && data.color_complete_cell === "") {
            snackbarState.openSnackbar(`${t('bam:SELECT_CELL_COLOR')}`, 'warning', 5000);
            return false;
        }
        if (data.do_color_complete_row && data.color_complete_row === "") {
            snackbarState.openSnackbar(`${t('bam:SELECT_COLOR_OF_ROW')}`, 'warning', 5000);
            return false;
        }
        // if(data.style_type === 'C'  && data.custom_style === "")    {
        //     snackbarState.openSnackbar('')
        // }
        return true;
    }
    const validGraphical = data => {
        if (data.field_name === "") {
            snackbarState.openSnackbar(`${t('bam:SELECT_FIELD_VALUE_GRAPHICAL')}`, 'warning', 5000);
            return false;
        }
        if (data.style_type === 'D' && data.label_color === "") {
            snackbarState.openSnackbar(`${t('bam:SELECT_COLOR_LABEL_GRAPHICAL')}`, 'warning', 5000);
            return false;
        }
        if (data.do_color_complete_area && data.color_complete_area === "") {
            snackbarState.openSnackbar(`${t('bam:SELECT_COLOR_OF_AREA')}`, 'warning', 5000);
            return false;
        }
        return true;
    }

    const isRuleValid = rule => {

        if (areRuleConditionsValid(rule.rule_conditions) === false) {
            return false;
        }
        if (displayTabular && validTabular(rule.tabular) === false) {
            // snackbarState.openSnackbar('Number of opening brackets is not equal to number of closing brackets', 'warning', 5000);
            return false;
        }
        if (displayGraphical && validGraphical(rule.graphical) === false) {
            // snackbarState.openSnackbar('Number of opening brackets is not equal to number of closing brackets', 'warning', 5000);
            return false;
        }
        return true;
    }

    const validateAndSave = () => {
        for (let i = 0; i < state.rules.length; i++) {
            // console.log(state.rules[i])
            if (isRuleValid(state.rules[i]) === false) {
                // alert('invalid')
                setActiveIndex(state.rules[i].id)
                if (setSwitchChange != null)
                    setSwitchChange(false);
                return;
            }
        }
        setActiveIndex(-1)
        switchChange === true ? onSave(state?.rules) : onSave(state.rules.filter(rule => rule.rule_operation !== 'U'))

        // setState({...state,rules:[]})
    }

    return <div className={classes.root}>
        {disableHead === false && <DialogTitle className={classes.header}>
            <Typography variant="h6"><b>{t('bam:RULES')}</b></Typography>
        </DialogTitle>}
        <Divider fullWidth />
        <div className={classes.body}>
            <div className={classes.leftContainer}>
                <LeftContainer
                    t={t}
                    state={state}
                    setState={setState}
                    setActiveIndex={setActiveIndex}
                    addNewRule={addNewRule}
                    activeIndex={activeIndex}
                    handleRuleToggle={handleRuleToggle}
                    deleteSelectedRules={deleteSelectedRules}
                />
            </div>
            {activeIndex !== -1 ? <div className={classes.rightContainer}>
                <div className={classes.topRightContainerTitle}>
                    <InputBox
                        label={t('bam:RULE_NAME')}
                        injectLiveValue={true}
                        value={state != null ? state.rules[findIndexById(state.rules, activeIndex)].rule_name : ""}
                        required={true}
                        labelMinWidth="90px"
                        labelMaxWidth="90px"
                        form={false}
                        name="rule_name"
                        onChange={event => handleStateChangeByIndex(event)}
                    />
                </div>
                <div className={classes.rightMiddleContainer}>
                    <div className={classes.rightInnerLeftContainer}>
                        <RightInnerContainerLeft
                            t={t}
                            rule_conditions={state != null ? state.rules[findIndexById(state.rules, activeIndex)].rule_conditions : []}
                            addNewCondition={addNewCondition}
                            fieldList={fieldList.map((field, index) => ({
                                value: index,
                                label: field.display_name,
                                type: field.type
                            }))}
                            handleFieldChange={handleFieldChange}
                            onChangeHandler={onChangeHandler}
                            deleteConditions={deleteConditions}
                            handleConditionChange={handleConditionChange}
                            handleValueChange={handleValueChange}
                        />
                    </div>
                    <div className={classes.rightInnerRightContainer}>
                        <RightInnerContainer
                            t={t}
                            displayAlert={displayAlert}
                            displayGraphical={displayGraphical}
                            displayTabular={displayTabular}
                            fieldList={fieldList.map((field, index) => ({
                                value: index,
                                label: field.display_name,
                            }))}
                            handleFieldChange={handleFieldChange}
                            onChangeHandler={onChangeHandler}
                            rule={state != null ? state.rules[findIndexById(state.rules, activeIndex)] : {}}
                            userAndGroupUpdate={userAndGroupUpdate}
                        />
                    </div>
                </div>
            </div> : <div className={classes.rightContainer}>
                <NotFound message={t('bam:NO_RULES_MESSAGE')} iconUrl={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trends_blank_screen_icon.svg`} />
            </div>}
        </div>
        <Divider fullWidth />
        <DialogActions className={classes.bottomActionBar}>
            <FormControlLabel
                control={
                    <Switch
                        checked={ruleEnabled}
                        onChange={toggleExecuteRulesHandler}
                        name="checkedB"
                        color="primary"
                    />
                }
                label={t('bam:EXECUTE_RULES')}
            />
            <Button variant="outlined" onClick={onCancel}> {t('bam:LABEL_CANCEL')}</Button>
            {showPreviousKey && <Button variant="outlined" color="primary" onClick={() => onPrevious(state.rules)}>{t('bam:BUTTON_PREVIOUS')}</Button>}
            <Button variant="contained" color="primary"
                onClick={() => validateAndSave()}>{t('bam:BUTTON_SAVE')}</Button>
        </DialogActions>
    </div>
}

export default Rules;