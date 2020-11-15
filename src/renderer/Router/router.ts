import { App } from '@/components/App'
import { Login } from '@/components/Login/Login'
interface IRouter {
  path: string;
  component: any;
  auth?: boolean;
  children?: IRouter;
}
export const router: IRouter[] = [
  {
    path: '/',
    component: App,
    auth: true
  },
  {
    path: '/login',
    component: Login,
  }
]
export default router