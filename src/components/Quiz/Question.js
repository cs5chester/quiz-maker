import React, {useState} from 'react';
import {useQuizApi} from './hooks/useQuizApi';

function Question({questionObj, questionsTotal, activeIndex}) {
    const answers = questionObj.answers;
    const questionsProgressText = `Question ${activeIndex + 1} of ${questionsTotal}`
    console.log(questionObj);

    return (
        <div className={'quiz-widget__question'}>
            <div className={'quiz-widget__question-progress-text'}>
                {questionsProgressText}
            </div>

            <h3 className={'quiz-widget__question-heading'}>
                {questionObj.question}
            </h3>

            <div className="qp_a" cn="qp_a" onClick={(e)=>quiz.saveQ(e, e.target)} sel="1" cm="1">
                <div className="qp_imgres">
                    <div id="qp_imgres12662947_4" className="qp_imgresi">
                        <div className="qp_rp">0%</div>
                        <div className="qp_rv qp_rva">
                            <div>0</div>
                        </div>
                    </div>
                </div>

                <span className="qp_t">
                    <input className="qp_i" name="qp_v12662947" type="radio" value="4" />
                        Myself and Partner
                    </span>
            </div>

        </div>
    )
}

export default Question;