import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Badge, Button, Empty, Icon, Input, Layout, Menu, Statistic } from 'antd'
import fs from 'fs'
import { BrowserWindow, remote } from 'electron'
import { Link, match, Switch, Route } from 'react-router-dom'
import s from "./App.module.scss"
import classnames from 'classnames'
import axios from "axios"
import { CSSTransition } from 'react-transition-group'
import { LearningProgress } from '../LearningProgress'
interface IAppProps {
  history: any;
  location: any;
  match: match;
  staticContext?: any;
}

const TestComponent: React.FC = () => {
  const [file, setFile] = useState('')
  const [dailyquote, setDailyquote] = useState('')
  const [dailyquoteTranslated, setDailyquoteTranslated] = useState('')
  const [isDragged, setIsDragged] = useState(false)
  const [progress, setProgress] = useState(0)
  const [userheadHover, setUserheadHover] = useState(false)
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

  const upload = async (formData: FormData) => {

    let config = {
      // 注意要把 contentType 设置为 multipart/form-data
      headers: {
        'Content-Type': 'multipart/form-data'
      },

      // 监听 onUploadProgress 事件
      onUploadProgress: e => {
        const { loaded, total } = e;
        // 使用本地 progress 事件
        if (e.lengthComputable) {
          let progress = loaded / total * 100;
          console.log(progress)
          setProgress(progress)
        }
      }
    };
    const res = await axios.post('http://localhost:3001/api/upload', formData, config);
    if (res.status === 200) {
      console.log('上传完成😀');
    }
  }



  const handleDragOver = e => {
    e.preventDefault()
    setIsDragged(true)
  }

  const handleDragLeave = e => {
    setIsDragged(false)
  }

  const handleOnDrop = async event => {
    event.preventDefault()
    event.stopPropagation()
    const res = event.dataTransfer.files[0]

    let formdata = new FormData()
    formdata.append('file', res)
    upload(formdata)
  }


  useEffect(() => {
    (async () => {
      let res
      try {
        res = await axios.get('http://localhost:3001/api/dailyquote')
      } catch (e) {
        res = {
          data: {
            data: {
              content: 'fail',
              translation: '获取失败'
            }
          }
        }
      }
      setDailyquote(res.data.data.content)
      setDailyquoteTranslated(res.data.data.translation)
    })()
  }, [])



  return (
    <div className={s.Wrapper} >
      <div className={s.ToolBar}>
        <div className={s.dailySentenceWrapper}>
          <div className={s.dailySentence}>
            {dailyquote}
          </div>
          <div className={s.dailySentenceTrans}>
            {dailyquoteTranslated}
          </div>
        </div>
      </div>
      <div className={s.middleBar}>
        <div className={s.userLearningStatus}> {/**todolist */}
          <Empty />
        </div>
        <div className={s.userDetail}>

          <div className={s.userHead}>
            <Badge count={5}>
              <div onMouseEnter={useCallback(() => setUserheadHover(true), [])} onMouseLeave={useCallback(() => setUserheadHover(false), [])}>
                <Avatar shape="square" size={200} icon="user" src={`http://localhost:3001/bb.png`} />   {/*todo: 按用户名查找对应路径文件 e.g.:localhost:3001/111/bb.png */}
                <CSSTransition in={userheadHover} classNames="hover" timeout={500} unmountOnExit >
                  <div className={s.userHeadHover}>
                    <span style={{ color: "white", fontSize: "14px" }} >拖拽上传头像</span>
                  </div>
                </CSSTransition>
              </div>
            </Badge>
            <span>username</span>
          </div>
          <div className={s.userSomething}>
            <div className={s.userActive}>
              <Statistic
                title={"学习进度"}
                value={11.28}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<Icon type="arrow-up" />}
                suffix="%"
              />
              <Statistic
                title={"总题数"}
                value={11.28}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<Icon type="arrow-up" />}
                suffix=""
              />
              <Statistic
                title={"总单词数"}
                value={11.28}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<Icon type="arrow-up" />}
                suffix=""
              />
            </div>
            <div className={s.userSignature}>
              <span>
                signtest
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={classnames(s.dragBar, {
        [s.dragOver]: isDragged
      })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleOnDrop} >
        <Button type='danger' onClick={readTxtFileData}>读文件内容</Button>
        <div dangerouslySetInnerHTML={{ __html: file }} />
      </div>
    </div>
  )
}

const User: React.FC = (props) => {
  return (
    <Link to="/">123</Link>
  )
}


export const App: React.FC<IAppProps> = (props: IAppProps) => {
  const { history } = props
  const [isMaximized, setIsMaximized] = useState(false)
  const { Header, Sider, Content, Footer } = Layout
  const { SubMenu } = Menu

  const handleWinControl = useCallback((action: string) => {
    const browserWindow: BrowserWindow = remote.getCurrentWindow()
    switch (action) {
      case "minimize":
        browserWindow.minimize()
        break
      case 'maximize':
        if (browserWindow.isMaximized()) {
          browserWindow.unmaximize()
        } else {
          if (isMaximized) {
            browserWindow.unmaximize()
          } else {
            browserWindow.maximize()
          }
        }
        setIsMaximized(!isMaximized)
        break;
      case 'close':
        browserWindow.hide()
        break;
      default:
        break;
    }
  }, [])

  const switchPath = useCallback((props: {
    key: string;
    keyPath: Array<string>;
  }) => {
    const { keyPath } = props
    const path = keyPath.reverse().reduce((prev, next) => {
      return prev + '/' + next
    })
    history.push('/' + path)
  }, [])

  const handleMainClick = useCallback(() => {
    history.push('/')
  }, [])

  return (
    <div className={s.main} >
      <Sider>
        <div className={s.appName} onClick={handleMainClick}>
          wordBook
        </div>
        <Menu
          onClick={switchPath}
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu
            key="user"
            title={
              <span>
                <Icon type="user" />
                  用户中心
                </span>
            }
          >
            <Menu.Item key="user">设置个人资料</Menu.Item>
            <Menu.Item key="progress">学习进度</Menu.Item>
            <Menu.Item key="logout">退出登陆</Menu.Item>
            <Menu.Item key="setting">设置</Menu.Item>
          </SubMenu>
          <SubMenu
            key="toLearn"
            title={
              <span>
                <Icon type="laptop" />
                  开始学习
                </span>
            }
          >
            <Menu.Item key="reading">阅读模式</Menu.Item>
            <Menu.Item key="words">题库模式</Menu.Item>
            <Menu.Item key="loading">导入题库</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ backgroundColor: "#bae7ff", height: "auto", lineHeight: "30px", padding: "0", display: "flex" }} >
          <div className={s.searchBar}>
            <Input addonBefore={<Icon type="search" />} type="text" />
          </div>
          <div style={{ alignSelf: "end" }}>
            <Button onClick={useCallback(() => handleWinControl('minimize'), [])} ghost>
              <Icon type="minus" />
            </Button>
            <Button onClick={useCallback(() => handleWinControl('maximize'), [])} ghost>
              <Icon type="fullscreen" />
            </Button>
            <Button onClick={useCallback(() => handleWinControl('close'), [])} ghost>
              <Icon type="close" />
            </Button>
          </div>
        </Header>
        <Content>
          <Switch>
            <Route path="/" exact component={TestComponent} />
            <Route path="/user/user" exact component={User} />
            <Route path="/user/progress" exact component={LearningProgress} />
          </Switch>
        </Content>
        <Footer>Footer</Footer>
      </Layout>


    </div>
  )
};
