import React from 'react'
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
        marginTop: '12px',
    },
    paper: {
        padding: theme.spacing(1),
        borderRadius: '3px',
        overflow: 'visible',
        marginLeft: '-20px'
    },
    popoverArrow: {
        position: 'absolute',
        display: 'block',
        width: '8.48528137px',
        height: '8.48528137px',
        borderStyle: 'solid',
        borderColor: '#fff',
        borderWidth: '4.24264069px',
        transform: 'rotate(45deg)',
        top: '-4px',
        left: '14px'
    }
}));

function EnhancedPopover(props) {
    const classes = useStyles();

    return (
        <div>
            <Popover
                id={'custom-enhanced-popover'}
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={props.open}
                anchorEl={props.anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={() => props.onClose(null)}
            >
                <div className={classes.popoverArrow}></div>
                <Typography>I use Popover.</Typography>
            </Popover>
        </div>
    )
}

export default EnhancedPopover

EnhancedPopover.propTypes = {
    open: PropTypes.bool.isRequired,
    anchorEl: PropTypes.object.isRequired,
    onClose: PropTypes.func,
};

EnhancedPopover.defaultProps = {
    open: false,
    anchorEl: null,
}
