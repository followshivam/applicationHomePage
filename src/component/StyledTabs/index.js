import React, { useState, Fragment, Suspense, useImperativeHandle } from 'react'
import { Tabs, Tab, makeStyles, Spinner, IconImage } from 'component'

const tabHeight = '20px'
const useStyles = makeStyles(theme => ({
   // tabs: {
   //    minHeight: tabHeight,
   //    height: tabHeight
   // },
   tab: {
      // border: `1px solid ${theme.palette.borderColor}`,
      // backgroundColor: theme.palette.common.white,
      fontSize: theme.typography.subtitle1.fontSize,
      minWidth: '10px',
      textTransform: 'none'
      // minHeight: tabHeight,
      // height: tabHeight
   },
   tabs: {
      minHeight: props => props.tabHeight,
      height: props => props.tabHeight,
      backgroundColor: '#FFF'
   },
   tab_container: {
      // width: '100%',
      // backgroundColor: theme.palette.common.white,
      padding: theme.spacing(1, 1, 0, 1)
      // border: `1px solid ${theme.palette.borderColor}`
      // minHeight: '560px'
   },
   tabSelected: {
      color: theme.palette.primary.main
   },
   alignment: {
      display: "flex",
      flexDirection: "row"
   }
}))

const TabPanel = props => {
   const classes = useStyles()
   const { children, value, index } = props

   return <div>{value === index && <div>{children}</div>}</div>
}

const StyledTab = React.forwardRef((props, ref) => {
   const { tabHeight = '20px' } = props;
   const { direction = 'ltr' } = props;
   const classes = useStyles({ tabHeight, direction });
   const {
      tabsArray = null,
      container = false,
      tabContainerClasses = classes.tab_container,
      tabsClasses = classes.tabs,
      tabClasses = classes.tab,
      tabSelectedClasses = classes.tabSelected,
      parentHandled = false,
      activeTab = 0,
   } = props;
   const [configValue, setconfigValue] = useState(0)

   const handleConfigurations = (e, val) => {
      setconfigValue(val)
      if (props.changeTabHandler) {
         props.changeTabHandler(val);
      }
   }

   useImperativeHandle(ref, () => {
      return {
         handleConfigurations: handleConfigurations
      }
   })

   return (
      <Fragment>
         <Tabs
            value={parentHandled === false ? configValue : activeTab}
            className={tabsClasses}
            variant='scrollable'
            onChange={handleConfigurations}
         >
            {tabsArray.map((res, key) => (
               <Tab
                  style={{ minHeight: tabHeight, height: tabHeight }}
                  label={res.label}
                  icon={res.icon ? (configValue == res.index ?
                     <IconImage url={res.icon} width={16} height={16} style={{ marginBottom: 0, marginRight: direction === 'ltr' ? 11 : '', marginLeft: direction === 'rtl' ? 11 : '' }} />
                     : res.inactive_icon ? <IconImage url={res.inactive_icon} width={16} height={16} style={{ marginBottom: 0, marginRight: direction === 'ltr' ? 11 : '', marginLeft: direction === 'rtl' ? 11 : '' }}/> : <IconImage url={res.icon} width={16} height={16} style={{ marginBottom: 0, marginRight: direction === 'ltr' ? 11 : '', marginLeft: direction === 'rtl' ? 11 : '' }} /> )
                     : undefined}
                  key={key}
                  classes={{
                     selected: tabSelectedClasses,
                     root: tabClasses,
                     wrapper: classes.alignment
                  }}
                  disabled={res.disabled}
               />
            ))}
         </Tabs>
         <div className={tabContainerClasses}>
            {tabsArray.map((res, key) => (
               <TabPanel
                  value={parentHandled === false ? configValue : activeTab}
                  index={res.index}>
                  {container ? (
                     <Suspense
                        fallback={
                           <div style={{ minHeight: '516px' }}>
                              <Spinner msg='' />
                           </div>
                        }
                     >
                        <res.component {...res.componentProps} />
                     </Suspense>
                  ) : (
                     res.component
                  )}
               </TabPanel>
            ))}
         </div>
      </Fragment>
   )
})

export default StyledTab;
