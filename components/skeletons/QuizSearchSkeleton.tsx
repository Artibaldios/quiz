export default function QuizSearchSkeleton() {
  return (
    <div className="flex flex-col p-4 md:p-6 min-h-[400px] rounded-md space-y-6 animate-pulse">
      {/* Search input skeleton - matches exact dimensions */}
      <div className="relative flex justify-center gap-2 mb-6 items-center">
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <div className="w-full h-12 glass bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>

      {/* Two carousel skeletons - matches QuizCarousel structure */}
      <div className="space-y-8">
        {/* Popular carousel skeleton */}
        <CarouselSkeleton title="Popular" />
        
        {/* Latest carousel skeleton */}
        <CarouselSkeleton title="Latest" />
      </div>
    </div>
  );
}

function CarouselSkeleton({ title }: { title: string }) {
  return (
    <section>
      {/* Header with title + buttons skeleton */}
      <div className="flex items-center justify-between mb-2">
        <div className="h-8 w-48 md:w-64 bg-gray-300 dark:bg-gray-600 rounded-lg" />
        <div className="flex gap-2">
          <div className="w-11 h-11 glass bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="w-11 h-11 glass bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
      
      {/* Carousel track with 6 card skeletons */}
      <div className="relative">
        <div className="flex overflow-x-auto overflow-y-hidden gap-6 p-2 md:py-6 scrollbar-hide">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-none w-80 md:w-90 h-[300px]">
              <div className="h-full glass rounded-2xl p-6 space-y-4 bg-gray-200 dark:bg-gray-700">
                {/* Card image skeleton */}
                <div className="w-full h-40 bg-gray-300 dark:bg-gray-600 rounded-xl" />
                
                {/* Card title skeleton */}
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-4/5" />
                
                {/* Card stats skeleton */}
                <div className="flex gap-4 mt-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
