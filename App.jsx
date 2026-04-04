// import React, { useState, useEffect } from 'react';
// import Card from './component/Card';

// function App() {
//   const [users, setUsers] = useState([]); // State ko 'users' (plural) rakha hai taake samajh aaye ye list hai

//   useEffect(() => {
//     fetch('https://jsonplaceholder.typicode.com/users')
//       .then((res) => res.json())
//       .then((data) => {
//         setUsers(data);
//       })
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

//   return (
//     <>
//       <h1>User List</h1>

//       <section id='section'>

//       {users.map((item) => (
//         <Card 
//           key={item.id}     
//           name={item.name} 
//           username={item.username} 
//           email={item.email} 

//         />
//       ))}
//       </section>
//     </>
//   );
// }

// export default App;



import React, { useEffect, useState } from 'react'

function App() {
  const [louding, setLouding] = useState(true)
  const [error, setError] = useState(null)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setQuestions(data.results)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLouding(false)
      })
  }, []);
  function next() {
    if (index < questions.length - 1) {
      setIndex(index + 1)
    }
  }
  return (
    <>
      <h1>Quiz App</h1>
      {louding && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}
      {!louding && !error && questions.length > 0 && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px' }}>
          <h2>Question {index + 1}:</h2>
          {/* dangerouslySetInnerHTML use karein taake symbols (&quot;) sahi dikhein */}
          <p dangerouslySetInnerHTML={{ __html: questions[index].question }} />
          
          <button onClick={next} disabled={index === questions.length - 1}>
            Next Question
          </button>
        </div>
      )}

    </>
  )
}

export default App