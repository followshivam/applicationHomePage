import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import RowDragger from "component/RowDraggerV2";
import {
  makeStyles,
  Spinner,
  Typography,
  useTranslation,
  SearchBox,
  DropdownFilter
} from 'component';
import { IconImage } from 'component/Icon';
import { useSelector } from 'react-redux';


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
    cursor: "default",
  },

  spinner: {
    height: "600px",
  },

  heading: {
    display: "flex",
    paddingLeft: "8px"

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
    width: "380px",
    marginLeft: "5px",
    paddingTop: "4px",
  },
  icon: {
    marginRight: theme.spacing(2),
  },

  headingSeptare: {
    paddingTop: "10px"
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
    fontSize: "12px",
    fontWeight: "600",
    margin: "10px 0px 20px 55px",

  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "0px 0px 10px 15px"

  }

}));

const Recent = (props) => {
  const {
    loading = false,
    isSearch = true,
    recentList = [],
    headerData = [],
    isFilter = true
  } = props;

  const classes = useStyles();
  const [data, setData] = useState([]);
  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });
  const { t } = useTranslation(globalSetting.locale_module)

  const onChangeHandlerDragger = (newData, index) => {
    // TODO 
    setData(newData)
  }


  useEffect(() => {
    let newData = [];
    let obj = {};
    let obj1 = {};
    let arCom = [];

    recentList.forEach(valueList => {
      obj = {
        label: valueList.label,
        value: [] // unique_id && component
      }
      valueList.value.forEach(valueItem => {
        headerData.forEach(ele => {
          arCom.push(ele.component(valueItem))
        });
        obj1 = {
          unique_id: "", //"" + valueItem.id:"",
          component: <div className={classes.component}>
            {arCom.map((item, index) => {
              return <div key={index} style={{ marginBottom: '2px' }} > {item}</div>
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
            <Typography className={classes.title} noWrap={true} > Recents</Typography>
            <div className={classes.headerRightWrapper}>
              <form onSubmit={(e) => {
                e.preventDefault();
                let param = e.target.search.value.trim();
                if (param != '') {
                  // props.onChange("search", param)
                }
              }}>
                {isSearch ?
                  <SearchBox
                    height="27.5px" width="200px"
                    clearSearchResult={"onClearSearch"}
                    name="search" placeholder={t('bam:TITLE_SEARCH')}
                  />
                  : null}
              </form>
              {isFilter ? <div className={classes.buttonWrapper}>
                <DropdownFilter
                  variant=""
                  color=""
                  type="button"
                  label={t('bam:All Status')}
                  // inputState={inputData}
                  onChangeHandler={props.onChange}
                  name=""
                />
              </div> : null}
            </div>
          </div>
          <div className={classes.heading}>
            <IconImage className={classes.icon}
              url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/file.svg`}
              height={25} width={25} />
            {
              headerData.map((item, index) => (
                <Typography className={item?.label ? classes.headingText : ''}
                  key={index}
                  noWrap={true}>{item.label}</Typography>
              ))
            }
          </div>
          {
            data?.map((item, index) => {
              return (
                <div className={classes.headingSeptare} key={index}>
                  <Typography className={classes.separetorHeading} noWrap={true}> {item.label}</Typography>
                  {/* <RowDragger displayDraggerIcon={false}
                    data={item.value}
                    onChange={(d) => onChangeHandlerDragger(d, index)}
                  /> */}
                  <RowDragger displayDraggerIcon={false}
                    name='table'
                    data={item.value}
                    onChange={(d) => onChangeHandlerDragger(d, index)}
                  />
                </div>
              )
            })
          }
        </div>
      }
    </div>
  );
};

Recent.propTypes = {
  loading: PropTypes.bool.isRequired,
  isSearch: PropTypes.bool,
  isFilter: PropTypes.bool,
  recentList: PropTypes.array.isRequired,
  headerData: PropTypes.array.isRequired
};
export default Recent;

