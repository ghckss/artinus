import { StrictMode } from 'react';
import type { ComponentType } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

// 공용 엔트리: #root[data-service]로 도메인을 식별하고, 해당 페이지만 동적 import 한다.
// 정적 import 대신 import()를 써서 도메인별 코드 스플리팅이 적용된다(방문한 서비스 코드만 로드).
// 신규 도메인은 페이지 컴포넌트를 만들고 아래 loaders와 HTML 한 장만 추가하면 된다.
const loaders: Record<string, () => Promise<ComponentType>> = {
  community: () => import('@/domains/community/page/CommunityPage').then((m) => m.CommunityPage),
  news: () => import('@/domains/news/page/NewsPage').then((m) => m.NewsPage),
  shopping: () => import('@/domains/shopping/page/ShoppingPage').then((m) => m.ShoppingPage)
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('루트 엘리먼트(#root)를 찾을 수 없습니다.');
}

const serviceName = rootElement.dataset.service ?? 'community';
const load = loaders[serviceName] ?? loaders.community;
if (!loaders[serviceName]) {
  console.warn(`알 수 없는 도메인 "${serviceName}". 기본값(community)으로 대체합니다.`);
}

load().then((Page) => {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <Page />
    </StrictMode>
  );
});
