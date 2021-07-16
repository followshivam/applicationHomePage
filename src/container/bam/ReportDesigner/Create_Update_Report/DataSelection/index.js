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
   useTranslation,
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
import { QueryLayoutCodeView, CreateUpdateReportInput } from 'global/json'
import { TypeConversion } from 'global/methods'
import LayersIcon from '@material-ui/icons/Layers'
import { ColumnJson, TableJson } from './json'

const useStyle = makeStyles(theme => ({
   grid_container: {
      background: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'row'
   },
   sidebar_list: {
      overflow: 'auto',
      marginTop: theme.spacing(1.5),
      marginBottom: theme.spacing(2),
      flex: 1
   },
   MuiListItemIcon: {
      minWidth: '30px'
   },
   paper: {
      minHeight: 250,
      width: 250,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      position: 'relative',
      zIndex: 0,
      boxShadow: 'none',
      border: '1px solid #DADADA'
      // '& .PrivateSwitchBase-root-38': {
      //    padding: 3
      // }
   },
   actionBox: {
      height: 240,
      width: 242,
      paddingTop: '30%'
   },
   cardContainerContent: {
      padding: theme.spacing(1, 1.8, 1.8, 1.8)
   },
   right_container_root: {
      // display: 'block',
      // marginLeft: '25px',
      backgroundColor: theme.palette.backgroundContainer
   },
   left_grid_container: {
      padding: '12px 0',
      display: 'flex',
      flexDirection: 'column',
      width: '280px',
      height: 'calc(100vh - 93px)'
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
      // marginTop: theme.spacing(2.5),
      padding: theme.spacing(2.3),
      overflow: 'auto',
      height: 'calc(100vh - 175px)'
   },
   toolbar: {
      display: 'flex',
      margin: '4px 18px 0',
      // marginBottom: '29px',
      justifyContent: 'flex-start'
   },
   right_drawer_paper: {
      position: 'relative',
      width: '560px',
      marginLeft: '-2.1px'
   },
   right_drawer: {
      height: '630px',
      // marginTop: '-px',
      right: 0,
      position: 'relative',
      background: theme.palette.common.white,
      display: 'flex',
      textAlign: 'left',
      borderLeft: `1px solid ${theme.palette.borderColor}`
      // padding: theme.spacing(1.5)
   },
   drawer_float_icon: {
      marginLeft: '-22px',
      position: 'relative',
      top: '12px',
      right: '-10px',
      zIndex: 1,
      background: theme.palette.common.white,
      borderRadius: '50%',
      border: `1px solid ${theme.palette.borderColor}`,
      width: '24px',
      textAlign: 'center',
      height: '24px',
      display: 'grid',
      placeItems: 'center',
      '& .MuiSvgIcon-root': {
         width: '12px',
         height: '12p'
      }
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
   marginLeftIconStyle: {
      marginLeft: theme.spacing(3.5)
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
      maxHeight: '152px',
      overflowY: 'auto'
   },
   joinedBar: {
      height: '25px',
      width: '82%',
      display: 'flex',
      justifyContent: 'space-between',
      border: `1px solid ${theme.palette.borderColor}`,
      borderRadius: '.2em',
      padding: '0 10px',
      // marginTop: '10px',
      verticalAlign: 'center'
   },
   multiSelectBox: {
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      height: 100,
      width: 100,
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
      width: '100px',
      height: '100px',
      marginLeft: 'auto',
      marginRight: 'auto',
      top: '30%'
   },
   multiSelectText: {
      border: `2px dotted ${theme.palette.borderColor}`,
      padding: '30px 20px',
      borderRadius: '50px',
      width: '100px',
      height: '100px',
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
   },
   join_condition_row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   join_condition: {},
   join_condition_table: {
      minHeight: '160px'
   },
   tableCellStyle: {
      borderBottom: 'none'
   },
   search_box: {
      width: '250px',
      margin: 'auto'
   }
}))

const StyledTableCell = withStyles(theme => ({
   sizeSmall: {
      padding: '6px 24px 6px 0px'
   }
}))(TableCell)

const operatorsList = [
   {
      value: '=',
      label: '='
   },
   {
      value: '<',
      label: '<'
   },
   {
      value: '>',
      label: '>'
   },
   {
      value: '>=',
      label: '>='
   },
   {
      value: '<=',
      label: '<='
   }
]

const keysList = [
   {
      value: 'AND',
      label: 'AND'
   },
   {
      value: 'OR',
      label: 'OR'
   },
   {
      value: 'NOT',
      label: 'NOT'
   },
   {
      value: 'SOME',
      label: 'SOME'
   },
   {
      value: 'ANY',
      label: 'ANY'
   }
]

const condition_join_data = {
   field1: '',
   field2: '',
   operator: '=',
   join_key: null
}

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
      onChangeTableHandler = null,
      switchValue = null,
      handleChangeInputButton = null,
      loading = false,
      t
   } = props
   const onSearchSubmit = data => {
      onChangeTableHandler('search', data.searchString.trim())
   }
   return (
      <Sidebar style={{ flex: 1 }}>
         <div className={classes.left_grid_container}>
            <Typography
               variant='h5'
               style={{ marginBottom: '11px', padding: '0 19px' }}
            >
               {t('bam:DATA_TABLE_SELECTION')}
            </Typography>
            <div style={{ paddingLeft: '20px', paddingRight: '25px' }}>
               <SearchBox
                  width='245px'
                  name='table_search'
                  onSearchSubmit={onSearchSubmit}
                  clearSearchResult={() => onChangeTableHandler('search', '')}
                  height='14px !important'
                  background='#f8f8f8 !important'
               />
            </div>

            {loading ? (
               <div style={{ height: '100%', width: '280px' }}>
                  <Spinner />
               </div>
            ) : (
               <TableList
                  dropitemlist={dropitemlist}
                  tableList={tableList}
                  getTableDataRes={props.getTableDataRes}
                  switchValue={!switchValue}
                  handleChangeInputButton={handleChangeInputButton}
               />
            )}
            {next ? (
               <Button
                  color='primary'
                  variant='contained'
                  onClick={() => onChangeTableHandler('next')}
                  style={{ margin: ' 0 10px', alignSelf: 'auto' }}
               >
                  {t('bam:LOAD_MORE')}
               </Button>
            ) : null}
         </div>
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
                           disableGutters={true}
                           style={
                              !EnableKey
                                 ? {
                                      backgroundColor: '#FF66001A',
                                      color: '#000',
                                      fontWeight: 600,
                                      padding: '2px 19px',
                                      opacity: '1'
                                   }
                                 : { padding: '2px 19px' }
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
                           disableGutters={true}
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
      checboxDisable = true,
      dropitemlist = []
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

   const onSearchSubmit = data => {
      onChangeColumnHandler('search', data.searchString.trim())
   }

   const onChangeColumnHandler = (key, params) => {
      setColumnInput({ ...columnInput, opt: 0, prefix: params })
   }

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
         style={data.checked ? { boxShadow: `0 0 2px 1px #0072C6` } : null}
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
               {/* {!data.joined ? (
                  <IconsButton
                     className={classes.marginLeftStyle}
                     type='AccountTreeIcon'
                     onClick={() => onRemoveItem(data.table_name)}
                  />
               ) : null} */}
               <IconsButton
                  className={classes.marginLeftIconStyle}
                  type='CloseIcon'
                  onClick={() => onRemoveItem(data.table_name)}
               />
               {/* <Checkbox
                  value={data.id}
                  onChange={onSelect}
                  checked={selectedList.includes(data.id)}
                  style={{ marginTop: '-5px' }}
               /> */}
            </div>
            {/* <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/eye.svg`} /> */}
         </div>
         <div className={classes.cardContainerContent}>
            <SearchBox
               width='220px'
               name='column_search'
               onSearchSubmit={onSearchSubmit}
               clearSearchResult={() => onChangeColumnHandler('search', '')}
            />

            <div className={classes.cardData}>
               {loading ? (
                  <div>
                     <Spinner msg='' />
                  </div>
               ) : (
                  columnList.map((res, key) => {
                     let dropList = [...dropitemlist]
                     let currentIndex = dropList.findIndex(
                        dropItem => dropItem.table_name === data.table_name
                     )
                     return (
                        <div key={key} className={classes.contentCard}>
                           <FormControlLabel
                              value={res.name}
                              control={
                                 <Checkbox
                                    color='primary'
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    checked={
                                       dropitemlist[
                                          currentIndex
                                       ].column_list.filter(
                                          result =>
                                             result.name.split('.')[1] ===
                                             res.name
                                       ).length > 0
                                    }
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
                              {TypeConversion(res.type)}
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
   const { isChecked, t } = props
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
               <Typography variant='h5' className={classes.multiSelectText}>
                  {t('bam:CLICK_TO_SLECT')}
               </Typography>
            )}
         </div>
      </Paper>
   )
}
const CardsContainer = React.memo(function CardsContainer(props) {
   const {
      dropitemlist = [],
      finalJoinedList = [],
      isMultiSelect = false,
      onSelect = null,
      onRemoveItem = null,
      onColumnSelect = null,
      t
   } = props

   return (
      <Grid container spacing={2}>
         {dropitemlist.map((res, key) => {
            return (
               <Grid item key={key} style={{ position: 'relative' }}>
                  <CardContainer
                     data={res}
                     dropitemlist={dropitemlist}
                     onRemoveItem={onRemoveItem}
                     onColumnSelect={onColumnSelect}
                     // checboxDisable={
                     //    !finalJoinedList.filter(
                     //       result => result.table_name === res.table_name
                     //    ).length > 0
                     // }
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
                        checkedIcon={<MultiSelectBox isChecked={true} t={t} />}
                        icon={<MultiSelectBox isChecked={false} t={t} />}
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
      finalJoinedList = [],
      setFuncitonJoinedList = null,
      expression = '',
      t
   } = props
   const [isMultiSelect, setMultiSelect] = useState(false)
   const [showJoinBar, setShowJoinBar] = useState(false)
   // const [joinedList, setJoinedList] = useState([])
   const [selectedList, setSelectedList] = useState([])

   const [currentIndexForJoin, setIndexForJoinedData] = useState(0)

   const setIndexForJoin = index => {
      setIndexForJoinedData(index)
   }

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

   const [activeJoin, setActiveJoin] = useState({})

   const addActiveJoin = join => {
      setActiveJoin(join)
   }

   const handleJoin = () => {
      let joined_data = dropitemlist.filter(res => res.checked)
      let objJoinData = {}
      objJoinData.join_data = joined_data
      objJoinData.join_condition = [condition_join_data]
      setActiveJoin(objJoinData)
      setIndexForJoin(finalJoinedList.length === 0 ? 0 : finalJoinedList.length)
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
            {
               ...columnData,
               name: `${tableData.table_name}.${columnData.name}`,
               display_name: columnData.name
            }
         ]
         if (Object.keys(activeJoin).length !== 0) {
            let activeIndex = activeJoin.join_data.findIndex(
               res => res.table_name === tableData.table_name
            )
            activeJoin.join_data[activeIndex].column_list = [
               ...activeJoin.join_data[activeIndex].column_list,
               {
                  ...columnData,
                  name: `${tableData.table_name}.${columnData.name}`,
                  display_name: columnData.name
               }
            ]
         }
      } else {
         data[currentIndex]['column_list'] = data[currentIndex][
            'column_list'
         ].filter(res => res.name.split('.')[1] !== columnData.name)
         if (Object.keys(activeJoin).length !== 0) {
            let activeIndex = activeJoin.join_data.findIndex(
               res => res.table_name === tableData.table_name
            )
            activeJoin.join_data[
               activeIndex
            ].column_list = activeJoin.join_data[
               activeIndex
            ].column_list.filter(
               res => res.name.split('.')[1] !== columnData.name
            )
         }
      }
      changeDropList(data)
   }

   const deleteJoin = index => {
      setFuncitonJoinedList(finalJoinedList.splice(index, 1))
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
            {/*<div className={classes.customSwitch}>
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
            </div>*/}
            {switchValue ? (
               <Fragment>
                  <div style={{ display: 'flex' }}>
                     <div className={classes.right_container}>
                        <div className={classes.toolbar}>
                           <Button
                              onClick={handleMultiSelect}
                              disabled={!disableButtons}
                              startIcon={
                                 <LayersIcon disabled={!disableButtons} />
                              }
                              color='primary'
                           >
                              {t('bam:MULTISELECT')}
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
                              {t('bam:JOIN_TABLES')}
                           </Button>
                           <Button
                              color='primary'
                              startIcon={
                                 <DeleteOutlineIcon disabled={!disableDelete} />
                              }
                              disabled={!disableDelete}
                              onClick={onRemoveMultiple}
                           >
                              {t('bam:BUTTON_DELETE')}
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
                                 <Typography
                                    variant='subtitle1'
                                    style={{ color: '#767676' }}
                                 >
                                    {t('bam:DRAG_N_DROP_TABLES_HERE')}
                                 </Typography>
                                 <Typography
                                    variant='subtitle1'
                                    style={{
                                       color: '#767676',
                                       marginTop: '0.75rem'
                                    }}
                                 >
                                    {t('bam:TO_JOIN_TABLES_INFO')}
                                 </Typography>
                              </div>
                           ) : (
                              <CardsContainer
                                 t={t}
                                 dropitemlist={dropitemlist}
                                 finalJoinedList={finalJoinedList}
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
                                 finalJoinedList={finalJoinedList}
                                 deleteJoin={deleteJoin}
                                 dropitemlist={dropitemlist}
                                 finalJoinedList={finalJoinedList}
                                 setFuncitonJoinedList={setFuncitonJoinedList}
                                 currentIndexForJoin={currentIndexForJoin}
                                 setIndexForJoin={setIndexForJoin}
                                 activeJoin={activeJoin}
                                 addActiveJoin={addActiveJoin}
                                 t={t}
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
   const {
      t,
      addActiveJoin = null,
      activeJoin = {},
      currentIndexForJoin = 0,
      dropitemlist = [],
      deleteJoin = null,
      setFuncitonJoinedList = null,
      finalJoinedList = []
   } = props
   const classes = useStyle()
   // const [editBox, setEditBox] = useState(true)

   const handleEditing = (index, res) => {
      addActiveJoin(res)
      // setEditBox(!editBox)
      props.setIndexForJoin(index)
   }

   // useEffect(() => {
   //    if (finalJoinedList.length > 0) {
   //       setEditBox(false)
   //    } else {
   //       setEditBox(true)
   //    }
   //    props.setIndexForJoin(finalJoinedList.length - 1)
   // }, [finalJoinedList])

   return (
      <Fragment>
         {Object.keys(activeJoin).length === 0 ? (
            <div
               style={{
                  padding: '12px 20px 40px 20px',
                  zIndex: '1'
               }}
            >
               <Typography variant='h6'>
                  <b>{t('bam:DATA_TABLE_JOINS')}</b>
               </Typography>
               {finalJoinedList.length > 0 ? (
                  finalJoinedList.map((res, key) => (
                     <div
                        style={{
                           display: 'flex',
                           justifyContent: 'space-between',
                           alignItems: 'center',
                           marginTop: '10px'
                        }}
                        key={key}
                     >
                        <div className={classes.joinedBar}>
                           {res.join_data.map((result, key1) => (
                              <Typography variant='subtitle1' key={key1}>
                                 {result.table_name}
                              </Typography>
                           ))}
                        </div>
                        <IconsButton
                           type='EditIcon'
                           onClick={() => handleEditing(key, res)}
                        />
                        <img
                           src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`}
                           onClick={() => deleteJoin(key, res)}
                        />
                     </div>
                  ))
               ) : (
                  <Typography variant='subtitle1'>
                     {t('bam:NO_JOINS_DONE')}
                  </Typography>
               )}
            </div>
         ) : (
            <ActiveJoin
               t={t}
               currentIndexForJoin={currentIndexForJoin}
               activeJoin={activeJoin}
               addActiveJoin={addActiveJoin}
               handleEditing={handleEditing}
               setFuncitonJoinedList={setFuncitonJoinedList}
            />
         )}
      </Fragment>
   )
}

const ActiveJoin = props => {
   const classes = useStyle()
   const {
      currentIndexForJoin = 0,
      activeJoin = {},
      addActiveJoin = null,
      handleEditing = null,
      setFuncitonJoinedList = null,
      t
   } = props

   const [snackbarState] = useSelector(state => {
      return [state.snackbarState]
   })

   var sourceJoinFields = []
   var len =
      activeJoin.join_data != null && activeJoin.join_data[0].column_list.length
   for (var i = 0; i < len; i++) {
      sourceJoinFields.push({
         value: activeJoin.join_data[0].column_list[i].name,
         label: activeJoin.join_data[0].column_list[i].name
      })
   }

   var destinationJoinFields = []
   var len =
      activeJoin.join_data != null && activeJoin.join_data[1].column_list.length
   for (var i = 0; i < len; i++) {
      destinationJoinFields.push({
         value:
            activeJoin.join_data != null &&
            activeJoin.join_data[1].column_list[i].name,
         label:
            activeJoin.join_data != null &&
            activeJoin.join_data[1].column_list[i].name
      })
   }

   const [joinCondition, setJoinCondition] = useState(activeJoin.join_condition)

   const addJoinCondition = () => {
      setJoinCondition([...joinCondition, condition_join_data])
   }

   const handleJoinCondition = (e, key) => {
      let indexData = { ...joinCondition[key], [e.target.name]: e.target.value }
      let data = [...joinCondition]
      data[key] = indexData
      setJoinCondition(data)
   }

   const handleJoinType = e => {
      addActiveJoin({ ...activeJoin, join_type: e.target.value })
   }

   useEffect(() => {
      addActiveJoin({ ...activeJoin, join_condition: joinCondition })
   }, [joinCondition])

   const onSaveHandle = () => {
      if (!activeJoin.join_type) {
         snackbarState.openSnackbar(`${t('bam:SPECIFY_JOIN_TYPE')}`, 'error')
         return false
      } else if (
         !activeJoin.join_condition[0].field1 ||
         !activeJoin.join_condition[0].field2 ||
         !activeJoin.join_condition[0].operator
      ) {
         snackbarState.openSnackbar(
            `${t('bam:SPECIFY_JOIN_CONDITION')}`,
            'error'
         )
         return false
      } else {
         setFuncitonJoinedList(activeJoin, currentIndexForJoin)
         addActiveJoin({})
      }
   }

   const onCancelHandler = () => {
      addActiveJoin({})
   }

   return (
      <React.Fragment>
         <div style={{ padding: '12px 20px 40px' }}>
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
                     <b>{t('bam:TABLE_JOINS')}</b>
                  </Typography>
                  <Typography
                     noWrap={true}
                     className={classes.marginLeftStyle}
                     variant='h6'
                  >
                     {activeJoin.join_data.map((el, index) => {
                        return `${el.table_name} ${index === 0 ? ' & ' : ''}`
                     })}
                  </Typography>
               </div>
               <div className={classes.joinEditBar}>
                  <Typography
                     variant='h6'
                     color='textSecondary'
                     style={{ cursor: 'pointer' }}
                     onClick={onCancelHandler}
                  >
                     {t('bam:LABEL_CANCEL')}
                  </Typography>
                  <Typography
                     className={classes.marginLeftStyle}
                     variant='h6'
                     color='primary'
                     onClick={onSaveHandle}
                     style={{ cursor: 'pointer' }}
                  >
                     {t('bam:BUTTON_SAVE')}
                  </Typography>
               </div>
            </div>
            <div className={classes.joinType}>
               <Typography variant='subtitle1'>
                  <b>{t('bam:JOIN_TYPE')}:</b>
               </Typography>
               <SelectBox
                  style={{ width: '420px' }}
                  onChange={handleJoinType}
                  value={activeJoin.join_type}
                  list={[
                     {
                        value: 'No Join',
                        label: `${t('bam:NO_JOIN')}`
                     },
                     {
                        value: 'INNER JOIN',
                        label: `${t('bam:INNER_JOIN')}`
                     },
                     {
                        value: 'LEFT JOIN',
                        label: `${t('bam:LEFT_JOIN')}`
                     },
                     {
                        value: 'RIGHT JOIN',
                        label: `${t('bam:RIGHT_JOIN')}`
                     },
                     {
                        value: 'FULL OUTER JOIN',
                        label: `${t('bam:FULL_OUTER_JOIN')}`
                     }
                  ]}
               />
            </div>
            <div className={classes.joinType}>
               <Typography variant='subtitle1' color='textSecondary'>
                  <b>{t('bam:FIELD_MATCHING')}</b>
               </Typography>
               <IconsButton
                  color='primary'
                  type='AddIcon'
                  onClick={addJoinCondition}
               />
            </div>
            <div className={classes.join_condition}>
               <TableContainer className={classes.join_condition_table}>
                  <Table aria-label='simple table'>
                     <TableHead>
                        <TableRow>
                           <StyledTableCell>
                              {t('bam:SOURCE_FIELD')}
                           </StyledTableCell>
                           <StyledTableCell align='left'>
                              {t('bam:OPERATOR')}
                           </StyledTableCell>
                           <StyledTableCell align='left'>
                              {t('bam:JOIN_FIELD')}
                           </StyledTableCell>
                           <StyledTableCell align='left'>
                              {t('bam:KEY')}
                           </StyledTableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {joinCondition &&
                           joinCondition.map((res, key) => {
                              return (
                                 <TableRow key={key}>
                                    <StyledTableCell
                                       className={classes.tableCellStyle}
                                    >
                                       <SelectBox
                                          style={{ width: '160px' }}
                                          name='field1'
                                          list={sourceJoinFields}
                                          value={res.field1}
                                          onChange={e =>
                                             handleJoinCondition(e, key)
                                          }
                                       />
                                    </StyledTableCell>
                                    <StyledTableCell
                                       align='left'
                                       className={classes.tableCellStyle}
                                    >
                                       <SelectBox
                                          name='operator'
                                          list={operatorsList}
                                          value={res.operator}
                                          onChange={e =>
                                             handleJoinCondition(e, key)
                                          }
                                       />
                                    </StyledTableCell>
                                    <StyledTableCell
                                       align='left'
                                       className={classes.tableCellStyle}
                                    >
                                       <SelectBox
                                          style={{ width: '160px' }}
                                          name='field2'
                                          value={res.field2}
                                          list={destinationJoinFields}
                                          onChange={e =>
                                             handleJoinCondition(e, key)
                                          }
                                       />
                                    </StyledTableCell>
                                    <StyledTableCell
                                       align='left'
                                       className={classes.tableCellStyle}
                                    >
                                       <SelectBox
                                          name='join_key'
                                          value={res.join_key}
                                          list={keysList}
                                          onChange={e =>
                                             handleJoinCondition(e, key)
                                          }
                                       />
                                    </StyledTableCell>
                                 </TableRow>
                              )
                           })}
                     </TableBody>
                  </Table>
               </TableContainer>
            </div>
         </div>
         <Grid
            container
            direction='row'
            justify='flex-start'
            alignItems='flex-start'
            className={classes.tableTopBar}
            style={{ borderTop: '1px solid lightgray' }}
         >
            <Typography variant='h6'>
               <b>{t('bam:DATA_VIEW')}</b>
            </Typography>
         </Grid>
         <div>
            <Grid container spacing={0}>
               {activeJoin.join_data
                  // finalJoinedList[currentIndexForJoin].join_data
                  .map((res, key) => (
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
                                       {res.column_list //    )[0] //          res.table_name //          result.table_name === //       result => //    .filter( // dropitemlist
                                          .map((row, i) => (
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
   )
}

function Home(props) {
   const classes = useStyle()
   const { onPreviousHandler = null, onNextHandler = null } = props

   const [
      store,
      dialogState,
      snackbarState,
      fullDialog,
      globalSetting
   ] = useSelector(state => {
      return [
         state.createReportState,
         state.normalDialogState,
         state.snackbarState,
         state.fullDialogState,
         state.globalSettings
      ]
   })

   const { t } = useTranslation(globalSetting.locale_module)

   const [dropitemlist, setDropItemList] = useState(store.table_list)
   const [finalJoinedList, setFinalJoinedList] = useState(store.joined_list)
   const [tableData, setTableData] = useState([])
   const [enableNext, setEnableNext] = useState(false)
   const [isLoading, setIsLoading] = useState({ msg: '', loading: true })
   const [expression, setExpression] = useState('')
   const [paginateValue, setPaginateValue] = useState({
      last_index: '',
      last_value: ''
   })
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
               setPaginateValue({
                  last_value: response.data.last_value,
                  last_index: response.data.last_index
               })
               setTableData(
                  tableList.map(res => {
                     return {
                        ...res,
                        checked: false,
                        column_list: [],
                        with_no_lock: false
                     }
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
            button_label={t('bam:YES_CHANGE_IT')}
            title={t('bam:CHANGE_INPUT_TYPE_MESSAGE')}
            description={t('bam:CHANGE_INPUT_TYPE_MESSAGE_DESCRIPTION')}
            action={() => {
               dispatch(CreateReport({ ...reportStore, current_step: 0 }))
               onPreviousHandler(0)
            }}
         />,
         ''
      )
   }
   const onNext = () => {
      // let feilds = [];
      //    dropitemlist.map((item, index) => {
      //    feilds.push(...item.column_list)
      // })

      // dispatch(CreateReport({ ...reportStore, current_step: 2, field: feilds  }))
      // onNextHandler(2)
      let isJoinedAction = false
      let toValidate = false
      dropitemlist.map((res, key) => {
         if (res.joined) {
            isJoinedAction = true
         } else if (!res.joined && res.column_list.length > 0) {
            isJoinedAction = true
         } else if (res.joined && res.column_list.length > 0) {
            toValidate = true
         } else {
            isJoinedAction = false
         }
      })

      if (dropitemlist.length <= 0) {
         snackbarState.openSnackbar(
            `${t('bam:NO_SELECTED_TEABLE_ERROR')}`,
            'error'
         )
         return false
      }
      //  else if (finalJoinedList.length <= 0) {
      //    snackbarState.openSnackbar('Plese specify some valid joins to proceed.', 'error');
      //    return false

      // }
      else if (finalJoinedList.length > 0) {
         let inputJson = {
            flag: '7',
            joined_list: finalJoinedList,
            table_list: dropitemlist
         }
         let feilds = []
         dropitemlist.map((item, index) => {
            feilds.push(...item.column_list)
         })
         let final_field = feilds.map(field => ({ ...field, field_type: 'C' }))
         ValidateQuery(inputJson)
            .then(res => {
               if (res != null && res.status.maincode === '0') {
                  dispatch(
                     CreateReport({
                        ...reportStore,
                        current_step: 2,
                        joined_list: finalJoinedList,
                        table_list: dropitemlist,
                        field: final_field
                     })
                  )
                  onNextHandler(2)
               } else {
                  snackbarState.openSnackbar(
                     `${t('bam:ERROR')}: ${res.status.description}`,
                     'error'
                  )
               }
            })
            .catch(err => {})
      } else if (!isJoinedAction) {
         snackbarState.openSnackbar(
            `${t('bam:NO_FIELD_SELECTED_ERROR')}`,
            'error'
         )
         return false
      } else if (!toValidate) {
         let feilds = []
         dropitemlist.map((item, index) => {
            feilds.push(...item.column_list)
         })
         let final_field = feilds.map(field => ({ ...field, field_type: 'C' }))
         dispatch(
            CreateReport({
               ...reportStore,
               current_step: 2,
               field: final_field,
               table_list: dropitemlist
            })
         )
         onNextHandler(2)
      } else {
         console.log('end')
      }
   }
   const onChangeTableHandler = (key, params) => {
      switch (key) {
         case 'next':
            setTableInput({ ...tableInput, opt: 1, ...paginateValue })
            break
         case 'search':
            setTableData([])
            setTableInput({
               ...tableInput,
               opt: 0,
               next_value: '',
               next_index: '',
               prefix: params
            })
            break
         default:
            break
      }
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

   const setFuncitonJoinedList = (data, index) => {
      let final = [...finalJoinedList]
      final[index] = data
      setFinalJoinedList(final)
   }

   const onCancel = () => {
      dialogState.openDialog(
         <Confirmation
            button_label={` ${t('bam:YES')} `}
            title={t('bam:CANCEL_THE_PROCESS_CONFIRMATION')}
            description={t('bam:LOSE_ALL_CONFIG_MESSAGE')}
            action={() => {
               dispatch(
                  CreateReport({ ...CreateUpdateReportInput.custom_report })
               )
               fullDialog.closeDialog()
            }}
         />,
         ''
      )
   }

   return (
      <React.Fragment>
         <div style={{ height: 'calc(100% - 93px)' }}>
            <Grid
               container
               //    alignItems='center'
               justifyContent='center'
               className={classes.grid_container}
            >
               <Grid item style={{ flexBasis: '280px', display: 'flex' }}>
                  {
                     <LeftContainer
                        dropitemlist={dropitemlist}
                        tableList={tableData}
                        next={enableNext}
                        onChangeTableHandler={onChangeTableHandler}
                        switchValue={switchValue}
                        toggleSwitchChecked={toggleSwitchChecked}
                        handleChangeInputButton={handleChangeInputButton}
                        loading={loading}
                        t={t}
                     />
                  }
               </Grid>
               <Grid item style={{ flex: 1 }}>
                  <RightContainer
                     t={t}
                     dropitemlist={dropitemlist}
                     onDrop={onDrop}
                     onRemoveItem={onRemoveItemHandler}
                     onRemoveMultiple={onRemoveMultipleHandler}
                     changeDropItem={onChangeItemHandler}
                     changeDropList={changeDropList}
                     switchValue={switchValue}
                     toggleSwitchChecked={toggleSwitchChecked}
                     expression={expression}
                     finalJoinedList={finalJoinedList}
                     setFuncitonJoinedList={setFuncitonJoinedList}
                  />
               </Grid>
            </Grid>
            <FixedFooter>
               <Grid container spacing={2} justify='flex-end'>
                  <Grid item>
                     <Button
                        color='primary'
                        variant='outlined'
                        onClick={onCancel}
                     >
                        {t('bam:LABEL_CANCEL')}
                     </Button>
                  </Grid>
                  <Grid item>
                     <Button
                        color='secondary'
                        variant='outlined'
                        onClick={onPrevious}
                     >
                        {t('bam:BUTTON_PREVIOUS')}
                     </Button>
                  </Grid>
                  <Grid item>
                     <Button
                        type='button'
                        color='primary'
                        variant='contained'
                        onClick={onNext}
                     >
                        {t('bam:BUTTON_NEXT')}
                     </Button>
                  </Grid>
               </Grid>
            </FixedFooter>
         </div>
      </React.Fragment>
   )
}

export default Home
