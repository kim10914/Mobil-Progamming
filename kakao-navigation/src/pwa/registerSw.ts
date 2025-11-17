// 브라우저에서 Service Worker 를 등록하는 유틸 함수
export const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .catch((err) => {
                console.error('Service Worker 등록 실패:', err); // 등록 실패 시 로그
            });
    });
};
