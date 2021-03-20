import axios from 'axios'
export const getUserFolder:()=>Promise<[string] | []> = async () => {
  let res
  try {
    res = await axios.get('http://localhost:3001/api/getUserFolder', {
      params: {
        username:localStorage.getItem('username')
      },
    })
  } catch (e) {
    res = {
      data: []
    }
  }
  res = JSON.parse(res.data.data)
  return res
}

export const getUserDetail = async () => {
  let res
  try {
    res = await axios.post('http://localhost:3001/api/userDetail', {
      username: localStorage.getItem('username')
    })
  } catch (e) {
    res = {
      data: {
        data:[]
      }
    }
  }
  return res.data.data[0]
}

export const getTranslate = async (text) => {
  let res
  try {
    res = await axios.get('http://localhost:3001/api/getTranslate', {
      params: {
        text
      },
    })
  } catch (e) {
    res = {
      data: {
        data: {
          src: text,
          tgt:'无法连接互联网'
        }
      }
    }
  }
  return res.data.data
}