const express = require('express');
const User = require('../models/user');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/users/login', async(request, response) => {
    try{
        const user = await User.findOneByCredentials(request.body.email, request.body.password);
        const token = await user.generateAuthToken();
        response.send({user, token});
    }catch(err){
        response.status(400).send(err.message);
    }
})

router.post('/users/register', async (request, response) => {
    try{
        let user = new User({
            email: request.body.email,
            password: request.body.password,
            age: request.body.age,
            name: request.body.name
        })
        const token = await user.generateAuthToken();
        await user.save();
        response.status(200).send({user, token});
        console.log(user);
    }catch (err){
        response.status(500).send(err.message);
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send('User logout');
    }catch(err){
        res.status(500).send(err.message);
    }
})

router.get('/users/me', auth, async(req, res) => {
    const user = await User.findOne({_id: req.user.id});
    const tasks = await user.populate('tasks');
    console.log(tasks);
    res.send(tasks);
})

router.put('/users/update', auth, async(req, res) => {
    try{
        let user = req.user;
        user.email = req.body.email,
            user.age = req.body.age,
            user.name = req.body.name,
            user.password = req.body.password
        await user.generateAuthToken();
        await user.save();
        res.status(200).send('User update');
    }catch (err){
        res.status(500).send(err.message);
    }
})

router.delete('/users/delete', auth, async(req, res) => {
    try{
        await User.findByIdAndDelete(req.user.id);
        res.status(200).send('Delete success');
    }catch (error){
        res.status(500).send(error.message);
    }
})

router.get('/users', async (request, response) => {
   await User.find({}).then((users) => {
        response.status(200).send(users);
   }).catch((error) => {
       response.status(404).send(error.message);
   })
})

router.get('/users/:id', async (request, response) => {
    await User.findById(request.params.id).then((users) => {
        if(users == null){
            return response.status(404).send('User does not exist');
        }
        response.status(200).send(users);
    }).catch((error) => {
        response.status(500).send(error.message);
    })
})

router.post('/users', async (request, response) => {
    try{
        let user = new User(request.body);
        await user.save();
        response.status(200).send('User added');
        console.log(user);
    }catch (error){
        response.status(500).send(error.message);
    }
})

router.delete('/users/:id', async (request, response) => {
    let user;
    try{
        user = await User.findByIdAndDelete(request.params.id);
        if(user == null) {
            return response.status(404).send('User does not exist');
        }
        response.status(200).send('Delete success');
    }catch (error){
        response.status(500).send(error.message);
    }
})

router.put('/users/:id', async(request, response) => {
    await User.findById(request.params.id).then((user) => {
        if(user == null){
            return response.status(404).send('User does not exist');
        }
        const updates = ['name', 'email', 'password', 'age'];
        updates.forEach((update) => user[update] = request.body[update]);
        user.save();
        console.log(request.body);
        response.status(200).send('User update');
    }).catch((error) => {
        response.status(500).send(error.message);
    })
})

module.exports = router;
