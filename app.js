const express = require('express')
const json = require('jsonfile')

const app = express();

const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({urlencoded:false}));

let usersRead;
let usersWrite;

usersWrite = usersRead;
app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static('./stylesheet'))


// let currentTime = new Date

json.readFile('./user.json').then((data) => {
    usersRead = (data);
})

// const time = `${currentTime.getMonth() + 1}/${currentTime.getDate()}/${currentTime.getFullYear()}`;


app.get('/', (req, res) => {
    console.log("I'VE BEEN REDIRECTED");
    res.render('index', {
        yourMom: "This is from backend!",
        partial: "haha",
    })
})

app.get('/users/:userName', (req, res) => {
    let usersID;
    let usersName;
    let usersEmail;
    let usersAge;
    for (let x = 0; x < usersRead.length; x++) {
        if (req.params.userName == usersRead[x].userName) {
            usersID = usersRead[x].UID
            usersName = usersRead[x].Name
            usersEmail = usersRead[x].Email
            usersAge = usersRead[x].Age
        }
    }

    res.render('users', {
        userYouClickedOn: req.params.userName,
        Name: usersName,
        Email: usersEmail,
        Age: usersAge,
        ID: usersID
    })
})

app.get('/users/:userName/edit', (req, res) => {
    let usersUserName;
    let usersName;
    let usersEmail;
    let usersAge;
    for (let x = 0; x < usersRead.length; x++) {
        if (req.params.userName == usersRead[x].userName) {
            usersUserName = usersRead[x].userName
            usersName = usersRead[x].Name
            usersEmail = usersRead[x].Email
            usersAge = usersRead[x].Age
        }
    }

    res.render('edit', {
        userName: usersUserName,
        Name: usersName,
        Email: usersEmail,
        Age: usersAge
    })
})

app.post('/users/:userName/edited', (req, res) => {
    usersWrite = usersRead;
    for (let x = 0; x < usersRead.length; x++) {
        if (req.params.userName === usersRead[x].userName) {
            usersWrite[x].userName = req.body.editUserName;
            usersWrite[x].Name = req.body.editName;
            usersWrite[x].Email = req.body.editEmail;
            usersWrite[x].Age = req.body.editAge;
        }
    }
    json.writeFileSync('./user.json', usersWrite)

    res.redirect('/users')
})

app.get('/users/:userName/delete', (req, res) => {
    let new_list = [];
    for (let x = 0; x < usersRead.length; x++) {
        if (req.params.userName === usersRead[x].userName) {
            console.log(usersRead[x])
        }
        else {
            new_list.push(usersRead[x])
        }
    }
    usersWrite = new_list

    json.writeFileSync('./user.json', usersWrite)

    res.redirect('/users')
})

app.get('/users', (req, res) => {
    res.render('table', {
        usersRead
    })
})

app.post('/new-user', (req, res) => {
    res.redirect('/')
    usersWrite = usersRead;
    let tomp = {
        userName: req.body.username,
        Name: req.body.name,
        Email: req.body.email,
        Age: req.body.age,
        UID: uuidv4()

    }
    usersWrite.push(tomp)
    
    json.writeFileSync('./user.json', usersWrite)
})

app.listen(8080, () => {
    console.log(`listening on 8080`)
})