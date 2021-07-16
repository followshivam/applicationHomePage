import React, { useState, useEffect, Fragment } from 'react'
import {
   Paper,
   Toolbar,
   Typography,
   makeStyles,
   PickList,
   SelectBox
} from 'component'

import { useSelector } from 'react-redux'

const useStyles = makeStyles(theme => ({
   root_paper: {
      padding: theme.spacing(2),
      height: '45vh'
   },
   toolbar_sorting: {
      display: 'flex',
      justifyContent: 'space-around',
      alignContent: 'left',
      backgroundColor: theme.palette.backgroundContainer,
      padding: '10px 0px'
   },
   toolbar: {
      display: 'flex',
      justifyContent: 'space-around',
      alignContent: 'left'
   }
}))

const FieldMapping = props => {
   const classes = useStyles()

   const { reportStore, onChangeState = null, t } = props

   const [loader, setLoader] = useState(true)

   const pickListHandler = val => {
      let state = { ...reportStore }
      state.proc_batching_info.sort_field = val.name
      onChangeState(state)
   }

   const changeSortOrder = e => {
      let state = { ...reportStore }
      state.proc_batching_info.sort_order = e.target.value
      onChangeState(state)
   }

   const pickListHandlerField = (result, res, key) => {
      let field = reportStore.proc_batching_info.key_field_info
      let currentIndex = [...field]
      currentIndex[key] = {
         ...currentIndex[key],
         mapped_field: result.name
      }
      let state = { ...reportStore }
      state.proc_batching_info.key_field_info = currentIndex
      onChangeState(state)
   }

   let picklist_data = { data: reportStore.field }

   return (
      <Fragment>
         <Paper elevation={0} className={classes.root_paper}>
            <Typography variant='subtitle1'>
               <b>{t('bam:MAP_KEY_FIELD')}</b>
            </Typography>

            <Toolbar variant='dense' className={classes.toolbar}>
               <Typography variant='subtitle1'>
                  <b>{t('bam:KEY_FIELD')}</b>
               </Typography>
               <Typography variant='subtitle1'>
                  <b>{t('bam:MAPPED_KEY_FIELD')}</b>
               </Typography>
               <div></div>
            </Toolbar>
            {reportStore.proc_batching_info.key_field_info.map((res, key) => (
               <Fragment key={key}>
                  <Toolbar variant='dense' className={classes.toolbar}>
                     <Typography variant='subtitle1'>
                        {res.key_field}
                     </Typography>
                     <PickList
                        onChangeHandler={result =>
                           pickListHandlerField(result, res, key)
                        }
                        value={res.mapped_field}
                        loading={loader}
                        list={picklist_data == null ? null : picklist_data}
                        injectLiveValue={true}
                        displayKey='name'
                        valueKey='name'
                        onOpen={() => {
                           setTimeout(() => setLoader(false), 800)
                        }}
                     />
                     <div></div>
                  </Toolbar>
               </Fragment>
            ))}
         </Paper>
         <Toolbar variant='dense' className={classes.toolbar_sorting}>
            <PickList
               label={t('bam:DEFAULT_SORT_FIELD')}
               form={false}
               labelMinWidth='120px'
               labelMaxWidth='120px'
               onChangeHandler={pickListHandler}
               loading={loader}
               value={reportStore.proc_batching_info.sort_field}
               list={picklist_data == null ? null : picklist_data}
               injectLiveValue={true}
               displayKey='name'
               valueKey='name'
               onOpen={() => {
                  setTimeout(() => setLoader(false), 800)
               }}
            />
            <SelectBox
               label={t('bam:SORT_ORDER')}
               labelMinWidth='60px'
               labelMaxWidth='60px'
               form={false}
               list={[
                  { value: 'A', label: `${t('bam:ASCENDING')}` },
                  { value: 'D', label: `${t('bam:DESCENDING')}` }
               ]}
               name='sort_order'
               value={reportStore.proc_batching_info.sort_order}
               onChangeHandler={changeSortOrder}
            />
            <div></div>
            <div></div>
         </Toolbar>
      </Fragment>
   )
}

export default FieldMapping
