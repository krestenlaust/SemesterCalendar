// date,title,logo
#let events = csv("events.csv")

// Skip header row, parse into structs
#let event-rows = events.slice(1).map(row => (
    date: row.at(0),
    title: row.at(1),
    logo: "assets/" + row.at(2),
))

// Group by date
#let event-grouped = (:)
#for row in event-rows {
    if event-grouped.at(row.date, default: none) == none {
        event-grouped.insert(row.date, ())
    }
    event-grouped.at(row.date).push(row)
}

// name,description,logo,contact
#let orgs = csv("orgs.csv")

// Skip header row, parse into structs
#let org-rows = orgs.slice(1).map(row => (
    name: row.at(0),
    description: row.at(1),
    logo: "assets/" + row.at(2),
    contact: row.at(3),
))


// Render
#for (date, items) in event-grouped [
    == #date

    #for item in items [
        #grid(
            columns: (auto, 1fr),
            gutter: 8pt,
            image(item.logo, height: 32pt),
            align(horizon)[#item.title],
        )
    ]

    #v(12pt)
]

// Render
#grid(
    columns: (auto,),
    gutter: 12pt,
    ..org-rows.map(org => {
        grid(
            columns: (32pt, 1fr),
            gutter: 8pt,
            image(org.logo, height: 32pt),
            [
                #if org.name != "" [*#org.name* \ ]
                #if org.description != "" [#org.description \ ]
                #emph(org.contact)
            ],
        )
    })
)