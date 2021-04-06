import { singleData } from '@/store/state';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Empty, Menu, Table } from 'antd';
import s from './WrongQuestionBook.module.scss'
import { store } from '../App/App';

interface IWrongQuestionBook {

}

export const WrongQuestionBook: React.FC<IWrongQuestionBook> = () => {
  const [type, setType] = useState('favourite')
  const [data, setData] = useState<singleData[] | []>([])

  const handleClick = e => {
    setType(e.key)
  }

  useEffect(() => {
    let preData
    if (type !== 'favourite') {
      preData = store.get('wrongQuestionBook')
    } else {
      preData = store.get('favoriteQuestionBook')
    }
    preData = preData.map((item, index) => {
      item['key'] = index
      return item
    })
    setData(preData)
  }, [type])

  const columns = [
    {
      title: '题目',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: "选项",
      children: [
        {
          title: 'A选项',
          dataIndex: "optionA",
          key: "optionA",
        },
        {
          title: 'B选项',
          dataIndex: "optionB",
          key: "optionB",
        },
        {
          title: 'C选项',
          dataIndex: "optionC",
          key: "optionC",
        },
        {
          title: 'D选项',
          dataIndex: "optionD",
          key: "optionD",
        },
      ]
    },
    {
      title: "答案",
      dataIndex: "answer",
      key: "answer",
    }
  ]
  return (
    <div className={s.Wrapper}>
      <Menu onClick={handleClick} selectedKeys={[type]} mode="horizontal">
        <Menu.Item key="favourite">
          收藏
        </Menu.Item>
        <Menu.Item key="wrong">
          错题
        </Menu.Item>
      </Menu>
      <div className={s.main}>
        {
          data.length !== 0 ? (
            <>
              <Table dataSource={data} columns={columns} size="middle" bordered={true} pagination={{ pageSize: 5, defaultPageSize: 5, hideOnSinglePage: true }} />
            </>
          ) : (
            <div className={s.empty}>
              <Empty />
            </div>
          )
        }
      </div>

    </div>
  )
}