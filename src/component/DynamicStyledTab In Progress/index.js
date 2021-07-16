import React, { useState, useEffect, Fragment, Suspense, lazy } from "react";
import {
  Tabs,
  Tab,
  makeStyles,
  Spinner,
  Grid,
  Paper,
  useTheme,
  // FrameCreator
} from "component";
import stylesheet from './style.module.css'
import NotFound from "component/NotFound";
import { useMediaQuery } from "@material-ui/core";
import RouteComponents from "global/mapRouteToComponent";
const IBPSSettings = lazy(() => import("container/omniapp/IBPSSettings/ibps_settings"));
const ApplicationIFrame = lazy(() => import("component/ApplicationIFrame"));

const ShowAlert = lazy(() => import("container/bam/Bam_Dashboard/ShowAlert/show_alert"));
// import { URL } from "global/url";
const ReportGenerator = lazy(() =>
  import("container/bam/ReportDesigner/ReportGenerator/report_generate.js")
);
const Home = lazy(() =>
  import("container/bam/Home/index.js")
);
const ReportDesigner = lazy(() =>
  import("container/bam/ReportDesigner/TableComponent/table.js")
);
const ReportScheduler = lazy(() =>
  import("container/bam/ReportScheduler/report_scheduler")
);
const AuditLogs = lazy(() =>
  import("container/bam/AuditLogs/audit_log_parent")
);
const DefaultLayout = lazy(() => import("container/bam/Bam_Dashboard/default_layout"));
const tabHeight = "20px";
const useStyles = makeStyles(theme => ({
  // tabs: {
  //    minHeight: tabHeight,
  //    height: tabHeight
  // },

  tab: {
    // border: `1px solid ${theme.palette.borderColor}`,
    fontSize: "16px",
    minWidth: "10px",
    fontWeight: "600",
    textTransform: "none",
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black
    // minHeight: tabHeight,
    // height: tabHeight
  },
  tab_container: {
    // padding: theme.spacing(2, 2, 2, 2),
    // padding:theme.spacing(1.3),
    backgroundColor: "#EFEFEF",
    minHeight: "40px"
    // border: `1px solid ${theme.palette.borderColor}`
  },
  tabSelected: {
    // color: theme.palette.primary.main,
    borderBottom: `4px solid ${theme.palette.primary.main}`
  },
  paper: {
    padding: theme.spacing(0),
    borderRadius: 2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    border: "1px solid #E4E4E4",
    // overflow: "auto"
  },

  container: {
    padding: theme.spacing(1.25),
    flexGrow: "1",
    // minHeight: "750px"
  },
  dynamic_container: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    flexGrow: "1",
  },
  tabRow: {
    backgroundColor: theme.palette.common.white,
    height: "40px"
  },
  gridContainer: {
    display: "grid",
    gridGap: props => props.column_count === '4' ? '5px' : '10px',
    padding: props => props.column_count === '4' ? '5px' : '10px',
    gridTemplateRows: props => props.row_heights && getRowHeight(props.row_heights),
    gridTemplateColumns: (props) => getColumnCount(props.column_count)
  },
  item: {
    backgroundColor: '#ffff'
  },
  content: {
    backgroundColor: 'transparent'
  }
}));

const getColumnCount = (column_count) => {
  let gridTemplateColumns = "";
  for (let index = 0; index < column_count; index++) {
    gridTemplateColumns += 99 / Number(column_count) + "% ";
  }
  return gridTemplateColumns;
};

const getRowHeight = (row_heights) => {
  return row_heights.join(" ");
};


const TabPanel = props => {
  const classes = useStyles();
  const { children, value, index } = props;

  return <div>{value === index && <div>{children}</div>}</div>;
};

const StyledTabInProgress = props => {
  const classes = useStyles();
  const {
    tabsArray = null,
    defaultValues = { tab_id: 0 },
    tabData,
    container = false,
    tabHeight = "40px",
    onCallBack = null,
    empty_template = { component: null, grid_list: [] },
    tabContainerClasses = classes.tab_container
  } = props;
  const [configValue, setconfigValue] = useState(defaultValues.tab_id);
  const handleConfigurations = (e, val) => {
    setconfigValue(val);
    if (props.changeTabHandler) {
      props.changeTabHandler(val);
    }
  };
  useEffect(() => {
    setconfigValue(defaultValues.tab_id)
  }, [props.defaultValues])
  return (
    <Fragment>
      {tabsArray.length > 1 ? (
        <Grid container justify="space-between" alignItems="center" className={classes.tabRow}>
          <Tabs
            item
            value={configValue}
            className={classes.tabs}
            variant="scrollable"
            onChange={handleConfigurations}
            style={{
              minHeight: tabHeight,
              height: tabHeight,
              backgroundColor: "#FFF"
            }}
          >
            {tabsArray.map((res, key) => (
              <Tab
                style={{ minHeight: tabHeight, height: tabHeight }}
                label={res.name}
                value={res.id}
                key={key}
                classes={{
                  selected: classes.tabSelected,
                  root: classes.tab
                }}
              />
            ))}
          </Tabs>
          <Grid item>{props.children}</Grid>
        </Grid>
      ) : null}

      <TabContainer
        tabsArray={tabsArray}
        empty_component={props.empty_component}
        tabData={tabData}
        configValue={configValue}
        defaultValues={defaultValues}
        tabContainerClasses={tabContainerClasses}
        onCallBack={onCallBack}
      />
    </Fragment>
  );
};

