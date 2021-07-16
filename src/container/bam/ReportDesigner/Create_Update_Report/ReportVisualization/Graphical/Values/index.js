import React, { useState } from 'react'
import {
   makeStyles,
   Grid,
   Typography,
   FormControlLabel,
   FormLabel,
   SelectBox,
   Button,
   RadioGroup,
   Radio,
   IconsButton,
   withStyles
} from 'component'
import ColorPicker from 'component/ColorPicker/colorPicker'
import { FontSettings } from 'global/json'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

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
   marginTopStyle: {
      marginTop: '.5rem'
   },
   widthStyle: {
      width: '100%'
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
      // fontWeight: "bold"
   },
   fontColor: {
      border: '1px solid #DADADA',
      width: '80px',
      height: '23px',
      display: 'flex',
      alignItems: 'center'
   },
   label_text: {
      fontWeight: 600,
      color: '#606060',
      fontSize: '0.75rem'
   },
   toogleButtonSize: {
      height: '25px'
   }
}))

const Values = props => {
   const { t } = props
   const classes = useStyles()
   const colorChanger = (color, itemIndex) => {
      props.syncGraphState(itemIndex, color.hex)
   }

   const {
      show_values,
      show_values_position,
      show_values_bg_color,
      show_values_font_family,
      show_values_font_family_variant,
      show_values_font_size,
      show_values_font_alignment,
      show_values_font_color,
      chart_type
   } = props.state.chart_properties

   return (
      <div className={classes.root}>
         {/* <Grid
                container
                justify="flex-start"
                > */}
         {/* <FormLabel component="legend">Show Values</FormLabel> */}
         <Grid container justify='flex-start'>
            <Typography variant='subtitle1'>
               <b>{t('bam:SHOW_VALUES')}:</b>
            </Typography>
            <div></div>
         </Grid>
         <RadioGroup
            aria-label='values'
            name='values'
            value={show_values}
            onChange={event =>
               props.syncGraphState('show_values', event.target.value)
            }
         >
            <FormControlLabel
               value='H'
               classes={{ label: classes.checkbox_label }}
               control={<Radio />}
               label={t('bam:ON_HOVER')}
            />
            <FormControlLabel
               value='C'
               classes={{ label: classes.checkbox_label }}
               control={<Radio />}
               label={t('bam:ALWAYS_SHOW_CUMULATIVE')}
            />
            <div>
               <RadioGroup
                  row
                  aria-label='position'
                  name='position'
                  value={show_values_position}
                  onChange={event =>
                     props.syncGraphState(
                        'show_values_position',
                        event.target.value
                     )
                  }
               >
                  <FormControlLabel
                     value='top'
                     classes={{ label: classes.checkbox_label }}
                     control={
                        <Radio
                           disabled={
                              show_values === 'H' || chart_type !== 'bar'
                           }
                        />
                     }
                     label={t('bam:AT_TOP_OL')}
                  />
                  <FormControlLabel
                     value='center'
                     classes={{ label: classes.checkbox_label }}
                     control={
                        <Radio
                           disabled={
                              show_values === 'H' || chart_type !== 'bar'
                           }
                        />
                     }
                     label={t('bam:AT_TOP_IL')}
                  />
                  <FormControlLabel
                     value='bottom'
                     classes={{ label: classes.checkbox_label }}
                     control={
                        <Radio
                           disabled={
                              show_values === 'H' || chart_type !== 'bar'
                           }
                        />
                     }
                     label={t('bam:AT_BOTTOM')}
                  />
               </RadioGroup>
            </div>
            <FormControlLabel
               value='B'
               disabled={chart_type !== 'bar'}
               classes={{ label: classes.checkbox_label }}
               control={<Radio />}
               label={t('bam:BOTH')}
            />
         </RadioGroup>
         {/* </Grid> */}
         {show_values !== 'H' ? (
            <Grid>
               <Grid container justify='flex-start' alignItems='center'>
                  <Typography variant='subtitle1' style={{ margin: '.5rem' }}>
                     <b>{t('bam:BACKGROUND_COLOR')}</b>
                  </Typography>
                  <ColorPicker
                     color={show_values_bg_color}
                     itemIndex='show_values_bg_color'
                     colorChanger={colorChanger}
                  />
                  <div></div>
               </Grid>
               <Grid container direction='row' justify='flex-start' spacing={1}>
                  <Grid item sm={4}>
                     <SelectBox
                        value={show_values_font_family}
                        label={`${t('bam:FONT_TYPE')}:`}
                        list={FontSettings.fontFamily}
                        className={classes.widthStyle}
                        onChange={event =>
                           props.syncGraphState(
                              'show_values_font_family',
                              event.target.value
                           )
                        }
                     />
                  </Grid>
                  <Grid item sm={3} style={{ marginTop: '1rem' }}>
                     <SelectBox
                        value={show_values_font_family_variant}
                        list={FontSettings.fontVariant}
                        className={classes.widthStyle}
                        onChange={event =>
                           props.syncGraphState(
                              'show_values_font_family_variant',
                              event.target.value
                           )
                        }
                     />
                  </Grid>
                  <Grid item sm={2}>
                     <SelectBox
                        value={show_values_font_size}
                        label={`${t('bam:FONT_SIZE')}:`}
                        list={FontSettings.fontSize}
                        className={classes.widthStyle}
                        onChange={event =>
                           props.syncGraphState(
                              'show_values_font_size',
                              event.target.value
                           )
                        }
                     />
                  </Grid>
                  <Grid item sm={3}>
                     <div style={{ marginTop: '-3px' }}>
                        <Typography className={classes.label_text}>
                           {t('bam:ALIGNMENT')}
                        </Typography>
                        <StyledToggleButtonGroup
                           value={show_values_font_alignment}
                           exclusive
                           onChange={event =>
                              props.syncGraphState(
                                 'show_values_font_alignment',
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
                        </StyledToggleButtonGroup></div>
                  </Grid>
               </Grid>
               <Grid
                  container
                  direction='column'
                  justify='flex-start'
                  className={classes.marginTopStyle}
               >
                  <Typography className={classes.label_text}>
                     {t('bam:FONT_COLOR')}:
                  </Typography>

                  <div className={classes.fontColor}>
                     <ColorPicker
                        color={show_values_font_color}
                        itemIndex='show_values_font_color'
                        colorChanger={colorChanger}
                     />
                     <Typography variant='subtitle1'>
                        {show_values_font_color}
                     </Typography>
                  </div>
               </Grid>
            </Grid>
         ) : null}
      </div>
   )
}

export default Values
