import express from 'express'
import { Liquid } from 'liquidjs';

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views')

import methodOverride from "method-override" // Importeer de "method-override" module, die het mogelijk maakt om HTTP-methoden zoals PUT en DELETE te gebruiken
app.use(methodOverride("_method"))

// API response links
const apiEndpoint = "https://fdnd-agency.directus.app/items"
const apiWebinarEndpoint = "/avl_webinars"
const apiContouringEndpoint = "/avl_contourings"
const apiCategoriesEndpoint = "/avl_categories"
const apiMessagesEndpoint = "/avl_messages"
const webinarFields = "?fields=*,speakers.*.*,resources.*.*,categories.*.*"
const messagesFilter = "?filter[for][_eq]=Bookmark for Julia"

app.get("/", async function (request, response) {
  const webinarResponse = await fetch(`${apiEndpoint}${apiWebinarEndpoint}${webinarFields}`);
  const webinarResponseJSON = await webinarResponse.json();

  const contouringResponse = await fetch(`${apiEndpoint}${apiContouringEndpoint}`)
  const contouringResponseJSON = await contouringResponse.json()

  response.render("index.liquid", {
    webinars: webinarResponseJSON.data,
    contourings: contouringResponseJSON.data
  })
})

app.get("/webinars", async function (request, response) {
  let sortWebinars = ""
  const filterCategory = "&filter[categories][avl_categories_id][name][_eq]="
  let filteredCategory = ""

  switch (request.query.sort) {
    case "newest":
      sortWebinars = "&sort=-date"
      break
    case "oldest":
      sortWebinars = "&sort=date"
      break
    case "alphabetical":
      sortWebinars = "&sort=title"
      break
    case "views":
      sortWebinars = "&sort=views"
      break
    default:
      sortWebinars = ""
  }

  if (request.query.category) {
    filteredCategory = `${filterCategory}${encodeURIComponent(request.query.category)}`
  }

  const webinarResponse = await fetch(`${apiEndpoint}${apiWebinarEndpoint}${webinarFields}${sortWebinars}${filteredCategory}`)
  const webinarResponseJSON = await webinarResponse.json()

  const categoriesResponse = await fetch(`${apiEndpoint}${apiCategoriesEndpoint}`)
  const categoriesResponseJSON = await categoriesResponse.json()

  const bookmarksResponse = await fetch(`${apiEndpoint}${apiMessagesEndpoint}${messagesFilter}`)
  const bookmarksResponseJSON = await bookmarksResponse.json()

  const bookmarkedWebinarIds = bookmarksResponseJSON.data.map(bookmark => String(bookmark.text)) // Converteer de "text" eigenschap van elk bookmark-object naar een string en sla deze op in een array
  const webinarsWithStringIds = webinarResponseJSON.data.map(webinar => ({ // Nieuwe array waarin alle webinars worden gekopieerd en "id" wordt omgezet naar string
    ...webinar, // Kopieer alle bestaande eigenschappen van het webinar object
    id: String(webinar.id) // Zet "id" om naar een string
  }))

  response.render("webinars.liquid", {
    webinars: webinarsWithStringIds,
    categories: categoriesResponseJSON.data,
    currentSort: request.query.sort || "newest",
    currentCategory: request.query.category || "",
    bookmarkedIds: bookmarkedWebinarIds
  })
})

app.get("/webinars/:slug", async function (request, response) {
  const slug = request.params.slug
  const filter = `&filter={"slug":"${slug}"}`

  const webinarResponse = await fetch(`${apiEndpoint}${apiWebinarEndpoint}${webinarFields}${filter}`)
  const webinarResponseJSON = await webinarResponse.json()

  const contouringResponse = await fetch(`${apiEndpoint}${apiContouringEndpoint}`)
  const contouringResponseJSON = await contouringResponse.json()

  const categoriesResponse = await fetch(`${apiEndpoint}${apiCategoriesEndpoint}`)
  const categoriesResponseJSON = await categoriesResponse.json()

  response.render("webinar.liquid", {
    webinars: webinarResponseJSON.data,
    contourings: contouringResponseJSON.data,
    categories: categoriesResponseJSON.data
  })
})

