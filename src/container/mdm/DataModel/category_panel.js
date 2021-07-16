import React, { useState, useEffect, lazy } from "react";
import {
  makeStyles,
  List,
  SearchBox,
  AddIcon,
  Spinner,
  Dropdown,
  Tabs,
  Tab,
} from "component";
import { ListItemComponent } from "component/List";
import DropDownMenu from "component/GenericComponet/DropDownMenu";
import AdvanceFilterMenu from "component/GenericComponet/AdvanceFilterMenu";
import {
  GetCategories,
  GetDataObjects,
  SearchCategory,
} from "global/mdm/api/ApiMethods";
import { categories } from "global/json";
import Assets from "./drawer_assets";
const PinnedAssets = lazy(() => import("./pinned_assets"));
const DraftAssets = lazy(() => import("./draft_assets"));
const DataObjectPanel = lazy(() => import("./dataObject_panel"));

const useStyles = makeStyles((theme) => ({
  leftSidebar: {
    width: 245,
    flexShrink: 0,
    height: "calc(100vh - 56px)",
    whiteSpace: "nowrap",
    backgroundColor: theme.palette.common.white,
    padding: "6px 12px",
    direction: (props) => props.direction,
  },
  dataModelActions: {
    display: "flex",
    justifyContent: "space-between",
    direction: (props) => props.direction,
  },
  searchDiv: {
    border: "1px solid #c4c4c4",
    borderRadius: "2px",
    marginTop: "12px",
    direction: (props) => props.direction,
  },
  sortDiv: {
    border: "1px solid #c4c4c4",
    borderRadius: "2px",
    marginTop: "10px",
    direction: (props) => props.direction,
  },
  listItem: {
    padding: "3px 10px 2px",
  },
  headTitle: {
    color: "#000000",
    fontSize: "14px",
    fontWeight: 600,
    paddingLeft: (props) => (props.direction === "ltr" ? "6px" : "null"),
    paddingRight: (props) => (props.direction === "rtl" ? "6px" : "null"),
  },
  divider: {
    width: "110%",
    margin: "4px auto 10px -12px",
    border: "none",
    borderTop: "1px solid #C4C4C4",
  },
  tabs: {
    width: "100%",
    paddingTop: "12px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #c4c4c4",
    minHeight: "25px",
  },
  tab: {
    opacity: 1,
    textTransform: "none",
    minHeight: "25px",
    fontWeight: "600",
    maxHeight: "25px",
    fontSize: "12px",
    color: "black",
    padding: "0px",
    minWidth: "110px",
  },
  tabSelected: {
    color: "#0072C6",
    borderBottom: "2px solid #0072C6",
  },
}));

const sort_list = [
  {
    value: 1,
    label: "Name: A-Z",
  },
  {
    value: 2,
    label: "Name: Z-A",
  },
  {
    value: 3,
    label: "Modified on: Last Modified",
  },
];
const DataModelItems = [
  {
    id: 1,
    name: "Categories",
    icon: "Categories-Projects.svg",
    type: "C",
  },
  {
    id: 2,
    name: "Processes",
    icon: "Processes.svg",
    type: "P",
  },
  {
    id: 3,
    name: "Applications",
    icon: "Applications.svg",
    type: "AP",
  },
];

const recentData = [
  { id: '1', label: 'fi', searchString: "fi"},
  { id: '4', label: 'trade', searchString: "trade" },
  { id: '5', label: 'retail', searchString: "retail" },
  { id: '6', label: 'de', searchString: "de" },
  { id: '8', label: 'expense', searchString: "expense" }
]

const ApplicationTabs = (props) => {
  const { direction, t, onChangeHandler = null, defaultIndex = 0 } = props;
  const classes = useStyles({ direction });
  const [selectedValue, setSelectedValue] = useState(defaultIndex);
  const funcTab = [
    { label: `${t("mdm:APPLICATION_PROJECTS")}`, index: 0, value: "AP" },
    { label: `${t("mdm:SURVEY_PROJECTS")}`, index: 1, value: "AS" },
  ];

  const handleConfigurations = (e, val) => {
    setSelectedValue(val);
    if (onChangeHandler != null) onChangeHandler(val);
  };

  return (
    <Tabs
      value={selectedValue}
      className={classes.tabs}
      variant="standard"
      onChange={handleConfigurations}
    >
      {funcTab.map((res, key) => (
        <Tab
          label={res.label}
          key={key}
          classes={{ selected: classes.tabSelected, root: classes.tab }}
        />
      ))}
    </Tabs>
  );
};

