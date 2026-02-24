'use client'

import { useState, useEffect } from "react";

const MODEL = "claude-sonnet-4-20250514";

// ── API 호출 ────────────────────────────────────────────────────────
async function callAPI(prompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 3000,
        system: `당신은 WEROS 수석 브랜드 해부 전문가입니다.
[절대 규칙]
1. 지시된 챕터만 작성. 절대 요약하지 말 것. 각 소제목당 최소 300자 이상.
2. 숫자/데이터 반드시 구체적으로 제시
3. "당신"으로 직접 말 걸기
4. 소설적 묘사 금지. 핵심 질문이나 냉정한 현실 진단으로 바로 시작
5. 마크다운 출력. 이모지 사용 금지.
6. 분석가 주석: >> **분석가 주석:** 형식
7. Decision Point: >> **Decision Point:** 형식
8. 표는 반드시 마크다운 테이블 형식으로`,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const d = await res.json();
    return d.content?.map(c => c.text || "").join("") || "";
  } finally {
    clearTimeout(timer);
  }
}

// ── 브랜드 정보 ─────────────────────────────────────────────────────
function info(f) {
  return `브랜드명: ${f.brandName}
업종: ${f.category}
월 매출/연 매출: ${f.revenue || "미입력"}
이익률/객단가: ${f.margin || "미입력"}
직원 수/운영 형태: ${f.staffCount || "미입력"}
사업장 위치/상권: ${f.location || "미입력"}
주요 제품/서비스: ${f.products || "미입력"}
타겟 고객: ${f.target || "미입력"}
경쟁자: ${f.competitors || "미입력"}
월 광고비: ${f.monthlyAdSpend || "미입력"}
마케팅 채널/SNS: ${f.marketingChannels || "미입력"}
재방문율: ${f.repeatRate || "미입력"}
현재 고민: ${f.concerns}
브랜드 강점: ${f.strengths || "미입력"}
창업 배경: ${f.history || "미입력"}
사업 지속 의향: ${f.futureIntent || "미입력"}`;
}

