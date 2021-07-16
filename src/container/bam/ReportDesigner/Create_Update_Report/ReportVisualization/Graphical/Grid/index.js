import React, { useState } from 'react'
import {
   makeStyles,
   Checkbox,
   FormControlLabel,
   Typography,
   Grid,
   Paper,
   InputBox,
   PickList
} from 'component'

const useStyles = makeStyles(theme => ({
   root: {
      padding: '.4rem'
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
   },
   paper: {
      minHeight: '150px',
      // width: '100%',
      border: `1px solid ${theme.palette.borderColor}`,
      textAlign: 'left',
      padding: '.6rem'
   }
}))

const GridTab = props => {
   const classes = useStyles()
   const { t } = props

   const { show_x_grid, show_y_grid, chart_type } = props.state.chart_properties

   return (
      <div className={classes.root}>
         <Grid
            container
            justify='flex-start'
            direction='row'
            style={{ marginTop: '10px' }}
         >
            <FormControlLabel
               value='horizontalAxis'
               control={
                  <Checkbox
                     color='primary'
                     disableRipple={true}
                     disableFocusRipple={true}
                     checked={show_x_grid}
                     disabled={chart_type === 'pie' || chart_type === 'donut'}
                     onClick={() => {
                        show_x_grid
                           ? props.syncGraphState('show_x_grid', false)
                           : props.syncGraphState('show_x_grid', true)
                     }}
                  />
               }
               label={t('bam:HORIZONTAL_AXIS')}
               labelPlacement='end'
               classes={{ label: classes.checkbox_label }}
               style={{ marginTop: '-10px' }}
            />
            <FormControlLabel
               value='verticalAxis'
               control={
                  <Checkbox
                     color='primary'
                     disabled={chart_type === 'pie' || chart_type === 'donut'}
                     checked={show_y_grid}
                     onClick={() => {
                        show_y_grid
                           ? props.syncGraphState('show_y_grid', false)
                           : props.syncGraphState('show_y_grid', true)
                     }}
                     disableRipple={true}
                     disableFocusRipple={true}
                  />
               }
               label={t('bam:VERTICAL_AXIS')}
               labelPlacement='end'
               classes={{ label: classes.checkbox_label }}
               style={{ marginTop: '-10px' }}
            />
            <Typography variant='subtitle2'>
               ({t('bam:AXIS_DISABLE')})
            </Typography>
         </Grid>

         {/* <Grid
                container
                justify="flex-start"
            >
                <Typography variant="subtitle1"><b>Show Gridlines:</b></Typography>
                <div></div>
            </Grid>
            <Grid container spacing={0}>
                <Grid item sm={6}>
                    <Paper className={classes.paper} elevation={0}>
                        <FormControlLabel
                            value="horizontal"
                            control={<Checkbox color="primary" disableRipple={true} disableFocusRipple={true} checked={true} />}
                            label='Horizontal'
                            labelPlacement="end"
                            classes={{ label: classes.checkbox_label }}
                            style={{ marginTop: '-10px' }}
                        />
                        <InputBox label='Interval:' form={false} style={{ width: '50px' }} />
                        <Typography variant="subtitle1" color='secondary'>+ Highlighted Horizontal Line</Typography>
                        <PickList style={{ width: '150px' }} />
                        <PickList style={{ width: '150px', marginTop: '8px' }} />
                    </Paper>
                </Grid>
                <Grid item sm={6}>
                    <Paper className={classes.paper} elevation={0}>
                        <FormControlLabel
                            value="vertical"
                            control={<Checkbox color="primary" disableRipple={true} disableFocusRipple={true} />}
                            label='Vertical'
                            labelPlacement="end"
                            classes={{ label: classes.checkbox_label }}
                            style={{ marginTop: '-10px' }}
                        />
                        <InputBox label='Interval:' disabled={true} form={false} style={{ width: '50px' }} />
                        <Typography variant="subtitle1" color='secondary'>+ Highlighted Horizontal Line</Typography>
                        
                    </Paper>
                </Grid>
            </Grid> */}
      </div>
   )
}

export default GridTab
