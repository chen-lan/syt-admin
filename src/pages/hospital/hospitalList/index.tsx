import React,{ useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from "@ant-design/icons"
import { getHospitals, reqGetProvince, reqGetCityOrDistrict } from "@api/hospital/hospitalList"
import { IhospitalLists, IhospitalList, IhospitalListSearchProvinces, IHospitalListParams } from "@api/hospital/hospitalList/model/hospitalListType"

const {Option} = Select;
// true查询操作,false反之
let isSearch = false;
export default function HospitalList() {
  const [hospitalLists, setHospitalLists] = useState<IhospitalLists>([]);
  const [hospitalTotal, setHospitalTotal] = useState(0);
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(5);
  const [provinces,setProvice] = useState<IhospitalListSearchProvinces>([])
  const [cityOrDistricts,setCityOrDistrict] = useState<IhospitalListSearchProvinces>([])
  const [hospitalTypes,setHospitalTypes] = useState<IhospitalListSearchProvinces>([])
  // true是加载中
  const [isLoading,setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate()
  // 组件挂载获取数据
  useEffect(()=>{
    getHospitalLists(page,pageSize);
    // 获取所有省份
    getProvince();
    // 获取所有的医院类型
    getHospitalType(10000);
  },[])
  // 异步函数发起请求
  async function getHospitalLists(page: number, pageSize: number) {
    setIsLoading(true);
    let promiseResult;
    if (isSearch) {
      const formData = form.getFieldsValue();
      promiseResult = await getHospitals({page,pageSize,...formData});
    } else {
      promiseResult = await getHospitals({page,pageSize});
    }
    setHospitalLists(promiseResult.content);
    setHospitalTotal(promiseResult.totalElements);
    setIsLoading(false);
  }
  // 获取所有省数据
  async function getProvince(dictCode?: string) {
    const promiseResult = await reqGetProvince(dictCode)
    setProvice(promiseResult);
  }
  // 获取所有市区和医院类型（id:10000）数据
  async function getCityOrDistrict(id: number) {
    const promiseResult = await reqGetCityOrDistrict(id)
    setCityOrDistrict(promiseResult);  
  }
  // 获取所有医院类型（id:10000）数据
  async function getHospitalType(id: number) {
    const promiseResult = await reqGetCityOrDistrict(id)
    setHospitalTypes(promiseResult);  
  }
  // 选择省触发回调
  async function selectProvinceHandle(id: number) {
    // 选择省清空市区的选项值
    form.setFieldsValue({cityCode: undefined, districtCode: undefined});
    // 发起市的请求
    await getCityOrDistrict(id);
  }
  // 选择市触发的回调
  async function selectCityHandle(id: number) {
    // 选择省清空市区的选项值
    form.setFieldsValue({districtCode: undefined});
    // 发起市的请求
    await getCityOrDistrict(id);
  }
  // 点击查询的回调函数
  const onFinish = async () => {
    // const searchConnation = form.getFieldsValue()
    // console.log('Success:', values);
    isSearch = true;
    await getHospitalLists(1,pageSize);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // 清空
  function clearSearchConnationHandle() {
    form.resetFields();
    isSearch = false;
    getHospitalLists(1,pageSize);
  }
  // 查看医院详细页面跳转
  function checkHospitalDetail(id: string) {
    navigate(`/syt/hospital/hospitalList/showHospital`,{
      state: id,
    });
  }
  const columns: ColumnsType<IhospitalList> = [
    {
      title: '序号',
      align: 'center',
      render: ( text, record, index ) => index + 1,
    },
    {
      title: '医院logo',
      dataIndex: 'logoData',
      render: (imgData, record, index) => <img style={{width: 80}} src= {"data:image/jpeg;base64," + imgData} alt="" />,
    },
    {
      title: '医院名称',
      dataIndex: 'hosname',
      // key: 'address',
    },
    {
      title: '等级',
      dataIndex: 'param',
      render: (param, record, index) => param.hostypeString,
    },
    {
      title: '详细地址',
      // key: 'tags',
      dataIndex: 'param',
      render: (param, record, index) => param.fullAddress,
    },
    {
      title: '状态',
      // key: 'tags',
      dataIndex: 'status',
      render: (status, record, index) => status ? "已上线" : "未上线",
    },
    {
      title: '创建时间',
      // key: 'tags',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      // key: 'action',
      width: 200,
      fixed: "right",
      dataIndex: "status",
      render: (status, record) => (
        <Space>
          <Button type='primary' onClick={()=>{checkHospitalDetail(record.id)}} >查看</Button>
          <Button type='primary' >排版</Button>
          <Button type='primary' >{status ? "下线" : "上线"}</Button>
        </Space>
      ),
    },
  ];
  
  return (
    <Card>
      <Form
        form={form}
        layout='inline'
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        onChange={()=>{isSearch = true}}
      >
        <Form.Item name="provinceCode" style={{marginTop: 10}} >
          <Select placeholder="请选择省份" style={{width: 200}} onChange = {(id)=>{selectProvinceHandle(id)}} >
            {provinces.map((province)=> <Option key={province.id} value = {province.value}>{province.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="cityCode" style={{marginTop: 10}} >
          <Select placeholder="请选择市" style={{width: 200}} onChange = {(id)=>{selectCityHandle(id)}} >
            {cityOrDistricts.map((cityOrDistrict)=> <Option key={cityOrDistrict.id} value = {cityOrDistrict.value}>{cityOrDistrict.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="districtCode" style={{marginTop: 10}} >
          <Select placeholder="请选择区" style={{width: 200}} >
            {cityOrDistricts.map((cityOrDistrict)=> <Option key={cityOrDistrict.id} value = {cityOrDistrict.value}>{cityOrDistrict.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="hosname" style={{marginTop: 10}} >
          <Input type="text" placeholder='医院名称' />
        </Form.Item>
        <Form.Item name="hoscode" style={{marginTop: 10}} >
          <Input type="text" placeholder='医院编号' />
        </Form.Item>

        <Form.Item name="hostype" style={{marginTop: 10}} >
          <Select placeholder="医院类型" style={{width: 200}} >
            {hospitalTypes.map((hospitalType)=> <Option key={hospitalType.id} value = {hospitalType.value}>{hospitalType.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="status" style={{marginTop: 10}} >
          <Select placeholder="医院状态" style={{width: 200}} >
            <Option key={0} value = {0} >未上线</Option>
            <Option key={1} value = {1} >已上线</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{marginTop: 10}} >
          <Space>
            <Button type="primary" htmlType="submit" icon = {<SearchOutlined />} >查询</Button>
            <Button type="primary" onClick={clearSearchConnationHandle} >清空</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table rowKey = "id" columns={columns} dataSource={hospitalLists} bordered style = {{marginTop: 40} }
             pagination = {{
              total: hospitalTotal,
              showTotal: (total) => `总共${total}条`,
              current:page,
              pageSize:pageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: [5,10,15,20],
              onChange(page,pageSize){
                setPage(page);
                setPageSize(pageSize);
                getHospitalLists(page,pageSize);
              }
             }}
             loading = {isLoading}
      />
    </Card>
  )
}
