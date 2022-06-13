const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

// Отримання всіх завдань з БД
router.get('/tasks', auth, async (req, res) => {
   // await Task.find({}).then((tasks) => {
   //      res.status(200).send(tasks)
   // }).catch((error) => {
   //     res.status(404).send(error.message)
   // })
    try{
        const user = req.user
        await user.populate('tasks')
        const tasks = user.tasks
        // if(tasks.length === 0){
        //     res.status(404).send('This user has not tasks')
        // }
        await Task.find({})
        res.status(200).send(tasks)
    }catch (error){
        res.status(500).send(error.message)
    }
})

//Отримання даного завдання з БД по id
router.get('/tasks/:id', auth, async (request, response) => {
    await Task.findById(request.params.id).then((tasks) => {
        if(tasks == null){
            return response.status(404).send('Task does not exist')
        }
        response.status(200).send(tasks)
    }).catch((error) => {
        response.status(500).send(error.message)
    })
})

//Додавання завдання в БД
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user.id
    })
    try{
        await task.save()
        res.status(201).send(task)
        console.log(task)
    }catch (error){
        res.status(500).send(error.message)
    }
})

//Видалення завдання по id
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        let user_id = req.user.id
        let task = await Task.findById(req.params.id)
        await task.populate('owner')
        if(task.owner.id === user_id){
            task.remove()
            res.status(200).send('Task deleted')
        }
        else{
            res.status(404).send("You cannot delete a task because it does not belong to you")
        }
    }catch (error){
        res.status(400).send(error.message)
    }
})

//Редагування завдання
router.put('/tasks/:id', auth, async (req, res) => {
    try{
        let task = await Task.findById(req.params.id)
        await task.populate('owner')
        if(task.owner.id === req.user.id){
            task.description = req.body.description
            task.completed = req.body.completed
            await task.save()
            res.status(200).send(task)
        }
        else{
            res.status(404).send("You cannot update a task because it does not belong to you")
        }
    }catch (error){
        res.status(400).send(error.message)
    }
})

module.exports = router