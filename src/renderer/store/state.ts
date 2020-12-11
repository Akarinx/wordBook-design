export interface IInitstate {
  point: number,
  token: string | null,
  fileName: string[]
}


export const initstate: IInitstate = {
  point: 0,
  token: localStorage.getItem('token'),
  fileName: []
}

