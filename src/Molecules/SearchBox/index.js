
import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from '@material-ui/core/InputBase';
import { validateRegex } from 'global/validator';

const useStyles = makeStyles((theme) => ({
  searchBox: (props) => {
    return {
      position: 'relative',
      marginLeft: 0,
      display: "flex",
      direction: props.direction,
    }
  },
  searchIcon: {
    position: 'absolute',
    right: props => props.direction === "rtl" ? 'none' : '6px',
    left: props => props.direction === "ltr" ? 'none' : '6px',
    height: '100%',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer'
  },
  cancelIcon: {
    position: 'absolute',
    top: '50%',
    right: props => props.direction === "rtl" ? 'none' : '25px',
    left: props => props.direction === "ltr" ? 'none' : '25px',
    transform: 'translateY(-50%)',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer'
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingLeft : props => props.direction === "ltr" ? 6 : `46px !important`,
    paddingRight: props => props.direction === "rtl" ? 6 : `46px !important`,
    fontSize: '12px',
    background: props => props.background,
    transition: theme.transitions.create('width'),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    height: props => props.height,
    width: props => props.width ? props.width : '289px',
    '&::placeholder': {
      fontSize: '12px',
      textOverflow: 'ellipsis',
      background: 'transparent !important'
    },
  },
  popoverBlock: {
    position: 'absolute',
    top: '30px',
    left: '-1px',
    width: props => props.width ? props.width : '200px',
    boxShadow: ' 0px 3px 6px #00000029',
    border: '1px solid #C4C4C4',
    borderRadius: '2px',
    zIndex: 999,
    opacity: 1,
    background: '#fff',
  },
  popoverItem: {
    listStyle: 'none',
    margin: 0,
    padding: '0 0 4px',
    direction: props => props.direction,
    '& li': {
      fontSize: '12px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: props => props.direction === "rtl" ? 'right' : 'left',
      padding: '5.5px 8px',
      cursor: 'pointer',
      '&.heading': {
        fontWeight: 600,
        color: '#000'
      }
    }
  },
  listItem: {
    background: '#fff',
    transition: 'all 100ms ease-in',
    '&:hover': {
      background: '#F0F0F0',
    }
  }
}));

const SearchBox = (props) => {

  const {
    name = "search",
    width = "200px",
    height = "28px",
    placeholder = "Search",
    onSearchChange = null,
    onSearchSubmit = null,
    clearSearchResult = null,
    haveSuggestions = false,
    haveRecents = false,
    onLoadSuggestions = null,
    onLoadRecents = null,
    recentData = [],
    suggestionData = [],
    regex = null,
    direction = "ltr",
    background = "#fff !important"
  } = props;
  const classes = useStyles({ height, width, direction, background });

  const [searchValue, setSearchValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [showRecents, setShowRecents] = useState(false)

  useEffect(() => {
    if (haveRecents)
      if (onLoadRecents !== null)
        onLoadRecents()
  }, [])

  useEffect(() => {
    function onClickEvent(event) {
      let isEleFound = false;

      for (let i = 0; i < 4; i++) {
        const ele = event.path !== undefined ? event.path[i] : undefined;
        if (ele !== undefined) {
          if (ele?.id === "searchBoxId") {
            isEleFound = true
            return;
          }
        }
      }
      if (!isEleFound) {
        setShowRecents(false)
        setShowSuggestion(false)
      }
    }

    window.addEventListener('click', onClickEvent);
    return () => window.removeEventListener('click', onClickEvent);
  }, [])

  const onKeyDownEvent = (event) => {
    if (event.keyCode === 13) {
      searchHandler()
    }
  }

  const onChangeHandler = (e) => {
    let isRegexPassed = regex !== null ? validateRegex(e.target.value, regex) : true // to test the regex with the typed value

    if (isRegexPassed || e.target.value.length === 0) { //*  e.target.value.length === 0 -> this is used when you want delete the last charcter using backspace
      setSearchValue(e.target.value);
      if (onSearchChange !== null)
        onSearchChange(e.target.value);

      //hide recents when we start the typing
      if (haveRecents)
        setShowRecents(e.target.value.length === 0 ? true : false)

      //show suggestion when we start the typing
      if (haveSuggestions) {
        if (e.target.value.length > 2) {
          if (e.target.value.length % 3 === 0)
            if (onLoadSuggestions !== null)
              onLoadSuggestions(e.target.value)
          setShowSuggestion(true)
        } else {
          setShowSuggestion(false)
        }
      }
    } 
  }

  const cancelHandler = () => {
    setSearchValue("");
    if (onSearchChange !== null)
      onSearchChange("");
    setShowSuggestion(false)

    if (haveRecents) {
      setShowRecents(true)
      if (onLoadRecents !== null)
        onLoadRecents()
    }
    if (clearSearchResult != null)
      clearSearchResult();
  }

  const searchHandler = (item) => {
    //let val = document.getElementById('searchBoxInput').value;
    if (item !== undefined) {
      // item = {
      //   ...item,
      //   searchString: val
      // }

      setSearchValue(item.label)
      setShowRecents(false)
      setShowSuggestion(false)
      if (onSearchSubmit !== null)
        onSearchSubmit(item)
    }
    else {
      if (onSearchSubmit !== null)
        onSearchSubmit({ searchString: searchValue })
    }
  }

  const onFocusHandler = (event) => {
    if (haveRecents && searchValue === "") {
      setShowRecents(true)
    }
  }

  return (
    <div className={classes.searchBox} id="searchBoxId">
      <InputBase
        name={name}
        id="searchBoxInput"
        placeholder={placeholder ? placeholder : ""}
        autoComplete="off"
        value={searchValue}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        style={{ width: width }}
        inputProps={{ 'aria-label': 'search' }}
        onFocus={onFocusHandler}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownEvent}
      />

      {
        (showRecents && recentData.length > 0) &&
        < div className={classes.popoverBlock}>
          <ul className={classes.popoverItem}>
            <li className="heading">Recent Searches</li>
            {recentData.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <li className={classes.listItem} onClick={() => searchHandler(item)}>{item.label}</li>
                </React.Fragment>
              )
            })}
          </ul>
        </div>
      }
      {
        (showSuggestion && suggestionData.length > 0) &&
        <div className={classes.popoverBlock}>
          <ul className={classes.popoverItem}>
            {suggestionData.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <li className={classes.listItem} onClick={() => searchHandler(item)}>{item.label}</li>
                </React.Fragment>
              )
            })}
          </ul>
        </div>
      }
      {
        searchValue !== "" && <div className={classes.cancelIcon} onClick={cancelHandler}>
          <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/search_close.png`} alt="lens" width="16px" height="16px" />
        </div>
      }
      <div className={classes.searchIcon} onClick={() => searchHandler()}>
        <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/search_lens.png`} alt="lens" width="16px" height="16px" />
      </div>
    </div >
  );
}

export default SearchBox;

SearchBox.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  direction: PropTypes.string,
  onSearchChange: PropTypes.func,
  onSearchSubmit: PropTypes.func, // return object {id:"", label:"", searchString:""}
  clearSearchResult: PropTypes.func,

  haveSuggestions: PropTypes.bool,
  onLoadSuggestions: PropTypes.func,
  suggestionData: PropTypes.array,
  haveRecents: PropTypes.bool,
  onLoadRecents: PropTypes.func,
  recentData: PropTypes.array,

  regex: PropTypes.string, //validation framework
};