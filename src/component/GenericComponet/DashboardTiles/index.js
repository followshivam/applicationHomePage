import React from 'react';
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// import Tooltip from "@material-ui/core/Tooltip";

// const StylesTooltip = withStyles({
//     tooltip: {
//         margin: -5,
//         borderRadius: 2
//     },
// })(Tooltip);

// export const StyledTooltip = (props) => {
//     const { title = '', ...rest } = props

//     return (
//         <StylesTooltip title={title} {...rest} >
//             {props.children}
//         </StylesTooltip>
//     )
// }

const useStyles = makeStyles((theme) => ({
    root_tile: {
        minWidth: props => props.width,
        maxWidth: props => props.width,
        maxHeight: props => props.height,
        margin: props => props.direction === "rtl" ? '0 0 0 25px' : ' 0 25px 0 0',
        boxShadow: '0px 3px 6px #0000001F',
        borderRadius: '4px',
        display: 'flex',
        border: '1px solid white',
        backgroundColor: theme.palette.common.white,
        '&:hover': {
            boxShadow: '0px 6px 12px #0000001F'
        },
        marginBottom: '19px',
        cursor: 'pointer'
    },
    tile_container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        // padding: "0 10px 0 0",
        // justifyContent: 'space-between',
    },
    root_tile_left: {
        minWidth: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: props => props.direction === "rtl" ? '0 4px 4px 0' : '4px 0px 0px 4px',
    },
    root_tile_right: {
        padding: '7.5px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    tile_title: {
        textAlign: props => props.direction === "rtl" ? 'right' : 'left',
        font: 'normal normal 900 24px/33px Open Sans',
        letterSpacing: '0px',
        color: '#000000',
        opacity: 1,
        // marginBottom: '5px'
    },
    tile_description: {
        color: '#606060',
        textAlign: props => props.direction === "rtl" ? 'right' : 'left',
        fontSize: '10.5pt',
        fontWeight: 600,
        letterSpacing: '0px',
        color: '#606060',
        opacity: 1,
        maxWidth: 125
    },
    tile_subDesc: {
        fontSize: '10px',
        color: '#606060',
        lineHeight: '10px',
    },
    tile_subtitle:{
        fontSixe:"14px !important",
        fontWeight:"600",
        color:"#606060"
    }
}));


export default function DashboardTile(props) {

    const {
        tileList = [],
        height = "",
        width = "165pt",
        imgHeight = 30,
        imgWidth = 30,
        direction = "ltr",
        onClickHandler = null
    } = props;

    const handleMouseEnter = (e, color) => {
        e.currentTarget.style.border = `1px solid ${color}`
    }

    const handleMouseLeave = (e) => {
        e.currentTarget.style.border = `1px solid white`
    }

    const classes = useStyles({ height, width, imgHeight, imgWidth, direction });

    const tileData_arr=[
        {
            "image":`${process.env.REACT_APP_CONTEXT_PATH}/icons/blocked.svg`,
            "backgroundColor":"#d53d3d80",
            "title":"Draft"
        },
        {
            "image":`${process.env.REACT_APP_CONTEXT_PATH}/icons/report_average.svg`,
            "backgroundColor":"#0072C629",
            "title":"Approval Pending"
        },
        {
            "image":`${process.env.REACT_APP_CONTEXT_PATH}/icons/report_good.svg`,
            "backgroundColor":"#0d6f0829",
            "title":"Published"
        }
    ]

    // const getImageUrl= (tileArray,key)=>{
    //     switch (key){
    //         case 0:
    //             return `${process.env.REACT_APP_CONTEXT_PATH}/icons/blocked.svg`
    //         case 1:
    //             return `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_average.svg`
    //         case 2:
    //             return `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_good.svg`
    //     }
    // }

    // const getImageBackground= (tileArray,key) =>{
    //     switch (key){
    //         case 0:
    //             return "#d53d3d80"
    //         case 1:
    //             return "#0072C629"
    //         case 2:
    //             return "#0d6f0829"
    //     }
    // }

    // const getTileLabel= (tileArray,key) =>{
    //     switch (key){
    //         case 0:
    //             return "Draft"
    //         case 1:
    //             return "Approval Pending"
    //         case 2:
    //             return "Published"
    //     }
    // }

    return (
        <div className={classes.tile_container} style={{ direction: direction, padding:"15px 0 25px" }}>
            {tileList && tileList.map((res, key) => {
                return (
                    // <StyledTooltip title={(res.description?.label != '' && res.description?.label != undefined) ? (`${res.description?.label}: ${res.description?.value}`) : `${res.description?.value}`}>
                    <div key={key} className={classes.root_tile}
                        onMouseEnter={(e) => handleMouseEnter(e, res.hover_border_color)} onMouseLeave={handleMouseLeave}
                        onClick={() => {
                            if (onClickHandler !== null)
                                onClickHandler(res)
                        }}>

                        <div className={classes.root_tile_left} style={{ backgroundColor: tileData_arr[key].backgroundColor }}>
                            <img src={tileData_arr[key].image} width={imgWidth} height={imgHeight} />
                        </div>

                        <div className={classes.root_tile_right}>
                            <Typography className={classes.tile_title}>{res.length}</Typography>
                            <div className={classes.tile_subtitle}>
                                {tileData_arr[key].title}
                            </div>
                            {/* <div style={{ direction: props.direction, display: 'flex' }}>
                                {
                                    (res.description?.label != '' && res.description?.label != undefined) &&
                                    <Typography className={classes.tile_description} style={{ fontWeight: 300 }} noWrap={true}>{res.description?.label}</Typography>
                                }
                                {
                                    (res.description?.value != '' && res.description?.value != undefined) &&
                                    <Typography className={classes.tile_description} noWrap={true}>{(res.description?.label ? ": " : "") + res.description.value}</Typography>
                                }
                            </div> */}
                            {/* {res?.description?.subLabel && <Typography className={classes.tile_subDesc}>{res.description.subLabel}</Typography>} */}
                        </div>

                    </div>
                    // </StyledTooltip>
                )
            })}
        </div >
    );
}

DashboardTile.propTypes = {
    tileList: PropTypes.array,
    width: PropTypes.string,
    height: PropTypes.string,
    imgHeight: PropTypes.number,
    imgWidth: PropTypes.number,
    direction: PropTypes.string,
    onClickHandler: PropTypes.func,
};