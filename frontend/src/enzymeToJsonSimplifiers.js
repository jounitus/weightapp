import toJson from 'enzyme-to-json';
//import {recursiveMap} from "recursiveMap"
import {recursiveMap} from "./recursiveMap";


export function simplifyWrapper(wrapper) {

    return recursiveMap(toJson(wrapper), function(key, val, save) {

        //console.info("callback", key, val);

        const okParams = ["type", "props", "children"];
        const ignoreParams = ["props"];

        if(!okParams.includes(key)) {
            return;
        }

        const ignoreRecurse = ignoreParams.includes(key);

        save(key, val, ignoreRecurse);

    });

}

export function listifyWrapper(wrapper) {

    const outer = (outerObj) => {

        const inner = (wrapper) => {

            if(!wrapper.type) {
                throw Error("'type' property is missing from the object");
            }

            let ret = [];

            ret.push(wrapper.type);
            ret.push(wrapper.props);

            if (wrapper.children) {
                ret.push(outer(wrapper.children));
            }

            return ret;

        };

        if(outerObj && outerObj.constructor === Array)
        {
            return outerObj.map(obj => outer(obj));
        }
        else if (outerObj && outerObj.constructor === Object)
        {
            return inner(outerObj);
        }
        else
        {
            // this is likely just a text node
            return outerObj;
        }

    };

    const simplified = simplifyWrapper(wrapper);
    return outer(simplified);

}
