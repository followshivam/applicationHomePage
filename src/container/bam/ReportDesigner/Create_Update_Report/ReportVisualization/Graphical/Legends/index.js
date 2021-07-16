import React from 'react'
import {
   makeStyles,
   Grid,
   Typography,
   FormControlLabel,
   Checkbox,
   SelectBox,
   Radio,
   RadioGroup,
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
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
   },
   label_text: {
      // fontFamily: 'OpenSans',
      fontWeight: 600,
      color: '#606060',
      fontSize: '0.75rem'
   },
   toogleButtonSize: {
      height: '25px'
   }
}))

const Legends = props => {
   const classes = useStyles()
   const [alignment, setAlignment] = React.useState('left')
   const { t } = props
   const {
      show_legend,
      legend_position,
      legend_font_size,
      legend_font_family,
      legend_font_family_variant
   } = props.state.chart_properties

   const handleLegendToggle = () => {
      const show_legend = props.state.chart_properties.show_legend
      if (show_legend) {
         props.syncGraphState('show_legend', false)
      } else {
         props.syncGraphState('show_legend', true)
      }
   }

   return (
      <div className={classes.root}>
         <div>
            <Grid container justify='flex-start'>
               <FormControlLabel
                  value='start'
                  control={
                     <Checkbox
                        color='primary'
                        checked={show_legend}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onChange={handleLegendToggle}
                     />
                  }
                  label={t('bam:SHOW_LEGENDS')}
                  labelPlacement='end'
                  classes={{ label: classes.checkbox_label }}
               // style={{ marginLeft: '.06rem' }}
               />
            </Grid>
            {show_legend ? (
               <div style={{ marginLeft: '1.5rem' }}>
                  <RadioGroup
                     aria-label='position'
                     name='position'
                     value={legend_position}
                     onChange={event =>
                        props.syncGraphState(
                           'legend_position',
                           event.target.value
                        )
                     }
                  >
                     <FormControlLabel
                        value='bottom'
                        classes={{ label: classes.checkbox_label }}
                        control={<Radio />}
                        label={t('bam:AT_BOTTOM')}
                     />
                     <FormControlLabel
                        value='top'
                        classes={{ label: classes.checkbox_label }}
                        control={<Radio />}
                        label={t('bam:AT_TOP')}
                     />
                     <FormControlLabel
                        value='right'
                        classes={{ label: classes.checkbox_label }}
                        control={<Radio />}
                        label={t('bam:AT_RIGHT')}
                     />
                  </RadioGroup>
               </div>
            ) : null}
         </div>
         {/* <Grid
                container
                justify="flex-start"
            >
                <FormControlLabel
                    value="start"
                    control={<Checkbox color="primary" disableRipple={true} disableFocusRipple={true} onChange={legendHeaderChange} />}
                    label='Specify Legend Header'
                    labelPlacement="end"
                    classes={{ label: classes.checkbox_label }}
                    style={{ marginLeft: ".06rem", marginTop: '-10px' }}
                />
                <InputBox disabled={legendHeader ? false : true} />
                <div></div>
            </Grid> */}
         {/* <Grid
                container
                justify="flex-start"
                alignItems="center"
            >
                <Typography variant="subtitle1" style={{ margin: ".5rem" }}><b>Background Color</b></Typography>
                <ColorPicker color={LegendBackgroundColor} colorChanger={colorChanger} />
                <div></div>
            </Grid> */}
         <Grid container direction='row' justify='flex-start' spacing={1}>
            <Grid item sm={4}>
               <SelectBox
                  label={`${t('bam:FONT_TYPE')}:`}
                  list={FontSettings.fontFamily}
                  value={legend_font_family}
                  onChange={event =>
                     props.syncGraphState(
                        'legend_font_family',
                        event.target.value
                     )
                  }
                  className={classes.widthStyle}
               />
            </Grid>
            <Grid item sm={3} style={{ marginTop: '1rem' }}>
               <SelectBox
                  list={FontSettings.fontVariant}
                  value={legend_font_family_variant}
                  onChange={event =>
                     props.syncGraphState(
                        'legend_font_family_variant',
                        event.target.value
                     )
                  }
                  className={classes.widthStyle}
               />
            </Grid>
            <Grid item sm={2}>
               <SelectBox
                  label={`${t('bam:FONT_SIZE')}:`}
                  list={FontSettings.fontSize}
                  value={legend_font_size}
                  onChange={event =>
                     props.syncGraphState(
                        'legend_font_size',
                        event.target.value
                     )
                  }
                  className={classes.widthStyle}
               />
            </Grid>
            <Grid item sm={3}>
               <div style={{ marginTop: '-3px' }}>
                  <Typography className={classes.label_text}>
                     {t('bam:ALIGNMENT')}
                  </Typography>
                  <StyledToggleButtonGroup
                     value={alignment}
                     exclusive
                     onChange={event => {
                        props.syncGraphState(
                           'LegendFontAlignment',
                           event.target.value
                        )
                        setAlignment(event.target.value)
                     }}
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
      </div>
   )
}

export default Legends