const HoverComponent = (props) => {
  const { direction, t, type = "C" ,openDataObjectPopup = null,} = props;
  const classes = useStyles({ direction });
  return (
    <div style={{ direction: direction, display: "flex", columnGap: "4px" }}>
      {type !== "D" && (
        <Dropdown
          image_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/add_more.png`}
          height={20}
          width={20}
          list={[
            {
              id: 1,
              value: "Create",
              label: `${t("mdm:CREATE_DATA_OBJECT")}`,
              labelFontSize: "12px",
              startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/create_data_obj.svg`,
              iconHeight: "16px",
              iconWidth: "16px",
              className: `${classes.listItem}`,
              action: () => openDataObjectPopup()
            },
            {
              id: 2,
              value: "Import",
              label: `${t("mdm:IMPORT_DATA_OBJECT")}`,
              labelFontSize: "12px",
              startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/import_data_obj.png`,
              iconHeight: "16px",
              iconWidth: "16px",
              className: `${classes.listItem}`,
            },
            {
              id: 3,
              value: "Create View",
              label: `${t("mdm:CREATE_VIEWS")}`,
              labelFontSize: "12px",
              startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/create_views.svg`,
              iconHeight: "16px",
              iconWidth: "16px",
              className: `${classes.listItem}`,
            },
          ]}
        />
      )}
      <Dropdown
        image_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/more_actions.png`}
        height={20}
        width={20}
        list={
          type !== "D"
            ? [
                {
                  id: 1,
                  value: "Edit",
                  label: `${t("mdm:EDIT")}`,
                  labelFontSize: "12px",
                  startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.png`,
                  iconHeight: "16px",
                  iconWidth: "16px",
                  className: `${classes.listItem}`,
                },
                {
                  id: 2,
                  value: "Delete",
                  label: `${t("mdm:DELETE")}`,
                  labelFontSize: "12px",
                  startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/delete.png`,
                  iconHeight: "16px",
                  iconWidth: "16px",
                  className: `${classes.listItem}`,
                  labelColor: "red",
                },
              ]
            : [
                {
                  id: 1,
                  value: "Modify",
                  label: `${t("mdm:MODIFY")}`,
                  labelFontSize: "12px",
                  startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.png`,
                  iconHeight: "16px",
                  iconWidth: "16px",
                  className: `${classes.listItem}`,
                },
                {
                  id: 2,
                  value: "View ER Diagram",
                  label: `${t("mdm:VIEW_ER_DIAGRAM")}`,
                  labelFontSize: "12px",
                  startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/ER_diagram.png`,
                  iconHeight: "16px",
                  iconWidth: "16px",
                  className: `${classes.listItem}`,
                },
                {
                  id: 3,
                  value: "Download data",
                  label: `${t("mdm:DOWNLOAD_DATA")}`,
                  labelFontSize: "12px",
                  startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/download.svg`,
                  iconHeight: "16px",
                  iconWidth: "16px",
                  className: `${classes.listItem}`,
                },
                {
                  id: 4,
                  value: "Export Definition",
                  label: `${t("mdm:EXPORT_DEFINITION")}`,
                  labelFontSize: "12px",
                  startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/download.svg`,
                  iconHeight: "16px",
                  iconWidth: "16px",
                  className: `${classes.listItem}`,
                },
                {
                  id: 5,
                  value: "Audit History",
                  label: `${t("mdm:AUDIT_HISTORY")}`,
                  labelFontSize: "12px",
                  startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/audit.svg`,
                  iconHeight: "16px",
                  iconWidth: "16px",
                  className: `${classes.listItem}`,
                },
                {
                  id: 6,
                  value: "Delete",
                  label: `${t("mdm:DELETE")}`,
                  labelFontSize: "12px",
                  startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/delete.png`,
                  iconHeight: "16px",
                  iconWidth: "16px",
                  className: `${classes.listItem}`,
                  labelColor: "red",
                },
              ]
        }
      />
    </div>
  );
};

const CategoryPanel = React.memo((props) => {
  const { openCategoryPopup = null, t, onSelectCategory = null, openDataObjectPopup = null, dataObjectClickHandler=null} = props;
  const [direction] = useState(`${t("omniapp:HTML_DIR")}`);
  const classes = useStyles({ direction });
  const [currentDataModel, setCurrentDataModel] = useState(DataModelItems[0]);
  const [currentSortType, setCurrentSortType] = useState(sort_list[0]);
  const [categoryList, setCategoryList] = useState();
  const [loading, setLoading] = useState(false);
  const [dataObjectList, setDataObjectList] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPinnedAsset, setIsPinnedAsset] = useState(false);
  const [isDraftAsset, setIsDraftAsset] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const onChangeDataModel = (item) => {
    setCurrentDataModel(item);
    let type = "C",
      orderBy = "0",
      sortOrder = "A";
    if (item.id === 2) type = "P";
    else if (item.id === 3) type = "AP";

    if (currentSortType.value === 3) orderBy = "1";
    else if (currentSortType.value === 2) sortOrder = "D";

    const payload = { type: type, sort_order: sortOrder, order_by: orderBy };

    GetCategoryListFromApi(payload);
    onSelectCategoryWrapper(type);
  };

  const onSortOptionChange = (item) => {
    setCurrentSortType(item);
    let orderBy = "0",
      sortOrder = "A";
    let type = currentDataModel.type;

    if (item.value === 3) orderBy = "1";
    else if (item.value === 2) sortOrder = "D";

    const payload = { type: type, sort_order: sortOrder, order_by: orderBy };
    GetCategoryListFromApi(payload);
  };

  const onSearchSubmit = (obj) => {
    if (obj.searchString !== "") {
      setIsSearch(true);
      const payload = {
        filter: obj.searchString,
        type: "C",
      };
      SearchCategoryFromApi(payload);
    } else {
      onClearSearch();
    }
  };

  const SearchCategoryFromApi = (payload) => {
    setLoading(true);
    SearchCategory(payload)
      .then((res) => {
        if (res != null && res.status.maincode === 0) {
          const data = res.data;
          const ctList = data.searches;
          setCategoryList(ctList);
        }
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {});
  };

  const onClearSearch = () => {
    setIsSearch(false);
    const payload = { type: "C", sort_order: "A", order_by: "0" };
    GetCategoryListFromApi(payload);
  };

  const onClickHandler = (data) => {
    setSelectedCategory(data);

    let orderBy = "0",
      sortOrder = "A";
    let type = currentDataModel.type;

    if (currentSortType.value === 3) orderBy = "1";
    else if (currentSortType.value === 2) sortOrder = "D";
    const payload = {
      category_id: `${data.id}`,
      type: type,
      sort_order: sortOrder,
      order_by: orderBy,
    };
    LoadDataObjects(payload);
    if(dataObjectClickHandler != null) dataObjectClickHandler(null);
  };

  const onSelectCategoryWrapper = (type) => {
    let opr = "C0";
    if (type === "C" && typeof categoryList != "undefined" && categoryList.length > 0)
      opr = "C1";
    if ((type === "AS" || type === "P" || type === "AP") && (typeof categoryList == "undefined"  || categoryList==null))
      opr = "P0";
    if (type === "P" && typeof categoryList != "undefined" && categoryList!=null && categoryList.length > 0)
      opr = "P1";
    if ((type === "AS" || type === "AP") && typeof categoryList != "undefined" && categoryList!=null && categoryList.length > 0)
      opr = "A1";
    if(isSearch)
      opr = "S1";
    if (selectedCategory != null && (typeof dataObjectList == "undefined" || dataObjectList==null))
      opr = "D0";
    if (selectedCategory != null && typeof dataObjectList != "undefined" && dataObjectList!=null && dataObjectList.length > 0)
      opr = "D1";
    

    if (onSelectCategory != null) onSelectCategory(opr);
  };

  useEffect(() => {
    const payload = { type: "C", sort_order: "A", order_by: "0" };
    GetCategoryListFromApi(payload);
  }, []);

  useEffect(() => {
     onSelectCategoryWrapper(currentDataModel.type);
  }, [currentDataModel, dataObjectList, categoryList,selectedCategory,isSearch]);

  const GetCategoryListFromApi = (payload) => {
    setLoading(true);
    GetCategories(payload)
      .then((res) => {
        if (res != null && res.status.maincode === 0) {
          const data = res.data;
          const ctList = data.categories;
          setCategoryList(ctList);
        } else setCategoryList(categories);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {});
  };

  const LoadDataObjects = (payload) => {
    setLoading(true);
    GetDataObjects(payload)
      .then((res) => {
        if (res != null && res.status.maincode === 0) {
          const data = res.data;
          const dObjList = data.data_objects;
          setDataObjectList(dObjList);
        }
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {});
  };

  const handleApplicationTabChange = (val) => {
    let type = "AP",
      orderBy = "0",
      sortOrder = "A";
    if (val === 1) type = "AS";

    if (currentSortType.value === 3) orderBy = "1";
    else if (currentSortType.value === 2) sortOrder = "D";

    setCurrentDataModel((prevState) => ({
      ...prevState,
      type: val === 0 ? "AP" : "AS",
    }));

    const payload = { type: type, sort_order: sortOrder, order_by: orderBy };
    console.log("handleApplicationTabChange " + JSON.stringify(payload));
    GetCategoryListFromApi(payload);
  };

  const backClickHandler = () => {
    setSelectedCategory(null);
    setDataObjectList(null);
    setIsPinnedAsset(false);
    setIsDraftAsset(false);
    if(dataObjectClickHandler != null) dataObjectClickHandler(null);
    onSelectCategoryWrapper(currentDataModel.type);
  };

  const onAssetClickHandler = (opr) => {
    if (opr === "1") setIsPinnedAsset(true);
    else if (opr === "2") setIsDraftAsset(true);
  };

  const getIconUrl = (type) => {
    switch (type) {
      case "C":
        return `${process.env.REACT_APP_CONTEXT_PATH}/icons/${DataModelItems[0].icon}`;
      case "P":
        return `${process.env.REACT_APP_CONTEXT_PATH}/icons/${DataModelItems[1].icon}`;
      case "A":
        return `${process.env.REACT_APP_CONTEXT_PATH}/icons/${DataModelItems[2].icon}`;
      case "D":
        return `${process.env.REACT_APP_CONTEXT_PATH}/icons/data_object.svg`;
      default:
        return `${process.env.REACT_APP_CONTEXT_PATH}/icons/${DataModelItems[0].icon}`;
    }
  };

  return (
    <div className={classes.leftSidebar}>
      {selectedCategory == null && !isPinnedAsset && !isDraftAsset && (
        <>
          <Assets
            t={t}
            direction={direction}
            onClickHandler={onAssetClickHandler}
          />
          <hr className={classes.divider} />
          <div className={classes.dataModelActions}>
            <DropDownMenu
              itemList={DataModelItems}
              active={currentDataModel}
              onChangeHandler={onChangeDataModel}
              direction={direction}
            />
            <AddIcon
              style={{ color: "#0072c6", height: "20", width: "20" }}
              onClick={openCategoryPopup}
            />
          </div>
          <div className={classes.searchDiv}>
            <SearchBox
              height="13px !important"
              onSearchSubmit={onSearchSubmit}
              clearSearchResult={onClearSearch}
              direction={direction}
              haveRecents={true}
              recentData={recentData}
              width='100%'
            />
          </div>
          {!isSearch && <AdvanceFilterMenu
            style={{ width: "100%", marginTop: "10px" }}
            itemList={sort_list}
            preText="Sort by:"
            direction={direction}
            onSelectHandler={onSortOptionChange}
          />}
          {currentDataModel.id === 3 && (
            <ApplicationTabs
              t={t}
              direction={direction}
              onChangeHandler={handleApplicationTabChange}
              defaultIndex={currentDataModel.type === "AP" ? 0 : 1}
            />
          )}
          <div
            style={{
              width: "100%",
              marginTop: "20px",
              height: `calc(100vh - 260px)`,
            }}
          >
            {loading ? (
              <div style={{ minHeight: "100vh" }}>
                <Spinner />
              </div>
            ) : (
              <List
                component="div"
                style={{ height: "100%", overflow: "auto" }}
              >
                {categoryList &&
                  categoryList.map((item, index) => (
                    <ListItemComponent
                      data={item}
                      name={
                        isSearch && item.type === "D"
                          ? item.alias_name
                          : item.name
                      }
                      id={item.id}
                      count={item.count}
                      divider={isSearch && index !== 0}
                      key={index}
                      icon_url={
                        isSearch
                          ? getIconUrl(item.type)
                          : `${process.env.REACT_APP_CONTEXT_PATH}/icons/${currentDataModel.icon}`
                      }
                      direction={direction}
                      height={isSearch ? "null" : "32px"}
                      onClickHandler={isSearch && item.type === "D" ? dataObjectClickHandler : onClickHandler}
                      enableHover={true}
                      secondary_name={
                        isSearch && item.type === "D" ? item.category : ""
                      }
                      countColor="#7c7c7c"
                      HoverComponent={
                        <HoverComponent
                          direction={direction}
                          t={t}
                          type={item.type}
                          openDataObjectPopup = {openDataObjectPopup}
                        />
                      }
                    />
                  ))}
              </List>
            )}
          </div>
        </>
      )}
      {(selectedCategory != null || isPinnedAsset || isDraftAsset) && (
        <>
          {selectedCategory != null && (
            <DataObjectPanel
              backClickHandler={backClickHandler}
              t={t}
              direction={direction}
              dataObjectList={dataObjectList}
              selectedCategory={selectedCategory}
              openDataObjectPopup={openDataObjectPopup}
              dataObjectClickHandler={dataObjectClickHandler}
            />
          )}
          {isPinnedAsset && (
            <PinnedAssets backClickHandler={backClickHandler} t={t} direction={direction}/>
          )}
          {isDraftAsset && <DraftAssets backClickHandler={backClickHandler} t={t} direction={direction}/>}
        </>
      )}
    </div>
  );
});

export default CategoryPanel;
