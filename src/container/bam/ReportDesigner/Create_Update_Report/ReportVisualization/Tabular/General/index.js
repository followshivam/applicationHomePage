import React from 'react'
import {
   makeStyles,
   FormControlLabel,
   Checkbox,
   Grid,
   Typography,
   SelectBox,
   ColorPicker
} from 'component'

const useStyles = makeStyles(theme => ({
   root: {
      padding: theme.spacing(1.5, 2)
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
   },
   marginTopStyle: {
      marginTop: '12px'
   },
   label_text: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#606060',
      marginBottom: '2px'
   }
}))

const General = props => {
   const { t } = props
   const classes = useStyles()

   const handleColorChange = (color, itemIndex) => {
      props.syncTableState(itemIndex, color.hex)
   }

   return (
      <div className={classes.root}>
         <Grid container direction='row' justify='flex-start' alignItems="center" spacing={1}>
            <Grid item xs={6}>
               <SelectBox
                  label={t('bam:TABLE_BORDER_TYPE')}
                  value={props.state.table_properties.table_border_type}
                  list={[{ value: 'outlined', label: 'outlined' }]}
                  form={true}
                  style={{ width: '180px' }}
                  labelMinWidth={'105px'}
                  onChange={event =>
                     props.syncTableState(
                        'table_border_type',
                        event.target.value
                     )
                  }
               />
            </Grid>
            <Grid item xs={6}>
               <Typography variant="body1" className={classes.label_text}>
                  {t('bam:TABLE_BORDER_COLOR')}
               </Typography>
               <ColorPicker
                  displayColorCode={true}
                  color={props.state.table_properties.table_border_color}
                  itemIndex='table_border_color'
                  colorChanger={handleColorChange}
               />
            </Grid>
         </Grid>
         <Grid container direction='row' justify='flex-start' className={classes.marginTopStyle}>
            <div>
               <Typography variant="body1" className={classes.label_text}>
                  {t('bam:TABLE_BACKGROUND_COLOR')}
               </Typography>
               <ColorPicker
                  displayColorCode={true}
                  color={props.state.table_properties.table_background_color}
                  itemIndex='table_background_color'
                  colorChanger={handleColorChange}
               />
            </div>
         </Grid>

         <Grid container justify='space-between' alignItems='center' direction='row' className={classes.marginTopStyle} xs={6}>
            <FormControlLabel
               control={
                  <Checkbox
                     color='primary'
                     disableRipple={true}
                     disableFocusRipple={true}
                     onClick={() => {
                        props.state.table_properties.show_column_outline === 'Y'
                           ? props.syncTableState('show_column_outline', 'N')
                           : props.syncTableState('show_column_outline', 'Y')
                     }}
                     checked={
                        props.state.table_properties.show_column_outline === 'Y'
                     }
                  />
               }
               label={t('bam:COLUMN_OUTLINE')}
               labelPlacement='end'
               classes={{ label: classes.checkbox_label }}
            />
            {props.state.table_properties.show_column_outline === 'Y' ? (
               <ColorPicker
                  displayColorCode={true}
                  color={props.state.table_properties.column_outline_color}
                  itemIndex='column_outline_color'
                  colorChanger={handleColorChange}
               />
            ) : null}
         </Grid>

         <Grid container justify='space-between' alignItems='center' direction='row' xs={6}>
            <FormControlLabel
               control={
                  <Checkbox
                     color='primary'
                     disableRipple={true}
                     disableFocusRipple={true}
                     onClick={() => {
                        props.state.table_properties.show_row_outline === 'Y'
                           ? props.syncTableState('show_row_outline', 'N')
                           : props.syncTableState('show_row_outline', 'Y')
                     }}
                     checked={
                        props.state.table_properties.show_row_outline === 'Y'
                     }
                  />
               }
               label={t('bam:ROW_OUTLINE')}
               labelPlacement='end'
               classes={{ label: classes.checkbox_label }}
            />
            {props.state.table_properties.show_row_outline === 'Y' ? (
               <ColorPicker
                  displayColorCode={true}
                  color={props.state.table_properties.row_outline_color}
                  itemIndex='row_outline_color'
                  colorChanger={handleColorChange}
               />
            ) : null}
         </Grid>
      </div>
   )
}

export default General
