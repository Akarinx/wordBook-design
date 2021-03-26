import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import s from './LearningProgress.module.scss'
import classnames from 'classnames'
import { Card, Icon, Avatar, Modal, Input } from 'antd';
import { store } from '@/components/App/App'
export interface LearningProgressProps {

}

export const LearningProgress: React.FC<LearningProgressProps> = () => {
  const { Meta } = Card;
  const [data, setData] = useState({ 0: [{ word: '', trans: '' }], 1: [{ word: '', trans: '' }], 2: [{ word: '', trans: '' }], 3: [{ word: '', trans: '' }] })
  const [type, setType] = useState(true) // true则为单词,false为句子
  const [dotNum, setDotNum] = useState<0 | 1 | 2 | 3>(0) // 
  const [count, setCount] = useState(0)
  const [modalShow, setModalShow] = useState(false)
  const [nowWord, setNowWord] = useState({ word: '', trans: '' })
  const [correctWriting, setCorrectWriting] = useState(false)
  const input = useRef<Input>(null)

  useEffect(() => {
    let num = 0
    if (type) {
      const wordStorage = store.get('wordStorage')
      Object.values(wordStorage).forEach((item: any) => {
        num += item.length
      })
      setCount(num)
      setData(wordStorage)
    } else {
      const sentenceStorage = store.get('sentenceStorage')
      Object.values(sentenceStorage).forEach((item: any) => {
        num += item.length
      })
      setCount(num)
      setData(sentenceStorage)
    }
  }, [type])

  const changeType = (e) => {
    e.target.value === 'words' ? setType(true) : setType(false)
  }
  const changeDotNum = (num) => {
    return () => setDotNum(num)
  }
  const pushToNext = (word, index) => {
    return () => {
      if (dotNum === 3) return
      data[dotNum].splice(index, 1)
      data[dotNum + 1].push(word)
      if (type) {
        store.set('wordStorage', { ...data })
      } else {
        store.set('sentenceStorage', { ...data })
      }
      setData({ ...data })
    }
  }
  const deleteWord = (word, index) => {
    return () => {
      data[dotNum].splice(index, 1)
      if (type) {
        store.set('wordStorage', { ...data })
      } else {
        store.set('sentenceStorage', { ...data })
      }
      setData({ ...data })
    }
  }
  const handleCardClick = word => {
    setModalShow(true)
    setNowWord(word)
  }
  const handleWriting = e => {
    if (e.target.value === nowWord.word) {
      setCorrectWriting(true)
      setTimeout(() => {
        setModalShow(false)
        setCorrectWriting(false) // 复原
        if (input.current) {
          input.current.setValue('')
        }
      }, 500)
    }
  }
  return (
    <div className={classnames(s.Wrapper, {
      [s.filter]: modalShow
    })}>
      <div className={s.backGround}>
        <div className={s.main}>
          <div className={s.above}>
            <div className={s.switch} onChange={changeType}>
              <input type="radio" name="test" id="words" value="words" defaultChecked={true} />
              <label htmlFor="words">单词</label>
              <input type="radio" name="test" id="sentences" value="sentences" />
              <label htmlFor="sentences">句子</label>
            </div>
            <div className={s.radios}>
              <div className={classnames(s.dot, s.dot0, {
                [s.active]: dotNum === 0
              })} onClick={changeDotNum(0)} />
              <div className={classnames(s.dot, s.dot1, {
                [s.active]: dotNum === 1
              })} onClick={changeDotNum(1)} />
              <div className={classnames(s.dot, s.dot2, {
                [s.active]: dotNum === 2
              })} onClick={changeDotNum(2)} />
              <div className={classnames(s.dot, s.dot3, {
                [s.active]: dotNum === 3
              })} onClick={changeDotNum(3)} />
            </div>
            <div className={s.Counting}>
              <span className={s.countingText}>
                COUNTING {type ? 'WORDS' : 'SENTENCES'}
              </span>
              <h3 className={s.countNumber}>
                {count}
              </h3>
            </div>
          </div>
          <div className={s.bottom}>
            {
              data[dotNum].map((word, index) => {
                const color = ['#cfcfcf', '#f19011', '#ffe82c', '#1bd126']
                return (
                  <Card
                    onClick={() => handleCardClick(word)}
                    key={index}
                    style={{ width: 300, marginRight: "10px", float: "left" }}
                    actions={[
                      <Icon type="smile" key="smile" style={{ color: color[dotNum] }} />,
                      <Icon type="forward" key="pushing" onClick={pushToNext(word, index)} />,
                      <Icon type="delete" key="delete" onClick={deleteWord(word, index)} />
                    ]}
                  >
                    <Meta
                      avatar={<Avatar style={{ backgroundColor: color[dotNum] }} >{word.word}</Avatar>}
                      title={word.word}
                      description={word.trans}
                    />
                  </Card>
                )
              })
            }
          </div>
        </div>
      </div>
      <Modal
        footer={null}
        title={"拼写练习"}
        visible={modalShow}
        onCancel={() => setModalShow(false)}
      >
        <>
          <div style={{ paddingBottom: "10px", fontSize: "15px", color: "#333" }}>
            翻译：{nowWord.trans}
          </div>
          <Input ref={input} onChange={e => handleWriting(e)} />
          <span style={{ paddingTop: "10px", fontSize: "16px", fontWeight: 600, display: "block" }}>
            {
              correctWriting ? "拼写正确！" : "拼写还不正确，请继续尝试"
            }
          </span>
        </>
      </Modal>

    </div>);
}

