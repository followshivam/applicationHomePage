import { Button } from "@material-ui/core";
import { makeStyles, SelectBox, InputBox, PickList, MultiSelectBox, DatePickers } from "component";
import { AdvancedUserPickList } from "component/Form";
import React from "react";

const useStyles = makeStyles(theme => ({
    root: {
        width: `calc(100% - ${theme.spacing(2)}px)`,
        height: 'fit-content',
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        // overflow: 'visible',
        // minHeight: '40px'
    },
    columnMode: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    rowMode: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        "& > *": {
            marginRight: theme.spacing(3),
            marginBottom: theme.spacing(0.5),
            marginTop: theme.spacing(0.5)
        }
    },
    elementStyle: {
        marginBottom: theme.spacing(1)
    }
}));



const DynamicForm = props => {

    const {
        data = [],
        alignment = "column"
    } = props;

    const classes = useStyles();


    const getElement = (element, key) => {
        let component = null;
        switch (element.elementType) {
            case 'InputBox':
                component = <InputBox key={key} {...element.elementConfig} />
                break;
            case 'SelectBox':
                component = <SelectBox key={key} {...element.elementConfig} />
                break;
            case 'PickList':
                component = <PickList key={key} {...element.elementConfig} />
                break;
            case 'Button':
                component = <Button key={key} {...element.elementConfig} />
                break;
            case 'MultiSelectBox':
                component = <MultiSelectBox key={key} {...element.elementConfig} />
                break;
            case 'AdvancedUserPickList':
                component = <AdvancedUserPickList key={key} {...element.elementConfig} />
                break;
            case 'DatePickers':
                component = <DatePickers key={key} {...element.elementConfig} />
                break;
            default: break;
        }

        return component;
    }

    let contentAlign = alignment === "column" ? classes.columnMode : classes.rowMode;

    return <div className={[classes.root, contentAlign].join(" ")}>
        {data.map((item, index) => (
            getElement(item, index)
        ))}
    </div>
}

export default DynamicForm;