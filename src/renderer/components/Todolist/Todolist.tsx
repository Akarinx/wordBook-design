import { Button, Collapse, Icon, Input, message, Steps, Tooltip } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { context, IContext } from '@/store/reducer'
import classnames from 'classnames'
import s from './Todolist.module.scss'
export interface TodolistProps {
  setTodoNum: any;
}

export interface TodoHeaderProps {
  todoHeader: string;
  todotype: 'todo' | 'pending' | 'finished' | '';
  value: number;
  handleCancel: (key: number) => void;
  handleActive: (key: number) => void
}

const { Panel } = Collapse;
const { Step } = Steps
const customPanelStyle = {
  background: '#fff1b8', // gold-2
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
};
const type2current = {
  'todo': 0,
  'pending': 1,
  'finished': 2
}

export const Todolist: React.FC<TodolistProps> = (props) => {
  const { setTodoNum } = props
  const { state, dispatch } = useContext<IContext>(context)
  const { todos } = state
  const [nowType, setNowType] = useState<'todo' | 'pending' | 'finished' | ''>('')
  const input = useRef<Input>(null)
  const [activeArr, setActiveArr] = useState<number[]>([])

  useEffect(() => {
    setTodoNum(todos.length)
  }, [todos.length])


  const handleCancel = (key: number) => {
    dispatch({
      type: "DELETE_TODO",
      payload: {
        key
      }
    })
  }
  const handleActive = (key: number) => {
    const index = activeArr.indexOf(key)
    console.log(index)
    if (index < 0) {
      activeArr.push(key)
    } else {
      activeArr.splice(index, 1)
    }
    setActiveArr([...activeArr])
  }

  const changeType = (key: number, todoType) => {
    dispatch({
      type: 'CHANGE_TODO_TYPE',
      payload: {
        key,
        todoType
      }
    })
  }

  const TodosFilter = (type) => {
    nowType === type ? setNowType('') : setNowType(type)
  }

  return (<>
    <div className={s.TodolistWrapper}>
      <div className={s.TodolistHead}>
        <div className={s.TodolistInput}>
          <Input
            allowClear
            ref={input}
            placeholder={`请输入待办,共${todos.length}个待办`}
            suffix={
              <Tooltip title="计划通">
                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
            onPressEnter={() => {
              if (input.current) {
                if (input.current.input.value === "") {
                  message.error('待办不可为空')
                  return
                }
                dispatch({
                  type: 'ADD',
                  payload: { todoName: input.current.input.value, todoType: 'todo' }
                })
                input.current.setValue('')
              }
            }} />
        </div>
        <div className={s.TodolistButton}>
          <Icon type="frown" theme="twoTone" twoToneColor={nowType === 'todo' ? '#eb2f96' : '#52c41a'} className={s.IconsStyle} onClick={() => TodosFilter('todo')} />
          <Icon type="fire" theme="twoTone" twoToneColor={nowType === 'pending' ? '#eb2f96' : '#52c41a'} className={s.IconsStyle} onClick={() => TodosFilter('pending')} />
          <Icon type="check-circle" theme="twoTone" twoToneColor={nowType === 'finished' ? '#eb2f96' : '#52c41a'} className={s.IconsStyle} onClick={() => TodosFilter('finished')} />
          <Button type="danger" onClick={() => { setActiveArr([]) }} >全部折叠</Button>
        </div>
      </div>

      <div>
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          activeKey={activeArr}
        >
          {todos.filter(item => {
            if (nowType === '') {
              return true
            } else {
              return item.todoType === nowType
            }
          })
            .map((item, index) =>
            (
              <Panel header={<TodoHeader todoHeader={item.todoName} todotype={item.todoType} value={item.key} handleCancel={handleCancel} handleActive={handleActive} />} key={item.key} style={customPanelStyle}>
                <Steps size="small" current={type2current[item.todoType]}>
                  <Step title="Todo" icon={<Icon type="user" />} onClick={() => { changeType(item.key, 'todo'); setTimeout(() => { handleActive(item.key) }, 300) }} style={{ cursor: "pointer" }} />
                  <Step title="Pendding" icon={<Icon type="fire" />} onClick={() => { changeType(item.key, 'pending'); setTimeout(() => { handleActive(item.key) }, 300) }} style={{ cursor: "pointer" }} />
                  <Step title="Done" icon={<Icon type="smile-o" />} onClick={() => { changeType(item.key, 'finished'); setTimeout(() => { handleActive(item.key) }, 300) }} style={{ cursor: "pointer" }} />
                </Steps>
              </Panel>
            ))}
        </Collapse>
      </div>
    </div>
  </>);
}

const TodoHeader: React.FC<TodoHeaderProps> = (props) => {
  const { todoHeader, todotype, handleCancel, value, handleActive } = props

  return (
    <div className={s.todoHeaderWrapper} onClick={() => handleActive(value)}>
      <div>
        {todoHeader}
        <span className={s.todoHeaderIcon}>
          {
            todotype === 'todo' && (
              <Icon type="line" style={{ color: "blue" }} />
            ) ||
            todotype === 'pending' && (
              <Icon type="loading" style={{ color: "red" }} />
            ) ||
            todotype === 'finished' &&
            (
              <Icon type="check" style={{ color: "green" }} />
            )
          }
        </span>
      </div>
      <div className={s.todoHeaderCancel} onClick={() => handleCancel(value)} >
        <Icon type="delete" />
      </div>


    </div>
  )
}
