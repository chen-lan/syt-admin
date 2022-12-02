import { request } from "@/utils/http";
import {
	IhospitalListRes,
	IHospitalListParams,
	IhospitalListSearchProvinces,
	IHospitalDetail,
	IhospitalDepartments,
	IhospitalScheduleRule,
	IScheduleDetailLists,
} from "./model/hospitalListType";

// 获取医院列表数据
export function getHospitals({
	page,
	pageSize,
	hoscode,
	hosname,
	hostype,
	status,
	provinceCode,
	cityCode,
	districtCode,
}: IHospitalListParams) {
	return request.get<any, IhospitalListRes>(`/admin/hosp/hospital/${page}/${pageSize}`, {
		params: {
			hoscode,
			hosname,
			hostype,
			provinceCode,
			cityCode,
			districtCode,
			status,
		},
	});
}

// 获取省级数据
export function reqGetProvince(dictCode: string = "province") {
	return request.get<any, IhospitalListSearchProvinces>(
		`/admin/cmn/dict/findByDictCode/${dictCode}`
	);
}
// 获取市区的数据请求
export function reqGetCityOrDistrict(id: number) {
	return request.get<any, IhospitalListSearchProvinces>(`/admin/cmn/dict/findByParentId/${id}`);
}

// 获取医院详情
export function reqGetHospitalDetail(id: string) {
	return request.get<any, IHospitalDetail>(`/admin/hosp/hospital/show/${id}`);
}

// 医院更新上线状态
export function reqUpdateHospitalStatus(id: string, status: 0 | 1) {
	return request.get<any, null>(`/admin/hosp/hospital/updateStatus/${id}/${status}`);
}

// 获取医院所有科室数据
export function reqGetHospitalDepartments(hoscode: string) {
	return request.get<any, IhospitalDepartments>(`/admin/hosp/department/${hoscode}`);
}

// 获取排班规则数据
export function reqGetHospitalScheduleRule(
	page: number,
	pageSize: number,
	hoscode: string,
	depcode: string
) {
	return request.get<any, IhospitalScheduleRule>(
		`/admin/hosp/schedule/getScheduleRule/${page}/${pageSize}/${hoscode}/${depcode}`
	);
}

// 获取工作日期排班详情列表
export function reqGetWorkDateScheduleDetail(hoscode: string, depcode: string, workDate: string) {
	return request.get<any, IScheduleDetailLists>(
		`/admin/hosp/schedule/findScheduleList/${hoscode}/${depcode}/${workDate}`
	);
}
