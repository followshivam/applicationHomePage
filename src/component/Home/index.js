import React, { useEffect, useRef, useState } from 'react';
import PropTypes from "prop-types";
import RowDragger from "component/RowDraggerV2";
import {
  makeStyles,
  Spinner,
  Typography,
  Tooltip,
  Dropdown,
  useTranslation,
  SearchBox,
  DropdownFilter
} from 'component';
import { IconImage } from 'component/Icon';
import { useSelector } from 'react-redux';
const dataList = require('../../container/omniapp/Test/newData.json');


const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "600px",
  },
  subRoot: {
    width: "100%",
    height: "100%",
  },
  component: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: "7px 0 3px",
    padding: 0,
    cursor: props => props.is_dragable ? "pointer" : "default"
  },
  spinner: {
    height: "600px"
  },
  wrapper: {
    display: "flex",
    width: "300px"
  },
  heading: {
    display: "flex",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "15px",
    width: "100%",

  },
  headerRightWrapper: {
    display: "flex",
  },

  buttonWrapper: {
    margin: "0px 16px",
    height: "27.5px",
    width: "138px",
    backgroundColor: theme.palette.common.white
  },
  headingText: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: "1.5rem",
    height: "30px",
    width: "347px",
    marginLeft: "5px",
  },
  status: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: "1.5rem",
    height: "30px",
    width: "291px",
    marginLeft: "36px"
  },

  icon: {
    marginRight: theme.spacing(3),
  },
  headerIcon: {
    marginRight: theme.spacing(3),
    marginLeft: "6px"
  },
  headingSeptare: {
    paddingTop: "10px"
  },

  actionIcon: {
    marginRight: "6px",
  },

  sticky: {
    position: "fixed",
    top: 55,
    width: "100%",
    zIndex: 99,
    background: "#f8f8f8",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "15px"

  },
  separetorHeading: {
    fontSize: "12px", fontWeight: "600", margin: "10px 0px 20px 55px", backgroundColor: 'pink'
  }

}));

const Home = (props) => {
  const {
    loading = false,
    generate_icon = true,
    search = true,
    is_dragable = false,
    dataList = [],
    headerData = [],

  } = props;

  const classes = useStyles({ is_dragable });
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState();
  const [activeBlock, setActiveBlock] = useState([])
  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });
  const { t } = useTranslation(globalSetting.locale_module)

  const onChangeHandlerDragger = (newData, index) => {
    console.log('index : ', index);
    // TODO 
    setData(newData)
  }


  useEffect(() => {
    let ar = [], newData = [];
    let obj = {};
    let obj1 = {};
    let arCom = [];

    dataList.forEach(valueList => {
      obj = {
        label: valueList.label,
        value: [] // unique_id && component
      }
      valueList.value.forEach(valueItem => {
        headerData.forEach(ele => {
          arCom.push(ele.component(valueItem))
        });
        obj1 = {
          unique_id: "" + valueItem.id,
          component: <div style={{ display: 'flex' }}>{arCom.map((item, index) => {
            return <React.Fragment key={index}> {item} </React.Fragment>
          })}</div>
        }
        arCom = []
        obj.value.push(obj1)

      });
      newData.push(obj)
    });

    setData(newData)
  }, [])

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.spinner}>
          <Spinner />
        </div>
      ) :
        <div className={classes.subRoot}>
          <div className={classes.header}>
            <div id="dataList">
              <Typography style={{ fontSize: "16px", fontWeight: "600", margin: "0px 0px 10px 15px" }} noWrap={true} > Recents</Typography>
            </div>
          </div>
          <div className={classes.heading}>
            {
              headerData.map((item, index) => (
                <Typography className={classes.headingText} key={index} noWrap={true}>{item.label}</Typography>
              ))
            }
          </div>
          {
            data.map((item, index) => {
              return (
                <div className={classes.headingSeptare} key={index}>
                  <Typography className={classes.separetorHeading} noWrap={true}> {item.label}</Typography>
                  <RowDragger displayDraggerIcon={false} data={item.value} onChange={(d) => onChangeHandlerDragger(d, index)} />
                </div>
              )
            })
          }
        </div>
      }
    </div>
  );
};

// Home.propTypes = {
//   loading: PropTypes.bool,
//   isadim: PropTypes.bool,
//   generate_icon: PropTypes.bool,
//   search: PropTypes.bool,
//   is_dragable: PropTypes.bool,
//   filter: PropTypes.bool,
//   isadim: PropTypes.bool,
// };
export default Home;

