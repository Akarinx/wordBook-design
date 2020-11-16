import React, { useCallback, useContext } from 'react';
import { Button, Checkbox, Form, Icon, Input, message } from 'antd'
import { context, IContext } from '@/store/reducer'
import s from './Login.module.scss'


interface LoginProps {

}

interface LoginValue {
  username: string;
  password: string;
  remember: boolean;
}


export const Logtest: React.FC<LoginProps> = () => {
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

const LoginMain: React.FC<any> = (props) => {
  const { getFieldDecorator } = props.form
  const wait = () => {
    return new Promise(res => {
      setTimeout(() => {
        res(1)
      }, 2000)
    })
  }
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values: LoginValue) => {
      if (!err) {
        const { username, password, remember } = values
        await wait()
        message.success('登陆成功', 1)
        props.history.push('/')
      }
    });
  };
  console.log(props)
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
      <Button type="primary" htmlType="submit" className="login-form-button">
        Log in
      </Button>
    </Form.Item>
  </Form>
  );
}
export const Login = Form.create({ name: 'normal_login' })(LoginMain);

