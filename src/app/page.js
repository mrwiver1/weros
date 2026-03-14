'use client';
import { useState } from "react";

const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

const systemPrompt = `당신은 WEROS의 수석 브랜드 해부 전문가입니다. 미스터위버 × BRAND ANATOMY 시리즈의 필자로서, 브랜드 진단 리포트를 작성합니다.

## 절대 원칙

1. 각 챕터는 최소 800~1,200자 이상 작성. 절대 요약하거나 짧게 끊지 말 것. 분량이 부족하면 실패한 리포트다.
2. 숫자와 데이터는 반드시 구체적으로 제시하되, "(WEROS AI 추정, 통계청·업계 데이터 기반)" 표기 필수
3. 분석가 주석을 파트너 관점으로 작성 — 문제를 지적하되 "함께 해결하자"는 톤 유지. 분석가 주석은 반드시 2개 이상.
4. 각 챕터 앞에 "Decision Point:" 인용구 포함
5. 실제 기업 사례(코닥, 노키아, 스타벅스, 블록버스터 등)를 브랜드 상황에 빗대어 구체적으로 활용
6. Dark Side는 냉정하지만 건설적으로 — "이 구조가 성장을 막고 있다" 프레이밍
7. 각 소제목 아래 최소 3~4개 문단 이상 작성. 단락을 짧게 끊지 말고 충분히 전개할 것.
8. 비용 분석 시 구체적 수치로 환산해서 제시 (시급, 기회비용, 연간 손실액 등)
9. 이 챕터만 요청받더라도 A4 2~3페이지 분량으로 충분히 작성할 것

## 톤 & 문체

- 따뜻하지만 전략적, 감성적이지만 데이터 기반
- "당신"이라는 2인칭으로 독자에게 직접 말 걸기
- 분석가 주석은 파트너·동료 관점 — 비판이 아닌 통찰
- 핵심 인사이트는 인용구(> ) 형식으로 강조
- 수치에는 반드시 "(WEROS AI 추정)" 표기

## 출력 구조

각 섹션 요청 시 해당 섹션만 작성. 섹션 구분자로 시작할 것.

### EXECUTIVE_SUMMARY 요청 시:
# EXECUTIVE SUMMARY — 3분 안에 읽는 핵심 진단

**브랜드 건강도 종합 점수: XX/100**
(점수 산출 근거 간략 설명)

**3가지 핵심 진단:**
1. [핵심 문제 1]
2. [핵심 문제 2]  
3. [핵심 문제 3]

**6개월 매출 시나리오:**
- 현재 유지 시: [예상 매출]
- 전략 실행 시: [예상 매출]
- 목표 달성 조건: [핵심 조건]

### OPENING 요청 시:
# OPENING — 시장 현실: 당신이 서 있는 곳의 좌표
(시장 규모·성장률·경쟁 강도, WEROS AI 추정 표기)

### CH01 요청 시:
# CH.01 — 브랜드 DNA
> **Decision Point:** [질문]
(브랜드 히스토리와 결정 포인트 분석)

### CH02 요청 시:
# CH.02 — 성장을 막는 4가지 구조적 패턴
> **Decision Point:** [질문]
(매몰비용/손실회피/소유효과/뺄셈무시를 "심리" 아닌 "구조적 패턴"으로 프레이밍)

### CH03 요청 시:
# CH.03 — 경쟁 구도
> **Decision Point:** [질문]
(경쟁자 비교표 포함)

### CH04 요청 시:
# CH.04 — Dark Side: 지금 성장을 막는 구조들
> **Decision Point:** [질문]
(냉정하지만 건설적 — "이 구조가 성장을 막는다" 프레이밍)

### CH05 요청 시:
# CH.05 — 전략 원칙
> **Decision Point:** [질문]
(3~5가지 전략 원칙과 구체적 실행 방향)

### REVENUE 요청 시:
# REVENUE OPPORTUNITY — 수익 구조 시뮬레이션

현재 구조 분석 → 개선 시나리오 → 매출 시뮬레이션 표
(구체적 숫자로 Before/After 제시)

### EXECUTION 요청 시:
# EXECUTION GUIDE — 90일 실행 로드맵

PHASE 1 (1~30일): [주차별 구체적 액션]
PHASE 2 (31~60일): [주차별 구체적 액션]
PHASE 3 (61~90일): [주차별 구체적 액션]

각 액션은 "무엇을, 언제, 어떻게" 형식으로.

### EPILOGUE 요청 시:
# EPILOGUE — 당신은 이미 한 번 강을 건넌 사람입니다

(감성적 마무리 + 브랜드 포지션 문장)

**Brand Position:**
[브랜드명]은 [기존 정의]가 아니라
'[새로운 포지션 한 줄]'이다.

> *[핵심 인사이트 한 줄]*
> — WEROS

---
**WEROS AI 분석 프레임워크**
1. 행동경제학 4대 편향 적용 (매몰비용·손실회피·소유효과·뺄셈무시)
2. 통계청·중기부·업계 리포트 기반 시장 데이터 추정
3. WEROS 브랜드 해부 방법론 적용
*이 리포트는 AI 분석과 WEROS 브랜드 전문가 컨설팅 방법론이 결합된 결과물입니다.*`;

