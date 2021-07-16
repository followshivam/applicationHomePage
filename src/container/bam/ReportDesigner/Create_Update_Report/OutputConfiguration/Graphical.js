import React, { useState } from 'react'
import { makeStyles } from "component";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

}));


const Graphical = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            Graphical
        </div>
    )

}

export default Graphical