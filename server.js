import express from 'express'

import { Liquid } from 'liquidjs';

const app = express()

app.use(express.urlencoded({ extended: true }))


app.use(express.static('public'))

const engine = new Liquid();
app.engine('liquid', engine.express());

app.set('views', './views')

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

  response.render("webinar.liquid", {
    webinars: webinarResponseJSON.data,
    contourings: contouringResponseJSON.data
  })
})

app.get("/bookmarks", async function (request, response) {
  const bookmarksResponse = await fetch(`${apiEndpoint}${apiMessagesEndpoint}${messagesFilter}`)
  const bookmarksResponseJSON = await bookmarksResponse.json()

  const webinarResponse = await fetch(`${apiEndpoint}${apiWebinarEndpoint}${webinarFields}`)
  const webinarResponseJSON = await webinarResponse.json()

  const bookmarkedWebinarIds = bookmarksResponseJSON.data.map(bookmark => bookmark.text)
  const bookmarkedWebinars = webinarResponseJSON.data.filter(webinar =>
    bookmarkedWebinarIds.includes(String(webinar.id))
  )

  const webinarsWithBookmarkStatus = bookmarkedWebinars.map(webinar => {
    return {
      ...webinar,
      isBookmarked: true
    }
  })

  response.render("bookmarks.liquid", {
    webinars: webinarsWithBookmarkStatus,
    bookmarks: bookmarksResponseJSON.data
  })
})

app.post("/webinars", async function (request, response) {
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
  response.redirect(303, "/webinars")
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
  response.redirect(303, "/bookmarks")
})

/* 
// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post(…, async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus
  await fetch(…, {
    method: …,
    body: JSON.stringify(…),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, …)
})
*/

app.set('port', process.env.PORT || 8000)

app.listen(app.get('port'), function () {
  console.log(`http://localhost:${app.get('port')}`)
})
