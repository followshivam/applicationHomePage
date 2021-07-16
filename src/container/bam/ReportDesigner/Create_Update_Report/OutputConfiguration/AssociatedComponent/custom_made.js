import React, { Fragment, useState } from 'react'

import {
   Button,
   InputBox,
   makeStyles,
   Typography,
   List,
   Paper,
   IconImage,
   IconsButton
} from 'component'

const useStyles = makeStyles(theme => ({
   report_container: {
      height: 290,
      background: theme.palette.backgroundContainer,
      padding: '0px 20px'
   },
   inputBoxWidth: {
      width: '459px'
   },
   inputOptionBox: {
      width: '500px'
   },
   optionItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '2px 5px',

      '&:hover': {
         background: '#FF660014'
      }
   },
   optionsList: {
      height: '180px',
      width: '99.8%',
      padding: '5px 0',
      border: `1px solid ${theme.palette.borderColor}`,
      overflowY: 'scroll'
   },
   form: {
      paddingTop: theme.spacing(1.2),
      display: 'flex',
      marginBottom: theme.spacing(1.2)
   },
   button: {
      padding: '0 5px',
      marginLeft: theme.spacing(1.2)
   }
}))

const CustomMade = props => {
   const classes = useStyles()
   const [options, setOptions] = useState([
      { option: 'Lobortis odio consequat', edit: false },
      { option: 'Nulla faucibus consequat', edit: false },
      { option: 'Urna consectetur curabitur', edit: false },
      { option: 'Nulla faucibus dummy', edit: false },
      { option: 'Urna dfdfsd curabitur', edit: false }
   ])

   const [inputData, setInputData] = useState('')

   const handleInput = e => {
      setInputData(e.target.value)
   }

   const handleSubmit = e => {
      e.preventDefault()
      let data = {}
      data.option = inputData
      data.edit = false
      setOptions([data, ...options])
      setInputData(' ')
   }

   const handleDelete = option => {
      setOptions(options.filter(res => res.option !== option.option))
   }

   const handleEditOption = (e, res, key) => {
      let currentIndex = options[key]
      currentIndex.edit = !currentIndex.edit
      const newOption = Object.assign([], options, { [key]: currentIndex })
      setOptions(newOption)
   }

   const handleOptionBox = (e, key) => {
      let currentIndex = options[key]
      currentIndex.option = e.target.value
      const newOption = Object.assign([], options, { [key]: currentIndex })
      setOptions(newOption)
   }

   return (
      <Fragment>
         <div className={classes.report_container}>
            <form onSubmit={handleSubmit} className={classes.form}>
               <InputBox
                  helpertext='Write down the picklist option and add to the Options list'
                  form
                  fullWidth={true}
                  value={inputData}
                  className={classes.inputBoxWidth}
                  onChange={handleInput}
                  required
               />
               <div className={classes.button}>
                  <Button variant='contained' color='primary' type='submit'>
                     Add
                  </Button>
               </div>
            </form>
            <Typography vairant='subtitle1'>Options List</Typography>
            <Paper className={classes.optionsList} elevation={0}>
               <List>
                  {options.map((res, key) => {
                     return (
                        <div key={key} className={classes.optionItem}>
                           {!res.edit ? (
                              <Typography variant='subtitle1'>
                                 {res.option}
                              </Typography>
                           ) : (
                              <InputBox
                                 className={classes.inputOptionBox}
                                 value={res.option}
                                 onChange={e => handleOptionBox(e, key)}
                              />
                           )}
                           <div style={{ display: 'flex' }}>
                              {!res.edit ? (
                                 <IconImage
                                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.svg`}
                                    height={15}
                                    onClick={e => handleEditOption(e, res, key)}
                                 />
                              ) : (
                                 <IconsButton
                                    type='CheckIcon'
                                    onClick={e => handleEditOption(e, res, key)}
                                 />
                              )}
                              <IconImage
                                 url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/delete.svg`}
                                 height={15}
                                 style={{ marginLeft: '10px' }}
                                 onClick={() => handleDelete(res)}
                              />
                           </div>
                        </div>
                     )
                  })}
               </List>
            </Paper>
         </div>
      </Fragment>
   )
}

export default CustomMade
