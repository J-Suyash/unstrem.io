const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';

export const getTrendingMovies = async () => {
  const response = await fetch(
    `${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
  );
  const data = await response.json();
  return data.results;
};
