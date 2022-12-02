import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, message, Select, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import {
	getHospitals,
	reqGetProvince,
	reqGetCityOrDistrict,
	reqUpdateHospitalStatus,
} from "@api/hospital/hospitalList";
import {
	IhospitalLists,
	IhospitalList,
	IhospitalListSearchProvinces,
} from "@api/hospital/hospitalList/model/hospitalListType";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setReduxPage } from "./slice";

const { Option } = Select;
// true查询操作,false反之
let isSearch = false;
export default function HospitalList() {
	const [hospitalLists, setHospitalLists] = useState<IhospitalLists>([]);
	const [hospitalTotal, setHospitalTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [provinces, setProvice] = useState<IhospitalListSearchProvinces>([]);
	const [city, setCity] = useState<IhospitalListSearchProvinces>([]);
	const [districts, setDistricts] = useState<IhospitalListSearchProvinces>([]);
	const [hospitalTypes, setHospitalTypes] = useState<IhospitalListSearchProvinces>([]);
	// true是加载中
	const [isLoading, setIsLoading] = useState(true);
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const reduxPage = useAppSelector(state => state.HospitalList.page);
	// 组件挂载获取数据
	useEffect(() => {
		if (reduxPage) {
			getHospitalLists(reduxPage, pageSize);
		} else {
			getHospitalLists(page, pageSize);
		}

		// 获取所有省份
		getProvince();
		// 获取所有的医院类型
		getHospitalType(10000);
	}, []);
	// 异步函数发起请求
	async function getHospitalLists(page: number, pageSize: number) {
		setIsLoading(true);
		let promiseResult;
		if (isSearch) {
			const formData = form.getFieldsValue();
			promiseResult = await getHospitals({ page, pageSize, ...formData });
		} else {
			promiseResult = await getHospitals({ page, pageSize });
		}
		setHospitalLists(promiseResult.content);
		setHospitalTotal(promiseResult.totalElements);
		setIsLoading(false);
	}
	// 获取所有省数据
	async function getProvince(dictCode?: string) {
		const promiseResult = await reqGetProvince(dictCode);
		setProvice(promiseResult);
	}
	// 获取所有市区和医院类型（id:10000）数据
	async function getCity(id: number) {
		const promiseResult = await reqGetCityOrDistrict(id);
		setCity(promiseResult);
	}
	// 获取所有市区和医院类型（id:10000）数据
	async function getDistrict(id: number) {
		const promiseResult = await reqGetCityOrDistrict(id);
		setDistricts(promiseResult);
	}
	// 获取所有医院类型（id:10000）数据
	async function getHospitalType(id: number) {
		const promiseResult = await reqGetCityOrDistrict(id);
		setHospitalTypes(promiseResult);
	}
	// 选择省触发回调
	async function selectProvinceHandle(id: number) {
		// 选择省清空市区的选项值
		form.setFieldsValue({ cityCode: undefined, districtCode: undefined });
		// 发起市的请求
		await getCity(id);
	}
	// 选择市触发的回调
	async function selectCityHandle(id: number) {
		// 选择省清空市区的选项值
		form.setFieldsValue({ districtCode: undefined });
		// 发起区的请求
		await getDistrict(id);
	}
	// 点击查询的回调函数
	const onFinish = async (values: any) => {
		// const searchConnation = form.getFieldsValue()
		// console.log('Success:', values);
		isSearch = true;
		dispatch(setReduxPage(0));
		setPage(1);
		await getHospitalLists(1, pageSize);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};
	// 清空
	function clearSearchConnationHandle() {
		form.resetFields();
		isSearch = false;
		dispatch(setReduxPage(0));
		setPage(1);
		getHospitalLists(1, pageSize);
	}
	// 查看医院详细页面跳转
	function checkHospitalDetail(id: string) {
		navigate(`/syt/hospital/hospitalList/showHospital`, {
			state: id,
		});
	}
	// 医院排班
	function hospitalScheduleHandle(hoscode: string, hosname: string) {
		navigate(`/syt/hospital/hospitalList/Schedule/${hoscode}`, {
			state: hosname,
		});
	}
	// 更新医院状态
	async function updateStatusHandlle(id: string, status: 0 | 1) {
		try {
			await reqUpdateHospitalStatus(id, status);
			await getHospitalLists(page, pageSize);
			message.success(status ? `医院上线成功` : `医院下线成功`);
		} catch (error) {
			message.error(status ? `医院上线失败` : `医院下线失败`);
		}
	}
	const columns: ColumnsType<IhospitalList> = [
		{
			title: "序号",
			align: "center",
			render: (text, record, index) => index + 1,
		},
		{
			title: "医院logo",
			dataIndex: "logoData",
			render: (imgData, record, index) => (
				<img style={{ width: 80 }} src={"data:image/jpeg;base64," + imgData} alt="" />
			),
		},
		{
			title: "医院名称",
			dataIndex: "hosname",
			// key: 'address',
		},
		{
			title: "等级",
			dataIndex: "param",
			render: (param, record, index) => param.hostypeString,
		},
		{
			title: "详细地址",
			// key: 'tags',
			dataIndex: "param",
			render: (param, record, index) => param.fullAddress,
		},
		{
			title: "状态",
			// key: 'tags',
			dataIndex: "status",
			render: (status, record, index) => (status ? "已上线" : "未上线"),
		},
		{
			title: "创建时间",
			// key: 'tags',
			dataIndex: "createTime",
		},
		{
			title: "操作",
			// key: 'action',
			width: 200,
			fixed: "right",
			dataIndex: "status",
			render: (status, record) => (
				<Space>
					<Button
						type="primary"
						onClick={() => {
							checkHospitalDetail(record.id);
						}}>
						查看
					</Button>
					<Button
						type="primary"
						onClick={() => {
							hospitalScheduleHandle(record.hoscode, record.hosname);
						}}>
						排版
					</Button>
					<Button
						type="primary"
						onClick={() => {
							updateStatusHandlle(record.id, record.status ? 0 : 1);
						}}>
						{status ? "下线" : "上线"}
					</Button>
				</Space>
			),
		},
	];

	return (
		<Card>
			<Form
				form={form}
				layout="inline"
				name="basic"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				onChange={() => {
					isSearch = true;
				}}>
				<Form.Item name="provinceCode" style={{ marginTop: 10 }}>
					<Select
						placeholder="请选择省份"
						style={{ width: 200 }}
						onChange={id => {
							selectProvinceHandle(id);
						}}>
						{provinces.map(province => (
							<Option key={province.id} value={province.value}>
								{province.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name="cityCode" style={{ marginTop: 10 }}>
					<Select
						placeholder="请选择市"
						style={{ width: 200 }}
						onChange={id => {
							selectCityHandle(id);
						}}>
						{city.map(city => (
							<Option key={city.id} value={city.value}>
								{city.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name="districtCode" style={{ marginTop: 10 }}>
					<Select placeholder="请选择区" style={{ width: 200 }}>
						{districts.map(district => (
							<Option key={district.id} value={district.value}>
								{district.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name="hosname" style={{ marginTop: 10 }}>
					<Input type="text" placeholder="医院名称" />
				</Form.Item>
				<Form.Item name="hoscode" style={{ marginTop: 10 }}>
					<Input type="text" placeholder="医院编号" />
				</Form.Item>

				<Form.Item name="hostype" style={{ marginTop: 10 }}>
					<Select placeholder="医院类型" style={{ width: 200 }}>
						{hospitalTypes.map(hospitalType => (
							<Option key={hospitalType.id} value={hospitalType.value}>
								{hospitalType.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name="status" style={{ marginTop: 10 }}>
					<Select placeholder="医院状态" style={{ width: 200 }}>
						<Option key={0} value={0}>
							未上线
						</Option>
						<Option key={1} value={1}>
							已上线
						</Option>
					</Select>
				</Form.Item>

				<Form.Item style={{ marginTop: 10 }}>
					<Space>
						<Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
							查询
						</Button>
						<Button type="primary" onClick={clearSearchConnationHandle}>
							清空
						</Button>
					</Space>
				</Form.Item>
			</Form>
			<Table
				rowKey="id"
				columns={columns}
				dataSource={hospitalLists}
				bordered
				style={{ marginTop: 40 }}
				pagination={{
					total: hospitalTotal,
					showTotal: total => `总共${total}条`,
					current: reduxPage || page,
					pageSize: pageSize,
					showSizeChanger: true,
					showQuickJumper: true,
					pageSizeOptions: [5, 10, 15, 20],
					onChange(page, pageSize) {
						setPage(page);
						setPageSize(pageSize);
						dispatch(setReduxPage(page));
						getHospitalLists(page, pageSize);
					},
				}}
				loading={isLoading}
			/>
		</Card>
	);
}
