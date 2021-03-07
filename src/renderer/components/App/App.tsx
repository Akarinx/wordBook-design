import React, { useCallback, useEffect, useState, useContext } from 'react';
import { context, IContext } from '@/store/reducer'
import { Avatar, Badge, Button, Icon, Input, Layout, Menu, message, Statistic, Upload } from 'antd'
import { BrowserWindow, remote } from 'electron'
import { match, Switch, Route } from 'react-router-dom'
import s from "./App.module.scss"
import classnames from 'classnames'
import axios from "axios"
import { CSSTransition } from 'react-transition-group'
import { LearningProgress } from '@/components/LearningProgress'
import { Todolist } from '@/components/Todolist'
import { UserSetting } from '@/components/UserSetting'
import { getUserDetail, getUserFolder } from '@/requests'

const csv = require('csvtojson');
interface IAppProps {
  history: any;
  location: any;
  match: match;
  staticContext?: any;
}

const Home: React.FC = () => {
  const { state, dispatch } = useContext<IContext>(context)
  const [fileList, setFileList] = useState<any[]>([]) // 上传文件列表
  const [dailyquote, setDailyquote] = useState('')
  const [dailyquoteTranslated, setDailyquoteTranslated] = useState('')
  const [isDragged, setIsDragged] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [userheadHover, setUserheadHover] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [userSignature, setUserSignature] = useState('')

  const upLoadProps = {
    accept: ".csv",
    onRemove: file => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: file => {
      setFileList([...fileList, file])
      return false
    },
    fileList
  };

  const handleUpload = () => {
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('file', file)
    })
    setUploading(true)
    upload(formData)
  }

  const handleEdit = () => {
    if (!isEdit) {
      setIsEdit(true)
    }
  }
  const readTxtFileData = async () => {
    const res = await remote.dialog.showOpenDialog({
      title: '选择csv',
    })
    console.log(res.filePaths[0], 'a')
    const filename = res.filePaths[0].split('\\').pop() // windows系统是\,mac系统是/
    const isSameName = state.fileName.findIndex(item => item === filename)
    if (isSameName <= -1) {
      filename && dispatch({ type: "ADD_FILENAME", payload: [filename] })
      const jsonObj = await csv().fromFile(res.filePaths[0]);
      console.log(jsonObj)
    } else {
      message.warn('文件名重复')
    }

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
        }
      }
    };
    formData.append('username', state.user.userName)
    console.log(formData, 'abs')
    const res = await axios.post('http://localhost:3001/api/upload', formData, config);
    if (res.status === 200) {
      setUploading(false)
      setFileList([])
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
    console.log(res)
    let formdata = new FormData()
    formdata.append('file', res)
    upload(formdata)
  }

  const handleFileClick = e => {

  }

  const handleFileDoubleClick = (e, index) => {
    dispatch({
      type: 'DELETE_FILE',
      payload: index
    })
  }

  // 请求扇贝每日句子
  useEffect(() => {
    (async () => {
      let res
      if (!localStorage.getItem('dailyquote') && !localStorage.getItem('dailyquoteTrans')) {
        try {
          res = await axios.get('http://localhost:3001/api/dailyquote')
          localStorage.setItem('dailyquote', res.data.data.content)
          localStorage.setItem('dailyquoteTrans', res.data.data.translation)
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
      } else {
        res = {
          data: {
            data: {
              content: localStorage.getItem('dailyquote'),
              translation: localStorage.getItem('dailyquoteTrans')
            }
          }
        }
      }

      setDailyquote(res.data.data.content)
      setDailyquoteTranslated(res.data.data.translation)
    })()
  }, [])

  // 请求用户信息
  useEffect(() => {
    (async () => {
      let res = await getUserDetail()
      dispatch({
        type: "ADD_USER",
        payload: res
      })
    })()
  }, [])

  // 请求用户已上传文档信息
  useEffect(() => {
    (async () => {
      let userFileList = await getUserFolder()
      if (userFileList.length !== 0) {
        dispatch({
          type: "ADD_FILENAME",
          payload: userFileList
        })
      }
    })()
  }, [])

  //记录登录时间
  useEffect(() => {
    if (!localStorage.getItem('beginTime')) {
      const date = new Date();
      const current_hours = date.getHours();
      const current_minutes = date.getMinutes();
      localStorage.setItem('beginTime', current_hours + ':' + current_minutes)
    }
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
          <Todolist />
          {/* <Empty description="" />
          <Button type="primary">Click here!</Button> */}
        </div>
        <div className={s.userDetail}>

          <div className={s.userHead}>
            <Badge count={5}>
              <div onMouseEnter={useCallback(() => setUserheadHover(true), [])} onMouseLeave={useCallback(() => setUserheadHover(false), [])}>
                <Avatar shape="square" size={70} icon="user" src={`http://localhost:3001/bb.png`} />   {/*todo: 按用户名查找对应路径文件 e.g.:localhost:3001/111/bb.png */}
                <CSSTransition in={userheadHover} classNames="hover" timeout={500} unmountOnExit >
                  <div className={s.userHeadHover}>
                    <span style={{ color: "white", fontSize: "10px" }} >拖拽上传头像</span>
                  </div>
                </CSSTransition>
              </div>
            </Badge>
            <span>{state.user.userName}</span>
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
              {
                isEdit ?
                  <Input placeholder="Basic usage"
                    defaultValue={userSignature}
                    onFocus={() => setIsEdit(true)}
                    onBlur={() => { setIsEdit(false); }}
                    onPressEnter={() => { setIsEdit(false) }}
                    onChange={(e) => setUserSignature(e.target.value)} />
                  : (
                    <span >
                      {userSignature}
                    </span>
                  )
              }
              {
                !isEdit &&
                <Icon type="edit" onClick={() => handleEdit()} style={{ color: "skyblue" }} />
              }

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
        <div className={s.dragBarLeft}>
          {
            state.fileName.map((item, index) => ( // 文件图标
              <div className={s.sigleFile} key={index} onClick={handleFileClick} onDoubleClick={(event) => handleFileDoubleClick(event, index)} >
                <Icon type="file-excel" style={{ color: "green", fontSize: 40 }} />
                <span className={s.sigleFileName}>{item}</span>
              </div>
            ))
          }
        </div>

        <div className={s.dragBarRight}>
          <Upload {...upLoadProps} >
            <Button>
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? '上传中' : '开始上传'}
          </Button>
        </div>
      </div>
    </div>
  )
}



