import React, { Fragment, Suspense, useEffect, useState } from 'react'
import {
   makeStyles,
   Button,
   Checkbox,
   DialogActions,
   FormControlLabel,
   SelectBox,
   InputBox,
   IconImage,
   Spinner,
   Typography,
   Tabs,
   Tab,
   Grid
} from 'component'
import { useDispatch, useSelector } from 'react-redux'
import { CreateReport } from 'redux/action'

const tabHeight = '30px'

const useStyles = makeStyles(theme => ({
   root: {
      width: '1000px'
   },
   header: {
      width: '100%',
      // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
      justifyContent: 'space-between',
      alignItems: 'center'
   },

   homeTab: {
      display: 'flex',
      fontSize: '12px',
      whiteSpace: 'noWrap',
      color: '##606060',
      fontWeight: 600,
      marginBottom: '15px',
      alignItems: 'center'
   },

   required_field: {
      color: 'red'
   },

   leftWrapper: {
      width: '50%',
      flexGrow: 1,
      marginRight: '0px',
      marginTop: '35px'
   },
   wrapper: {
      width: '100%'
   },
   span: {
      display: 'inline-block',
      verticalAlign: 'middle',
      // marginLeft: '12px'
   },
   spanDown: {
      display: 'inline-block',
      verticalAlign: 'middle'
   },
   inputbox: {
      margin: '10px'
   },

   actionBar: {
      margin: '0px 14px'
      // display: 'flex',
      // justifyContent: 'space-between'
   },
   tabs: {
      minHeight: tabHeight,
      height: tabHeight,
   },
   tab: {
      border: `1px solid ${theme.palette.borderColor}`,
      backgroundColor: '#F6F6F6',
      textTransform: 'none',
      minHeight: tabHeight,
      height: tabHeight,
      fontSize: '12px',
      minWidth: '53px'
   },
   tab_container: {
      flexGrow: 1,
      width: '100%',
      borderTop: '1px solid lightgrey',
      overflow: 'auto',
      padding: '25px 20px'
   },
   tabSelected: {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white
   },
   checkbox_label: {
      fontWeight: 600,
      color: '#606060'
   },
   root_title: {
      padding: '20px 0px 16px 25px'
   }
}))


const dateFormatsList = [
   {
      id: 1,
      value: 'DD/MM/YYYY',
      label: 'DD/MM/YYYY',
   },
   {
      id: 2,
      value: 'MM/DD/YYYY',
      label: 'MM/DD/YYYY',
   },
   {
      id: 3,
      value: 'YYYY/MM/DD',
      label: 'YYYY/MM/DD',
   }
]

const TabPanel = props => {
   const classes = useStyles()
   const { reportStore, index, value, setReportStore = null, handleDownloadValues = null, t } = props


   return <div>{value === index &&
      <TabContent t={t} value={value} handleDownloadValues={handleDownloadValues} reportStore={reportStore} />
   }
   </div>
}

const TabContent = props => {
   const { value = 0, handleDownloadValues, reportStore, t } = props
   const classes = useStyles()
   const [type, setType] = useState('html')

   useEffect(() => {
      if (value === 0) {
         setType('html')
         return false
      } else if (value === 1) {
         setType('pdf')
         return false
      } else if (value === 2) {
         setType('csv')
         return false
      } else if (value === 3) {
         setType('xlsx')
         return false
      } else if (value === 4) {
         setType('txt')
         return false
      } else {
         console.log('extra')
      }
   }, [value])

   const typeValue = reportStore.download_config


   const valueDate = (value === 0) ? typeValue.html : (value === 1) ? typeValue.pdf : (value === 2) ? typeValue.csv : (value === 3) ? typeValue.xlsx : (value === 4) ? typeValue.txt : {}

   return (
      <div className='root_tabs'>

         <div className={classes.homeTab}>
            <span className={classes.span}>{t('bam:DATE_FORMATE')}</span>
            <span style={{ marginLeft: '24px' }}>
               <SelectBox
                  list={dateFormatsList}
                  name={type}
                  value={valueDate.date_format}
                  onChange={(e) => handleDownloadValues(e, type, 'date_format')}
                  style={{ width: '188px' }}
               />
            </span>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
               value='show_report_header'
               control={
                  <Checkbox
                     name='show_report_header'

                     color='primary'
                     disableRipple={true}
                     disableFocusRipple={true}
                     checked={valueDate.show_header}
                     onChange={(e) => handleDownloadValues(e, type, 'show_header')}
                  />
               }
               label='Show Report Header'
               labelPlacement='end'
               classes={{
                  label: classes.checkbox_label
               }}
            />
            <InputBox
               label={t('bam:HEADER_NOTES')}
               name='header_notes'
               rows='3'
               style={{ width: '799px' }}
               fullWidth={true}
               multiline={true}
               name={type}
               disabled={!valueDate.show_header}
               onChangeHandler={(e) => handleDownloadValues(e, type, 'header_notes')}
               value={valueDate.header_notes}
               placeholder={t('bam:HEADER_NOTES_PLACEHOLDER')}
            />

         </div>

         <FormControlLabel
            value='show_footer'
            control={
               <Checkbox
                  name='show_footer'

                  color='primary'
                  disableRipple={true}
                  disableFocusRipple={true}
                  checked={valueDate.show_footer}
                  onChange={(e) => handleDownloadValues(e, type, 'show_footer')}
               />
            }
            label={t('bam:SHOW_FOOTER')}
            labelPlacement='end'
            classes={{
               label: classes.checkbox_label
            }}
         />
         <InputBox
            label={t('bam:FOOTER_NOTES')}
            name='footer_notes'
            rows='3'
            fullWidth={true}
            style={{ width: '799px' }}
            multiline={true}
            disabled={!valueDate.show_footer}
            value={valueDate.footer_notes}
            onChangeHandler={(e) => handleDownloadValues(e, type, 'footer_notes')}
            placeholder={t('bam:FOOTER_NOTES_PLACEHOLDER')}
         />
      </div>
   )
}


