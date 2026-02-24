export const metadata = {
  title: 'WEROS Brand Anatomy — AI 브랜드 진단 리포트',
  description: '고가 컨설턴트급 브랜드 진단을 합리적인 가격으로. 진단부터 90일 실행 로드맵까지.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
