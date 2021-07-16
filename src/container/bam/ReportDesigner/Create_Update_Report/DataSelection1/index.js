import React, { useState, Fragment, useEffect } from 'react'
import {
   Button,
   Grid,
   SearchBox,
   Typography,
   List,
   ListItem,
   ListItemIcon,
   Sidebar,
   TableChartIcon,
   makeStyles,
   Paper,
   FormControlLabel,
   IconsButton,
   DeleteOutlineIcon,
   TableCell,
   Checkbox,
   SelectBox,
   Tooltip,
   Slide,
   TableHead,
   Table,
   TableBody,
   TableRow,
   FixedFooter,
   Confirmation,
   Spinner,
   TableContainer,
   InputBox,
   withStyles,
   Switch
} from 'component'

import { GetTableData, ValidateQuery } from 'global/bam/api/ApiMethods'
import { useDispatch, useSelector } from 'react-redux'
import { CreateReport } from 'redux/action'
import { QueryLayoutCodeView } from 'global/json'
import { ColumnJson, TableJson } from './json'

const useStyle = makeStyles(theme => ({
   grid_container: { background: 'white' },
   sidebar_list: { overflowY: 'scroll', maxWidth: '250px', maxHeight: '65vh' },
   MuiListItemIcon: {
      minWidth: '30px'
   },
   paper: {
      height: 245,
      width: 245,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      position: 'relative',
      zIndex: 0
      // '& .PrivateSwitchBase-root-38': {
      //    padding: 3
      // }
   },
   actionBox: {
      height: 170,
      width: 242,
      paddingTop: '30%'
   },
   cardContainerContent: {
      padding: theme.spacing(1)
   },
   right_container_root: {
      display: 'block',
      marginLeft: '25px',
      backgroundColor: theme.palette.backgroundContainer
   },
   code_container: {
      backgroundColor: theme.palette.backgroundContainer,
      minHeight: '630px',
      display: 'block',
      marginLeft: '1.5rem'
   },
   code_expressions: {
      display: 'block'
   },
   code_textbox: {
      marginTop: '1rem'
      // minWidth: '50%'
   },
   right_container: {
      minHeight: '630px',
      flexGrow: 1,
      overflow: 'auto',
      flexWrap: 'no-wrap'
   },
   table_grid_container: {
      backgroundColor: theme.palette.backgroundContainer,
      minHeight: '630px',
      padding: theme.spacing(2.3)
   },
   toolbar: {
      display: 'flex',
      marginLeft: '20px',
      justifyContent: 'flex-start'
   },
   right_drawer_paper: {
      position: 'relative',
      width: '540px'
   },
   right_drawer: {
      height: '630px',
      marginTop: '-25px',
      right: 0,
      position: 'relative',
      background: theme.palette.common.white,
      display: 'flex',
      textAlign: 'left',
      borderLeft: `1px solid ${theme.palette.borderColor}`,
      padding: theme.spacing(1.5)
   },
   drawer_float_icon: {
      marginLeft: '-22px',
      position: 'relative',
      top: 4,
      background: theme.palette.common.white,
      borderRadius: '50%',
      border: `1px solid ${theme.palette.borderColor}`,
      width: '1.2rem',
      textAlign: 'center',
      height: '1.2rem'
   },
   cardTopBar: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '.2rem 1rem',
      borderBottom: `1px solid ${theme.palette.borderColor}`
   },
   contentCard: {
      display: 'flex',
      justifyContent: 'space-between'
   },
   checkbox_label: {
      fontSize: theme.typography.subtitle1.fontSize
   },
   joinType: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: theme.spacing(1.5)
   },
   paperTable: {
      width: '100%',
      border: `1px solid ${theme.palette.borderColor}`,
      textAlign: 'left'
   },
   tableTopBar: {
      borderBottom: `1px solid ${theme.palette.borderColor}`,
      padding: theme.spacing(1)
   },
   tableTopBar1: {
      paddingLeft: theme.spacing(1.5),
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
   },
   joinEditBar: {
      display: 'flex',
      justifyContent: 'space-between'
   },
   marginLeftStyle: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
   },
   tableHeader: {
      backgroundColor: theme.palette.backgroundContainer
   },
   borderBottom: {
      borderBottom: 'none'
   },
   cardData: {
      marginTop: '4px',
      padding: '.3rem',
      maxHeight: '150px',
      overflowY: 'scroll'
   },
   joinedBar: {
      height: '25px',
      width: '82%',
      display: 'flex',
      justifyContent: 'space-between',
      border: `1px solid ${theme.palette.borderColor}`,
      borderRadius: '.2em',
      padding: '0 10px',
      marginTop: '10px',
      verticalAlign: 'center'
   },
   multiSelectBox: {
      position: 'relative',

      // background: '#FFFFFF',
      height: 245,
      width: 240,
      // width: '245px',
      // opacity: 0.5,
      //  marginTop: -245,
      // top: 55,
      //right: 0,
      textAlign: 'center',
      cursor: 'pointer'
      //  paddingTop: '26%'
   },
   multiSelectCheckBox: {
      border: `2px dotted ${theme.palette.borderColor}`,
      padding: '20px',
      borderRadius: '50px',
      width: '50px',
      height: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
      top: '30%'
   },
   multiSelectText: {
      border: `2px dotted ${theme.palette.borderColor}`,
      padding: '20px',
      borderRadius: '50px',
      width: '50px',
      height: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
      top: '30%'
   },
   customSwitch: {
      marginLeft: '1.6rem',
      display: 'flex',
      marginBottom: '.8px'
   },
   buttonWrapper: {
      padding: '1px 9px',
      borderRadius: '2px',
      backgroundColor: theme.palette.common.white
   }
}))

