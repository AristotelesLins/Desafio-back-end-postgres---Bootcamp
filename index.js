/*
const express = require('express')
const app = express()

app.use(express.json())

const tasks = [
    {
        id: 1,
        title: "Estudar Node.js",
        status: "Em andamento",
        priority: 1,
        description: "Estudar Node.js ainda hoje"
    }
]

app.get('/tasks', function (req, res) {
  res.send(tasks)
})

app.post('/tasks', function (req, res){
    console.log(req.body)
    tasks.push(req.body)
})

app.listen(3000)
*/