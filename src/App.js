import { useState, useEffect } from 'react'
import { Divider, Icon } from 'semantic-ui-react'
import Cookie from 'js-cookie'
import Loader from 'react-loaders'

const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbz_lJ4-IMPjSB-y94Vw9bM93CQgvuZ0_Sl9077s2ew8BYwGMCOL8J_GF0P-WGSHzkxi/exec?action=load'

function App() {
  const [questions, setQuestions] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showingAnswer, setShowingAnswer] = useState(false)
  const [responses, setResponses] = useState([])
  const [animate, setAnimate] = useState(true)

  // manage responses in cookies
  
  const loadResponses = () => {
    const savedResponses = JSON.parse(Cookie.get('responses') || '[]')
    setResponses(savedResponses)
    console.log('here')
    setShowingAnswer(savedResponses[currentQuestion] !== undefined)
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
      const { questions, results } = await response.json()
      setQuestions(questions)
      setResults(results)
      loadResponses()
      setLoading(false)
    })()
  }, [])

  const goTo = (index) => {
    setAnimate(false)
    setCurrentQuestion(index)
    setShowingAnswer(responses[index] !== undefined)
    setTimeout(() => setAnimate(true), 500)
  }

  const restart = () => {
    setLoading(true)
    setCurrentQuestion(0)
    setShowingAnswer(false)
    setResponses([])
    saveResponses([])
    setLoading(false)
  }

  const toggleAnswer = () => {
    setAnimate(true)
    setShowingAnswer(!showingAnswer)
  }

  if (loading) {
    return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Loader type='ball-scale' active />
      </div>
      <div style={{ height: '0%', display: 'flex', justifyContent: 'center', background: 'rgb(204, 204, 204)' }}>
      </div>
    </div>
  }

  if (currentQuestion >= questions.length) {
    // show results
    const correct = responses.filter(response => response === true).length
    const incorrect = responses.filter(response => response === false).length
    const resultMessage = (results.find(result => result.score === correct) || results.find(result => result.score === 'default')).message

    return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
    <div style={{ height: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
          <h3 style={{ margin: 0 }}>צדקת ב</h3>
          <h1 style={{ color: 'rgb(71, 190, 199)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0  }}>{correct}/{correct + incorrect}</h1>
          <h3 style={{ margin: 0 }}>שאלות</h3>
        </div>
        <h2>{resultMessage}</h2>
      </div>
      <div style={{ height: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem', position: 'relative' }}>
        <button className='ui huge fluid button' style={{ height: '4rem', width: '100%', margin: 0 }} onClick={restart}>אתחל</button>
      </div>
    </div>
  }

  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
    <div style={{ height: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <h4 style={{ textAlign: 'center', color: 'rgb(71, 190, 199)', margin: 0 }}>{currentQuestion + 1}/{questions.length}</h4>
      <h2 style={{ textAlign: 'center' }}>{questions[currentQuestion].question}</h2>
    </div>
    <div style={{ height: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem', position: 'relative' }}>
      <button className='ui huge fluid button' style={{ height: '4rem', width: '100%', margin: 0 }} onClick={toggleAnswer}>הצג תשובה</button>
      <div style={{ height: showingAnswer ? '100%' : 0, color: '#061c30', background: (responses[currentQuestion] === undefined) ? '#cccccc' : ((responses[currentQuestion] === true) ? '#21ba45' : '#ca1010'), position: 'absolute', bottom: 0, left: 0, width: '100%', transition: (animate && showingAnswer) ? 'height ease-in-out 0.7s' : '', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
        <h3 style={{ textAlign: 'center', margin: '0 1rem' }}>{questions[currentQuestion].answer}</h3>
        <h4 style={{ textAlign: 'center', margin: 0 }}>צדקת?</h4>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <button className={`ui large circular icon${(responses[currentQuestion] === true) ? '' : ' basic'} green button`} style={(responses[currentQuestion] === true) ? { border: '1px solid white' } : {}} onClick={() => respond(currentQuestion, true)}><Icon name='check' /></button>
          <button className={`ui large circular icon${(responses[currentQuestion] === false) ? '' : ' basic'} red button`} style={(responses[currentQuestion] === false) ? { border: '1px solid white' } : {}} onClick={() => respond(currentQuestion, false)}><Icon name='close' /></button>
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', width: '100%', top: '50%', height: '3rem', padding: '0 1rem' }}>
      <button className='ui circular inverted icon button' style={{ aspectRatio: 1 }} onClick={() => goTo(currentQuestion - 1)} disabled={currentQuestion === 0}><Icon name='arrow right' /></button>
      <button className='ui circular inverted icon button' style={{ aspectRatio: 1 }} onClick={() => goTo(currentQuestion + 1)} disabled={responses[currentQuestion] === undefined}><Icon name='arrow left' /></button>
    </div>
  </div>
}

export default App;
