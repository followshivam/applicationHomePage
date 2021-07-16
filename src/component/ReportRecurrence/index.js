import React, { useState, useEffect } from 'react'
import {
    InputBox, SelectBox, FormGroup, makeStyles, Radio,
    Typography, Spinner, FormControlLabel, Checkbox, clsx,
    DialogActions, Button, DatePickers
} from "component";
import TimePicker from "component/TimePicker";
import { useSelector } from 'react-redux';

const buttonStyle = makeStyles({
    root: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    icon: {
        borderRadius: 3,
        width: 12,
        height: 12,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 12,
            height: 12,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    },
});

function StyledCheckbox(props) {
    const classes = buttonStyle();

    return (
        <Checkbox
            className={classes.root}
            disableRipple
            color="default"
            checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
            icon={<span className={classes.icon} />}
            inputProps={{ 'aria-label': 'decorative checkbox' }}
            {...props}
        />
    );
}

const onNextHandler = (e) => {
    e.preventDefault();
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin: `0px ${theme.spacing(2)}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    form: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    child: {
        width: '100%',
        margin: `${theme.spacing(0.5)}px 0`,
        '& .MuiInputBase-multiline': {
            padding: 0
        }
    },
    timeBox: {
        width: '45px'
    },
    time: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: `0 ${theme.spacing(2)}px`
    },
    item: {
        margin: `0 ${theme.spacing(2)}px`,
        width: '140px'
    },
    options: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        "& > *": {
            marginRight: theme.spacing(1)
        }
    },
    timeShrinked: {
        display: 'flex',
        margin: `0px ${theme.spacing(1)}px`,
        // width: theme.spacing(17),
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    daysGroup: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'start'
    },
    settingsoccurrence: (props) => {
        if (props.disableFlex === false)
            return {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'start'
            }
    },
    input_label: {
        ...theme.typography.input_label,
        marginTop: "7px",
        fontSize : '0.75rem',
        marginRight: theme.spacing(1.5),
    },
    monthly: {
        marginTop: theme.spacing(1),
        marginLeft: '-5px'
    },

}))

const ReportRecurrence = (props) => {
    const [state, setState] = useState();
    const [description, setDescription] = useState();
    const [isLoading, setIsLoading] = useState({ loading: true, message: "Loading" })


    const { storeState = null, actionButtonAddPageCommon = [], t } = props;

    const classes = useStyles({ disableFlex: state && state.occurrence === "M" });

    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
        generateDescription();
    }

    const generateWeekArray = week_days => {
        let index = week_days.split(',').map(x => parseInt(x));
        let weekArray = [false, false, false, false, false, false, false];
        for (let i = 0; i < index.length; i++) {
            weekArray[index[i] - 1] = true;
        }
        return weekArray
    }

    const generatePayload = () => {
        let recurrence = {
            occurrence: state.occurrence,
            description: description
        }

        // let proceed = true, error_variables = [];

        if (state.occurrence === "W") {
            recurrence["week_days"] = getWeekDays();
            if (state.daily_frequency_mode === '0') {
                recurrence["hours"] = state.daily_frequency_first_hour;
                recurrence["minutes"] = state.daily_frequency_first_minute;
                // if (!notNullAndBlank(state.daily_frequency_first_hour)) error_variables.push('Hours');
                // if (!notNullAndBlank(state.daily_frequency_first_minute)) error_variables.push('minutes');
            }
            else {
                recurrence["start_hour"] = state.daily_frequency_starting_hour;
                recurrence["start_minute"] = state.daily_frequency_starting_minute;
                recurrence["end_hour"] = state.daily_frequency_ending_hour;
                recurrence["end_minute"] = state.daily_frequency_ending_minute;
                recurrence["hour_gap"] = state.daily_frequency_second_hour;
                recurrence["min_gap"] = state.daily_frequency_second_minute;
                // if (!notNullAndBlank(state.daily_frequency_starting_hour)) error_variables.push('Hours');
                // if (!notNullAndBlank(state.daily_frequency_first_minute)) error_variables.push('minutes');
                // if (!notNullAndBlank(state.daily_frequency_first_hour)) error_variables.push('Hours');
                // if (!notNullAndBlank(state.daily_frequency_first_minute)) error_variables.push('minutes');
                // if (!notNullAndBlank(state.daily_frequency_first_hour)) error_variables.push('Hours');
                // if (!notNullAndBlank(state.daily_frequency_first_minute)) error_variables.push('minutes');
            }

            recurrence['start_date'] = state.duration_mode_start_date.split(' ')[0]

            if (state.duration_mode === '1') {
                recurrence['end_date'] = "";
            }
            else {
                recurrence['end_date'] = state.duration_mode_ending_date.split(' ')[0]
            }
        }
        else if (state.occurrence === "D") {
            recurrence["time_gap"] = state.daily_occurrence_time_gap;
            if (state.daily_frequency_mode === '0') {
                recurrence["hours"] = state.daily_frequency_first_hour;
                recurrence["minutes"] = state.daily_frequency_first_minute;
            }
            else {
                recurrence["start_hour"] = state.daily_frequency_starting_hour;
                recurrence["start_minute"] = state.daily_frequency_starting_minute;
                recurrence["end_hour"] = state.daily_frequency_ending_hour;
                recurrence["end_minute"] = state.daily_frequency_ending_minute;
                recurrence["hour_gap"] = state.daily_frequency_second_hour;
                recurrence["min_gap"] = state.daily_frequency_second_minute;
            }

            recurrence['start_date'] = state.duration_mode_start_date.split(' ')[0]

            if (state.duration_mode === '1') {
                recurrence['end_date'] = "";
            }
            else {
                recurrence['end_date'] = state.duration_mode_ending_date.split(' ')[0];
            }
        }
        else if (state.occurrence === "OT") {
            recurrence["start_date"] = state.one_time_occurrence_date.split(' ')[0]
            recurrence["hours"] = state.one_time_occurrence_hour;
            recurrence["minutes"] = state.one_time_occurrence_minute;
        }
        else {
            if (state.monthly_occurrence_mode === 1) {
                recurrence["week_days"] = state.monthly_occurrence_day_of_week;
                recurrence["week"] = state.monthly_occurrence_week_rank;
            }
            else {
                recurrence["days"] = state.monthly_occurrence_day_count;
            }
            recurrence["time_gap"] = state.monthly_occurrence_month_gap;
            recurrence["month"] = state.monthly_occurrence_month_gap;

            if (state.daily_frequency_mode === '0') {
                recurrence["hours"] = state.daily_frequency_first_hour;
                recurrence["minutes"] = state.daily_frequency_first_minute;
            }
            else {
                recurrence["start_hour"] = state.daily_frequency_starting_hour;
                recurrence["start_minute"] = state.daily_frequency_starting_minute;
                recurrence["end_hour"] = state.daily_frequency_ending_hour;
                recurrence["end_minute"] = state.daily_frequency_ending_minute;
                recurrence["hour_gap"] = state.daily_frequency_second_hour;
                recurrence["min_gap"] = state.daily_frequency_second_minute;
            }

            recurrence['start_date'] = state.duration_mode_start_date.split(' ')[0]

            if (state.duration_mode === '1') {
                recurrence['end_date'] = "";
            }
            else {
                recurrence['end_date'] = state.duration_mode_ending_date.split(' ')[0]
            }

        }

        return recurrence;
    }

    const getDayList = () => {
        let ans = [];
        for (let i = 0; i < 7; i++) {
            if (state.weekly_occurrence_week[i]) {
                ans.push(day_list[i].label);
            }
        }
        return ans.join(',')
    }

    const getWeekRank = id => {
        if (id == null || id === '') return;
        if (id === 'L') return 'Last'
        let index = parseInt(id);

        return dayOrderList[parseInt(index)].label;
    }

    const getDayName = id => {
        if (id == null || id === '') return;
        if (id === 'D') return 'Day';
        let index = parseInt(id);

        return day_list[parseInt(index)].label;
    }

    const generateDescription = () => {
        let description = "";
        if (state == null) return;

        if (state.occurrence === 'OT' && notNullAndBlank(state.one_time_occurrence_date) && notNullAndBlank(state.one_time_occurrence_hour)) {
            description = `Occurs once on ${state.one_time_occurrence_date} at ${state.one_time_occurrence_hour}:${state.one_time_occurrence_minute}`;
        }
        else {
            if (state.occurrence === 'W') {
                description = `Occurs every week on ${getDayList()}`;
            }
            else if (state.occurrence === 'D') {
                description = `Occurs every day`
            }
            else {
                if (state.monthly_occurrence_mode === '1' && notNullAndBlank(state.monthly_occurrence_month_gap) && notNullAndBlank(state.monthly_occurrence_day_count)) {
                    description = `Occurs monthly starting from January and recurr every ${state.monthly_occurrence_month_gap} on every day ${state.monthly_occurrence_day_count}`;
                }
                else if (notNullAndBlank(state.monthly_occurrence_month_gap) && notNullAndBlank(state.monthly_occurrence_day_of_week)) {
                    description = `Occurs monthly starting from January and recurr every ${state.monthly_occurrence_month_gap} on every ${getWeekRank(state.monthly_occurrence_week_rank)} of ${getDayName(state.monthly_occurrence_day_of_week)}`;
                }
            }

            if (state.daily_frequency_mode === '0' && notNullAndBlank(state.daily_frequency_first_hour) && notNullAndBlank(state.daily_frequency_first_minute)) {
                description = description + `. On each day at ${state.daily_frequency_first_hour}:${state.daily_frequency_first_minute}`;
            }
            else if (notNullAndBlank(state.daily_frequency_second_hour) && notNullAndBlank(state.daily_frequency_ending_hour)) {
                description = description + `. On every ${state.daily_frequency_second_hour} hours ${state.daily_frequency_second_minute} minutes starting from ${state.daily_frequency_starting_hour}:${state.daily_frequency_starting_minute} and ending at ${state.daily_frequency_ending_hour}:${state.daily_frequency_ending_minute}`
            }

            if (state.duration_mode === '1' && notNullAndBlank(state.duration_mode_start_date)) {
                console.log(state.duration_mode_start_date)
                description = description + `. Schedule starting from ${state.duration_mode_start_date}`;
            }
            else if (notNullAndBlank(state.duration_mode_start_date) && notNullAndBlank(state.duration_mode_ending_date)) {
                description = description + `. Schedule starting from ${state.duration_mode_start_date} and ending at ${state.duration_mode_ending_date}`;
            }
        }
        setDescription(description);
    }

    const generateState = () => {
        let newState = {
            occurrence: 'OT',

            one_time_occurrence_date: '',
            one_time_occurrence_hour: '',
            one_time_occurrence_minute: '',

            weekly_occurrence_week: [false, false, false, false, false, false],

            daily_occurrence_time_gap: '',

            monthly_occurrence_mode: 1,
            monthly_occurrence_day_count: '',
            monthly_occurrence_month_gap: '',
            monthly_occurrence_week_rank: '',
            monthly_occurrence_day_of_week: '',

            daily_frequency_mode: '0',
            daily_frequency_first_hour: '',
            daily_frequency_first_minute: '',
            daily_frequency_second_hour: '',
            daily_frequency_second_minute: '',
            daily_frequency_starting_hour: '',
            daily_frequency_starting_minute: '',
            daily_frequency_ending_hour: '',
            daily_frequency_ending_minute: '',

            duration_mode: '1',
            duration_mode_start_date: '',
            duration_mode_ending_date: '',

            description: ''
        }
        // setDescription(storeState.recurrence.description)

        let recurrence = {
            ...storeState.recurrence
        }

        newState.occurrence = recurrence.occurrence;


        if (recurrence.occurrence === 'OT') {
            newState.one_time_occurrence_date = recurrence.start_date.split(' ')[0];
            newState.one_time_occurrence_hour = recurrence.hours;
            newState.one_time_occurrence_minute = recurrence.minutes;
        }

        else if (recurrence.occurrence === 'M') {
            if (notNullAndBlank(recurrence.week_days) && notNullAndBlank(recurrence)) {
                newState.monthly_occurrence_mode = 1;
                newState.monthly_occurrence_day_of_week = recurrence.week_days;
                newState.monthly_occurrence_week_rank = recurrence.week;
            }
            else {
                newState.monthly_occurrence_mode = 2;
                newState.monthly_occurrence_day_count = recurrence.days
            }
            newState.monthly_occurrence_month_gap = recurrence.time_gap;
            if (notNullAndBlank(recurrence.hours) && notNullAndBlank(recurrence.minutes)) {
                newState.daily_frequency_mode = '0';
                newState.daily_frequency_first_hour = recurrence.hours;
                newState.daily_frequency_first_minute = recurrence.minutes;
            }
            else {
                newState.daily_frequency_mode = '1';
                newState.daily_frequency_starting_minute = recurrence.start_minute;
                newState.daily_frequency_starting_hour = recurrence.start_hour;
                newState.daily_frequency_ending_minute = recurrence.end_minute;
                newState.daily_frequency_ending_hour = recurrence.end_hour;
                newState.daily_frequency_second_hour = recurrence.hour_gap;
                newState.daily_frequency_second_minute = recurrence.min_gap;
            }
            newState.duration_mode_start_date = recurrence.start_date.split(' ')[0];

            if (!notNullAndBlank(recurrence.end_date)) {
                newState.duration_mode = '1';
            }
            else {
                newState.duration_mode = '2';
                newState.duration_mode_ending_date = recurrence.end_date.split(' ')[0];
            }
        }

        else if (recurrence.occurrence === 'W') {
            newState.weekly_occurrence_week = generateWeekArray(recurrence.week_days);
            if (notNullAndBlank(recurrence.hours) && notNullAndBlank(recurrence.minutes)) {
                newState.daily_frequency_mode = '0';
                newState.daily_frequency_first_hour = recurrence.hours;
                newState.daily_frequency_first_minute = recurrence.minutes;
            }
            else {
                newState.daily_frequency_mode = '1';
                newState.daily_frequency_starting_minute = recurrence.start_minute;
                newState.daily_frequency_starting_hour = recurrence.start_hour;
                newState.daily_frequency_ending_minute = recurrence.end_minute;
                newState.daily_frequency_ending_hour = recurrence.end_hour;
                newState.daily_frequency_second_hour = recurrence.hour_gap;
                newState.daily_frequency_second_minute = recurrence.min_gap;
            }
            newState.duration_mode_start_date = recurrence.start_date.split(' ')[0]

            if (!notNullAndBlank(recurrence.end_date)) {
                newState.duration_mode = '1';
            }
            else {
                newState.duration_mode = '2';
                newState.duration_mode_ending_date = recurrence.end_date.split(' ')[0]

            }
        }
        else if (recurrence.occurrence === 'D') {
            newState.daily_occurrence_time_gap = recurrence.time_gap;
            if (notNullAndBlank(recurrence.hours) && notNullAndBlank(recurrence.minutes)) {
                newState.daily_frequency_mode = '0';
                newState.daily_frequency_first_hour = recurrence.hours;
                newState.daily_frequency_first_minute = recurrence.minutes;
            }
            else {
                newState.daily_frequency_mode = '1';
                newState.daily_frequency_starting_minute = recurrence.start_minute;
                newState.daily_frequency_starting_hour = recurrence.start_hour;
                newState.daily_frequency_ending_minute = recurrence.end_minute;
                newState.daily_frequency_ending_hour = recurrence.end_hour;
                newState.daily_frequency_second_hour = recurrence.hour_gap;
                newState.daily_frequency_second_minute = recurrence.min_gap;
            }
            newState.duration_mode_start_date = recurrence.start_date.split(' ')[0]

            if (!notNullAndBlank(recurrence.end_date)) {
                newState.duration_mode = '1';
            }
            else {
                newState.duration_mode = '2';
                newState.duration_mode_ending_date = recurrence.end_date.split(' ')[0]
            }
        }
        setState({
            ...newState
        })
    }

    const notNullAndBlank = key => {
        return key != null && key !== ''
    }

    console.log(state);

    useEffect(() => {
        generateState();
    }, []);

    useEffect(() => {
        if (isLoading.loading === true)
            setIsLoading({ ...isLoading, loading: false });
        generateDescription();
    }, [state])

    const handleWeekArrayChange = event => {
        let index = parseInt(event.target.name);
        let weeks = [...state.weekly_occurrence_week];
        weeks[index] = !weeks[index];
        setState({
            ...state,
            weekly_occurrence_week: weeks,
        })
    }

    const getWeekDays = () => {
        let ans = [];
        for (let i = 0; i < state.weekly_occurrence_week.length; i++) {
            if (state.weekly_occurrence_week[i] === true) {
                ans.push(i + 1);
            }
        }
        return ans.join(',');
    }

    const day_list = [
        {
            label: `${t('bam:SUNDAY')}`,
            value: 0
        }, {
            label: `${t('bam:MONDAY')}`,
            value: 1
        },
        {
            label: `${t('bam:TUESDAY')}`,
            value: 2
        }, {
            label: `${t('bam:WEDNESDAY')}`,
            value: 3
        }, {
            label: `${t('bam:THRUSDAY')}`,
            value: 4
        }, {
            label: `${t('bam:FRIDAY')}`,
            value: 5
        }, {
            label: `${t('bam:SATURDAY')}`,
            value: 6
        }, {
            label: `${t('bam:DAY')}`,
            value: 'D'
        },
    ];

    const dayOrderList = [

        {
            label: `${t('bam:FIRST')}`,
            value: 0
        }, {
            label: `${t('bam:SECOND')}`,
            value: 1
        }, {
            label: `${t('bam:THIRD')}`,
            value: 2
        }, {
            label: `${t('bam:FORTH')}`,
            value: 3
        },
        {
            label: `${t('bam:LAST')}`,
            value: 'L'
        },

    ];

    const snackbarState = useSelector(store => store.snackbarState);

    const validateInput = recurrence => {
        // console.log(recurrence);
        let concerned_variables = [];
        for (let key in recurrence) {
            if (!notNullAndBlank(recurrence[key]) && key !== 'end_date') {
                concerned_variables.push(key);
            }

            if (key === 'end_date' && state.duration_mode === '2' && recurrence[key] === "") {
                concerned_variables.push(key);
            }
        }

        // if(state.duration_mode === '2') {
        //     if(recurrence['start_date'] )
        // }

        if (concerned_variables.length !== 0) {
            concerned_variables = concerned_variables.map(key => key.split('_').join(' '));
            snackbarState.openSnackbar(`${t('bam:PLEASE_ENTER_VALUE_OF')} ${concerned_variables.join(', ')}`, 'warning', 5000);
            return false;
        }

        return true;
    }

    const getoccurrence = () => {
        let one_time = <React.Fragment>
            {/* <InputBox
                type="date"
                className={classes.item}
                label="Date:"
                name="one_time_occurrence_date"
                value={state.one_time_occurrence_date}
                form={false}
                labelMinWidth="30px"
                labelMaxWidth="30px"
                onChange={handleChange}
            /> */}
            <DatePickers
                label={`${t('bam:START_DATE')} `}
                value={state.one_time_occurrence_date}
                injectLiveValue
                name="one_time_occurrence_date"
                onChange={handleChange}
                timeFormat={false}
                form={false}
                fontSize="0.75rem"
            />
            <div className={classes.time}>
                <Typography style={{ color: '#606060', fontSize: '12px', fontWeight: '600', marginRight: '20px' }}>{t('bam:TIME')} :</Typography>
                <TimePicker
                    name={"one_time_occurrence"}
                    injectLiveValue={true}
                    value={state.one_time_occurrence_hour + " : " + state.one_time_occurrence_minute}
                    onCloseHandler={(val) => {
                        setState({
                            ...state,
                            one_time_occurrence_hour: val.split(":")[0],
                            one_time_occurrence_minute: val.split(":")[1]
                        })
                        generateDescription();
                    }}
                    format={'hh:mm'}
                />
            </div>
        </React.Fragment>

        let daily = <div className={classes.time}>
            <InputBox
                className={classes.timeBox}
                type="number"
                min="0"
                max="23"
                label={`${t('bam:REOCCURS_AT')}:`}
                value={state.daily_occurrence_time_gap}
                name="daily_occurrence_time_gap"
                onChange={handleChange}
                form={false}
                labelMinWidth="95px"
                labelMaxWidth="95px" />
            <Typography variant="subtitle1">{t('bam:DAYS')}</Typography>
        </div>

        let weekly = <div className={classes.daysGroup}>
            <Typography className={classes.input_label}>
                {t('bam:REOCCURS_EVERY_WEEK')}:
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '70%' }}>
                <FormControlLabel
                    name="0"
                    label={t('bam:SUNDAY')}
                    control={<StyledCheckbox
                        checked={state.weekly_occurrence_week && state.weekly_occurrence_week[0]}
                    />}
                    onChange={handleWeekArrayChange}
                />
                <FormControlLabel
                    control={<StyledCheckbox
                        checked={state.weekly_occurrence_week && state.weekly_occurrence_week[1]}
                    />}
                    name="1"
                    label={t('bam:MONDAY')}
                    onChange={handleWeekArrayChange}
                />
                <FormControlLabel
                    control={<StyledCheckbox
                        checked={state.weekly_occurrence_week && state.weekly_occurrence_week[2]}
                    />}
                    name="2"
                    label={t('bam:TUESDAY')}
                    onChange={handleWeekArrayChange}
                />
                <FormControlLabel
                    control={<StyledCheckbox
                        checked={state.weekly_occurrence_week && state.weekly_occurrence_week[3]}
                    />}
                    name="3"
                    label={t('bam:WEDNESDAY')}
                    onChange={handleWeekArrayChange}
                />
                <FormControlLabel
                    control={<StyledCheckbox
                        checked={state.weekly_occurrence_week && state.weekly_occurrence_week[4]}
                    />}
                    name="4"
                    label={t('bam:THURSDAY')}
                    onChange={handleWeekArrayChange}
                />
                <FormControlLabel
                    name="5"
                    label={t('bam:FRIDAY')}
                    control={<StyledCheckbox
                        checked={state.weekly_occurrence_week && state.weekly_occurrence_week[5]}
                    />}
                    onChange={handleWeekArrayChange}
                /><FormControlLabel
                    name="6"
                    label={t('bam:SATURDAY')}
                    control={<StyledCheckbox
                        checked={state.weekly_occurrence_week && state.weekly_occurrence_week[6]}
                    />}
                    onChange={handleWeekArrayChange}
                />

            </div>
        </div>
        let monthly = <div className={classes.monthly}>
            <div className={classes.options}>
                <Radio
                    checked={state.monthly_occurrence_mode === 1}
                    name="monthly_occurrence_mode"
                    onClick={event => handleChange({ target: { name: event.target.name, value: 1 } })}
                />
                <Typography variant="subtitle1">{t('bam:DAY')}:</Typography>
                <InputBox
                    className={classes.timeBox}
                    type="number"
                    name="monthly_occurrence_day_count"
                    form={false}
                    min="0"
                    labelMinWidth="80px"
                    labelMaxWidth="80px"
                    disabled={state.monthly_occurrence_mode === 2}
                    value={state.monthly_occurrence_day_count}
                    onChange={handleChange}
                />
                <Typography variant="subtitle1">{t('bam:DAYS')}</Typography>
                <Typography variant="subtitle1">{t('bam:OF_EVERY')}</Typography>
                <InputBox
                    className={classes.timeBox}
                    type="number"
                    name="monthly_occurrence_month_gap"
                    form={false}
                    min="0"
                    labelMinWidth="80px"
                    labelMaxWidth="80px"
                    disabled={state.monthly_occurrence_mode === 2}
                    value={state.monthly_occurrence_month_gap}
                    onChange={handleChange}
                />
                <Typography variant="subtitle1">{t('bam:MONTHS')}</Typography>
            </div>
            <div className={classes.options}>
                <Radio
                    checked={state.monthly_occurrence_mode === 2}
                    name="monthly_occurrence_mode"

                    onClick={event => handleChange({ target: { name: event.target.name, value: 2 } })}
                />
                <Typography variant="subtitle1">{t('bam:THE')}: </Typography>
                <SelectBox
                    disabled={state.monthly_occurrence_mode === 1}
                    list={dayOrderList}
                    name="monthly_occurrence_week_rank"
                    value={state.monthly_occurrence_week_rank}
                    onChange={handleChange}
                />
                <SelectBox
                    disabled={state.monthly_occurrence_mode === 1}
                    list={day_list}
                    name="monthly_occurrence_day_of_week"
                    value={state.monthly_occurrence_day_of_week}
                    onChange={handleChange}
                />
                <Typography variant="subtitle1">{t('bam:OF_EVERY')}</Typography>
                <InputBox
                    className={classes.timeBox}
                    type="number"
                    name="monthly_occurrence_month_gap"
                    form={false}
                    min="0"
                    labelMinWidth="80px"
                    labelMaxWidth="80px"
                    disabled={state.monthly_occurrence_mode === 1}
                    value={state.monthly_occurrence_month_gap}
                    onChange={handleChange}
                />
                <Typography variant="subtitle1">{t('bam:MONTHS')}</Typography>
            </div>
        </div>
        switch (state.occurrence) {
            case 'OT':
                return one_time;
            case 'D':
                return daily;
            case 'W':
                return weekly;
            case 'M':
                return monthly;
            default:
                break;
        }
    }

    return <div style={{ width: '100%', height: '100%', overflow: 'visible' }}>{isLoading.loading === false ?
        <form onSubmit={onNextHandler} className={classes.form}>
            <div className={classes.root}>
                <div className={classes.child}>
                    <Typography variant="subtitle1" gutterBottom>{t('bam:FREQUENCY')}</Typography>
                    <div className={classes.settingsoccurrence}>
                        <FormGroup row>
                            <SelectBox
                                className={classes.item}
                                name="occurrence"
                                fontSize="0.75rem"
                                value={state.occurrence}
                                list={[{ value: "OT", label: `${t('bam:ONE_TIME')}` }, { value: "D", label: `${t('bam:OCURRENCE_DAILY')}` }, { value: "W", label: `${t('bam:OCURRENCE_WEEKLY')}` }, { value: "M", label: `${t('bam:OCURRENCE_MONTHLY')}` }]}
                                label={t('bam:OCCURS')}
                                form={false}
                                labelMinWidth="45px"
                                labelMaxWidth="45px"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        {getoccurrence()}
                    </div>
                </div>
                <div className={classes.child}>
                    <Typography variant="subtitle1" gutterBottom>{t('bam:DAILY_FREQUENCY')}</Typography>
                    <div className={classes.options}>
                        <Radio name="daily_frequency_mode"
                            checked={state.daily_frequency_mode === '0'}
                            onClick={event => handleChange({ target: { name: event.target.name, value: '0' } })}
                            disabled={state.occurrence === 'OT'}
                        />
                        <Typography variant="subtitle1">{t('bam:OCCURS_ONCE_AT')}</Typography>
                        <div className={classes.timeShrinked}>
                            <TimePicker
                                name={"daily_frequency_first"}
                                injectLiveValue={true}
                                value={state.daily_frequency_first_hour + " : " + state.daily_frequency_first_minute}
                                disabled={state.daily_frequency_mode === '1' || state.occurrence === 'OT'}
                                onCloseHandler={(val) => {
                                    setState({
                                        ...state,
                                        daily_frequency_first_hour: val.split(":")[0],
                                        daily_frequency_first_minute: val.split(":")[1]
                                    })
                                    generateDescription();
                                }}
                                format={'hh:mm'}
                            />
                        </div>
                    </div>
                    <div className={classes.options}>
                        <Radio name="daily_frequency_mode"
                            checked={state.daily_frequency_mode === '1' || state.occurrence === 'OT'}
                            onClick={event => handleChange({ target: { name: event.target.name, value: '1' } })}
                            disabled={state.occurrence === 'OT'}

                        />
                        <Typography variant="subtitle1">{t('bam:OCCURS_EVERY')}:</Typography>
                        <div className={classes.timeShrinked}>
                            <TimePicker
                                name={"daily_frequency_second"}
                                injectLiveValue={true}
                                value={state.daily_frequency_second_hour + " : " + state.daily_frequency_second_minute}
                                disabled={state.daily_frequency_mode === '0' || state.occurrence === 'OT'}
                                onCloseHandler={(val) => {
                                    setState({
                                        ...state,
                                        daily_frequency_second_hour: val.split(":")[0],
                                        daily_frequency_second_minute: val.split(":")[1]
                                    })
                                    generateDescription();
                                }}
                                format={'hh:mm'}
                            />
                        </div>
                        <div className={classes.time}>
                            <Typography style={{ color: '#606060', fontSize: '12px', fontWeight: '600', marginRight: '20px' }}>{t('bam:STARTINGAT')}:</Typography>
                            <TimePicker
                                name={"daily_frequency_starting"}
                                injectLiveValue={true}
                                value={state.daily_frequency_starting_hour + " : " + state.daily_frequency_starting_minute}
                                disabled={state.daily_frequency_mode === '0' || state.occurrence === 'OT'}
                                onCloseHandler={(val) => {
                                    setState({
                                        ...state,
                                        daily_frequency_starting_hour: val.split(":")[0],
                                        daily_frequency_starting_minute: val.split(":")[1]
                                    })
                                    generateDescription();
                                }}
                                format={'hh:mm'}
                            />
                        </div>
                        <div className={classes.time}>
                            <Typography style={{ color: '#606060', fontSize: '12px', fontWeight: '600', marginRight: '20px' }}>{t('bam:ENDINGAT')}:</Typography>
                            <TimePicker
                                name={"daily_frequency_ending"}
                                injectLiveValue={true}
                                value={state.daily_frequency_ending_hour + " : " + state.daily_frequency_ending_minute}
                                disabled={state.daily_frequency_mode === '0' || state.occurrence === 'OT'}
                                onCloseHandler={(val) => {
                                    setState({
                                        ...state,
                                        daily_frequency_ending_hour: val.split(":")[0],
                                        daily_frequency_ending_minute: val.split(":")[1]
                                    })
                                    generateDescription();
                                }}
                                format={'hh:mm'}
                            />
                        </div>
                    </div>
                </div>
                <div className={classes.child}>
                    <Typography variant="subtitle1" gutterBottom>{t('bam:DURATION')}</Typography>
                    <div className={classes.options}>
                        {/* <InputBox
                            type="date"
                            label="Start date:"
                            value={state.duration_mode_start_date}
                            name="duration_mode_start_date"
                            onChange={handleChange}
                            form={false}
                            labelMinWidth="60px"
                            labelMaxWidth="60px"
                            disabled={state.occurrence === 'OT'}
                        /> */}

                        <DatePickers
                            label={`${t('bam:START_DATE')} :`}
                            value={state.duration_mode_start_date}
                            disabled={state.occurrence === 'OT'}
                            injectLiveValue
                            fontSize="0.75rem"
                            name="duration_mode_start_date"
                            onChange={handleChange}
                            timeFormat={false}
                            form={false}
                        />
                        <Radio
                            name="duration_mode"
                            checked={state.duration_mode === '2'}
                            onClick={event => handleChange({ target: { name: event.target.name, value: '2' } })}
                            disabled={state.occurrence === 'OT'}

                        />
                        {/* <InputBox
                            type="date"
                            form={false}
                            value={state.duration_mode_ending_date}
                            name="duration_mode_ending_date"
                            onChange={handleChange}
                            labelMinWidth="60px"
                            labelMaxWidth="60px"
                            label="End date:"
                            disabled={state.duration_mode === '1' || state.occurrence === 'OT'}
                        /> */}

                        <DatePickers
                            label={`${t('bam:END_DATE')}`}
                            value={state.duration_mode_ending_date}
                            disabled={state.duration_mode === '1' || state.occurrence === 'OT' || state.duration_mode_start_date === ""}
                            injectLiveValue
                            fontSize="0.75rem"
                            disableBefore={state.duration_mode_start_date}
                            name="duration_mode_ending_date"
                            onChange={handleChange}
                            timeFormat={false}
                            form={false}
                        />

                        <Radio
                            name="duration_mode"
                            checked={state.duration_mode === '1'}
                            onClick={event => handleChange({ target: { name: event.target.name, value: '1' } })}
                            disabled={state.occurrence === 'OT'}

                        />
                        <Typography variant="subtitle1">{t('bam:NO_END_DATE')}</Typography>

                    </div>
                </div>
                <div className={classes.child}>
                    <Typography variant="subtitle1" gutterBottom>{t('bam:SUMMARY')}</Typography>
                    <InputBox
                        label={t('bam:DESCRIPTION')}
                        multiline={true}
                        name="description"
                        value={description}
                        injectLiveValue={true}
                        disabled={true}
                        rows={2}
                        form={false}
                        fullWidth={true}
                        labelMinWidth="75px"
                        labelMaxWidth="75px"
                    />
                </div>
            </div>
            <DialogActions style={{ position: 'absolute', bottom: '0', right: '0' }}>
                {actionButtonAddPageCommon.map((res, key) => <Button
                    key={res.key}
                    type={res.type}
                    variant={res.variant}
                    color={res.color}
                    onClick={(event) => {
                        if (res.type === "submit") {
                            let recurrence = generatePayload();
                            if (validateInput(recurrence) === true)
                                res.action(event, recurrence);
                            else
                                return;
                        } else
                            res.action(event)
                    }}>
                    {res.label}
                </Button>
                )}

            </DialogActions>
        </form>
        : <div className={classes.form}><Spinner /></div>}
    </div>
}

export default ReportRecurrence