// ── 챕터 정의 ───────────────────────────────────────────────────────
function getChapters(f) {
  const I = info(f);
  return [
    {
      id: "prologue", title: "PROLOGUE + OPENING",
      prompt: `${I}\n\n아래 두 섹션만 작성하세요.\n\n# PROLOGUE — ${f.brandName}, 이 브랜드가 지금 여기 있는 이유\n\n이 브랜드가 현재 직면한 핵심 문제를 냉정하게 진단하는 문장으로 시작. 소설적 묘사 금지. 브랜드 현재 상황 → 핵심 질문 순서로. 최소 400자.\n\n**WEROS BRAND ANATOMY · ${f.category} · 2026**\n\n---\n\n# OPENING — 시장 현실: 당신이 서 있는 곳의 좌표\n\n이 업종 시장 규모, 성장률, 트렌드를 구체적 숫자로. 반드시 아래 표 포함.\n\n| 항목 | 수치 | 비고 |\n|------|------|------|\n\n이 브랜드가 속한 세그먼트의 경쟁 포지션 분석. 최소 500자.`,
    },
    {
      id: "ch01", title: "CH.01 — 브랜드 DNA",
      prompt: `${I}\n\n아래 챕터만 작성하세요.\n\n# CH.01 — 브랜드 DNA: 지금까지의 결정들이 지금의 당신을 만들었다\n\n>> **Decision Point:** 이 브랜드를 지금까지 지탱해온 핵심 선택은 무엇이었고, 그 선택이 지금 어떤 천장이 되고 있는가?\n\n창업 배경부터 현재까지 주요 결정 포인트를 시간 순서로 재구성. 각 결정이 현재의 강점과 약점을 어떻게 동시에 만들었는지 분석. 최소 600자.\n\n>> **분석가 주석:** (이 브랜드 상황에 대한 냉정한 외부 시각. 200자 이상)`,
    },
    {
      id: "ch02", title: "CH.02 — 4개의 잠금 구조",
      prompt: `${I}\n\n아래 챕터만 작성하세요. 4개 소제목 전부 빠짐없이 작성.\n\n# CH.02 — 잠금 구조 해부: 당신도 모르는 사이 작동하는 4개의 자물쇠\n\n>> **Decision Point:** 지금 이 브랜드의 의사결정을 가장 강하게 붙잡고 있는 심리적 자물쇠는 무엇인가?\n\n## 첫 번째 자물쇠: 매몰비용 오류\n최소 200자.\n\n## 두 번째 자물쇠: 손실 회피 본능\n최소 200자.\n\n## 세 번째 자물쇠: 소유 효과\n최소 200자.\n\n## 네 번째 자물쇠: 뺄셈 무시\n최소 200자.\n\n>> **분석가 주석:** (전체 잠금 구조 종합 진단. 200자 이상)`,
    },
    {
      id: "ch03", title: "CH.03 — 경쟁 구도",
      prompt: `${I}\n\n아래 챕터만 작성하세요.\n\n# CH.03 — 경쟁 구도: 같아 보이지만 전혀 다른 싸움\n\n>> **Decision Point:** 당신의 진짜 경쟁자는 누구인가? 지금 올바른 전쟁터에서 싸우고 있는가?\n\n주요 경쟁자 분석. 반드시 표 포함.\n\n| 경쟁자 | 핵심 전략 | 강점 | 약점 | 우리와 차이 |\n|--------|----------|------|------|------------|\n\n이 브랜드만의 차별화 포인트 도출. 최소 500자.`,
    },
    {
      id: "ch04", title: "CH.04 — Dark Side",
      prompt: `${I}\n\n아래 챕터만 작성하세요. 절대 부드럽게 쓰지 말 것.\n\n# CH.04 — Dark Side: 지금 당신이 외면하고 있는 것들\n\n>> **Decision Point:** 성공한 전략에는 반드시 비용이 있다. 지금 이 브랜드가 치르고 있지만 보지 못하는 비용은?\n\n## 에너지 비용\n최소 150자.\n\n## 기회 비용\n최소 150자.\n\n## 평판 비용\n최소 150자.\n\n## 정체성 비용\n최소 150자.\n\n>> **분석가 주석:** (가장 치명적인 Dark Side 직격. 200자 이상)`,
    },
    {
      id: "ch05", title: "CH.05 — 전략 원칙 5가지",
      prompt: `${I}\n\n아래 챕터만 작성하세요.\n\n# CH.05 — 전략 원칙: 이 브랜드가 가야 할 방향\n\n>> **Decision Point:** 지금 이 브랜드에 필요한 건 더 많은 노력인가, 아니면 다른 방향인가?\n\n이 브랜드 상황에 맞는 전략 원칙 5가지. 각 원칙마다 소제목 + 설명 + 구체적 실행 방향. 각각 최소 150자.\n\n## 원칙 1:\n## 원칙 2:\n## 원칙 3:\n## 원칙 4:\n## 원칙 5:`,
    },
    {
      id: "ch06", title: "CH.06 — 해결 과제",
      prompt: `${I}\n\n아래 챕터만 작성하세요.\n\n# CH.06 — 해결 과제: 지금 당장 바꿔야 할 것들\n\n>> **Decision Point:** 무엇을 더할 것인가가 아니라, 무엇을 먼저 뺄 것인가?\n\n## 지금 당장 중단할 것 3가지\n각각: 무엇을 / 왜 / 중단했을 때 기대 효과. 각각 최소 150자.\n\n## 지금 당장 시작할 것 3가지\n각각: 무엇을 / 어떻게 / 기대 결과. 각각 최소 150자.`,
    },
    {
      id: "exec1", title: "EXECUTION — Phase 1 & 2",
      prompt: `${I}\n\n아래 섹션만 작성하세요. 다른 내용 추가 금지.\n\n# EXECUTION GUIDE — 90일 실행 로드맵\n\n## Phase 1 (1~30일): 기반 정비\n\n액션 3가지. 각각 아래 형식으로 작성. 각각 최소 150자.\n\n**액션 1:** (구체적 제목)\n- 무엇을:\n- 어떻게:\n- 성공 기준:\n\n**액션 2:** (구체적 제목)\n- 무엇을:\n- 어떻게:\n- 성공 기준:\n\n**액션 3:** (구체적 제목)\n- 무엇을:\n- 어떻게:\n- 성공 기준:\n\n---\n\n## Phase 2 (31~60일): 방향 전환\n\n액션 3가지. 각각 아래 형식으로 작성. 각각 최소 150자.\n\n**액션 1:** (구체적 제목)\n- 무엇을:\n- 어떻게:\n- 측정 지표:\n\n**액션 2:** (구체적 제목)\n- 무엇을:\n- 어떻게:\n- 측정 지표:\n\n**액션 3:** (구체적 제목)\n- 무엇을:\n- 어떻게:\n- 측정 지표:`,
    },
    {
      id: "exec2", title: "EXECUTION — Phase 3 + 에필로그",
      prompt: `${I}\n\n아래 섹션만 작성하세요. 다른 내용 추가 금지.\n\n## Phase 3 (61~90일): 성과 확인 및 스케일업\n\n액션 3가지. 각각 아래 형식으로 작성. 각각 최소 150자.\n\n**액션 1:** (구체적 제목)\n- 무엇을:\n- 어떻게:\n- 계속/중단 판단 기준:\n\n**액션 2:** (구체적 제목)\n- 무엇을:\n- 어떻게:\n- 계속/중단 판단 기준:\n\n**액션 3:** (구체적 제목)\n- 무엇을:\n- 어떻게:\n- 스케일업 조건:\n\n---\n\n## 철수 트리거: 이 방향이 틀렸다는 신호 3가지\n\n각각 구체적인 수치나 상황으로.\n\n**신호 1:**\n**신호 2:**\n**신호 3:**\n\n---\n\n# EPILOGUE\n\n이 브랜드의 현실적 가능성을 구체적으로 언급. 따뜻하지만 근거 있게. 최소 300자.\n\n> *"이 브랜드의 핵심을 꿰뚫는 한 줄"*\n> — WEROS\n\n---\n*© 2026 WEROS Brand Anatomy · AI-Powered Consulting Report*`,
    },
  ];
}

