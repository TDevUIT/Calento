import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Calento - AI Calendar Assistant';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '80px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            Calento
          </div>
          <div
            style={{
              fontSize: 36,
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: 40,
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            AI Calendar Assistant for Smart Scheduling
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '20px 40px',
              borderRadius: 50,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ fontSize: 24, color: 'white' }}>
              ✨ AI-Powered
            </div>
            <div
              style={{
                width: 2,
                height: 30,
                background: 'rgba(255, 255, 255, 0.3)',
              }}
            />
            <div style={{ fontSize: 24, color: 'white' }}>
              📅 Smart Sync
            </div>
            <div
              style={{
                width: 2,
                height: 30,
                background: 'rgba(255, 255, 255, 0.3)',
              }}
            />
            <div style={{ fontSize: 24, color: 'white' }}>
              📊 Analytics
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
