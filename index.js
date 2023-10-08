require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

//Middlewares
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path: ', request.path)
//   console.log('Body: ', request.body)
//   console.log('---')
//   next()
// }
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('dist'))


app.get('/', (request, response) => {
    response.send('<h1>This is the backend!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person
      .find({})
      .then(persons => {
        console.log(persons)
        response.json(persons)
      })
})

app.get('/info', (request, response) => {
    response.send(
      `<p>Phonebook has info for ${persons.length}<p>
      <p>${new Date().toString()}<p>`)
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  Person
  .find({ name: body.name })
  .then(name => {
    return response.status(400).json({
      error: 'name already exists in local storage'
    })
  })

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  console.log(`POST: ${request.body}`)
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(unknownEndpoint)
