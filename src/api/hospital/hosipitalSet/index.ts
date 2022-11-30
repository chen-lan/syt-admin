/**
 * 发axios请求
 * 
 */
import {Key} from "react";
import { request } from "@/utils/http";
import {IhospitalSetLists, IAddOrUpdateHospital} from "@api/hospital/hosipitalSet/model/hospitalSetType"

// 封装成方法，再发起请求，便于使用时获取数据
export function reqGetHospitalSets(page:number,limit:number,hosname?:string,hoscode?:string) {
    
    // 自定义设置promise对象中的record和total的数据类型
    return request.get<any,IhospitalSetLists>(`/admin/hosp/hospitalSet/${page}/${limit}`,{
        params:{
            hosname,
            hoscode,
        }
    })
}

// 添加医院的请求接口

export function reqAddHospital(data: IAddOrUpdateHospital) {
    return request.post<any,null>(`/admin/hosp/hospitalSet/save`,data)
}
// 修改医院
export function reqUpdateHospital(id: string) {
    return request.get<any,IAddOrUpdateHospital>(`/admin/hosp/hospitalSet/get/${id}`);
}

export function reqUpdateHospitalSet(data: IAddOrUpdateHospital){
    return request.put<any,null>(`/admin/hosp/hospitalSet/update`,data);
}

// 删除医院
export function reqDelHospital(id: string) {
    return request.delete<any,null>(`/admin/hosp/hospitalSet/remove/${id}`);
}

// 批量删除
export function reqBatchDelHospital(ids: Key[]) {
    return request.delete<any,null>(`/admin/hosp/hospitalSet/batchRemove`,{data:ids})
}