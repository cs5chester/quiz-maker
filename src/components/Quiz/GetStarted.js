import React from 'react';

function GetStarted({setIsQuizStarted, quizTime}) {
    const quizTimeText = `Quiz time: ${quizTime} minutes`
    return (
        <div className={'quiz-widget__get-started'}>
            <h2>Sleep selector</h2>
            <div className={'quiz-widget__quiz-time'}>{quizTimeText}</div>

            <button
                type={'button'}
                onClick={() => setIsQuizStarted(true)}
            >
                Get started
            </button>
        </div>
    )
}

export default GetStarted;