import React, { useState } from 'react'
import {
   makeStyles,
   AccordionDetails,
   AccordionSummary,
   Typography,
   IconsButton,
   withStyles,
   SelectBox,
   Grid,
   Button,
   InputBox,
   RadioGroup,
   FormControlLabel,
   Checkbox
} from 'component'
import MuiAccordion from '@material-ui/core/Accordion'
import ColorPicker from 'component/ColorPicker/colorPicker'
import { FontSettings } from 'global/json'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify'

const Accordion = withStyles(theme => ({
   root: {
      boxShadow: 'none',
      '&:not(:last-child)': {
         borderBottom: `1px solid ${theme.palette.borderColor}`
      },
      '&:before': {
         display: 'none'
      },
      '&$expanded': {
         margin: 'auto'
      }
   },
   expanded: {}
}))(MuiAccordion)

const StyledAccordionSummary = withStyles({
   root: {
      '&$expanded': {
         minHeight: '24px'
      }
   },
   content: {
      '&$expanded': {
         margin: '0px 0px'
      }
   }
})(AccordionSummary)

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
   fontColor: {
      border: '1px solid #DADADA',
      width: '80px',
      height: '23px',
      display: 'flex',
      alignItems: 'center'
   },
   toggleButtonGroup: {
      borderRadius: '0%'
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

const Label = props => {
   const { t } = props
   const classes = useStyles()
   const {
      chart_title_font_family_variant,

      label_x_axis,
      label_y_axis,
      chart_title_color,
      chart_title_font_size,
      chart_title_font_alignment,
      chart_type,
      is_stacked,
      bg_color,
      chart_title,
      chart_title_font_family,
      axis_label_font_family,
      axis_label_font_family_variant,
      axis_label_font_size,
      axis_label_font_color,
      axis_label_font_alignment
   } = props.state.chart_properties
   const [expanded, setExpanded] = React.useState(false)

   const handleChange = panel => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false)
   }

   const colorChanger = (color, itemIndex) => {
      props.syncGraphState(itemIndex, color.hex)
   }

   const fontList = [
      { value: 'Test', label: 'Test' },
      { value: 'Test1', label: 'Test1' }
   ]
   // console.log(ChartTitle)

   let axisLabelEnabled = true

   if (chart_type === 'pie' || chart_type === 'donut') {
      axisLabelEnabled = false
   }

   let subAxisLabelEnabled = false

   return (
      <div className={classes.root}>
         <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
         >
            <StyledAccordionSummary
               expandIcon={<IconsButton type='ExpandMoreIcon' />}
            >
               <Typography variant='subtitle1'>
                  <b>{t('bam:HEADER_LABEL')}</b>
               </Typography>
            </StyledAccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
               <div>
                  <Grid container justify='space-between'>
                     <InputBox
                        form={false}
                        name='headerLabel'
                        placeholder='Chart'
                        value={chart_title}
                        onChange={event =>
                           props.syncGraphState(
                              'chart_title',
                              event.target.value
                           )
                        }
                        label={t('bam:HEADER_LABEL')}
                        style={{ fontWeight: 'bold', marginTop: '-20px' }}
                     />
                     <div></div>
                  </Grid>
               </div>
               <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  spacing={1}
                  className={classes.marginTopStyle}
               >
                  <Grid item sm={4}>
                     <SelectBox
                        label={`${t('bam:FONT_TYPE')}:`}
                        value={chart_title_font_family}
                        list={FontSettings.fontFamily}
                        onChange={event =>
                           props.syncGraphState(
                              'chart_title_font_family',
                              event.target.value
                           )
                        }
                        className={classes.widthStyle}
                     />
                  </Grid>
                  <Grid item sm={3} style={{ marginTop: '1rem' }}>
                     <SelectBox
                        list={FontSettings.fontVariant}
                        value={chart_title_font_family_variant}
                        onChange={event =>
                           props.syncGraphState(
                              'chart_title_font_family_variant',
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
                        value={chart_title_font_size}
                        onChange={event =>
                           props.syncGraphState(
                              'chart_title_font_size',
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
                           value={chart_title_font_alignment}
                           exclusive
                           onChange={event =>
                              props.syncGraphState(
                                 'chart_title_font_alignment',
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
                        color={chart_title_color}
                        itemIndex='chart_title_color'
                        colorChanger={colorChanger}
                     />
                     <Typography variant='subtitle1'>
                        {chart_title_color}
                     </Typography>
                  </div>
               </Grid>
            </AccordionDetails>
         </Accordion>
         <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
            disabled={!axisLabelEnabled}
         >
            <AccordionSummary
               expandIcon={<IconsButton type='ExpandMoreIcon' />}
            >
               <Typography variant='subtitle1'>
                  <b>{t('bam:AXIS_LABEL')}</b>
               </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
               <div>
                  <Grid
                     container
                     justify='space-between'
                     direction='row'
                     wrap='nowrap'
                  >
                     <Grid
                        container
                        direction='column'
                        alignItems='center'
                        justify='center'
                        item
                     >
                        <InputBox
                           form={false}
                           name='label_x_axis'
                           value={label_x_axis}
                           onChange={event =>
                              props.syncGraphState(
                                 'label_x_axis',
                                 event.target.value
                              )
                           }
                           label={t('bam:X_AXIS_LABLE')}
                           style={{ fontWeight: 'bold', marginTop: '-20px' }}
                        />
                     </Grid>
                     <Grid
                        container
                        direction='column'
                        alignItems='center'
                        justify='center'
                        item
                     >
                        <InputBox
                           form={false}
                           name='label_y_axis'
                           value={label_y_axis}
                           onChange={event =>
                              props.syncGraphState(
                                 'label_y_axis',
                                 event.target.value
                              )
                           }
                           label={t('bam:Y_AXIS_LABLE')}
                           style={{ fontWeight: 'bold', marginTop: '-20px' }}
                        />
                     </Grid>
                     <div></div>
                  </Grid>
               </div>
               <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='center'
                  spacing={1}
                  className={classes.marginTopStyle}
               >
                  <Grid item xs={12}>
                     <Typography variant='subtitle2'>
                        {t('bam:FONT_APPLIED')}
                     </Typography>
                  </Grid>
                  <Grid item sm={4}>
                     <SelectBox
                        label={`${t('bam:FONT_TYPE')}:`}
                        value={axis_label_font_family}
                        list={FontSettings.fontFamily}
                        onChange={event =>
                           props.syncGraphState(
                              'axis_label_font_family',
                              event.target.value
                           )
                        }
                        className={classes.widthStyle}
                     />
                  </Grid>
                  <Grid item sm={3} style={{ marginTop: '1rem' }}>
                     <SelectBox
                        list={FontSettings.fontVariant}
                        value={axis_label_font_family_variant}
                        onChange={event =>
                           props.syncGraphState(
                              'axis_label_font_family_variant',
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
                        value={axis_label_font_size}
                        onChange={event =>
                           props.syncGraphState(
                              'axis_label_font_size',
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
                           value={axis_label_font_alignment}
                           exclusive
                           onChange={event =>
                              props.syncGraphState(
                                 'axis_label_font_alignment',
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
                        color={axis_label_font_color}
                        itemIndex='axis_label_font_color'
                        colorChanger={colorChanger}
                     />
                     <Typography variant='subtitle1'>
                        {axis_label_font_color}
                     </Typography>
                  </div>
               </Grid>
            </AccordionDetails>
         </Accordion>
         {/* <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} disabled={!axisLabelEnabled && !subAxisLabelEnabled}> 
                <AccordionSummary
                    expandIcon={<IconsButton type='ExpandMoreIcon' />}
                >
                    <Typography variant='subtitle1'><b>Sub-Axis Label(If Present)</b></Typography>
                </AccordionSummary>
                <AccordionDetails style={{ display: 'block' }}>
                    <div>
                        <Grid
                            container
                            justify="space-between"
                            direction="row"
                            wrap="nowrap"
                        >
                            <Grid container direction="column" alignItems="center" justify="center" item>
                                <InputBox form={false} name="LabelSubXAxis" value={LabelSubXAxis} onChange={event => props.syncGraphState("LabelSubXAxis", event.target.value)} label='X-Axis Label' style={{ fontWeight: 'bold', marginTop: '-20px' }} />
                                <Grid container item alignItems="center" direction="row" wrap="nowrap">
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Slanting Labels"
                                        checked={LabelSubXAxisSlant === "Y"}
                                        onClick={() => { LabelSubXAxisSlant === "Y" ? props.syncGraphState("LabelSubXAxisSlant", "N") : props.syncGraphState("LabelSubXAxisSlant", "Y") }}
                                    />
                                    <SelectBox
                                        value={LabelSubXAxisSlantValue}
                                        list={[{ value: 45, label: 45 }]}
                                        width="50px"
                                        disabled={LabelSubXAxisSlant === "N"}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container direction="column" alignItems="center" justify="center" item>
                                <InputBox form={false} name="LabelSubYAxis" value={LabelSubYAxis} onChange={event => props.syncGraphState("LabelSubYAxis", event.target.value)} label='Y-Axis Label' style={{ fontWeight: 'bold', marginTop: '-20px' }} />
                                <Grid container item alignItems="center" direction="row" wrap="nowrap">
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Slanting Labels"
                                        checked={LabelSubYAxisSlant === "Y"}
                                        onClick={() => { LabelSubYAxisSlant === "Y" ? props.syncGraphState("LabelSubYAxisSlant", "N") : props.syncGraphState("LabelSubYAxisSlant", "Y") }}
                                    />
                                    <SelectBox
                                        value={LabelSubYAxisSlantValue}
                                        list={[{ value: 45, label: 45 }]}
                                        width="50px"
                                        disabled={LabelSubYAxisSlant === "N"}
                                    />
                                </Grid>
                            </Grid>


                            <div></div>
                        </Grid></div>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        spacing={1}
                        className={classes.marginTopStyle}
                    >
                        <Grid item xs={12}>
                            <Typography variant="subtitle2">Font Settings are applied to both X & Y axis</Typography>
                        </Grid>
                        <Grid item sm={4} >
                            <SelectBox label="Font Type:" value={Subaxis_label_font_family} list={fontList} onChange={event => props.syncGraphState("Subaxis_label_font_family", event.target.value)} className={classes.widthStyle} />
                        </Grid>
                        <Grid item sm={3} style={{ marginTop: '1.2rem' }}>
                            <SelectBox list={[{ value: 1, label: "Test" }]} value={Subaxis_label_font_familyVariant} onChange={event => props.syncGraphState("Subaxis_label_font_familyVariant", event.target.value)} className={classes.widthStyle} />
                        </Grid>
                        <Grid item sm={2}>
                            <SelectBox label="Font Size:" list={[{ value: 1, label: "Test" }]} value={SubAxisLabelFontSize} onChange={event => props.syncGraphState("SubAxisLabelFontSize", event.target.value)} className={classes.widthStyle} />
                        </Grid>
                        <Grid item sm={3}>
                            <Typography variant="subtitle1" >Alignment:</Typography>
                            <div style={{ display: 'flex' }}>
                                <Button variant="outlined"><IconsButton type="FormatAlignLeftIcon"></IconsButton></Button>
                                <Button variant="outlined"><IconsButton type="FormatAlignJustifyIcon"></IconsButton></Button>
                                <Button variant="outlined"><IconsButton type="FormatAlignRightIcon"></IconsButton></Button>
                             
                            </div>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        className={classes.marginTopStyle}
                    >
                        <Typography variant="subtitle1">Font Color:</Typography>
                        <div className={classes.fontColor}>
                            <ColorPicker color={SubAxisLabelFontColor} itemIndex="SubAxisLabelFontColor" colorChanger={colorChanger} />
                            <Typography variant="subtitle1">{SubAxisLabelFontColor}</Typography>
                        </div>
                    </Grid>
                </AccordionDetails>
            </Accordion> */}
      </div>
   )
}

export default Label
