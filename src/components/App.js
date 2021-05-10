// import React, { useReducer, useEffect } from "react";

// import Header from "./Header";
// import Movie from "./Movie";
// import spinner from "../assets/ajax-loader.gif";
// import Search from "./Search";
// import { initialState, reducer } from "../store/index";
// import axios from "axios";

// const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=10bf1bd2";

// const App = () => {
//     const [state, dispatch] = useReducer(reducer, initialState);

//     useEffect(() => {
//         axios.get(MOVIE_API_URL).then(jsonResponse => {
//             dispatch({
//                 type: "SEARCH_MOVIES_SUCCESS",
//                 payload: jsonResponse.data.Search
//             });
//         });
//     }, []);

//     const refreshPage = () => {
//         window.location.reload();
//     };

//     const search = searchValue => {
//             dispatch({
//                 type: "SEARCH_MOVIES_REQUEST"
//             });

//             axios(`https://www.omdbapi.com/?s=${searchValue}&apikey=10bf1bd2`)
//                 .then(jsonResponse => {
//                     if (jsonResponse.data.Response === "True") {
//                     dispatch({
//                         type: "SEARCH_MOVIES_SUCCESS",
//                         payload: jsonResponse.data.Search
//                     });
//                 } else {
//                     dispatch({
//                         type: "SEARCH_MOVIES_FAILURE",
//                         error: jsonResponse.data.Error
//                     });
//                 }
//             }
//         );
//     };

//     const { movies, errorMessage, loading } = state;

//     const retrievedMovies =
//         loading && !errorMessage ? (
//             <img className="spinner" src={spinner} alt="Loading spinner" />
//         ) : errorMessage ? (
//             <div className="errorMessage">{errorMessage}</div>
//         ) : (
//             movies.map((movie, index) => (
//                 <Movie key={`${index}-${movie.Title}`} movie={movie} />
//             ))
//         );

//     return (
//         <div className="App">
//             <div className="m-container">
//                 <Header text="Shoppies Nominations" />

//                 <Search search={search} />

//                 <p className="App-intro">Nominate your favorite movie for a Shoppie</p>

//             <div className="movies">{retrievedMovies}</div>
//         </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import MovieList from './MovieList';
import Dropdown from './Dropdown';
import SearchHistory from './SearchHistory';
import ButtonContext from '../contexts/ButtonContext';
import axios from 'axios';
import { tmdbSearchUrl, tmdbMovieUrl } from '../apis/tmdb';

import './App.css';


