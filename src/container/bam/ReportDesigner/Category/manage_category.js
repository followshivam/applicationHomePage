import React, { useState, lazy, Suspense } from 'react'
import {
   Button,
   DialogActions,
   DialogTitle,
   Divider,
   Tab,
   Tabs,
   Typography
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import { IconImage, InputBox, Spinner, useTranslation } from 'component'
import { useSelector } from 'react-redux'
import { GetCategoryList, CategoryAction } from 'global/bam/api/ApiMethods'
const AddNew = lazy(() => import('./add_new_category'))
const ManagePrevious = lazy(() => import('./manage_previous_category'))

const tabHeight = '30px'
const useStyles = makeStyles(theme => ({
   root: {
      width: '480px'
   },
   root_report: {
      width: '517px'
   },
   title: {
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`
   },
   body: {
      padding: `0 ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(
         2
      )}px`
   },
   tabs: {
      minHeight: tabHeight,
      height: tabHeight
   },
   tab: {
      backgroundColor: theme.palette.common.white,
      fontSize: '12px',
      minWidth: '50px',
      textTransform: 'none',
      minHeight: tabHeight,
      height: tabHeight,
      fontWeight: 'bold'
   },
   tab_container: {
      flexGrow: 1,
      backgroundColor: theme.palette.common.white
   },
   tabSelected: {
      color: theme.palette.primary.main
   }
}))

const TabPanel = props => {
   const classes = useStyles()
   const { children, value, index } = props

   return <div>{value === index && <p>{children}</p>}</div>
}

const ManageCategory = props => {
   const classes = useStyles()
   const { fromReport = false } = props
   const [configValue, setConfigValue] = useState(0)

   const [globalSetting, snackbarState, normalStoreDialog] = useSelector(state => {
      return [state.globalSettings, state.snackbarState, state.normalDialogState];
   });

   const { t } = useTranslation(globalSetting.locale_module)

   const [isLoading, setIsLoading] = useState({ msg: '', loading: false })
   const { loading, msg } = isLoading
   const handleConfigurations = (e, val) => {
      // console.log(val)
      setConfigValue(val)
   }
   const onCloseHandler = () => {
      normalStoreDialog.closeDialog()
      //   props.onCloseAction()
   }
   const createCategory = e => {
      e.preventDefault()
      let name = e.target.category_name.value.trim()
      let category_desc = e.target.category_desc.value.trim()
      let data = { category_name: name, description: category_desc, opr: 1 }
      categoryAction(data)

   }
   const categoryAction = data => {
      setIsLoading({ ...isLoading, loading: true })
      CategoryAction(data)
         .then(res => {
            if (res != null) {
               if (data.opr === 1) {
                  snackbarState.openSnackbar(
                     `${t('bam:CATEGORY_CREATED')}`,
                     'success'
                  )
               } else {
                  snackbarState.openSnackbar(
                     `${t('bam:CATEGORY_DELETED')}`,
                     'success'
                  )
               }
               setTimeout(
                  () => setIsLoading({ ...isLoading, loading: false }),
                  100
               )
               if (fromReport) {
                  normalStoreDialog.closeDialog()
               }
            }
         })
         .catch(err => { })
   }

   const tabsArray = fromReport
      ? [{ index: 0, label: `${t('bam:ADD_NEW')}`, component: AddNew, action: null }]
      : [
         { index: 0, label: `${t('bam:ADD_NEW')}`, component: AddNew, action: null },
         {
            index: 1,
            label: `${t('bam:MANAGE_PREVIOUS')}`,
            component: ManagePrevious,
            action: categoryAction
         }
      ]
   return (
      <div className={fromReport ? classes.root_report : classes.root}>
         <DialogTitle>
            {fromReport ? (
               <strong>{t('bam:CREATE_REPORT_CATEGORY')}</strong>
            ) : (
                  <strong>{t('bam:CATEGORY')}</strong>
               )}
         </DialogTitle>
         <form onSubmit={createCategory}>
            <div className={classes.body}>
               {!fromReport ? (
                  <div className={classes.tabs}>
                     <Tabs
                        value={configValue}
                        className={classes.tabs}
                        variant='scrollable'
                        onChange={handleConfigurations}
                     >
                        {tabsArray.map((res, key) => (
                           <Tab
                              label={res.label}
                              key={key}
                              classes={{
                                 selected: classes.tabSelected,
                                 root: classes.tab
                              }}
                           />
                        ))}
                     </Tabs>
                  </div>
               ) : null}
               {isLoading.loading ? (
                  <div style={{ height: '150px' }}>
                     <Spinner msg={msg} />
                  </div>
               ) : (
                     <div className={classes.tab_container}>
                        {tabsArray.map((res, key) => (
                           <TabPanel value={configValue} index={res.index}>
                              <Suspense
                                 fallback={
                                    <div style={{ height: '150px' }}>
                                       <Spinner msg='' />
                                    </div>
                                 }
                              >
                                 <res.component
                                    action={res.action}
                                    fromReport={fromReport}
                                    t={t}
                                 />
                              </Suspense>
                           </TabPanel>
                        ))}
                     </div>
                  )}
            </div>

            <DialogActions style={fromReport ? { marginRight: '15px' } : null}>
               <Button variant='outlined' onClick={onCloseHandler}>
                  {t('bam:LABEL_CANCEL')}
               </Button>
               {configValue == 0 ? (
                  <Button variant='contained' color='primary' type='submit'>
                     {fromReport ? `${t('bam:CREATE_CATEGORY')}` : `${t('bam:ADD')}`}
                  </Button>
               ) : null}
            </DialogActions>
         </form>
      </div>
   )
}

export default ManageCategory
