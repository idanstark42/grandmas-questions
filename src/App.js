import { useState, useEffect } from 'react'
import { Icon, Divider, Segment, Progress } from 'semantic-ui-react'
import Cookie from 'js-cookie'
import './App.css';

const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbzUFzcKow2b8fOPKboaRQe4dVO5vxAlsrIV1COhGP1ooLVTjJVMPUnKAErMqEMjK_8E/exec?action=load'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showingAnswer, setShowingAnswer] = useState(false)
  const [responses, setResponses] = useState([])

  // manage responses in cookies
  
  const loadResponses = () => {
    const savedResponses = JSON.parse(Cookie.get('responses') || '[]')
    setResponses(savedResponses)
  }

  const saveResponses = (newResponses) => {
    Cookie.set('responses', JSON.stringify(newResponses || responses))
  }

  const respond = (index, correct) => {
    const newResponses = [...responses]
    newResponses[index] = correct
    setResponses(newResponses)
    saveResponses(newResponses)
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(BACKEND_URL)
      const { questions } = await response.json()
      setQuestions(questions)
      loadResponses()
      setLoading(false)
    })()
  }, [])

  const goTo = (index) => {
    setCurrentQuestion(index)
    setShowingAnswer(false)
  }

  const restart = () => {
    setLoading(true)
    setCurrentQuestion(0)
    setShowingAnswer(false)
    setResponses([])
    saveResponses([])
    setLoading(false)
  }

  const toggleAnswer = () => setShowingAnswer(!showingAnswer)

  if (loading) {
    return <div className='center aligned' style={{ backgroundColor: '#AAAAAA', height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem' }}>
      <div className='ui active dimmer'>
        <div className='ui text loader'>Loading</div>
      </div>
    </div>
  }

  if (currentQuestion >= questions.length) {
    // show results
    const correct = responses.filter(response => response === true).length
    const incorrect = responses.filter(response => response === false).length

    return <div className='center aligned' style={{ backgroundColor: '#AAAAAA', height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem' }}>
      <h1 style={{ textAlign: 'center' }}>Results</h1>
      <Segment raised style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>You got</h3>
          <h1 style={{ backgroundColor: '#2185d0', color: 'white', padding: '1rem', borderRadius: '50%', aspectRatio: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0  }}>{correct}/{correct + incorrect}</h1>
          <h3>questions correct</h3>
        </div>
      </Segment>
      <Segment raised style={{ margin: '-1rem', borderRadius: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 1rem 0' }}>
          <button className='ui huge primary circular fluid button' onClick={() => restart()}>Restart</button>
        </div>
      </Segment>
    </div>
  }

  return <div className='center aligned' style={{ backgroundColor: '#AAAAAA', height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem' }}>
    <h1 style={{ textAlign: 'center', margin: 0 }}>Grandma's Questions</h1>
    <Segment raised>
      <h3 style={{ textAlign: 'center' }}>{questions[currentQuestion].question}</h3>
      <Divider />
      {(showingAnswer || responses[currentQuestion] !== undefined) ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h4>{questions[currentQuestion].answer}</h4>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
          <button className='ui green icon button' onClick={() => respond(currentQuestion, true)} disabled={responses[currentQuestion] !== undefined}><Icon name='check' />Correct</button>
          <button className='ui red icon button' onClick={() => respond(currentQuestion, false)} disabled={responses[currentQuestion] !== undefined}><Icon name='close' />Incorrect</button>
        </div>
      </div> : ''}
    </Segment>
    <div style={{ flexGrow: 1 }} ></div>
    <Segment raised style={{ margin: '-1rem', borderRadius: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 1rem 0' }}>
        <button className='ui huge primary circular fluid button' onClick={toggleAnswer} disabled={responses[currentQuestion] !== undefined}>{showingAnswer ? 'Hide' : 'Show'} Answer</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className='ui basic black icon button' onClick={() => goTo(currentQuestion - 1)} disabled={currentQuestion === 0}><Icon name='arrow left' />Previous</button>
        <div>{responses.filter(response => response).length}/{questions.length}</div>
        <button className='ui basic black icon button' onClick={() => goTo(currentQuestion + 1)} disabled={responses[currentQuestion] === undefined}><Icon name='arrow right' />Next</button>
      </div>
      <Progress size='tiny' color='blue' percent={100 * responses.filter(response => response !== undefined).length / questions.length} style={{ margin: '1rem 0 0 0' }}/>
    </Segment>
  </div>
}

export default App;
