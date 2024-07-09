const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const fileUpload = require("express-fileupload");

const pkg = require('./package.json');

require('dotenv').config();

const app = express();

const { defines } = require('./src/defines');

const { api } = require('./controllers/api');

app.set('view engine', 'ejs');

app.use(expressLayouts);

app.use(express.static(path.join(__dirname, "static")));

app.set("layout", "layouts/main");

const setLevel = (level = 0) => {
    return "../".repeat(level);
}

const dateToString = (date) => {
    let y = date.getFullYear(), m = date.getMonth()+1, d = date.getDate();
    if(m < 10) m = `0${m}`;
    if(d < 10) m = `0${d}`;
    return `${d}.${m}.${y}`;
}

const dateToStringFull = (date) => {
    let y = date.getFullYear(), m = date.getMonth()+1, d = date.getDate();
    let min = date.getMinutes(), h = date.getHours(); 

    if(m < 10) m = `0${m}`;
    if(d < 10) m = `0${d}`;
    return `${d}.${m}.${y} ${h}:${min}`;
}

let data = {
    title: defines.errors.title,
    subtitle: defines.errors.title,
    change: false,
    static : ""
}

app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))

app.use(async (req, res, next) => {
    const props = await api.getProperties();
    data.title = props[0].title;
    data.subtitle = props[0].subtitle;
    data.logo = props[0].logo;
    data.change = false;
    data.threadsByDate = await api.getThreadsByDate();
    data.dateToString = dateToString;
    data.dateToStringFull = dateToStringFull;
    data.threadsCount = await api.threadsCount();
    data.version = pkg.version;
    data.nodejs = process.version;

    next(); 
});

app.get('/', async (req, res) => {
  data.page = "Главная";

  data.threads = await api.getThreads();
  data.categories = await api.getCategories();

  data.hasFavorites = false;

  data.threads.forEach(el => {
    if(el.favorite) data.hasFavorites = true;
  });

  res.render('main/index', {data: data});
});

app.get('/properties/edit', async (req, res) => {
  data.page = "Редактирование свойств";
//   data.change = true;

  data.static = setLevel(1);

  res.render('main/props', {data: data});
});

app.get('/thread/add', async (req, res) => {
    data.page = "Редактор новой статьи";

    data.static = setLevel(1);

    data.change = true;

    data.categories = await api.getCategories();

    res.render('main/add', {data: data});
});

app.get('/thread/:id', async (req, res) => {
  data.static = setLevel(1);
  data.page = `Статья #${req.params.id}`;

  data.thread = (await api.getThreadById(req.params.id))[0];

  if(!data.thread) {
    res.redirect("/");
    return;
  }

  if(data.thread.date) data.thread.date = dateToStringFull(data.thread.date);

  data.imageDefault = data.static + "media/ccloud/no-image.png";

  res.render('main/thread', {data: data});
});

app.get('/thread/edit/:id', async (req, res) => {
  
  data.static = setLevel(2);

  data.change = true;

  data.categories = await api.getCategories();

  const buffer = await api.getThreadById(req.params.id);

  data.thread = buffer[0];

  data.page = `Редактирование статьи: ${data.thread.title}`;

  if(!data.thread) {
    res.redirect("/");
    return;
  }

  res.render('main/edit', {data: data});
});

app.get('/category', async (req, res) => {

  if(!req.query.s) {
    res.redirect("/");
    return;
  }

  data.query = req.query.s;
  
  data.static = setLevel(1);

  data.change = false;

  data.categories = await api.getCategories();
  data.search = await api.getThreadsByCategory(data.query);

  

  data.page = `Поиск по категории "${req.query.s}"`;

  res.render('main/category', {data: data});
});

app.get('/search', async (req, res) => {

  if(!req.query.s) {
    res.redirect("/");
    return;
  }

  data.query = req.query.s;
  
  data.static = setLevel(1);

  data.change = false;

  data.categories = await api.getCategories();
  data.search = await api.getThreadsSearch(data.query);

  data.page = `Поиск "${req.query.s}"`;

  res.render('main/search', {data: data});
});

app.use(fileUpload());

app.get('/api/properties/set', api.setProperties);
app.post('/api/properties/set/logo', api.setLogo);
app.get('/api/properties/set/logo/default', api.setLogoDefault);
app.post('/api/thread/add', api.storeThread);
app.post('/api/thread/edit/:id', api.updateThread);
app.get('/api/thread/delete/:id', api.deleteThread);
app.get('/api/thread/favorite', api.setFavoriteThread);
app.get('/api/db/drop', api.dropDB);

app.listen(process.env.port, process.env.ip, () => {
  console.log(`http://${process.env.ip}:${process.env.port}`);
});