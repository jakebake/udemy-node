const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; //run with heroku or if no port is configured set port 30000

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//set static pages
app.use(express.static(__dirname + '/public')); //könnte jetzt z.B. die help.html in public über den browser aufrufen

// Console Log method and requested URL
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('## Unable to write server.log.');
        }
    });
    next();
});

// User for maintenance mode
// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         pageTitle: 'Site under maintenance',
//         author: 'Jakob Smuschel'
//     });
// });

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// Create Menu
hbs.registerHelper('getRoutes', () => {
    let routes = {
        'Home': '/',
        'About': '/about',
        'Jakob': '/jakob',
        'Bad': '/bad'
    };
    let menu = "";

    for (let key in routes) {
        menu += `<li><a href="${routes[key]}">${key}</a></li>`;
    }
    return menu;
});

app.get('/', (req,res) => {
    res.render('home.hbs', {
        pageTitle: 'Smuschels neues Nodeprojekt',
        welcomeMessage: 'Hallo Besucher<br>Das ist der neueste Scheiss aus dem Hause Jakob Smuschel!!',
        author: 'Jakob Smuschel'
    });
});

app.get('/about', (req,res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        author: 'Smuschel'
    });
});

app.get('/jakob', (req, res) => {
    res.send('<h1>Hallo Jakob</h1><p>Du bist einfach der Beste! <br> Einfach toll wie du das alles kannst und so...<br><br>Dein Express</p>');
});

app.get('/bad', (req,res) => {
    res.send({
        errorMessasge: 'Ooooops, something went incredibly wrong. Ruuuuuuunnnn!!!!!'
    });
});

app.listen(port, () => {
    console.log(`server.js ### Server is up on port ${port}`);
});