const CustomSwitch = withStyles(theme => ({
   thumb: {
      color: theme.palette.primary.main
   },
   track: {
      backgroundColor: theme.palette.primary.main
   }
}))(Switch)

const LeftContainer = React.memo(function LeftContainer(props) {
   const classes = useStyle()
   const {
      dropitemlist = [],
      tableList = [],
      next = false,
      onNext = null,
      switchValue = null,
      handleChangeInputButton = null
   } = props

   return (
      <Sidebar>
         <Typography variant='caption'>Data Table Selection </Typography>
         <SearchBox size='medium' />

         <TableList
            dropitemlist={dropitemlist}
            tableList={tableList}
            getTableDataRes={props.getTableDataRes}
            switchValue={switchValue}
            handleChangeInputButton={handleChangeInputButton}
         />
         {next ? (
            <Button color='primary' variant='contained' onClick={onNext}>
               Load More
            </Button>
         ) : null}
      </Sidebar>
   )
})
const TableList = props => {
   const classes = useStyle()
   const {
      tableList = [],
      dropitemlist = [],
      switchValue = null,
      handleChangeInputButton = null
   } = props
   const onDragStart = (e, res) => {
      e.dataTransfer.setData('id', JSON.stringify(res))
   }

   const enableKey = res => {
      // console.log(dropitemlist);
      // console.log(dropitemlist.filter((result)=> result.id==res.id).length==0)
      return (
         dropitemlist.filter(result => result.table_name == res.table_name)
            .length == 0
      )
   }

   return (
      <div className={classes.sidebar_list}>
         {!switchValue ? (
            <List>
               {tableList.map((res, key) => {
                  let EnableKey = enableKey(res)
                  return (
                     <Tooltip title={res.table_name} arrow key={key}>
                        <ListItem
                           dense={true}
                           draggable={EnableKey}
                           onDragStart={e => onDragStart(e, res)}
                           value={key}
                           button={true}
                           disabled={!EnableKey}
                           style={
                              !EnableKey
                                 ? { backgroundColor: '#FF66001A' }
                                 : null
                           }
                        >
                           <ListItemIcon
                              classes={{ root: classes.MuiListItemIcon }}
                           >
                              <TableChartIcon size='small' />
                           </ListItemIcon>

                           <Typography variant='subtitle1' noWrap={true}>
                              {res.table_name}
                           </Typography>
                        </ListItem>
                     </Tooltip>
                  )
               })}
            </List>
         ) : (
            <List>
               {tableList.map((res, key) => {
                  // let EnableKey = enableKey(res)
                  return (
                     <Tooltip title={res.table_name} arrow key={key}>
                        <ListItem
                           dense={true}
                           onDoubleClick={() =>
                              handleChangeInputButton(res.table_name)
                           }
                           value={key}
                           button={true}
                           disableRipple={true}
                        >
                           <ListItemIcon
                              classes={{ root: classes.MuiListItemIcon }}
                           >
                              <TableChartIcon size='small' />
                           </ListItemIcon>

                           <Typography variant='subtitle1' noWrap={true}>
                              {res.table_name}
                           </Typography>
                        </ListItem>
                     </Tooltip>
                  )
               })}
            </List>
         )}
      </div>
   )
}
const CardContainer = React.memo(function CardContainer(props) {
   const classes = useStyle()
   const {
      data = null,
      onRemoveItem = null,
      onColumnSelect = null,
      checboxDisable = true
   } = props
   const [columnList, setColumnList] = useState([])
   const [isLoading, setIsLoading] = useState({ msg: '', loading: true })
   const { loading, msg } = isLoading
   const [columnInput, setColumnInput] = useState({
      opr: 2,
      opt: 0,
      sort_order: 'A',
      prefix: '',
      batch_size: 20,
      column_name: '',
      table_name: data.table_name
   })

   useEffect(() => {
      getTableData()
   }, [columnInput])

   const getTableData = () => {
      // setColumnList(ColumnJson)
      setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500)
      setIsLoading({ ...isLoading, loading: true })
      GetTableData(columnInput)
         .then(response => {
            if (response != null) {
               setColumnList(response.data.fields)
               setTimeout(
                  () => setIsLoading({ ...isLoading, loading: false }),
                  500
               )
            }
         })
         .catch(err => {})
   }
   return (
      <Paper
         className={classes.paper}
         style={data.checked ? { boxShadow: `0 0 2px 1px orange` } : null}
         elevation={data.checked ? 0 : 1}
      >
         <div className={classes.cardTopBar}>
            <div style={{ display: 'flex' }}>
               <IconsButton type='TableChartIcon' />
               <Typography
                  className={classes.marginLeftStyle}
                  variant='subtitle1'
                  noWrap={true}
                  style={{ width: '140px' }}
               >
                  {data.table_name}
               </Typography>
               {!data.joined ? (
                  <IconsButton
                     className={classes.marginLeftStyle}
                     type='AccountTreeIcon'
                     onClick={() => onRemoveItem(data.table_name)}
                  />
               ) : null}
               {/* <Checkbox
                  value={data.id}
                  onChange={onSelect}
                  checked={selectedList.includes(data.id)}
                  style={{ marginTop: '-5px' }}
               /> */}
            </div>
            <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/eye.svg`} />
         </div>
         <div className={classes.cardContainerContent}>
            <SearchBox size='small' />
            <div className={classes.cardData}>
               {loading ? (
                  <div>
                     <Spinner msg='' />
                  </div>
               ) : (
                  columnList.map((res, key) => {
                     return (
                        <div key={key} className={classes.contentCard}>
                           <FormControlLabel
                              value={res.name}
                              control={
                                 <Checkbox
                                    color='primary'
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    disabled={!data.joined}
                                    onChange={e => onColumnSelect(e, res, data)}
                                 />
                              }
                              label={res.name}
                              labelPlacement='end'
                              classes={{ label: classes.checkbox_label }}
                              style={{ marginTop: '-10px' }}
                           />
                           <Typography
                              variant='subtitle1'
                              color='textSecondary'
                           >
                              {res.type}
                           </Typography>
                        </div>
                     )
                  })
               )}
            </div>
         </div>
      </Paper>
   )
})
const MultiSelectBox = props => {
   const classes = useStyle()
   const { isChecked } = props
   return (
      <Paper elevation={0} className={classes.actionBox}>
         <div className={classes.multiSelectBox}>
            {isChecked ? (
               <IconsButton
                  type='CheckIcon'
                  fontSize='large'
                  color='primary'
                  className={classes.multiSelectCheckBox}
               />
            ) : (
               <Typography variant='h6' className={classes.multiSelectText}>
                  Click to select
               </Typography>
            )}
         </div>
      </Paper>
   )
}
const CardsContainer = React.memo(function CardsContainer(props) {
   const {
      dropitemlist = [],
      joinedList = [],
      isMultiSelect = false,
      onSelect = null,
      onRemoveItem = null,
      onColumnSelect = null
   } = props

   return (
      <Grid container spacing={2}>
         {dropitemlist.map((res, key) => {
            return (
               <Grid item key={key} style={{ position: 'relative' }}>
                  <CardContainer
                     data={res}
                     onRemoveItem={onRemoveItem}
                     onColumnSelect={onColumnSelect}
                     checboxDisable={
                        !joinedList.filter(
                           result => result.table_name === res.table_name
                        ).length > 0
                     }
                  />
                  {isMultiSelect && (
                     <Checkbox
                        style={{
                           position: 'absolute',
                           top: '0px',
                           right: '2px',
                           opacity: '.8'
                        }}
                        disableRipple
                        color='default'
                        checked={res.checked}
                        checkedIcon={<MultiSelectBox isChecked={true} />}
                        icon={<MultiSelectBox isChecked={false} />}
                        inputProps={{
                           'aria-label': 'decorative checkbox'
                        }}
                        {...props}
                        onChange={e => {
                           onSelect(e, res)
                        }}
                     />
                  )}
               </Grid>
            )
         })}
      </Grid>
   )
})
const RightContainer = props => {
   const classes = useStyle()

   const {
      onDrop = null,
      dropitemlist = [],
      onRemoveItem = null,
      onRemoveMultiple = null,
      changeDropItem = null,
      changeDropList = null,
      switchValue = null,
      toggleSwitchChecked = null,
      handleChangeInput = null,
      handleChangeInputButton = null,
      expression = ''
   } = props
   const [isMultiSelect, setMultiSelect] = useState(false)
   const [showJoinBar, setShowJoinBar] = useState(false)
   const [joinedList, setJoinedList] = useState([])
   const [selectedList, setSelectedList] = useState([])

   useEffect(() => {
      let checkSelected = dropitemlist.length < 2
      // setJoinedList(joinedList.filter((res)=>dropitemlist.findIndex((result)=>result.table_name===res.table_name)>=0))
      if (checkSelected) {
         setMultiSelect(false)
      }
   }, [dropitemlist])
   const handleMultiSelect = () => {
      let checkStatus =
         dropitemlist.filter(res => res.checked === true).length === 0
      if (checkStatus) {
         // setJoinedList([]);
      }
      setMultiSelect(!isMultiSelect)
   }

   const handleJoin = () => {
      let joined_data = dropitemlist.filter(res => res.checked)
      setJoinedList([...joinedList, joined_data])
      setMultiSelect(!isMultiSelect)
      setShowJoinBar(true)
      let dropListAfterJoin = dropitemlist.map((res, key) => {
         return res.checked
            ? { ...res, checked: false, joined: true }
            : { ...res, checked: false }
      })
      changeDropList(dropListAfterJoin)
   }
   const selectColumnHandler = (e, columnData, tableData) => {
      let data = [...dropitemlist]
      let currentIndex = data.findIndex(
         res => res.table_name === tableData.table_name
      )
      if (e.target.checked) {
         data[currentIndex]['column_list'] = [
            ...data[currentIndex]['column_list'],
            columnData
         ]
      } else {
         data[currentIndex]['column_list'] = data[currentIndex][
            'column_list'
         ].filter(res => res.name !== columnData.name)
      }
      changeDropList(data)
   }
   const deleteJoin = (index, response) => {
      setJoinedList(joinedList.splice(index, 1))
   }
   const disableButtons = dropitemlist.length > 1
   const disableDelete =
      isMultiSelect &&
      dropitemlist.filter(res => res.checked === true).length > 0
   const disabelJoin =
      isMultiSelect &&
      dropitemlist.filter(res => res.checked == true).length > 1

   return (
      <React.Fragment>
         <div className={classes.right_container_root}>
            <div className={classes.customSwitch}>
               <Typography
                  variant='subtitle1'
                  color={!switchValue ? 'primary' : 'ddd'}
               >
                  Graphical
               </Typography>
               <CustomSwitch
                  size='small'
                  checked={switchValue}
                  onChange={toggleSwitchChecked}
               />
               <Typography
                  variant='subtitle1'
                  color={switchValue ? 'primary' : 'ddd'}
               >
                  Code
               </Typography>
            </div>
            {!switchValue ? (
               <Fragment>
                  <div style={{ display: 'flex' }}>
                     <div className={classes.right_container}>
                        <div className={classes.toolbar}>
                           <Button
                              onClick={handleMultiSelect}
                              disabled={!disableButtons}
                              startIcon={
                                 <IconsButton
                                    type='TableChartIcon'
                                    color='primary'
                                    disabled={!disableButtons}
                                 />
                              }
                              color='primary'
                           >
                              MultiSelect
                           </Button>
                           <Button
                              onClick={handleJoin}
                              color='primary'
                              startIcon={
                                 <IconsButton
                                    type='AccountTreeIcon'
                                    color='primary'
                                    disabled={!disabelJoin}
                                 />
                              }
                              disabled={!disabelJoin}
                           >
                              Join Tables
                           </Button>
                           <Button
                              color='primary'
                              startIcon={
                                 <DeleteOutlineIcon disabled={!disableDelete} />
                              }
                              disabled={!disableDelete}
                              onClick={onRemoveMultiple}
                           >
                              Delete
                           </Button>
                        </div>
                        <div
                           className={classes.table_grid_container}
                           onDragOver={e => {
                              e.preventDefault()
                           }}
                           onDrop={onDrop}
                        >
                           {dropitemlist && dropitemlist.length === 0 ? (
                              <div>
                                 <Typography variant='h6' color='textSecondary'>
                                    Drag and Drop a table here.
                                 </Typography>
                                 <Typography variant='h6' color='textSecondary'>
                                    To Join Tables, Use MultiSelect option to
                                    select tables and click on join
                                 </Typography>
                              </div>
                           ) : (
                              <CardsContainer
                                 dropitemlist={dropitemlist}
                                 joinedList={joinedList}
                                 onColumnSelect={selectColumnHandler}
                                 isMultiSelect={isMultiSelect}
                                 onSelect={changeDropItem}
                                 onRemoveItem={onRemoveItem}
                              />
                           )}
                        </div>
                     </div>
                     <div className={classes.right_drawer}>
                        <div
                           onClick={() => setShowJoinBar(!showJoinBar)}
                           className={classes.drawer_float_icon}
                        >
                           <IconsButton
                              type={
                                 !showJoinBar
                                    ? 'ArrowBackIosIcon'
                                    : 'ArrowForwardIosIcon'
                              }
                              color='textSecondary'
                           />
                        </div>

                        <Slide
                           direction='left'
                           in={showJoinBar}
                           mountOnEnter
                           unmountOnExit
                        >
                           <Paper
                              elevation={0}
                              className={classes.right_drawer_paper}
                           >
                              <RightDrawerPaper
                                 joinedList={joinedList}
                                 deleteJoin={deleteJoin}
                                 dropitemlist={dropitemlist}
                              />
                           </Paper>
                        </Slide>
                     </div>
                  </div>
               </Fragment>
            ) : (
               <CodeContainer expression={expression} />
            )}
         </div>
      </React.Fragment>
   )
}

const CodeContainer = props => {
   const classes = useStyle()
   const { expression = '' } = props

   const [inputState, setInputState] = useState('')

   useEffect(() => {
      setInputState(inputState + ' ' + expression)
   }, [expression])

   const handleChangeInputButton = res => {
      setInputState(inputState + ' ' + res)
   }
   const onInputChange = e => {
      setInputState(e.target.value)
   }
   return (
      <Fragment>
         <div className={classes.code_container}>
            <div className={classes.code_expressions}>
               <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='center'
                  spacing={2}
               >
                  {QueryLayoutCodeView.conditonDummy.map((res, key) => (
                     <Grid item key={key}>
                        <Button
                           variant='outlined'
                           className={classes.buttonWrapper}
                           onClick={() => handleChangeInputButton(res)}
                        >
                           {res}
                        </Button>
                     </Grid>
                  ))}
               </Grid>
               <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='center'
                  spacing={2}
               >
                  {QueryLayoutCodeView.expressionDummy.map((res, key) => (
                     <Grid item key={key}>
                        <Button
                           variant='outlined'
                           className={classes.buttonWrapper}
                           onClick={() => handleChangeInputButton(res)}
                        >
                           {res}
                        </Button>
                     </Grid>
                  ))}
               </Grid>
               <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='center'
                  spacing={2}
               >
                  {QueryLayoutCodeView.joinDummy.map((res, key) => (
                     <Grid item key={key}>
                        <Button
                           variant='outlined'
                           className={classes.buttonWrapper}
                           onClick={() => handleChangeInputButton(res)}
                        >
                           {res}
                        </Button>
                     </Grid>
                  ))}
               </Grid>
            </div>
            <div className={classes.code_textbox}>
               <InputBox
                  name='code_container'
                  rows='17'
                  fullWidth={true}
                  multiline={true}
                  minRows={17}
                  maxRows={22}
                  required={true}
                  injectLiveValue={true}
                  placeholder='Write down the expression here'
                  style={{ width: '98%' }}
                  value={inputState}
                  onChangeHandler={onInputChange}
               />
            </div>
         </div>
      </Fragment>
   )
}

const RightDrawerPaper = props => {
   const { joinedList = [], dropitemlist = [], deleteJoin = null } = props
   const classes = useStyle()
   const [editBox, setEditBox] = useState(true)
   const [currentIndex, setCurrentIndex] = useState(0)
   const handleEditing = index => {
      setEditBox(!editBox)
      setCurrentIndex(index)
   }
   useEffect(() => {
      if (joinedList.length > 0) {
         setEditBox(false)
      } else {
         setEditBox(true)
      }
      setCurrentIndex(joinedList.length - 1)
   }, [joinedList])

   return (
      <Fragment>
         {editBox ? (
            <div
               style={{
                  padding: '0 20px 40px 20px'
               }}
            >
               <Typography variant='h6'>
                  <b>Data Table Joins</b>
               </Typography>
               {joinedList.length > 0 ? (
                  joinedList.map((res, key) => (
                     <div
                        style={{
                           justifyContent: 'space-between',
                           display: 'flex'
                        }}
                        key={key}
                     >
                        <div className={classes.joinedBar}>
                           {res.map((result, key1) => (
                              <Typography variant='subtitle1' key={key1}>
                                 {result.table_name}
                              </Typography>
                           ))}
                        </div>
                        <IconsButton
                           type='EditIcon'
                           onClick={() => handleEditing(key)}
                        />
                        <img
                           src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`}
                           onClick={() => deleteJoin(key, res)}
                        />
                     </div>
                  ))
               ) : (
                  <Typography variant='subtitle1'>No Joins Done</Typography>
               )}
            </div>
         ) : (
            <React.Fragment>
               <div
                  style={{
                     borderBottom: '1px solid lightgray',
                     padding: '0 20px 40px 20px'
                  }}
               >
                  <div className={classes.joinEditBar}>
                     <div className={classes.joinEditBar}>
                        <IconsButton
                           type='ArrowBackIosIcon'
                           color='primary'
                           onClick={handleEditing}
                        />
                        <Typography
                           className={classes.marginLeftStyle}
                           variant='subtitle1'
                        >
                           <b>Table Joins</b>
                        </Typography>
                        <Typography
                           noWrap={true}
                           className={classes.marginLeftStyle}
                           variant='h6'
                        >
                           {joinedList[currentIndex].map((el, index) => {
                              return `${el.table_name} ${
                                 index === 0 ? ' & ' : ''
                              }`
                           })}
                        </Typography>
                     </div>
                     <div className={classes.joinEditBar}>
                        <Typography variant='subtitle1' color='textSecondary'>
                           Cancel
                        </Typography>
                        <Typography
                           className={classes.marginLeftStyle}
                           variant='subtitle1'
                           color='primary'
                        >
                           Save
                        </Typography>
                     </div>
                  </div>
                  <div className={classes.joinType}>
                     <Typography variant='subtitle1'>
                        <b>Join Type:</b>
                     </Typography>
                     <SelectBox
                        style={{ width: '420px' }}
                        list={[
                           {
                              value: 'No Join,Individual Addition',
                              label: 'No Join,Individual Addition'
                           },
                           {
                              value:
                                 'INNER JOIN,Similar records from both tables',
                              label:
                                 'INNER JOIN,Similar records from both tables'
                           },
                           {
                              value:
                                 'LEFT JOIN,All records from left and similar from right',
                              label:
                                 'LEFT JOIN,All records from left and similar from right'
                           },
                           {
                              value:
                                 'RIGHT JOIN,All records from right and similar from left',
                              label:
                                 'RIGHT JOIN,All records from right and similar from left'
                           },
                           {
                              value:
                                 'FULL OUTER JOIN,All record from both tables',
                              label:
                                 'FULL OUTER JOIN,All record from both tables'
                           }
                        ]}
                     />
                  </div>
                  <div className={classes.joinType}>
                     <Typography variant='subtitle1' color='textSecondary'>
                        <b>Field Matching</b>
                     </Typography>
                     <IconsButton color='primary' type='AddIcon' />
                  </div>
                  <div>
                     <Grid container spacing={0}>
                        <Grid item sm={6}>
                           <Paper className={classes.paperTable} elevation={0}>
                              <Grid
                                 container
                                 justify='space-between'
                                 className={classes.tableTopBar}
                              >
                                 <Typography variant='subtitle1'>
                                    <b>Source</b>
                                 </Typography>

                                 {/*<Typography variant='subtitle1'>
                                    {a[0]}
                                 </Typography>*/}
                              </Grid>
                              {[1, 2, 3, 4].map((data, i) => {
                                 return (
                                    <SelectBox
                                       key={i}
                                       list={[
                                          {
                                             value: 'ProcessDefId',
                                             label: 'ProcessDefId'
                                          }
                                       ]}
                                       style={{ width: '100%' }}
                                    />
                                 )
                              })}
                           </Paper>
                        </Grid>
                        <Grid item sm={6}>
                           <Paper className={classes.paperTable} elevation={0}>
                              <Grid
                                 container
                                 justify='space-between'
                                 className={classes.tableTopBar}
                              >
                                 <Typography variant='subtitle1'>
                                    <b>Join</b>
                                 </Typography>
                              </Grid>
                              {[1, 2, 3, 4].map((data, i) => {
                                 return (
                                    <SelectBox
                                       key={i}
                                       list={[
                                          {
                                             value: 'ProcessDefId',
                                             label: 'ProcessDefId'
                                          }
                                       ]}
                                       style={{ width: '100%' }}
                                    />
                                 )
                              })}
                           </Paper>
                        </Grid>
                     </Grid>
                  </div>
               </div>
               <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='flex-start'
                  className={classes.tableTopBar}
               >
                  <Typography variant='h6'>
                     <b>Data View</b>
                  </Typography>
               </Grid>
               <div>
                  <Grid container spacing={0}>
                     {joinedList[currentIndex].map((res, key) => (
                        <Grid item sm={6} key={key}>
                           <Paper className={classes.paperTable} elevation={0}>
                              <Grid
                                 container
                                 justify='space-between'
                                 className={classes.tableTopBar1}
                              >
                                 <Typography variant='subtitle1'>
                                    {res.table_name}
                                 </Typography>
                                 <div></div>
                              </Grid>
                              <div>
                                 <TableContainer
                                    style={{
                                       minHeight: '150px',
                                       maxHeight: '150px'
                                    }}
                                 >
                                    <Table
                                       className={classes.table}
                                       stickyHeader
                                       aria-label='sticky table'
                                    >
                                       <TableHead>
                                          <TableRow
                                             className={classes.tableHeader}
                                          >
                                             <TableCell
                                                className={classes.borderBottom}
                                             >
                                                Name
                                             </TableCell>
                                             <TableCell
                                                className={classes.borderBottom}
                                             >
                                                Type
                                             </TableCell>
                                          </TableRow>
                                       </TableHead>
                                       <TableBody>
                                          {dropitemlist
                                             .filter(
                                                result =>
                                                   result.table_name ===
                                                   res.table_name
                                             )[0]
                                             .column_list.map((row, i) => (
                                                <TableRow key={i}>
                                                   <TableCell
                                                      className={
                                                         classes.borderBottom
                                                      }
                                                      scope='row'
                                                   >
                                                      {row.name}
                                                   </TableCell>
                                                   <TableCell
                                                      className={
                                                         classes.borderBottom
                                                      }
                                                      align='right'
                                                   >
                                                      {row.type}
                                                   </TableCell>
                                                </TableRow>
                                             ))}
                                       </TableBody>
                                    </Table>
                                 </TableContainer>
                              </div>
                           </Paper>
                        </Grid>
                     ))}
                  </Grid>
               </div>
            </React.Fragment>
         )}
      </Fragment>
   )
}

