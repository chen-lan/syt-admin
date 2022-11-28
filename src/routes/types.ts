import type { RouteObject } from "react-router-dom";

export interface XMeta {
  icon?: React.ReactNode;
  title?: string;
}
// export interface RouteObject {
//   caseSensitive?: boolean;
//   children?: RouteObject[];
//   element?: React.ReactNode;
//   index?: boolean;
//   path?: string;
// }
export interface XRoute extends RouteObject {
  meta?: XMeta;
  // XRoutes字节点有包含一个路由配置表
  children?: XRoutes;
  hidden?: boolean;
}

export type XRoutes = XRoute[];
