const express = require('express');
// const Database = require("@replit/database")
const app = express();
var bodyParser = require('body-parser')
var fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var emoji = require('node-emoji');
const fs = require('fs');
const config = require('./config.json');

// repeatStr = (times, string) => { string.repeat(times) };

// const db = new Database()


// db.set("keys", []).then(() => { });

function repeatStr(str, num) {
  if (num < 1) {
    return "";
  } else {
    return str + repeatStr(str, num - 1);
  }
}

// db.set("keys", []).then(() => {});

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}

app.use(fileUpload({
  safeFileNames: true,
  preserveExtension: true
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send(config.welcome_message)
});

app.get('/favicon.ico', (req, res) => {
  res.status(404).send('Cannot GET /favicon.ico')
})

// function used_keys() {
//   db.get("keys").then(value => {
//     console.log(value);
//     return value;
//   });
// }

app.get('/:data', (req, res, next) => {
  let img = req.params.data;

  console.log(img);

  // let imgExists = fs.existsSync(`/home/runner/${process.env.REPL_SLUG}/file_uploads/${img}`);
  // if (!imgExists) return next() // Or in other words, return "Cannot GET /<path>"

  let pngExists = fs.existsSync(`/home/runner/${process.env.REPL_SLUG}/file_uploads/${img}.png`);

  let gifExists = fs.existsSync(`/home/runner/${process.env.REPL_SLUG}/file_uploads/${img}.gif`);

  console.log(pngExists, gifExists)

  if (pngExists) {
    res.sendFile(`${__dirname}/file_uploads/${img}.png`);
  } else if (gifExists) {
    res.sendFile(`${__dirname}/file_uploads/${img}.gif`);
  } else {
    return next();
  }
})

app.post('/upload', async (req, res) => {
  console.log('getting upload')
  if (!req.get('Authorization')) {
    return res.status(401).send(`You didn't specify an Authorization header in your request. Please specify it.`)
  }

  if (req.get('Authorization') != process.env.API_KEY) {
    return res.status(403).send(`Your upload key is invalid.`)
  }
  let file = req.files.image;
  let fileName = req.files.image.name.split('.')
  fileName = fileName[fileName.length - 1]
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log('repeating string')
  try {
    // let length = 6;
    // let name = '';
    // for (i=0;i>length;i++) {
    // let times = Math.floor(Math.random() * 1000);
    // for (i=0;i>times;i++) {
    // name += '​'
    // }
    // }
    // let letters = 'ⓐ,ⓑ,ⓒ,ⓓ,ⓔ,ⓕ,ⓖ,ⓗ,ⓘ,ⓙ,ⓚ,ⓛ,ⓜ,ⓝ,ⓞ,ⓟ,ⓠ,ⓡ,ⓢ,ⓣ,ⓤ,ⓥ,ⓦ,ⓧ,ⓨ,ⓩ'.replace(' ', null).split(',');
    let letters = ['​', '​​', '​​​', '​​​​', '​​​​​',
      '​​​​​​', '​​​​​​​', '​​​​​​​​', '​​​​​​​​​​', '​​​​​​​​​​', '​​​​​​​​​​​', '​​​​​​​​​​​​', '​​​​​​​​​​​​', '​​​​​​​​​​​​​', '​​​​​​​​​​​​​', '​​​​​​​​​​​​​' + '​​​​​​​​​​​​​', '​​​​​​​​​​​​​' + '​​​​​​​​​​​​​' + '​​​​​​​​​​​​​' + '​​​​​​​​​​​​​', '​​​​​​​​​​​​​' + '​​​​​​​​​​​​​' + '​​​​​​​​​​​​​']
    // // let letters = ['𝐚', '𝐛', '𝐜']
    var letter1 = letters[Math.floor(Math.random() * letters.length)]
    var letter2 = letters[Math.floor(Math.random() * letters.length)]
    var letter3 = letters[Math.floor(Math.random() * letters.length)]
    var letter4 = letters[Math.floor(Math.random() * letters.length)]
    var letter5 = letters[Math.floor(Math.random() * letters.length)]
    var letter6 = letters[Math.floor(Math.random() * letters.length)]
    // let name = letter1 +   letter2 + letter3 + letter4 +  letter5 +  letter6
    let name = '' + letter1 + letter2 + letter3 + letter4 + letter5 + letter6
    console.log(letter1, letter2, letter3, letter4, letter5, letter6)
    file.mv(require('path').join(__dirname, `file_uploads/${name}.${fileName}`), async function(err) {
      if (err) return res.status(500).send(err);
      res.send(`${config.domain || `https://${process.env.REPL_SLUG.toLowerCase()}.${process.env.REPL_OWNER.toLowerCase()}.repl.co/`}${name}`);
      // res.send(`${config.domain || `https://${process.env.REPL_SLUG.toLowerCase()}.${process.env.REPL_OWNER.toLowerCase()}.repl.co/`}${name}`)
    })
  } catch (error) {
    console.log(error);
  }
})

// Do checks before making sure to turn on server:
if (!process.env.API_KEY) {
  console.error("Please make sure to specify an API key to verify it's you.")
  console.error("An easy way to do this is to generate a UUID, and then set the value to the API_KEY secret.")
  process.exit(1)
}

app.listen(3000, () => {
  console.log('ShareX uploader online!');
});
