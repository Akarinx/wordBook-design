import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import { context, IContext } from '@/store/reducer';
import s from './Done.module.scss'
import { Button, Icon, Pagination } from 'antd';
import * as echarts from 'echarts';
import { store } from '@/components/App/App'
const csv = require('csvtojson');

interface singleData {
  key: number;
  question: string;
  answer: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD?: string;
}

interface IDone {
  match: any
}

export const Done: React.FC<IDone> = (props) => {
  const { match } = props
  const { state, dispatch } = useContext<IContext>(context)
  const { user, data, answer } = state
  const [page, setPage] = useState(0)
  const [correctAns, setCorrectAns] = useState(0)
  const [ansOptions, setAnsOptions] = useState({})
  const [userOptions, setUserOptions] = useState({})
  const filename = match.params.fileName
  const realAnswer = {}
  let wrongAns: singleData[] = []
  useEffect(() => {
    const date = new Date()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1
    const currentDay = date.getDay()
    const DATE = currentYear + '-' + currentMonth + '-' + currentDay
    let ans = 0, ansObj = { 'A': 0, 'B': 0, 'C': 0, 'D': 0 }, userObj = { 'A': 0, 'B': 0, 'C': 0, 'D': 0 }
    data.forEach(item => {
      realAnswer[item.key] = item.answer
      ansObj[item.answer]++
    })
    for (let i = 0; i < data.length; i++) {
      if (answer[i]) {
        userObj[answer[i]]++
      }
      if (realAnswer[i] === answer[i]) {
        ans++
      } else {
        wrongAns.push(data[i])
      }
    }
    axios.post('http://localhost:3001/api/postUserWords', {
      username: localStorage.getItem('username'),
      date: DATE,
      Counter: wrongAns.length
    })

    setAnsOptions(ansObj)
    setUserOptions(userObj)
    setCorrectAns(ans)
    // if (store.get('wrongQues')) {
    //   console.log(store.get('wrongQues'), 111)
    // } else {
    //   store.set('wrongQues', wrongAns)
    //   console.log(store.get('wrongQues'), 123)
    // }

    return () => {
      dispatch({
        type: "CLEAR_ANSWER",
        payload: ""
      })
    }

  }, [])

  useEffect(() => {
    const option = {
      title: {
        text: '答案对比',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['试题答案', '个人答案']
      },
      toolbox: {
        show: true,
        feature: {
          magicType: { show: true, type: ['line', 'bar'] },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: ['选项A', '选项B', '选项C', '选项D']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '试题答案',
          type: 'bar',
          data: Object.values(ansOptions),

        },
        {
          name: '个人答案',
          type: 'bar',
          data: Object.values(userOptions),
        }
      ]
    };
    let chartDom = document.getElementById('container');
    if (chartDom) {
      let myChart = echarts.init(chartDom);
      myChart.setOption(option);
    }
  }, [ansOptions, userOptions])

  return (
    <div className={s.Wrapper}>
      <div className={s.main} >
        <div className={s.Top}>
          <div className={s.leftAnalyze}>
            <div className={s.correctAns}>
              <Icon type="pie-chart" />
            得分:{Math.ceil((correctAns / data.length) * 100)}
            </div>
            <div className={s.examFont}>
              试题:{filename}
            </div>
            <div className={s.examFont}>
              正确题数:{correctAns} / {data.length}
            </div>
          </div>
          <div id="container" className={s.rightAnalyze} >
            这里应有图
          </div>
        </div>
        <div className={s.Bottom}>
          <Pagination
            style={{ alignSelf: "center" }}
            defaultCurrent={page + 1}
            current={page + 1}
            total={data.length}
            defaultPageSize={1}
            onChange={(page) => setPage(page - 1)} />
          <div className={s.ques}>
            {
              data.slice(page, page + 1).map((item, index) => {
                return (
                  <div className={s.quesMain} key={index}>
                    <div className={s.q}>
                      题目:{item.question}
                    </div>
                    <div className={s.a}>
                      <div className={s.userAns}>
                        正确答案:{item.answer} 你的答案:{answer[page] === undefined ? "无" : answer[page]}&nbsp;
                        {
                          item.answer !== answer[page] ? (
                            <>
                              <Button type="danger" style={{ cursor: "default" }}>错误</Button>
                            </>) : (
                            <>
                              <Button type="primary" style={{ cursor: "default" }}>正确</Button>
                            </>
                          )

                        }
                      </div>
                      <div className={s.showAns}>
                        答案解析:
                        <div className={s.trueAns}>
                          {
                            (() => {
                              switch (item.answer) {
                                case 'A':
                                  return (
                                    <>
                                      {item.optionA}
                                    </>
                                  )
                                case 'B':
                                  return (
                                    <>
                                      {item.optionB}
                                    </>
                                  )
                                case 'C':
                                  return (
                                    <>
                                      {item.optionC}
                                    </>
                                  )
                                case 'D':
                                  return (
                                    <>
                                      {item.optionD}
                                    </>
                                  )
                                default: return (
                                  <>
                                    空数据
                                  </>
                                )
                              }
                            })()
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}