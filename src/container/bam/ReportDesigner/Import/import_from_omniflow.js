import React from "react";
import { useSelector } from "react-redux";
import { Button, useTranslation, Checkbox, DialogActions, DialogTitle, Divider, FormControlLabel, makeStyles, Pagination, TableComponent, Typography, withStyles } from "component";
// import { OmniImport } from '../../../global/json';


const useStyles = makeStyles(theme => ({
  root: {
    width: '740px',
  },
  title: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`
  },
  body: {
    padding: `0 ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`
  },
  paginationHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paginationHeaderToggles: {
    width: '35%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
}))

const StyledFormControlLabel = withStyles({
  label: {
    fontSize: '12px',
  }
})(FormControlLabel)


const ImportDialog = props => {
  const classes = useStyles();

  const [globalSetting, normalStoreDialog] = useSelector(state => {
    return [state.globalSettings, state.normalDialogState];
  });

  const { t } = useTranslation(globalSetting.locale_module)


  const headCells = [
    {
      id: "Report Name",
      numeric: false,
      disablePadding: true,
      label: `${t('bam:REPORT_NAME')}`
    },
    {
      id: "Category Name",
      numeric: false,
      disablePadding: true,
      label: `${t('bam:CATEGORY_NAME')}`
    },
    {
      id: "Status",
      numeric: false,
      disablePadding: true,
      label: `${t('bam:STATUS')}`
    },
    {
      id: "Rights Status",
      numeric: false,
      disablePadding: true,
      label: `${t('bam:RIGHTS_STATUS')}`
    },
  ];
  const tableData = [
    {
      id: "Report Name",
      key: "Average Process Time Report",
    },
    {
      id: "Category Name",
      key: "General Reports",
    },
    {
      id: "Status",
      key: "Good"
    },
    {
      id: "Rights Status",
      key: "Given"
    },
  ];


  const onCloseHandler = () => {
    normalStoreDialog.closeDialog();
  };
  return <div className={classes.root}>
    <DialogTitle className={classes.title}><Typography variant="h6"><strong>{t('bam:IMPORT_FROM_OMNIFLOW')}</strong></Typography></DialogTitle>
    <div className={classes.body}>
      <div className={classes.paginationHeader}>
        <Typography variant="subtitle1">{t('bam:UPGRADE_REPORT_LIST')}:</Typography>
        <div className={classes.paginationHeaderToggles}>
          <StyledFormControlLabel
            className={classes.checkBox}
            label={t('bam:OVERWRITE_EXISTING_REPORT')}
            control={<Checkbox />}
          />
          <Pagination />
        </div>
      </div>

      {/* <Divider variant="fullWidth" /> */}
      <div className={classes.tableContainer}>
        <TableComponent headerData={headCells} tableData={tableData} />
      </div>
    </div>
    <DialogActions>
      <Button variant="outlined" onClick={onCloseHandler}>{t('bam:LABEL_CANCEL')}</Button>
      <Button variant="contained" color="primary">{t('bam:IMPORT')}</Button>
    </DialogActions>
  </div>
}

export default ImportDialog;