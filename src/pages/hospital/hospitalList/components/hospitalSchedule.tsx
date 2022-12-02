import React, { useEffect, useState } from "react";
import { Col, Row, Card, Tree, Tag, Pagination, Table, Button, message } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import type { ColumnsType } from "antd/es/table";
import {
	reqGetHospitalDepartments,
	reqGetHospitalScheduleRule,
	reqGetWorkDateScheduleDetail,
} from "@/api/hospital/hospitalList";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
	IhospitalDepartments,
	IbookingScheduleList,
	IScheduleDetailLists,
	IScheduleDetailList,
} from "@/api/hospital/hospitalList/model/hospitalListType";

// table
interface DataType {}

const columns: ColumnsType<IScheduleDetailList> = [
	{
		title: "序号",
		render: (text, record, index) => index + 1,
	},
	{
		title: "职称",
		dataIndex: "title",
	},
	{
		title: "号源时间",
		dataIndex: "workTime",
	},
	{
		title: "可预约数",
		dataIndex: "availableNumber",
	},
	{
		title: "剩余预约数",
		dataIndex: "reservedNumber",
	},
	{
		title: "挂号费(元)",
		dataIndex: "amount",
	},
	{
		title: "擅长技能",
		dataIndex: "skill",
	},
];

const data: DataType[] = [];
let outpatientDepcode: string;

export default function HospitalSchedule() {
	const [departments, setDeparments] = useState<IhospitalDepartments>([]);
	const [depcode, setDepcode] = useState<string[]>([]);
	const [depname, setDepname] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [bookingScheduleList, setBookingScheduleList] = useState<IbookingScheduleList>([]);
	const [total, setTotal] = useState(0);
	const [workDate, setWorkDate] = useState("");
	const [scheduleDetail, setScheduleDetail] = useState<IScheduleDetailLists>([]);
	const { hoscode } = useParams(); //路由参数是以对象形式返回
	const hosname = useLocation().state;

	const navigate = useNavigate();

	useEffect(() => {
		// 获取科室数据
		getHospitalDepartments(hoscode as string);
	}, []);
	// 获取医院所有科室的数据
	async function getHospitalDepartments(hoscode: string) {
		const promiseResult = await reqGetHospitalDepartments(hoscode);
		if (promiseResult.length) {
			promiseResult.forEach(hospitalDepartment => (hospitalDepartment.disabled = true));
			setDeparments(promiseResult);
			setDepcode(promiseResult.map(department => department.depcode));
			setDepname(promiseResult[0].children[0].depname);
			// console.log(promiseResult);
			// 门诊排班规则
			outpatientDepcode = promiseResult[0].children[0].depcode;
			getDeparmentSchedule(page, pageSize, outpatientDepcode);
		} else {
			message.error(`${hosname}医院的科室无排班数据`);
		}
	}
	// 获取科室排班规则的所有数据
	async function getDeparmentSchedule(page: number, pageSize: number, outpatientDepcode: string) {
		const promiseResult = await reqGetHospitalScheduleRule(
			page,
			pageSize,
			hoscode as string,
			outpatientDepcode // 门诊的科室号（门诊号）
		);
		// console.log(promiseResult);
		setBookingScheduleList(promiseResult.bookingScheduleList);
		setTotal(promiseResult.total);
		if (promiseResult.bookingScheduleList.length) {
			const defaultWorkDate = promiseResult.bookingScheduleList[0].workDate;
			// 默认选中第一个排班时间
			setWorkDate(defaultWorkDate);
			getWorkDateScheduleDetail(hoscode as string, outpatientDepcode, defaultWorkDate);
		} else {
			message.error(`${hosname}医院的科室无排班数据`);
		}
	}
	// 获取工作日期安排详情数据列表
	async function getWorkDateScheduleDetail(
		hoscode: string,
		outpatientDepcode: string,
		workDate: string
	) {
		const promiseResult = await reqGetWorkDateScheduleDetail(hoscode, outpatientDepcode, workDate);
		// console.log(promiseResult);
		setScheduleDetail(promiseResult);
	}

	const onSelect: TreeProps["onSelect"] = (selectedKeys, info: any) => {
		// console.log("selected", selectedKeys, info);
		// 获取门诊号
		outpatientDepcode = info.node.depcode;
		setPage(1);
		setDepname(info.node.depname);
		getDeparmentSchedule(1, pageSize, outpatientDepcode);
		getWorkDateScheduleDetail(hoscode as string, outpatientDepcode, workDate);
	};

	const height = document.documentElement.clientHeight - 64 - 34 - 48 - 14;
	return (
		<Card>
			<p>
				选择：{hosname} / {depname} / {workDate}
			</p>
			<Row gutter={20}>
				<Col span={5} style={{ border: "1px solid #ccc", overflow: "auto", height }}>
					<Tree
						// checkable
						// defaultExpandedKeys={["0-0-0", "0-0-1"]}
						// defaultSelectedKeys={["0-0-0", "0-0-1"]}
						// defaultCheckedKeys={["0-0-0", "0-0-1"]}
						onSelect={onSelect}
						// onCheck={onCheck}
						treeData={departments as any}
						fieldNames={{
							title: "depname",
							key: "depcode",
						}}
						expandedKeys={depcode}
					/>
				</Col>
				<Col span={19}>
					{bookingScheduleList.map((bookingSchedule, index) => (
						<Tag
							key={index}
							color={workDate === bookingSchedule.workDate ? "green" : ""}
							onClick={() => {
								setWorkDate(bookingSchedule.workDate);
								getWorkDateScheduleDetail(
									hoscode as string,
									outpatientDepcode,
									bookingSchedule.workDate
								);
							}}>
							<div>
								{bookingSchedule.workDate}
								{bookingSchedule.dayOfWeek}
							</div>
							{bookingSchedule.docCount} / {bookingSchedule.reservedNumber}
						</Tag>
					))}

					<Pagination
						style={{ marginTop: 10, marginBottom: 10 }}
						current={page}
						total={total}
						pageSize={pageSize}
						// pageSizeOptions={[5, 10, 15, 20]}
						showSizeChanger={true}
						onChange={(page, pageSize) => {
							// 设置page和pageSize
							setPage(page);
							setPageSize(pageSize);
							getDeparmentSchedule(page, pageSize, outpatientDepcode);
						}}
					/>
					{/* 表格 */}
					<Table
						columns={columns}
						dataSource={scheduleDetail}
						bordered
						rowKey="id"
						pagination={false}
					/>
					<br></br>
					<Button
						type="primary"
						onClick={() => {
							navigate(-1);
						}}>
						返回
					</Button>
				</Col>
			</Row>
		</Card>
	);
}
