import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import { context, IContext } from '@/store/reducer';
import s from './Done.module.scss'

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
  const { user } = state
  const [data, setData] = useState<singleData[]>([])
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

  return (
    <div className={s.Wrapper}>
      Done
    </div>
  )
}