import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge, Button, Card, Descriptions } from "antd";
import { reqGetHospitalDetail } from "@/api/hospital/hospitalList";
import { IHospitalDetail } from "@/api/hospital/hospitalList/model/hospitalListType";

export default function ShowHospital() {
	const id = useLocation().state as string;
	const [hospitalDetail, setHospitalDetail] = useState<IHospitalDetail>({});
	const navigate = useNavigate();
	useEffect(() => {
		async function getHospitalDetail() {
			const promiseResult = await reqGetHospitalDetail(id);
			setHospitalDetail(promiseResult);
			// console.log(promiseResult);
		}
		getHospitalDetail();
	}, []);
	const { hospital, bookingRule } = hospitalDetail;
	function goBackHandle(): void {
		navigate(-1);
	}
	return (
		<Card>
			<Descriptions title="基本信息" bordered column={2}>
				<Descriptions.Item label="医院名称">{hospital?.hosname}</Descriptions.Item>
				<Descriptions.Item label="医院logo">
					<img width={80} src={`data:image/jpeg;base64,${hospital?.logoData}`} alt="" />
				</Descriptions.Item>
				<Descriptions.Item label="医院编码">{hospital?.hoscode}</Descriptions.Item>
				<Descriptions.Item label="医院地址">{hospital?.param.fullAddress}</Descriptions.Item>
				<Descriptions.Item label="坐车路线" span={2}>
					{hospital?.route}
				</Descriptions.Item>
				<Descriptions.Item label="医院简介" span={2}>
					{hospital?.intro}
				</Descriptions.Item>
			</Descriptions>

			<Descriptions title="预约规则信息" bordered column={2}>
				<Descriptions.Item label="预约周期">{bookingRule?.cycle}天</Descriptions.Item>
				<Descriptions.Item label="放号时间">{bookingRule?.releaseTime}</Descriptions.Item>
				<Descriptions.Item label="停挂时间">{bookingRule?.quitTime}</Descriptions.Item>
				<Descriptions.Item label="退号时间">{bookingRule?.quitTime}</Descriptions.Item>
				<Descriptions.Item label="预约规则" span={2}>
					{bookingRule?.rule.map((itemRule, index) => (
						<div key={index}>{index + 1 + "、" + itemRule}</div>
					))}
				</Descriptions.Item>
			</Descriptions>
			<br></br>
			<Button type="primary" onClick={goBackHandle}>
				返回
			</Button>
		</Card>
	);
}
