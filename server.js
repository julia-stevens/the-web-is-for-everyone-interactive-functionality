import express from 'express'
import { Liquid } from 'liquidjs';

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views')

import methodOverride from "method-override"
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

  // van ChatGPT om alle resources op te halen 
  let allResources = [] // allResources array 
  webinarResponseJSON.data.forEach((webinar) => { // voor elke webinar
    if (webinar.resources && Array.isArray(webinar.resources)) { // als er resources zijn & webinar.resources is een array
      allResources = allResources.concat(webinar.resources) // dan voeg de resources toe aan de array (allResources) 
    }
  })
  // einde ChatGPT code

  response.render("index.liquid", {
    webinars: webinarResponseJSON.data,
    contourings: contouringResponseJSON.data,
    resources: allResources
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

  const bookmarkedWebinarIds = bookmarksResponseJSON.data.map(bookmark => String(bookmark.text));
  const webinarsWithStringIds = webinarResponseJSON.data.map(webinar => ({
    ...webinar,
    id: String(webinar.id)
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

  const bookmarkedWebinarIds = bookmarksResponseJSON.data.map(bookmark => String(bookmark.text));
  const webinarsWithStringIds = webinarResponseJSON.data.map(webinar => ({
    ...webinar,
    id: String(webinar.id)
  }))

  const bookmarkedWebinars = webinarsWithStringIds.filter(webinar =>
    bookmarkedWebinarIds.includes(webinar.id)
  )
  
  response.render("bookmarks.liquid", {
    webinars: bookmarkedWebinars, 
    bookmarks: bookmarksResponseJSON.data,
    categories: categoriesResponseJSON.data,
    bookmarkedIds: bookmarkedWebinarIds
  })
})

app.post("/webinars", async function (request, response) {
  const { textField, forField, _method } = request.body

  if (_method === "DELETE") {
    const bookmarksResponse = await fetch(`${apiEndpoint}${apiMessagesEndpoint}${messagesFilter}`)
    const bookmarksResponseJSON = await bookmarksResponse.json()

    const bookmarkToDelete = bookmarksResponseJSON.data.find(
      bookmark => bookmark.text === textField && bookmark.for === "Bookmark for Julia"
    )

    if (bookmarkToDelete) {
      await fetch(`${apiEndpoint}${apiMessagesEndpoint}/${bookmarkToDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" }
      })
    }
  } else {
    await fetch(`${apiEndpoint}${apiMessagesEndpoint}`, {
      method: "POST",
      body: JSON.stringify({
        text: textField,
        for: forField
      }),
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    })
  }
  response.redirect(303, request.get("Referer") || "/webinars")
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
  const { textField, forField, _method } = request.body

  if (_method === "DELETE") {

    const bookmarksResponse = await fetch(`${apiEndpoint}${apiMessagesEndpoint}${messagesFilter}`)
    const bookmarksResponseJSON = await bookmarksResponse.json()

    const bookmarkToDelete = bookmarksResponseJSON.data.find(
      bookmark => bookmark.text === textField && bookmark.for === "Bookmark for Julia"
    )

    if (bookmarkToDelete) {
      await fetch(`${apiEndpoint}${apiMessagesEndpoint}/${bookmarkToDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" }
      })
    }

    await fetch(`${apiEndpoint}${apiMessagesEndpoint}`, {
      method: "POST",
      body: JSON.stringify({
        text: textField,
        for: forField
      }),
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    })
  }
  response.redirect(303, request.get("Referer") || "/bookmarks")
})

app.set('port', process.env.PORT || 8000)

// 404 pagina
app.use((request, response, next) => {
  response.status(404).render("error.liquid")
})

app.listen(app.get('port'), function () {
  console.log(`http://localhost:${app.get('port')}`)
})

// /Users/juliastevens/Desktop/fdnd/sprint 9/the-web-is-for-everyone-interactive-functionality/views/partials/error.liquid