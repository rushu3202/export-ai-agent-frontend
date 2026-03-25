export function TableSkeleton({ rows = 5, columns = 5 }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: '1rem'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
        
        <div className="space-y-4">
          <div style={gridStyle} className="pb-3 border-b border-gray-200">
            {Array(columns).fill(0).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          
          {Array(rows).fill(0).map((_, i) => (
            <div key={i} style={gridStyle}>
              {Array(columns).fill(0).map((_, j) => (
                <div key={j} className="h-6 bg-gray-100 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-4/6"></div>
            </div>
            <div className="mt-6 flex gap-2">
              <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="animate-pulse">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
        <div className="divide-y divide-gray-100">
          {Array(rows).fill(0).map((_, i) => (
            <div key={i} className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-12 bg-gray-100 rounded-xl"></div>
            </div>
          ))}
        </div>

        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-32 bg-gray-100 rounded-xl"></div>
        </div>

        <div className="flex gap-3 pt-4">
          <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
          <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-200 rounded-xl"></div>
              <div className="h-6 w-16 bg-blue-200 rounded-lg"></div>
            </div>
            <div className="h-8 bg-blue-200 rounded-lg w-2/3 mb-2"></div>
            <div className="h-4 bg-blue-100 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchResultSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-xl flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="flex gap-2 mt-4">
                  <div className="h-6 w-20 bg-blue-100 rounded-lg"></div>
                  <div className="h-6 w-24 bg-green-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
