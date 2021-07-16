import React,{useState} from 'react';
import { Paper,Grid,makeStyles } from 'component';
import FrameCreator from "./frame_creator";
import DefaultLayout from "./default_layout";
import {URL} from "global/url"
const useStyles = makeStyles((theme) => ({
  root: {
    display:"flex",
    flexGrow: 1,
    flexWrap:"wrap",
    marginTop:"1rem"
  },
  paper: {
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height:"400px",
    minWidth:"300px",
    overflow:"auto",
  },
}));

export default function GridView(props) {
  const classes = useStyles();
  const {data=null,value=null}=props;
  const [gridList,setGridList]=useState([
    {
      id:1,
      xs:12,
      lg:6
    },
    {
      id:2,
      xs:12,
      lg:6
    },
    {
      id:3,
      xs:12,
      lg:12
    }
  ]);
  return (
    <div className={classes.root}>
      <Grid container spacing={1} alignContent="center" >
       
        {/*<Grid item xs={12} lg={6}>
          <Paper className={classes.paper}>
          <FrameCreator {...props} host={URL.CLIENT_URL} report_id="11" name={`report_generate_11`} dynamicWidth="690px" dynamicHeight="300px"/>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
            <Paper className={classes.paper}>
          <FrameCreator {...props} host={URL.CLIENT_URL}  report_id="68" name={`report_generate_68`} dynamicWidth="660px" dynamicHeight="335px"/>
          </Paper>
        </Grid>
        <Grid item   xs={12} lg={12}>
            <Paper className={classes.paper}>
          <FrameCreator {...props} host={URL.CLIENT_URL}  report_id="64" name={`report_generate_64`} dynamicWidth="1330px" dynamicHeight="300px"/>
          </Paper>
        </Grid>*/}
           {/*   <Grid item xs={12} lg={6}>
          <Paper className={classes.paper}>
          <FrameCreator {...props} host={URL.CLIENT_URL} report_id="11" name="dashboard"  dynamicHeight="300px"/>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
            <Paper className={classes.paper}>
          <FrameCreator {...props} host={URL.CLIENT_URL}  report_id="68" name="dashboard1"  dynamicHeight="335px"/>
          </Paper>
        </Grid>
        <Grid item   xs={12} lg={12}>
            <Paper className={classes.paper}>
          <FrameCreator {...props} host={URL.CLIENT_URL}  report_id="64" name="dashboard3"  dynamicHeight="335px"/>
          </Paper>
        </Grid>*/}
        {gridList.map((res,key)=>
          <Grid item  xs={res.xs} lg={res.lg} key={key}>
          <Paper className={classes.paper}>
          <DefaultLayout/>
          
          </Paper>
        </Grid>
          )}
      </Grid>
    </div>
  );
}
