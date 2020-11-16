export interface IInitstate {
  point: number,
  token: string | null
}


export const initstate: IInitstate = {
  point: 0,
  token: localStorage.getItem('token')
}

