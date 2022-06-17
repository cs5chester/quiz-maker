import {useState, useEffect} from 'react';

const stringToHTML = (str) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');

    return doc.body;
};

const setLoadMoreData = (questionObj) => {
    const question = questionObj.question;
    const body = stringToHTML(question);
    const dataTag = body.getElementsByTagName('code')[0];
    const title = dataTag.getAttribute('data-title');
    const text = dataTag.getAttribute('data-text');
    const image = questionObj.image

    dataTag.remove();

    questionObj.question = body.innerText.replace(/\n/g, '');

    return {
        title,
        text,
        image
    }
}

const isQuestion = question => question.answers && question.question && question;

const optimizeData = (data) => {
    const questions = data && data.schema && data.schema.questions;

    data.questionsArray = Object.keys(questions).map((key) => {
        const question = questions[key];

        if(question && isQuestion(question)){
            question.loadmoreData  = setLoadMoreData(question);
            question.answers =  question.answers.filter((answer) => {
                return answer;
            })
        }

        question.id = key;

        return  question;
    }).filter(question => isQuestion(question))

    return data;
}

export const useQuizApi =  ({quizApiScript, publicKey, quizId}) => {
    const [quizData, setQuizData] = useState(null);
    const starterId = 'qzstarter';
    const starter = document.createElement('div');
    starter.setAttribute('style', 'display: none');
    starter.setAttribute('id', starterId)

    const onQuizCreate = quizDetails => {
        starter.remove();
        setQuizData(optimizeData(quizDetails))
    }

    const onScriptLoad = () => {
        document.body.appendChild(starter);

        qz.setKey(publicKey);
        qz.load({
            quiz: quizId,
            parent: `#${starterId}`,
            onCreate: onQuizCreate
        });
    }

    const addScript = () => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.addEventListener('load', onScriptLoad);
        script.src = quizApiScript;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    useEffect(() => {
        addScript()
    }, [])

    return {quizData}
}
