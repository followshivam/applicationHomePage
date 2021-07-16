import React, { useState } from 'react'
import {
   makeStyles,
   Button,
   Grid,
   SelectBox,
   IconsButton,
   Typography,
   ColorPicker,
   withStyles
} from 'component'
import { FontSettings } from 'global/json'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'

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
   widthStyle: {
      width: '100%'
   },
   marginTopStyle: {
      marginTop: '.5rem'
   },
   headerColor: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '40%'
   },
   headerFontColor: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '20%'
   },
   label_text: {
      // fontFamily: 'OpenSans-Semibold',
      //  fontSize: '0.75rem',
      fontWeight: 600,
      color: '#606060',
      fontSize: '0.75rem'
   },
   toogleButtonSize: {
      height: '27px'
   }
}))

const HeaderRow = props => {
   const { t } = props
   const classes = useStyles()

   const handleColorChange = (color, itemIndex) => {
      props.syncTableState(itemIndex, color.hex)
   }

   return (
      <div className={classes.root}>
         <Grid
            container
            direction='row'
            justify='flex-start'
            className={classes.marginTopStyle}
         >
            <div className={classes.headerColor}>
               <Typography variant='subtitle1'>
                  {t('bam:HEADER_BACKGROUND_COLOR')}
               </Typography>
               <ColorPicker
                  color={props.state.table_properties.header_background_color}
                  itemIndex='header_background_color'
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
                  value={props.state.table_properties.header_font_family}
                  onChange={event =>
                     props.syncTableState(
                        'header_font_family',
                        event.target.value
                     )
                  }
               />
            </Grid>
            <Grid item sm={3} style={{ marginTop: '1rem' }}>
               <SelectBox
                  list={FontSettings.fontVariant}
                  className={classes.widthStyle}
                  value={
                     props.state.table_properties.header_font_family_variant
                  }
                  onChange={event =>
                     props.syncTableState(
                        'header_font_family_variant',
                        event.target.value
                     )
                  }
               />
            </Grid>
            <Grid item sm={2}>
               <SelectBox
                  label={t('bam:FONT_SIZE')}
                  list={FontSettings.fontSize}
                  className={classes.widthStyle}
                  value={props.state.table_properties.header_font_family_size}
                  onChange={event =>
                     props.syncTableState(
                        'header_font_family_size',
                        event.target.value
                     )
                  }
               />
            </Grid>
            <Grid item sm={3}>
               <Typography className={classes.label_text}>
                  {t('bam:ALIGNMENT')}
               </Typography>
               <StyledToggleButtonGroup
                  value={props.state.table_properties.header_font_alignment}
                  exclusive
                  onChange={event =>
                     props.syncTableState(
                        'header_font_alignment',
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
            <div className={classes.headerFontColor}>
               <Typography variant='subtitle1'>
                  {t('bam:FONT_COLOR')}
               </Typography>
               <ColorPicker
                  color={props.state.table_properties.header_font_color}
                  itemIndex='header_font_color'
                  colorChanger={handleColorChange}
               />
            </div>
         </Grid>
      </div>
   )
}

export default HeaderRow
