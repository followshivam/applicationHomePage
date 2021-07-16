import React from 'react';
import { NotInterestedRoundedIcon, IconButton, SketchPicker, Popover, makeStyles, CloseIcon } from "component"
import { Typography } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  label: {
    paddingRight: theme.spacing(0.5),
  }
}));

const ColorPicker = props => {

  const {
    color = "NULL",
    colorChanger = console.error('ColorPicker: No colorChanger function provided'),
    displayColorCode = false,
    itemIndex = "",
    displayRemoveColorButton = false,
  } = props

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const index = props.itemIndex;
  // console.log('index is')
  // console.log(index)
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const hexBoxStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80px',
    height: '23px',
    border: `1px solid #CECECE`
  }
  return (
    <div>
      <div style={{ display: 'flex', direction: 'row', "& > *": { marginRight: '5px' } }}>
        <div style={displayColorCode === true ? hexBoxStyles : null}>
          <IconButton aria-describedby={id} variant="contained" onClick={handleClick} style={{
            backgroundColor: color,
            width: '23px',
            height: '23px',
            border: `1px solid #CECECE`,
            borderRadius: '0%'
          }}>
            {color === "" ? <NotInterestedRoundedIcon /> : null}
          </IconButton>
          {displayColorCode === true ? <Typography variant="subtitle1" className={classes.label}><b>{color.toUpperCase()}</b></Typography> : null}
        </div>
        {displayRemoveColorButton === true ? <IconButton onClick={() => colorChanger({ hex: 'NULL' }, itemIndex)}><CloseIcon /></IconButton> : null}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <SketchPicker color={color} onChangeComplete={(color) => colorChanger != null ? colorChanger(color, itemIndex) : null} />
      </Popover>
    </div>
  );
}


export default ColorPicker;