
export interface IhospitalSetList{
    id: number,
    hosname: string,
    hoscode: string,
    apiUrl: string,
    signKey: string,
    contactsName: string,
    contactsPhone: string,
  }

export type IhospitalSets = IhospitalSetList[]

// 定义promise对象的接口 
export interface IhospitalSetLists{
    records:IhospitalSets,
    total:number;
  }

export interface IAddOrUpdateHospital{
  id?: string,
  hosname: string,
  hoscode: string,
  apiUrl: string,
  contactsName: string,
  contactsPhone: string,
}