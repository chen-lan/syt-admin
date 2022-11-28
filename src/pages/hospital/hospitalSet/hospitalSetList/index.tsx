import { Space, Table, Button, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import React from 'react';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
// 表头设置和表单列数设置
const columns: ColumnsType<DataType> = [
  {
    // 表头名称
    title: '序号',
    // 如果render函数不写，就渲染dataIndex数据
    // dataIndex: 'index + 1',
    // render是一个函数，返回值是什么就渲染什么
    render: (name,data,index) => index + 1,
    // key: 'name',
  },
  {
    title: '医院名称',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '医院编号',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'api基础路径',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '签名',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '联系人姓名',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '联系人手机',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title = "修改医院">
            <Button type="primary" icon = {<EditOutlined></EditOutlined>} ></Button>
        </Tooltip>
        <Tooltip title = "删除医院">
            <Button type="primary" danger icon = {<DeleteOutlined />}></Button>
        </Tooltip>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export default function HospitalSetList() {
  return (
    <Table columns={columns} dataSource={data} />
  )
}
