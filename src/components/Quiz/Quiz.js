import React, {useState} from 'react';
import {useQuizApi} from './hooks/useQuizApi';
import Question from "./Question";
import EmailStep from "./EmailStep";

function Quiz({config}) {
    const {quizData} = useQuizApi(config);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isEmailStep, setIsEmailStep] = useState(false);
    const [isResultsStep, setIsResultsStep] = useState(false);
    const questionsArray = quizData && quizData.questionsArray;
    const questionsTotal = questionsArray && questionsArray.length;
    const activeQuestion = questionsArray && questionsArray[activeIndex];

    const prevAction = () => {
        if(isEmailStep) {
            setIsEmailStep(false);
        } else {
            const isFirst = activeIndex === 0;
            const index = isFirst ? 0: activeIndex - 1;

            setActiveIndex(index)
        }
    }

    const nextAction = () => {
        if(isEmailStep) {
            setIsEmailStep(false);
            setIsResultsStep(true);
        } else {
            const isLast = activeIndex === questionsArray.length - 1;

            if(isLast) {
                setIsEmailStep(true);
            } else {
                setActiveIndex(activeIndex + 1);
            }
        }
    }

    return (
        quizData ?
            <div className={'quiz-widget__holder'}>
                {
                    !isResultsStep &&
                    <button
                        type={'button'}
                        onClick={prevAction}
                    >
                        {'<'}
                    </button>
                }

                {
                    activeQuestion && !isEmailStep && !isResultsStep &&
                    <Question
                        questionObj={activeQuestion}
                        questionsTotal={questionsTotal}
                        activeIndex={activeIndex}
                    />
                }

                {
                    isEmailStep && <EmailStep/>
                }

                {
                    !isResultsStep &&
                    <button
                        type={'button'}
                        onClick={nextAction}
                    >
                        {'>'}
                    </button>
                }
            </div>
            :
            ''
    )
}

export default Quiz;