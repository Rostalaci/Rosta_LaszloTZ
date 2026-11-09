1: -- Összes könyv lekérdezése műfajjal
SELECT 
    konyvek.id,
    konyvek.mufaj_id,
    konyvek.cim,
    konyvek.kiadasi_ev,
    konyvek.oldalszam,
    konyvek.kolcsonozheto,
    mufajok.nev AS mufaj_nev
FROM konyvek
JOIN mufajok ON konyvek.mufaj_id = mufajok.id
ORDER BY konyvek.kiadasi_ev ASC;
--------------------------------------------------

2: -- Régi, kölcsönözhető könyvek
SELECT *
FROM konyvek
WHERE kolcsonozheto = 1
AND kiadasi_ev < 2000;
--------------------------------------------------

3: -- Rómát tartalmazó címek
SELECT *
FROM konyvek
WHERE cim LIKE '%Roma%';
--------------------------------------------------
4: -- Műfajonkénti statisztika
SELECT 
    mufaj_id,
    COUNT(*) AS darab,
    AVG(oldalszam) AS atlag_oldalszam
FROM konyvek
GROUP BY mufaj_id;
--------------------------------------------------

5: -- Legalább 400 oldalas könyvek
SELECT 
    cim,
    kiadasi_ev,
    oldalszam
FROM konyvek
WHERE oldalszam >= 400
ORDER BY oldalszam DESC;
--------------------------------------------------

6: -- Új könyv beszúrása
INSERT INTO konyvek
(mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto)
VALUES
(1, 'Új könyv', 2024, 350, 1);
--------------------------------------------------

7: -- Új műfaj beszúrása
INSERT INTO mufajok (nev)
VALUES ('Fantasy');
--------------------------------------------------

8: -- Könyv adatainak módosítása
UPDATE konyvek
SET 
    mufaj_id = 1,
    cim = 'Módosított könyv',
    kiadasi_ev = 2025,
    oldalszam = 400,
    kolcsonozheto = 1
WHERE id = 1;
--------------------------------------------------

9: -- Műfaj nevének módosítása
UPDATE mufajok
SET nev = 'Sci-fi'
WHERE id = 1;
--------------------------------------------------

10: -- Könyv törlése
DELETE FROM konyvek
WHERE id = 1;
--------------------------------------------------

11: -- Műfaj törlése
DELETE FROM mufajok
WHERE id = 1;
--------------------------------------------------