import { lazy, LazyExoticComponent } from 'react'
interface IRouter {
  path: string;
  component: LazyExoticComponent<any>;
  auth?: boolean;
  exact: boolean;
  children?: IRouter;
}
export const router: IRouter[] = [
  {
    path: '/login',
    exact: true,
    component: lazy(() => import('@/components/Login')),
  },
  {
    path: '/',
    component: lazy(() => import('@/components/App')),
    exact: false, //非严格模式，放在最后避免被优先匹配
    auth: true
  }
]
export default router