import React from 'react';
import { withStyles, AppBar, Tabs, Tab } from "component";
import stylesheet from "./style.module.css";


const StyledTabs = withStyles(theme => ({
    root: {
        backgroundColor: 'white',
        borderBottom: '0.5px solid #E6E6E6',
        borderTop: '0.5px solid #E6E6E6',
        minHeight: '20px',
        color: 'black'
    },
    indicator: {
        color: theme.palette.primary.main,
        // color: 'black'
    }
}))(Tabs);

let tabHeight = '20px'

const StyledTab = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.common.white,
        fontSize: '12px',
        minWidth: '40px',
        textTransform: 'none',
        minHeight: tabHeight,
        height: tabHeight,
        fontWeight: 'bold'
    }
}))(Tab);


const LinkTab = props => {
    return (
        <StyledTab
            onClick={(event) => {
                event.preventDefault();
            }}
            className={stylesheet.tabHeight}
            {...props}
        />
    );
}


const NavTabs = props => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        props.handleActiveChange(newValue);
    };
    return (
        <div>
            <AppBar elevation={0} position="static">
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    className={stylesheet.tabHeight}
                >
                    {props.tabList.map((tab, index) => (
                        <LinkTab key={index} label={tab} />
                    ))}
                </StyledTabs>
            </AppBar>
        </div>
    );
}

export default NavTabs;