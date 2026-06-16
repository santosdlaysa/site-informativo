'use client';

export default function MaintenancePage() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #3b82f6 50%, #7c3aed 75%, #a855f7 100%)',
        fontFamily: 'var(--font-poppins), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
      }}
    >
      {/* Background animado */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '25%',
            width: '24rem',
            height: '24rem',
            background: 'rgba(59, 130, 246, 0.3)',
            borderRadius: '9999px',
            filter: 'blur(80px)',
            animation: 'blob 7s infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: '25%',
            width: '24rem',
            height: '24rem',
            background: 'rgba(168, 85, 247, 0.3)',
            borderRadius: '9999px',
            filter: 'blur(80px)',
            animation: 'blob 7s infinite',
            animationDelay: '2s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            width: '24rem',
            height: '24rem',
            background: 'rgba(244, 114, 182, 0.3)',
            borderRadius: '9999px',
            filter: 'blur(80px)',
            animation: 'blob 7s infinite',
            animationDelay: '4s',
          }}
        />
      </div>

      {/* Conteúdo */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '1rem',
          maxWidth: '42rem',
        }}
      >
        {/* Ícone */}
        <div
          style={{
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <svg
            style={{
              width: '8rem',
              height: '8rem',
              color: 'white',
              animation: 'spin 3s linear infinite',
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {/* Título */}
        <h1
          style={{
            fontSize: '3.75rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1.5rem',
            marginTop: 0,
            textShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          }}
        >
          Em Manutenção
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            fontSize: '1.25rem',
            color: 'rgba(219, 234, 254, 1)',
            marginBottom: '3rem',
            lineHeight: '1.5',
          }}
        >
          Estamos trabalhando para oferecer uma experiência ainda melhor.
        </p>

        {/* Card de status */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                width: '0.75rem',
                height: '0.75rem',
                background: '#4ade80',
                borderRadius: '9999px',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
            <p
              style={{
                color: 'white',
                fontWeight: 600,
                fontSize: '1.125rem',
                margin: 0,
              }}
            >
              Sistema em atualização
            </p>
          </div>
          <p
            style={{
              color: 'rgba(219, 234, 254, 1)',
              fontSize: '0.875rem',
              margin: 0,
            }}
          >
            Voltaremos muito em breve com novidades incríveis
          </p>
        </div>

        {/* Footer */}
        <p
          style={{
            color: 'rgba(191, 219, 254, 1)',
            fontSize: '0.75rem',
            margin: 0,
          }}
        >
          Raros Boa Vista © 2024
        </p>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        * {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
