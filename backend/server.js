const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT =3000

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'konyvtar_rl',
    port: 3307
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
})




 
 

app.post('/api/konyvek', (req, res) => {
    const{mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto} = req.body;
    db.query(
        "INSERT INTO konyvek (mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto) VALUES (?,?,?,?,?)",
        [mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto ],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send('Konyv sikeresen beszurva! ID: ' + result.insertId);
        }
    );
});

app.post('/api/mufajok', (req, res) => {
    const { nev } = req.body;

    db.query(
        'INSERT INTO mufajok (nev) VALUES (?)',
        [nev],
        (err, result) => {
            if (err) return res.status(500).send(err);

            res.json({ uzenet: 'Mufaj sikeresen beszurva!', id: result.insertId });
        }
    );
});

app.put('/api/konyvek/:id', (req, res) => {
    const { mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto } = req.body;
    const id = req.params.id;
 
    db.query(
        'UPDATE konyvek SET mufaj_id = ?, cim = ?, kiadasi_ev = ?, oldalszam = ?, kolcsonozheto = ? WHERE id = ?',
        [mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto, id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ uzenet: 'Könyv sikeresen módosítva!' });
        }
    );
});
app.put('/api/mufajok/:id', (req, res) => {
    const { nev } = req.body;
    const id = req.params.id;
 
    db.query(
        'UPDATE mufajok SET nev = ? WHERE id = ?',
        [nev, id],
        (err, result) => {
            if (err) return res.status(500).send(err);
 
            res.json({ uzenet: 'Műfaj sikeresen módosítva!' });
        }
    );
});
 

app.delete('/api/konyvek/:id', (req, res) => {
    const id = req.params.id;
 
    db.query(
        'DELETE FROM konyvek WHERE id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);
 
            res.json({ uzenet: 'Könyv sikeresen törölve!' });
        }
    );
});
 
 

app.delete('/api/mufajok/:id', (req, res) => {
    const id = req.params.id;
 
    db.query(
        'DELETE FROM mufajok WHERE id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);
 
            res.json({ uzenet: 'Műfaj sikeresen törölve!' });
        }
    );
});
 



app.listen(PORT, () => {
    console.log(
        `A szerver fut: http://localhost:${PORT}`
    );
});
