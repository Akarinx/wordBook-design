import { Collapse, Icon, Input, message, Steps } from 'antd';
import React, { useCallback, useContext, useRef } from 'react';
import { context, IContext } from '@/store/reducer'
import { useState } from 'react';
import s from './Todolist.module.scss'
import Item from 'antd/lib/list/Item';
export interface TodolistProps {

}

export interface TodoHeaderProps {
  todoHeader: string;
  todotype: 'todo' | 'pending' | 'finished' | '';
}

const { Panel } = Collapse;
const { Step } = Steps
export const Todolist: React.FC<TodolistProps> = () => {
  const { state, dispatch } = useContext<IContext>(context)
  const { todos } = state
  const input = useRef<Input>(null)
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
  const changeType = (key, todoType) => {
    dispatch({
      type: 'CHANGE_TODO_TYPE',
      payload: {
        key,
        todoType
      }
    })
  }

  return (<>
    <div className={s.TodolistWrapper}>
      <Input ref={input} placeholder="请输入待办" onPressEnter={() => {
        if (input.current) {
          dispatch({
            type: 'ADD',
            payload: { todoName: input.current.input.value, todoType: 'todo' }
          })
          input.current.input.value = ''
        }
      }} />
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        {
          todos.map(item =>
            (
              <Panel header={<TodoHeader todoHeader={item.todoName} todotype={item.todoType} />} key={item.key} style={customPanelStyle}>
                <Steps size="small" current={type2current[item.todoType]}>
                  <Step title="Todo" icon={<Icon type="user" onClick={() => changeType(item.key, 'todo')} />} />
                  <Step title="Pendding" icon={<Icon type="fire" onClick={() => changeType(item.key, 'pending')} />} />
                  <Step title="Done" icon={<Icon type="smile-o" onClick={() => changeType(item.key, 'finished')} />} />
                </Steps>
              </Panel>
            ))
        }

      </Collapse>
    </div>
  </>);
}

const TodoHeader: React.FC<TodoHeaderProps> = (props) => {
  const { todoHeader, todotype } = props
  return (
    <span className={s.todoHeaderWrapper}>
      {todoHeader}
      <span className={s.todoHeaderIcon}>
        {
          todotype === 'todo' && (
            <Icon type="line" />
          ) ||
          todotype === 'pending' && (
            <Icon type="loading" />
          ) ||
          todotype === 'finished' &&
          (
            <Icon type="check" />
          )
        }
      </span>

    </span>
  )
}