const CHAPTERS = [
  { id: "EXECUTIVE_SUMMARY", label: "Executive Summary", icon: "◈", desc: "핵심 진단 + 매출 시나리오" },
  { id: "OPENING", label: "시장 현실", icon: "○", desc: "시장 규모·경쟁 구도" },
  { id: "CH01", label: "브랜드 DNA", icon: "①", desc: "지금까지의 결정들" },
  { id: "CH02", label: "구조적 패턴", icon: "②", desc: "성장을 막는 4가지 구조" },
  { id: "CH03", label: "경쟁 구도", icon: "③", desc: "같아 보이지만 전혀 다른 싸움" },
  { id: "CH04", label: "Dark Side", icon: "④", desc: "지금 성장을 막는 구조들" },
  { id: "CH05", label: "전략 원칙", icon: "⑤", desc: "가야 할 방향" },
  { id: "REVENUE", label: "수익 시뮬레이션", icon: "₩", desc: "Before/After 매출 분석" },
  { id: "EXECUTION", label: "90일 로드맵", icon: "▶", desc: "주차별 실행 가이드" },
  { id: "EPILOGUE", label: "에필로그", icon: "✦", desc: "브랜드 포지션 문장" },
];

function generateChapterPrompt(chapterId, formData) {
  const info = `
브랜드명: ${formData.brandName}
업종/카테고리: ${formData.category}
창업 시기 및 배경: ${formData.history}
주요 제품/서비스 및 가격: ${formData.products}
브랜드 강점: ${formData.strengths}
독보적 능력 3가지: ${formData.uniqueAbilities}
가장 아픈 실패 경험: ${formData.painfulFailure}
월 평균 매출: ${formData.revenue}
이익률 및 객단가: ${formData.profitRate}
직원 수 및 운영 형태: ${formData.operation}
사업장 위치 및 상권: ${formData.location}
재방문율 / 단골 비율: ${formData.returnRate}
월 광고비: ${formData.adBudget}
현재 마케팅 채널: ${formData.marketing}
주요 타겟 고객: ${formData.target}
주요 경쟁자: ${formData.competitors}
현재 가장 큰 고민: ${formData.concerns}
사업 지속 계획: ${formData.future}
운영 가동률: ${formData.operationRate}
디지털 숙련도: ${formData.digitalSkill}
3개월 매출 목표: ${formData.revenueGoal}
`;
  return `다음 브랜드 정보를 바탕으로 ${chapterId} 섹션만 작성해주세요. A4 2~3페이지 분량으로 충분히 깊고 길게 작성하세요. 절대 요약하지 마세요.\n\n${info}`;
}

const STEPS = [
  {
    title: "기본 브랜드 정보",
    subtitle: "Step 1 / 3",
    fields: [
      { name: "brandName", label: "브랜드명", placeholder: "예: 카페 아무개", required: true },
      { name: "category", label: "업종 / 카테고리", placeholder: "예: 서울 마포구 30석 독립 카페", required: true },
      { name: "history", label: "창업 시기 및 배경", placeholder: "예: 2021년 창업, 마케팅 회사 10년 근무 후" },
      { name: "products", label: "주요 제품/서비스 및 가격대", placeholder: "예: 스페셜티 커피, 시그니처 디저트, 원두 판매" },
      { name: "strengths", label: "브랜드 강점 (본인 생각)", placeholder: "예: 인테리어, 원두 품질, SNS 인지도" },
      { name: "uniqueAbilities", label: "독보적 능력 3가지", placeholder: "고객이 '소름'이라고 표현한 부분, 타 업체 대비 당신만의 능력" },
      { name: "painfulFailure", label: "가장 아픈 실패 경험 1가지", placeholder: "솔직하게 적을수록 리포트가 날카로워집니다" },
    ],
  },
  {
    title: "재무 및 수익 구조",
    subtitle: "Step 2 / 3",
    fields: [
      { name: "revenue", label: "월 평균 매출 / 연 매출", placeholder: "예: 월 평균 300만원 / 연 3,600만원" },
      { name: "profitRate", label: "이익률 및 평균 객단가", placeholder: "예: 이익률 70%, 객단가 15만원" },
      { name: "operation", label: "직원 수 및 운영 형태", placeholder: "예: 1인 단독 운영, 자택 오피스" },
      { name: "location", label: "사업장 위치 및 상권 특성", placeholder: "예: 경기도 김포시, 아파트 단지 밀집 지역" },
      { name: "returnRate", label: "재방문율 추정 / 단골 비율", placeholder: "예: 재방문율 20%, 단골 비율 20%" },
      { name: "operationRate", label: "운영 가동률", placeholder: "하루 업무 시간 중 실제 고객 상담에 쓰는 시간 비율 (예: 40%)" },
      { name: "revenueGoal", label: "3개월 뒤 매출 목표", placeholder: "예: 월 400만원 달성" },
    ],
  },
  {
    title: "마케팅 및 고객 정보",
    subtitle: "Step 3 / 3",
    fields: [
      { name: "adBudget", label: "월 광고·홍보 비용", placeholder: "예: 0원 (무료 채널만 사용)" },
      { name: "marketing", label: "현재 마케팅 채널 및 SNS", placeholder: "예: 네이버 플레이스, 지역 카페 주 1회 게시" },
      { name: "target", label: "주요 타겟 고객", placeholder: "예: 30~50대 여성, 김포·일산·강서 거주" },
      { name: "competitors", label: "주요 경쟁자", placeholder: "예: 철학관, 온라인 작명 앱, 타로업체" },
      { name: "concerns", label: "현재 가장 큰 고민", placeholder: "예: 매출 정체, 재방문율 낮음, 브랜드 차별화 모호", required: true },
      { name: "future", label: "사업을 얼마나 지속할 계획인가?", placeholder: "예: 평생 지속, 단 AI 등장으로 상담 영역 확장 검토 중" },
      { name: "digitalSkill", label: "디지털 숙련도", placeholder: "블로그 포스팅·영상 편집 직접 가능 여부 (예: 블로그 가능, 영상은 어려움)" },
    ],
  },
];

