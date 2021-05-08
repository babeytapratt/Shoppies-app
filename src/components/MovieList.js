import React from 'react';

const MovieList = ({movieList=[]}) => {
    return (
        <>
        { movieList.map((data,index) => {
            if (data) {
                return (
                    <div key={data.name}>
                        <h2>{data.name}</h2>
                    </div>
                )
            }
            return null
        }) }
        </>
    );
};

export default MovieList
