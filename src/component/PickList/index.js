// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React,{forwardRef,useState} from 'react';
import {CircularProgress,TextField,Autocomplete} from 'component'
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Picklist(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [isScrollBottom, setIsScrollBottom] = useState(false);
  const ListboxComponent = forwardRef(function ListboxComponentInner(
  { setIsScrollBottom, ...rest },
  ref
) {
  return (
    <ul
      ref={ref}
      {...rest}
      onScroll={({ target }) =>
        setIsScrollBottom(
          target.scrollHeight - target.scrollTop === target.clientHeight
        )
      }
    />
  );
});
  const {label="Picklist"}=props;
  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }


    getData();

    return () => {
      active = false;
    };
  }, [loading]);
  React.useEffect(()=>{
        if (isScrollBottom) {
      getData()
     // setOptions(prevOptions => prevOptions.concat(getOptions()));
    }
  },[isScrollBottom])
const getData=async () => {
  let active = true;
      const response = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
      await sleep(1e3); // For demo purposes.
      const countries = await response.json();

      if (active) {
        setOptions(Object.keys(countries).map((key) => countries[key].item[0]));
      }
    }
  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 180}}
      size="small"
      open={open}
      ListboxComponent={listboxProps =>{console.log("hi");return(
        <ListboxComponent
          {...listboxProps}
          setIsScrollBottom={setIsScrollBottom}
        />
      )}}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      includeInputInList={true}
     autoHighlight={true}
      renderInput={(params) => (
        <TextField
          {...params}
          style={{border:"3px solid #f8f8f8"}}
          variant="standard"
          placeholder={label}
          margin="normal"
          InputProps={{
            ...params.InputProps,
            disableUnderline:true,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="primary" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}



// onScroll: event => {
//         const listboxNode = event.currentTarget;
//         if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
//           console.log('bottom');
//         }
//       }
//https://codesandbox.io/s/jolly-matsumoto-ugs5d?file=/src/Autocomplete.js