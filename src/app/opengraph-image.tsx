import { ImageResponse } from 'next/og';

// Site-wide Open Graph / social share image (1200x630)
export const alt = 'Income Tally — Net Salary & Take-Home Pay Calculator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#0066FF',
        color: '#FFFFFF',
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 40, opacity: 0.9, letterSpacing: '0.02em' }}>incometally.com</div>
      <div
        style={{
          fontSize: 86,
          fontWeight: 700,
          marginTop: 24,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
        }}
      >
        Net Salary &amp; Take-Home Pay Calculator
      </div>
      <div style={{ fontSize: 34, marginTop: 28, opacity: 0.92 }}>
        Free, country-specific tax estimates for the US, Germany &amp; the UK
      </div>
    </div>,
    { ...size }
  );
}
