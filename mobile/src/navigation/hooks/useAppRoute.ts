import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

export const useAppRoute = <RouteName extends keyof RootStackParamList>() => {
  return useRoute<RouteProp<RootStackParamList, RouteName>>();
};
