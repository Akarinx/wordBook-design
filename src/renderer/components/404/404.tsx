import * as React from 'react';
import { Link } from 'react-router-dom'
export const Notfound: React.FC = (props: any) => {
  console.error('oops,path: ', props.location.pathname)
  return (
    <div>
      ooops!404 Not Found!
      <Link to="/">回首页</Link>
    </div>
  )
}