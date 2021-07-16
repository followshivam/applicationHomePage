import React, { useState, useEffect } from 'react'
import {
   makeStyles,
   RecentActivity,
   IconImage,
   Dropdown,
   Typography,
   useTranslation,
   Pinned,
   DashboardTile
} from 'component'
import { HomeTiles } from 'global/bam/api/ApiMethods'
import { useSelector } from 'react-redux'

const listData = require('./data.json')
const pinnedData = require('./newData.json')

const useStyles = makeStyles(theme => ({
   root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    //    direction:props=>props.direction
   },
   container: {
      height: '100%',
      width: '22%',
      top: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      fontSize: '27px',
      position: 'fixed',
      right: 0,
   }
}))

const HomeScreen = props => {
    const [direction, setDirection] = useState('ltr')
   const classes = useStyles({direction})
   const [globalSetting] = useSelector(state => {
      return [state.globalSettings]
   })

   const [homeTiles, setHomeTiles] = useState([])

   const { t } = useTranslation(
      globalSetting.locale_module
         ? globalSetting.locale_module
         : ['bam', 'omniapp']
   )

   const RecentHeadCells = [
      {
         category: `${t('bam:NAME')}`,
         component: item => (
            <div
               style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  height: '45px',
                  minWidth:"150px",
                  overflow: "hidden",
                  whitespace: "nowrap",
                  textOverflow: "ellipsis",
                  padding:t('bam:HTML_DIR') === 'rtl' ? '0 0 0 10px' : '0 10px 0 0'
               }}
            >
               <Typography variant='subtitle1' noWrap={true}>
                  {item.name}
                  <Typography
                     variant='subtitle1'
                     noWrap={true}
                     style={{ fontSize: '11px', color: '#606060' }}
                  >
                     {item.version} {item.type}
                  </Typography>
               </Typography>
            </div>
         )
      },
      {
         category: `${t('bam:STATUS')}`,
         component: item => (
            <div>
               <div style={{ display: 'flex' }}>
                  {item.status === 'Good' || item.status === 'Enable' ? (
                     <IconImage
                        url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/good.svg`}
                        height={10}
                     />
                  ) : item.status === 'Running' ? (
                     <IconImage
                        url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/running.svg`}
                        height={10}
                     />
                  ) : (
                     <IconImage
                        url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`}
                        height={10}
                     />
                  )}
                  <Typography
                     variant='subtitle1'
                     noWrap={true}
                     style={{
                        fontSize: '11px',
                        color: '#606060',
                        marginLeft: '2px'
                     }}
                  >
                     {item.status}
                  </Typography>
               </div>
               <Typography
                  variant='subtitle1'
                  noWrap={true}
                  style={{
                     fontSize: '11px',
                     color: '#606060',
                     marginLeft: '2px'
                  }}
               >
                  {item.status === 'Running' ? `Next Run:` : `Average Time :`}{' '}
                  {item.average_time}
               </Typography>
            </div>
         )
      },
      {
         category: `Last opened on`,
         component: item => (
            <div>
               <Typography variant='subtitle1' noWrap={true}>
                  {item.last_opened || item.last_modified}
                  <Typography
                     variant='subtitle1'
                     noWrap={true}
                     style={{
                        fontSize: '11px',
                        color: '#606060',
                        marginLeft: '2px'
                     }}
                  >
                     Edited by {item.user} at {item.time}
                  </Typography>
               </Typography>
            </div>
         )
      },
      {
         category: ``,
         type: `action`,
         component: item => (
            <div style={{ display: 'flex', width: '100px', flexWrap: 'wrap' }}>
               <div style={{ marginRight: '8px' }}>
                  {' '}
                  <IconImage
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/launch.svg`}
                     height={17}
                     width={17}
                     onClick={() => console.log('2')}
                  />{' '}
               </div>
               <div style={{ marginRight: '8px' }}>
                  {' '}
                  <IconImage
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/home_edit.svg`}
                     height={17}
                     width={17}
                     onClick={() => console.log('1')}
                  />{' '}
               </div>
               <div >
                  <Dropdown
                     type='icons'
                     endIcon='MoreHorizIcon'
                     list={[
                        {
                           id: 1,
                           value: 'Show Query',
                           label: `Show Query`,
                           startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg`
                        },
                        {
                           id: 2,
                           value: 'Exports',
                           label: `Exports`,
                           startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg`
                        },
                        {
                           id: 3,
                           value: 'Trends',
                           label: `Trends`,
                           startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/trends.svg`
                        }
                     ]}
                  />
               </div>
            </div>
         )
      }
   ]

   const HeadCells = [
      {
         category: `${t('bam:NAME')}`,
         component: item => (
            <div
               style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  height: '45px',
                  padding:
                     t('bam:HTML_DIR') === 'rtl' ? '0 0 0 20px' : '0 20px 0 0'
               }}
            >
               <Typography variant='subtitle1' noWrap={true}>
                  {item.name}
                  <Typography
                     variant='subtitle1'
                     noWrap={true}
                     style={{ fontSize: '11px', color: '#606060' }}
                  >
                     {item.version} {item.type}
                  </Typography>
               </Typography>
            </div>
         )
      },
      {
         category: `${t('bam:STATUS')}`,
         component: item => (
            <div>
               <div style={{ display: 'flex' }}>
                  {item.status === 'Good' || item.status === 'Enable' ? (
                     <IconImage
                        url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/good.svg`}
                        height={10}
                     />
                  ) : item.status === 'Running' ? (
                     <IconImage
                        url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/running.svg`}
                        height={10}
                     />
                  ) : (
                     <IconImage
                        url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`}
                        height={10}
                     />
                  )}
                  <Typography
                     variant='subtitle1'
                     noWrap={true}
                     style={{
                        fontSize: '11px',
                        color: '#606060',
                        marginLeft: '2px'
                     }}
                  >
                     {item.status}
                  </Typography>
               </div>
               <Typography
                  variant='subtitle1'
                  noWrap={true}
                  style={{
                     fontSize: '11px',
                     color: '#606060',
                     marginLeft: '2px'
                  }}
               >
                  {item.status === 'Running' ? `Next Run:` : `Average Time :`}{' '}
                  {item.average_time}
               </Typography>
            </div>
         )
      },
      {
         category: `Last opened on`,
         component: item => (
            <div>
               <Typography variant='subtitle1' noWrap={true}>
                  {item.last_opened || item.last_modified}
                  <Typography
                     variant='subtitle1'
                     noWrap={true}
                     style={{
                        fontSize: '11px',
                        color: '#606060',
                        marginLeft: '2px'
                     }}
                  >
                     Edited by {item.user} at {item.time}
                  </Typography>
               </Typography>
            </div>
         )
      },
      {
         category: ``,
         type: `action`,
         component: item => (
            <div style={{ display: 'flex', width: '100px', flexWrap: 'wrap' }}>
               <div style={{ marginRight: '8px' }}>
                  {' '}
                  <IconImage
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pinned.svg`}
                     height={17}
                     width={17}
                     onClick={() => console.log('2')}
                  />{' '}
               </div>
               <div style={{ marginRight: '8px' }}>
                  {' '}
                  <IconImage
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/launch.svg`}
                     height={17}
                     width={17}
                     onClick={() => console.log('2')}
                  />{' '}
               </div>
               <div style={{ marginRight: '8px' }}>
                  {' '}
                  <IconImage
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/home_edit.svg`}
                     height={17}
                     width={17}
                     onClick={() => console.log('1')}
                  />{' '}
               </div>
               <div style={{ marginRight: '8px' }}>
                  {' '}
                  <Dropdown
                     type='icons'
                     endIcon='MoreHorizIcon'
                     list={[
                        {
                           id: 1,
                           value: 'Show Query',
                           label: `Show Query`,
                           startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg`
                        },
                        {
                           id: 2,
                           value: 'Exports',
                           label: `Exports`,
                           startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg`
                        },
                        {
                           id: 3,
                           value: 'Trends',
                           label: `Trends`,
                           startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/trends.svg`
                        }
                     ]}
                  />
               </div>
            </div>
         )
      }
   ]

   const Action = [
      {
         component: () => (
            <div style={{ display: 'flex' }}>
               <div style={{ marginRight: '8px' }}>
                  {' '}
                  <IconImage
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pinned.svg`}
                     height={17}
                     width={17}
                     onClick={() => console.log('pin clicked')}
                  />{' '}
               </div>
               <div>
                  {' '}
                  <Dropdown
                     type='icons'
                     endIcon='MoreHorizIcon'
                     list={[
                        {
                           id: 1,
                           value: 'Demo Data',
                           label: `Demo Data`,
                           startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg`
                        },
                        {
                           id: 2,
                           value: 'Demo Data',
                           label: `Demo Data`,
                           startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg`
                        }
                     ]}
                  />
               </div>
            </div>
         )
      }
   ]

   const tilesData = [
      {
         type: 'Good',
         img_info: {
            background_color: '#0d6f0829',
            url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_good.svg`
         },
         hover_border_color: '#0d6f0880'
      },
      {
         type: 'Average',
         img_info: {
            background_color: '#0072c629',
            url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_average.svg`
         },
         hover_border_color: '#0072C666'
      },
      {
         type: 'Blocked',
         img_info: {
            background_color: '#d53d3d26',
            url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/blocked.svg`
         },
         hover_border_color: '#d53d3d80'
      },
      {
         type: 'Critical',
         img_info: {
            background_color: '#d53d3d26',
            url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_critical.svg`
         },
         hover_border_color: '#d53d3d80'
      }
   ]

   useEffect(() => {
      getHomeTiles();
      setDirection(`${t('bam:HTML_DIR')}`)
   }, [])

   const getHomeTiles = () => {
      HomeTiles({})
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               let merged = []
               for (let i = 0; i < res.data.tiles.length; i++) {
                  merged.push({
                     ...res.data.tiles[i],
                     ...tilesData.find(
                        itmInner =>
                           itmInner.type == res.data.tiles[i].description.value
                     )
                  })
               }
               setHomeTiles(merged)
            }
         })
         .catch(err => {})
   }

   return (
      <div className={classes.root}>
         <div style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
               <div style={{ margin: '5px 0px 20px 0' }}>
                  <DashboardTile
                     tileList={homeTiles}
                     direction={`${t('bam:HTML_DIR')}`}
                     width={'180pt'}

                  />
               </div>
               <Pinned
                  pinnedData={pinnedData}
                  headerData={HeadCells}
                  action={Action}
                  defaultView={'tile'}
                  direction={`${t('bam:HTML_DIR')}`}
                  loading={false}
                  height={'67pt'}
                  width={'180pt'}
                  imageInfo={{
                     path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                     ext: '.svg'
                  }}
                  label={{
                     heading: `${t('bam:Pinned')}`,
                     viewLess: `${t('bam:View Less')}`,
                     viewAll: `${t('bam:View All')}`,
                     last_modified: `${t('bam:Last Modified')}`
                  }}
               />
               <RecentActivity
                  headerData={RecentHeadCells}
                  recentList={listData}
                  loading={false}
                  isSearch={true}
                  direction={`${t('bam:HTML_DIR')}`}
                  heading={`${t('bam:Recents')}`}
                  searchProps={{
                     searchingKey: 'name',
                     placeholder: `${t('bam:TITLE_SEARCH')}`,
                     regex: null
                  }}
                  imageInfo={{
                     path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                     ext: '.svg'
                  }}
               />
            </div>
            {/* <div className={classes.container}>Activity Stream</div> */}
         </div>
      </div>
   )
}
export default HomeScreen