export const App: React.FC<IAppProps> = (props: IAppProps) => {
  const { history } = props
  const [isMaximized, setIsMaximized] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const { Header, Sider, Content } = Layout
  const { SubMenu } = Menu

  const countTime = (time: String) => {
    const date = new Date()
    const [beginHours, beginMinutes] = time.split(':')
    const currentHours = date.getHours()
    const currentMinutes = date.getMinutes()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1
    const currentDay = date.getDay()
    const learningTime = (currentHours - Number(beginHours)) * 60 + currentMinutes - Number(beginMinutes)
    const DATE = currentYear + '-' + currentMonth + '-' + currentDay
    axios.post('http://localhost:3001/api/postUserTime', {
      username: localStorage.getItem('username'),
      date: DATE,
      time: learningTime
    })
  }

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
      case 'close': {
        browserWindow.hide()
        let beginTime = localStorage.getItem('beginTime')
        if (beginTime)
          countTime(beginTime)
        break;
      }

      default:
        break;
    }
  }, [])

  const switchPath = useCallback((props: {
    key: string;
    keyPath: Array<string>;
  }) => {
    const { keyPath } = props
    console.log(keyPath)
    const path = keyPath.reverse().reduce((prev, next) => {
      return prev + '/' + next
    })
    history.push('/' + path)
  }, [])

  const handleMainClick = useCallback(() => {
    history.push('/')
    setOpenKeys([])
    setSelectedKeys([])
  }, [])

  return (
    <div className={s.main} >
      <Sider>
        <div className={s.appName} onClick={handleMainClick}>
          <div className={s.appTrueName}>
            wordbook
          </div>
        </div>
        <Menu
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onClick={switchPath}
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu
            key="user"
            onTitleClick={() => setOpenKeys(['user'])}
            title={
              <span>
                <Icon type="user" />
                  用户中心
                </span>
            }
          >
            <Menu.Item key="user" onClick={() => setSelectedKeys(['user'])} >设置个人资料</Menu.Item>
            <Menu.Item key="progress" onClick={() => setSelectedKeys(['progress'])} >学习进度</Menu.Item>
            <Menu.Item key="logout" onClick={() => setSelectedKeys(['logout'])} >退出登陆</Menu.Item>
            <Menu.Item key="setting" onClick={() => setSelectedKeys(['setting'])} >设置</Menu.Item>
          </SubMenu>
          <SubMenu
            key="toLearn"
            onTitleClick={() => setOpenKeys(['toLearn'])}
            title={
              <span>
                <Icon type="laptop" />
                  开始学习
                </span>
            }
          >
            <Menu.Item key="reading" onClick={() => setSelectedKeys(['reading'])} >阅读模式</Menu.Item>
            <Menu.Item key="words" onClick={() => setSelectedKeys(['words'])} >题库模式</Menu.Item>
            <Menu.Item key="loading" onClick={() => setSelectedKeys(['loading'])} >导入题库</Menu.Item>
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
            <Route path="/" exact component={Home} />
            <Route path="/user/user" exact component={UserSetting} />
            <Route path="/user/progress" exact component={LearningProgress} />
          </Switch>
        </Content>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </div>
  )
};
