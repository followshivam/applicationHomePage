import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Toolbar,
   Paper,
   Checkbox,
   IconButton,
   Button,
   Tooltip
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { SearchBox } from 'component'
import AddEditAppplicationModal from './AddEditAppplicationModal'
import Pagination from '@material-ui/lab/Pagination'

function EnhancedTableHead(props) {
   const {
      onSelectAllClick,
      numSelected,
      rowCount,
      headCells,
      metaData
   } = props

   return (
      <TableHead>
         <TableRow>
            {metaData.rowCheck && (
               <TableCell padding='checkbox'>
                  <Checkbox
                     indeterminate={numSelected > 0 && numSelected < rowCount}
                     checked={rowCount > 0 && numSelected === rowCount}
                     onChange={onSelectAllClick}
                     inputProps={{ 'aria-label': 'select all desserts' }}
                  />
               </TableCell>
            )}
            {headCells.map((headCell, index) => (
               <TableCell key={headCell.name} align={headCell.align}>
                  {headCell.label}
               </TableCell>
            ))}
         </TableRow>
      </TableHead>
   )
}

EnhancedTableHead.propTypes = {
   classes: PropTypes.object.isRequired,
   numSelected: PropTypes.number.isRequired,
   onSelectAllClick: PropTypes.func.isRequired,
   rowCount: PropTypes.number.isRequired
}

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
   borderBtn: {
      border: '1px solid #D3D3D3',
      padding: '7px',
      marginTop: '1px',
      borderRadius: '2px',
      marginRight: '15px'
   },
   button: {
      padding: '4px 14px',
      borderRadius: '2px',
      color: '#fff'
   }
}))

const EnhancedTableToolbar = props => {
   const classes = useToolbarStyles()
   const { numSelected, metaData } = props
   const [open, setOpen] = React.useState(false)

   const handleClose = () => {
      setOpen(false)
   }

   const handleSubmit = value => {
      console.log('value : ', value)
   }

   return (
      <Toolbar className={classes.root}>
         <SearchBox
            onSearchSubmit={props.onSearchSubmit}
            placeholder={metaData.searchPlaceholder}
         />
         <div>
            {numSelected > 0 ? (
               <Tooltip title='Delete'>
                  <IconButton
                     aria-label='delete'
                     color='disabled'
                     className={classes.borderBtn}
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
               onClick={() => setOpen(true)}
            >
               {props.metaData.AddButtonLabel}
            </Button>
         </div>

         {props.modalComponent
            ? open && (
                 <props.modalComponent
                    open={open}
                    handleSubmit={handleSubmit}
                    handleClose={handleClose}
                 />
              )
            : null}
      </Toolbar>
   )
}

EnhancedTableToolbar.propTypes = {
   numSelected: PropTypes.number.isRequired
}

const useStyles = makeStyles(theme => ({
   root: {
      flexGrow: 1
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
   table: {
      flexGrow: '1',
      width: '100%'
   },
   visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1
   },
   body: {
      padding: '9.5px 12px',
      color: '#000000'
   },
   ul: {
      '& ul': {
         justifyContent: 'flex-end'
      }
   }
}))

export default function EnhancedTable(props) {
   const classes = useStyles()
   const [selected, setSelected] = React.useState([])
   const [rows, setRows] = React.useState(props.data)
   const [page, setPage] = React.useState(0)
   const [open, setOpen] = React.useState(false)
   const [rowsPerPage, setRowsPerPage] = React.useState(10)

   const handleSelectAllClick = event => {
      if (event.target.checked) {
         const newSelecteds = rows.map(n => n.name)
         setSelected(newSelecteds)
         return
      }
      setSelected([])
   }

   const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name)
      let newSelected = []

      if (selectedIndex === -1) {
         newSelected = newSelected.concat(selected, name)
      } else if (selectedIndex === 0) {
         newSelected = newSelected.concat(selected.slice(1))
      } else if (selectedIndex === selected.length - 1) {
         newSelected = newSelected.concat(selected.slice(0, -1))
      } else if (selectedIndex > 0) {
         newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1)
         )
      }

      setSelected(newSelected)
   }

   const handleChangePage = (event, newPage) => {
      setPage(newPage - 1)
   }

   const onSearchSubmit = value => {
      const key = props.metaData.searchWithKey
      const updatedRows = props.data.filter(row =>
         row[key].toLowerCase().includes(value.searchString.toLowerCase())
      )
      setRows(updatedRows)
   }

   const isSelected = name => selected.indexOf(name) !== -1

   const updateHeadCells = props.headCells.sort((a, b) => a.index - b.index)

   const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

   return (
      <div className={classes.root}>
         <Paper className={classes.paper}>
            <EnhancedTableToolbar
               numSelected={selected.length}
               {...props}
               onSearchSubmit={onSearchSubmit}
               clearSearchResult={() => setRows(props.data)}
            />
            <TableContainer>
               <Table
                  className={classes.table}
                  aria-labelledby='tableTitle'
                  aria-label='enhanced table'
               >
                  <EnhancedTableHead
                     headCells={updateHeadCells}
                     metaData={props.metaData}
                     classes={classes}
                     numSelected={selected.length}
                     onSelectAllClick={handleSelectAllClick}
                     rowCount={rows.length}
                  />
                  <TableBody>
                     {rows
                        .slice(
                           page * rowsPerPage,
                           page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                           const isItemSelected = isSelected(row.app_id)
                           const labelId = `enhanced-table-checkbox-${index}`
                           return (
                              <TableRow
                                 hover
                                 role='checkbox'
                                 aria-checked={isItemSelected}
                                 tabIndex={-1}
                                 key={row.app_id}
                                 selected={isItemSelected}
                              >
                                 {props.metaData.rowCheck && (
                                    <TableCell padding='checkbox'>
                                       <Checkbox
                                          onClick={event =>
                                             handleClick(event, row.app_id)
                                          }
                                          checked={isItemSelected}
                                          inputProps={{
                                             'aria-labelledby': labelId
                                          }}
                                       />
                                    </TableCell>
                                 )}
                                 {props.headCells.map((item, index) => {
                                    return (
                                       <TableCell
                                          key={index}
                                          align={item.align ? item.align : ''}
                                          className={classes.body}
                                       >
                                          {item.name === 'edit' ? (
                                             <img
                                                src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.svg`}
                                                alt='edit'
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setOpen(true)}
                                             />
                                          ) : item.type === 'checkbox' ? (
                                             <Checkbox
                                                checked={row[item.name]}
                                                inputProps={{
                                                   'aria-label':
                                                      'primary checkbox'
                                                }}
                                             />
                                          ) : (
                                             row[item.name]
                                          )}
                                       </TableCell>
                                    )
                                 })}
                              </TableRow>
                           )
                        })}
                     {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                           <TableCell colSpan={6} />
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </TableContainer>

            <Pagination
               component='div'
               count={Math.trunc(rows.length / rowsPerPage) + 1}
               page={page + 1}
               onChange={handleChangePage}
               color='primary'
               className={classes.ul}
               style={{ marginLeft: 'right', paddingTop: '20px' }}
            />

            {props.modalComponent
               ? open && (
                    <props.modalComponent
                       modalType='EDIT'
                       open={open}
                       handleSubmit={() => console.log('Close Submit')}
                       handleClose={() => setOpen(false)}
                    />
                 )
               : null}

            {/* <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                /> */}
         </Paper>
      </div>
   )
}