app.get("/bookmarks", async function (request, response) {
  const bookmarksResponse = await fetch(`${apiEndpoint}${apiMessagesEndpoint}${messagesFilter}`)
  const bookmarksResponseJSON = await bookmarksResponse.json()

  const webinarResponse = await fetch(`${apiEndpoint}${apiWebinarEndpoint}${webinarFields}`)
  const webinarResponseJSON = await webinarResponse.json()

  const categoriesResponse = await fetch(`${apiEndpoint}${apiCategoriesEndpoint}`)
  const categoriesResponseJSON = await categoriesResponse.json()

  const bookmarkedWebinarIds = bookmarksResponseJSON.data.map(bookmark => String(bookmark.text)) // Converteer de "text" eigenschap van elk bookmark-object naar een string en sla deze op in een array
  const webinarsWithStringIds = webinarResponseJSON.data.map(webinar => ({ // Nieuwe array waarin alle webinars worden gekopieerd en "id" wordt omgezet naar string
    ...webinar, // Kopieer alle bestaande eigenschappen van het webinar object
    id: String(webinar.id) // Zet "id" om naar een string
  }))

  const bookmarkedWebinars = webinarsWithStringIds.filter(webinar => // Filter lijst van webinars om alleen webinars over te houden waarvan id voorkomt in lijst met bookmarked webinar id's
    bookmarkedWebinarIds.includes(webinar.id) // controleer of "id" van webinar voorkomt in bookmarked (opgeslagen) id's
  )
  
  response.render("bookmarks.liquid", {
    webinars: bookmarkedWebinars, 
    bookmarks: bookmarksResponseJSON.data,
    categories: categoriesResponseJSON.data,
    bookmarkedIds: bookmarkedWebinarIds
  })
})

app.post("/webinars", async function (request, response) {
  const { textField, forField, _method } = request.body // haal op uit body

  if (_method === "DELETE") { // als method is DELETE (in liquid bepaald)
    const bookmarksResponse = await fetch(`${apiEndpoint}${apiMessagesEndpoint}${messagesFilter}`)
    const bookmarksResponseJSON = await bookmarksResponse.json()

    const bookmarkToDelete = bookmarksResponseJSON.data.find( // Zoek in lijst van bookmarks
      bookmark => bookmark.text === textField && bookmark.for === "Bookmark for Julia" // of "text" = textField én "for" = "Bookmark for Julia"
    )

    if (bookmarkToDelete) { // als bookmark gevonden is die aan conditions voldoet, dan delete
      await fetch(`${apiEndpoint}${apiMessagesEndpoint}/${bookmarkToDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" }
      })
    }
  } else { // als method is geen DELETE 
    await fetch(`${apiEndpoint}${apiMessagesEndpoint}`, {
      method: "POST", // dus POST method
      body: JSON.stringify({
        text: textField, // text = webinar ID van gepostte webinar
        for: forField // Bookmark for Julia
      }),
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    })
  }
  response.redirect(303, request.get("Referer") || "/webinars") // Referer heeft URL van vorige pagina en gebruiker wordt geredirect naar deze pagina (default is ander /webinars)
})


app.post("/webinars/:slug", async function (request, response) {
  await fetch(`${apiEndpoint}${apiMessagesEndpoint}`, {
    method: "POST",
    body: JSON.stringify({
      text: request.body.textField,
      for: request.body.forField,
    }),
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
  response.redirect(303, "/webinars/:slug")
})

app.post("/bookmarks", async function (request, response) {
  const { textField, forField, _method } = request.body // haal op uit body

  if (_method === "DELETE") { // als method is DELETE (in liquid bepaald)
    const bookmarksResponse = await fetch(`${apiEndpoint}${apiMessagesEndpoint}${messagesFilter}`)
    const bookmarksResponseJSON = await bookmarksResponse.json()

    const bookmarkToDelete = bookmarksResponseJSON.data.find( // Zoek in lijst van bookmarks
      bookmark => bookmark.text === textField && bookmark.for === "Bookmark for Julia" // of "text" = textField én "for" = "Bookmark for Julia"
    )

    if (bookmarkToDelete) { // als bookmark gevonden is die aan conditions voldoet, dan delete
      await fetch(`${apiEndpoint}${apiMessagesEndpoint}/${bookmarkToDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" }
      })
    }
  } else {
      await fetch(`${apiEndpoint}${apiMessagesEndpoint}`, { // als method is geen DELETE
        method: "POST", // dus POST method
        body: JSON.stringify({
          text: textField, // text = webinar ID van gepostte webinar
          for: forField // Bookmark for Julia
        }),
        headers: { "Content-Type": "application/json;charset=UTF-8" }
      })
  }
  
  response.redirect(303, request.get("Referer") || "/bookmarks") // Referer heeft URL van vorige pagina en gebruiker wordt geredirect naar deze pagina (default is ander /webinars)
})

app.set('port', process.env.PORT || 8000)

// 404 pagina
app.use((request, response, next) => {
  response.status(404).render("error.liquid")
})

app.listen(app.get('port'), function () {
  console.log(`http://localhost:${app.get('port')}`)
})