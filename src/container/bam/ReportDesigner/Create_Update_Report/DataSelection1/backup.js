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
   TableContainer
} from 'component'
import { GetTableData } from 'global/bam/api/ApiMethods'
import { useDispatch, useSelector } from "react-redux";
import { CreateReport } from "redux/action";
const useStyle = makeStyles(theme => ({
   grid_container: { marginTop: 50, background: 'white' },
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
      zIndex:0,
      // '& .PrivateSwitchBase-root-38': {
      //    padding: 3
      // }
   },
   cardContainerContent: {
      padding: theme.spacing(1)
   },
   right_container_root: {
      display: 'flex',
      backgroundColor: theme.palette.backgroundContainer
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
      marginLeft: theme.spacing(3.5),
      display: 'flex',
      width: '350px',
      // padding: theme.spacing(1.2),
      justifyContent: 'flex-start'
   },
   right_drawer_paper: {
      position: 'relative',
      width: '540px'
   },
   right_drawer: {
      height: '630px',
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
     position: "relative",
    
      background: '#FFFFFF',
           height: 245,
      width: 240,
      // width: '245px',
      opacity: 0.8,
      //  marginTop: -245,
      top:0,
      //right: 0,
      textAlign: 'center',
  cursor: "pointer",
    //  paddingTop: '26%'
   },
   multiSelectCheckBox: {
     
      border: `2px dotted ${theme.palette.borderColor}`,
      padding: '20px',
      borderRadius: '50px',
      width: '50px',
      height: '50px',
           position: "absolute",
                marginLeft: 'auto',
      marginRight: 'auto'
   },
   multiSelectText: {
         position: "absolute",
      border: `2px dotted ${theme.palette.borderColor}`,
      padding: '20px',
      borderRadius: '50px',
      width: '50px',
      height: '50px',
      marginLeft: 'auto',
      marginRight: 'auto'
   }
}))

