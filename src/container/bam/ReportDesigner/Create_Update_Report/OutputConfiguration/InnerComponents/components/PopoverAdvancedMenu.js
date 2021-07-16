import React from 'react';
import Popover from '@material-ui/core/Popover';
import { Button, Checkbox, FormControlLabel, Grid, makeStyles, OutlinedInput, Typography, withStyles } from '@material-ui/core';
import { InputBox } from 'component';

const useStyles = makeStyles({
    root: {
        width: '512px',
        // height: '394px',
        padding: '12px 19px'
    },
    outlinedInput: {
        borderRadius: '0%',
        maxHeight: '23px',
        width: '200px'
    },
    row: {
        height: '20px !important',
        padding: 'none',
    },
    descriptionBox: {
        width: '477px'
    }
})
const StyledFormControlLableRight = withStyles({
    label: {
        fontSize: '12px',
    }
})(FormControlLabel)

const PopOverAdvancedMenu = props => {
    const classes = useStyles();
    // const [anchorEl, setAnchorEl] = React.useState(null);

    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    // const index = props.itemIndex;
    // console.log('index is')
    // console.log(index)
    const open = Boolean(props.anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            {/* <IconButton aria-describedby={id} variant="contained" onClick={handleClick} style={{
                backgroundColor: props.color,
            }}>
                <ColorLensIcon />
            </IconButton> */}
            <Popover
                id={id}
                open={open}
                anchorEl={props.anchorEl}
                onClose={props.handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {props.children}
                <Grid className={classes.root}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>Advanced Options</Typography>
                    <table>
                        <tbody>
                            <tr height="20px" className={classes.row}>
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
                                    <InputBox form={false} className={classes.outlinedInput} />
                                </td>
                            </tr>
                            <tr height="20px" className={classes.row}>
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
                                    <InputBox form={false} className={classes.outlinedInput} />
                                </td>
                            </tr>
                            <tr height="20px" className={classes.row}>
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
                                    <InputBox form={false} className={classes.outlinedInput} />
                                </td>
                            </tr>
                            <tr className={classes.row}>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Multiple Selection"
                                    />
                                </td>
                                <td colSpan={2}>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Disable Manual Output"
                                    />
                                </td>
                            </tr>
                            <tr className={classes.row}>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Multiple Values"
                                    />
                                </td>
                                <td colSpan={2}>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Show Default in Output"
                                    />
                                </td>
                            </tr>
                            <tr className={classes.row}>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Show Default"
                                    />
                                </td>
                                <td colSpan={2}>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Delimited"
                                    />
                                </td>
                            </tr>
                            <tr className={classes.row}>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Hide from Output"
                                    />
                                </td>
                            </tr>
                            <tr className={classes.row}>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Mandatory"
                                    />
                                </td>
                            </tr>
                            <tr className={classes.row}>
                                <td>
                                    <StyledFormControlLableRight
                                        control={<Checkbox />}
                                        label="Disable Manual Output"
                                    />
                                </td>
                            </tr>

                        </tbody>
                    </table>
                    <InputBox className={classes.descriptionBox} label="Description" placeholder="This input Field is for..." />
                </Grid>
            </Popover>
        </div>
    );
}


export default PopOverAdvancedMenu;