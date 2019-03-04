// @flow

import type { UserProperties } from './UserProperties'
import type { Entry } from './Entry'

export type User = {
    user_id: string,
    username: string,
    password: string,
    entry_list: Entry[]
} & UserProperties;
