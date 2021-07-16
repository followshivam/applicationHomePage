import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { InputBox } from "component/Form";
//Common Component
import { Button, Typography } from '@material-ui/core';
// Dialog Components
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
// Forms Components
import { Radio, RadioGroup, FormControlLabel, FormControl, Checkbox } from '@material-ui/core';

const useDailogStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: '4px',
        width: '421px',
        height: '420px',
    },
    spacing: {
        padding: theme.spacing(1, 3, 2, 1),
        alignItems: 'stretch'
    },
    title: {
        padding: theme.spacing(2, 2, 1, 2),
        fontWeight: '600 !important',
    },
    form: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: '100%'
    },
    dividers: {
        borderBottom: 'none',
    },
    checkboxRoot: {
        justifyContent: 'flex-end',
        '& .MuiCheckbox-root': {
            padding: theme.spacing(1, 0)
        },
        '& .MuiTypography-root': {
            flexBasis: '120px'
        }
    }
}));

function AddEditAppplicationModal(props) {
    const classes = useDailogStyles();

    const { open, handleClose, modalType } = props;
    const [values, setvalues] = React.useState({
        location: '',
        applicationName: '',
        applicationContext: '',
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('values : ', values);

        return false;
    }

    return (
        <Dialog
            classes={{ paper: classes.paper }}
            open={open}
            onClose={handleClose}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
        >
            <DialogTitle id="dialog-title" className={classes.title}>{modalType !== "EDIT" ? "Adding Application" : "Edit Application"}</DialogTitle>
            <form className={classes.form} onSubmit={handleSubmit}>
                <DialogContent dividers className={classes.dividers}>
                    {/* ! Location control */}
                    <FormControl style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexDirection: 'row', paddingBottom: '24px',
                    }}>
                        <Typography style={{ color: '#606060' }}>Location</Typography>
                        <RadioGroup row aria-label="location" name="location" value={values.location} onChange={(e) => setvalues({ ...values, location: e.target.value })} defaultValue="OmniApp">
                            <FormControlLabel value="OmniApp" control={<Radio color="primary" />} label="OmniApp Server" />
                            <FormControlLabel value="Other" control={<Radio color="primary" />} label="Other Server" />
                        </RadioGroup>
                    </FormControl>

                    <div style={{ paddingBottom: '24px' }}>
                        <InputBox
                            label={"Application Name"}
                            name={"applicationName"}
                            required={true}
                            form={false}
                            onChangeHandler={(e) => setvalues({ ...values, applicationName: e.target.value })}
                            labelMaxWidth="120px"
                            labelMinWidth={'120px'}
                            style={{ width: '240px' }}
                            fontWeight='600'
                        />
                    </div>
                    {
                        values.location === "Other"
                        &&
                        <>
                            <div style={{ paddingBottom: '24px' }}>
                                <InputBox
                                    label={"Application Domain"}
                                    name={"applicationDomain"}
                                    required={true}
                                    form={false}
                                    onChangeHandler={(e) => setvalues({ ...values, applicationDomain: e.target.value })}
                                    labelMaxWidth="120px"
                                    labelMinWidth={'120px'}
                                    style={{ width: '240px' }}
                                    fontWeight='600'
                                />
                            </div>
                            <div style={{ paddingBottom: '24px' }}>
                                <InputBox
                                    label={"Application Port"}
                                    name={"applicationPort"}
                                    required={true}
                                    form={false}
                                    onChangeHandler={(e) => setvalues({ ...values, applicationPort: e.target.value })}
                                    labelMaxWidth="120px"
                                    labelMinWidth={'120px'}
                                    style={{ width: '240px' }}
                                    fontWeight='600'
                                />
                            </div>
                        </>
                    }

                    <div style={{ paddingBottom: '24px' }}>
                        <InputBox
                            label={"Application Context"}
                            name={"applicationContext"}
                            required={true}
                            form={false}
                            onChangeHandler={(e) => setvalues({ ...values, applicationContext: e.target.value })}
                            labelMaxWidth="120px"
                            labelMinWidth={'120px'}
                            style={{ width: '240px' }}
                            fontWeight='600'
                        />
                    </div>

                    {
                        values.location === "Other"
                        &&
                        <FormControlLabel classes={{ root: classes.checkboxRoot }}
                            control={
                                <Checkbox
                                    name="ssl"
                                    checked={values.ssl}
                                    onChange={(e) => setvalues({ ...values, ssl: e.target.checked })}
                                />
                            }
                            label="SSL"
                            labelPlacement="start"
                        />
                    }

                </DialogContent>
                <DialogActions className={classes.spacing}>
                    <Button onClick={handleClose} variant="outlined">Cancel</Button>
                    <Button type="submit" variant="contained" color="primary" style={{ width: '60px' }}>
                        {modalType === "EDIT" ? 'SAVE' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog >
    )
}

export default AddEditAppplicationModal
