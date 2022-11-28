import { Button, Card, Form, Input,Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
// import type { SizeType } from 'antd/es/config-provider/SizeContext';
// import React, { useState } from 'react';

export default function HospitalSetSearch() {
  // 点击提交按钮，并且校验成功的回调执行函数
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  // 点击提交按钮，并且校验失败的回调执行函数
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card>
      <Form
        // 表单名称，会作为表单字段 id 前缀使用
          name="basic"
          // col栅格组件，总共24份
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          // 初始值，默认选中
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout='inline'
        >
          <Form.Item
            // 标签文本
            // label="Username"
            name="hospitalName"
            // 校验规则
            // rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder='医院名称' />
          </Form.Item>

          <Form.Item
            // label="Password"
            name="hospitalCode"
            // rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input placeholder='医院编号' />
          </Form.Item>

          {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

          <Form.Item>
          {/* <Space> */}
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
            <Button style={{marginLeft:10}}>清空</Button>
          {/* </Space>           */}
          </Form.Item>
        </Form>
      <Space style={{marginTop:20,marginBottom:20}}>
        <Button type="primary">
          添加
        </Button>
        <Button type="primary" danger disabled>
          批量删除
        </Button>
      </Space>
    </Card>
  );
}
