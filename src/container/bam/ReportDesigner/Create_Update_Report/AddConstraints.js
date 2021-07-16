import React, { Fragment, useEffect, useState } from 'react'
import {
   Button,
   Checkbox,
   FormControlLabel,
   Grid,
   makeStyles,
   InputBox,
   Typography,
   SelectBox,
   IconsButton,
   DialogActions
} from 'component'

const useStyles = makeStyles(theme => ({
   root: {
      padding: theme.spacing(3),
      height: '300px',
      width: '500px',
      display: 'flex',
      flexDirection: 'column'
   },
   buttons: {
      marginRight: '18px',
      marginBottom: '10px'
   },
   checkbox_label: {
      fontWeight: 600,
      color: '#606060'
   },
   avail_options: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: '28px'
   },
   select_box_width: {
      width: '49px'
   },
   label_start_space: {
      marginLeft: '12px',
      display: 'flex'
   },
   label_end_space: {
      marginLeft: '5px'
   }

}))

const AddConstraints = props => {
   const classes = useStyles()
   const { action_button, report_availabilty_constraint, report_view_constraint, report_download_constraint, t } = props
   const [reportAvailabiltyConstraint, setReportAvailabiltyConstraint] = useState(report_availabilty_constraint)
   const [reportViewConstraint, setReportViewConstraint] = useState(report_view_constraint)
   const [reportDownloadConstraint, setReportDownloadConstraint] = useState(report_download_constraint)

   useEffect(() => {
      setReportAvailabiltyConstraint(report_availabilty_constraint)
      setReportViewConstraint(report_view_constraint)
      setReportDownloadConstraint(report_download_constraint)
   }, [report_availabilty_constraint, report_view_constraint, report_download_constraint])

   const hoursData = []
   for (var i = 0; i < 24; i++) {
      let data = (i < 10) ? '0' + i.toString() : i.toString()
      hoursData.push({
         value: data,
         label: data
      })
   }

   const minutessData = []
   for (var i = 0; i < 60; i++) {
      let data = (i < 10) ? '0' + i.toString() : i.toString()
      minutessData.push({
         value: data,
         label: data
      })
   }

   const handleConstraints = e => {
      if (e.target.checked) {
         if (e.target.name === 'report_download') {
            setReportDownloadConstraint({ ...reportDownloadConstraint, report_download: true })
         } else if (e.target.name === 'report_view') {
            setReportViewConstraint({ ...reportViewConstraint, report_view: true })
         } else if (e.target.name === 'report_availability') {
            setReportAvailabiltyConstraint({ ...reportAvailabiltyConstraint, report_available: true })
         }
      } else {
         if (e.target.name === 'report_download') {
            setReportDownloadConstraint({ ...reportDownloadConstraint, report_download: false })
         } else if (e.target.name === 'report_view') {
            setReportViewConstraint({ ...reportViewConstraint, report_view: false })
         } else if (e.target.name === 'report_availability') {
            setReportAvailabiltyConstraint({ ...reportAvailabiltyConstraint, report_available: false })
         }
      }
   }

   const timeConvert = (from, to, index) => {
      let final = from.split(':')
      final.splice(index, 1, to)
      return final.join(':')
   }


   const handleFormValues = e => {
      if (e.target.name === 'report_download_interval') {
         setReportDownloadConstraint({ ...reportDownloadConstraint, report_download_interval: e.target.value.trim() })
      } else if (e.target.name === 'report_delay_interval') {
         setReportViewConstraint({ ...reportViewConstraint, report_delay_interval: e.target.value.trim() })
      } else if (e.target.name === 'from_hours') {
         setReportAvailabiltyConstraint({ ...reportAvailabiltyConstraint, from_time: timeConvert(reportAvailabiltyConstraint.from_time, e.target.value, 0) })
      } else if (e.target.name === 'from_minutes') {
         setReportAvailabiltyConstraint({ ...reportAvailabiltyConstraint, from_time: timeConvert(reportAvailabiltyConstraint.from_time, e.target.value, 1) })
      } else if (e.target.name === 'to_hours') {
         setReportAvailabiltyConstraint({ ...reportAvailabiltyConstraint, to_time: timeConvert(reportAvailabiltyConstraint.to_time, e.target.value, 0) })
      } else if (e.target.name === 'to_minutes') {
         setReportAvailabiltyConstraint({ ...reportAvailabiltyConstraint, to_time: timeConvert(reportAvailabiltyConstraint.to_time, e.target.value, 1) })
      } else {
         console.log('extra')
      }
   }

   return <Fragment>
      <div className={classes.root}>
         <Typography variant='h5' style={{ marginBottom: '5px' }}>
            {t('bam:TITLE_REPORT_CONSTRAINTS')}
         </Typography>
         <FormControlLabel
            value='report_availability'
            control={
               <Checkbox
                  name='report_availability'
                  color='primary'
                  disableRipple={true}
                  disableFocusRipple={true}
                  checked={reportAvailabiltyConstraint.report_available}
                  onChange={handleConstraints}
               />
            }
            label={t('bam:REPORT_AVAILABILITY')}
            labelPlacement='end'
            classes={{
               label: classes.checkbox_label
            }}
         />
         <div className={classes.avail_options}>
            <Typography variant='h4' style={{ lineHeight: 1.8 }}>
               {t('bam:SCHEDULER_FROM')}
            </Typography>
            <div className={classes.label_start_space}>
               <SelectBox
                  name='from_hours'
                  className={classes.select_box_width}
                  disabled={!reportAvailabiltyConstraint.report_available}
                  value={reportAvailabiltyConstraint.from_time.slice(0, 2)}
                  list={hoursData}
                  onChange={handleFormValues}
               />
               <Typography variant='subtitle1' className={classes.label_end_space}>
                  {t('bam:HRS')}
               </Typography>
            </div>
            <div className={classes.label_start_space}>
               <SelectBox
                  name='from_minutes'
                  className={classes.select_box_width}
                  disabled={!reportAvailabiltyConstraint.report_available}
                  value={reportAvailabiltyConstraint.from_time.slice(3, 5)}
                  list={minutessData}
                  onChange={handleFormValues}
               />
               <Typography variant='subtitle1' className={classes.label_end_space}>
                  {t('bam:MIN')}
               </Typography>
            </div>
            <Typography variant='h4' style={{ marginLeft: '10px', lineHeight: 1.8 }}>
               {t('bam:TO')}
            </Typography>
            <div className={classes.label_start_space}>
               <SelectBox
                  name='to_hours'
                  className={classes.select_box_width}
                  disabled={!reportAvailabiltyConstraint.report_available}
                  value={reportAvailabiltyConstraint.to_time.slice(0, 2)}
                  list={hoursData}
                  onChange={handleFormValues}
               />
               <Typography variant='subtitle1' className={classes.label_end_space}>
                  {t('bam:HRS')}
               </Typography>
            </div>
            <div className={classes.label_start_space}>
               <SelectBox
                  name='to_minutes'
                  className={classes.select_box_width}
                  disabled={!reportAvailabiltyConstraint.report_available}
                  value={reportAvailabiltyConstraint.to_time.slice(3, 5)}
                  list={minutessData}
                  onChange={handleFormValues}
               />
               <Typography variant='subtitle1' className={classes.label_end_space}>
                  {t('bam:MIN')}
               </Typography>
            </div>
         </div>
         <div style={{ marginTop: '25px' }}>
            <FormControlLabel
               value='report_view'
               control={
                  <Checkbox
                     name='report_view'
                     color='primary'
                     disableRipple={true}
                     disableFocusRipple={true}
                     checked={reportViewConstraint.report_view}
                     onChange={handleConstraints}
                  />
               }
               label={t('bam:LABEL_REPORT_DELAY_INTERVAL')}
               labelPlacement='end'
               classes={{
                  label: classes.checkbox_label
               }}
            />
            <div className={classes.avail_options}>
               <InputBox
                  name='report_delay_interval'
                  value={reportViewConstraint.report_delay_interval}
                  onChange={handleFormValues}
                  disabled={!reportViewConstraint.report_view}
                  className={classes.select_box_width} />
               <Typography variant='subtitle1' className={classes.label_end_space}>
                  {t('bam:MIN')}
               </Typography>

            </div></div>

         {/* __________________report_download_interval___+_______ */}

         <div style={{ marginTop: '25px' }}>
            <FormControlLabel
               value='report_download'
               control={
                  <Checkbox
                     name='report_download'
                     color='primary'
                     disableRipple={true}
                     disableFocusRipple={true}
                     checked={reportDownloadConstraint.report_download}
                     onChange={handleConstraints}
                  />
               }
               label={t('bam:LABEL_REPORT_DOWNLOAD_INTERVAL')}
               labelPlacement='end'
               classes={{
                  label: classes.checkbox_label
               }}
            />
            <div className={classes.avail_options}>
               <InputBox
                  name='report_download_interval'
                  value={reportDownloadConstraint.report_download_interval}
                  onChange={handleFormValues}
                  disabled={!reportDownloadConstraint.report_download}
                  className={classes.select_box_width} />
               <Typography variant='subtitle1' className={classes.label_end_space}>
                  {t('bam:MIN')}
               </Typography>

            </div>
         </div>
      </div>


      <DialogActions className={classes.buttons}>
         {action_button.map((res, key) => {
            return (
               <Button
                  key={key}
                  variant={res.variant}
                  color={res.color}
                  onClick={() => res.action(reportAvailabiltyConstraint, reportDownloadConstraint, reportViewConstraint)}
                  type={res.type}
               >
                  {res.label}
               </Button>
            )
         })}
      </DialogActions>
   </Fragment>

}

export default AddConstraints