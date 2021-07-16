import React, { useEffect } from "react";
import axios from 'axios';
function FrameCreator(props) {
  useEffect(() => {
    const scriptId = `${props.name}`;
    window.renderdashboard(`${props.name}_container`,props.report_id,props)
    const renderMicroFrontend = () => {
      
      window[`renderdashboard`](`${props.name}_container`,props.report_id, props);
    };
    // console.log(window)
    // if (document.getElementById(scriptId)) {
    //   renderMicroFrontend();
    //   return;
    // }
   
//     axios.get(`${host}/asset-manifest.json`).then((res)=>{
// console.log(res)
//     }).catch((err)=>{

//     })
        const script = document.createElement("script");
        script.id = scriptId;
        script.crossOrigin = "";
        script.src = `${props.host}/static/js/report_scheduler.chunk.js`;
                script.onload = () => {
          renderMicroFrontend();
        };
        document.head.appendChild(script);
 
    // fetch(`${host}/asset-manifest.json`)
    //   .then((res) => res.json())
    //   .then((manifest) => {
    //      alert("manifest")
    //     const script = document.createElement("script");
    //     script.id = scriptId;
    //     script.crossOrigin = "";
    //     script.src = `${host}${manifest.files["report_scheduler.js"]}`;
    //     console.log(`${host}${manifest.files["report_scheduler.js"]}`)
    //     script.onload = () => {
    //       renderMicroFrontend();
    //     };
    //     document.head.appendChild(script);
    //   });

    return () => {
      window[`unmount${props.name}`] && window[`unmount${props.name}`](`${props.name}_container`);
    };
  });

  return <div id={`${props.name}_container`} ></div>;
}

// FrameCreator.defaultProps = {
//   document,
//   window,
// };

export default FrameCreator;
