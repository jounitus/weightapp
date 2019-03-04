// @flow

import type { SessionInfo } from './models/SessionInfo'

export function setSessionInfo(sessionInfo: SessionInfo): void {

    sessionStorage.setItem("sessionInfo", JSON.stringify(sessionInfo));

}

export function getSessionInfo(): SessionInfo | null {

    let res = sessionStorage.getItem("sessionInfo");

    if(!res)
        return null;

    return JSON.parse(res);

}

export function removeSessionInfo(): void {

    sessionStorage.removeItem("sessionInfo");

}
