export type Status = 0 | 1;

export interface IHospitalListParams {
	page: number;
	pageSize: number;
	hoscode?: string;
	hosname?: string;
	hostype?: string;
	status?: Status;
	provinceCode?: string;
	cityCode?: string;
	districtCode?: string;
}

export interface IhospitalList {
	id: string;
	createTime: string;
	param: {
		hostypeString: string;
		fullAddress: string;
	};
	hoscode: string;
	hosname: string;
	provinceCode: string;
	cityCode: string;
	districtCode: string;
	address: string;
	logoData: string;
	status: number;
}

// IhospitalList放进数组中
export type IhospitalLists = IhospitalList[];

export interface IhospitalListRes {
	content: IhospitalLists;
	totalElements: number;
}

// 获取省市区的接口类型
export interface IhospitalListSearchProvince {
	id: number;
	value: string;
	dictCode: string;
	parentId: number;
	name: string;
}
export type IhospitalListSearchProvinces = IhospitalListSearchProvince[];

// 获取医院详情接口类型
export interface IHospitalDetail {
	bookingRule?: {
		cycle: number;
		releaseTime: string;
		stopTime: string;
		quitDay: number;
		quitTime: string;
		rule: string[];
	};
	hospital?: {
		id: string;
		createTime: string;
		updateTime: string;
		isDeleted: number;
		param: {
			hostypeString: string;
			fullAddress: string;
		};
		hoscode: string;
		hosname: string;
		hostype: string;
		provinceCode: string;
		cityCode: string;
		districtCode: string;
		address: string;
		logoData: string;
		intro: string;
		route: string;
		status: number;
		bookingRule: null;
	};
}

// 获取医院的所有科室

export interface IhospitalDepartment {
	depcode: string;
	depname: string;
	children: IhospitalDepartment[];
	disabled?: boolean;
}

export type IhospitalDepartments = IhospitalDepartment[];

// 排班规则接口类型
export interface IhospitalScheduleRuleList {
	workDate: string;
	dayOfWeek: string;
	docCount: number;
	reservedNumber: number;
	availableNumber: number;
}

export type IbookingScheduleList = IhospitalScheduleRuleList[];

export interface IhospitalScheduleRule {
	total: number;
	bookingScheduleList: IbookingScheduleList;
	baseMap: {
		hosname: string;
	};
}

// 排班日期的排班详情列表接口类型
export interface IScheduleDetailList {
	id: string;
	title: string;
	skill: string;
	workDate: string;
	reservedNumber: number;
	availableNumber: number;
	amount: number;
}
export type IScheduleDetailLists = IScheduleDetailList[];
