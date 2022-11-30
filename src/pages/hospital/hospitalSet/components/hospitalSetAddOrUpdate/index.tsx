import React,{ useEffect } from 'react';
import { Button, Card, Space, Form, Input, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { reqAddHospital,reqUpdateHospital,reqUpdateHospitalSet } from '@/api/hospital/hosipitalSet';

export default function HospitalSetAdd() {
    const navigate = useNavigate()
    const { id } = useParams();   
    const [form] = Form.useForm();
    useEffect(()=>{
        // 挂载组件是渲染修改数据在表单中
        async function uqdateHospital() { 
            const promiseResult = await reqUpdateHospital(id as string)
            form.setFieldsValue(promiseResult);
        }       
        uqdateHospital();        
    })
    const onFinish = async (values: any) => {
        // 根据id判断是添加还是修改功能
        if (id) {
            values.id = id;
            // 修改医院
            try {
                reqUpdateHospitalSet(values);
                message.success(`修改${values.hosname}医院信息成功`);
                navigate(-1);
            } catch (error) {
                message.error(`修改${values.hoscode}医院信息失败`);
                console.log(error);
            }
        } else {
            // 添加医院
            try {
                await reqAddHospital(values);
                message.success(`添加${values.hosname}医院成功`);
                navigate(-1);
            } catch (error) {
                message.error(`添加${values.hoscode}医院失败`);
                console.log(error);
            }
        }
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };
    function goBackHandle() {
        navigate(-1);
    }
  return (
    <Card>
        <Form
            name="basic"
            form={form}
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            >
            <Form.Item
                label="医院名称"
                name="hosname"
                rules={[{ required: true, message: '请输入医院名称' }]}
            >
                <Input placeholder='请输入医院名称' />
            </Form.Item>

            <Form.Item
                label="医院编号"
                name="hoscode"
                rules={[{ required: true, message: '请输入医院编号' }]}
            >
                <Input placeholder='请输入医院编号' />
            </Form.Item>

            <Form.Item
                label="api基础路径"
                name="apiUrl"
                rules={[{ required: true, message: '请输入api基础路径' }]}
            >
                <Input placeholder='请输入api基础路径' />
            </Form.Item>

            <Form.Item
                label="联系人姓名"
                name="contactsName"
                rules={[{ required: true, message: '请输入联系人姓名' }]}
            >
                <Input placeholder='请输入联系人姓名' />
            </Form.Item>

            <Form.Item
                label="联系人手机"
                name="contactsPhone"
                rules={[{ required: true, message: '请输入联系人手机', pattern: /^1[3-9]\d{9}$/ }]}
            >
                <Input placeholder='请输入联系人手机' />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 2 }}>
                <Space>
                    <Button type="primary" htmlType="submit">
                    保存
                    </Button>
                    <Button onClick={goBackHandle} >返回</Button>
                </Space>
            </Form.Item>

        </Form>
    </Card>
  )
}
