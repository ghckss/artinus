# ARTINUS 회원가입 멀티 서비스

커뮤니티 · 뉴스 구독 · 쇼핑 멤버십 세 서비스의 회원가입 페이지를 하나의 코드베이스에서 구현하고, 서비스마다 독립된 HTML로 빌드합니다. 서비스 간 차이는 분기 코드가 아니라 **설정 데이터(`ServiceConfig`)** 로 표현해, 신규 서비스 추가·항목 변경·순서 변경을 최소한의 수정으로 흡수하는 것을 목표로 합니다.

## 아키텍처: 도메인 기반 설계

각 서비스를 하나의 **도메인**으로 보고 `src/domains/<service>` 폴더로 분리했습니다. 도메인 폴더는 해당 서비스에만 속하는 것 — 페이지 컴포넌트와 그 서비스의 `ServiceConfig`(타이틀·배너·테마·입력 필드·약관) — 만 담습니다. 한 서비스의 변경이 다른 서비스로 새지 않도록 경계를 명확히 하기 위함입니다.

여러 도메인이 공통으로 쓰는 것 — 폼/입력/약관/인증 컴포넌트, 상태 훅, 검증 규칙, 타입, Mock API — 은 모두 `src/common`으로 모았습니다. 도메인은 `common`을 가져다 조합할 뿐 그 반대 의존(common → domain)은 없습니다.

```
src/
├─ common/      # 여러 도메인이 공유하는 컴포넌트·훅·규칙·타입·API
└─ domains/
   ├─ community/   # 서비스 전용: 페이지 + ServiceConfig
   ├─ news/
   └─ shopping/
```

