const mysql = require('mysql2');
const util = require('util');
const path = require('path');

require('dotenv').config();

const { defines } = require('../src/defines');

const db = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});

const query = util.promisify(db.query).bind(db);

const valid = (...args) => {
    let validate = true;
    args.forEach(arg => {
       if(!arg)  validate = false;
    });

    return validate;
}

const getProperties = async () => {
    const res = await query('SELECT * FROM properties');
    return res;
}

const setProperties = async (req, res) => {
    if(valid(req.query.title, req.query.subtitle)) {
        await query(`UPDATE properties SET title="${req.query.title}", subtitle="${req.query.subtitle}" WHERE id=1`);
        res.redirect("/");
        return;
    }
    res.redirect("/");
}

const getThreads = async () => {
    const res = await query(`SELECT * FROM threads ORDER BY title ASC`);
    return res;
}

const getThreadsByCategory = async (s) => {
    const res = await query(`SELECT * FROM threads WHERE category='${s}' ORDER BY title ASC`);
    return res;
}

const getThreadsSearch = async (s) => {
    const res = await query(`SELECT * FROM threads WHERE title LIKE '%${s}%' OR text LIKE '%${s}%' OR category LIKE '%${s}%' ORDER BY title ASC`);
    return res;
}

const getThreadsByDate = async () => {
    const res = await query(`SELECT * FROM threads ORDER BY date DESC LIMIT 10`);
    return res;
}

const getThreadById = async (id) => {
    try {
        const res = await query(`SELECT * FROM threads WHERE id=${id}`);
        return res;
    }
    catch {
        return false;
    }
}

const getCategories = async () => {
    const res = await query(`SELECT category FROM threads GROUP BY category`);

    return Object.keys(res).map(key => res[key].category);
}

const storeThread = async (req, res) => {

    if(valid(req.body.title, req.body.category)) {
        await query(`INSERT INTO threads (title, text, category, image) VALUES ('${req.body.title}', '${req.body.text}', '${req.body.category}', '${req.body.image || ""}')`);
        res.redirect("/");
        return;
    }
    res.redirect("/");

    
}

const oldUpdateThread = async (req, res) => {
    if(valid(req.query.title, req.query.category, req.query.text)) {
        await query(`UPDATE threads SET (title="${req.query.title}", text="${req.query.text}", category="${req.query.category}")`);
        res.redirect("/");
        return;
    }
    res.redirect("/");
}

const setFavoriteThread = async (req, res) => {
    try {
        if(valid(req.query.value, req.query.id)) {
            await query(`UPDATE threads SET favorite=${req.query.value} WHERE id=${req.query.id}`);
            res.send("true");
            return;
        }
        res.send("false");
        return;
    }
    catch {
        res.send("false");
    }
    
}

const deleteThread = async (req, res) => {

    await query(`DELETE FROM threads WHERE id=${req.params.id}`);
    res.redirect("/");
}

const updateThread = async (req, res) => {
    if(valid(req.body.title, req.body.category, req.body.text)) {

        const result = await query(`UPDATE threads SET title='${req.body.title}', text='${req.body.text}', category='${req.body.category}', date=NOW(), image='${req.body.image || ""}' WHERE id=${req.params.id}`);
        
        res.redirect("/");
        return;
    }
    res.redirect("/");
}

const dropDB = async (req, res) => {
    await query('DELETE FROM threads');
    await query('ALTER TABLE threads AUTO_INCREMENT = 1');
    res.redirect("/");
}

const threadsCount = async () => {
    const res = await query('SELECT count(*) as count FROM `threads`');

    return res[0].count;
}

const setLogo = async (req, res) => {
    if(!req.files) {
        res.redirect("/properties/edit");
        return;
    }

    const file = req.files.file;

    let dir = __dirname.split("\\");

    dir.pop();
    
    dir = dir.join("\\");

    const fileName = `${Date.now()}_${file.name}`;
    const savePath = path.join(dir, "static", "media", "ccloud", "custom", fileName);

    file.mv(savePath, async (err) => {
        if(err) return res.redirect("/properties/edit");

        await query(`UPDATE properties SET logo='media/ccloud/custom/${fileName}'`)
        return res.redirect("/properties/edit");
    });

}

const setLogoDefault = async (req, res) => {
    await query(`UPDATE properties SET logo='media/ccloud/512.png'`);
    return res.redirect("/properties/edit");
}

module.exports.api = {
    getProperties: getProperties,
    setProperties: setProperties,
    getThreads: getThreads,
    getThreadById: getThreadById,
    getCategories: getCategories,
    storeThread: storeThread,
    setFavoriteThread: setFavoriteThread,
    getThreadsByDate: getThreadsByDate,
    deleteThread: deleteThread,
    updateThread: updateThread,
    dropDB: dropDB,
    threadsCount: threadsCount,
    setLogo: setLogo,
    setLogoDefault: setLogoDefault,
    getThreadsByCategory: getThreadsByCategory,
    getThreadsSearch: getThreadsSearch
}