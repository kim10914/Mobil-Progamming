import { AppLayout } from './components/layout/AppLayout';
import { useLiveNavigation } from './hooks/useLiveNavigation';
import { useRouteDirections } from './hooks/useRouteDirections';
import { useUserLocation } from './hooks/useUserLocation';

// 최상위 App 컴포넌트
export default function App() {
  useRouteDirections(); // 출발/도착 변경 시 Directions API 호출 + fallback
  useUserLocation(); // 현재 위치 기반 출발지 기본값
  useLiveNavigation(); // 안내 시작 시 실시간 위치 추적

  return <AppLayout />;
};
