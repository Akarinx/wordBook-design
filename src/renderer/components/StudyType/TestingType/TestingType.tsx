import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import s from './TestingType.module.scss'
import { context, IContext } from '@/store/reducer';
import axios from 'axios'
import { Button, Empty, Icon, Modal, PageHeader, Pagination } from 'antd';
import { singleData } from '@/store/state';
const csv = require('csvtojson');
interface ITestingType {
  match: any;
  history: any;
}
export const TestingType: React.FC<ITestingType> = (props) => {
  const { state, dispatch } = useContext<IContext>(context)
  const { user, data } = state
  const { match, history } = props
  const [page, setPage] = useState(0)
  let nowFile = match.params.fileName === 'null' && !state.nowFileName ? false : true
  const filename = state.nowFileName ? state.nowFileName : match.params.fileName

  useEffect(() => {
    console.log(nowFile)

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
    if (answer !== data[key].answer) {
      Modal.warning({
        title: "OOOps!",
        content: `正确答案为${data[key].answer}`
      })
    }
  }

  const onNextPage = (page: number) => {
    setPage(page)
  }

  const onFinish = () => {
    const quesNum = Object.keys(state.answer).length
    const modalObj = {
      title: `题还没做完哦`,
      content: `还有${data.length - quesNum}题没做,确定返回吗`,
      onOk: () => {
        history.push(`/`)
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
                subTitle="自测模式"
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