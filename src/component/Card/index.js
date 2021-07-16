import React from 'react';
import { Typography, Button, CardContent, SimpleCard, CardActions, makeStyles } from 'component';
const useStyles = makeStyles((theme) => ({
  root: {
    width: 233,
    height: 139,
    border: "3px solid #A2A2A2",
    borderRadius: '4px',
  },
  checkedroot: {
    width: 233,
    height: 139,
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: '4px',
    // boxShadow:`1px 1px 1px 0px ${theme.palette.primary.main}`
  }
}));

export default function Card(props) {
  const classes = useStyles();
  const { checked = false } = props;

  return (
    <SimpleCard className={checked ? classes.checkedroot : classes.root} variant="outlined" raised={true}>
      <CardContent>
        <img src={props.image_url} style={{ width: "100px", height: "100px" }} alt="card" />
      </CardContent>
    </SimpleCard>
  );
}
