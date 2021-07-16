import React,{useEffect} from 'react';
import TableComponent from './Home/home';

const Home=(props)=>{
    return(<React.Fragment>
        <TableComponent {...props}/>
    </React.Fragment>)
}
export default Home;