import * as React from 'react';
import { useState, useEffect } from 'react';
import { Icon } from 'antd';
import { remote, ipcRenderer, BrowserWindow } from 'electron'
import s from './smallWindow.module.scss'
import classnames from 'classnames'
import { getTranslate } from '../../requests'
import { store } from '@/components/App/App'
export const smallWindow: React.FC<any> = () => {
  const [hover, setHover] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [text, setText] = useState('')
  const [trans, setTrans] = useState('')
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout | null = null
  const handleClose = () => {
    const browserWindow: BrowserWindow = remote.getCurrentWindow()
    timer && clearInterval(timer)
    browserWindow.destroy()
  }

  const handleOpen = () => {
    ipcRenderer.send('openMainWindow')
  }
  const handleFavorites = () => {
    console.log(store.get('wordStorage'), store.get('sentenceStorage'), 'aaaa')
    if (text) { // text不为空
      let newText = text.replace(/(^\s*)|(\s*$)/g, "")
      if (newText.indexOf(' ') === newText.lastIndexOf(' ')) { //为单词
        const wordStorage = store.get('wordStorage')
        if (wordStorage) {
          wordStorage[0].push({ word: newText, trans })
          store.set('wordStorage', wordStorage)
        }
      } else { //为词组/句子
        const sentenceStorage = store.get('sentenceStorage')
        if (sentenceStorage) {
          sentenceStorage[0].push({ word: newText, trans })
          store.set('sentenceStorage', sentenceStorage)
        }
      }
    }
    setFavorite(prev => !prev)
  }
  const handleShare = () => {
    window.open(`https://www.baidu.com/s?ie=UTF-8&wd=${text}`)
  }

  useEffect(() => {
    const { clipboard } = remote
    timer = setInterval(() => {
      let newText = clipboard.readText()
      console.log(newText)
      if (text === newText) {
        console.log('same')
      } else {
        setText(newText);
        setFavorite(false);
        (async () => {
          let res = await getTranslate(newText)
          console.log(res)
          setTrans(res.tgt)
        })()
      }
    }, 2000)
    return () => {
      timer && clearInterval(timer)
    }
  }, [text])

  return (
    <div className={s.Wrapper}>
      <div className={s.main}>
        <div className={s.user}>
          <img style={{ userSelect: 'none', width: "50px", height: "50px" }} src={`http://localhost:3001/${localStorage.getItem('username')}/Avatar.png`} />
        </div>
        <div className={s.drag} />
        <div className={s.translation}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}>
          <span className={s.text}>
            {text} :
          </span>
          <span className={s.trans} >
            {trans}
          </span>
          <div
            className={classnames(s.controllers, {
              [s.hover]: hover,
              [s.unHover]: !hover
            })}
          >
            <Icon
              type="book"
              style={{ cursor: "pointer" }}
              className={classnames({ [s.active]: favorite })}
              onClick={handleFavorites} />
            <Icon type="select" style={{ cursor: "pointer", color: "#69c0ff" }} onClick={handleShare} />
          </div>
        </div>
        <div className={s.buttons}>
          <Icon type="close" style={{ cursor: "pointer", color: "#69c0ff" }} onClick={handleClose} />
          <Icon type="arrows-alt" style={{ cursor: "pointer", color: "#d48806" }} onClick={handleOpen} />
        </div>
      </div>
    </div>
  )
}