const Component = props => {

  const { tabData: { instance_desc = null, template_info = [] }, res, onCallBack, empty_component } = props;
  const classes = useStyles({ column_count: res.column_count, row_heights: res.row_heights });
  const grid_list = [
    {
      id: 1,
      xs: 12,
      lg: 6
    },
    {
      id: 2,
      xs: 12,
      lg: 6
    },
    {
      id: 3,
      xs: 12,
      lg: 12
    }
  ];

  const [content, setContent] = useState([]);
  const theme = useTheme();
  const [vertically, setVertically] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setVertically(matches)
  }, [matches])

  useEffect(() => {
    let list = [];
    if (template_info && template_info.length == 0) {

    } else if (template_info && template_info.length === 1) {
      let result = instance_desc[template_info[0].container_id];
      let Component = <NotFound />
      if (RouteComponents.get(result.load_url)) {
        Component = RouteComponents.get(result.load_url)(result);
      }
      list = [Component];
    }
    else if (template_info && template_info.length > 1) {
      template_info.forEach((result, key) => {
        let instance_data = null;
        let data;
        let input_info;
        if (instance_desc != null && instance_desc[result.container_id] != null) {
          instance_data = instance_desc[result.container_id];
          input_info = instance_data.c_input_info;
          data = {
            params: {
              id: instance_data.id
            }
          };
        }
        // const input_data = data.components[result.container_id];
        let Component = <NotFound />
        if (RouteComponents.get(instance_data.load_url)) {
          Component = RouteComponents.get(instance_data.load_url)(instance_data);
        }
        list.push(
          <Paper
            style={{
              gridColumn: `${result.colStart} / span ${result.colspan}`,
              gridRow: `${result.rowStart} / span ${result.rowspan}`
            }}
            className={classes.paper}
          >
            {Component}
          </Paper>
        );
      })
    }
    setContent(list)

  }, [template_info, vertically])

  // useEffect(() => {
  //   function resizeGridItem(item) {
  //     const grid = document.getElementsByClassName(classes.gridContainer)[0];
  //     const rowHeight = parseInt(
  //       window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"),
  //       10
  //     );
  //     const rowGap = parseInt(
  //       window.getComputedStyle(grid).getPropertyValue("grid-row-gap"),
  //       10
  //     );
  //     const rowSpan = Math.ceil(
  //       (item.querySelector(`.${classes.content}`).getBoundingClientRect().height +
  //         rowGap) /
  //       (rowHeight + rowGap)
  //     );

  //     item.style.gridRowEnd = "span " + rowSpan;
  //     const template = template_info.find(value => value.container_id === item.id.substring(item.id.indexOf('_') + 1));
  //     const colspan = template ? template.colspan : undefined;
  //     item.style.gridColumnEnd = "span " + colspan;
  //     // console.log(
  //     //   window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"),
  //     //   rowHeight,template,
  //     //   rowGap,colspan
  //     // );
  //   }
  //   function resizeAllGridItems() {
  //     const allItems = document.getElementsByClassName(`${classes.item}`);
  //     for (let x = 0; x < allItems.length; x++) {
  //       if (allItems[x].querySelector(`.${classes.content}`)) resizeGridItem(allItems[x]);
  //     }
  //   }

  //   resizeAllGridItems();
  //   window.addEventListener("resize", resizeAllGridItems);

  //   return () => window.removeEventListener("resize", resizeAllGridItems);
  // }, [content]);


  if (template_info.length === 0) {
    return (
      <Grid container spacing={1} alignContent="center">
        <Suspense
          fallback={
            <div style={{ minHeight: "516px" }}>
              <Spinner msg="" />
            </div>
          }
        >
          {content}
        </Suspense>
      </Grid>
    );
  } else if (template_info.length === 1) {
    let result = instance_desc[template_info[0].container_id];
    return (
      <div className={classes.container}>
        <Suspense
          fallback={
            <div style={{ minHeight: "516px" }}>
              <Spinner msg="" />
            </div>
          }
        >
          {content}
        </Suspense>
      </div>
    );
  } else {
    return (
      <div className={classes.gridContainer} style={vertically ? { display: "flex", flexDirection: 'column' } : {}}>
        {content}
      </div>
    );
  }
}

const TabContainer = React.memo(function TabContainer(props) {

  const {
    tabsArray = null,
    tabContainerClasses = "",
    configValue = 0,
    tabData = null,
    onCallBack = null,
    empty_component = null,
  } = props;



  return (
    <div className={tabContainerClasses}>
      {tabsArray.map((res, key) => {
        return (
          <TabPanel value={configValue} index={res.id} key={key}>
            <Component res={res} tabData={tabData} onCallBack={onCallBack}
              empty_component={empty_component} />
          </TabPanel>
        );
      })}
    </div>
  );
});
export default StyledTabInProgress;
