import { StrictMode } from 'react';
import type { ComponentType } from 'react';
import ReactDOM from 'react-dom/client';
import { CommunityPage } from '@/domains/community/page/CommunityPage';
import { NewsPage } from '@/domains/news/page/NewsPage';
import { ShoppingPage } from '@/domains/shopping/page/ShoppingPage';
import './styles.css';

// 공용 엔트리: 각 HTML의 #root[data-service]에서 도메인 이름을 읽어 전용 페이지를 부트스트랩한다.
// 신규 도메인은 페이지 컴포넌트를 만들고 아래 pages 맵과 HTML 한 장만 추가하면 된다.
const pages: Record<string, ComponentType> = {
  community: CommunityPage,
  news: NewsPage,
  shopping: ShoppingPage
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('루트 엘리먼트(#root)를 찾을 수 없습니다.');
}

const serviceName = rootElement.dataset.service ?? 'community';
const Page = pages[serviceName] ?? CommunityPage;
if (!pages[serviceName]) {
  console.warn(`알 수 없는 도메인 "${serviceName}". 기본값(community)으로 대체합니다.`);
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <Page />
  </StrictMode>
);
