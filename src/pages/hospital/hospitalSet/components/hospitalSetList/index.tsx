import { Space, Table, Button, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React,{ useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector,useAppDispatch } from '@/app/hooks';
import { setIds } from '../../slice';
import { reqGetHospitalSets, reqDelHospital } from "@api/hospital/hosipitalSet"
import { IhospitalSetList, IhospitalSets} from "@api/hospital/hosipitalSet/model/hospitalSetType"

export default function HospitalSetList() {
    const navigate = useNavigate();
    // 用来保存医院设置列表数据
    const [ hosipitalSetLists, setHosipitalSetLists ] = useState<IhospitalSets>([]);
    const [ total, setTotal ] = useState(0); 
    const [ page, setPage ] = useState(1);
    const [ pageSize, setPageSize ] = useState(5);
    useEffect(()=>{   
        // 函数挂载时获取到初始化数据
        reqGetHospitalSetList(1,5);
    },[])
    // redux
    const hosname = useAppSelector((state)=>{
      return state.hospitalSearch.hosName;
    })
    const hoscode = useAppSelector((state)=>{
      return state.hospitalSearch.hosCode;
    })

    const dispatch = useAppDispatch();
    // ==================================
    async function  reqGetHospitalSetList(page:number,pageSize:number) {       
      const  promiseResult = await reqGetHospitalSets(page,pageSize,hosname,hoscode); 
      setHosipitalSetLists(promiseResult.records);
      setTotal(promiseResult.total)
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
    <Table rowKey={"id"} columns={columns} dataSource={hosipitalSetLists} scroll = {{x:1500}} bordered 
      pagination = {{
          total,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: [2,3,5,10],
          showQuickJumper: true,
          showTotal: total => `总共：${total}`,
          onChange(page,pageSize){
              // console.log("====",page,pageSize);
              reqGetHospitalSetList(page,pageSize);
              setPageSize(pageSize);
              setPage(page)
          }
        }}
        rowSelection = {{
          onChange(selectedRowKeys){
            // console.log(selectedRowKeys, selectedRows);
            dispatch(setIds(selectedRowKeys));
          }
        }}
    />
  )
}
