const express = require('express')
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json())

const users = []

app.listen(5000)
app.get('/users',(req, res)=>{
    res.json(users)
})

app.post('/users', validateDuplicate, async (req,res)=>{
    try{
        const hashPwd = await bcrypt.hash(req.body.pwd, 10)
        const user = {username: req.body.username, pwd: hashPwd }
        users.push(user)
        res.send('Saved successfully')
    }catch {
        res.status(500)
    }
})

app.post('/users/login', async (req,res)=>{
    try{
        const user = await users.find(e=>e.username === req.body.username)
        if(user == null) res.status(400).send('Invalid username or password')
        if(await bcrypt.compare(req.body.pwd, user.pwd)){
            res.send('success')
        }else{
            res.status(400).send('Invalid username or password')
        }
    }catch {
        res.status(500)
    }
})

function validateDuplicate(req, res, next){
    const user = users.find(e=>e.username === req.body.username)
    if(user == null){
        next()
    }else{
        res.status(400).send('Username alreadty exist')
    }
}