import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, DialogActions, InputBox, DialogTitle, makeStyles, Typography, Spinner, useTranslation } from "component";
import { GetReportDefinition } from "global/bam/api/ApiMethods";
import { ReportDefinitionInput } from "global/json";
const useStyles = makeStyles(theme => ({
  root: {
    width: '520px',
    // padding: `0 ${theme.spacing(2)}px`
  },
  title: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`
  },
  body: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
  }
}))

const Query = props => {
  const classes = useStyles();
  const { data = [] } = props;
  const [queryData, setQueryData] = useState("");

  const { loading, msg } = isLoading;


  const [globalSetting, normalStoreDialog] = useSelector(state => {
    return [state.globalSettings, state.normalDialogState];
  });

  const { t } = useTranslation(globalSetting.locale_module)
  const [isLoading, setIsLoading] = useState({ msg: `${t('bam:LOADING')}...`, loading: true });
  const onCloseHandler = () => {
    normalStoreDialog.closeDialog();
  };
  const getShowQueryData = () => {
    setIsLoading({ ...isLoading, loading: true });
    GetReportDefinition({ ...ReportDefinitionInput, report_index: data.report_index, option: "1" })
      .then(res => {
        if (res != null) {
          setQueryData(res.data.query_result);
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
        }
      })
      .catch(err => { });
  };
  useEffect(() => {
    getShowQueryData()
  }, [data])
  return <div className={classes.root}>
    <DialogTitle className={classes.title}>
      <Typography variant="h6"><strong>{t('bam:SHOW_QUERY')}</strong>({data.report_name})</Typography>
    </DialogTitle>
    {isLoading.loading ? (
      <div style={{ height: "150px" }}>
        <Spinner msg={msg} />
      </div>
    ) : <div className={classes.body}>
      <InputBox
        label={t('bam:DESC_REPORT_QUERY')}
        fullWidth={true}
        multiline={true}
        rows={4}
        defaultValue={queryData}
        disabled
      />
    </div>}
    <DialogActions >
      <Button variant="outlined" onClick={onCloseHandler}>{t('bam:LABEL_CANCEL')}</Button>
    </DialogActions>
  </div>
}

export default Query;