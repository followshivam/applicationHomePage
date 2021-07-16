import React from 'react';
import {makeStyles,Typography,Accordion,AccordionDetails,AccordionSummary,ExpandMoreIcon} from "component";
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position:"fixed",
    bottom:30
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export default function ExpandableFooter(props) {
  const classes = useStyles();
  const {heading="Head",data=""}=props;
  return (
    <div className={classes.root}>
<Accordion square={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{heading}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
           {data}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
