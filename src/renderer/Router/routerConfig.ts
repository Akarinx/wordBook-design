import { lazy, LazyExoticComponent } from 'react'
interface IRouter {
  path: string;
  component: LazyExoticComponent<any>;
  auth?: boolean;
  children?: IRouter;
}
export const router: IRouter[] = [
  {
    path: '/',
    component: lazy(() => import('@/components/App')),
    auth: true
  },
  {
    path: '/login',
    component: lazy(() => import('@/components/Login')),
  }
]
export default router