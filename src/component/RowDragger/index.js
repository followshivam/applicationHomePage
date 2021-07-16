import React, { Component } from 'react'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import arrayMove from 'array-move'

import { Typography, makeStyles, IconsButton, Toolbar, Grid, Tooltip } from 'component'
import { InputBox } from 'component/Form'
import { Checkbox } from '@material-ui/core'
import { TypeConversion } from 'global/methods'
const useStyles = makeStyles(theme => ({
   dragger_toolbar: {
      border: '1px solid #E5E5E5',
      '& > *': {
         // marginRight: theme.spacing(10)
         //  marginLeft:theme.spacing(10)
      }
   },
   sortingrow: {
      backgroundColor: theme.palette.common.white,

      margin: '8px 16px 8px 16px'
   },
   barStyle: {
      textAlign: 'left',
      minWidth: '50px'
   }
}))
const SortableItem = SortableElement(({ value, variant, ...rest }) => {
   const classes = useStyles()
   return (
      <div className={classes.sortingrow}>
         <Toolbar variant='dense' className={classes.dragger_toolbar}>
            <IconsButton type='DragIndicatorIcon' />
            {variant === 'tabular' ? (
               <div
                  style={{
                     display: 'flex',
                     justifyContent: 'flex-start',
                     alignItems: 'center',
                     width: '100%'
                  }}
               >
                  <div
                     style={{
                        width: '20%',
                        paddingLeft: '10px',
                        minWidth: '150px'
                     }}
                  >
                     <Typography variant='subtitle2'>
                        {value.display_name}
                     </Typography>
                  </div>
                  <div style={{ width: '20%', minWidth: '70px' }}>
                     <Typography variant='subtitle1'>
                        {value.type === '16' ? 'Text' : 'Integer'}
                     </Typography>
                  </div>
                  <div style={{ width: '20%', minWidth: '30px' }}>
                     <Typography variant='subtitle2'>
                        <Checkbox />
                     </Typography>
                  </div>
                  <div>
                     <InputBox />
                  </div>
               </div>
            ) : (
               //  <div
               //     style={{
               //        display: 'flex',
               //        justifyContent: 'flex-start',
               //        alignItems: 'left',
               //        width: '100%'
               //     }}
               //  >
               <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='flex-start'
               >
                  <div style={{ minWidth: '200px' }}>
                  <Tooltip title={value.name} arrow >
                  <Typography
                     variant='subtitle1'
                     noWrap={true}
                     style={{
                        width: '26%',
                        paddingLeft: '1rem',
                        textAlign: 'left',
                        minWidth: '170px',
                        maxWidth: '170px'
                     }}
                  >
                     {value.name}
                  </Typography>
                  </Tooltip>
                  </div>
                  <Typography
                     variant='subtitle1'
                     className={classes.barStyle}
                     color='textSecondary'
                     style={{
                        width: '11%',
                        minWidth: '85px',
                        maxWidth: '85px'
                     }}
                  >
                     {TypeConversion(value.type)}
                  </Typography>
                  <Typography
                     variant='subtitle1'
                     className={classes.barStyle}
                     style={{
                        width: '20%'
                     }}
                  >
                     {value.display_name}
                  </Typography>
                  <div
                     style={{
                        width: '40%'
                     }}
                  ></div>
               </Grid>
            )}
         </Toolbar>
      </div>
   )
})

const SortableList = SortableContainer(({ items, variant }) => {
   return (
      <div style={{ marginTop: '16px' }}>
         {items.map((value, index) => (
            <SortableItem
               key={`item-${value.name}`}
               variant={variant}
               index={index}
               value={value}
            />
         ))}
      </div>
   )
})

const RowDragger = props => {
   const onSortEnd = ({ oldIndex, newIndex }) => {
      props.onChange(arrayMove(props.items, oldIndex, newIndex))
      // setItems(arrayMove(items, oldIndex, newIndex))
      // console.log(arrayMove(items, oldIndex, newIndex))
      // this.setState(({items}) => ({
      //   items: arrayMove(items, oldIndex, newIndex),
      // }));
   }
   return <SortableList onSortEnd={onSortEnd} {...props} />
}

export default RowDragger
