import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { BrowserWindow, ipcRenderer, remote } from 'electron'
import { Button, Empty, Icon, Modal, PageHeader, Pagination } from 'antd'
import s from './ExamingType.module.scss'
import axios from 'axios';
import { context, IContext } from '@/store/reducer';
const csv = require('csvtojson');
interface IExamingType {
  match: any;
  history: any
}
interface singleData {
  key: number;
  question: string;
  answer: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD?: string;
}

export const ExamingType: React.FC<IExamingType> = (props) => {
  const { state, dispatch } = useContext<IContext>(context)
  const { user, data } = state
  const { match, history } = props
  const [page, setPage] = useState(0)
  let nowFile = match.params.fileName === 'null' && !state.nowFileName ? false : true
  const filename = state.nowFileName ? state.nowFileName : match.params.fileName
  const { globalShortcut } = remote

  //处理electron事件
  useEffect(() => {
    nowFile && globalShortcut.register('Left', () => {
      if (page !== 0) {
        setPage(page - 1)
      }
    })
    nowFile && globalShortcut.register('Right', () => {
      setPage(page + 1)
    })
    nowFile && ipcRenderer.on('windowBlur', () => {
      const browserWindow: BrowserWindow = remote.getCurrentWindow()
      browserWindow.setAlwaysOnTop(true)
      browserWindow.moveTop()
      Modal.confirm({
        title: `注意`,
        content: `不要打开其他窗口,点击确定返回主页`,
        onOk: () => {
          history.push(`/`)
          browserWindow.setAlwaysOnTop(false)
        },
        onCancel: () => {
          browserWindow.setAlwaysOnTop(false)
        }
      })
    })
    return () => {
      const { globalShortcut } = remote
      ipcRenderer.removeAllListeners('windowBlur')
      globalShortcut.unregister('Right')
      globalShortcut.unregister('Left')
    }
  }, [page])

  //处理文件内容
  useEffect(() => {
    nowFile && dispatch({
      type: "ADD_NOWFILENAME",
      payload: filename
    })
    const questionsColumns: string[] = ['question', 'answer', 'optionA', 'optionB', 'optionC', 'optionD'];
    nowFile && (async () => {
      let res = await axios.get(`http://localhost:3001/${user.userName}/${filename}`)
      let csvRow = await csv({
        output: "csv"
      }).fromString(res.data)
      if (Array.isArray(csvRow)) {
        csvRow = csvRow.map((section, index) => {
          const obj = { key: index }
          if (Array.isArray(section)) {
            section.forEach((item, index) => {
              obj[questionsColumns[index]] = item
            })
          }
          return obj
        })
      }
      console.log(csvRow)
      dispatch({
        type: "ADD_DATA",
        payload: csvRow
      })
    })()
  }, [])

  const onOptionClick = (ans: {
    key: number;
    answer: string
  }) => {
    const { key, answer } = ans
    dispatch({
      type: "EDIT_ANSWER",
      payload: {
        key,
        answer
      }
    })
  }

  const onNextPage = (page: number) => {
    setPage(page)
  }

  const onFinish = () => {
    const quesNum = Object.keys(state.answer).length
    const modalObj = {
      title: `题还没做完哦`,
      content: `还有${data.length - quesNum}题没做,确定提交吗`,
      onOk: () => {
        history.push(`/toLearn/done/${filename}`)
      }
    }
    Modal.confirm(modalObj)
  }

  const onBackClick = () => {
    const quesNum = Object.keys(state.answer).length

    const modalObj = {
      title: `要休息一下吗`,
      content: `还有${data.length - quesNum}题没做`,
      onOk: () => {
        history.push('/')
      }
    }
    Modal.confirm(modalObj)
  }
  return (
    <div className={s.Wrapper}>
      <div className={s.main}>
        {
          nowFile ? (<>
            <div className={s.title}>
              <PageHeader
                style={{
                  borderBottom: '1px solid rgb(235, 237, 240)',
                }}
                backIcon={false}
                title={`${filename.split('.')[0]}`}
                subTitle="考试模式"
                extra={<TimeCounter onTimeCounterClick={onBackClick} />}
              />
            </div>
            <div className={s.body}>
              {
                data.slice(page, page + 1).map((item, index) => {
                  return (
                    <ExamingMain
                      key={index}
                      singleQuestion={item}
                      total={data.length}
                      onOptionClick={onOptionClick}
                      onNextPage={onNextPage}
                      onFinish={onFinish}
                    />)
                })
              }
              <div className={s.pager}>
                <Pagination
                  defaultCurrent={page + 1}
                  current={page + 1}
                  total={data.length}
                  defaultPageSize={1}
                  onChange={(page) => setPage(page - 1)} />
              </div>
            </div>
          </>) : (<div className={s.Empty}>
            <Empty />
          </div>)

        }

      </div>
    </div>
  )
}

