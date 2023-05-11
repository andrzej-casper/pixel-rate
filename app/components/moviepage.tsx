export function MoviePageView({ movie, children = <></> }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex">
        <div className="w-1/3">
          <img src={movie.slug} alt="Movie Poster" className="w-full h-full object-cover" />
        </div>
        <div className="w-2/3 p-4">
          <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}