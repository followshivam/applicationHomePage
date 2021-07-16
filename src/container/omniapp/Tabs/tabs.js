import React, { useState, useEffect, Suspense, lazy } from 'react'
import {
   Toolbar,
   makeStyles,
   Tooltip,
   Button,
   AddIcon,
   IconButton,
   TableComponent,
   Paper,
   Spinner,
   useTranslation
} from 'component'
import SearchBox from 'component/GenericComponet/SearchBox'
import Pagination from '@material-ui/lab/Pagination'
import { useSelector } from 'react-redux'
import { ActTab, GetTabList } from '../../../global/omniapp/api/ApiMethods'
const AddTab = lazy(() => import('./add_tab'))

const useToolbarStyles = makeStyles(theme => ({
   root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
   },
   title: {
      flex: '1 1 100%'
   },
   paper: {
      width: '100%',
      minHeight: '509px',
      padding: theme.spacing(2),
      textAlign: 'center',
      marginBottom: theme.spacing(2),
      flexGrow: 1,
      position: 'relative'
   },
   borderBtn: {
      border: '1px solid #D3D3D3',
      padding: '7.5px',
      borderRadius: '2px',
      marginRight: '15px'
   },
   button: {
      padding: '6px 14px',
      height: 30,
      color: '#fff'
   },
   ul: {
      '& ul': {
         justifyContent: 'flex-end'
      }
   }
}))

