import { RootStackParamList } from '../types';

export type RootRouteName = keyof RootStackParamList;

export type RouteParams<RouteName extends RootRouteName> =
  RootStackParamList[RouteName];