const initialForm = {
  brandName: "", category: "", history: "", products: "", strengths: "",
  uniqueAbilities: "", painfulFailure: "", revenue: "", profitRate: "",
  operation: "", location: "", returnRate: "", operationRate: "", revenueGoal: "",
  adBudget: "", marketing: "", target: "", competitors: "", concerns: "",
  future: "", digitalSkill: "",
};

const dummyForm = {
  brandName: "이지윤의 힐링네임",
  category: "경기도 김포시 운양동 자택 오피스 기반 작명·이름풀이·인생상담 1인 전문점",
  history: "2006년 광미명성학 수료 후 창업. 이후 별도 스승에게 도제식으로 천신기법 전수받아 작명에 접목. 마케팅·광고 이력 없이 순수 실력과 입소문으로 20년 운영.",
  products: "신생아 작명 30만원 / 개명 30만원 / 이름풀이 1시간 5만원 / 에너지 기세션 5~10만원(단골 한정, 정가 미책정)",
  strengths: "20년 경력, 네이버 플레이스 김포 1위 8년 유지, 리뷰 4.5점 최다 보유, 고객 90% 감동 후기, 다둥이 가정 재의뢰율 높음",
  uniqueAbilities: "1) 이름만 들으면 생년월일 없이 1분 내 즉석 이름풀이 가능 — 고객 반응 소름. 2) 천신기법 접목으로 국내 몇 안 되는 독보적 해석 체계 보유. 3) 상담 후 마음 힐링 효과 — 고객이 울며 돌아가는 경우 다수.",
  painfulFailure: "코로나 시기 월 700만원 매출을 1년 반 유지했으나 이후 원인 불명으로 급락, 현재까지 회복 못함. 와디즈 펀딩 2회 도전했으나 1차 70만원, 2차 46만원으로 사실상 실패.",
  revenue: "월 평균 150~200만원 / 연 1,800~2,400만원",
  profitRate: "이익률 97~100% (자택 운영, 인건비·임대료 없음) / 객단가 평균 15~30만원",
  operation: "1인 단독 운영 (남편이 마케팅 일부 보조). 자택 오피스텔 상담실.",
  location: "경기도 김포시 운양동 운양역 인근 오피스텔. 주변 아파트 단지 밀집, 30~50대 여성 거주 비율 높음.",
  returnRate: "동일 고객 재방문율 매우 낮음 / 단골 비율 약 20% / 다둥이 가정은 둘째·셋째 작명 재의뢰하는 경향 있음",
  operationRate: "약 30~40% (상담 외 시간은 대기·블로그·개인 업무)",
  revenueGoal: "3개월 내 월 350만원 달성. 궁극적으로 월 700만원 재달성.",
  adBudget: "0원. 광고 효과 확실히 입증되면 집행 의향 있음. 체험단·블로그 협찬 방식엔 거부감 있음.",
  marketing: "네이버 플레이스(자연 유입 1위) / 김포 콜롬버스 부동산 카페 일요일 무료 게시 / 네이버 블로그 간헐적 운영 / 인스타그램 비정기 업로드",
  target: "주력: 김포·검단·일산·강서 거주 30~50대 여성 (신생아 부모, 개명 고민자) / 잠재: 에너지 힐링·인생상담 수요층",
  competitors: "작명: 동네 철학관, 온라인 작명소, 작명 앱 / 인생상담: 사주카페, 타로업체, 신점, 온라인 상담 플랫폼",
  concerns: "매출 정체 및 코로나 피크 회복 불가 / 재방문율 낮고 신규 유입도 정체 / 브랜드 차별화 포인트가 외부에 잘 전달되지 않음 / 에너지 기세션·천신기 역량 상품화 방법 모름",
  future: "평생 지속 예정. 단, 출산율 저하와 AI 작명 앱 등장으로 작명 수요 감소 예상. 천신기+레이키 활용한 인생상담·에너지 힐링 방향으로 확장 모색 중.",
  digitalSkill: "네이버 블로그 직접 작성 가능 / 인스타그램 운영 가능 / 영상 편집은 어려움 / 온라인 예약·결제 시스템 미도입",
};

