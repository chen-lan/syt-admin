import { Button, Card, Form, Input, Space, message  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getHosName } from '../../slice';
import { getHosCode } from '../../slice';
import { reqBatchDelHospital, reqGetHospitalSets } from '@/api/hospital/hosipitalSet';

export default function HospitalSetSearch() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const ids = useAppSelector(state => state.hospitalSearch.ids)
  console.log(ids);
  // 点击提交按钮，并且校验成功的回调执行函数
  const onFinish = (values: any) => {
    console.log('Success:', values);
    const {hospitalName,hospitalCode} = form.getFieldsValue()
    dispatch(getHosName(hospitalName));
    dispatch(getHosCode(hospitalCode));
  };
  // 点击提交按钮，并且校验失败的回调执行函数
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // 清空所有查询条件
  function clearSearchHandle() {
    form.setFieldsValue({hospitalName:"", hospitalCode: ""});
    dispatch(getHosName(""));
    dispatch(getHosCode(""));
  }
  // 添加医院
  function addHospitalHandle(): void {
    navigate("/syt/hospital/hospitalSet/addHospital");
  }
  // 批量删除
  async function batchDelHandle() {
    try {
      await reqBatchDelHospital(ids);
      message.success(`已选择的医院信息删除成功`);
      await reqGetHospitalSets(1,5);
    } catch (error) {
      message.error(`已选择的医院信息删除失败`);
      console.log(error);
    }
  }
  return (
    <Card>
      <Form
        // 表单名称，会作为表单字段 id 前缀使用
          name="basic"
          form={form}
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
            <Button style={{marginLeft:10}} onClick = {clearSearchHandle} >清空</Button>
          {/* </Space>           */}
          </Form.Item>
        </Form>
      <Space style={{marginTop:20,marginBottom:20}}>
        <Button type="primary"onClick={addHospitalHandle} >
          添加
        </Button>
        <Button type="primary" danger disabled = {!ids.length} onClick = {batchDelHandle} >
          批量删除
        </Button>
      </Space>
    </Card>
  );
}
