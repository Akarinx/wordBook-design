import React, { useCallback, useContext } from 'react';
import { Button, Checkbox, Form, Icon, Input, message } from 'antd'
import s from './Login.module.scss'
import { ipcRenderer } from 'electron';
import axios from 'axios';
import { context, IContext } from '@/store/reducer';


interface LoginProps {

}

interface LoginValue {
  username: string;
  password: string;
  remember: boolean;
}


const LoginMain: React.FC<any> = (props) => {
  const { getFieldDecorator, validateFields, resetFields } = props.form
  const { dispatch } = useContext<IContext>(context)
  const wait = (time) => {
    return new Promise(res => {
      setTimeout(() => {
        res(1)
      }, time)
    })
  }

  const handleSubmit = e => {
    e.preventDefault();
    validateFields(async (err, values: LoginValue) => {
      if (!err) {
        const { username, password, remember } = values
        try {
          const res = await axios.post('http://localhost:3001/api/login', {
            userName: username,
            password
          })
          if (res.data.msg !== '0') {
            message.success('登陆成功', 1)
            localStorage.setItem('token', res.data.data)
            localStorage.setItem('username', username)
            await wait(2000)
            ipcRenderer.send('openMainWindow')
          } else {
            message.warn('账号或密码错误')
          }
        } catch (e) {
          message.warn('请连接网络')
        }
      }
    });
  };

  const handleRegister = () => {
    props.form.validateFields(async (err, values: LoginValue) => {
      if (!err) {
        const { username, password, remember } = values
        const res = await axios.post('http://localhost:3001/api/register', {
          userName: username,
          password
        })
        if (res.data.msg !== '1') {
          message.warn('注册失败，该账户已被注册')
          resetFields()
        } else {
          message.success('注册成功', 1)
        }
      }
    });
  }

  return (
    <div className={s.loginWrapper}>
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
          })(<Checkbox>记住我</Checkbox>)}
          <Button type="primary" htmlType="submit" >
            登陆
        </Button>
          <Button type="dashed" onClick={useCallback(() => handleRegister(), [])} >
            注册
        </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export const Login = Form.create({ name: 'normal_login' })(LoginMain);

