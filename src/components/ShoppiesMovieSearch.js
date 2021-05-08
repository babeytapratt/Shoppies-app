import React from 'react';

const SearchBar = ({ keyword, setKeyword }) => {
    const BarStyling = {width:"20rem",background:"whitesmoke", border:"none", padding:"0.5rem"};

    return (
        <input
        style={BarStyling}
        key="random1"
        value={keyword}
        placeholder={"search movie title"}
        onChange={(e) => setKeyword(e.target.value)}
        />
    );
}

export default SearchBar
