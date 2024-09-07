import { useState, useEffect } from 'react'
import { Icon, Divider, Segment } from 'semantic-ui-react'
import './App.css';

const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbzUFzcKow2b8fOPKboaRQe4dVO5vxAlsrIV1COhGP1ooLVTjJVMPUnKAErMqEMjK_8E/exec?action=load'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showingAnswer, setShowingAnswer] = useState(false)

  useEffect(() => {
    (async () => {
      const response = await fetch(BACKEND_URL)
      const { questions } = await response.json()
      console.log(questions, questions[0])
      setQuestions(questions)
      setLoading(false)
    })()
  }, [])

  const goTo = (index) => {
    setCurrentQuestion(index)
  }

  const toggleAnswer = () => setShowingAnswer(!showingAnswer)

  if (loading) {
    return <div className='center aligned' style={{ backgroundColor: '#AAAAAA', height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem' }}>
      <div className='ui active dimmer'>
        <div className='ui text loader'>Loading</div>
      </div>
    </div>
  }

  return <div className='center aligned' style={{ backgroundColor: '#AAAAAA', height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem' }}>
    <h1 style={{ textAlign: 'center', margin: 0 }}>Grandma's Questions</h1>
    <Segment raised>
      <h3 style={{ textAlign: 'center' }}>{questions[currentQuestion].question}</h3>
      <Divider />
      {showingAnswer && <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h4>{questions[currentQuestion].answer}</h4>
      </div>}
    </Segment>
    <div style={{ flexGrow: 1 }} ></div>
    {/* bottom drawer */}
    <Segment raised style={{ margin: '-1rem', borderRadius: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 1rem 0' }}>
        <button className='ui huge primary circular fluid button' onClick={toggleAnswer}>See Answer</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className='ui basic black icon button' onClick={() => goTo(currentQuestion - 1)} disabled={currentQuestion === 0}><Icon name='arrow left' />Previous</button>
        <button className='ui basic black icon button' onClick={() => goTo(currentQuestion + 1)} disabled={currentQuestion === questions.length - 1}><Icon name='arrow right' />Next</button>
      </div>
    </Segment>
  </div>
}

export default App;
