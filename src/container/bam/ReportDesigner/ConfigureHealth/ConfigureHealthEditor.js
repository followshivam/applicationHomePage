import { Checkbox } from "@material-ui/core";
import { Divider, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, CloseIcon, Typography, Spinner, InputBox, SelectBox } from "component";
import React, { useEffect, useState } from "react";
import ColorPicker from "../../../component/ColorPicker/colorPicker";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        "& < *": {
            marginBottom: theme.spacing(1)
        }
    },
    preview: {
        display: 'flex',
        alignItems: 'center',
        "& > *": {
            marginRight: theme.spacing(0.5)
        }
    },
    blockingConditions: {
        marginTop: theme.spacing(1),

    },
    blockingCondition: {
        display: 'flex',
        alignItems: 'center',
        "& > *": {
            marginRight: theme.spacing(1)
        }
    },
    numberInput: {
        width: '40px'
    },
    emailElement: {
        width: '180px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '10%',
        backgroundColor: '#F8F8F8',
    },
    timeInput: {
        width: '50px',
    },
    timeCell: {
        display: 'flex',
        alignItems: 'center',
        "& > *": {
            marginRight: theme.spacing(1)
        }
    }

}))

const PrintCircle = props => {
    return (
        <span style={{
            display: 'inline-block',
            backgroundColor: props.color,
            width: props.radius,
            height: props.radius,
            borderRadius: '50%',
            marginRight: '5px',
            marginLeft: '5px',
        }} />
    )
}


let data = {
    "report_index": "0",
    "config": {
        "status_info": [{
            "id": "1",
            "colour": "#58FF00",
            "from_range": "0",
            "to_range": "10"
        }, {
            "id": "2",
            "colour": "#F7FF00",
            "from_range": "10",
            "to_range": "20"
        }, {
            "id": "3",
            "colour": "#FF0000",
            "from_range": "30",
            "to_range": "-1"
        }],
        "block_if_frequency": "N",
        "block_frequency": "0",
        "block_frequency_time_bound": "0",
        "block_if_range": "N",
        "block_range": "-1",
        "block_if_gn_time_avg": "N",
        "send_mail": "N",
        "mail_ids": ["rishu.trivedi@newgen.co.in"],
        "peak_hours_from": "",
        "peak_minutes_from": "",
        "peak_hours_to": "",
        "peak_minutes_to": ""
    }
}
const ConfigureHealthEditor = props => {
    const { t } = props

    const getStatusNameFromCode = id => {
        switch (id) {
            case "1": return `${t('bam:LABEL_GOOD')}`
            case "2": return `${t('bam:LABEL_AVERAGE')}`
            case "3": return `${t('bam:LABEL_BAD')}`
            case "4": return `${t('bam:LABEL_CRITICAL')}`
            default: break;
        }
    }

    const classes = useStyles();
    const [state, setState] = useState(data);

    useEffect(() => {
        setState(data)
    }, [props.state]);

    return <div className={classes.root}>
        {state != null ? <div className={classes.root}>
            <Typography variant="subtitle2">{t('bam:SET_HEALTH_STATUS_MESSAGE')}</Typography>
            <Divider fullWidth />
            <Table>
                <TableHead>
                    <TableCell>{t('bam:STATUS_NAME')}</TableCell>
                    <TableCell>{t('bam:RANGE_MM_SS')}</TableCell>
                    <TableCell>{t('bam:LABEL_COLOR')}</TableCell>
                    <TableCell>{t('bam:PREVIEW')}</TableCell>
                </TableHead>
                <TableBody>
                    {state.config.status_info.map(res => (
                        <TableRow key={res.id}>
                            <TableCell>{getStatusNameFromCode(res.id)}</TableCell>
                            <TableCell className={classes.timeCell}>
                                <InputBox className={classes.timeInput} />
                                <Typography variant="h6">-</Typography>
                                <InputBox className={classes.timeInput} />
                            </TableCell>
                            <TableCell><ColorPicker color={res.colour} /></TableCell>
                            <TableCell><div className={classes.preview}>
                                <PrintCircle color={res.colour} radius="12px" />
                                <Typography variant="subtitle1"><b>{getStatusNameFromCode(res.id)}</b></Typography>
                            </div></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.blockingConditions}>
                <Typography variant="subtitle2">{t('bam:BLOCKING_CONDITIONS')}:</Typography>
                <div className={classes.blockingCondition}>
                    <Checkbox />
                    <Typography variant="subtitle1">{t('bam:BLOACKING_CONDITIION')}</Typography>
                    <InputBox
                        type="number"
                        width="50px"
                        className={classes.numberInput}
                    />
                    <Typography variant="subtitle1">{t('bam:Times within')}</Typography>
                    <InputBox type="time" />
                </div>
                <div className={classes.blockingCondition}>
                    <Checkbox />
                    <Typography variant="subtitle1">{t('bam:BLOACKING_CONDITIION_TIME')}</Typography>
                    <InputBox
                        type="time"
                    />
                </div>
                <div className={classes.blockingCondition}>
                    <Checkbox />
                    <Typography variant="subtitle1">{t('bam:BLOACKING_CONDITIION_TIME')}</Typography>
                    <SelectBox list={[{ value: 0, label: `${t('bam:SELECT_RANGE')}` }]} value={0} />
                </div>
                <div className={classes.blockingCondition}>
                    <Checkbox />
                    <Typography variant="subtitle1">{t('bam:BLOACKING_CONDITIION_TIME')}</Typography>
                    <SelectBox list={[{ value: 0, label: `${t('bam:AVERAGE_TIME')}` }]} value={0} />
                </div>
                <div className={classes.emailCondition}>
                    <div className={classes.blockingCondition}>
                        <Checkbox />
                        <Typography variant="subtitle1">{t('bam:EMAIL_CONDITION')}</Typography>
                        <InputBox />
                    </div>
                    <div className={classes.emailListing}>
                        {state.config.mail_ids.map((res, index) => (
                            <div key={index} className={classes.emailElement}>
                                <Typography variant="subtitle1">{res}</Typography>
                                <CloseIcon />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div> : <div style={{ height: '500px', width: '100%' }}>
                <Spinner />
            </div>}

    </div>
}

export default ConfigureHealthEditor;