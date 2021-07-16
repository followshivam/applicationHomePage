import React, { useEffect, useState } from 'react'
import {
   Button,
   Checkbox,
   FormControlLabel,
   Grid,
   makeStyles,
   InputBox,
   Typography,
   useTranslation,
   IconsButton
} from 'component'

import { useSelector } from 'react-redux'
import { typography } from '@material-ui/system'

const useStyles = makeStyles({
   root: {
      width: '512px',
      // height: '394px',
      padding: '12px 19px'
   },
   outlinedInput: {
      width: '200px'
   },
   row: {
      height: '20px !important',
      padding: 'none'
   },
   descriptionBox: {
      width: '477px'
   },
   title: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 .4rem'
   },
   labelSpaces: {
      minWidth: '100px'
   },
   labelSpacesDisabled: {
      minWidth: '100px',
      color: 'lightgray'
   }
})

const AdvancedOptionPopup = props => {
   const classes = useStyles()
   const { index = null, advancedOptionData = {}, advancedOptionHandler = null, handleAdvancedOptionData = null } = props

   const globalSetting = useSelector(state => state.globalSettings)
   const { t } = useTranslation(globalSetting.locale_module)

   const [state, setState] = useState(advancedOptionData)

   useEffect(() => {
      setState(advancedOptionData)
   }, [advancedOptionData])

   const handleStateValue = e => {
      if (e.target.type == 'checkbox') {
         if (e.target.checked) {
            setState({ ...state, [e.target.name]: true })
         } else {
            setState({ ...state, [e.target.name]: false })
         }

      } else {
         setState({ ...state, [e.target.name]: e.target.value.trim() })
      }
   }

   const fields = state

   return (
      <div>
         <Grid className={classes.root}>
            <div className={classes.title}>
               <Typography variant='h6'>
                  <b>{t('bam:ADVANCED_OPTIONS')}</b>
               </Typography>
               <Typography variant='h6'>
                  <IconsButton
                     type='CloseIcon'
                     color='textSecondary'
                     onClick={() => props.handleAdvancedOptionData(state, index)}
                  />
               </Typography>
            </div>
            <table>
               <tbody>
                  <tr height='20px' className={classes.row}>
                     <td>
                        <FormControlLabel
                           control={
                              <Checkbox
                                 name='all_option'
                                 color='primary'
                                 disableRipple={true}
                                 disableFocusRipple={true}
                                 checked={fields.all_option}
                                 onChange={e => handleStateValue(e)}
                              // onChange={e => advancedOptionHandler(e, index)}
                              />
                           }
                           label={t('bam:SHOW_ALL_OPTION')}
                        />
                     </td>
                     <td>
                        <div style={{ display: 'flex' }}>
                           <Typography
                              variant='subtitle1'
                              className={
                                 !fields.all_option
                                    ? classes.labelSpacesDisabled
                                    : classes.labelSpaces
                              }
                           >
                              {t('bam:ALL_OPTION_LABEL')}
                           </Typography>
                           <InputBox
                              form={false}
                              name='all_label'
                              value={fields.all_label}
                              className={classes.outlinedInput}
                              disabled={!fields.all_option}
                              onChange={e => handleStateValue(e)}
                           // onChange={(e) => getFormValue(e, index, 'data')}
                           />
                        </div>
                     </td>
                  </tr>
                  <tr height='20px' className={classes.row}>
                     <td>
                        <FormControlLabel
                           control={
                              <Checkbox
                                 name='null_option'
                                 color='primary'
                                 disableRipple={true}
                                 disableFocusRipple={true}
                                 checked={fields.null_option}
                                 onChange={e => handleStateValue(e)}
                              // onChange={e => advancedOptionHandler(e, index)}
                              />
                           }
                           label={t('bam:NULL_OPTION_LABEL')}
                        />
                     </td>
                     <td>
                        <div style={{ display: 'flex' }}>
                           <Typography
                              variant='subtitle1'
                              className={
                                 !fields.null_option
                                    ? classes.labelSpacesDisabled
                                    : classes.labelSpaces
                              }
                           >
                              {t('bam:NULL_OPTION_LABEL')}
                           </Typography>
                           <InputBox
                              form={false}
                              name='null_label'
                              value={fields.null_label}
                              disabled={!fields.null_option}
                              className={classes.outlinedInput}
                              onChange={e => handleStateValue(e)}
                           // onChange={(e) => getFormValue(e, index, 'res')}
                           />
                        </div>
                     </td>
                  </tr>
                  <tr height='20px' className={classes.row}>
                     <td>
                        <FormControlLabel
                           control={
                              <Checkbox
                                 name='not_null_option'
                                 color='primary'
                                 disableRipple={true}
                                 disableFocusRipple={true}
                                 checked={fields.not_null_option}
                                 // onChange={e => advancedOptionHandler(e, index)}
                                 onChange={e => handleStateValue(e)}
                              />
                           }
                           label={t('bam:NOT_NULL_OPTION_LABEL')}
                        />
                     </td>
                     <td>
                        <div style={{ display: 'flex' }}>
                           <Typography
                              variant='subtitle1'
                              className={
                                 !fields.not_null_option
                                    ? classes.labelSpacesDisabled
                                    : classes.labelSpaces
                              }
                           >
                              {t('bam:NOT_NULL_OPTION_LABEL')}
                           </Typography>
                           <InputBox
                              form={false}
                              name='not_null_label'
                              value={fields.not_null_label}
                              className={classes.outlinedInput}
                              disabled={!fields.not_null_option}
                              onChange={e => handleStateValue(e)}
                           // onChange={(e) => getFormValue(e, index, 'res')}
                           />
                        </div>
                     </td>
                  </tr>
                  <tr height='20px' className={classes.row}>
                     <td>
                        <FormControlLabel
                           control={
                              <Checkbox
                                 name='multi_selection'
                                 color='primary'
                                 disableRipple={true}
                                 disableFocusRipple={true}
                                 checked={fields.multi_selection}
                                 // onChange={e => advancedOptionHandler(e, index)}
                                 onChange={e => handleStateValue(e)}
                              />
                           }
                           label={t('bam:MULTIPLE_SECTION')}
                        />
                     </td>
                     <td>
                        <FormControlLabel
                           control={<Checkbox />}
                           label={t('bam:DISABLE_MANUAL_OPTION')}
                        />
                     </td>
                  </tr>
                  <tr height='20px' className={classes.row}>
                     <td>
                        <FormControlLabel
                           control={<Checkbox />}
                           label={t('bam:ACCEPT_MULTIPLE')}
                        />
                     </td>
                     <td>
                        <FormControlLabel
                           control={<Checkbox />}
                           label={t('bam:SHOW_DEFAULT_IN_OUTPUT')}
                        />
                     </td>
                  </tr>
                  <tr height='20px' className={classes.row}>
                     <td>
                        <FormControlLabel
                           control={<Checkbox />}
                           label={t('bam:SHOW_DEFAULT')}
                        />
                     </td>
                     <td>
                        <FormControlLabel
                           control={
                              <Checkbox
                                 name='delimited'
                                 color='primary'
                                 disableRipple={true}
                                 disableFocusRipple={true}
                                 checked={fields.delimited}
                                 // onChange={e => advancedOptionHandler(e, index)}
                                 onChange={e => handleStateValue(e)}
                              />
                           }
                           label={t('bam:DELIMITED')}
                        />
                     </td>
                  </tr>
                  <tr height='20px' className={classes.row}>
                     <td>
                        <FormControlLabel
                           control={
                              <Checkbox
                                 name='hide_from_output'
                                 color='primary'
                                 disableRipple={true}
                                 disableFocusRipple={true}
                                 checked={fields.hide_from_output}
                                 // onChange={e => advancedOptionHandler(e, index)}
                                 onChange={e => handleStateValue(e)}
                              />
                           }
                           label={t('bam:HIDE_FROM_OUTPUT')}
                        />
                     </td>
                  </tr>
                  <tr height='20px' className={classes.row}>
                     <td>
                        <FormControlLabel
                           control={
                              <Checkbox
                                 name='manadatory'
                                 color='primary'
                                 disableRipple={true}
                                 disableFocusRipple={true}
                                 checked={fields.manadatory}
                                 // onChange={e => advancedOptionHandler(e, index)}
                                 onChange={e => handleStateValue(e)}
                              />
                           }
                           label={t('bam:MANDATORY')}
                        />
                     </td>
                  </tr>
               </tbody>
            </table>
            <InputBox
               name='description'
               className={classes.descriptionBox}
               label={t('bam:DESCRIPTION')}
               value={fields.description}
               placeholder='This input Field is for...'
               // onChange={e => handleInput(e)}
               onChange={e => handleStateValue(e)}
            />
         </Grid>
      </div>
   )
}

export default AdvancedOptionPopup
