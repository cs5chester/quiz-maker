import React, {useState, useEffect} from 'react';
import Quiz from '../Quiz/Quiz'
import GetStarted from "../Quiz/GetStarted";
import '../../styles/widget.css';

function Widget({config}) {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const minutes = config.quizTimeMinutes;

    if(isQuizStarted && minutes) {
        const quizTime = +minutes * 60000;

        setTimeout(()=>{
            setIsQuizStarted(false);
        }, quizTime)
    }
    return (
        <div className={'quiz-widget-holder'}>
            {
                isQuizStarted ?
                    <Quiz config={config}/>
                :
                    <GetStarted
                        setIsQuizStarted={setIsQuizStarted}
                        quizTime={minutes}
                    />

            }
        </div>
    )
}

export default Widget;