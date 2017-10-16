const express = require("express"),
    fs = require('fs'),
    path = require('path'),
    pg = require('pg'),
    bodyParser = require('body-parser'),
    key = "postgres://test00:0000@localhost:5432/hacaton-00",
    app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
    fs.createReadStream(path.resolve('public/index.html')).pipe(res);
});

app.post("/delmap/*", (req, res) => {
    const id = req.url.substring(8, req.url.length);

    const pool = pg.Pool({
        connectionString: key
    });

    pool.query("DELETE FROM maps WHERE id = $1", [id], (error, data) => {
        if (error) {
            res.status(200).jsonp({error});
        }
        res.status(200).jsonp({data});
        pool.end();
    });
});

app.post("/sendmap/*", (req, res) => {
    const name = req.url.substring(9, req.url.indexOf("/", 9)),
        map = req.url.substring(req.url.indexOf("/", 9) + 1, req.url.length);


    const pool = pg.Pool({
        connectionString: key
    });

    pool.query("INSERT INTO maps(name, map) VALUES($1, $2)", [name, map], (error, data) => {
        if (error) {
            res.status(200).jsonp({error});
        }
        res.status(200).jsonp({data});
        pool.end();
    });
});

app.post("/getlist/*", (req, res) => {
    const pool = pg.Pool({
        connectionString: key
    });

    pool.query("SELECT * FROM maps", (error, data) => {
        if (error) {
            res.status(200).jsonp({error});
        }
        res.status(200).jsonp({data: data.rows});
        pool.end();
    });
});

const DeleteSpace = (line) => {
    while (line.substring(line.length - 1, line.length) === ' ') {
        line = line.substring(0, line.length - 1);
    }
    return line;
};

app.get("/game", (req, res) => {
    const pool = pg.Pool({
        connectionString: key
    });


    pool.query("SELECT * FROM maps", (error, data) => {
        console.log("sss");

        if (error) {
            res.status(200).jsonp({error});
        }

        let line = "";

        for (let key in data.rows) {
            line = line + DeleteSpace(data.rows[key].name) + "~" + DeleteSpace(data.rows[key].map) + "~";
        }

        pool.end();
        res.end(line);
    });
});

app.use(express.static('public'));

app.listen(4000, () => console.log("Server is starting!"));




/*pool.query("UPDATE maps SET name=$1 WHERE map = $2", ["new-test-name", "new;test;map;"], (error, data) => {
        if (error) {
            console.log(error);
            res.send(error);
            throw error;
        }

        console.log(data);
        pool.end();
    });*/

/*pool.query("SELECT * FROM maps", (error, data) => {
    if (error) {
        console.log(error);
        res.send(error);
        throw error;
    }

    console.log(data.rows);
    pool.end();
});*/

/*pool.query("DELETE FROM maps WHERE id = $1", [1], (error, data) => {
    if (error) {
        console.log(error);
        res.send(error);
        throw error;
    }

    console.log(data.rows);
    pool.end();
});*/