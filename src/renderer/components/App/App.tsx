import React, { useCallback, useState } from 'react';
import { Button } from 'antd'
import fs from 'fs'
import { remote } from 'electron'
import { Link, match } from 'react-router-dom'
import s from "./App.module.scss"


interface IAppProps {
  history: any;
  location: any;
  match: match;
  staticContext?: any;
}

export const App: React.FC<IAppProps> = (props: IAppProps) => {
  const [file, setFile] = useState('')
  const readTxtFileData = async () => {
    const res = await remote.dialog.showOpenDialog({
      title: '选择txt',
    })
    fs.readFile(res.filePaths[0], 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
      } else {
        setFile(data.replace(/\n|\r\n/g, '<br/>'))
      }
    })
  }
  return (
    <div className={s.Wrapper} >
      <Link to="/login">toLogin</Link>
      <div>Hello World!</div>
      <div>
        <Button type='danger' onClick={readTxtFileData}>读文件内容</Button>
        <Button type='dashed' onClick={useCallback(() => { setFile('') }, [])}>refresh</Button>
      </div>

      <div dangerouslySetInnerHTML={{ __html: file }} />
    </div>
  )
};