function renderMarkdown(text) {
  return text
    .replace(/^# (.+)$/gm, '<h1 class="r-h1">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="r-h2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="r-h3">$1</h3>')
    .replace(/^> \*\*Decision Point:\*\* (.+)$/gm, '<div class="r-decision"><span class="r-dp-label">Decision Point</span><p>$1</p></div>')
    .replace(/^> (.+)$/gm, '<blockquote class="r-quote">$1</blockquote>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr class="r-hr"/>')
    .replace(/^\- (.+)$/gm, '<li class="r-li">$1</li>')
    .replace(/(<li class="r-li">.*<\/li>\n?)+/g, (m) => `<ul class="r-ul">${m}</ul>`)
    .replace(/\n\n/g, '</p><p class="r-p">')
    .replace(/^(?!<[hbuldip])(.+)$/gm, '<p class="r-p">$1</p>');
}

export default function WerosBrandDiagnosis() {
  const [step, setStep] = useState(0); // 0,1,2 = form steps, 3 = result
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [chapters, setChapters] = useState({}); // { id: { status: 'idle'|'loading'|'done', content: '' } }
  const [generatingAll, setGeneratingAll] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    const currentStep = STEPS[step];
    const required = currentStep.fields.filter(f => f.required);
    for (const f of required) {
      if (!formData[f.name]?.trim()) {
        setError(`"${f.label}"은 필수 입력입니다.`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleLoadDummy = () => {
    setFormData(dummyForm);
    setError("");
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setError("");
    setStep(s => s - 1);
  };

  const handleSubmit = () => {
    if (!validateStep()) return;
    setChapters({});
    setStep(3);
  };

  const generateChapter = async (chapterId) => {
    setChapters(prev => ({ ...prev, [chapterId]: { status: 'loading', content: '' } }));
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: generateChapterPrompt(chapterId, formData) }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("\n") || "";
      setChapters(prev => ({ ...prev, [chapterId]: { status: 'done', content: text } }));
    } catch {
      setChapters(prev => ({ ...prev, [chapterId]: { status: 'error', content: '생성 중 오류가 발생했습니다.' } }));
    }
  };

  const generateAll = async () => {
    setGeneratingAll(true);
    for (const ch of CHAPTERS) {
      await generateChapter(ch.id);
    }
    setGeneratingAll(false);
  };

  const [consultMode, setConsultMode] = useState(false); // 채팅 상담 도우미 on/off
  const [consultQA, setConsultQA] = useState(null); // 예상 Q&A { status, content }
  const [chatMessages, setChatMessages] = useState([]); // { role, text }
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // 리포트 전체 텍스트 합치기
  const getReportSummary = () => {
    return Object.entries(chapters)
      .filter(([, v]) => v.status === 'done')
      .map(([id, v]) => `[${id}]\n${v.content}`)
      .join('\n\n');
  };

  // 상담 준비 Q&A 자동 생성
  const generateConsultQA = async () => {
    setConsultQA({ status: 'loading', content: '' });
    const report = getReportSummary();
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 4000,
          system: `당신은 WEROS 브랜드 컨설턴트의 상담 코치입니다. 브랜드 진단 리포트를 읽고, 고객이 상담 시 물어볼 가능성이 높은 질문 10개와 각각의 답변 가이드를 작성합니다.

형식:
**Q1. [예상 질문]**
→ [답변 가이드 — 구체적이고 실용적으로. 2~4문장]

규칙:
- 고객 입장에서 가장 궁금해할 것들 위주
- 답변은 컨설턴트가 바로 말할 수 있는 수준으로 구체적으로
- 방어적 질문(왜 이렇게 됐나요?), 실행 질문(그럼 어떻게 하죠?), 회의적 질문(정말 될까요?) 골고루 포함
- 한국어로 작성`,
          messages: [{
            role: "user",
            content: `다음 브랜드 진단 리포트를 바탕으로 상담 예상 Q&A 10개를 작성해주세요.\n\n브랜드명: ${formData.brandName}\n\n${report}`
          }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("\n") || "";
      setConsultQA({ status: 'done', content: text });
    } catch {
      setConsultQA({ status: 'error', content: '생성 중 오류가 발생했습니다.' });
    }
  };

  // 실시간 채팅 상담
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newMessages = [...chatMessages, { role: 'user', text: userMsg }];
    setChatMessages(newMessages);
    setChatLoading(true);

    const report = getReportSummary();
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 1000,
          system: `당신은 WEROS 브랜드 컨설턴트의 실시간 상담 코치입니다. 
브랜드 진단 리포트를 숙지하고 있으며, 컨설턴트가 고객과 상담할 때 즉시 활용할 수 있는 답변을 제공합니다.

브랜드: ${formData.brandName}
진단 리포트 요약:
${report.slice(0, 3000)}

역할:
- 컨설턴트가 "고객이 이렇게 물어봤어" 하면 → 바로 답변 초안 제공
- 컨설턴트가 "이 부분 어떻게 설명해?" 하면 → 쉬운 언어로 설명 방법 제안
- 답변은 짧고 실용적으로 (3~5문장)
- 컨설턴트 입장에서 말하는 형식으로`,
          messages: newMessages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
        }),
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("\n") || "";
      setChatMessages(prev => [...prev, { role: 'assistant', text }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', text: '오류가 발생했습니다. 다시 시도해주세요.' }]);
    }
    setChatLoading(false);
  };

  const handleReset = () => {
    setStep(0);
    setChapters({});
    setFormData(initialForm);
    setError("");
  };

  const styles = {
    root: {
      minHeight: "100vh",
      background: "#f5f0ea",
      color: "#2a2018",
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    header: {
      borderBottom: "1px solid #d8cfc4",
      padding: "20px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#ffffff",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    logo: { fontSize: "24px", fontWeight: "700", letterSpacing: "6px", color: "#8a6a40" },
    logoSub: { fontSize: "10px", letterSpacing: "3px", color: "#b0a090", textTransform: "uppercase", marginLeft: "12px" },
    container: { maxWidth: "720px", margin: "0 auto", padding: "60px 40px" },
    label: { display: "block", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a65", marginBottom: "8px" },
    textarea: {
      width: "100%", background: "#ffffff", border: "1px solid #d8cfc4",
      color: "#2a2018", padding: "12px 14px", fontSize: "15px",
      fontFamily: "'Georgia', serif", resize: "vertical", outline: "none",
      lineHeight: "1.6", boxSizing: "border-box", transition: "border-color 0.2s",
    },
    btn: {
      background: "#8a6a40", color: "#ffffff", border: "none",
      padding: "16px 32px", fontSize: "12px", letterSpacing: "3px",
      textTransform: "uppercase", cursor: "pointer", fontFamily: "'Georgia', serif",
      fontWeight: "700", transition: "background 0.2s",
    },
    btnGhost: {
      background: "transparent", color: "#8a7a65", border: "1px solid #d8cfc4",
      padding: "16px 32px", fontSize: "12px", letterSpacing: "3px",
      textTransform: "uppercase", cursor: "pointer", fontFamily: "'Georgia', serif",
      transition: "border-color 0.2s",
    },
  };

  // ─── FORM STEPS ───
  if (step < 3) {
    const currentStep = STEPS[step];
    return (
      <div style={styles.root}>
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={styles.logo}>WEROS</span>
            <span style={styles.logoSub}>Brand Anatomy</span>
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#3a3028", textTransform: "uppercase" }}>
            AI Brand Diagnosis
          </div>
          <button
            onClick={handleLoadDummy}
            style={{
              background: "transparent",
              border: "1px dashed #c0a878",
              color: "#8a6a40",
              padding: "6px 14px",
              fontSize: "11px",
              letterSpacing: "1px",
              cursor: "pointer",
              fontFamily: "'Georgia', serif",
            }}
          >
            테스트 데이터 불러오기
          </button>
        </header>

        <div style={styles.container}>
          {/* Progress */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  flex: 1, height: "2px",
                  background: i <= step ? "#8a6a40" : "#d8cfc4",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#6a5a45", textTransform: "uppercase", marginBottom: "8px" }}>
              {currentStep.subtitle}
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "400", color: "#1a1208", margin: 0 }}>
              {currentStep.title}
            </h1>
          </div>

          {error && (
            <div style={{ background: "#fff0ee", border: "1px solid #e0a090", padding: "14px 18px", marginBottom: "28px", fontSize: "13px", color: "#c03020" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {currentStep.fields.map(field => (
              <div key={field.name}>
                <label style={{ ...styles.label, color: "#5a4a35" }}>
                  {field.label}
                  {field.required && <span style={{ color: "#c03020", marginLeft: "4px" }}>*</span>}
                </label>
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  rows={2}
                  style={{ ...styles.textarea, color: "#1a1208" }}
                  onFocus={e => e.target.style.borderColor = "#8a6a40"}
                  onBlur={e => e.target.style.borderColor = "#d8cfc4"}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "48px" }}>
            {step > 0 && (
              <button onClick={handlePrev} style={{ ...styles.btnGhost, color: "#4a3a28" }}>← 이전</button>
            )}
            {step < 2 ? (
              <button onClick={handleNext} style={{ ...styles.btn, flex: 1 }}>
                다음 단계 →
              </button>
            ) : (
              <button onClick={handleSubmit} style={{ ...styles.btn, flex: 1 }}>
                브랜드 해부 시작 →
              </button>
            )}
          </div>

          {step < 2 && (
            <div style={{
              background: "#fdf8f2",
              border: "1px solid #e0d4c0",
              borderLeft: "3px solid #8a6a40",
              padding: "14px 18px",
              marginTop: "16px",
              fontSize: "13px",
              color: "#4a3a28",
              lineHeight: "1.6",
            }}>
              {step === 0 && (
                <>다음 단계에서는 <strong>재무 및 수익 구조</strong>를 분석하기 위한 문항을 입력합니다. 매출·이익률·운영 형태 등을 미리 준비해두시면 좋아요.</>
              )}
              {step === 1 && (
                <>다음 단계에서는 <strong>마케팅 및 고객 정보</strong>를 분석하기 위한 문항을 입력합니다. 광고 채널·타겟 고객·경쟁자 정보를 미리 정리해두시면 좋아요.</>
              )}
            </div>
          )}

          {step === 0 && (
            <p style={{ textAlign: "center", fontSize: "12px", color: "#8a7a65", marginTop: "20px", letterSpacing: "1px" }}>
              입력값은 리포트 생성에만 사용됩니다
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULT ───
  const doneCount = Object.values(chapters).filter(c => c.status === 'done').length;

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={styles.logo}>WEROS</span>
          <span style={styles.logoSub}>Brand Anatomy</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#5a4a38", letterSpacing: "1px" }}>
            {doneCount}/{CHAPTERS.length} 챕터 완료
          </span>
          <button onClick={handleReset} style={{
            ...styles.btnGhost, padding: "8px 16px", fontSize: "11px",
          }}>새 진단</button>
        </div>
      </header>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 40px", display: "grid", gridTemplateColumns: "240px 1fr", gap: "40px", alignItems: "start" }}>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: "80px" }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#5a4a38", textTransform: "uppercase", marginBottom: "6px" }}>
              Brand Report
            </div>
            <div style={{ fontSize: "18px", color: "#2a2018", lineHeight: "1.3" }}>
              {formData.brandName}
            </div>
          </div>

          <button
            onClick={generateAll}
            disabled={generatingAll}
            style={{
              ...styles.btn,
              width: "100%",
              marginBottom: "20px",
              opacity: generatingAll ? 0.6 : 1,
              fontSize: "11px",
              padding: "14px",
            }}
          >
            {generatingAll ? "생성 중..." : "전체 챕터 생성 →"}
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {CHAPTERS.map(ch => {
              const state = chapters[ch.id];
              const status = state?.status || 'idle';
              return (
                <button
                  key={ch.id}
                  onClick={() => status === 'idle' && generateChapter(ch.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: status === 'done' ? "#ffffff" : "transparent",
                    border: status === 'done' ? "1px solid #d8cfc4" : "1px solid transparent",
                    padding: "10px 12px", cursor: status === 'idle' ? "pointer" : "default",
                    textAlign: "left", width: "100%", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => status === 'idle' && (e.currentTarget.style.borderColor = "#c0b0a0")}
                  onMouseLeave={e => status === 'idle' && (e.currentTarget.style.borderColor = "transparent")}
                >
                  <span style={{
                    fontSize: "14px",
                    color: status === 'done' ? "#8a6a40" : status === 'loading' ? "#a08060" : "#c0b0a0",
                  }}>
                    {status === 'loading' ? "…" : status === 'done' ? "✓" : ch.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: "12px", color: status === 'done' ? "#1a1208" : "#5a4a38", letterSpacing: "0.5px" }}>
                      {ch.label}
                    </div>
                    <div style={{ fontSize: "10px", color: "#7a6a55", marginTop: "2px" }}>
                      {ch.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* AI 방법론 */}
          <div style={{ marginTop: "24px", padding: "16px", background: "#ffffff", border: "1px solid #d8cfc4" }}>
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#5a4a38", textTransform: "uppercase", marginBottom: "8px" }}>
              WEROS AI 방법론
            </div>
            <div style={{ fontSize: "11px", color: "#5a4a38", lineHeight: "1.6" }}>
              행동경제학 4대 편향 적용<br />
              통계청·업계 데이터 기반 추정<br />
              WEROS 브랜드 해부 프레임워크<br />
              <br />
              <em style={{ color: "#7a6a55" }}>AI 분석 + WEROS 전문가 방법론 결합</em>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <style>{`
            .r-h1 { font-size: 26px; font-weight: 400; color: #1a1208; margin: 0 0 20px; letter-spacing: -0.3px; border-bottom: 1px solid #d8cfc4; padding-bottom: 14px; }
            .r-h2 { font-size: 13px; font-weight: 700; color: #7a5530; margin: 32px 0 12px; letter-spacing: 2px; text-transform: uppercase; }
            .r-h3 { font-size: 16px; font-weight: 600; color: #4a3020; margin: 20px 0 8px; }
            .r-decision { background: #fdf8f2; border-left: 3px solid #8a6a40; padding: 16px 20px; margin: 20px 0; }
            .r-dp-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #8a6a40; display: block; margin-bottom: 6px; }
            .r-decision p { color: #1a1208; font-size: 15px; margin: 0; line-height: 1.6; }
            .r-quote { border-left: 2px solid #c8b89a; padding: 10px 18px; margin: 16px 0; color: #4a3a28; font-style: italic; }
            .r-hr { border: none; border-top: 1px solid #e0d4c0; margin: 32px 0; }
            .r-p { font-size: 15px; line-height: 1.85; color: #3a2a18; margin: 0 0 14px; }
            .r-ul { padding-left: 18px; margin: 10px 0; }
            .r-li { font-size: 14px; line-height: 1.7; color: #3a2a18; margin-bottom: 5px; }
            strong { color: #1a1208; }
            em { color: #7a5530; }
          `}</style>

          {CHAPTERS.map(ch => {
            const state = chapters[ch.id];
            const status = state?.status || 'idle';

            return (
              <div key={ch.id} style={{
                marginBottom: "8px",
                border: "1px solid #e8e0d5",
                background: "#ffffff",
              }}>
                {/* Chapter Header */}
                <div
                  onClick={() => status === 'idle' && generateChapter(ch.id)}
                  style={{
                    padding: "20px 24px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: status === 'idle' ? "pointer" : "default",
                    borderBottom: status === 'done' ? "1px solid #e8e0d5" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{
                      fontSize: "18px",
                      color: status === 'done' ? "#8a6a40" : "#c0b0a0",
                    }}>
                      {status === 'loading' ? "…" : status === 'done' ? "✓" : ch.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: "14px", color: status === 'done' ? "#1a1208" : "#4a3a28" }}>
                        {ch.label}
                      </div>
                      <div style={{ fontSize: "11px", color: "#7a6a55", marginTop: "2px" }}>{ch.desc}</div>
                    </div>
                  </div>
                  {status === 'idle' && (
                    <span style={{ fontSize: "11px", color: "#7a6a55", letterSpacing: "1px" }}>
                      클릭하여 생성
                    </span>
                  )}
                  {status === 'loading' && (
                    <span style={{ fontSize: "11px", color: "#8a6a40", letterSpacing: "1px" }}>
                      분석 중...
                    </span>
                  )}
                </div>

                {/* Chapter Content */}
                {status === 'done' && (
                  <div style={{ padding: "28px 24px" }}>
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(state.content) }} />
                  </div>
                )}
                {status === 'error' && (
                  <div style={{ padding: "20px 24px", color: "#c87060", fontSize: "13px" }}>
                    {state.content}
                    <button onClick={() => generateChapter(ch.id)} style={{ ...styles.btnGhost, marginLeft: "12px", padding: "6px 12px", fontSize: "11px" }}>
                      재시도
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* CTA + 상담 도우미 */}
          {doneCount > 0 && (
            <>
              {/* 상담 준비하기 버튼 */}
              <div style={{ marginTop: "48px", padding: "36px", background: "#fdf8f2", border: "1px solid #d8cfc4" }}>
                <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#5a4a38", textTransform: "uppercase", marginBottom: "14px" }}>
                  CONSULTING ASSISTANT
                </div>
                <p style={{ fontSize: "18px", color: "#1a1208", marginBottom: "8px", fontWeight: "400" }}>
                  이 리포트로 고객 상담을 준비하세요
                </p>
                <p style={{ fontSize: "13px", color: "#4a3a28", marginBottom: "24px", lineHeight: "1.7" }}>
                  리포트 기반으로 예상 질문 10개 + 답변 가이드를 자동 생성하거나,<br />
                  실시간 채팅으로 상담 중 막히는 부분을 즉시 도움받을 수 있어요.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={generateConsultQA}
                    disabled={consultQA?.status === 'loading'}
                    style={{
                      ...styles.btn,
                      opacity: consultQA?.status === 'loading' ? 0.6 : 1,
                      fontSize: "12px", padding: "14px 24px",
                    }}
                  >
                    {consultQA?.status === 'loading' ? "생성 중..." : "예상 Q&A 자동 생성 →"}
                  </button>
                  <button
                    onClick={() => setConsultMode(m => !m)}
                    style={{
                      ...styles.btnGhost,
                      fontSize: "12px", padding: "14px 24px",
                      borderColor: consultMode ? "#8a6a40" : "#d8cfc4",
                      color: consultMode ? "#8a6a40" : "#4a3a28",
                    }}
                  >
                    {consultMode ? "채팅 상담 닫기 ✕" : "실시간 채팅 상담 열기 →"}
                  </button>
                </div>

                {/* 예상 Q&A 결과 */}
                {consultQA?.status === 'done' && (
                  <div style={{ marginTop: "28px", borderTop: "1px solid #e0d4c0", paddingTop: "24px" }}>
                    <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#8a6a40", textTransform: "uppercase", marginBottom: "16px" }}>
                      예상 Q&A — 상담 전 숙지하세요
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(consultQA.content) }}
                      style={{ fontSize: "14px", lineHeight: "1.8", color: "#2a1a08" }}
                    />
                  </div>
                )}
                {consultQA?.status === 'error' && (
                  <div style={{ marginTop: "16px", color: "#c03020", fontSize: "13px" }}>
                    {consultQA.content}
                  </div>
                )}

                {/* 실시간 채팅 */}
                {consultMode && (
                  <div style={{ marginTop: "28px", borderTop: "1px solid #e0d4c0", paddingTop: "24px" }}>
                    <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#8a6a40", textTransform: "uppercase", marginBottom: "16px" }}>
                      실시간 상담 코치
                    </div>

                    {/* 채팅 힌트 */}
                    {chatMessages.length === 0 && (
                      <div style={{ marginBottom: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {[
                          "고객이 '가격이 왜 이렇게 비싸요?' 라고 물어봤어",
                          "재방문율 낮은 거 어떻게 설명해?",
                          "고객이 광고 안 해도 된다고 하는데 뭐라고 해?",
                        ].map(hint => (
                          <button
                            key={hint}
                            onClick={() => setChatInput(hint)}
                            style={{
                              background: "#ffffff", border: "1px solid #d8cfc4",
                              padding: "8px 12px", fontSize: "12px", color: "#4a3a28",
                              cursor: "pointer", fontFamily: "'Georgia', serif",
                              borderRadius: "2px",
                            }}
                          >
                            {hint}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* 메시지 목록 */}
                    <div style={{
                      background: "#ffffff", border: "1px solid #e0d4c0",
                      padding: "16px", marginBottom: "12px",
                      maxHeight: "320px", overflowY: "auto",
                      display: "flex", flexDirection: "column", gap: "12px",
                    }}>
                      {chatMessages.length === 0 && (
                        <div style={{ fontSize: "13px", color: "#a09080", textAlign: "center", padding: "20px 0" }}>
                          고객 질문이나 막히는 부분을 입력하면 즉시 답변 초안을 드려요
                        </div>
                      )}
                      {chatMessages.map((msg, i) => (
                        <div key={i} style={{
                          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: "85%",
                          background: msg.role === 'user' ? "#8a6a40" : "#f5f0ea",
                          color: msg.role === 'user' ? "#ffffff" : "#1a1208",
                          padding: "10px 14px",
                          fontSize: "13px", lineHeight: "1.7",
                          whiteSpace: "pre-wrap",
                        }}>
                          {msg.role === 'assistant' && (
                            <div style={{ fontSize: "10px", color: "#8a6a40", letterSpacing: "1px", marginBottom: "6px" }}>
                              WEROS 상담 코치
                            </div>
                          )}
                          {msg.text}
                        </div>
                      ))}
                      {chatLoading && (
                        <div style={{
                          alignSelf: "flex-start", background: "#f5f0ea",
                          padding: "10px 14px", fontSize: "13px", color: "#8a7a65",
                        }}>
                          답변 작성 중...
                        </div>
                      )}
                    </div>

                    {/* 입력창 */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <textarea
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
                        }}
                        placeholder="예: '고객이 왜 매출이 안 오르냐고 물어봤어' / '이 부분 어떻게 설명해?'"
                        rows={2}
                        style={{
                          ...styles.textarea, flex: 1, fontSize: "13px",
                          borderColor: "#d8cfc4", resize: "none",
                        }}
                        onFocus={e => e.target.style.borderColor = "#8a6a40"}
                        onBlur={e => e.target.style.borderColor = "#d8cfc4"}
                      />
                      <button
                        onClick={sendChat}
                        disabled={chatLoading || !chatInput.trim()}
                        style={{
                          ...styles.btn,
                          padding: "12px 20px", fontSize: "12px",
                          opacity: chatLoading || !chatInput.trim() ? 0.5 : 1,
                        }}
                      >
                        전송
                      </button>
                    </div>
                    <div style={{ fontSize: "11px", color: "#a09080", marginTop: "6px" }}>
                      Enter로 전송 · Shift+Enter 줄바꿈
                    </div>
                  </div>
                )}
              </div>

              {/* 기존 DM 문의 CTA */}
              <div style={{ marginTop: "16px", padding: "28px 36px", background: "#ffffff", border: "1px solid #d8cfc4", textAlign: "center" }}>
                <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#5a4a38", textTransform: "uppercase", marginBottom: "10px" }}>
                  NEXT STEP
                </div>
                <p style={{ fontSize: "16px", color: "#1a1208", marginBottom: "8px", fontWeight: "400" }}>
                  직접 컨설팅이 필요하신가요?
                </p>
                <p style={{ fontSize: "13px", color: "#4a3a28", marginBottom: "16px", lineHeight: "1.6" }}>
                  1:1 브랜드 컨설팅으로<br />진단에서 실행까지 직접 도와드립니다.
                </p>
                <div style={{ fontSize: "13px", letterSpacing: "2px", color: "#8a6a40", textTransform: "uppercase" }}>
                  DM으로 문의하기 →
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: "32px", textAlign: "center", fontSize: "11px", color: "#7a6a55", letterSpacing: "1px" }}>
            © 2026 WEROS Brand Anatomy · AI + 전문가 방법론 결합 리포트
          </div>
        </div>
      </div>
    </div>
  );
}
