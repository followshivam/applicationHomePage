import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { InputBox, Typography } from 'component';

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
    root: {
        '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            '&::hover': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
            }
        }
    }
}));

const HHArray = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
const MMArray = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"]

const TimePicker = (props) => {
    const classes = useStyles();
    const { onCloseHandler = null, value = "", name = "", placeholder = 'HH:MM',
        hasHour = true, hasMinute = true, hasSecond = false, injectLiveValue = false,
        endAdornment = false, style = { width: '50px', height: '24px' }, disabled = false, format = ""
    } = props;

    const [hour, setHour] = useState(value.split(":")[0].trim() !== "" ? value.split(":")[0] : '00')
    const [minute, setMinute] = useState(value.split(":")[1].trim() !== "" ? value.split(":")[1] : '00')
    const [second, setSecond] = useState(value.split(":")[2] !== undefined ? value.split(":")[2].trim() !== "" ? value.split(":")[2] : "00" : "00")

    const [timePickerAnchorEl, setTimePickerAnchorEl] = React.useState(null);


    const open = Boolean(timePickerAnchorEl);
    const id = open ? 'time-picker' : undefined;

    const getValue = () => {
        let str = "";
        let arr = value.split(":")
        arr.map((item, index) => {
            let ch = item.trim();
            if (ch.length === 0) {
                str += "00"
            }
            else if (ch.length === 0)
                str += `0${ch}`
            else
                str += ch

            if (index < arr.length - 1)
                str += " : "
        })

        return str
    }

    return (
        <React.Fragment>
            <InputBox
                name={name}
                injectLiveValue={injectLiveValue}
                endAdornment={endAdornment}
                value={getValue()}
                style={style}
                placeholder={placeholder}
                disabled={disabled}
                onClick={(event) => {
                    if (disabled === false)
                        setTimePickerAnchorEl(event.currentTarget)
                }}
            />
            {
                format !== ""
                    ? <Typography style={{ padding: '0 4px' }}>{format}</Typography>
                    : null
            }

            <Popover
                id={id}
                open={open}
                anchorEl={timePickerAnchorEl}
                onClose={() => {
                    let time = '';
                    if (hasHour !== false) time += hour;
                    if (hasMinute !== false) time += ":" + minute;
                    if (hasSecond !== false) time += ":" + second;
                    onCloseHandler(time)
                    setTimePickerAnchorEl(null)
                }}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <div style={{ height: '300px', display: 'flex', justifyContent: 'space-evenly' }}>
                    <List aria-label="Hours">
                        {
                            hasHour === false
                                ? null
                                : HHArray.map((item, index) => (
                                    <ListItem button key={index} onClick={() => setHour(item)} selected={item === hour} className={classes.root}>
                                        <ListItemText primary={item} />
                                    </ListItem>
                                ))
                        }
                    </List>
                    <List aria-label="Minutes">
                        {
                            hasMinute === false
                                ? null
                                : MMArray.map((item, index) => (
                                    <ListItem button key={index} onClick={() => setMinute(item)} selected={item == minute} className={classes.root}>
                                        <ListItemText primary={item} />
                                    </ListItem>
                                ))
                        }
                    </List>
                    <List aria-label="Seconds">
                        {
                            hasSecond === false
                                ? null
                                : MMArray.map((item, index) => (
                                    <ListItem button key={index} onClick={() => setSecond(item)} selected={item == second} className={classes.root}>
                                        <ListItemText primary={item} />
                                    </ListItem>
                                ))
                        }
                    </List>
                </div>
            </Popover>
        </React.Fragment >
    )
}

export default TimePicker