const App = () => {

    // state for searchbar text
    const [searchBarText, setSearchBarText] = useState('');

    const MAX_RESULTS_PER_PAGE = 5;
    const [searchResults, setSearchResults] = useState([]);
     // initialize results index for pagination
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const searchResultsSelected = searchResults.slice(currentResultIndex, currentResultIndex+MAX_RESULTS_PER_PAGE);

    const [resultsText, setResultsText] = useState('');
    const [cache, setCache] = useState([]);
    const [loading, setLoading] = useState(false);



       // whenever the search results change, reset to 0
       useEffect(() => {
           setCurrentResultIndex(0);
       }, [searchResults]);




    // function to search for a term
    const getResults = (searchTerm) => {
        // if term is empty string do nothing
        if (!searchTerm) return;

        // check if terms already in cache (i.e. already searched)
        const termRecord = cache.find(({ term }) => term === searchTerm);
        // if so, update state with that object
        if (termRecord) {
            const { term, searchResults } = termRecord;
            setResultsText(`Results for: "${searchTerm}"`)
            setSearchResults(searchResults);
        } else {
            // else search api
            searchTMDB(searchTerm);
        };
        // clear search bar text
        setSearchBarText('');

    };

    // function to search TMDB
    const searchTMDB = async (searchTerm) => {

        // set loading
        setLoading(true);

        // make request
        const response = await axios.get(tmdbSearchUrl, {
            params: {
                query: searchTerm
            }
        });
        const {data} = response;
        const movies = data.results;
        if (!movies.length) {
            setResultsText('No results found. Please try another search');
            setLoading(false);
            return;
        }
        // make another request to get movie data using movie id
        const promises = await Promise.all(
            movies.map(({ id }) => {
                const url = tmdbMovieUrl(id);
                return axios.get(url);
            })
        );
        // update search results, results message
        setLoading(false);
        const text = `Results for: "${searchTerm}"`
        setResultsText(text);
        const movieData = promises.map(promise => promise.data);
        setSearchResults(movieData);


        // update cache
        const cacheObj = {'term': searchTerm, 'resultsText': text, 'searchResults': movieData};
        addHistory(cacheObj);

    }


    // function to add term object to cache
    const addHistory = cacheObj => {
        setCache([...cache, cacheObj]);
    };

    // function to update page with data from previously searched term
    const retrieveHistory = (cacheObj) => {
        // extracting keys
        const { term, resultsText, searchResults } = cacheObj;
        // update the search result list
        setSearchResults(searchResults);
        // update results message
        setResultsText(resultsText);
    };

    // function to remove term and its data from search history
    const removeHistory = (cacheObj) => {
        // delete term entry in cache
        setCache(cache.filter(termObj => termObj.term !== cacheObj.term));
    };

    const removeHistoryAll = () => {
        setCache([]);
    }


    // initialize category list
    const categoryList = ['Action', 'Animation', 'Drama', 'Comedy', 'Romance'
                        ].sort();
    // state to control which category label index selected
    const indexInitial="0";
    const [categoryIndexSelected, setCategoryIndexSelected] = useState(indexInitial);
    const nominationListOfListsInitial = categoryList.map(category => {
        return {'category': category, 'nominations': []};
    });
    const [nominationListOfLists, setNominationListofLists] = useState(nominationListOfListsInitial);
    const nominationListSelectedInitial = nominationListOfLists[indexInitial].nominations
    const [nominationListSelected, setNominationListSelected] = useState(nominationListSelectedInitial);



    // function to change which category is currently selected
    const selectCategory = (event) => {
        const index = event.target.value;
        setCategoryIndexSelected(index);
        setNominationListSelected(nominationListOfLists[index].nominations);
    };

    // function to add movie to nomination list
    const addNomination = (movie) => {
        nominationListOfLists[categoryIndexSelected].nominations = [...nominationListOfLists[categoryIndexSelected].nominations, movie];
        setNominationListSelected(nominationListOfLists[categoryIndexSelected].nominations);
        setNominationListofLists(nominationListOfLists);
    };

    // function to reset nomination list
    const resetNominations = () => {
        nominationListOfLists[categoryIndexSelected].nominations = [];
        setNominationListSelected(nominationListOfLists[categoryIndexSelected].nominations);
        setNominationListofLists(nominationListOfLists);
    };

    // function to reset ALL nomination list
    const resetNominationsAll = () => {
        setNominationListSelected([]);
        setNominationListofLists(nominationListOfListsInitial);
    };

    // function to remove nomination from list
    const removeNomination = (movie) => {
        nominationListOfLists[categoryIndexSelected].nominations = nominationListOfLists[categoryIndexSelected].nominations.filter(m => m !== movie);
        setNominationListSelected(nominationListOfLists[categoryIndexSelected].nominations);
        setNominationListofLists(nominationListOfLists);
    };




    // state for number of remaining entries
    const MAX_ENTRIES = 5;


    // useEffect to set buttons state when results change or nominations change
    const [buttonsMovies, setButtonsMovies] = useState([]);
    useEffect(() => {
        // find all buttons in results => check if max nominations exceeded or result already nominated and disable
        const buttonsArr = document.querySelectorAll(`#movie-search-list-div .ui.accordion button`).forEach((button, index) => {
            button.disabled = nominationListSelected.length >= MAX_ENTRIES || nominationListSelected.map(movie => movie.id).includes(searchResultsSelected[index].id);
            return button;
        });

        setButtonsMovies(buttonsArr);
    }, [searchResultsSelected, nominationListSelected]);

    const showPrevResults = () => {
        setCurrentResultIndex(currentResultIndex-MAX_RESULTS_PER_PAGE)
    };

    // whenever the current results display changes, update button state
    const [nextResultsBtn, setNextResultsBtn] = useState('');
    const showNextResults = () => {
        setCurrentResultIndex(currentResultIndex+MAX_RESULTS_PER_PAGE)
    };

    // JSX element for results pagination
    const resultsButtons = (
            <span>
                <button
                    className={`ui icon ${currentResultIndex<=0 ? 'disabled' : ''} button`}
                    onClick={showPrevResults}
                >
                    <i className="chevron left icon" />
                </button>
                <button
                    className={`ui icon ${currentResultIndex+MAX_RESULTS_PER_PAGE>=searchResults.length ? 'disabled' : ''} button`}
                    onClick={showNextResults}
                >
                    <i className="chevron right icon" />
                </button>
                {currentResultIndex+1}-{Math.min(searchResults.length, currentResultIndex+MAX_RESULTS_PER_PAGE)} of {searchResults.length}
        </span>
        );


    return (
        <div>
            <div id="main-header" className="ui header">
                <h1>Movie NomiNATION</h1>
                <div id="divider">
                    <span>{nominationListSelected.length >= MAX_ENTRIES ? `You have nominated ${MAX_ENTRIES} movies for this category` : ''}</span>
                </div>
            </div>
            <div id="searchbar">
                <SearchBar
                    searchBarText={searchBarText}
                    setSearchBarText={setSearchBarText}
                    search={getResults}
                    loading={loading}
                />
            </div>
            <div className="ui grid">

                {/*div to render movies from search results*/}
                {/*all buttons in this movie list are the same, so it's fine to use context*/}
                <div id="movie-search-list-div" className="six wide column">
                    <div className="ui header">
                        <h3>
                            {resultsText}
                           {searchResults.length ? resultsButtons : ''}
                        </h3>
                    </div>
                    {/*pass button properties so all buttons in child components will be the same*/}
                    <ButtonContext.Provider
                        value={{
                            buttonText: <i className="ui add icon" />,
                            buttonClick: (movie => addNomination(movie)),
                            buttonClass: "mini ui positive button icon"
                            //buttonClass: "ui positive right floated icon button"
                        }}
                    >
                        <MovieList movieList={searchResultsSelected} />
                    </ButtonContext.Provider>
                </div>

                {/*div to show movies that have been nominate*/}
                {/*again, all buttons in this list are the same, so it's fine to use context*/}
                <div id="nomination-list-div" className="six wide column">
                    <div id="nomination-header" className="ui header">
                        <h3>
                            Nominations for
                            <Dropdown
                                options={nominationListOfLists.map(({ category, nominations}) => `${category} (${nominations.length})`)}
                                //options={categoryList}
                                optionSelected={categoryIndexSelected}
                                onSelect={selectCategory}
                            />
                            <span>(Limit {MAX_ENTRIES})</span>

                            <button
                                className="ui small button"
                                onClick={resetNominations}
                            >
                                Reset
                            </button>
                            <button
                                onClick={resetNominationsAll}
                                className="ui small button"
                            >
                                Reset All
                            </button>
                        </h3>

                    </div>

                    {/*pass button properties so all buttons in child components will be the same*/}
                   <ButtonContext.Provider
                        value={{
                            buttonText: <i className="ui minus icon" />,
                            buttonClick: (movie => removeNomination(movie)),
                            buttonClass: "mini ui negative icon button"
                        }}
                    >
                        <MovieList movieList={nominationListSelected} />
                    </ButtonContext.Provider>
                </div>



                {/*previous search terms (these are cached)*/}
                <div id="prev-search-list-div" className="four wide column">
                        <div className="ui header">
                            <h3>
                                Search History
                                <button id="clear-hist-btn"
                                    className="ui mini button"
                                    onClick={removeHistoryAll}
                                >
                                    Clear
                                </button>
                            </h3>
                        </div>
                    <div id="search-history">
                        <SearchHistory
                            cache={cache}
                            retrieveHistory={retrieveHistory}
                            removeHistory={removeHistory}
                        />
                    </div>


                </div>

            </div>

        </div>
    );
};

export default App;
