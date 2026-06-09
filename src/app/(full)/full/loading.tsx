export default function FullMenuLoading() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0D1117]">
      {/* Hero skeleton */}
      <section className="w-full h-[100vh] flex flex-col items-center justify-center gap-6">
        <div className="w-64 h-20 bg-white/5 rounded-2xl animate-pulse" />
        <div className="w-80 h-12 bg-white/5 rounded-xl animate-pulse" />
        <div className="w-48 h-8 bg-white/5 rounded-lg animate-pulse" />
      </section>

      {/* Category section skeleton */}
      <section className="w-full min-h-screen px-4 md:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Category header */}
          <div className="mb-12 space-y-4">
            <div className="w-32 h-6 bg-white/5 rounded-full animate-pulse" />
            <div className="w-96 h-12 bg-white/5 rounded-xl animate-pulse" />
            <div className="w-64 h-6 bg-white/5 rounded-lg animate-pulse" />
          </div>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-3xl h-72 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
