import React, { useState } from 'react'
import {
   makeStyles,
   FormControlLabel,
   Checkbox,
   Button,
   Grid,
   SelectBox,
   IconsButton,
   Typography,
   ColorPicker,
   withStyles
} from 'component'

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import { FontSettings } from 'global/json'

const StyledToggleButtonGroup = withStyles(theme => ({
   grouped: {
      '&:not(:first-child)': {
         borderRadius: '0%'
      },
      '&:first-child': {
         borderRadius: '0%'
      }
   }
}))(ToggleButtonGroup)

const useStyles = makeStyles(theme => ({
   root: {
      padding: '.4rem'
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
   },
   widthStyle: {
      width: '100%'
   },
   marginTopStyle: {
      marginTop: '.5rem'
   },
   colorSwatchUpper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '35%'
   },
   colorSwatchLower: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '20%'
   },
   colorPicker: {
      paddingLeft: `${theme.spacing(1)}px`
   },
   label_text: {
      fontFamily: 'OpenSans-Semibold',
      color: '#606060'
   },
   toogleButtonSize: {
      height: '27px'
   }
}))

const OtherRows = props => {
   const { t } = props
   const classes = useStyles()

   const handleColorChange = (color, itemIndex) => {
      props.syncTableState(itemIndex, color.hex)
   }

   return (
      <div className={classes.root}>
         {/* <FormControlLabel
                control={<Checkbox color="primary" checked={props.state.table_properties.DualRowColor === "Y"} disableRipple={true} disableFocusRipple={true}
                    onClick={() => { props.state.table_properties.DualRowColor === "Y" ? props.syncTableState("DualRowColor", "N") : props.syncTableState("DualRowColor", "Y") }}
                />}
                label='Dual Color Rows'
                labelPlacement="end"
                classes={{ label: classes.checkbox_label }}
                style={{ marginTop: '-10px' }}
            /> */}
         <Grid container direction='row' justify='flex-start'>
            <div className={classes.colorSwatchUpper}>
               <Typography variant='subtitle1'>{t('bam:ROW_BACKGROUND_COLOR')}</Typography>
               <ColorPicker
                  className={classes.colorPicker}
                  color={props.state.table_properties.row_background_color}
                  itemIndex='row_background_color'
                  colorChanger={handleColorChange}
               />
            </div>
         </Grid>
         <Grid
            container
            direction='row'
            justify='flex-start'
            spacing={1}
            className={classes.marginTopStyle}
         >
            <Grid item sm={4}>
               <SelectBox
                  label={t('bam:FONT_TYPE')}
                  list={FontSettings.fontFamily}
                  className={classes.widthStyle}
                  value={props.state.table_properties.row_font_family}
                  onChange={event =>
                     props.syncTableState('row_font_family', event.target.value)
                  }
               />
            </Grid>
            <Grid item sm={3} style={{ marginTop: '1.2rem' }}>
               <SelectBox
                  list={FontSettings.fontVariant}
                  className={classes.widthStyle}
                  value={props.state.table_properties.row_font_family_variant}
                  onChange={event =>
                     props.syncTableState(
                        'row_font_family_variant',
                        event.target.value
                     )
                  }
               />
            </Grid>
            <Grid item sm={2}>
               <SelectBox
                  value={props.state.table_properties.row_font_size}
                  label={t('bam:FONT_SIZE')}
                  list={FontSettings.fontSize}
                  className={classes.widthStyle}
                  onChange={event =>
                     props.syncTableState('row_font_size', event.target.value)
                  }
               />
            </Grid>
            <Grid item sm={3}>
               <Typography className={classes.label_text}>
                  {t('bam:ALIGNMENT')}
               </Typography>
               <StyledToggleButtonGroup
                  value={props.state.table_properties.row_font_alignment}
                  exclusive
                  onChange={event =>
                     props.syncTableState(
                        'row_font_alignment',
                        event.target.value
                     )
                  }
                  aria-label='text alignment'
                  size='small'
                  className={classes.StyledtoggleButtonGroup}
               >
                  <ToggleButton
                     value='left'
                     aria-label='left aligned'
                     className={classes.toogleButtonSize}
                  >
                     <FormatAlignLeftIcon />
                  </ToggleButton>
                  <ToggleButton
                     value='center'
                     aria-label='centered'
                     className={classes.toogleButtonSize}
                  >
                     <FormatAlignCenterIcon />
                  </ToggleButton>
                  <ToggleButton
                     value='right'
                     aria-label='right aligned'
                     className={classes.toogleButtonSize}
                  >
                     <FormatAlignRightIcon />
                  </ToggleButton>
               </StyledToggleButtonGroup>
            </Grid>
         </Grid>
         <Grid
            container
            direction='row'
            justify='flex-start'
            className={classes.marginTopStyle}
         >
            <div className={classes.colorSwatchLower}>
               <Typography variant='subtitle1'>{t('bam:FONT_COLOR')}</Typography>
               <ColorPicker
                  className={classes.colorPicker}
                  color={props.state.table_properties.row_font_color}
                  itemIndex='row_font_color'
                  colorChanger={handleColorChange}
               />
            </div>
         </Grid>
      </div>
   )
}

export default OtherRows
