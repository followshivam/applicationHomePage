import React from "react";
import {
  List,
} from "component";
import { ListItemComponent } from "component/List";

const Assets = (props) => {
    const { t, direction, onClickHandler=null } = props;
  
    return (
      <List component="div">
        <ListItemComponent
          name={`${t("mdm:PINNED_ASSETS")}`}
          id="1"
          count="0"
          data="1"
          key="1"
          icon_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pinned_item.png`}
          direction={direction}
          height="32px"
          countColor="#7c7c7c"
          onClickHandler={onClickHandler}
        />
        <ListItemComponent
          name={`${t("mdm:DRAFT_ASSETS")}`}
          id="2"
          count="1"
          data="2"
          key="2"
          icon_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/draft.png`}
          direction={direction}
          height="32px"
          countColor="#7c7c7c"
          onClickHandler={onClickHandler}
        />
      </List>
    );
  };

  export default Assets;