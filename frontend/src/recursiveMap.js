export function recursiveMap(obj, callback) {

    const isArray = (a) => (a && a.constructor === Array);
    const isObject = (a) => (a && a.constructor === Object);

    if(isArray(obj)) {

        return obj.map((val) => recursiveMap(val, callback));

    } else if(isObject(obj)) {

        let res = {};

        const keys = Object.keys(obj);

        keys.forEach(key => {

            const val = obj[key];

            let save = (newKey, newVal, ignoreRecurse) => {
                res[newKey] = ignoreRecurse ? newVal : recursiveMap(newVal, callback);
            };

            callback(key, val, save);

        });

        return res;

    }

    return obj; // it might be any other kind of object

}
