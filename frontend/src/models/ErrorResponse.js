// @flow

export type ErrorResponse = {
    code: number,
    description: string,
    message: ?string,
    fields: { [string]: string }
};
