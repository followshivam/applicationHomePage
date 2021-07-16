import React,{useEffect,useState} from 'react';
import {Paper,Button,Checkbox,ListItemText,ListItemIcon,ListItem,List,Grid,makeStyles,Spinner} from 'component';
import axios from 'axios';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 300,
    height: 330,
    border:"5px solid #f8f8f8",
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  gutter:{
      paddingLeft:0
  }
}));


export default function Wizard(props) {
  const classes = useStyles();
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [loader,setLoader]=useState(true)
 const [page,setPage]=useState(1)
  useEffect(()=>{
      getData();
  },[page]);
  const getData=()=>{
      setLoader(true);
      axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${page}`).then((res)=>{
        //   let leftData=[...left];
        //   let data=res.data.map((result)=>{return({...result,checked:false})})
        //   setLeft(left.concat(data));
          setLeft(res.data.map((result)=>{return({...result,checked:false})}))
          setTimeout(()=>setLoader(false),1000);
      }).catch((err)=>{

      })
  }
  const handleToggle = (type,value) => () => {
           const currentIndex=left.findIndex((res)=>res.id==value.id);
            const leftData = [...left];
            leftData[currentIndex]={...left[currentIndex],checked:!left[currentIndex].checked};
            let rightData=leftData.filter((res)=>res.checked)
            setLeft(leftData);
            setRight(right.concat(rightData));
  };
console.log(right)
  const handleAllRight = () => {
    setLeft(left.map((res)=>{return({...res,checked:true})}));
    setRight(left.map((res)=>{return({...res,checked:true})}));
  };


  const handleAllLeft = () => {
    setLeft(left.map((res)=>{return({...res,checked:false})}));
    setRight([]);
  };

  const customList = (type,items) => (
      <div>
    <Paper className={classes.paper}>
      {loader?<Spinner msg=""/>:<List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(type,value)} classes={{gutters:classes.gutter}}>
            
                <Checkbox
                  checked={value.checked}
                  tabIndex={-1}
                  size="small"
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                
              <ListItemText id={labelId} primary={value.email} primaryTypographyProps={{variant:"subtitle2"}} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>}
    </Paper>
    {type=="left"&&<div style={{}}><button onClick={()=>setPage(page+1)}>get</button></div>}
    </div>
  );

  return (
    <Grid container spacing={10} justify="center" alignItems="center" className={classes.root}>
      <Grid item>{customList("left",left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllRight}
             disabled={left.length === right.length}
            aria-label="move all right"
          >
            ≫
          </Button>
          {/*<Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            // disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>*/}
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList("right",right)}</Grid>
    </Grid>
  );
}
