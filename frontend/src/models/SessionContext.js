// @flow

import type { User } from './User'
import type { SessionInfo } from './SessionInfo'

export type SessionContext = {
    user_id: ?string,
    session_token: ?string,
    user: ?User,

    updateSessionInfo: (session_info: SessionInfo) => void,
    removeSessionInfo: () => void,
    reloadUser: (callback?: () => void) => void
};
