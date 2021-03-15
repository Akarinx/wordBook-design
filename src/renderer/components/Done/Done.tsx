import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import { context, IContext } from '@/store/reducer';
import s from './Done.module.scss'
import { Icon } from 'antd';
import * as echarts from 'echarts';

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
  const [correctAns, setCorrectAns] = useState(0)
  const [ansOptions, setAnsOptions] = useState({})
  const [userOptions, setUserOptions] = useState({})
  const filename = match.params.fileName
  const realAnswer = {}
  let wrongAns: number[] = []
  useEffect(() => {
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
        wrongAns.push(i)
      }
    }
    setAnsOptions(ansObj)
    setUserOptions(userObj)
    setCorrectAns(ans)

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
          答案分析
        </div>
      </div>
    </div>
  )
}