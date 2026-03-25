export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-primary" />
          </div>
        </div>
      )}
      {title && <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}
