import React from 'react';

const MovieResults = props => {
    const { title } = props.movie;

    return (
        <div classname="movie-results-card">
            <h2>{title}</h2>
        </div>
    )
};

export default MovieResults;
