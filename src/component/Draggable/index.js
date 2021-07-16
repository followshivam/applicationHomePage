// import React, { useRef, useState, useEffect } from 'react'
// import {Grid} from "component"
// const quickAndDirtyStyle = {
//   width: "200px",
//   height: "200px",
//   background: "#FF9900",
//   color: "#FFFFFF",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center"
// }

// const Draggable= (props) => {
//   const [pressed, setPressed] = useState(false)
//   const [position, setPosition] = useState({x:400, y: 300})
//   const ref = useRef()

//   // Monitor changes to position state and update DOM
//   // useEffect(() => {
//   //   if (ref.current) {
//   //     ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`
//   //   }
//   // }, [position])

//   // Update the current position if mouse is down
//   const onMouseMove = (e) => {
//     console.log(e)
//     if (pressed) {
//           setPosition({
//       x: e.x - ref.current.offsetWidth / 2,
//       y: e.y - ref.current.offsetHeight / 2,
//     });
//     e.stopPropagation();
//     e.preventDefault();
//       // setPosition({
//       //   x: position.x + event.movementX,
//       //   y: position.y + event.movementY
//       // })
//     }
//   }

//   return (
 
         
//     <Grid item xs={3}  ref={ref}   value="5"         onMouseMove={ onMouseMove }
//       onMouseDown={ () => setPressed(true) }
//       onMouseUp={ () => setPressed(false) } style={{
//         position: "absolute",
//         left: position.x,
//         top: position.y,
//       }}>{props.children}</Grid>
//   )
// }
  //  <div
  //     ref={ ref }
  //     style={ quickAndDirtyStyle }
  //     onMouseMove={ onMouseMove }
  //     onMouseDown={ () => setPressed(true) }
  //     onMouseUp={ () => setPressed(false) }>
  //     <p>{ pressed ? "Dragging..." : "Press to drag" }</p>
  //   </div>

import React,{useState,useEffect,useRef} from "react";
import {Grid} from "component"
function useDragging() {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 500, y: 200 });
  const ref = useRef(null);

  function onMouseMove(e) {
    if (!isDragging) return;
    setPos({
      x: e.x - ref.current.offsetWidth / 2,
      y: e.y - ref.current.offsetHeight / 2,
    });
    e.stopPropagation();
    e.preventDefault();
  }

  function onMouseUp(e) {
    setIsDragging(false);
    e.stopPropagation();
    e.preventDefault();
  }

  function onMouseDown(e) {
    // console.log(e.target)
    if (e.button !== 0) return;
    setIsDragging(true);

    setPos({
      x: e.x - ref.current.offsetWidth / 2,
      y: e.y - ref.current.offsetHeight / 2,
    });

    e.stopPropagation();
    e.preventDefault();
  }

  // When the element mounts, attach an mousedown listener
  useEffect(() => {
    ref.current.addEventListener("mousedown", onMouseDown);

    return () => {
      ref.current.removeEventListener("mousedown", onMouseDown);
    };
  }, [ref.current]);

  // Everytime the isDragging state changes, assign or remove
  // the corresponding mousemove and mouseup handlers
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    } else {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [isDragging]);

  return [ref, pos.x, pos.y, isDragging];
}


function Draggable(props) {
  const [ref, x, y, isDragging] = useDragging();

  return (
     
    <Grid item xs={3}  ref={ref}   value="5"    style={{
        position: "absolute",
        width: 50,
        height: 50,
        background: isDragging ? "blue" : "gray",
        left: x,
        top: y,
      }}>{props.children}</Grid>

  );
}



export default Draggable; 
// <div
     
    //   style={{
    //     position: "absolute",
    //     width: 50,
    //     height: 50,
    //     background: isDragging ? "blue" : "gray",
    //     left: x,
    //     top: y,
    //   }}
  //  >