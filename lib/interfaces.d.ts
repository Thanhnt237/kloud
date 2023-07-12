export interface ArrayGroupOptionsInterface {
    mapOneOnly?: boolean;
}
export interface SubArrayGroup {
    subArray: any[];
    groupProperty: string;
    options?: ArrayGroupOptionsInterface;
}
