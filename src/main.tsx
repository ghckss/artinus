import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { services } from './config/services';
import './styles.css';

// 공용 엔트리: 각 HTML의 #root[data-service]에서 서비스 이름을 읽어 부트스트랩한다.
// 신규 서비스는 전용 엔트리 파일 없이 HTML 한 장과 services 설정만 추가하면 된다.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('루트 엘리먼트(#root)를 찾을 수 없습니다.');
}

const serviceName = rootElement.dataset.service ?? 'community';
if (!services[serviceName]) {
  console.warn(`알 수 없는 서비스 "${serviceName}". 기본값(community)으로 대체합니다.`);
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App serviceName={serviceName} />
  </StrictMode>
);
