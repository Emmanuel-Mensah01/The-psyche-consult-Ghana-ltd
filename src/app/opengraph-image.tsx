import { ImageResponse } from 'next/og';

export const alt = 'The Psyche Consult Ghana Ltd: study abroad experts in Ghana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 30, color: '#fcd34d', fontWeight: 700, letterSpacing: 2 }}>STUDY ABROAD EXPERTS IN GHANA</div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>The Psyche Consult Ghana Ltd</div>
        <div style={{ fontSize: 34, marginTop: 32, color: '#c7d2fe' }}>
          University admissions · Student visas · Scholarships
        </div>
        <div style={{ fontSize: 30, marginTop: 20, color: '#a5b4fc' }}>USA · UK · Canada · Spain · France · Offices in Accra &amp; Kumasi</div>
      </div>
    ),
    { ...size }
  );
}
