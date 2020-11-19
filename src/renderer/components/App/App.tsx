import React, { useCallback, useState } from 'react';
import { Button, Icon, Layout, Menu } from 'antd'
import fs from 'fs'
import { IpcRenderer, ipcRenderer, remote } from 'electron'
import { Link, match } from 'react-router-dom'
import s from "./App.module.scss"


interface IAppProps {
  history: any;
  location: any;
  match: match;
  staticContext?: any;
}


export const App: React.FC<IAppProps> = (props: IAppProps) => {
  const [file, setFile] = useState('')
  const { Header, Sider, Content, Footer } = Layout
  const { SubMenu } = Menu
  const readTxtFileData = async () => {
    const res = await remote.dialog.showOpenDialog({
      title: '选择txt',
    })
    fs.readFile(res.filePaths[0], 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
      } else {
        setFile(data.replace(/\n|\r\n/g, '<br/>'))
      }
    })
  }

  const handleLogout = () => {
    ipcRenderer.send('logout')
    console.log('ok')
  }
  return (
    <div className={s.main} >
      <Header style={{ backgroundColor: "pink" }} >Header</Header>
      <Layout>
        <Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  subnav 1
                </span>
              }
            >
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="laptop" />
                  subnav 2
                </span>
              }
            >
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="notification" />
                  subnav 3
                </span>
              }
            >
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content>
          <div className={s.Wrapper} >
            <Button type="dashed" onClick={handleLogout}>退出登陆</Button>
            <div>Hello World!</div>
            <div>
              <Button type='danger' onClick={readTxtFileData}>读文件内容</Button>
              <Button type='dashed' onClick={useCallback(() => { setFile('') }, [])}>refresh</Button>
            </div>

            <div dangerouslySetInnerHTML={{ __html: file }} />
          </div>
        </Content>
      </Layout>
      <Footer>Footer</Footer>

    </div>
  )
};
