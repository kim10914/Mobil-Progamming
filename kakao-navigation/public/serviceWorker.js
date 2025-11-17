const CACHE_NAME = 'kakao-nav-cache-v1'; // 캐시 이름
const OFFLINE_URL = '/offline.html'; // 오프라인 fallback 페이지

const CORE_ASSETS = [
    '/',
    '/index.html',
    OFFLINE_URL,
    '/manifest.webmanifest',
    '/favicon.svg'
];

// 설치 단계: 핵심 리소스 사전 캐싱
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_ASSETS);
        })
    );
});

// 활성화 단계: 이전 캐시 정리
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key); // 오래된 캐시 삭제
                    }
                    return null;
                })
            )
        )
    );
});

// fetch 이벤트: 네비게이션 요청에 대해 네트워크 실패 시 오프라인 페이지 제공
self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match(OFFLINE_URL); // 오프라인 시 offline.html 제공
            })
        );
        return;
    }

    // 그 외 정적 리소스는 cache-first 전략
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone); // 새 응답 캐싱
                    });
                    return response;
                })
                .catch(() => {
                    // 필요 시 추가 fallback 로직
                    return new Response('', { status: 404 });
                });
        })
    );
});
