import React, { Fragment } from 'react'
import { InputBox, DialogActions, makeStyles } from 'component'

const useStyles = makeStyles(theme => ({
   root: {
      padding: '0px 10px 0px 9px',
      width: '500px',
      marginTop: '-20px'
   },
   category_name: {
      marginBottom: '15px'
   }
}))

const AddNew = props => {
   const classes = useStyles()
   const { fromReport, t } = props

   return (
      <div className={fromReport ? classes.root : null}>
         <div className={fromReport ? classes.category_name : null}>
            <InputBox
               label={fromReport ? `${t('bam:REPORT_CATEGORY_NAME')}` : `${t('bam:CATEGORY_NAME')}`}
               name='category_name'
               required={true}
               form={fromReport ? true : false}
               fullWidth
               maxLabelWidth='120px'
               minLabelWidth='120px'
               helpertext={fromReport ? `${t('bam:20_CHAR_MAX')}` : null}
               style={fromReport ? { width: '465px' } : { width: '240px' }}
            />
         </div>
         <InputBox
            label={t('bam:DESCRIPTION')}
            name='category_desc'
            form={fromReport ? true : false}
            fullWidth
            multiline={true}
            rows={4}
            maxLabelWidth='120px'
            minLabelWidth='120px'
            // helpertext={fromReport ? 'Max of 50 Characters' : null}
            style={fromReport ? { width: '465px' } : { width: '240px' }}
         />
      </div>
   )
}
export default AddNew
