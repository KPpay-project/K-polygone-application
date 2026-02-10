function KycPreviewSkeletonLoader() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-8">
        {[...Array(7)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-3 gap-x-12 gap-y-6 mb-6">
              {[...Array(6)].map((_, fieldIndex) => (
                <div key={fieldIndex}>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KycPreviewSkeletonLoader;
