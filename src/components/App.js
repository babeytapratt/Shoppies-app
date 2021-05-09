import React, { useState, useEffect } from 'react';
import "../App.css";
import Header from '../Header/Header';
import Movie from './Movie';
import Search from './Search';

const MOVIE_API_URL = "https://www.omdbapi.com/?i=tt3896198&apikey=10bf1bd2"

const App = () => {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        fetch(MOVIE_API_URL)
          .then(response => response.json())
          .then(jsonResponse => {
            setMovies(jsonResponse.Search);
            setLoading(false);
        });
    }, []);

    const search = searchValue => {
        setLoading(true);
        setErrorMessage(null);

    fetch('https://www.omdbapi.com/?s=${searchValue}apikey=10bf1bd2')
        .then(res => res.json())
        .then(jsonRes => {
            if (jsonRes.Res === 'true') {
                setMovies(jsonRes.Search);
                setLoading(false);
            } else {
                setErrorMessage(json.Res.Error)
                setLoading(false);
            }
        });
    };

    return (
        <div className="App">
            <Header text="Shoppie Nominations" />
            <Search search={search} />
            <p className="App-intro">Search for a movie and nominate your favorite movie for a Shoppie</p>
            <div className="movies">
                {loading && !errorMessage ? (
                    <span>loading your movies...</span>
                ) : errorMessage ? (
                    <div className="errorMessage">{errorMessage}</div>
                    ) : (
                    movies.map((movie, index) => (
                        <Movie key={'${index}-${movie.Title}'} movie={movie} />
                    )
                )
                )}
            </div>
        </div>
    );
};

export default App;
