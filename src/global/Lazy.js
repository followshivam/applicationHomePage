import {lazy} from 'react';
const Lazy=(url,name)=>{
    console.log(url)
  return lazy(()=>import(`../`+url).then(module=>({default:module.[name]})));
}

export default Lazy;