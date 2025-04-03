De instructie vind je in: [INSTRUCTIONS.md](https://github.com/fdnd-task/the-web-is-for-everyone-interactive-functionality/blob/main/docs/INSTRUCTIONS.md)

# Interactive Functionality - Oncollaboration

<img width="250" alt="image" src="https://github.com/user-attachments/assets/31e40f28-6674-40af-86c6-93da555ec3ca" />
<img width="500" alt="image" src="https://github.com/user-attachments/assets/77f4b384-9f1a-47aa-ad56-5f50f93d5b91" />

[Bekijk hier de live site](https://the-web-is-for-everyone-interactive-0o97.onrender.com)

## Inleiding 
### About _Oncollaboration_
Oncollaboration is een ontwerp voor een online platform voor samenwerking en kennisdeling tussen Indonesische en Nederlandse radiotherapeuten.

Dit platform is het afstudeerwerk van oud-CMD student Sergio Eijben. Hij is in opdracht van Judi van Diessen van het Antoni van Leeuwenhoek ziekenhuis afgestudeerd op de vraag hoe de samenwerking en kennisdeling tussen radiotherapeuten in Nederland en Indonesië verbeterd kan worden.

### Uitdaging
Ontwerp en ontwikkel het online platform Oncollaboration om kennisoverdracht en interactie tussen Nederlandse en Indonesische radiotherapeuten te stimuleren.

### Oplossing
Mijn oplossing voor de uitdaging omvat 2 pagina's, namelijk: webinars en bookmarks. Nieuw is de mogelijkheid om webinars te bookmarken. Alle bookmarks zijn te vinden op de bookmarks pagina. De focus van deze sprint ligt op _Progressive Enhancement_, toegankelijkheid en testresultaten gebruiken voor het verbeteren van een ontwerp.

[Bekijk hier de live site](https://the-web-is-for-everyone-interactive-0o97.onrender.com)

## Inhoudsopgave
  * [Beschrijving](#beschrijving)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving 
Op de `webinars` pagina staat het hele overzicht van alle webinars die gegeven zijn. Per webinar staat de titel, duur, spreker en de categorie beschreven. Ook is hier de mogelijkheid om een webinar te bookmarken met de knop 'bookmark'. 

https://github.com/user-attachments/assets/077e882f-9ff4-4b05-a99e-f4ffec000476

Op de `bookmarks` pagina komen alle gebookmarkte webinars te staan en kunnen deze verwijderd worden. 

https://github.com/user-attachments/assets/48e69998-414e-4849-a51a-0c4cca52789c

Daarnaast kunnen de webinars gesorteerd en gefilterd worden aan de hand van de `sort & filter`. 

https://github.com/user-attachments/assets/a023ebed-d048-4784-a4ac-b88599d2c03a

https://github.com/user-attachments/assets/5623c59a-bfad-48ad-b471-737cfa743036

### Responsive
De website is gebouwd vanuit het mobile-first principe. Onderstaande afbeelding laat de verschillende layouts zien. Op het kleinste formaat heb ik gewerkt met een one column layout, en naar mate de schermbreedte groter wordt, wordt er meer content horizontaal geplaatst en uitgelijnd.

![image](https://github.com/user-attachments/assets/5367ec07-5941-4998-966e-a1debafffd81)

### Ontwerpkeuzes
#### Nieuwe huisstijl
Deze sprint ben ik bezig geweest met het herontwerpen van het platform. Ik heb me voornamelijk bezig gehouden met het maken van een nieuwe huisstijl, specifiek gericht op de kleuren. Het is was hierbij belangrijk om de kleuren van het Indonesische ziekenhuis terug te laten komen. Hiervoor heb ik me laten inspireren door het bestaande logo met blauwe, groene en groen/gele highlights. 

![image](https://github.com/user-attachments/assets/091180e6-a5ae-420c-978b-16b6e96e210e)

#### Contrast
Voor dit herontwerp was het belangrijk om het kleur contrast te testen i.v.m. toegankelijkheid. Op basis van de resultaten heb ik een aantal teksten een andere kleur gegeven om aan de toegankelijkheids eisen te voldoen. 

<img width="350" alt="Image" src="https://github.com/user-attachments/assets/a3948783-2675-4130-86f8-41cea1757cc1" />

<img width="350" src="https://github.com/user-attachments/assets/2df1c116-1955-4e46-8e2c-2e2086d20528">

#### UI states
Deze sprint heb ik ook gewerkt aan verschillende UI states, dit is bijvoorbeeld terug te vinden bij de `bookmarks` pagina, wanneer er nog geen bookmarks gedaan zijn. 

Zie onderstaande afbeeldingen voor een aantal voorbeelden. Een deel van de states heb ik al uitgewerkt, maar een deel ook nog niet. Zo wil ik bijvoorbeeld nog de error state toevoegen aan de 'bookmark' knop. 

<img width="500" alt="image" src="https://github.com/user-attachments/assets/2b8fe5f6-85a9-473a-a7b7-65488a6381c0" />

<img width="350" alt="image" src="https://github.com/user-attachments/assets/c8e86635-a85f-4fcb-9aab-10c810046e0a" />

### Belangrijke features
#### Bookmark functionaliteit met progressive enhancement
Deze sprint heb ik gewerkt aan een werkende bookmark functionaliteit. Dit heb ik volgens de _progressive enhancement_ strategie gemaakt. 

Binnen de interactie geef ik feedback en feedforward aan de gebruiker. Zo is er een duidelijk label, namelijk 'Bookmark' wat de gebruiker vertelt wat de knop zal doen. Daarnaast dit er een hover op en verandert de muis in een pointer. Bij een klik verandert de achtergrondkleur van de knop, start de loading animatie en verandert de tekst naar 'Loading' dit geeft feedback aan de gebruiker, dat er iets gebeurt o.b.v. de klik en geeft feedforward, namelijk 'wacht nog even, er gaat iets gebeuren'. Bij een succesvolle interactie verandert de tekst naar 'Bookmarked' en verschijnt er een vinkje in de bookmark afbeelding. 
Wanneer er dan weer op de knop geklikt wordt, wordt eerste loading animatie gestart (feedback) en daarna verschijnt weer de tekst 'Bookmark' met de oorspronkelijke afbeelding (feedback). Hiermee weet de gebruiker dat de bookmark weer uit de lijst verwijderd is. 

_**Progressive Enhancement**_

Progressive Enhancement is een coding strategie, waarmee je er voor kunt zorgen dat je website het altijd doet, voor iedereen. 

1. Bepaal de _core functionality_.

Vanuit de user story heb ik de core functionality bepaald: 
* User story: Als radiotherapeut wil ik een overzicht van de webinars waarin ik geïnteresseerd ben zodat ik op een efficiënte manier gebruik kan maken van Oncollaboration
* Core functionality: Een webinar kunnen toevoegen en verwijderen uit een (bookmark) lijst. 

2. Bouw de functionaliteit met de simpelste techniek.

De bookmark functionaliteit werkt met puur HTML:

https://github.com/user-attachments/assets/edddfab8-5630-49f0-bc0f-4fa4eba96137

Met CSS heb ik de cards en de bookmark knop vormgegeven naar de huisstijl. De pagina wordt helemaal ververst en de 'Bookmark' tekst (feedforward) wordt aangepast naar 'Bookmarked' (feedback)

https://github.com/user-attachments/assets/470802e7-24de-45a0-acac-b9cd89151da5

4. Voeg daarna extra enhancements toe met CSS en client-side JS om de UX te verbeteren. 

Met client-side JS en CSS heb ik een laad animatie toegevoegd aan de bookmark interactie en zorg ik ervoor dat niet de hele pagina ververst wordt. 

https://github.com/user-attachments/assets/902263b1-be56-4f53-b7d3-44ff6559628a

## Kenmerken
In dit project maak ik gebruik van Node.js en Express om een webserver op te zetten. Ik gebruik Liquid als template-engine voor het genereren van dynamische HTML-pagina's.

### Routes en dataverwerking
* [`app.get("/")`](https://github.com/julia-stevens/the-web-is-for-everyone-interactive-functionality/blob/a989d21a7b774154c90c0e748d57ebf8453f54c5/server.js#L24-L35): Haalt gegevens op voor webinars en contourings via de Directus API, verzamelt alle resources van webinars en rendert de gegevens in index.liquid.
* [`app.get("/webinars")`](https://github.com/julia-stevens/the-web-is-for-everyone-interactive-functionality/blob/a989d21a7b774154c90c0e748d57ebf8453f54c5/server.js#L37-L85): Haalt webinars op, past sorteermogelijkheden toe op basis van de querystring (zoals nieuwste, oudste, alfabetisch of op aantal views), en filtert op een geselecteerde categorie. De gerenderde gegevens worden weergegeven in webinars.liquid.
* [`app.get("/webinars/:slug")`](https://github.com/julia-stevens/the-web-is-for-everyone-interactive-functionality/blob/a989d21a7b774154c90c0e748d57ebf8453f54c5/server.js#L87-L105): Haalt de details op van een specifiek webinar op basis van de slug uit de URL en toont de gegevens in webinar.liquid.
* [`app.get("/bookmarks")`](https://github.com/julia-stevens/the-web-is-for-everyone-interactive-functionality/blob/a989d21a7b774154c90c0e748d57ebf8453f54c5/server.js#L107-L133): Haalt de opgeslagen bookmarks op en toont ze in bookmarks.liquid.
* [`app.post("/webinars")`](https://github.com/julia-stevens/the-web-is-for-everyone-interactive-functionality/blob/a989d21a7b774154c90c0e748d57ebf8453f54c5/server.js#L135-L163): Verwerkt het toevoegen en verwijderen van bookmarks en stuurt de gegevens naar de Directus API.
* [`app.post("/bookmarks")`](https://github.com/julia-stevens/the-web-is-for-everyone-interactive-functionality/blob/a989d21a7b774154c90c0e748d57ebf8453f54c5/server.js#L180-L209): Verwerkt het toevoegen en verwijderen van bookmarks en stuurt de gegevens naar de Directus API.

### Data ophalen en HTML renderen
* De gegevens worden opgehaald via fetch()-aanvragen naar verschillende Directus API-eindpunten, zoals voor webinars, contourings en categorieën. [Hier is een voorbeeld van het ophalen van alle webinars](https://github.com/julia-stevens/the-web-is-for-everyone-interactive-functionality/blob/a989d21a7b774154c90c0e748d57ebf8453f54c5/server.js#L63-L64).
* Na verwerking van de data wordt de HTML gegenereerd met behulp van Liquid templates. [Hier wordt bijvoorbeeld de detailpagina van een webinar gerenderd](https://github.com/julia-stevens/the-web-is-for-everyone-interactive-functionality/blob/a989d21a7b774154c90c0e748d57ebf8453f54c5/server.js#L78-L79).
* De gerenderde HTML wordt gegenereerd via Liquid, waarbij variabelen worden doorgegeven aan de templates. [Zie bijvoorbeeld het overzicht van alle webinars in webinars.liquid](https://github.com/julia-stevens/the-web-is-for-everyone-interactive-functionality/blob/a989d21a7b774154c90c0e748d57ebf8453f54c5/views/webinars.liquid#L19-L26)

### Uitleg _Progressive Enhancements_
Progressive Enhancement is een coding strategie, waarmee je er voor kunt zorgen dat je website het altijd doet, voor iedereen. 

1. Bepaal de _core functionality_.
2. Bouw de functionaliteit met de simpelste techniek (dit is meestal HTML en CSS met huisstijl).
3. Voeg daarna extra enhancements toe met CSs en client-side JS om de UX te verbeteren. 

### Uitleg _NodeJS, Express en Liquid_
#### NodeJS
Met NodeJS kun je JavaScript op een server draaien. Hiermee kun je get en post request/responses bouwen om met bv. databases te communiceren. Zoals wij in dit project hebben gedaan.

#### Express
Express is een hulpmiddel binnen NodeJS, waarmee een webserver gebouwd kan worden. Je kunt bijvoorbeeld instellen welke pagina's en data getoond wordt.

#### Liquid
Liquid is een template-engine waarmee je dynamische HTML-pagina's kunt genereren.

## Installatie
Zoals beschreven bij Kenmerken is bij dit project gebruik gemaakt van NodeJS. Om aan dit project te werken moet NodeJS geïnstalleerd zijn. Eenmal geïnstalleerd kan het project geopend worden in de code editor.

Voer in de terminal `npm install` uit om alle afhankelijkheden te installeren.

Voer vervolgens `npm start` uit om de server te starten.

Ga in je browser naar http://localhost:8000 om het project te bekijken.

## Bronnen
* [FDND Agency](https://github.com/fdnd-agency/oncollaboration/wiki/Design-Challenge)

## Licentie
This project is licensed under the terms of the [MIT license](./LICENSE).
