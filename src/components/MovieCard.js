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
