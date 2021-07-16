import React from "react";
import { Typography } from "component";

const DataObjectView = (props) => {
  const { t, direction = "ltr", selDataObject = null } = props;

  return (
    <div>
      <Typography>DATA OBJECT : {JSON.stringify(selDataObject)}</Typography>
    </div>
  );
};

export default DataObjectView;
