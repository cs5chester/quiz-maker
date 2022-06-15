import React, {useEffect} from 'react'

import './widget.css';

function Widget() {
    function addScript( src ) {
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.addEventListener("load", function(event) {
            qz.setKey("A1403561515LA6471E1H5LAD298D685LA3162I9102L4753I4512LA14827176DL1906307B4");

            /* Load your Quiz */
            qz.load({
                quiz: "QFMF6P7V5",
                parent: ".widget-holder",
                onCreate: function(quizDetails) {
                    console.log(quizDetails);
                }
            });
        });
        script.src = src;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    useEffect(()=>{
        addScript('https://take.quiz-maker.com/3012/CDN/quiz-embed-v1.js')
    }, [])

    return (
        <div className={'widget-holder'}></div>
    )
}

export default Widget;