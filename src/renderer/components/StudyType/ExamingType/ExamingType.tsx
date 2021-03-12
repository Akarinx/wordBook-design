import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Icon, Modal, PageHeader } from 'antd'
import s from './ExamingType.module.scss'
import axios from 'axios';
import { context, IContext } from '@/store/reducer';
const csv = require('csvtojson');
interface IExamingType {
  match: any;
  history: any
}

export const ExamingType: React.FC<IExamingType> = (props) => {
  const { state, dispatch } = useContext<IContext>(context)
  const { user } = state
  const { match, history } = props
  const [data, setData] = useState([])
  const filename = match.params.fileName

  useEffect(() => {
    const questionsColumns: string[] = ['question', 'answer', 'optionA', 'optionB', 'optionC', 'optionD'];
    (async () => {
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
      setData(csvRow)
    })()
  }, [])

  const onBackClick = () => {
    const modalObj = {
      title: `要休息一下吗`,
      content: "还有5题没做",
      onOk: () => {
        history.push('/')
      }
    }
    Modal.confirm(modalObj)
  }
  return (
    <div className={s.Wrapper}>
      <div className={s.main}>
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