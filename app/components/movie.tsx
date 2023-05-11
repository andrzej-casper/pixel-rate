import { Link } from "@remix-run/react";

export function MovieView({ movie }) {
  return (
    <Link
      to={"/movies/" + movie.slug}
    >
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="flex">
      <div className="w-1/3">
        <img src={`/posters/${movie.slug}.jpg`} alt="Movie Poster" className="w-full h-full object-cover" />
      </div>
      <div className="w-2/3 p-4">
        <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
        <div className="flex items-center hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12.585L4.542 17l1.296-7.524L.567 7.315l7.384-1.074L10 0l2.05 6.241 7.383 1.074-5.27 4.16L15.458 17z" />
          </svg>
          <span className="text-gray-600 text-lg">8.5/10</span>
        </div>
      </div>
    </div>
  </div>
    </Link>
  );
}