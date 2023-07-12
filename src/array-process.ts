import { SubArrayGroup } from "./interfaces";
import { groupBy as _groupBy, pick as _pick, uniqBy as _uniqBy } from "lodash";

/**
 * @Description: Add array to another array
 */
export function arrayGroup(
    mainArray: any[],
    subArray: SubArrayGroup[],
    pickProperties?: string[]
): any[] {
    const mainArr = JSON.parse(JSON.stringify(mainArray));
    for (const sub of subArray) {
        if (pickProperties?.length) {
            sub.subArray = subArray.map(c => _pick(c, pickProperties));
        }

        const subArrayPrefix = _groupBy(sub.subArray, sub.groupProperty)

        mainArr.map((c: any) => {
            if (sub.options?.mapOneOnly) {
                c[sub.groupProperty] = subArrayPrefix[c.groupProperty] ? subArrayPrefix[c.groupProperty][0] : {}
            } else {
                c[sub.groupProperty] = subArrayPrefix[c.groupProperty] ? subArrayPrefix[c.groupProperty] : []
            }

            return c
        })
    }

    return mainArr;
}

export function checkDuplicateInput(array: any[], field: string){
    if(_uniqBy(array, `${field}`).length !== array.length){
        throw new Error('Duplicate Input')
    }
}