const Tabs = props => {
   const classes = useToolbarStyles()
   const { view } = props
   const [rows, setRows] = React.useState([])
   const [tabs, setTabs] = React.useState([])
   const [selectedTabs, setSelectedTabs] = React.useState([])
   const [page, setPage] = React.useState(0)
   const [rowsPerPage, setRowsPerPage] = React.useState(5)
   const [headCells, setHeadCells] = useState([])
   const normalDialogStore = useSelector(state => state.normalDialogState)
   const [isRefreshRequired, setIsRefreshRequired] = useState(false)
   const [globalSetting] = useSelector(state => {
      return [state.globalSettings]
   })

   const { t } = useTranslation(
      globalSetting.locale_module
         ? globalSetting.locale_module
         : ['bam', 'omniapp']
   )
   const tabsData = {
      data: {
         tableHeader: [
            { id: 'tabName', label: `${t('omniapp:TAB_NAME')}` },
            { id: 'description', label: `${t('omniapp:DESCRIPTION')}` },
            {
               id: 'componentInstance',
               label: `${t('omniapp:COMPONENT_INSTANCE')}`
            },
            { id: 'modifiedOn', label: `${t('omniapp:MODIFIED_ON')}` }
         ],
         tabs: [
            {
               tabName: 'Report Designer',
               description: 'A short description',
               componentInstance: 'Report List, Search Bar',
               modifiedOn: '28 Dec 2020 15:10 PM'
            },
            {
               tabName: 'Data  Modeler',
               description: 'A short description',
               componentInstance: 'Report List, Search Bar',
               modifiedOn: '28 Dec 2020 15:10 PM'
            },
            {
               tabName: 'Report Creator',
               description: 'A short description',
               componentInstance: 'Audit List, Search Bar',
               modifiedOn: '28 Dec 2020 15:10 PM'
            },
            {
               tabName: 'Process Designer',
               description: 'A very short description',
               componentInstance: 'Scheduler List, Search Bar',
               modifiedOn: '28 Nov 2020 11:10 PM'
            },
            {
               tabName: 'RPA Designer',
               description: 'A long description',
               componentInstance: 'RPA List, Search Bar',
               modifiedOn: '28 Nov 2020 11:10 PM'
            },
            {
               tabName: 'iFrame Designer',
               description: 'A short description',
               componentInstance: 'Report List, Search Bar',
               modifiedOn: '29 Jan 2020 15:10 PM'
            },
            {
               tabName: 'Data Designer',
               description: 'A short description',
               componentInstance: 'Data List, Search Bar',
               modifiedOn: '31 Dec 2020 10:10 PM'
            }
         ]
      }
   }
   useEffect(() => {
      const data = tabsData.data
      setRows(data.tabs)
      setTabs(data.tabs)
      setHeadCells(data.tableHeader)

      GetTabList(JSON.stringify({ view: view }))
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               console.log(res)
            }
         })
         .catch(err => {
            console.log(err)
         })
   }, [])

   const handleDelete = () => {
      ActTab(JSON.stringify({ tabs: selectedTabs }))
         .then(res => {
            console.log(res)
            if (res != null && res.status.maincode === '0') {
               setIsRefreshRequired(!isRefreshRequired)
            }
         })
         .catch(err => {
            console.log(err)
         })
   }

   const editViewHandler = res => {
      normalDialogStore.openDialog(
         <Suspense
            fallback={
               <div style={{ height: '250px', minWidth: '600px' }}>
                  <Spinner msg='' />
               </div>
            }
         >
            <AddTab
               currentEdit={res}
               isRefreshRequired={isRefreshRequired}
               handleRefresh={setIsRefreshRequired}
            />
         </Suspense>,
         `${t('omniapp:EDIT_TAB')}`
      )
   }

   const openDialogBoxFromStore = () => {
      normalDialogStore.openDialog(
         <Suspense
            fallback={
               <div style={{ height: '250px', minWidth: '600px' }}>
                  <Spinner msg='' />
               </div>
            }
         >
            <AddTab
               isRefreshRequired={isRefreshRequired}
               handleRefresh={setIsRefreshRequired}
            />
         </Suspense>,
         `${t('omniapp:ADD_TAB')}`
      )
   }

   const handleCheckBox = selectedTabs => {
      setSelectedTabs(selectedTabs)
   }

   const handleChangePage = (event, newPage) => {
      setPage(newPage - 1)
   }
   const onSearchSubmit = value => {
      const key = 'tabName'
      const updatedRows = tabs.filter(row =>
         row[key].toLowerCase().includes(value.searchString.toLowerCase())
      )
      setRows(updatedRows)
   }

   return (
      <div style={{ backgroundColor: '#FFFFFF' }}>
         <Paper className={classes.paper}>
            <Toolbar className={classes.root}>
               <SearchBox
                  placeholder={t('omniapp:SEARCH_TABS')}
                  clearSearchResult={() => setRows(tabs)}
                  onSearchSubmit={onSearchSubmit}
               />
               <div>
                  {selectedTabs.length > 0 ? (
                     <Tooltip title='Delete'>
                        <IconButton
                           aria-label='delete'
                           color='disabled'
                           className={classes.borderBtn}
                           onClick={handleDelete}
                        >
                           <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`} alt='trash' />
                        </IconButton>
                     </Tooltip>
                  ) : null}
                  <Button
                     variant='contained'
                     color='secondary'
                     className={classes.button}
                     startIcon={<AddIcon />}
                     onClick={openDialogBoxFromStore}
                  >
                     {t('omniapp:ADD_TAB')}
                  </Button>
               </div>
            </Toolbar>
            <TableComponent
               loading={false}
               tableData={rows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
               )}
               headerData={headCells}
               dynamicHeight='fit-content'
               onChangeCheckbox={handleCheckBox}
               action={[
                  {
                     action_type: 'icon',
                     icon_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.svg`,
                     height: '',
                     onClick: res => editViewHandler(res),
                     className: ''
                  }
               ]}
            />
            <Pagination
               component='div'
               count={
                  Number.isInteger(rows.length / rowsPerPage)
                     ? rows.length / rowsPerPage
                     : Math.trunc(rows.length / rowsPerPage) + 1
               }
               page={page + 1}
               onChange={handleChangePage}
               color='primary'
               className={classes.ul}
               style={{ marginLeft: 'right', paddingTop: '20px' }}
            />
         </Paper>
      </div>
   )
}

export default Tabs
