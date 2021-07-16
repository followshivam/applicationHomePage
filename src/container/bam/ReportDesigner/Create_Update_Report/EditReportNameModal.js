import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { InputBox } from "component/Form";
import { CreateReport } from 'redux/action'
import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

const useDailogStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: '4px',
        width: '517px',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiInputBase-multiline': {
            padding: 0
        }
    },
    spacing: {
        padding: theme.spacing(1, 3, 2, 1),
        alignItems: 'stretch'
    },
    title: {
        padding: theme.spacing(2.5, 3, 0, 3),
        fontWeight: '600 !important',
    },
    form: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        flexGrow: '1'
    },
}));

function EditReportNameModal(props) {
    const classes = useDailogStyles();
    const { handleClose, t } = props;
    const [isLoading, setIsLoading] = React.useState({ msg: "", loading: false });
    const { loading, msg } = isLoading;
    const [store] = useSelector(
        state => {
            return [state.createReportState]
        }
    )
    const dispatch = useDispatch()
    const [values, setValues] = useState({
        report_name: store.report_name,
        report_description: store.report_description
    })

    const handleSubmit = (event) => {
        setIsLoading({ ...isLoading, loading: true });
        event.preventDefault();

        dispatch(
            CreateReport({
                ...store,
                ...values

            })
        )
        setIsLoading({ ...isLoading, loading: false });
        handleClose();

        return false;
    }

    return (
        <div className={classes.paper}>
            <DialogTitle id="dialog-title" className={classes.title}>{t('bam:EDIT_REPORT_DETAILS')}</DialogTitle>
            <form className={classes.form} onSubmit={handleSubmit}>
                <DialogContent style={{ padding: '16px 24px 8px' }}>
                    <div style={{ paddingBottom: '24px' }}>
                        <InputBox
                            label={t('bam:REPORT_NAME')}
                            name={"report_name"}
                            required={true}
                            value={values.report_name}
                            fullWidth={true}
                            injectLiveValue={true}
                            form={true}
                            helpertext={t('bam:20_CHAR_MAX')}
                            onChangeHandler={(e) => setValues({
                                ...values,
                                report_name: e.target.value,
                            })}
                        />
                        <InputBox
                            label={t('bam:DESCRIPTION')}
                            name='report_description'
                            rows='3'
                            helpertext={t('bam:20_CHAR_MAX')}
                            fullWidth={true}
                            multiline={true}
                            minRows={8}
                            maxRows={4}
                            value={values.report_description}
                            onChangeHandler={(e) => setValues({
                                ...values,
                                report_description: e.target.value,
                            })}
                        />
                    </div>
                </DialogContent>
                <DialogActions className={classes.spacing}>
                    <Button onClick={handleClose} variant="outlined">{t('bam:LABEL_CANCEL')}</Button>
                    <Button type="submit" variant="contained" color="primary" style={{ minWidth: '92px' }}>{t('bam:SAVE_DETAILS')}</Button>
                </DialogActions>
            </form>
        </div>
    )
}

export default EditReportNameModal