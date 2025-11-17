import { AppLayout } from './components/layout/AppLayout';
import { useLiveNavigation } from './hooks/useLiveNavigation';
import { useRouteCalculator } from './hooks/useRouteCalculator';
import { useUserLocation } from './hooks/useUserLocation';

// 최상위 App 컴포넌트
export default function App(){
  useRouteCalculator(); // 출발/도착 변경 시 거리/시간 계산
  useUserLocation(); // 추가: 앱 진입 시 한 번 현재 위치를 받아 출발지 기본값으로 사용
  useLiveNavigation(); // 추가: 안내 시작 시 실시간 위치 추적

  useRouteCalculator(); // 출발/도착 변경 시 거리/시간 계산

  return <AppLayout />;
};
