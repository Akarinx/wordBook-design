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
