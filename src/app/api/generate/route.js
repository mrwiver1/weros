import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
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

    const data = await res.json();
    const text = data.content?.map(c => c.text || "").join("") || "";
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
