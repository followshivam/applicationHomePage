import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Toolbar, IconButton, Button, Tooltip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { SearchBox } from 'component'

const useToolbarStyles = makeStyles(theme => ({
   root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: theme.palette.common.white
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
   const { numSelected } = props

   return (
      <Toolbar className={classes.root}>
         <SearchBox
            onSearchSubmit={props.onSearchSubmit}
            placeholder={props.searchPlaceholder}
            clearSearchResult={props.clearSearchResult}
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
               onClick={() => props.addModalHandler()}
            >
               {props.addButtonLabel}
            </Button>
         </div>
      </Toolbar>
   )
}

EnhancedTableToolbar.propTypes = {
   numSelected: PropTypes.number.isRequired
}

export default EnhancedTableToolbar
