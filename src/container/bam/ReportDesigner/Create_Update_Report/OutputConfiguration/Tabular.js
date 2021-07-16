import React from 'react'
import { makeStyles } from "component";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

}));


const Tabular = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            Tabular
        </div>
    )

}

export default Tabular