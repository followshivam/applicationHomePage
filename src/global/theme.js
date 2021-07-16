import React, { createContext, Provider } from "react";

const LightTheme = {
  fontSize: "12px",
  backgroundColor: "white",
  primary: "#f8f8f8",
  color: "black"
}
const DarkTheme = {
  fontSize: "12px",
  backgroundColor: "grey",
  color: "white"
}
const Data = (theme) => {
  return theme;
}

const DefaultTheme = {
  palette: {
    primary: {
      main: '#0072C6'
    },
    secondary: {
      main: '#0072C6'
    },
    backgroundContainer: '#f8f8f8',
    borderColor: '#e0e0e0',
    omniapp_color: "#0072c6",//"#FF6600"
  },
  typography: {
    fontFamily: 'Open Sans',
    input_label: {
      fontSize: "1rem",
      fontWeight: '600',
      lineHeight: "1.1876",
      //  fontFamily: 'OpenSans-Semibold',
      letterSpacing: '0px',
      color: '#606060'
    },
    helper_text: {
      fontSize: '0.625rem',
      // fontFamily: 'OpenSans',
      letterSpacing: '0px',
      color: '#606060',
      opacity: 1
    },
    h6: {
      fontSize: '13px',
      fontWeight: '600'
    },
    h5: {
      fontSize: '14px',
      fontWeight: '600'
    },
    h4: {
      fontSize: '16px',
      fontWeight: '600'
    },
    subtitle2: {
      fontSize: '0.625rem'
    },
    subtitle1: {
      fontSize: '0.75rem'
    },
    caption: {
      fontSize: '0.95rem'
    }
  },
  shape: {
    borderRadius: 30
  },
  spacing: 8,
  inputSpacing: 2,
  overrides: {
    MuiTypography: {
      h6: {
        fontSize: '14px',
        color: '#000000'
      },
      h5: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2D2D2D'
      },
      h4: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#2D2D2D'
      },
      h3: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2D2D2D'
      },
      subtitle2: {
        fontSize: '10px'
      },
      subtitle1: {
        fontSize: '12px'
      },
      caption: {
        fontSize: '0.95rem'
      },
      body1: {
        fontSize: '0.75rem'
      }
    },
    MuiPaper: {
      rounded: {
        borderRadius: 0
      }
    },
    MuiDialogTitle:{
      root:{
        borderBottom:"1px solid #c4c4c4",
        padding: `16px 20px`
      }
    },
    MuiDialogActions : {
      root:{
        borderTop:"1px solid #f8f8f8",
      }
    },
    MuiDialog: {
      paper: {
        borderRadius: 2,
      },
     
      paperScrollPaper: {
        overflow: 'visible'
      }
    },
    MuiFormControlLabel: {
      labelPlacementStart: {
        marginLeft: 0,
        marginRight: 0,
        // width: '60%'
      }
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: 2,
        minWidth: '4rem'
      },
     
      contained: {
        backgroundColor: 'transparent'
      },
      outlined: {
        height: '1.7rem',
      },
      outlinedPrimary: {
        color: "#606060",
        border: "1px solid #606060"
      },
      // containedPrimary: {
      //   color: 'black',
      //   backgroundColor: '#1ec600'
      // },
      containedPrimary: {
        color: 'white'
      },
      fullWidth: {
        maxWidth: '200px'
      },
      containedSizeSmall: {
        padding: '2px 5px'
      },
      outlinedSizeSmall: {
        fontSize: '0.75rem',
      }
    },
    MuiIconButton: {
      root: {
        padding: '0px',
        color: 'black',
        '&:hover': {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiSvgIcon: {
      root: {
        fontSize: '16px',
        cursor: 'pointer'
      }
    },
    MuiTableCell: {
      root: {
        fontSize: '0.75rem',

      },
      body: {
        color: "black"
      },
      head: {
        fontWeight: 600,
        fontSize: '0.75rem'
      }
    },
    MuiAlert: {
      root: {
        borderRadius: 0,
        padding: '2px 8px'
      }
    },
    MuiList: {
      padding: {
        paddingBottom: 0,
        paddingTop: 0
      }
    },
    MuiToolbar: {
      dense: {
        minHeight: '35px'
      }
    },
    MuiPopover: {
      paper: {
        '&::before': {
          position: 'absolute',
          display: 'block',
          width: '8.48528137px',
          height: '8.48528137px',
          background: 'green',
          borderStyle: 'solid',
          borderWidth: '4.24264069px',
          transform: 'rotate(45deg)'
        }
      }
    }
  },
  props: {
    MuiButton: {
      disableRipple: true,
      size: 'small'
    },
    MuiCheckbox: {
      disableRipple: true
    },
    MuiTableCell: {
      size: 'small'
    },
    MuiCheckbox: {
      size: 'small'
    }
  }
}

export { LightTheme, DarkTheme, Data, DefaultTheme }