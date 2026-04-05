import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import shuffleArray from 'shuffle-array';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(false);
  const [marks, setMarks] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const inputRefs = useRef([]);

  useEffect(() => {
    axios('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple')
      .then(res => {
        setQuestions(res.data.results);
      }).catch((err) => {
        setError(true);
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (questions.length > 0 && index < questions.length) {
      const current = questions[index];
      const allOptions = [...current.incorrect_answers, current.correct_answer];
      setShuffledOptions(shuffleArray([...allOptions]));
    }
  }, [questions, index]);

  const nextQuestion = () => {
    const selectedOption = inputRefs.current.find(item => item && item.checked);

    if (!selectedOption) {
      alert("Please select an option!");
      return;
    }

    if (selectedOption.value === questions[index].correct_answer) {
      setMarks(prev => prev + 10);
    }

    if (index < questions.length - 1) {
      setIndex(prev => prev + 1);
      inputRefs.current.forEach(input => { if (input) input.checked = false; });
    } else {
      setResult(true);
    }
  }

  return (
    <div className="container">
      <div className="quiz-card">

        <div className="header">
          <h1>Quiz App</h1>
        </div>

        <div className="content">
          {loading && <h2 className="status-text">Loading Questions...</h2>}
          {error && <h2 className="status-text error">Error loading data.</h2>}

          {result ? (
            <div className="result-screen">
              <h2>Quiz Finished!</h2>
              <p className="final-score">Your total score is: <strong>{marks} / 100</strong></p>
              <button className="btn-primary" onClick={() => window.location.reload()}>Restart Quiz</button>
            </div>
          ) : (
            questions.length > 0 && (
              <div className="question-box">


                <h2
                  className="question-text"
                  dangerouslySetInnerHTML={{ __html: questions[index].question }}
                ></h2>

                <div className="options-list">
                  {shuffledOptions.map((item, i) => (
                    <div key={`${index}-${i}`} className="option-item">
                      <input
                        type="radio"
                        name="quiz-option"
                        value={item}
                        id={`option-${i}`}
                        ref={el => inputRefs.current[i] = el}
                      />
                      <label
                        htmlFor={`option-${i}`}
                        dangerouslySetInnerHTML={{ __html: item }}
                      ></label>
                    </div>
                  ))}
                </div>

                <div className="footer">
                  <button onClick={nextQuestion} className="btn-next">
                    {index === questions.length - 1 ? 'Finish' : 'Next Question'}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

    </div>
  )
}

export default App