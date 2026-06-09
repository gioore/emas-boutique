'use client';

interface Props {
  title?: string;
  message?: string;
  onReset?: () => void;
  fullPage?: boolean;
  bgColor?: string;
}

export default function ErrorFallback({
  title = 'Algo salió mal',
  message = 'Ocurrió un error inesperado. Intenta de nuevo.',
  onReset,
  fullPage = true,
  bgColor = '#faf7f2',
}: Props) {
  return (
    <div className={`flex items-center justify-center p-8 ${fullPage ? 'min-h-screen' : ''}`} style={{ backgroundColor: bgColor }}>
      <div className="text-center max-w-md">
        <p className="text-lg font-semibold" style={{ color: '#991b1b' }}>{title}</p>
        <p className="text-sm mt-2" style={{ color: '#57534e' }}>{message}</p>
        {onReset && (
          <button onClick={onReset} className="mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ backgroundColor: '#1c1917', color: '#ffffff' }}>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