// ── 폼 섹션 ─────────────────────────────────────────────────────────
const FIELD_SECTIONS = [
  { title: "기본 브랜드 정보", fields: [
    { name:"brandName", label:"브랜드명", ph:"예: 힐링네임", req:true, rows:1 },
    { name:"category", label:"업종 / 카테고리", ph:"예: 작명·이름풀이 전문 1인 사업", req:true, rows:1 },
    { name:"history", label:"창업 시기 및 배경", ph:"예: 2006년 시작, 천신기 수료 후 독립", rows:2 },
    { name:"products", label:"주요 제품/서비스 및 가격대", ph:"예: 신생아 작명 30만원, 개명 상담 15만원", rows:2 },
    { name:"strengths", label:"브랜드 강점 (본인 생각)", ph:"예: 20년 경력, 진심 어린 상담", rows:2 },
  ]},
  { title: "재무 및 수익 구조", fields: [
    { name:"revenue", label:"월 평균 매출 / 연 매출", ph:"예: 월 150만 원 / 연 1,800만 원", rows:1 },
    { name:"margin", label:"이익률 및 평균 객단가", ph:"예: 이익률 약 40%, 평균 객단가 20만 원", rows:1 },
    { name:"staffCount", label:"직원 수 및 운영 형태", ph:"예: 사장 1인 단독 운영", rows:1 },
  ]},
  { title: "입지 및 상권", fields: [
    { name:"location", label:"사업장 위치 및 상권 특성", ph:"예: 온라인 위주, 네이버 블로그+카카오 상담", rows:2 },
    { name:"repeatRate", label:"재방문율 추정 / 단골 비율", ph:"예: 재방문 거의 없음, 대부분 1회성", rows:1 },
  ]},
  { title: "마케팅 및 성장", fields: [
    { name:"monthlyAdSpend", label:"월 광고·홍보 비용", ph:"예: 월 10만 원", rows:1 },
    { name:"marketingChannels", label:"현재 마케팅 채널 및 SNS", ph:"예: 네이버 블로그, 인스타 팔로워 300명", rows:2 },
    { name:"target", label:"주요 타겟 고객", ph:"예: 출산 앞둔 30대 부부, 개명 고려 직장인", rows:2 },
    { name:"competitors", label:"주요 경쟁자", ph:"예: 인근 철학관, 네이버 작명 앱", rows:2 },
  ]},
  { title: "현재 고민 및 방향", fields: [
    { name:"concerns", label:"현재 가장 큰 고민", ph:"예: 재방문 없음, 단발성 거래 반복", req:true, rows:3 },
    { name:"futureIntent", label:"이 사업을 앞으로 얼마나 지속할 계획인가?", ph:"예: 5년 이상 키우고 싶다", rows:2 },
  ]},
];

