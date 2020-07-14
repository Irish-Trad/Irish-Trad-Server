const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('./controllers'))

app.listen(port, () => console.log(`Listening on port ${port}`))