판단 기준은 단순합니다. **둘 이상의 도메인에서 재사용 가능하면 `common`, 한 서비스에만 의미가 있으면 그 도메인 폴더.** 신규 서비스는 `common` 자산을 재사용하면서 도메인 폴더 하나만 추가하면 됩니다(아래 [확장성](#확장성) 참고).

## 기술 스택과 선택 이유

| 영역          | 선택                               | 이유                                                                                                     |
| ------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 언어          | TypeScript (`strict`)              | 폼/검증/인증 상태가 많아 컴파일 타임 보장이 유효. 필드·약관·서비스 설정을 discriminated union으로 모델링 |
| UI            | React 18 (`StrictMode`)            | 컴포넌트/훅으로 상태·표현 분리에 적합                                                                    |
| 번들러        | Vite 5 (multi-page)                | 루트 `*.html`을 자동 스캔해 **서비스별 독립 산출물** 생성. 라우터 불필요                                 |
| 스타일        | 순수 CSS (`styles.css`) + CSS 변수 | 의존성 없이 서비스별 테마 색을 `--theme-color` 변수로 주입. 빌드 단순                                    |
| 상태/폼       | 라이브러리 없이 커스텀 훅          | 인증·약관 동기화·교차 필드 검증 등 도메인 요구를 정확히 제어                                             |
| 패키지 매니저 | pnpm                               | 빠른 설치, 엄격한 의존성 격리                                                                            |

### 주요 트레이드오프
- **단일 번들**: multi-page지만 세 도메인 코드가 한 JS 번들을 공유합니다(코드 스플리팅 없음). 자세한 내용은 아래 "번들 전략" 참고.
- **폼 라이브러리 미사용**: 폼 상태·검증을 직접 구현해 제어력은 높지만 기성 라이브러리 기능을 직접 만들어야 합니다.
- **페이지별 조합 중복**: 공용 폼 컴포넌트(SignupForm)를 두지 않아 폼 조합 로직이 도메인 페이지마다 반복됩니다. 매번 조합이 필요한 대신 각 서비스가 화면을 독립적으로 변형할 수 있습니다.

### 번들 전략 트레이드오프
각 `*.html`은 공용 엔트리 `src/main.tsx` 하나를 로드하고, `#root[data-service]` 값으로 어떤 도메인 페이지를 렌더할지 결정합니다(알 수 없는 값이면 `community`로 폴백). 엔트리 파일이 서비스마다 따로 필요 없어 단순하지만, 현재는 세 도메인 코드가 하나의 JS 번들에 함께 포함됩니다. 코드량이 작아 문제되지 않으며, 규모가 커지면 `data-service` 기준 동적 import로 도메인별 코드 스플리팅을 적용할 수 있습니다.

## 실행 및 빌드

```bash
pnpm install      # 의존성 설치
pnpm dev          # 개발 서버
pnpm build        # 타입체크(tsc --noEmit) + 프로덕션 빌드
pnpm preview      # 빌드 결과 미리보기
pnpm typecheck    # 타입체크만
```

빌드 산출물은 서비스별로 분리됩니다.

```
dist/community.html
dist/news.html
dist/shopping.html
```

개발 서버에서는 `/community.html`, `/news.html`, `/shopping.html`로 각 서비스에 접근합니다.

## 프로젝트 구조

```
src/
├─ main.tsx                     # 공용 엔트리. data-service → 도메인 페이지 매핑(미일치 시 community 폴백)
├─ styles.css                   # 전역 스타일 + 테마 CSS 변수
├─ common/
│  ├─ Types.ts                  # 필드/약관/서비스 설정 타입. FieldConfig는 type 판별 union
│  ├─ rules.ts                  # ValidationRule 타입 + 조합형 검증 규칙(minLength/matches/minAge/pattern)
│  ├─ api/verifyApi.ts          # 휴대폰 인증 Mock (verifyPhoneCode 함수, VerifyResult union)
│  ├─ components/               # 페이지가 가져다 조합하는 표현 단위
│  │  ├─ FormField.tsx          # 텍스트 계열 입력 렌더러(aria-invalid/에러 표시)
│  │  ├─ PhoneVerification.tsx  # 휴대폰 인증 UI(타이머/상태칩/로딩/형식 안내)
│  │  ├─ TermsCheckboxGroup.tsx # 약관 전체↔개별 동의(필수/선택 배지)
│  │  ├─ SubmitSection.tsx      # 미충족 조건 체크리스트 + 가입 버튼
│  │  └─ PageLayout.tsx         # 타이틀/배너/테마 래퍼(--theme-color 주입)
│  └─ hooks/
│     ├─ useSignupForm.ts       # 입력값·검증 상태(교차 필드 재검증 포함)
│     ├─ usePhoneVerification.ts# 인증 흐름(숫자 sanitize/3분 카운트다운/상태머신/중복요청 방지)
│     └─ useTermsSync.ts        # 약관 전체↔개별 동의 동기화
└─ domains/
   ├─ community/page/CommunityPage.tsx
   ├─ news/page/NewsPage.tsx
   └─ shopping/page/ShoppingPage.tsx   # 각 페이지 = 자체 ServiceConfig 상수 + 공통 컴포넌트/훅을 직접 조합

community.html · news.html · shopping.html   # 루트의 서비스별 엔트리(#root[data-service], vite가 자동 스캔)
vite.config.ts                                # *.html 다중 엔트리 + @/ → src alias
```

### 핵심 설계
- **설정 주도 + 페이지 조합**: 서비스 차이(타이틀·배너·테마·입력 필드·약관)를 `ServiceConfig` 데이터로 표현합니다. 공용 폼 컴포넌트로 묶는 대신, 각 도메인 페이지가 `common`의 컴포넌트(`PageLayout`·`FormField`·`PhoneVerification`·`TermsCheckboxGroup`·`SubmitSection`)와 훅을 직접 조합해 자신의 `fields` 배열 순서대로 렌더합니다. 공통 조합 패턴은 공유하되 각 서비스가 화면을 독립적으로 변형할 여지를 둡니다.
- **휴대폰 인증을 필드로 취급**: `FieldConfig`는 일반 입력(`InputFieldConfig`)과 휴대폰 인증(`PhoneFieldConfig`)을 `type` 판별자로 구분하는 union이라, 인증 블록을 `fields` 배열 어디에나 배치할 수 있습니다(뉴스 서비스는 인증을 맨 앞에 노출).
- **관심사 분리 훅**: 폼 값/검증(`useSignupForm`), 인증 흐름(`usePhoneVerification`), 약관 동기화(`useTermsSync`)를 각각의 훅으로 분리했습니다. `useSignupForm`은 휴대폰 필드를 제외한 일반 입력만 관리합니다.
- **검증 규칙 조합**: 규칙을 팩토리 함수로 만들어 `rules: [minLength(8), matches('password')]`처럼 선언적으로 조합합니다. 빈 값은 각 규칙이 통과시키고, 필수 여부(`required`)는 폼 훅이 일괄 판정합니다.

### 검증·인증 동작 (코드 기준)
- **입력 검증**: `minLength`(비밀번호 8자), `matches`(비밀번호 확인 일치), `minAge`(만 14세 이상, 미래 날짜·잘못된 날짜 거부), `pattern`. 비밀번호를 바꾸면 이미 입력된 "비밀번호 확인" 필드가 즉시 재검증됩니다.
- **휴대폰 번호**: 입력값에서 숫자만 남기고(최대 11자리), 국내 형식(`01` + 8~9자리)을 만족할 때만 인증번호 요청이 가능합니다. 형식이 어긋나면 인라인 안내를 표시합니다.
- **인증 흐름**: `idle → pending → success/failure/expired` 상태머신. 요청 시 3분(180초) 카운트다운 시작, 만료 시 `expired` 처리. 검증 요청 중에는 로딩을 표시하고 중복 요청을 막습니다.
- **약관**: 전체↔개별 동의 동기화. 필수 약관 미동의 시 가입 불가.
- **가입 버튼**: 모든 필수 입력 유효 + (휴대폰 필드가 있으면) 인증 성공 + 필수 약관 동의를 모두 만족할 때만 활성화됩니다. 미충족 시 남은 조건을 체크리스트로 보여줍니다. (실제 가입 처리는 과제 범위 밖이라 `alert`로 대체)

## 확장성

- **공통 컴포넌트 조합으로 화면 구성**: 새 서비스는 `common`의 컴포넌트·훅을 조합한 페이지와 `ServiceConfig` 상수만 추가하면 됩니다. 입력 항목·순서·약관은 config 배열로 조정합니다.
- **검증 규칙 추가**: `common/rules.ts`에 규칙 팩토리를 추가하면 모든 서비스에서 조합해 쓸 수 있습니다.

## Mock API

`common/api/verifyApi.ts`의 `verifyPhoneCode(mobile, code)`가 `/api/verify` 인증 계약을 클라이언트 내 함수로 모킹합니다(별도 HTTP 서버·MSW 없음). 응답은 0.5~1.5초 랜덤 지연 후 `VerifyResult` union으로 반환됩니다.

| 입력 코드 | 반환값                                    | UI 처리                        |
| --------- | ----------------------------------------- | ------------------------------ |
| `123456`  | `{ verified: true }`                      | 인증 성공                      |
| `999999`  | `{ error: 'INTERNAL' }`                   | 일시적 오류 → "다시 시도" 안내 |
| 그 외     | `{ verified: false, reason: 'MISMATCH' }` | 인증 실패 → 코드 재확인 안내   |

## AI 활용

- **도구**: Claude Code(Anthropic)를 활용했습니다.
- **활용 범위**: 설계에 기반한 실 구현 및 검증 로직, 전반적인 스타일, README 작성에 활용했습니다.
