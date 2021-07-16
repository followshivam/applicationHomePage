import React from "react";
import { makeStyles, Typography } from "component";

const USE = makeStyles(theme => ({
    labelRoot: {
        height: '50px',
        width: `calc(100% - ${theme.spacing(2)})`,
        borderBottom: props => props.disable_container ? `0.5px solid ${theme.palette.borderColor}` : "",
        overflow: 'auto',
        display: 'flex',
        direction: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: theme.spacing(2),
    },
    element: {
        display: 'flex',
        marginRight: theme.spacing(4),
        justifyItems: 'center',
        alignItems: 'center',
        height: '100%',
    },
    numberCircle: {
        height: '25px',
        width: '25px',
        borderRadius: '50%',
        border: `2.5px solid #242526`,
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
        alignItems: 'center',

    },
    numberCircleCompleted: {
        height: '25px',
        width: '25px',
        borderRadius: '50%',
        color: '#FFFFFF',
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
        alignItems: 'center',
    },
    circleContainer: (props) => {
        return {
            marginRight: theme.spacing(1),
            height: '100%',
            width: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            borderBottom: `3px solid ${props.active === true ? theme.palette.primary.main : 'transparent'}`
        }
    },
    bottomActiveBar: {
        width: '100%',
        backgroundColor: theme.palette.primary.main,
        height: '4px'
    },
    label: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '3px solid transparent',
    }
}));


const MultiStep = props => {
    const { step_list = [], active, disable_container = true } = props;
    let classes = USE({ disable_container, active: false });
    return <div>
        <div className={classes.labelRoot}>
            {step_list.map((res, key) => {
                classes = USE({ disable_container, active: active === key + 1 });
                return (<div key={key} className={classes.element}>
                    <div className={classes.circleContainer}>
                        <div className={active >= key + 1 ? classes.numberCircleCompleted : classes.numberCircle}>
                            <Typography variant="h6" style={{ color: active >= key + 1 ? 'white' : 'black' }}>
                                <b>{key + 1}</b>
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.label}>
                        <Typography variant="subtitle1" noWrap={true} >
                            <b>{res.label}</b>
                        </Typography>
                    </div>
                </div>)
            })}
        </div>
        {!disable_container && <div style={{ marginTop: "1rem", marginLeft: "0.5rem" }}>
            {step_list.map((res, key) => {
                if (active === key + 1) {
                    return (<div key={key}>
                        <res.component {...res.componentProps} />
                    </div>)
                }
                return;
            })}
        </div>}
    </div>

}

export default MultiStep;