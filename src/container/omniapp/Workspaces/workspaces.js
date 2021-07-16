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
import {
   ActWorkspace,
   GetWorkspaceList
} from '../../../global/omniapp/api/ApiMethods'

const AddWorkspace = lazy(() => import('./add_workspace'))

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
      color: '#fff',
      height: 30
   },
   ul: {
      '& ul': {
         justifyContent: 'flex-end'
      }
   }
}))

const Workspaces = props => {
   const classes = useToolbarStyles()
   const { showViewList } = props
   const [rows, setRows] = React.useState([])
   const [workspaces, setWorkspaces] = React.useState([])
   const [selectedWorkspaces, setSelectedWorkspaces] = React.useState([])
   const [page, setPage] = React.useState(0)
   const [rowsPerPage, setRowsPerPage] = React.useState(5)
   const [headCells, setHeadCells] = useState([])
   const [isRefreshRequired, setIsRefreshRequired] = useState(false)

   const normalDialogStore = useSelector(state => state.normalDialogState)
   const [globalSetting] = useSelector(state => {
      return [state.globalSettings]
   })

   const { t } = useTranslation(
      globalSetting.locale_module
         ? globalSetting.locale_module
         : ['bam', 'omniapp']
   )
   useEffect(() => {
      const workspacesData = {
         data: {
            tableHeader: [
               {
                  id: 'workspaceName',
                  label: `${t('omniapp:WORKSPACES_NAME')}`,
                  onClick: res => showViewList(res),
                  typographyProps: {
                     style: { color: '#0072C6', fontWeight: 600 }
                  }
               },
               { id: 'description', label: `${t('omniapp:DESCRIPTION')}` },
               { id: 'modifiedOn', label: `${t('omniapp:MODIFIED_ON')}` }
            ],
            workspaces: [
               {
                  workspaceName: 'Report Designer',
                  description: 'A short description',
                  modifiedOn: '28 Dec 2020 15:10 PM'
               },
               {
                  workspaceName: 'Data  Modeler',
                  description: 'A short description',
                  modifiedOn: '28 Dec 2020 15:10 PM'
               },
               {
                  workspaceName: 'Report Creator',
                  description: 'A short description',
                  modifiedOn: '28 Dec 2020 15:10 PM'
               },
               {
                  workspaceName: 'Process Designer',
                  description: 'A very short description',
                  modifiedOn: '28 Nov 2020 11:10 PM'
               },
               {
                  workspaceName: 'RPA Designer',
                  description: 'A long description',
                  modifiedOn: '28 Nov 2020 11:10 PM'
               },
               {
                  workspaceName: 'iFrame Designer',
                  description: 'A short description',
                  modifiedOn: '29 Jan 2020 15:10 PM'
               },
               {
                  workspaceName: 'Data Designer',
                  description: 'A short description',
                  modifiedOn: '31 Dec 2020 10:10 PM'
               }
            ]
         }
      }
      const data = workspacesData.data
      setRows(data.workspaces)
      setWorkspaces(data.workspaces)
      setHeadCells(data.tableHeader)

      GetWorkspaceList()
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               console.log(res)
            }
         })
         .catch(err => {
            console.log(err)
         })
   }, [])

   const handleCheckBox = selectedWorkspaces => {
      setSelectedWorkspaces(selectedWorkspaces)
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
            <AddWorkspace
               currentEdit={res}
               isRefreshRequired={isRefreshRequired}
               handleRefresh={setIsRefreshRequired}
            />
         </Suspense>,
         `${t('omniapp:EDIT_WORKSPACE')}`
      )
   }

   const handleChangePage = (event, newPage) => {
      setPage(newPage - 1)
   }

   const openDialogBoxFromStore = () => {
      // console.log('openDialogBoxFromStore')
      normalDialogStore.openDialog(
         <Suspense
            fallback={
               <div style={{ height: '250px', minWidth: '600px' }}>
                  <Spinner msg='' />
               </div>
            }
         >
            <AddWorkspace
               isRefreshRequired={isRefreshRequired}
               handleRefresh={setIsRefreshRequired}
            />
         </Suspense>,
         `${t('omniapp:ADD_WORKSPACE')}`
      )
   }
   const onSearchSubmit = value => {
      const key = 'workspaceName'
      const updatedRows = workspaces.filter(row =>
         row[key].toLowerCase().includes(value.searchString.toLowerCase())
      )
      setRows(updatedRows)
   }

   const handleDelete = () => {
      ActWorkspace(JSON.stringify({ workspaces: selectedWorkspaces }))
         .then(res => {
            console.log(res, selectedWorkspaces)
            if (res != null && res.status.maincode === '0') {
               setIsRefreshRequired(!isRefreshRequired)
            }
         })
         .catch(err => {
            console.log(err)
         })
   }

   return (
      <div style={{ backgroundColor: '#FFFFFF' }}>
         <Paper className={classes.paper}>
            <Toolbar className={classes.root}>
               <SearchBox
                  placeholder={t('omniapp:SEARCH_WORKSPACE')}
                  onSearchSubmit={onSearchSubmit}
                  clearSearchResult={() => setRows(workspaces)}
               />
               <div>
                  {selectedWorkspaces.length > 0 ? (
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
                     {t('omniapp:ADD_WORKSPACE')}
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

export default Workspaces
