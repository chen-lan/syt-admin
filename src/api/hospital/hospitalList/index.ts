import { request } from "@/utils/http";
import { IhospitalListRes, IHospitalListParams, IhospitalListSearchProvinces, IHospitalDetail } from "./model/hospitalListType";

// 获取医院列表数据
export function getHospitals({ page, pageSize, hoscode, hosname, hostype, status, provinceCode, cityCode, districtCode }: IHospitalListParams) {
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
	return request.get<any, IhospitalListSearchProvinces>(`/admin/cmn/dict/findByDictCode/${dictCode}`);
}
// 获取市区的数据请求
export function reqGetCityOrDistrict(id: number) {
	return request.get<any, IhospitalListSearchProvinces>(`/admin/cmn/dict/findByParentId/${id}`);
}

// 获取医院详情
export function reqGetHospitalDetail(id: string) {
	return request.get<any, IHospitalDetail>(`/admin/hosp/hospital/show/${id}`);
}
