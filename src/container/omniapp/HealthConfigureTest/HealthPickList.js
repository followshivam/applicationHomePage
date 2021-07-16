import React, { useState, useEffect } from 'react'
import {
   makeStyles,
   Spinner,
   Typography,
   SearchBox,
   Pagination,
   Popover,
   IconsButton,
   Button
} from 'component'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const useStyle = makeStyles(theme => {
   return {
      paper: {
         padding: theme.spacing(1),
         minWidth: '360px'
      },
      picklist_pagination: {
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center'
      },
      picklist_item: {
         height: '150px',
         overflow: 'auto',
         border: `1px solid ${theme.palette.borderColor}`
      },
      picklist_item_list: {
         width: '100%',
         backgroundColor: theme.palette.background.paper
      },
      list_dense: {
         padding: 2
      },
      listItemText: {
         fontSize: '0.675rem'
      },
      typography: {
         padding: theme.spacing(1)
      },
      selectiontoolbar: {
         display: 'flex',
         justifyContent: 'flex-end',
         alignItems: 'center'
      }
   }
})

function HealthPickList(props) {
   const {
      loading = true,
      value = '',
      list = null,
      onOpen = null,
      onChangeHandler = null,
      name = 'picklist',
      pagination = true,
      disabled = true,
      search = true,
      required = false,
      displayKey = 'label',
      valueKey = 'val',
      error_msg = '',
      onChangePicklist = null,
      onSelect = null,
      ...rest
   } = props
   const classes = useStyle()
   const [checked, setChecked] = useState()
   const [inputList, setInputList] = useState([])
   const [inputValue, setInputValue] = useState(value)

   const open = Boolean(props.targerElement)

   useEffect(() => {
      setInputList(list != null ? (list.data.length > 0 ? list.data : []) : [])
   }, [list])

   useEffect(() => {
      setInputValue(value)
   }, [value])

   const handleSelect = () => {
      let selectedValue = inputList.filter(
         (res, key) => res[valueKey] === checked
      )[0]
      setInputValue(selectedValue[displayKey])
      if (onChangeHandler != null) onChangeHandler(selectedValue)
   }

   const handleToggle = res => () => {
      setChecked(res[valueKey])
   }

   const onSelectHandler = () => {
      props.onClose()
      handleSelect()
   }
   return (
      <Popover
         id={'HealthPopover'}
         open={open}
         anchorEl={props.targerElement}
         onEnter={onOpen}
         onClose={props.onClose}
         anchorOrigin={{
            vertical: 'center',
            horizontal: 'right'
         }}
         transformOrigin={{
            vertical: 'center',
            horizontal: 'left'
         }}
      >
         {loading ? (
            <div style={{ height: '180px', width: '360px' }}>
               <Spinner msg='' />
            </div>
         ) : (
            <div className={classes.paper}>
               <div
                  style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     paddingBottom: '8px'
                  }}
               >
                  <Typography style={{ fontSize: '12px' }}>
                     {'Select Report to define exceptions'}{' '}
                  </Typography>
                  <IconsButton type='CloseIcon' onClick={props.onClose} />
               </div>
               {search && list != null && (
                  <SearchBox
                     width='180px'
                     onSearchSubmit={props.onSearchSubmit}
                     clearSearchResult={props.onClearSearch}
                  />
               )}
               {pagination && list != null && (
                  <div className={classes.picklist_pagination}>
                     <Typography variant='subtitle2'>Option</Typography>
                     <div>
                        <Pagination
                           disabled_next={!list.enable_next}
                           disabled_prev={!list.enable_prev}
                           onChange={onChangePicklist}
                        />
                     </div>
                  </div>
               )}
               <div className={classes.picklist_item}>
                  <List className={classes.picklist_item_list} disablePadding>
                     {inputList.map((res, key) => {
                        return (
                           <ListItem
                              selected={res[valueKey] == checked}
                              key={key}
                              role={undefined}
                              dense
                              button
                              onClick={handleToggle(res)}
                              classes={{ dense: classes.list_dense }}
                           >
                              <ListItemText
                                 primary={res[displayKey]}
                                 classes={{ primary: classes.listItemText }}
                              />
                           </ListItem>
                        )
                     })}
                  </List>
               </div>
               <Typography variant='div' className={classes.selectiontoolbar}>
                  <Button color='' onClick={props.onClose}>
                     Cancel
                  </Button>
                  <Button
                     color='primary'
                     disabled={!checked || list == null}
                     onClick={onSelectHandler}
                  >
                     Ok
                  </Button>
               </Typography>
            </div>
         )}
      </Popover>
   )
}

export default HealthPickList
