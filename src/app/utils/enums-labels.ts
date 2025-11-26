export function getEnumsLabels(Enum: any, translateFn: (value: any) => string, filterFn: (value: any) => boolean = (val) => true): { label: string; value: string }[] {
    let returnable: { label: string; value: string }[] = [];

    for (const element in Enum) {
        if (isNaN(Number(element)) && filterFn(Enum[element])) {
            returnable.push({
                label: translateFn(Enum[element]),
                value: Enum[element].toString()
            });
        }
    }

    return returnable;
}