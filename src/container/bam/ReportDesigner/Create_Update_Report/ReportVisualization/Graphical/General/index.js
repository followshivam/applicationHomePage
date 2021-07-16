import React, { useState, useEffect, Fragment } from 'react'
import {
   makeStyles,
   Grid,
   Typography,
   FormControlLabel,
   Checkbox,
   Radio,
   NotFound,
   Paper,
   ColorPicker,
   SelectBox
} from 'component'
import RowDragger from 'component/RowDraggerV2'
const useStyles = makeStyles(theme => ({
   root: {
      padding: '.5rem .4rem'
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize,
      fontWeight: 600
   },
   paper: {
      minHeight: '190px',
      width: '100%',
      border: `1px solid ${theme.palette.borderColor}`,
      textAlign: 'left',
      padding: '.6rem',
      marginTop: '.6rem',
      borderRadius: '5px'
   },
   topBar: {
      borderBottom: `1px solid ${theme.palette.borderColor}`,
      padding: '.2rem'
   }
}))

const General = props => {
   const classes = useStyles()
   const { t } = props
   const {
      chart_type,
      is_stacked,
      is_half,
      bg_color,
      chart_orientation
   } = props.state.chart_properties
   let canBeStacked = false,
      canBeOriented = false,
      canBeHalved = false

   if (chart_type === 'bar' || chart_type === 'area') {
      canBeStacked = true
   }

   if (chart_type === 'pie' || chart_type === 'donut') {
      canBeHalved = true
   }

   if (chart_type === 'bar') {
      canBeOriented = true
   }

   const colorChanger = color => {
      props.syncGraphState('bg_color', color.hex)
   }

   const [reportStore, setReportStore] = useState(props.state)
   useEffect(() => {
      setReportStore(props.state)
   }, [props.state])
   const data = reportStore.chart_properties

   const [chartFields, setChartFields] = useState([])

   // const handleChartFields = (e, res) => {
   //    let event = e.target.checked
   //    if (event) {
   //       setChartFields([...chartFields, res])
   //    } else {
   //       setChartFields(chartFields.filter(data => data.name !== res.name))
   //    }
   // }

   const handleColor = (color, itemIndex) => {
      console.log(color,itemIndex,data.chart_display_fields)
      const index = data.chart_display_fields.findIndex(
         el => el.name === itemIndex
      )
      var arr = data.chart_display_fields
      arr[index] = {
         name: itemIndex,
         display_name: arr[index].display_name,
         color: color.hex
      }
      let state = { ...reportStore }
      state.chart_properties.chart_display_fields = arr
      setReportStore(state)
   }

   var result =
      data.chart_display_fields &&
      data.chart_display_fields.map((field, key) => ({
         unique_id: field.name,
         component: (
            <Grid container justify='space-between' row spacing={3} key={key}>
               <Grid item xs={6} md={6}>
                  <Typography variant='subtitle1'>
                     {field.display_name}
                  </Typography>
               </Grid>
               <Grid item xs={6} md={6}>
                  <ColorPicker
                     color={field.color}
                     itemIndex={field.name}
                     colorChanger={handleColor}
                  />
               </Grid>
            </Grid>
         )
      }))

   const [draggerData, setdraggerData] = useState(result)

   useEffect(() => {
      setdraggerData(result)
   }, [data.chart_display_fields, reportStore])

   const onChangeHandlerDragger = newData => {
      setdraggerData(newData)
   }

   return (
      <div className={classes.root}>
         <Grid container justify='flex-start' alignItems='center'>
            <Typography variant='h4' style={{ marginRight: '10px' }}>
               {t('bam:GRAPH_BACKGROUND_COLOR')}
            </Typography>{' '}
            <ColorPicker color={bg_color} colorChanger={colorChanger} />
            {/* <div></div> */}
         </Grid>
         <Grid container justify='flex-start'>
            {canBeStacked === true ? (
               <FormControlLabel
                  value='start'
                  control={
                     <Checkbox
                        color='primary'
                        checked={is_stacked}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => {
                           !is_stacked
                              ? props.syncGraphState('is_stacked', true)
                              : props.syncGraphState('is_stacked', false)
                        }}
                     />
                  }
                  label={`${t('bam:STACKED')} ${chart_type[0].toUpperCase() +
                     chart_type.slice(1)}`}
                  labelPlacement='end'
                  classes={{ label: classes.checkbox_label }}
               />
            ) : null}
            {canBeHalved === true ? (
               <FormControlLabel
                  value='start'
                  control={
                     <Checkbox
                        color='primary'
                        checked={is_half}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => {
                           !is_half
                              ? props.syncGraphState('is_half', true)
                              : props.syncGraphState('is_half', false)
                        }}
                     />
                  }
                  label={`Half ${chart_type[0].toUpperCase() +
                     chart_type.slice(1)}`}
                  labelPlacement='end'
                  classes={{ label: classes.checkbox_label }}
               />
            ) : null}
            {canBeOriented && (
               <SelectBox
                  label='Chart Orientation'
                  form={false}
                  labelMinWidth='105px'
                  labelMaxWidth='105px'
                  value={chart_orientation}
                  onChange={event =>
                     props.syncGraphState(
                        'chart_orientation',
                        event.target.value
                     )
                  }
                  list={[
                     { value: 'vertical', label: `${t('bam:VERTICAL')}` },
                     { value: 'horizontal', label: `${t('bam:HORIZONTAL')}` }
                  ]}
               />
            )}
         </Grid>

         {/* <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
            >
                <div></div>
                <Button variant="contained"><Typography variant="subtitle2">X - Axis</Typography></Button>
                <Button color="primary" variant="contained"><IconsButton type="SyncAltIcon" style={{ color: 'white' }}></IconsButton></Button>
                <Button variant="contained"><Typography variant="subtitle2">Y - Axis</Typography></Button>
                <div></div>
            </Grid>*/}
         {/* <Grid container spacing={0}>
            <Grid item sm={6}>
               <Paper className={classes.paper} elevation={0}>
                  <Grid
                     container
                     justify='space-around'
                     className={classes.topBar}
                  >
                     <div></div>
                     <Typography variant='subtitle1'>
                        <b>Display Fields</b>
                     </Typography>
                     <div></div>
                     <Typography variant='subtitle1'>
                        <b>Col</b>
                     </Typography>
                  </Grid>
               </Paper>
            </Grid>
            <Grid item sm={6}>
               <Paper className={classes.paper} elevation={0}>
                  <Grid
                     container
                     justify='space-around'
                     className={classes.topBar}
                  >
                     <div></div>
                     <Typography variant='subtitle1'>
                        <b>Value Fields</b>
                     </Typography>
                     <div></div>
                     <Typography variant='subtitle1'>
                        <b>Col</b>
                     </Typography>
                  </Grid>
               </Paper>
            </Grid>
         </Grid> */}
         <Grid container spacing={0}>
            <Paper className={classes.paper} elevation={0}>
               {data.chart_display_fields &&
               data.chart_display_fields.length > 0 ? (
                  <Fragment>
                     <div
                        style={{
                           display: 'flex',
                           justifyContent: 'space-between'
                        }}
                     >
                        <Typography
                           variant='subtitle2'
                           style={{ marginLeft: '18px' }}
                        >
                           <b>{t('bam:FIELD_NAME')}</b>
                        </Typography>
                        <Typography variant='subtitle2'>
                           <b>{t('bam:LABEL_COLOR')}</b>
                        </Typography>
                        <div></div>
                     </div>
                     <RowDragger
                        data={draggerData}
                        onChange={onChangeHandlerDragger}
                     />
                  </Fragment>
               ) : (
                  <NotFound
                     iconSize={60}
                     messageFontSize='12px'
                     message={t('bam:NOT_FOUND_MESSAGE')}
                  />
               )}
            </Paper>
         </Grid>
      </div>
   )
}

export default General
