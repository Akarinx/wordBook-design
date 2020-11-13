import React, { useCallback, useContext } from 'react';
import { Button, Checkbox, Form, Icon, Input } from 'antd'
import { context, IContext } from '@/store/reducer'
import s from './Login.module.scss'


export interface LoginProps {

}

export const Login: React.FC<LoginProps> = () => {
  const { state, dispatch }: IContext = useContext(context)
  const handleSyncClick = async () => {
    const count = await wait()
    dispatch({ type: 'ADDSYNC', payload: count })
  }
  const wait = () => {
    return new Promise(res => {
      setTimeout(() => {
        res(1)
      }, 2000)
    })
  }
  return (
    <div className={s.login}>
      {state.point}
      <Button onClick={useCallback(() => { dispatch({ type: 'ADD' }) }, [])}>+1</Button>
      <Button onClick={handleSyncClick}>sync+1</Button>
    </div>
  );
}

const Log: React.FC<any> = (props) => {
  const { getFieldDecorator } = props.form
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  return (<Form onSubmit={handleSubmit} className={s.login + ' login-form'}>
    <Form.Item>
      {getFieldDecorator('username', {
        rules: [{ required: true, message: 'Please input your username!' }],
      })(
        <Input
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="Username"
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('password', {
        rules: [{ required: true, message: 'Please input your Password!' }],
      })(
        <Input
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="Password"
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('remember', {
        valuePropName: 'checked',
        initialValue: true,
      })(<Checkbox>Remember me</Checkbox>)}
      <a className="login-form-forgot" href="">
        Forgot password
    </a>
      <Button type="primary" htmlType="submit" className="login-form-button">
        Log in
    </Button>
    </Form.Item>
  </Form>
  );
}
export const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Log);

export default Log;