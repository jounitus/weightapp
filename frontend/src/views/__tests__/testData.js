// @flow

import type {Entry} from "../../models/Entry";
import type {User} from "../../models/User";
import type {SessionContext} from "../../models/SessionContext";

export const entryList: Array<Entry> = [ // intentionally in "wrong" order to test client side sorting
    {
        entry_id: "entry2",
        date: "2018-03-01",
        weight_kg: 110.12345678
    },
    {
        entry_id: "entry1",
        date: "2018-01-13",
        weight_kg: 120.12345678
    }
];

export const user: User = {
    user_id: "myuserid",
    username: "myusername",
    password: "mypassword",
    dob: "1980-05-22",
    gender: "MALE",
    height_cm: 170.123456,
    entry_list: entryList
};


export const sessionContext: SessionContext = {

    user_id: "myuserid",
    session_token: "mysessiontoken",
    user: user,

    updateSessionInfo: jest.fn(),
    removeSessionInfo: jest.fn(),
    reloadUser: jest.fn()

};