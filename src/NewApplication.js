import React from 'react'
import Typography from "@material-ui/core/Typography";
import { makeStyles } from 'component';

const useStyles=makeStyles(()=>({
    newApplication:{
        display:"flex",
        flexDirection:"column",
        height:"100%",
        width:"100%"        
    },
    header:{
        padding:"10px",
        textAlign:"left",
        color:"#606060"
    },
    mainHeading:{
        fontSize:"16px",
    },
    mainSubHeading:{
        fontSize:"12px"
    },
    body:{
        display:"flex"
    },
    leftNavBar:{
        display:"flex",
        flexDirection:"column",
        width:"200px",
        border:"1px solid #00000020",
        height:"87vh"
    },
    navs:{
        height:"3em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        caretColor:"transparent",
        '&:hover':{
            background:"#0072C620"
        },
        '&:active':{
            background:"#0072C620"
        },
        '&:focus':{
            background:"#0072C620"
        }
    },
    createNewTab:{
        border:"1px solid #00000010",
        height:"15em",
        width:"14em",
        margin:"1em",
        position:"relative",
        cursor:"pointer",
        '& button':{
            border:"1px dashed #e4a43070",
            color:"#e4a43070",
            transform:"scale(3.2)",
            background:"#fff",
            position:"relative",
            top:"4em",
            cursor:"pointer",
        },
        "& .buttonText":{
            color:"#00000080",
            fontSize:"11px",
            position:"relative",
            top:"8em"
        }
    },
    cardFooter:{
        position:"absolute",
        bottom:"0em",
        fontSize:"11px",
        borderTop:"1px solid #00000060",
        textAlign:"left",
        lineHeight:"16px",
        fontWeight:"600",
        '& span':{
            fontWeight:"100",
            lineHeight:"12px"
        }
    }
}))

function NewApplication(props) {
    const classes=useStyles();

    const leftNavigation=[
        "Blank", "All Templates", "Account Opening", "Credit Card", "Business Loan", "Consumer Loans", "Vehicle Loans"
    ]
    return (
        <div className={classes.newApplication}>

            <div className={classes.header} >
                <Typography className={classes.mainHeading}> Build the Application from our prebuilt Application Templates </Typography>
                <Typography className={classes.mainSubHeading}> You can create your applications from scratch or use pre-built templates. </Typography>
            </div>

            <div className={classes.body}>

                <div className={classes.leftNavBar}>
                 {leftNavigation.map(title=>{
                     return(
                        <span tabIndex="1" className={classes.navs}>{title}</span>
                     )
                 })}   
                </div>

                <div>
                    <div className={classes.createNewTab}>
                        <button onClick={()=>props.setCreateNew_PopUp("open")} >
                            +
                        </button>
                        <Typography className="buttonText">Start from a blank canvas</Typography>
                        <div className={classes.cardFooter}>
                            Blank Application <br/>
                            <span>
                            Start from scratch and you'll find many page templates, widgets to get you quickly started.
                            </span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default NewApplication
