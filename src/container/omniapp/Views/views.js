import React, { useState, useEffect, lazy, Suspense } from 'react'
import {
   Toolbar,
   makeStyles,
   Tooltip,
   Button,
   AddIcon,
   IconButton,
   useTranslation,
   TableComponent,
   Paper,
   Spinner
} from 'component'
import SearchBox from 'component/GenericComponet/SearchBox'
import Pagination from '@material-ui/lab/Pagination'
import { useSelector } from 'react-redux'
import { GetViewList, ActView } from '../../../global/omniapp/api/ApiMethods'
const AddView = lazy(() => import('./add_view'))

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

const Views = props => {
   const classes = useToolbarStyles()
   const { showTabList, workspace = {} } = props
   const [rows, setRows] = React.useState([])
   const [views, setViews] = React.useState([])
   const [selectedViews, setSelectedViews] = React.useState([])
   const [page, setPage] = React.useState(0)
   const [rowsPerPage, setRowsPerPage] = React.useState(5)
   const [headCells, setHeadCells] = useState([])
   const [isRefreshRequired, setIsRefreshRequired] = useState(false)
   const [globalSetting] = useSelector(state => {
      return [state.globalSettings]
   })

   const { t } = useTranslation(
      globalSetting.locale_module
         ? globalSetting.locale_module
         : ['bam', 'omniapp']
   )
   const normalDialogStore = useSelector(state => state.normalDialogState)

   useEffect(() => {
      const viewsData = {
         data: {
            tableHeader: [
               {
                  id: 'viewName',
                  label: `${t('omniapp:VIEW_NAME')}`,
                  onClick: showTabList,
                  typographyProps: {
                     style: { fontWeight: 600, color: '#0072C6' }
                  }
               },
               { id: 'description', label: `${t('omniapp:DESCRIPTION')}` },
               { id: 'modifiedOn', label: `${t('omniapp:MODIFIED_ON')}` }
            ],
            views: [
               {
                  viewName: 'Report',
                  description: 'A short description',
                  modifiedOn: '28 Dec 2020 15:10 PM'
               },
               {
                  viewName: 'Scheduler',
                  description: 'A short description',
                  modifiedOn: '28 Dec 2020 15:10 PM'
               },
               {
                  viewName: 'Audit Logs',
                  description: 'A short description',
                  modifiedOn: '28 Dec 2020 15:10 PM'
               },
               {
                  viewName: 'Report',
                  description: 'A very short description',
                  modifiedOn: '28 Nov 2020 11:10 PM'
               },
               {
                  viewName: 'Scheduler',
                  description: 'A long description',
                  modifiedOn: '28 Nov 2020 11:10 PM'
               },
               {
                  viewName: 'Designer',
                  description: 'A short description',
                  modifiedOn: '29 Jan 2020 15:10 PM'
               },
               {
                  viewName: 'Scheduler',
                  description: 'A short enough description',
                  modifiedOn: '31 Dec 2020 10:10 PM'
               }
            ]
         }
      }
      const data = viewsData.data
      setRows(data.views)
      setViews(data.views)
      setHeadCells(data.tableHeader)

      GetViewList(JSON.stringify({ workspace: workspace }))
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               console.log(res)
            }
         })
         .catch(err => {
            console.log(err)
         })
   }, [])

   const editViewHandler = res => {
      normalDialogStore.openDialog(
         <Suspense
            fallback={
               <div style={{ height: '250px', minWidth: '600px' }}>
                  <Spinner msg='' />
               </div>
            }
         >
            <AddView
               currentEdit={res}
               isRefreshRequired={isRefreshRequired}
               handleRefresh={setIsRefreshRequired}
            />
         </Suspense>,
         `${t('omniapp:EDIT_VIEW')}`
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
            <AddView
               isRefreshRequired={isRefreshRequired}
               handleRefresh={setIsRefreshRequired}
            />
         </Suspense>,
         `${t('omniapp:ADD_VIEW')}`
      )
   }

   const handleCheckBox = selectedViews => {
      setSelectedViews(selectedViews)
   }

   const handleChangePage = (event, newPage) => {
      setPage(newPage - 1)
   }

   const handleDelete = () => {
      ActView(JSON.stringify({ views: selectedViews }))
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
   const onSearchSubmit = value => {
      const key = 'viewName'
      const updatedRows = views.filter(row =>
         row[key].toLowerCase().includes(value.searchString.toLowerCase())
      )
      setRows(updatedRows)
   }

   return (
      <div style={{ backgroundColor: '#FFFFFF' }}>
         <Paper className={classes.paper}>
            <Toolbar className={classes.root}>
               <SearchBox
                  placeholder={t('omniapp:SEARCH_VIEW')}
                  clearSearchResult={() => setRows(views)}
                  onSearchSubmit={onSearchSubmit}
               />
               <div>
                  {selectedViews.length > 0 ? (
                     <Tooltip title='Delete'>
                        <IconButton
                           aria-label='delete'
                           color='disabled'
                           className={classes.borderBtn}
                           onClick={handleDelete}
                        >
                           <img src='icons/trash_2.svg' alt='trash' />
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
                     {t('omniapp:ADD_VIEW')}
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
                     icon_url: 'icons/edit.svg',
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

export default Views
