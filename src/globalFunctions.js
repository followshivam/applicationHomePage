import { isValid } from "date-fns";

export function capitalizeFirstLetter(string) {
  if(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

export function downloadJson(jsonData,fileName){
        const Json=JSON.stringify(jsonData);
        const file=new Blob([Json],{type:'application/json'});
        const href=URL.createObjectURL(file);
        const link=document.createElement("a");
        link.href=href;
        link.download=`${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
}

export function isColor(strColor){
  if(strColor){
    var s = new Option().style;
    s.color = strColor;
    var test1 = s.color == strColor;
    var test2 = /^#[0-9A-F]{6}$/i.test(strColor);
    if(test1 == true || test2 == true){
      return strColor;
    } 
    else{
    var color3 = `#${strColor}`;
    var s2 = new Option().style;
    s2.color = color3;
    var test3 = s2.color == color3;
    var test4 = /^#[0-9A-F]{6}$/i.test(color3);
        if(test3 == true || test4 == true){
        return color3;
        }
        else{
        return false;
        }
      }
    }
  }

export function checkValid(value){
  if(typeof value !=="number" && (value===undefined || value===null || value==="" || value===[] || value==={} || value.length===undefined || value.length===0)){
    return false;
  } 
  else if(typeof value==="number" && (value.toString().length===undefined || value.toString().length===0) ){
    console.log("number false") 
    return false;
  }  else{
    return value
  }
}

export function getNumber(value){
  if(value){
  return parseInt(value.replace(/\D/gm,""))
  }
}
  