require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

//Middlewares

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))


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

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  Person
    .find({ name: body.name })
    .then(() => {
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
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'id format cannot be read by mongo identifier' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path: ', request.path)
//   console.log('Body: ', request.body)
//   console.log('---')
//   next()
// }

//app.use(requestLogger)