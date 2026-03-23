1. Jäiga ruudustiku projekteerimine (CSS)
Peamine probleem alguses oli see, et ruudustik „lagunes laiali“, kui pildid olid erineva suurusega. Selle parandamiseks kasutasin järgmisi lahendusi:

Fikseeritud konteiner: Määrasin mänguvälja suuruseks täpselt 500x500 pikslit.

CSS Grid: Kasutasin display: grid ja dünaamilist tulpade arvutust repeat(${gSize}, 1fr). See võimaldas jagada välja automaatselt võrdseteks ruutudeks (3x3, 4x4 jne).

Deformatsiooni kaitse: Et detailid ei veniks, lisasin omadused aspect-ratio: 1/1 (täiuslik ruut) ja object-fit: cover (et pilt tüki sees ei kahaneks, vaid täidaks selle korrektselt).

2. Pildi lõikamine (Canvas API)
Selleks, et muuta üks foto pusletükkide kogumiks, kasutasin peidetud lõuendit (Canvas):

Programm võtab algse foto ja skaleerib selle mõõtu 500x500.

Seejärel käivitub tsükkel, mis käib läbi X- ja Y-koordinaadid.

Suure lõuendi igast osast „lõigatakse“ fragment ja salvestatakse see eraldi väikese pildina (base64 formaadis).

Need fragmendid muudetakse objektideks, mida saab hiirega liigutada.

3. Drag-and-Drop mehaanika (Lohistamine)
See on loogika kõige keerulisem osa. Kasutasin standardset HTML5 Drag-and-Drop API-t:

Drag Start: Kui alustad tüki lohistamist, jätab skript meelde selle indeksi ja koha, kust see võeti (kas hoidlast või mänguvälja ruudust).

Drop (Vahetamine): Kui asetad tüki juba hõivatud ruudule, toimub automaatne vahetus (Swap). Vana detail kas liigub hoidlasse või eelmise detaili kohale. See välistab olukorra, kus tükid üksteise peale kuhjuvad ja "ära kaovad".

Tagastamine klikiga: Lisasin onclick funktsiooni, et ruudustikul olevale tükile vajutades lendaks see kohe tagasi valikupaneeli.

4. Kaamera funktsionaalsus
Et mängijad saaksid teha puslesid oma selfidest:

Kasutasin navigator.mediaDevices.getUserMedia liidest videovoo avamiseks.

Lõin modaalakna <video> elemendiga.

Nupule „Pildista“ (Snap) vajutades joonistatakse video hetkekaader Canvas-ile. Oluline detail: lisasin skripti, mis lõikab ristkülikukujulise video keskosast välja ruudu, et näod ei jääks väljavenitatud.

5. Võidu kontrolli loogika
Pärast iga tüki asetamist käivitatakse kontrollfunktsioon:

Programm käib läbi kõik ruudustiku lahtrid.

See võrdleb lahtris oleva tüki numbrit selle lahtri õige numbriga.

Kui kõik detailid on õigetel kohtadel, peatub taimer ja kuvatakse võidusõnum.

6. Kasutajaliides ja mugavus
Lisasin taimeri, et tekitada põnevust.

Tegin valitavad raskusastmed (3x3 kuni 10x10).

Lisasime taustamuusika sisselülitamise võimaluse <audio> sildi abil.
