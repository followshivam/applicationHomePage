import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { SearchBox } from 'component';
import { makeStyles, Typography } from '@material-ui/core';
import { Spinner } from 'component/Loader';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  subRoot: {
    width: "100%",
    height: "100%",
    marginBottom: '20px',
    paddingRight: "5px",
    direction: props => props.direction,
  },

  comp: {
    display: 'flex',
    alignItems: 'center',
    background: "white",
    marginBottom: "4px",
    boxShadow: "none",
    width: "100%",
    transition: "all 100ms ease-in",
    '&:hover': {
      boxShadow: "0px 3px 6px #00000029",
    }
  },

  spinner: {
    height: "600px",
  },

  heading: {
    display: "flex",
    paddingLeft: "8px",
    flexWrap: "wrap",
    width: "100%"
  },

  headerRightWrapper: {
    display: "flex",
    flexWrap: "wrap",
    // padding: props => props.direction === 'rtl' ? "0 22px" : "0 32px"

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
    flex: 1,
    paddingTop: "4px",
  },

  icon: {
    marginRight: theme.spacing(2),
  },

  separetorHeading: {
    fontSize: "12px",
    fontWeight: "600",
    margin: props => props.direction === 'rtl' ? "15px 53px 15px 0" : "15px 0 15px 53px",

  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "10px"
  },
  sticky: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "15px",
    width: "100%",
    flexWrap: "wrap",
    zIndex: 99,
    background: "#f8f8f8",
    position: "sticky",
    top: "55px",
    boxShadow: props => props.stick===true ? "0px 3px 6px #00000029" : ""

  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    // paddingTop: props => props.heading !== '' ? "15px" : 0,
    width: "100%",
    flexWrap: "wrap",
    zIndex: 99,
    // background: "#f8f8f8",
  },

}));

const RecentActivity = (props) => {
  const {
    loading = false,
    isSearch = true,
    recentList = [],
    headerData = [],
    isSticky = true,
    heading = 'Recents',
    direction = 'ltr',
    searchProps = {
      searchingKey: "name",
      placeholder: "",
      regex: null
    },
    imageInfo = {
      path: undefined, //`${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
      ext: undefined, //'.svg'
    }
  } = props;

  const [data, setData] = useState();
  const [updateData, setUpdatedData] = useState(recentList);
  const [goingUp, setGoingUp] = useState(false);
  const [stick, setStick] = useState(false);
  const classes = useStyles({ direction, heading, stick });

  useEffect(() => {
    setUpdatedData(recentList);
  }, [recentList])

  useEffect(() => {
    let newData = [];
    let obj = {};
    let obj1 = {};
    let arCom = [];
    let haveAction = false;

    updateData.forEach(categoryList => {// no. api rows
      obj = {
        category: categoryList.category,
        value: []
      }
      categoryList.value.forEach(valueItem => { // no. of object inside each category
        headerData.forEach((ele) => {
          if (ele.type === "action" && haveAction === false) {
            haveAction = true;
          }
          arCom.push(ele.component(valueItem)) //passing the object to each header object 
        });

        obj1 = {
          img_type: valueItem.img_type,
          component: <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flex: 1 }}>
            {arCom.map((item, index) => {
              if (haveAction === false) {
                return <div key={index} style={{ minWidth: "150px", flex: "1" }} > {item}</div>
              }
              else {

                return <div key={index}
                  style={{ display: "flex", flex: "1", minWidth: "150px", justifyContent: (index + 1) === headerData.length ? "flex-end" : '' }} > {item}</div>
              }
            })}</div>
        }
        arCom = []
        obj.value.push(obj1)

      });
      newData.push(obj)
    });
    setData(newData)

  }, [updateData, recentList, headerData])


  useEffect(() => {
    const header = document.getElementById("myHeader");
    const sticky = header.offsetTop - 55;
    const scrollCallBack = window.addEventListener("scroll", () => {
      if (isSticky) {
        if (window.pageYOffset > sticky) {
          setGoingUp(true)
          if (header.getBoundingClientRect().top === 55) {
            setStick(true)
          }else{
            setStick(false)
          }
        } else {
          setGoingUp(false)
        }
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  const onSearchSubmit = (obj) => {
    let ar = [];
    recentList.map((category) => {
      let searchedVal = category.value.filter((val) => {
        return val[searchProps.searchingKey].toLowerCase().includes(obj.searchString)
      })
      if (searchedVal.length > 0) {
        ar.push({
          ...category, value: searchedVal
        })
      }
    })
    setUpdatedData(ar)
  }
  const clearSearchResult = () => {
    setUpdatedData(recentList)
  }


  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.spinner}>
          <Spinner />
        </div>
      ) :
        <div className={classes.subRoot}>

          <div id={isSticky ? "myHeader" : ""} className={goingUp ? classes.sticky : classes.header}>
            {heading !== '' ? <Typography className={classes.title} noWrap={true} > {heading}</Typography> : null}
            <div className={classes.headerRightWrapper}>
              {isSearch ?
                <SearchBox
                  height="14px"
                  width="200px"
                  direction={direction}
                  onSearchSubmit={onSearchSubmit}
                  clearSearchResult={clearSearchResult}
                  placeholder={searchProps.placeholder}
                  regex={searchProps.regex}
                />
                : null}
            </div>
            <div className={classes.heading} >
              {
                (imageInfo.path === undefined) ? null
                  : <div style={{ margin: direction === 'rtl' ? "0 10px 0 20px" : "0 20px 0 0", alignItems: 'center' }}>
                    <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/file.svg`} alt="file" />
                  </div>

              }
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                {headerData.map((item, index) => (
                  <Typography className={classes.headingText} key={index} noWrap={true}>{item.category}</Typography>
                ))}
              </div>
            </div>
          </div>

          {data?.length > 0 ?
            data?.map((item, index) => {
              return (
                <div key={index}>
                  { item.category ? <Typography className={item.category ? classes.separetorHeading : ""} noWrap={true}> {item.category}</Typography> : null}
                  {item?.value?.map((res, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div className={classes.comp}>
                          {(imageInfo.path === undefined)
                            ? null
                            : (<div style={{ margin: direction === 'rtl' ? "0 10px 0 16px" : "0 20px 0 10px", alignItems: 'center' }}>
                              <img src={`${imageInfo.path}${res.img_type}${imageInfo.ext}`} alt="file" />
                            </div>)}
                          {res.component}
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>
              )
            }) : (<div style={{ height: '100%', paddingTop: "150px", textAlign: 'center', width: '100%' }}>
              <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/no_data.svg`} alt={'no data'}/>
              <Typography style={{ fontSize: "12px", marginTop: '10px' }}>NO DATA FOUND</Typography>
            </div>)}
        </div>}
    </div>
  );
};

RecentActivity.propTypes = {
  loading: PropTypes.bool.isRequired,
  isSearch: PropTypes.bool,
  direction: PropTypes.string,
  recentList: PropTypes.array.isRequired,
  headerData: PropTypes.array.isRequired,
  imageInfo: PropTypes.shape({
    path: PropTypes.string.isRequired,
    ext: PropTypes.string.isRequired
  }),
  searchProps: PropTypes.shape({
    searchingKey: PropTypes.string,
    placeholder: PropTypes.string
  }),

};

export default RecentActivity;