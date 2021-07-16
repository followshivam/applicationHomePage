import React from "react";
import {
    Typography,
    IconImage,
  } from "component";

const PinnedAssets = (props) => {
    const { t, direction="ltr",backClickHandler=null } = props;
  
    return (
        <div style={{ display: "flex" }}>
        <IconImage
          url={`icons/back.png`}
          width={16}
          height={16}
          onClick={() => backClickHandler()}
        />
        <Typography>
          Pinned Assets
        </Typography>
      </div>
    );
  };

  export default PinnedAssets;