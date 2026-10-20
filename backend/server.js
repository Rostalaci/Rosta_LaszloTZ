
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT =3000

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'konyvtar_db',
    
    
});

db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Adatbázis csatlakoztatva!');
});

app.get('/api/konyvek', (req, res) => {
    db.query(`SELECT konyvek.id, konyvek.mufaj_id, konyvek.cim,
    konyvek.kiadasi_ev, konyvek.oldalszam, konyvek.kolcsonozheto,
    mufajok.nev AS mufaj_nev
    FROM konyvek
    JOIN mufajok ON konyvek.mufaj_id = mufajok.id
    ORDER BY konyvek.kiadasi_ev ASC`, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.get('/api/regi-konyvek', (req, res) => {
    db.query('SELECT * FROM konyvek WHERE kolcsonozheto = 1 AND kiadasi_ev < 2000', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.get('/api/roma', (req, res) => {
    db.query("SELECT * FROM konyvek WHERE cim LIKE '%Roma%'", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.get('/api/statisztika', (req, res) => {
    db.query(`SELECT mufaj_id, COUNT(*) AS darab,
    AVG(oldalszam) AS atlag_oldalszam
    FROM konyvek
    GROUP BY mufaj_id`, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.get('/api/hosszu-konyvek', (req, res) => {
    db.query('SELECT cim, kiadasi_ev, oldalszam FROM konyvek WHERE oldalszam >= 400 ORDER BY oldalszam DESC', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(
        `A szerver fut: http://localhost:${PORT}`
    );
});
 



app.listen(3000, () => {
    console.log('Szerver fut a 3000-es porton');
});
