/* eslint-disable react/display-name */
import * as React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Icon, Input, Table } from 'antd'
import axios from 'axios';
import s from './LearningType.module.scss';
import { context, IContext } from '@/store/reducer';
const csv = require('csvtojson');
interface ILearningType {
  match: any;
}
export const LearningType: React.FC<ILearningType> = (props) => {
  const { state, dispatch } = useContext<IContext>(context)
  const { user } = state
  const { match } = props
  const filename = match.params.fileName
  let searchInput = useRef<Input | null>()
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')

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

  const getColumnSearchProps = dataIndex => ({

    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => searchInput.current = node}
          placeholder={`查询 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          查询
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          if (searchInput.current) {
            searchInput.current.select()
          }
        });
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };

  const columns = [
    {
      title: '题目',
      dataIndex: 'question',
      key: 'question',
      ...getColumnSearchProps('question')
    },
    {
      title: "选项",
      children: [
        {
          title: 'A选项',
          dataIndex: "optionA",
          key: "optionA",
          ...getColumnSearchProps('optionA')
        },
        {
          title: 'B选项',
          dataIndex: "optionB",
          key: "optionB",
          ...getColumnSearchProps('optionB')
        },
        {
          title: 'C选项',
          dataIndex: "optionC",
          key: "optionC",
          ...getColumnSearchProps('optionC')
        },
        {
          title: 'D选项',
          dataIndex: "optionD",
          key: "optionD",
          ...getColumnSearchProps('optionD')
        },
      ]
    },
    {
      title: "答案",
      dataIndex: "answer",
      key: "answer",
      ...getColumnSearchProps('answer')
    }
  ]



  return (
    <div className={s.Wrapper}>
      <div className={s.main}>
        <Table dataSource={data} columns={columns} size="middle" bordered={true} pagination={{ pageSize: 8, defaultPageSize: 8, hideOnSinglePage: true }} />
      </div>

    </div>
  )
}