const DownloadConifguration = props => {
   const classes = useStyles()
   const { closeDialog = null, t } = props

   const dispatch = useDispatch()

   const [reportState] = useSelector(
      state => {
         return [
            state.createReportState,
         ]
      }
   )
   const [reportStore, setReportStore] = useState(reportState)

   const onSave = () => {
      dispatch(CreateReport(reportStore))
      setTimeout(() => closeDialog(), 100)
   }

   const actionButtonAddPageCommon = [
      {
         label: `${t('bam:LABEL_CANCEL')}`,
         action: closeDialog,
         variant: 'outlined',
         // color: "secondary",
         type: 'button'
      },
      {
         label: `${t('bam:BUTTON_SAVE')}`,
         action: onSave,
         variant: 'contained',
         color: 'primary',
         type: 'button'
      }
   ]



   const handleDownloadValues = (e, type, key) => {
      if (e.target.type == 'checkbox') {
         if (e.target.checked) {
            setReportStore({ ...reportStore, download_config: { ...reportStore.download_config, [type]: { ...reportStore.download_config[type], [key]: true } } })
         } else {
            setReportStore({ ...reportStore, download_config: { ...reportStore.download_config, [type]: { ...reportStore.download_config[type], [key]: false } } })
         }
      } else {
         setReportStore({ ...reportStore, download_config: { ...reportStore.download_config, [type]: { ...reportStore.download_config[type], [key]: e.target.value } } })
      }
   }


   const onChangeConfigValues = e => {
      let event = e.target
      if (event.checked) {
         if (event.name === 'show_download') {
            setReportStore({ ...reportStore, download_config: { ...reportStore.download_config, show_download_setting: true } })
         }
      } else {
         if (event.name === 'show_download') {
            setReportStore({ ...reportStore, download_config: { ...reportStore.download_config, show_download_setting: false } })
         }
      }

   }


   const [configValue, setconfigValue] = useState(0)
   const tabsArray = [
      { label: `${t('bam:HTML')}`, index: 0, value: 'html' },
      { label: `${t('bam:PDF')}`, index: 1, value: 'pdf' },
      { label: `${t('bam:CSV')}`, index: 2, value: 'csv' },
      { label: `${t('bam:XLSX')}`, index: 3, value: 'xlsx' },
      { label: `${t('bam:TXT')}`, index: 4, value: ' txt' }
   ]

   const handleConfigurations = (e, val) => {
      setconfigValue(val)
   }


   return (
      <div className={classes.root}>
         <div className={classes.root_title}><Typography variant='h5'>{t('bam:DEFAULT_DOWNLOAD_CONFIG')}</Typography></div>
         <div className={classes.header}>
            <div className={classes.wrapper}>
               <Tabs
                  value={configValue}
                  className={classes.tabs}
                  variant='standard'
                  onChange={handleConfigurations}
               >
                  {tabsArray.map((res, key) => (
                     <Tab
                        label={res.label}
                        key={key}
                        classes={{
                           selected: classes.tabSelected,
                           root: classes.tab
                        }}
                     />
                  ))}
               </Tabs>
               <div className={classes.tab_container}>
                  {tabsArray.map((res, key) => (
                     <TabPanel
                        value={configValue}
                        index={res.index}
                        t={t}
                        key={res.index}
                        reportStore={reportStore}
                        setReportStore={setReportStore}
                        handleDownloadValues={handleDownloadValues}
                     />

                  ))}
               </div>
            </div>

         </div>
         <DialogActions className={classes.actionBar}>

            <Grid container direction="row"
               justify="space-between"
               alignItems="center" >
               <Grid item>
                  <FormControlLabel
                     value='show_download'
                     control={
                        <Checkbox
                           name='show_download'

                           color='primary'
                           disableRipple={true}
                           disableFocusRipple={true}
                           // checked={reportStore.download_config.show_download_setting}
                           onChange={onChangeConfigValues}
                        />
                     }
                     label={t('bam:DOWNLOAD_SETTING')}
                     labelPlacement='end'
                     classes={{
                        label: classes.checkbox_label
                     }}
                  /></Grid>
               <Grid item>
                  {actionButtonAddPageCommon.map((res, key) => (
                     <Button
                        key={res.key}
                        type={res.type}
                        variant={res.variant}
                        color={res.color}
                        onClick={res.action}
                        style={{ marginLeft: '20px' }}
                     >
                        {res.label}
                     </Button>
                  ))}</Grid>
            </Grid>
         </DialogActions>
      </div>
   )
}

export default DownloadConifguration