interface IExamingMain {
  singleQuestion: singleData;
  total: number;
  onOptionClick: (obj: {
    key: number,
    answer: string
  }) => void;
  onNextPage: (page: number) => void;
  onFinish: () => void;
}

const ExamingMain: React.FC<IExamingMain> = (props) => {
  const { singleQuestion, total, onOptionClick, onNextPage, onFinish } = props
  const { key, question, answer, optionA, optionB, optionC, optionD } = singleQuestion
  return (
    <div className={s.examingMain}>
      <div className={s.examingTitle}>
        {
          `${key + 1}/${total}`
        }
      </div>
      <div className={s.examingBody}>
        <div className={s.examingQuestion}>
          {question}
        </div>
        <div className={s.examingOptions}>
          <Button type="dashed" block={true} style={{ margin: "5px 0", textAlign: "left", fontSize: "16px", height: "35px" }} onClick={() => onOptionClick({ key, answer: 'A' })} >
            {optionA}
          </Button>
          <Button type="dashed" block={true} style={{ margin: "5px 0", textAlign: "left", fontSize: "16px", height: "35px" }} onClick={() => onOptionClick({ key, answer: 'B' })} >
            {optionB}
          </Button>
          <Button type="dashed" block={true} style={{ margin: "5px 0", textAlign: "left", fontSize: "16px", height: "35px" }} onClick={() => onOptionClick({ key, answer: 'C' })} >
            {optionC}
          </Button>
          {
            optionD && (
              <Button type="dashed" block={true} style={{ margin: "5px 0", textAlign: "left", fontSize: "16px", height: "35px" }} onClick={() => onOptionClick({ key, answer: 'D' })} >
                {optionD}
              </Button>
            )
          }
        </div>
        <div className={s.examingHelp}>
          <span className={s.examingHelpOption}>
            <Icon type="bell" />
            <span className={s.examHelper}>
              收藏本题
            </span>
          </span>
          <span className={s.examingHelpOption}>
            <Icon type="global" />
            <span className={s.examHelper}>
              场外求助
            </span>
          </span>
          <div className={s.examingPageChanger}>
            {
              key + 1 === total ? (
                <Button type="danger" block={true} onClick={() => onFinish()} >
                  提交答卷
                </Button>
              ) : (
                <Button type="primary" block={true} onClick={() => onNextPage(key + 1)} >
                  下一题
                </Button>
              )
            }

          </div>
        </div>
      </div>
    </div>
  )
}



interface ITimeCounter {
  onTimeCounterClick: () => void
}

const TimeCounter: React.FC<ITimeCounter> = (props) => {
  const { onTimeCounterClick } = props
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let timer = setInterval(() => {
      if (seconds === 60) {
        setMinutes(prev => prev + 1)
        setSeconds(0)
      } else {
        setSeconds(prev => prev + 1)
      }
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [seconds])

  return (
    <div className={s.timeCounterWrapper} onClick={onTimeCounterClick}>
      <Icon type="pause-circle" />
      <span className={s.timeCounter}>
        {minutes}:{seconds}
      </span>
    </div>
  )
}