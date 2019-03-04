// @flow

export function formatWeight(weight_kg: ?number): string {

    if(!weight_kg)
    {
        return "";
    }

    return weight_kg + " kg";
}

export function formatDate(date: ?string): string {

    if(!date)
    {
        return "";
    }

    return "d: " + date;
}
