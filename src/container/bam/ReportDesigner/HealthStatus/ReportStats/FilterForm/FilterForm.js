import React, { useEffect, useState } from "react";
import { Button, Typography, InputBox, SelectBox, makeStyles, PickList, CloseIcon, DatePickers } from "component";
import { GetUserList } from "global/bam/api/ApiMethods";
import { UserListInput } from "global/json";
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignContent: 'space-between',
        height: '100%',
        width: '105%'
    },
    timePanel: {
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'space-between',
        width: '88%',
        "& > *": {
            marginRight: '10px'
        }
    },
    time: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    timeInput: {
        width: theme.spacing(5)
    },
    otherOptions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '88%'
    },
    buttons: {
        width: '12%',
        fontSize: '10px'
    },
    input_label: {
        ...theme.typography.input_label,
        fontSize: "0.75rem"
    }
}))


const FilterForm = props => {
    const classes = useStyles();
    const { t } = props
    const [userList, setUserList] = useState({ loading: true, list: null, error_msg: "" })
    const [state, setState] = useState({
        "from_date": "2020-12-07 0:0:0",
        "to_date": "2021-01-07 0:0:0",
        "health_status": 0,
        "user_index": "",
        "time_taken": 0,
    })

    const clearFilters = () => {
        setState({
            "from_date": "2020-12-07 0:0:0",
            "to_date": "2021-01-07 0:0:0",
            "health_status": 0,
            "user_index": "",
            "time_taken": 0,
        })
        props.syncStates({
            "from_date": "",
            "to_date": "",
            "health_status": 0,
            "user_index": "",
            "time_taken": 0,
        });
    }

    const applyFilters = () => {
        props.syncStates(state);
    }

    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value.trim(),
        })
    }
    const onChangePicklistInput = (result) => {
        setState({
            ...state,
            "user_index": result.user_index,
        })
    }
    const handleTimeChange = event => {
        const [prefix, postfix] = event.target.name.split('_');
        let new_value;
        if (prefix === "to") {
            if (postfix === "date") {
                new_value = state.to_date;
                const time = new_value.split(' ')[1];
                const date = event.target.value;
                new_value = `${date} ${time}`
            }
            else {
                if (postfix === "hh") {
                    new_value = state.to_date;
                    let [date, time] = new_value.split(' ');
                    let [new_hh, new_mm, new_ss] = time.split(':');
                    new_hh = event.target.value;
                    if (new_hh < 0) new_hh = 23;
                    if (new_hh > 23) new_hh = 0;
                    time = `${new_hh}:${new_mm}:${new_ss}`;
                    new_value = `${date} ${time}`;
                }
                else if (postfix === "mm") {
                    new_value = state.to_date;
                    let [date, time] = new_value.split(' ');
                    let [new_hh, new_mm, new_ss] = time.split(':');
                    new_mm = event.target.value;
                    if (new_mm < 0) new_mm = 59;
                    if (new_mm > 59) new_mm = 0;
                    time = `${new_hh}:${new_mm}:${new_ss}`;
                    new_value = `${date} ${time}`;
                }
                else if (postfix === "ss") {
                    new_value = state.to_date;
                    let [date, time] = new_value.split(' ');
                    let [new_hh, new_mm, new_ss] = time.split(':');
                    new_ss = event.target.value;
                    if (new_ss < 0) new_ss = 99;
                    if (new_ss > 99) new_ss = 0;
                    time = `${new_hh}:${new_mm}:${new_ss}`;
                    new_value = `${date} ${time}`;
                }
            }
            setState({
                ...state,
                to_date: new_value,
            })
        }
        else if (prefix === "from") {
            if (postfix === "date") {
                new_value = state?.from_date;
                const time = new_value?.split(' ')[1];
                const date = event?.target?.value;
                new_value = `${date} ${time}`
            }

            else {
                if (postfix === "hh") {
                    new_value = state?.from_date;
                    let [date, time] = new_value?.split(' ');
                    let [new_hh, new_mm, new_ss] = time.split(':');
                    new_hh = event.target.value;
                    if (new_hh < 0) new_hh = 23;
                    if (new_hh > 23) new_hh = 0;
                    time = `${new_hh}:${new_mm}:${new_ss}`;
                    new_value = `${date} ${time}`;
                }
                else if (postfix === "mm") {
                    new_value = state.from_date;
                    let [date, time] = new_value?.split(' ');
                    let [new_hh, new_mm, new_ss] = time.split(':');
                    new_mm = event?.target?.value;
                    if (new_mm < 0) new_mm = 59;
                    if (new_mm > 59) new_mm = 0;
                    time = `${new_hh}:${new_mm}:${new_ss}`;
                    new_value = `${date} ${time}`;
                }
                else if (postfix === "ss") {
                    new_value = state.from_date;
                    let [date, time] = new_value.split(' ');
                    let [new_hh, new_mm, new_ss] = time.split(':');
                    new_ss = event.target.value;
                    if (new_ss < 0) new_ss = 99;
                    if (new_ss > 99) new_ss = 0;
                    time = `${new_hh}:${new_mm}:${new_ss}`;
                    new_value = `${date} ${time}`;
                }
            }
            setState({
                ...state,
                from_date: new_value,
            })
        }

    }

    const [query, setQuery] = useState({ query: "", load: false })
    const onOpenPicklist = () => {
        setUserList({ loading: true, list: null })
        let payload = { ...UserListInput };
        payload.prefix = query.query;
        GetUserList(payload).then((res) => {
            if (res != null && res.status.maincode === "0") {
                setUserList({ ...userList, loading: false, list: res.data })
            }
            else {
                setUserList({ ...userList, loading: false, error_msg: res.status.errormsg })
            }
        }).catch((err) => { })
    }


    useEffect(() => {
        if (query.load === true)
            onOpenPicklist();
    }, [query])

    const searchHandler = params => {
        setQuery({ query: params, load: true })
    }
    const clearSearchResult = () => {
        setQuery({ query: "", load: true })
    }


    return <React.Fragment>
        <div className={classes.root}>
            <div className={classes.timePanel}>
                <Typography className={classes.input_label}>{t('bam:DATE_TIME_RANGE')}:</Typography>
                <div className={classes.time}>
                    {/* <InputBox
                        type="date"
                        name="from_date"
                        value={state.from_date.split(' ')[0]}
                        onChangeHandler={handleTimeChange}
                        injectLiveValue={true}
                    /> */}
                    <DatePickers
                        width="110px"
                        value={state?.from_date?.split(' ')[0]}
                        injectLiveValue
                        name="from_date"
                        onChange={handleTimeChange}
                        timeFormat={false}
                        form={false}
                    />


                    <InputBox
                        className={classes.timeInput}
                        type="number"
                        name="from_hh"
                        value={state?.from_date?.split(' ')[1]?.split(':')[0]}
                        injectLiveValue={true}
                        onChangeHandler={handleTimeChange} />

                    <InputBox
                        className={classes.timeInput}
                        type="number"
                        name="from_mm"
                        value={state?.from_date?.split(' ')[1]?.split(':')[1]}
                        injectLiveValue={true}
                        onChangeHandler={handleTimeChange} />

                    <InputBox
                        className={classes.timeInput}
                        type="number"
                        name="from_ss"
                        value={state?.from_date?.split(' ')[1]?.split(':')[2]}
                        injectLiveValue={true}
                        onChangeHandler={handleTimeChange} />
                    <Typography variant="subtitle1" style={{ margin: '0px 10px' }}>-</Typography>
                    {/* <InputBox
                        type="date"
                        name="to_date"
                        value={state.to_date.split(' ')[0]}
                        injectLiveValue={true}
                        onChangeHandler={handleTimeChange}
                    /> */}

                    <DatePickers
                        width="110px"
                        value={state?.to_date.split(' ')[0]}
                        injectLiveValue
                        disabled={state.occurrence === 'OT'}
                        name="to_date"
                        onChange={handleTimeChange}
                        timeFormat={false}
                        form={false}
                    />

                    <InputBox
                        className={classes.timeInput}
                        type="number"
                        name="to_hh"
                        value={state?.to_date?.split(' ')[1]?.split(':')[0]}
                        injectLiveValue={true}
                        onChangeHandler={handleTimeChange} />

                    <InputBox
                        className={classes.timeInput}
                        type="number"
                        name="to_mm"
                        value={state?.to_date?.split(' ')[1]?.split(':')[1]}
                        injectLiveValue={true}
                        onChangeHandler={handleTimeChange} />

                    <InputBox
                        className={classes.timeInput}
                        type="number"
                        name="to_ss"
                        value={state?.to_date?.split(' ')[1]?.split(':')[2]}
                        injectLiveValue={true}
                        onChangeHandler={handleTimeChange} />
                </div>

            </div>
            <div className={classes.buttons}>
                <Button style={{ width: '81px' }} variant="outlined" color="primary" onClick={applyFilters}><Typography variant="subtitle2">{t('bam:APPLY_FILTERS')}</Typography></Button>
            </div>
            <div className={classes.otherOptions}>
                <PickList
                    label={t('USER') + ':'}
                    labelMinWidth="42px"
                    onOpen={onOpenPicklist}
                    labelMaxWidth="42px"
                    value={state.user_index}
                    name="user_index"
                    list={userList.list == null ? null : userList.list}
                    loading={userList.loading}
                    injectLiveValue={true}
                    displayKey="name"
                    valueKey="user_index"
                    pagination={true}
                    search={true}
                    //  onChangePicklist={(params) => paginatePickList(key, res, params)}
                    error_msg={userList.error_msg}
                    fullWidth={true}
                    form={false}
                    onChangeHandler={onChangePicklistInput}
                    onSearch={searchHandler}
                    clearSearchResult={clearSearchResult}
                />
                <SelectBox
                    value={state.time_taken}
                    label={t('bam:LABEL_TIME_TAKEN') + ':'}
                    form={false}
                    labelMaxWidth="85px"
                    labelMinWidth="85px"
                    injectLiveValue={true}
                    list={
                        [
                            { value: 0, label: `${t('bam:ALL')}` },
                            { value: 1, label: `${t('bam:LABEL_BELOW_AVERAGE')}` },
                            { value: 2, label: `${t('bam:LABEL_ABOVE_AVERAGE')}` }
                        ]}
                    name="time_taken"
                    onChangeHandler={handleChange} />
                <SelectBox
                    label={t('bam:STATUS') + ":"}
                    form={false}
                    labelMaxWidth="45px"
                    labelMinWidth="45px"
                    name="health_status"
                    injectLiveValue={true}
                    value={state.health_status}
                    onChangeHandler={handleChange}
                    list={
                        [
                            { value: 0, label: `${t('bam:LABEL_GOOD')}` },
                            { value: 1, label: `${t('bam:LABEL_AVERAGE')}` },
                            { value: 2, label: `${t('bam:LABEL_CRITICAL')}` }
                        ]}
                />

            </div>
            <div className={classes.buttons}>
                <Button onClick={clearFilters} ><CloseIcon /><Typography variant="subtitle2">{t('bam:CLEAR_FILTERS')}</Typography></Button>
            </div>
        </div>
    </React.Fragment >
}

export default FilterForm;