const ALL_KEYS = FIELD_SECTIONS.flatMap(s => s.fields.map(f => f.name));
const LS_FORM = "weros_form";
const LS_CH = "weros_chapters";

function lsGet(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// ── 마크다운 렌더러 ─────────────────────────────────────────────────
function md(text) {
  if (!text) return "";
  const lines = text.split("\n");
  const out = [];
  let tRows = [], inT = false;
  const flush = () => {
    if (!tRows.length) return;
    const cols = r => r.split("|").filter((_,i,a)=>i>0&&i<a.length-1).map(c=>c.trim());
    out.push(`<div class="tbl-wrap"><table class="tbl"><thead><tr>${cols(tRows[0]).map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${tRows.slice(2).map(r=>`<tr>${cols(r).map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
    tRows=[]; inT=false;
  };
  const il = s => s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
  for (const l of lines) {
    if (l.startsWith("|")) { inT=true; tRows.push(l); continue; }
    if (inT) flush();
    if (!l.trim()) { out.push('<div class="sp"></div>'); continue; }
    if (l.startsWith("# "))   { out.push(`<h1 class="h1">${il(l.slice(2))}</h1>`); continue; }
    if (l.startsWith("## "))  { out.push(`<h2 class="h2">${il(l.slice(3))}</h2>`); continue; }
    if (l.startsWith("### ")) { out.push(`<h3 class="h3">${il(l.slice(4))}</h3>`); continue; }
    if (l.startsWith(">> **Decision Point:**")) { out.push(`<div class="dp"><span class="dp-lbl">Decision Point</span><p>${il(l.replace(">> **Decision Point:**","").trim())}</p></div>`); continue; }
    if (l.startsWith(">> **분석가 주석:**"))    { out.push(`<div class="note"><span class="note-lbl">분석가 주석</span><p>${il(l.replace(">> **분석가 주석:**","").trim())}</p></div>`); continue; }
    if (l.startsWith(">> ")) { out.push(`<blockquote class="bq">${il(l.slice(3))}</blockquote>`); continue; }
    if (l.startsWith("> *"))  { out.push(`<div class="insight">${il(l.slice(2).replace(/\*/g,""))}</div>`); continue; }
    if (l.startsWith("> "))  { out.push(`<blockquote class="bq">${il(l.slice(2))}</blockquote>`); continue; }
    if (l.startsWith("---")) { out.push('<hr class="hr"/>'); continue; }
    if (l.match(/^\*©|^\*이 리포트/)) { out.push(`<p class="foot">${l.replace(/\*/g,"")}</p>`); continue; }
    if (l.startsWith("- ")) { out.push(`<li class="li">${il(l.slice(2))}</li>`); continue; }
    out.push(`<p class="p">${il(l)}</p>`);
  }
  if (inT) flush();
  return out.join("\n").replace(/(<li class="li">[\s\S]*?<\/li>\n?)+/g, m=>`<ul class="ul">${m}</ul>`);
}

export default function App() {
  const [page, setPage] = useState("form");
  const [form, setForm] = useState(() => lsGet(LS_FORM) || Object.fromEntries(ALL_KEYS.map(k=>[k,""])));
  const [chapters, setChapters] = useState(() => lsGet(LS_CH) || {});
  const [formErr, setFormErr] = useState("");

  useEffect(() => { lsSet(LS_FORM, form); }, [form]);
  useEffect(() => { lsSet(LS_CH, chapters); }, [chapters]);

  const onFormChange = e => setForm(p => ({...p, [e.target.name]: e.target.value}));

  const onFormSubmit = () => {
    if (!form.brandName || !form.category || !form.concerns) { setFormErr("브랜드명, 업종, 현재 고민은 필수입니다."); return; }
    setFormErr("");
    const init = {};
    getChapters(form).forEach(c => { init[c.id] = { status: "idle", content: "" }; });
    setChapters(init);
    setPage("report");
  };

  const generateChapter = async (id) => {
    const defs = getChapters(form);
    const ch = defs.find(c => c.id === id);
    if (!ch) return;
    setChapters(p => ({...p, [id]: { status: "loading", content: "" }}));
    try {
      const result = await callAPI(ch.prompt);
      if (!result || result.length < 50) throw new Error("내용 없음");
      setChapters(p => ({...p, [id]: { status: "done", content: result }}));
    } catch {
      setChapters(p => ({...p, [id]: { status: "error", content: "" }}));
    }
  };

  const generateAll = async () => {
    const defs = getChapters(form);
    for (const ch of defs) {
      if (chapters[ch.id]?.status === "done") continue;
      await generateChapter(ch.id);
      await new Promise(r => setTimeout(r, 500));
    }
  };

  const resetAll = () => {
    const init = {};
    getChapters(form).forEach(c => { init[c.id] = { status: "idle", content: "" }; });
    setChapters(init);
  };

  const defs = getChapters(form);
  const allDone = defs.length > 0 && defs.every(c => chapters[c.id]?.status === "done");
  const anyLoading = defs.some(c => chapters[c.id]?.status === "loading");
  const doneCount = defs.filter(c => chapters[c.id]?.status === "done").length;

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;padding:0;background:#fff;color:#111;font-family:'Georgia','Times New Roman',serif}
        .h1{font-size:26px;font-weight:600;color:#111;margin:44px 0 16px;padding-bottom:12px;border-bottom:2px solid #111;line-height:1.3}
        .h2{font-size:12px;font-weight:700;color:#555;margin:28px 0 10px;letter-spacing:2px;text-transform:uppercase}
        .h3{font-size:16px;font-weight:600;color:#222;margin:20px 0 8px}
        .dp{background:#f8f6f2;border-left:4px solid #c8a96e;padding:16px 20px;margin:18px 0}
        .dp-lbl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#c8a96e;font-weight:700;display:block;margin-bottom:6px}
        .dp p{color:#222;font-size:15px;margin:0;line-height:1.6}
        .note{background:#f5f5f5;border-left:3px solid #999;padding:14px 18px;margin:16px 0}
        .note-lbl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#777;font-weight:700;display:block;margin-bottom:6px}
        .note p{color:#444;font-size:14px;margin:0;line-height:1.6;font-style:italic}
        .bq{border-left:2px solid #ddd;padding:8px 16px;margin:12px 0;color:#666;font-style:italic}
        .insight{font-size:19px;color:#333;font-style:italic;text-align:center;padding:24px 0;border-top:1px solid #eee;border-bottom:1px solid #eee;margin:24px 0}
        .hr{border:none;border-top:1px solid #e0e0e0;margin:32px 0}
        .p{font-size:15px;line-height:1.85;color:#333;margin:0 0 12px}
        .ul{padding-left:20px;margin:10px 0 16px}
        .li{font-size:15px;line-height:1.75;color:#333;margin-bottom:8px}
        .sp{height:6px}
        .foot{font-size:11px;color:#bbb;text-align:center;margin-top:28px;letter-spacing:1px}
        .tbl-wrap{overflow-x:auto;margin:16px 0 24px}
        .tbl{width:100%;border-collapse:collapse;font-size:14px}
        .tbl th{background:#f5f5f5;padding:10px 12px;text-align:left;font-weight:600;color:#222;border-bottom:2px solid #ddd;white-space:nowrap}
        .tbl td{padding:9px 12px;border-bottom:1px solid #eee;color:#333;vertical-align:top}
        strong{color:#111;font-weight:600}
        em{color:#555;font-style:italic}
        @media print{
          .no-print{display:none!important}
          *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
          @page{margin:18mm 16mm;size:A4}
          .h1{page-break-before:always;page-break-after:avoid;font-size:22px;margin:0 0 14px}
          .h1:first-of-type{page-break-before:avoid}
          .h2{page-break-after:avoid}
          .dp{page-break-inside:avoid;background:#f8f6f2!important;border-left:4px solid #c8a96e!important}
          .note{page-break-inside:avoid;background:#f5f5f5!important}
          .tbl-wrap{page-break-inside:avoid;overflow:visible!important}
          .tbl th{background:#f5f5f5!important}
          .p{font-size:13px;line-height:1.75}
          .li{font-size:13px}
        }
      `}</style>

      {/* HEADER */}
      <header className="no-print" style={{borderBottom:"2px solid #111",padding:"18px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"baseline",gap:"12px"}}>
          <span style={{fontSize:"24px",fontWeight:"700",letterSpacing:"6px",color:"#111",cursor:"pointer"}} onClick={()=>setPage("form")}>WEROS</span>
          <span style={{fontSize:"10px",letterSpacing:"3px",color:"#999",textTransform:"uppercase"}}>Brand Anatomy</span>
        </div>
        <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
          {page==="report" && <>
            <span style={{fontSize:"11px",color:"#aaa"}}>{doneCount}/{defs.length} 완료</span>
            <button onClick={()=>setPage("form")} style={{background:"none",border:"1px solid #ddd",color:"#666",padding:"6px 14px",fontSize:"10px",letterSpacing:"2px",cursor:"pointer",fontFamily:"'Georgia',serif"}}>← 폼으로</button>
          </>}
          <span style={{fontSize:"10px",letterSpacing:"3px",color:"#bbb",textTransform:"uppercase"}}>AI Consulting Report</span>
        </div>
      </header>

      {/* FORM */}
      {page==="form" && (
        <div style={{maxWidth:"680px",margin:"0 auto",padding:"56px 32px"}}>
          <div style={{marginBottom:"48px"}}>
            <div style={{fontSize:"10px",letterSpacing:"4px",color:"#aaa",textTransform:"uppercase",marginBottom:"12px"}}>PLAYBOOK EDITION · 2026</div>
            <h1 style={{fontSize:"36px",fontWeight:"400",lineHeight:"1.2",color:"#111",margin:"0 0 14px"}}>AI 브랜드 진단<br/>컨설팅 리포트</h1>
            <p style={{fontSize:"15px",color:"#666",lineHeight:"1.8",margin:"0 0 20px"}}>브랜드 정보를 입력하면 챕터별로 심층 진단 리포트를 생성합니다.<br/>진단부터 해결 과제, 90일 실행 로드맵까지 완결형으로 제공합니다.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"12px",fontSize:"12px"}}>
              {["시장 현실 분석","브랜드 DNA","4개 잠금 구조","Dark Side","전략 원칙 5가지","90일 로드맵"].map(t=>(
                <span key={t} style={{color:"#c8a96e",fontWeight:"600"}}>✓ {t}</span>
              ))}
            </div>
          </div>

          {doneCount>0 && (
            <div style={{background:"#f8f6f2",border:"1px solid #e8ddc8",padding:"14px 18px",marginBottom:"24px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"13px"}}>
              <span style={{color:"#888"}}>이전 진단 ({form.brandName}) — {doneCount}/{defs.length}챕터 완료</span>
              <button onClick={()=>setPage("report")} style={{background:"none",border:"none",color:"#c8a96e",fontSize:"13px",cursor:"pointer",fontFamily:"'Georgia',serif",fontWeight:"600"}}>이어서 보기 →</button>
            </div>
          )}

          {formErr && <div style={{background:"#fff0f0",border:"1px solid #fcc",padding:"12px 16px",marginBottom:"20px",fontSize:"14px",color:"#c0392b"}}>{formErr}</div>}

          <div style={{display:"flex",flexDirection:"column",gap:"36px"}}>
            {FIELD_SECTIONS.map(section=>(
              <div key={section.title}>
                <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
                  <div style={{height:"1px",flex:1,background:"#e0e0e0"}}/>
                  <span style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#aaa",whiteSpace:"nowrap"}}>{section.title}</span>
                  <div style={{height:"1px",flex:1,background:"#e0e0e0"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
                  {section.fields.map(f=>(
                    <div key={f.name}>
                      <label style={{display:"block",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"#888",marginBottom:"7px"}}>
                        {f.label}{f.req&&<span style={{color:"#e74c3c",marginLeft:"4px"}}>*</span>}
                      </label>
                      <textarea name={f.name} value={form[f.name]} onChange={onFormChange} placeholder={f.ph} rows={f.rows}
                        style={{width:"100%",background:"#fafafa",border:"1px solid #ddd",color:"#111",padding:"11px 13px",fontSize:"14px",fontFamily:"'Georgia',serif",resize:"vertical",outline:"none",lineHeight:"1.6",boxSizing:"border-box",transition:"border-color 0.2s"}}
                        onFocus={e=>e.target.style.borderColor="#111"} onBlur={e=>e.target.style.borderColor="#ddd"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={onFormSubmit}
            style={{marginTop:"44px",width:"100%",background:"#111",color:"#fff",border:"none",padding:"18px",fontSize:"12px",letterSpacing:"4px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Georgia',serif",fontWeight:"700"}}
            onMouseEnter={e=>e.target.style.background="#333"} onMouseLeave={e=>e.target.style.background="#111"}>
            리포트 생성 시작 →
          </button>
          <p style={{textAlign:"center",fontSize:"12px",color:"#bbb",marginTop:"12px"}}>입력 내용은 자동 저장됩니다</p>
        </div>
      )}

      {/* REPORT */}
      {page==="report" && (
        <div style={{maxWidth:"960px",margin:"0 auto",padding:"40px 32px",display:"flex",gap:"32px"}}>

          {/* 사이드 패널 */}
          <div className="no-print" style={{width:"220px",flexShrink:0}}>
            <div style={{position:"sticky",top:"80px"}}>
              <div style={{fontSize:"10px",letterSpacing:"3px",color:"#aaa",textTransform:"uppercase",marginBottom:"16px"}}>챕터 생성</div>
              <button onClick={generateAll} disabled={anyLoading||allDone}
                style={{width:"100%",background:allDone?"#eee":anyLoading?"#ddd":"#111",color:allDone?"#999":"#fff",border:"none",padding:"12px",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",cursor:allDone||anyLoading?"default":"pointer",fontFamily:"'Georgia',serif",fontWeight:"700",marginBottom:"12px"}}>
                {allDone?"✓ 생성 완료":anyLoading?"생성 중...":"전체 순차 생성"}
              </button>

              <div style={{display:"flex",flexDirection:"column",gap:"5px",marginBottom:"16px"}}>
                {defs.map(ch=>{
                  const st=chapters[ch.id]?.status||"idle";
                  return (
                    <button key={ch.id} onClick={()=>st!=="loading"&&generateChapter(ch.id)}
                      style={{width:"100%",textAlign:"left",padding:"8px 10px",background:st==="done"?"#f8f8f8":st==="error"?"#fff5f5":st==="loading"?"#fffbf0":"#fff",border:st==="done"?"1px solid #ddd":st==="error"?"1px solid #fcc":st==="loading"?"1px solid #c8a96e":"1px solid #ddd",color:st==="done"?"#888":st==="error"?"#c0392b":st==="loading"?"#c8a96e":"#111",fontSize:"11px",cursor:st==="loading"?"default":"pointer",fontFamily:"'Georgia',serif",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span>{ch.title}</span>
                      <span>{st==="done"?"✓":st==="error"?"↺":st==="loading"?"...":"▶"}</span>
                    </button>
                  );
                })}
              </div>

              <button onClick={handlePrint}
                style={{width:"100%",background:"#fff",border:"2px solid #111",color:"#111",padding:"11px",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Georgia',serif",fontWeight:"700",marginBottom:"8px"}}>
                PDF 저장 / 인쇄
              </button>
              <button onClick={resetAll}
                style={{width:"100%",background:"#fff",border:"1px solid #ddd",color:"#aaa",padding:"8px",fontSize:"10px",cursor:"pointer",fontFamily:"'Georgia',serif"}}>
                챕터 초기화
              </button>

              <div style={{marginTop:"16px"}}>
                <div style={{fontSize:"11px",color:"#aaa",marginBottom:"5px"}}>{doneCount}/{defs.length} 챕터 완료</div>
                <div style={{height:"3px",background:"#eee"}}><div style={{height:"100%",background:"#111",width:`${(doneCount/defs.length)*100}%`,transition:"width 0.5s"}}/></div>
              </div>
            </div>
          </div>

          {/* 리포트 본문 */}
          <div style={{flex:1,minWidth:0}}>
            <div className="no-print" style={{marginBottom:"32px",paddingBottom:"16px",borderBottom:"2px solid #111"}}>
              <div style={{fontSize:"10px",letterSpacing:"3px",color:"#aaa",textTransform:"uppercase",marginBottom:"5px"}}>WEROS · Brand Anatomy Consulting Report</div>
              <div style={{fontSize:"18px",color:"#111",fontWeight:"600"}}>{form.brandName} — 브랜드 해부 리포트</div>
            </div>

            {defs.map(ch=>{
              const st=chapters[ch.id]?.status||"idle";
              const content=chapters[ch.id]?.content||"";
              return (
                <div key={ch.id} style={{marginBottom:"8px"}}>
                  {st==="idle" && (
                    <div style={{padding:"28px",background:"#fafafa",border:"1px dashed #ddd",textAlign:"center"}}>
                      <div style={{fontSize:"11px",color:"#bbb",marginBottom:"10px",letterSpacing:"2px",textTransform:"uppercase"}}>{ch.title}</div>
                      <button onClick={()=>generateChapter(ch.id)} style={{background:"#111",color:"#fff",border:"none",padding:"10px 24px",fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Georgia',serif"}}>생성하기 ▶</button>
                    </div>
                  )}
                  {st==="loading" && (
                    <div style={{padding:"28px",background:"#fffbf0",border:"1px solid #c8a96e",textAlign:"center"}}>
                      <div style={{fontSize:"12px",color:"#c8a96e",letterSpacing:"2px",textTransform:"uppercase"}}>{ch.title} 생성 중...</div>
                      <div style={{fontSize:"12px",color:"#bbb",marginTop:"6px"}}>잠시만 기다려주세요 (최대 60초)</div>
                    </div>
                  )}
                  {st==="error" && (
                    <div style={{padding:"20px",background:"#fff5f5",border:"1px solid #fcc",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:"13px",fontWeight:"600",color:"#c0392b",marginBottom:"3px"}}>{ch.title} — 생성 실패</div>
                        <div style={{fontSize:"12px",color:"#999"}}>연결이 끊겼습니다. 다시 시도해주세요.</div>
                      </div>
                      <button onClick={()=>generateChapter(ch.id)} style={{background:"#c0392b",color:"#fff",border:"none",padding:"10px 18px",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Georgia',serif",whiteSpace:"nowrap"}}>다시 시도 ↺</button>
                    </div>
                  )}
                  {st==="done" && <div dangerouslySetInnerHTML={{__html:md(content)}}/>}
                </div>
              );
            })}

            {/* CTA */}
            <div className="no-print" style={{marginTop:"64px",padding:"36px 40px",background:"#f8f6f2",border:"1px solid #e8ddc8"}}>
              <div style={{fontSize:"10px",letterSpacing:"3px",color:"#aaa",textTransform:"uppercase",marginBottom:"16px"}}>WEROS BRAND ANATOMY · MEMBERSHIP</div>
              <p style={{fontSize:"19px",fontWeight:"600",color:"#111",marginBottom:"12px",lineHeight:"1.4"}}>이 진단에서 끝나지 않습니다.</p>
              <p style={{fontSize:"15px",color:"#555",lineHeight:"1.8",marginBottom:"20px"}}>
                브랜드는 시장과 함께 변합니다. WEROS 멤버십에 가입하시면<br/>
                분기·반기·연간 단위로 사업 현황을 재진단하고,<br/>
                전략의 실행 여부와 다음 방향을 지속적으로 점검받을 수 있습니다.<br/>
                <strong>처방 이후의 사후 관리까지 — 합리적인 가격으로.</strong>
              </p>
              <div style={{display:"flex",alignItems:"center",gap:"24px",flexWrap:"wrap"}}>
                <div>
                  <div style={{fontSize:"12px",color:"#aaa",letterSpacing:"1px",marginBottom:"4px"}}>문의 및 멤버십 신청</div>
                  <a href="mailto:mrwiver@naver.com" style={{fontSize:"16px",color:"#111",fontWeight:"600",textDecoration:"none",letterSpacing:"0.5px"}}>mrwiver@naver.com</a>
                </div>
                <div style={{height:"40px",width:"1px",background:"#ddd"}}/>
                <div style={{fontSize:"13px",color:"#888",lineHeight:"1.6"}}>
                  분기 리포트 · 반기 심층 분석 · 연간 전략 컨설팅<br/>맞춤형 플랜으로 구성됩니다
                </div>
              </div>
            </div>

            <div style={{marginTop:"28px",textAlign:"center",fontSize:"10px",color:"#ccc",letterSpacing:"2px"}}>
              © 2026 WEROS Brand Anatomy · AI-Powered Consulting Report
            </div>
          </div>
        </div>
      )}
    </>
  );
}
