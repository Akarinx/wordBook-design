import React from 'react';
import { Button, Checkbox, Form, Icon, Input, message } from 'antd'
import s from './Login.module.scss'
import { ipcRenderer } from 'electron';


interface LoginProps {

}

interface LoginValue {
  username: string;
  password: string;
  remember: boolean;
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
        message.success('登陆成功', 1)
        await wait()

        ipcRenderer.send('openMainWindow')
      }
    });
  };
  return (
    <Form onSubmit={handleSubmit} className={s.login + ' login-form'}>
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

