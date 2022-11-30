import { Space, Table, Button, Tooltip, Card, Form, Input, message } from 'antd';
import React,{ useEffect, useState, Key } from 'react';
import { useNavigate } from 'react-router-dom';
import {reqGetHospitalSets, reqDelHospital, reqBatchDelHospital} from "@api/hospital/hosipitalSet"
import { IhospitalSetList, IhospitalSets} from "@api/hospital/hosipitalSet/model/hospitalSetType"
import type { ColumnsType } from 'antd/es/table';
import {EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

let isSearch = false;
const searchObj = {hosname:"", hoscode:""};

export default function HospitalSet() {

  // 创建form实例
  const [form] = Form.useForm()
  const navigate = useNavigate();

  // 用来保存医院设置列表数据
  const [ hosipitalSetLists, setHosipitalSetLists ] = useState<IhospitalSets>([]);
  const [ total, setTotal ] = useState(0); 
  const [ page, setPage ] = useState(1);
  const [ pageSize, setPageSize ] = useState(5);
  const [ loading, setLoading ] = useState(false);
  const [ ids, setIds ] = useState<Key[]>([]);

  useEffect(()=>{
      // 函数挂载时获取到初始化数据
      reqGetHospitalSetList(page,pageSize);
  },[])

  async function  reqGetHospitalSetList(page: number,pageSize: number,hosname?: string,hoscode?: string) {
      setLoading(true)
      const promiseResult = await reqGetHospitalSets(page,pageSize,hosname,hoscode);
      // console.log(promiseResult.records);
      setHosipitalSetLists(promiseResult.records);
      setTotal(promiseResult.total)
      setLoading(false)
  }
  // =======================================================================================

  // 点击提交按钮，并且校验成功的回调执行函数
  const onFinish = (values: any) => {
    // console.log('Success:', values);
    const {hospitalName,hospitalCode} = values;
    searchObj.hosname = hospitalName;
    searchObj.hoscode = hospitalCode;
    reqGetHospitalSetList(page,pageSize,hospitalName,hospitalCode);
    isSearch = true;
  };
  function searchHandle() {
    isSearch = false;
  }
  // 点击提交按钮，并且校验失败的回调执行函数
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // 清空
  function clearHandle(){
    isSearch = false;
    // 设置对应字段值
    form.setFieldsValue({hospitalName: undefined,hospitalCode: undefined});
    reqGetHospitalSetList(page,pageSize);
  }
  // 添加医院
  function addHospitalHandle(): void {
    navigate("/syt/hospital/hospitalSet/addHospital");
  }

  // 修改医院
  function updateHospitalHandle(id: string){
    navigate(`/syt/hospital/hospitalSet/updateHospital/${id}`);
  }
  // 删除医院
  async function delHospitalHandle(id: string) {
    try {
      await reqDelHospital(id);
      message.success(`删除id：${id}医院信息成功`);
      await reqGetHospitalSetList(page,pageSize);
    } catch (error) {
      message.error(`删除id：${id}医院信息失败`);
    }
  }

  // 批量删除
  async function batchDelHandle() {
    try {
      await reqBatchDelHospital(ids);
      message.success(`已选择的医院信息删除成功`);
      reqGetHospitalSetList(page,pageSize);
    } catch (error) {
      message.error(`已选择的医院信息删除失败`);
      console.log(error);
    }
  }

  // 表头设置和表单列数设置
  const columns: ColumnsType<IhospitalSetList> = [
    {
      // 表头名称
      title: '序号',
      // 如果render函数不写，就渲染dataIndex数据
      // dataIndex: 'index + 1',
      // render是一个函数，返回值是什么就渲染什么
      render: (text,records,index) => index + 1,
      align:'center',
      width: 80,
      // key: 'name',
    },
    {
      title: '医院名称',
      dataIndex: "hosname",
    },
    {
      title: '医院编号',
      dataIndex: 'hoscode',
    },
    {
      title: 'api基础路径',
      dataIndex: 'apiUrl',
    },
    {
      title: '签名',
      dataIndex: 'signKey',
    },
    {
      title: '联系人姓名',
      dataIndex: 'contactsName',
    },
    {
      title: '联系人手机',
      dataIndex: 'contactsPhone',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => (
        <Space>
          <Tooltip title = "修改医院">
                <Button type="primary" icon = {<EditOutlined></EditOutlined>} onClick = {()=>{updateHospitalHandle(text.id)}} ></Button>
            </Tooltip>
            <Tooltip title = "删除医院">
                <Button type="primary" danger icon = {<DeleteOutlined />} onClick = {()=>{delHospitalHandle(text.id)}}></Button>
            </Tooltip>
        </Space>
      ),
    },
  ];
  return (
      <Card>
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout='inline'
            onValuesChange={searchHandle}
          >
            <Form.Item
              name="hospitalName"
            >
              <Input placeholder='医院名称' />
            </Form.Item>

            <Form.Item
              name="hospitalCode"
            >
              <Input placeholder='医院编号' />
            </Form.Item>

            <Form.Item>
            {/* <Space> */}
              <Button type="primary" htmlType="submit" icon={<SearchOutlined /> }>查询</Button>
              <Button style={{marginLeft:10}} onClick = {clearHandle} >清空</Button>
            {/* </Space>           */}
            </Form.Item>
          </Form>
        <Space style={{marginTop:20,marginBottom:20}}>
          <Button type="primary" onClick={addHospitalHandle} >
            添加
          </Button>
          <Button type="primary" danger disabled = {!ids.length} onClick = {batchDelHandle} >
            批量删除
          </Button>
        </Space>
            {/* 表单组件 */}
        <Table rowKey={"id"} columns={columns} dataSource={hosipitalSetLists} scroll = {{x:1500}} loading = {loading} bordered 
        pagination = {{
          total,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: [2,3,5,10],
          showQuickJumper: true,
          showTotal: total => `总共：${total}`,
          onChange(page,pageSize){
              // console.log("====",page,pageSize);
              // console.log(isSearch);
              if (!isSearch) {
                reqGetHospitalSetList(page,pageSize);
              } else {     
                reqGetHospitalSetList(page,pageSize,searchObj.hosname,searchObj.hoscode);
              }
              
              setPageSize(pageSize);
              setPage(page)
          }
        }}
        rowSelection = {{
          onChange(selectedRowKeys,selectedRows){
            // console.log(selectedRowKeys, selectedRows);
            setIds(selectedRowKeys);
          }
        }}
       />
      </Card>
  )
}
