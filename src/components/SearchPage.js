import React, {useState, useEffect } from 'react';
import SearchBar from './ShoppiesMovieSearch';
import MovieList from './MovieList';

const SearchPage = (props) => {
    const [ input, setInput ] = useState('');
    const [ MovieListDefault, setMovieListDefault ] = useState();
    const [ movieList, setMovieList ] = useState();

    const fetchData = async () => {
        return await fetch('http://www.omdbapi.com/apikey.aspx')
            .then(res => res.json())
            .then(data => {
                setMovieList(data)
                setMovieListDefault(data)
            });
    }

    const updateInput = async (input) => {
        const filtered = MovieListDefault.filter(movie => {
            return movie.name.toLowerCase().includes(input.toLowerCase())
        })
        setInput(input);
        setMovieList(filtered);
    }

    useEffect( () => {fetchData()},[]);

    return (
        <>
            <h2>Movie Title</h2>
            <SearchBar
                input={input}
                onChange={updateInput}
            />
            <MovieList movieList={movieList}/>
        </>
    );
}

export default SearchPage