const LeftContainer = React.memo(function LeftContainer(props) {
   const classes = useStyle()
   const { dropitemlist = [], tableList = [],next=false,onNext=null } = props
   return (
      <Sidebar>
         <Typography variant='caption'>Data Table Selection </Typography>
         <SearchBox size='medium' />

         <TableList
            dropitemlist={dropitemlist}
            tableList={tableList}
            getTableDataRes={props.getTableDataRes}
         />
                     {next?<Button
               color='primary'
               variant='contained'
               onClick={onNext}
            >
               Load More
            </Button>:null}
      </Sidebar>
   )
})
const TableList = props => {
   const classes = useStyle()
   const { tableList = [], dropitemlist = [] } = props
   const onDragStart = (e, res) => {
      e.dataTransfer.setData('id', JSON.stringify(res))
   }
   const enableKey = res => {
      // console.log(dropitemlist);
      // console.log(dropitemlist.filter((result)=> result.id==res.id).length==0)
      return (
         dropitemlist.filter(result => result.TableName == res.TableName)
            .length == 0
      )
   }
   return (
      <div className={classes.sidebar_list}>
         <List>
            {tableList.map((res, key) => {
               let EnableKey = enableKey(res)
               return (
                 <Tooltip title={res.TableName} arrow key={key}>
                  <ListItem
                     dense={true}
                     draggable={EnableKey}
                     onDragStart={e => onDragStart(e, res)}
                     value={key}
                     button={true}
                     disabled={!EnableKey}
                     style={
                        !EnableKey ? { backgroundColor: '#FF66001A' } : null
                     }
                  >
                     <ListItemIcon classes={{ root: classes.MuiListItemIcon }}>
                        <TableChartIcon size='small' />
                     </ListItemIcon>

                     <Typography variant='subtitle1' noWrap={true} >
                        {res.TableName}
                     </Typography>
                  </ListItem>
                  </Tooltip>
               )
            })}

         </List>
      </div>
   )
}
const CardContainer = React.memo(function CardContainer(props) {
   const classes = useStyle()
   const {
      data = null,
      onRemoveItem=null,
      onColumnSelect=null,
      checboxDisable=true,
      isCheckedStatus=false
   } = props
   const [columnList, setColumnList] = useState([]);
    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
    const {loading,msg}=isLoading;
   const [columnInput,setColumnInput]=useState({
         opr: 2,
         opt: 0,
         sort_order: 'A',
         prefix: '',
         batch_size: 20,
         column_name: '',
         table_name: data.TableName
      })

   useEffect(() => {
       getTableData();
   }, [columnInput])

   const getTableData= () => {
     setIsLoading({...isLoading,loading:true})
      GetTableData(columnInput)
         .then(response => {
            if (response != null) {
               setColumnList(response.data.Fields)
               setTimeout(()=>setIsLoading({...isLoading,loading:false}),500)
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
                     style={{width:"140px"}}
                  >
                     {data.TableName}
                  </Typography>
                  <IconsButton
                     className={classes.marginLeftStyle}
                     type='AccountTreeIcon'
                     onClick={() => onRemoveItem(data.TableName)}
                  />
                  {/* <Checkbox
                  value={data.id}
                  onChange={onSelect}
                  checked={selectedList.includes(data.id)}
                  style={{ marginTop: '-5px' }}
               /> */}
               </div>
               <img src='icons/eye.svg' />
            </div>
            <div className={classes.cardContainerContent}>
               <SearchBox size='small' />
               <div className={classes.cardData}>
                  {loading?<div><Spinner msg=""/></div>:columnList.map((res, key) => {

                        return (
                           <div key={key} className={classes.contentCard}>
                              <FormControlLabel
                                 value={res.Name}
                                 control={
                                    <Checkbox
                                       color='primary'
                                       disableRipple={true}
                                       disableFocusRipple={true}
                                       disabled={checboxDisable}
                                       checked={isCheckedStatus(res,data)}
                                       onChange={(e)=>onColumnSelect(e,res,data)}
                                    />
                                 }
                                 label={res.Name}
                                 labelPlacement='end'
                                 classes={{ label: classes.checkbox_label }}
                                 style={{ marginTop: '-10px' }}
                              />
                              <Typography
                                 variant='subtitle1'
                                 color='textSecondary'
                              >
                                 {res.Type}
                              </Typography>
                           </div>
                        )
                     })}
               </div>
            </div>
      </Paper>
   )
})
const MultiSelectBox=(props)=>{
  const classes=useStyle();
  const {isChecked}=props;
  return(      <Paper
        //  style={isChecked ? { boxShadow: `0 0 2px 1px orange` } : null}
        //  elevation={isCheckBox ? 0 : 1}
      ><div className={classes.multiSelectBox}>
                  {isChecked ? (
                     <IconsButton
                        type='CheckIcon'
                        fontSize='large'
                        color='primary'
                        className={classes.multiSelectCheckBox}
                     />
                  ) : (
                     <Typography
                        variant='h6'
                        className={classes.multiSelectText}
                     >
                        Click to select
                     </Typography>
                  )}
               </div></Paper>)
}
const CardsContainer=React.memo(function CardsContainer(props){
  const {dropitemlist=[],joinedList=[],isMultiSelect=false,onSelect=null,onRemoveItem=null,onColumnSelect=null,isCheckedStatus=null}=props;

  return( 
                     <Grid container spacing={2}>{
                           dropitemlist.map((res, key) => {
                             return(<Grid item key={key}>
                                       <CardContainer
                                          data={res}
                                          onRemoveItem={onRemoveItem}
                                          onColumnSelect={onColumnSelect}
                                          checboxDisable={!joinedList.filter((result)=>result.TableName===res.TableName).length>0}
                                          isCheckedStatus={isCheckedStatus}
                                       />
                                       {isMultiSelect && <Checkbox
                                          disableRipple
                                          color='default'
                                         checked={res.checked}
                                          checkedIcon={
                                             <MultiSelectBox
                                                isChecked={true}
                                             />
                                          }
                                          icon={
                                             <MultiSelectBox
                                                isChecked={false}
                                             />
                                          }
                                          inputProps={{
                                             'aria-label': 'decorative checkbox'
                                          }}
                                          {...props}
                                          onChange={e => {onSelect(e, res)}}
                                       />}
                                 </Grid>)
                             
                           })}
                     </Grid>
)
});
const RightContainer = props => {
   const classes = useStyle()

   const { onDrop = null, dropitemlist = [],onRemoveItem=null,onRemoveMultiple=null,changeDropItem=null } = props
   const [isMultiSelect, setMultiSelect] = useState(false)
   const [showJoinBar, setShowJoinBar] = useState(false);
   const [joinedList,setJoinedList]=useState([])

   useEffect(()=>{
     let checkSelected=dropitemlist.length<2;
     setJoinedList(joinedList.filter((res)=>dropitemlist.findIndex((result)=>result.TableName===res.TableName)>=0))
     if(checkSelected)
     {
       setMultiSelect(false);
     }
   },[dropitemlist])
      const handleMultiSelect = () => {
        let checkStatus=dropitemlist.filter((res)=>res.checked===true).length===0
        if(checkStatus)
        {
          setJoinedList([]);
        }
      setMultiSelect(!isMultiSelect)
   }

   const handleJoin = () => {
     setJoinedList(dropitemlist);
     setMultiSelect(!isMultiSelect)
      setShowJoinBar(true);
   }
   const selectColumnHandler=(e,columnData,tableData)=>{
     let data=[...joinedList];
     let currentIndex=data.findIndex((res)=>res.TableName===tableData.TableName);
     if(e.target.checked)
     {
       data[currentIndex]["column_list"]=[...data[currentIndex]["column_list"],columnData]
     }
     else{
       data[currentIndex]["column_list"]=data[currentIndex]["column_list"].filter((res)=>res.Name!==columnData.Name)
     }
     setJoinedList(data)
   }
   const isCheckedStatus=(res,data)=>{
    const index=joinedList.findIndex((result)=>result.TableName===data.TableName);
    if(index!==-1)
    {
          let cloneData=[...joinedList];
    return cloneData[index]["column_list"].filter((result)=>result.Name===res.Name).length>0
    }
    else{
      return false;
    }
   }
const disableButtons=dropitemlist.length>1;
const disableDelete=isMultiSelect && dropitemlist.filter((res)=>res.checked===true).length>0;
const disabelJoin=isMultiSelect && dropitemlist.filter((res)=>res.checked==true).length>1
   return (
      <React.Fragment>
         <div className={classes.right_container_root}>
            <div className={classes.right_container}>
               <div className={classes.toolbar}>
                 
                  <Button
                     onClick={handleMultiSelect}
                     disabled={!disableButtons}
                     startIcon={<IconsButton type='TableChartIcon'    color="primary" disabled={!disableButtons}/>}
                     color="primary"
                  >
                     MultiSelect
                  </Button>
                  <Button
                     onClick={handleJoin}
                     color="primary"
                     startIcon={
                        <IconsButton
                           type='AccountTreeIcon'
                           color="primary"
                           disabled={!disabelJoin}
                        />
                     }
                     disabled={!disabelJoin}
                  >
                     Join Tables
                  </Button>
                  <Button color="primary"  startIcon={<DeleteOutlineIcon  disabled={!disableDelete}/>}  disabled={!disableDelete} onClick={onRemoveMultiple}>Delete</Button>
               </div>
               <div
                  className={classes.table_grid_container}
                  onDragOver={e => {
                     e.preventDefault()
                  }}
                  onDrop={onDrop}
               >
                  {dropitemlist && dropitemlist.length === 0 ? (
                     <React.Fragment>
                        <Typography variant='h6' color='textSecondary'>
                           Drag and Drop a table here.
                        </Typography>
                        <Typography variant='h6' color='textSecondary'>
                           To Join Tables, Use MultiSelect option to select
                           tables and click on join
                        </Typography>
                     </React.Fragment>
                  ) :<CardsContainer dropitemlist={dropitemlist} joinedList={joinedList} isCheckedStatus={isCheckedStatus} onColumnSelect={selectColumnHandler} isMultiSelect={isMultiSelect} onSelect={changeDropItem} onRemoveItem={onRemoveItem}/>}
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
                  <Paper elevation={0} className={classes.right_drawer_paper}>
                     <RightDrawerPaper joinedList={joinedList} />
                  </Paper>
               </Slide>
            </div>
         </div>
      </React.Fragment>
   )
}

const RightDrawerPaper = props => {
   const { joinedList =[] } = props
   const classes = useStyle()
   const [editBox, setEditBox] = useState(true)

   const handleEditing = () => {
      setEditBox(!editBox)
   }
   useEffect(()=>{
     if(joinedList.length>0)
     {
       setEditBox(false)
     }
     else{
       setEditBox(true)
     }
   },[joinedList])
  //  let a = joinedList.map(el => el.TableName)
  //  console.log(a)
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
               {joinedList.length>0?<div
                  style={{ justifyContent: 'space-between', display: 'flex' }}
               >
                  <div className={classes.joinedBar}>
                    {/* <Typography variant='h6'>{a[0]}</Typography>
                     <Typography variant='h6'>Data Table Joins</Typography>
                     <Typography variant='h6'>{a[1]}</Typography>*/}
                  </div>
                  <IconsButton type='EditIcon' onClick={handleEditing} />
                  <img src='icons/trash-2.svg' style={{ color: 'red' }} />
               </div>:<Typography variant="subtitle1">No Joins Done</Typography>}
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
                        {joinedList.map((el,index)=>{return(`${el.TableName} ${joinedList.length-1===index?"&":""}`)})}
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
                     <SelectBox style={{ width: '420px' }} list={[
                                          {
                                             value: 'No Join,Individual Addition',
                                             label: 'No Join,Individual Addition'
                                          },
                                           {
                                             value: 'INNER JOIN,Similar records from both tables',
                                             label: 'INNER JOIN,Similar records from both tables'
                                          },
                                           {
                                             value: 'LEFT JOIN,All records from left and similar from right',
                                             label: 'LEFT JOIN,All records from left and similar from right'
                                          },
                                           {
                                             value: 'RIGHT JOIN,All records from right and similar from left',
                                             label: 'RIGHT JOIN,All records from right and similar from left'
                                          },
                                           {
                                             value: 'FULL OUTER JOIN,All record from both tables',
                                             label: 'FULL OUTER JOIN,All record from both tables'
                                          }
                                       ]}/>
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

                                 {/*<Typography variant='subtitle1'>
                                    {a[1]}
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
                     {joinedList.map((res,key)=><Grid item sm={6} key={key}>
                        <Paper className={classes.paperTable} elevation={0}>
                           <Grid
                              container
                              justify='space-between'
                              className={classes.tableTopBar1}
                           >
                              <Typography variant='subtitle1'>
                                 {res.TableName}
                              </Typography>
                              <div></div>
                           </Grid>
                           <div>
                              <TableContainer style={{ maxHeight: '150px' }}>
                                 <Table
                                    className={classes.table}
                                    stickyHeader
                                    aria-label='sticky table'
                                 >
                                    <TableHead>
                                       <TableRow
                                          className={classes.tableHeader}
                                         
                                       >
                                         {res.column_list.map((result,key1)=> <TableCell
                                             className={classes.borderBottom}
                                              key={key1}
                                          >
                                             {result.Name}
                                          </TableCell>)}
                                          
                                       </TableRow>
                                    </TableHead>
                                    <TableBody>
                                       {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                                          (row, i) => (
                                             <TableRow key={i}>
                                                <TableCell
                                                   className={
                                                      classes.borderBottom
                                                   }
                                                   scope='row'
                                                >
                                                   Direct
                                                </TableCell>
                                                <TableCell
                                                   className={
                                                      classes.borderBottom
                                                   }
                                                   align='right'
                                                >
                                                   2400
                                                </TableCell>
                                             </TableRow>
                                          )
                                       )}
                                    </TableBody>
                                 </Table>
                              </TableContainer>
                           </div>
                        </Paper>
                     </Grid>)}
                
                  </Grid>
               </div>
            </React.Fragment>
         )}
      </Fragment>
   )
}


function Home(props) {
   const classes = useStyle();
    const {onPreviousHandler=null,onNextHandler=null}=props;
   const [dropitemlist, setDropItemList] = useState([])
   const [dropItemArray, setDropItemArray] = useState([])
   const [tableData, setTableData] = useState([]);
   const [enableNext,setEnableNext]=useState(false);
  const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
  const [tableInput,setTableInput]=useState({
         opr:"1",
         opt:0,
         sort_order: 'A',
         last_value:"",
         last_index:"",
         prefix: '',
         batch_size: 20,
         column_name: '',
         table_name: ''
      })
  const { loading, msg } = isLoading;
    const store=useSelector(state => {
   return state.createReportState;
  })
  const dialogState=useSelector(state => {
   return state.normalDialogState;
  })
  const [reportStore,setReportStore]=useState(store)
   const dispatch=useDispatch();
   
   useEffect(() => {
      getTableData()
   }, [tableInput])


   const getTableData= () => {
     setIsLoading({...isLoading,loading:true})
      GetTableData(tableInput)
         .then(response => {
            if (response != null) {
              let tableList=tableData.concat(response.data.Tables);
               setTableData(tableList.map((res)=>{return({...res,checked:false,column_list:[]})}));
              setEnableNext(response.data.enablenext);
               setTimeout(()=>setIsLoading({...isLoading,loading:false}),500)
            }
         })
         .catch(err => {})
   }
  const onDrop = e => {
      let data = JSON.parse(e.dataTransfer.getData('id'))
      let isExist = dropitemlist.findIndex(
         result => result.TableName == data.TableName
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
      setDropItemList(dropitemlist.filter(res => res.TableName !== name))
   }
    const onPrevious=()=>{
      dialogState.openDialog(<Confirmation button_label="yes" title="Delete" description="" action={()=>{dispatch(CreateReport({...reportStore,current_step:0}));
        onPreviousHandler(0);}}/>, "")

    }
    const onNext=()=>{
        dispatch(CreateReport({...reportStore,current_step:2}));
        onNextHandler(2)
    }
    const onChangeItemHandler=(e,res)=>{

        let currentIndex=dropitemlist.findIndex((result)=>result.TableName===res.TableName);
        let data=[...dropitemlist]
        data[currentIndex]={...data[currentIndex],checked:e.target.checked}
        setDropItemList(data)
    }
    const onRemoveMultipleHandler=()=>{
      setDropItemList(dropitemlist.filter((res)=>res.checked===false))
    }
   return (
         <React.Fragment>
      <Grid container alignItems='stretch' className={classes.grid_container}>
         <Grid item xs={5} sm={3} lg={2}>
            {loading?(
              <div style={{ height: "480px" }}>
                <Spinner msg={msg} />
              </div>
            ) :<LeftContainer
               dropitemlist={dropitemlist}
               tableList={tableData}
               next={enableNext}
               onNext={() => setTableInput({...tableInput,opt:1})}
            />    }

         </Grid>
         <Grid item xs={7} sm={9} lg={10}>
            <RightContainer
               dropitemlist={dropitemlist}
               onDrop={onDrop}
               onRemoveItem={onRemoveItemHandler}
               onRemoveMultiple={onRemoveMultipleHandler}
               changeDropItem={onChangeItemHandler}
            />
         </Grid>
      </Grid>
                  <FixedFooter>
        <Grid container spacing={2} justify="flex-end">
          <Grid item>
             <Button color="textSecondary" variant="contained">
            Cancel
          </Button>
          </Grid>
              <Grid item>
             <Button color="primary" variant="contained" onClick={onPrevious}>
            Previous
          </Button>
          </Grid>
          <Grid item>
                <Button color="primary" variant="contained" onClick={onNext}>
            Proceed
          </Button>
          </Grid>
        </Grid>
      </FixedFooter>
      </React.Fragment>
   )
}

export default Home
