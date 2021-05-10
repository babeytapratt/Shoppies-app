import React from 'react';
import '../../scssFiles/nominationCounter.scss';
const NominationCounter = (props) => {

    return (
        <p className="nominationCounter">Nominated <span>{props.nominationList.length}/5</span></p>

    )
}

export default NominationCounter;