function Home(props) {
   const classes = useStyle()
   const { onPreviousHandler = null, onNextHandler = null } = props
   const [dropitemlist, setDropItemList] = useState([])
   const [dropItemArray, setDropItemArray] = useState([])
   const [tableData, setTableData] = useState([])
   const [enableNext, setEnableNext] = useState(false)
   const [isLoading, setIsLoading] = useState({ msg: '', loading: true })
   const [expression, setExpression] = useState('')
   const [tableInput, setTableInput] = useState({
      opr: '1',
      opt: 0,
      sort_order: 'A',
      last_value: '',
      last_index: '',
      prefix: '',
      batch_size: 20,
      column_name: '',
      table_name: ''
   })
   const { loading, msg } = isLoading
   const [store, dialogState, snackbarState] = useSelector(state => {
      return [
         state.createReportState,
         state.normalDialogState,
         state.snackbarState
      ]
   })
   // const dialogState = useSelector(state => {
   //    return state.normalDialogState
   // })
   const [reportStore, setReportStore] = useState(store)
   const dispatch = useDispatch()

   useEffect(() => {
      getTableData()
   }, [tableInput])

   const getTableData = () => {
      // setTableData(
      //    TableJson.map(res => {
      //       return { ...res, checked: false, column_list: [] }
      //    })
      // )
      setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500)
      setIsLoading({ ...isLoading, loading: true })
      GetTableData(tableInput)
         .then(response => {
            if (response != null) {
               let tableList = tableData.concat(response.data.tables)
               setTableData(
                  tableList.map(res => {
                     return { ...res, checked: false, column_list: [] }
                  })
               )
               setEnableNext(response.data.enable_next)
               setTimeout(
                  () => setIsLoading({ ...isLoading, loading: false }),
                  500
               )
            }
         })
         .catch(err => {})
   }
   const onDrop = e => {
      let data = JSON.parse(e.dataTransfer.getData('id'))
      let isExist = dropitemlist.findIndex(
         result => result.table_name == data.table_name
      )
      let updatedData = { ...data }
      if (isExist > -1) {
         let updatedDropItemList = [...dropitemlist]
         updatedDropItemList[isExist] = updatedData
         setDropItemList(updatedDropItemList)
      } else {
         let items = [...dropitemlist, updatedData]
         setDropItemArray(items)
         setDropItemList(items)
      }
      e.stopPropagation()
      e.preventDefault()
   }
   const onRemoveItemHandler = name => {
      setDropItemList(dropitemlist.filter(res => res.table_name !== name))
   }
   const onPrevious = () => {
      dialogState.openDialog(
         <Confirmation
            button_label='Yes, Change it'
            title='Are you sure you want to change the Query Input type?'
            description='Changing Query Input type will make you loose all the configurations done in the current one.'
            action={() => {
               dispatch(CreateReport({ ...reportStore, current_step: 0 }))
               onPreviousHandler(0)
            }}
         />,
         ''
      )
   }
   const onNext = e => {
      // let inputJson = {
      //    flag: '3',
      //    query:
      //       'SELECT TOP 1 * FROM A_Pie INNER JOIN aa_test ON A_Pie.id aa_test.name'
      // }
      // ValidateQuery(inputJson)
      //    .then(res => {
      //       if (res != null && res.status.maincode === '0') {
      //          console.log(res)
      //       } else {
      //          snackbarState.openSnackbar(
      //             `Error: ${res.status.errormsg}`,
      //             'error'
      //          )
      //       }
      //    })
      //    .catch(err => {})
      dispatch(CreateReport({ ...reportStore, current_step: 2 }))
      onNextHandler(2)
   }
   const querySubmit = e => {
      e.preventDefault()
      onNext()
   }
   const onChangeItemHandler = (e, res) => {
      if (
         e.target.checked &&
         dropitemlist.filter(result => result.checked).length === 2
      ) {
         alert('not allowed')
         return false
      }
      let currentIndex = dropitemlist.findIndex(
         result => result.table_name === res.table_name
      )
      let data = [...dropitemlist]
      data[currentIndex] = { ...data[currentIndex], checked: e.target.checked }
      setDropItemList(data)
   }
   const onRemoveMultipleHandler = () => {
      setDropItemList(dropitemlist.filter(res => res.checked === false))
   }
   const changeDropList = data => {
      setDropItemList(data)
   }

   const [switchValue, setSwitchValue] = useState(true)

   const toggleSwitchChecked = e => {
      setSwitchValue(e.target.checked)
   }

   const handleChangeInputButton = res => {
      setExpression(res)
   }
   return (
      <React.Fragment>
         <form onSubmit={querySubmit}>
            <Grid
               container
               alignItems='stretch'
               className={classes.grid_container}
            >
               <Grid item xs={5} sm={3} lg={2}>
                  {loading ? (
                     <div style={{ height: '480px' }}>
                        <Spinner msg={msg} />
                     </div>
                  ) : (
                     <LeftContainer
                        dropitemlist={dropitemlist}
                        tableList={tableData}
                        next={enableNext}
                        onNext={() => setTableInput({ ...tableInput, opt: 1 })}
                        switchValue={switchValue}
                        toggleSwitchChecked={toggleSwitchChecked}
                        handleChangeInputButton={handleChangeInputButton}
                     />
                  )}
               </Grid>
               <Grid item xs={7} sm={9} lg={10}>
                  <RightContainer
                     dropitemlist={dropitemlist}
                     onDrop={onDrop}
                     onRemoveItem={onRemoveItemHandler}
                     onRemoveMultiple={onRemoveMultipleHandler}
                     changeDropItem={onChangeItemHandler}
                     changeDropList={changeDropList}
                     switchValue={switchValue}
                     toggleSwitchChecked={toggleSwitchChecked}
                     expression={expression}
                  />
               </Grid>
            </Grid>
            <FixedFooter>
               <Grid container spacing={2} justify='flex-end'>
                  <Grid item>
                     <Button color='textSecondary' variant='contained'>
                        Cancel
                     </Button>
                  </Grid>
                  <Grid item>
                     <Button
                        color='primary'
                        variant='contained'
                        onClick={onPrevious}
                     >
                        Previous
                     </Button>
                  </Grid>
                  <Grid item>
                     <Button
                        type={switchValue ? 'submit' : 'button'}
                        color='primary'
                        variant='contained'
                        onClick={switchValue ? null : onNext}
                     >
                        Proceed
                     </Button>
                  </Grid>
               </Grid>
            </FixedFooter>
         </form>
      </React.Fragment>
   )
}

export default Home
