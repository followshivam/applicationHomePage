import { AccordionDetails, AccordionSummary, Button, Checkbox, FormControl, FormControlLabel, FormGroup, makeStyles, MenuItem, OutlinedInput, Select, TableCell, TableRow, TextField, Typography, withStyles } from "@material-ui/core";
import { ExpandMoreIcon } from "component";
import React, { useState } from "react";
import { InputPropertiesJson } from "./JSON/InputPropertiesJson";
import MuiAccordion from "@material-ui/core/Accordion"

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '11px 37px',
        height: '550px',
        width: '650px',
        overflow: 'visible'
    },
    title: {
        fontSize: '16px',
        fontWeight: '600'
    },

    td: {
        paddingRight: '25px'
    },

    outlinedSelect: {
        borderRadius: '0%',
        maxHeight: '23px',
        minWidth: '106px'
    },
    outlinedInput: {
        borderRadius: '0%',
        maxHeight: '23px',
        width: '200px'
    },
    noWrap: {
        flexWrap: 'nowrap',
        width: '700px',
    },
    upperLable: {
        fontWeight: '600',
    },
    upperOutlinedInput: {
        borderRadius: '0%',
        maxHeight: '23px',
        width: '136px'
    }
}));

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const StyledAccordionSummary = withStyles({
    root: {
        padding: '0',
        color: '#0072C6',
        fontSize: '12',
        '&$expanded': {
            padding: 'none'
        },
    }
})(AccordionSummary)

const StyledFormControlLabel = withStyles({
    label: {
        fontSize: '12px',
        paddingLeft: 'none'
    },
    labelPlacementStart: {
        marginLeft: '0',
        marginRight: '0px'
    }
})(FormControlLabel)

const StyledFormControlLableRight = withStyles({
    label: {
        fontSize: '12px',
    }
})(FormControlLabel)


const StyledSelect = withStyles({
    root: {
        borderRadius: '0% !important'
    }
})(Select)

const InputProperties = props => {
    const classes = useStyles();
    const [state, setState] = useState({
        ...InputPropertiesJson,
    })
    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    }
    const handleCheckChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        })
    }

    return (
        <div className={classes.root}>
            <Typography className={classes.title}>UserID (=)</Typography>
            <FormGroup row>
                <StyledFormControlLabel
                    control={<Checkbox name="hidden" checked={state.hidden} onChange={(event) => handleCheckChange(event)} />}
                    label="Hidden"
                    labelPlacement="start"
                />
                <StyledFormControlLabel
                    control={<Checkbox name="custom_picklist" checked={state.custom_picklist} onChange={(event) => handleCheckChange(event)} />}
                    label="Custom Picklist"
                    labelPlacement="start"
                />
            </FormGroup>
            {/* <FormGroup row className={classes.noWrap}>
                <FormControlLabel
                    control={<OutlinedInput className={classes.outlinedSelect} variant="outlined" />}
                    label="Associated Picklist"
                    labelPlacement="top" />
                <FormControlLabel
                    control={<Select className={[classes.outlinedSelect].join(" ")} name="input_type" value={state.input_type} variant="outlined" onChange={(event) => handleChange(event)}>
                        <MenuItem value={0}>Integer</MenuItem>
                        <MenuItem value={1}>Something 1</MenuItem>
                        <MenuItem value={2}>Something 2</MenuItem></Select>}
                    label="Input Type"
                    labelPlacement="top" />
                <FormControlLabel
                    control={<Select className={classes.outlinedSelect} name="default_value" variant="outlined" value={state.default_value} onChange={(event) => handleChange(event)} >
                        <MenuItem value={0}>Something 0</MenuItem>
                        <MenuItem value={1}>Something 1</MenuItem>
                        <MenuItem value={2}>Something 2</MenuItem>
                    </Select>}
                    label="Default Value"
                    labelPlacement="top" />
                <FormControlLabel
                    control={<OutlinedInput className={[classes.outlinedSelect].join(" ")} variant="outlined" />}
                    label="Alias"
                    labelPlacement="top" />
            </FormGroup> */}
            <div className={classes.upperPanel}>
                <table className={classes.table}>
                    <tbody>
                        <tr>
                            <td className={classes.td}>
                                <Typography variant="subtitle1" className={classes.upperLable}>Associated Picklist</Typography>
                            </td>
                            <td className={classes.td}>
                                <Typography variant="subtitle1" className={classes.upperLable}>Input Type</Typography>
                            </td>
                            <td className={classes.td}>
                                <Typography variant="subtitle1" className={classes.upperLable}>Default Value</Typography>
                            </td>
                            <td className={classes.td}>
                                <Typography variant="subtitle1" className={classes.upperLable}>Alias</Typography>
                            </td>
                        </tr>
                        <tr>
                            <td className={classes.td}>
                                <OutlinedInput className={classes.upperOutlinedInput} />
                            </td >
                            <td className={classes.td}>
                                <StyledSelect className={classes.outlinedSelect} variant="outlined" />
                            </td >
                            <td className={classes.td}>
                                <StyledSelect className={classes.outlinedSelect} variant="outlined" />
                            </td>
                            <td className={classes.td}>
                                <OutlinedInput variant="outlined" className={classes.upperOutlinedInput} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Accordion elevation={0}>
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="subtitle1" className={classes.heading}>Advanced Options</Typography>
                </StyledAccordionSummary>
                <AccordionDetails>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Show All Option"
                                    />
                                </td>
                                <td>
                                    <Typography variant="subtitle1">All Option Label</Typography>
                                </td>
                                <td>
                                    <OutlinedInput className={classes.outlinedInput} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Null Label"
                                    />
                                </td>
                                <td>
                                    <Typography variant="subtitle1">Null Label</Typography>
                                </td>
                                <td>
                                    <OutlinedInput className={classes.outlinedInput} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Not Null Label"
                                    />
                                </td>
                                <td>
                                    <Typography variant="subtitle1">Not Null Label</Typography>
                                </td>
                                <td>
                                    <OutlinedInput className={classes.outlinedInput} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Multiple Selection"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Multiple Values"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Show Default"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Hide from Output"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Mandatory"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Disable Manual Output"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default InputProperties;