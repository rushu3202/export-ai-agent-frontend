export default function Card({
  children,
  title,
  subtitle,
  actions,
  className = '',
  padding = true,
  shadow = true,
  ...props
}) {
  return (
    <div
      className={`
        bg-white rounded-2xl overflow-hidden
        ${shadow ? 'shadow-lg hover:shadow-xl transition-shadow' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className={`border-b border-gray-200 ${padding ? 'p-6' : 'p-4'}`}>
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>{children}</div>
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`border-b border-gray-200 p-6 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`border-t border-gray-200 p-6 bg-gray-50 ${className}`}>{children}</div>;
}
