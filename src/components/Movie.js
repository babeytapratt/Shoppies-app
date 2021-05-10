// import React from 'react';

// const DEFAULT_PLACEHOLDER_IMAGE =
// "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg";

// const Movie = ({ movie }) => {
//     const poster =
//         movie.Poster === "N/A" ? DEFAULT_PLACEHOLDER_IMAGE : movie.Poster;

//     return (
//         <div classname='movie'>
//             <h2>{movie.Title}</h2>
//             <div>
//                 <img
//                     width='200'
//                     alt={`The movie titled: ${movie.title}`}
//                     src={poster}
//                 />
//                 <button classname="nominate_button">Nominate</button>
//             </div>
//             <p>({movie.Year})</p>
//         </div>
//     );
// };

// export default Movie;

import React from 'react';
import { tmdbPoster } from '../apis/tmdb';
import './Movie.css';

const Movie = ({ movie }) => {



    // get button attributes from Context

    // parse out movie data
    const { poster_path, title, genres, overview, release_date, tagline, runtime } = movie;

    // get movie poster path; if no poster - use the 'not found' image
    const posterImg = poster_path ? tmdbPoster(poster_path) : '/imageNotFound.jpg';

    // combine genre array into string
    const genreString = genres.map(genre => genre.name).join(' | ');

    // format overview
    const maxCharLen = 300;
    const overviewNew = overview.length > maxCharLen ? `${overview.substring(0,maxCharLen)}...` : overview;


    return (
        <div className="ui items">
            <div className="item">
                <div className="image">
                    <img src={posterImg} alt={title} />
                </div>
                <div className="content">
                    <div className="header">{title}</div>
                    <div className="meta">Released: {release_date}</div>
                        <div className="meta">Runtime: {runtime} min.</div>
                        <div className="meta">{genreString}</div>
                        <div className="extra content"><em>{tagline}</em></div>
                        <div className="description">{overviewNew}</div>
                </div>
            </div>
        </div>
    );
};

export default Movie;
