
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const db = require('./models');

const { success } = require('./helper');

const app = express();
const port = 3000;

app.use(bodyParser.json());
//oder kann man cors installieren und einfach app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/pokemons', (req, res) => {
    if(req.query.name) {
        const name = req.query.name;
        let msg = 'by getting the Pokemon with name=' + name;
        try {
            db.Pokemon.findAll().then(all => {
                const data = []
                all.forEach(p => {
                    if(p.name.toLowerCase().includes(name.toLowerCase())) {
                        data.push(p);
                    }
                })
                if(data.length === 0) {
                    msg = 'The desired Pokemon with name=' + name + ' doesn\'t exist';
                }
                res.json(success('Success ' + msg, data))
            })
        } catch (error) {
            console.log()
            res.json(success('Error ' + msg, []))
        }

        
                
    }
    else{
        const msg = 'by getting all Pokemons';
        try {
            db.Pokemon.findAll().then(all => res.json(success('Success ' + msg, all)))
        } catch (error) {
            console.log()
            res.json(success('Error ' + msg, []))
        }
    }
});
app.post('/pokemons', (req, res) => {
    const pokemon = req.body
    try {
        db.Pokemon.create(pokemon).then(p => {
            res.json(success('success by creating ' + p.name, [p]))
        })
    } catch (error) {
        console.log("update/create error")
        res.json('err Post', [])
    }
});

app.get('/pokemons/:id', (req, res) => {
    const id = req.params.id
    const msg = "Pokemon with id=" + id
    try {
        db.Pokemon.findByPk(id).then(p => {
            if(p === null){
                res.status(404).json(success(msg + ' doesn\'t exist, Please try another number', []))
            }
            res.json(success('success, you recieve ' + msg, [p]))
        })
    } catch (error) {
        console.log("Error by getting " + msg)
        res.status(500).json(success('can\'t get ' + id + ', Please try leater', []))
    }
});
app.put('/pokemons/:id', (req, res) => {
    const id = req.params.id
    const msg = "by updating pokemon with id=" + id
    try {
        db.Pokemon.update(req.body, {
            where: {id: id}
        }).then(() => {
            db.Pokemon.findByPk(id).then(p => {
                res.json(success('Success ', [p]))
            })
        })
    } catch (error) {
        console.log('Error ' + msg)
        res.json(success('Error ' + msg, []))
    }
});
app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const msg = "by deleting the pokemon with id=" + id
    try {
        db.Pokemon.findByPk(id).then((p) => {
            const pok = p
            db.Pokemon.destroy({
                where: {id: id}
            }).then(() => {
                res.json(success('Success ' + msg, [pok]))
            })
        })
    } catch (error) {
        console.log('Error ' + msg)
        res.json(success('Error ' + msg, []))
    }
});

app.listen(port);