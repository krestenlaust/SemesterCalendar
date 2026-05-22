/* 
 * CONFIGS
 */

#let config      = toml("config.toml")
#let year        = config.semester.year
#let months      = config.semester.months
#let assets-path = config.paths.assets

/* 
 * LOAD DATA
 */

// date,title,logo
#let event-rows = csv(config.paths.events).slice(1).map(row => (
    date:  row.at(0),
    title: row.at(1),
    logo:  row.at(2),
))

// name,description,logo,contact
#let org-rows = csv(config.paths.orgs).slice(1).map(row => (
    name:        row.at(0),
    description: row.at(1),
    logo:        row.at(2),
    contact:     row.at(3),
))

// Group by date
#let event-grouped = (:)
#for row in event-rows {
    if event-grouped.at(row.date, default: none) == none {
        event-grouped.insert(row.date, ())
    }
    event-grouped.at(row.date).push(row)
}

/* 
 * HELPERS
 */

#let events-on(date) = event-rows.filter(e => e.date == date)

#let is-weekend(weekday) = weekday == 6 or weekday == 7

// Returns ISO date string for a given year, month, day
#let iso-date(y, m, d) = {
    let mm = str(m)
    let dd = str(d)
    if m < 10 { mm = "0" + mm }
    if d < 10 { dd = "0" + dd }
    str(y) + "-" + mm + "-" + dd
}

// Danish month names
#let month-name(m) = (
    "Januar", "Februar", "Marts", "April", "Maj", "Juni",
    "Juli", "August", "September", "Oktober", "November", "December"
).at(m - 1)

// Days in a month (accounting for leap years)
#let days-in-month(y, m) = {
    if m == 2 {
        if calc.rem(y, 400) == 0 { 29 }
        else if calc.rem(y, 100) == 0 { 28 }
        else if calc.rem(y, 4) == 0 { 29 }
        else { 28 }
    } else if (1, 3, 5, 7, 8, 10, 12).contains(m) { 31 }
    else { 30 }
}

// Weekday of first day of month (1=Mon … 7=Sun), using Tomohiko Sakamoto
#let first-weekday(y, m) = {
    let t = (0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4)
    let yy = if m < 3 { y - 1 } else { y }
    let idx = m - 1
    let dow = calc.rem(
        yy + int(yy / 4) - int(yy / 100) + int(yy / 400) + t.at(idx) + 1,
        7
    )
    // Convert Sun=0 to Mon=1…Sun=7
    if dow == 0 { 7 } else { dow }
}

/* 
 * THE DANISH STUFF // THE DANISH METHOD
 */

#let weekday-letter(wd) = ("M","T","O","T","F","L","S").at(wd - 1)

/* 
 * COLOURS
 */

#let weekend-fill = rgb("#eeeeee")
#let white-fill   = white
#let grid-stroke  = (paint: luma(180), thickness: 1pt)

/* 
 * DIMENSIONS
 */

#let row-height = 24pt
#let col-wd     = 22pt   // weekday letter column
#let col-date   = 22pt   // day number column

/* 
 * CELL
 */

#let cell(content, fill: white-fill, content-align: center, col-width: row-height) = block(
    fill: fill,
    width: col-width,
    height: row-height,
    clip: true,
    inset: (x: 2pt, y: 2pt),
    stroke: grid-stroke,
    align(content-align, content)
)

/* 
 * SINGLE MONTH BLOCK
 */

#let render-month(y, m) = {
    let days  = days-in-month(y, m)
    let start = first-weekday(y, m)

    // Build rows: (weekday, day-number, fill, events-content)
    let rows = range(1, days + 1).map(d => {
        let wd   = calc.rem(start + d - 2, 7) + 1
        let fill = if is-weekend(wd) { weekend-fill } else { white-fill }
        let date = iso-date(y, m, d)
        let evs  = events-on(date)

        let event-content = {
            for ev in evs {
                box(
                    height: row-height - 2pt,
                    baseline: 2pt,
                    image(assets-path + ev.logo, height: row-height - 4pt)
                )
                h(2pt)
                box(
                  height: row-height - 2pt,
                  baseline: 2pt, 
                  width: .5fr,
                )[#set par(leading:2pt)
                #align(horizon)[
                #text(size: 12pt, ev.title)]]
                h(6pt)
            }
        }

        (wd, d, fill, event-content)
    })

    block(
        width: 100%,
        stroke: grid-stroke,
        inset: 0pt,
        spacing: 0pt,
        {
            // Month heading
            block(
                width: 100%,
                fill: white-fill,
                inset: (x: 4pt, y: 4pt),
                stroke: grid-stroke,
                spacing: 0pt,
                align(center + horizon)[#text(size: 32pt, weight: "bold", month-name(m))]
            )
            // Day rows
            grid(
                columns: (col-wd, col-date, 1fr),
                grid.hline(y: 0, stroke: grid-stroke),
                ..rows.map(((wd, d, fill, evs)) => (
                    cell(
                        text(size: 12pt, weekday-letter(wd)),
                        fill: fill,
                        content-align: center + horizon,
                        col-width: col-wd,
                    ),
                    cell(
                        text(size: 12pt, str(d)),
                        fill: fill,
                        content-align: center + horizon,
                        col-width: col-wd,
                    ),
                    cell(evs, fill: fill, col-width: 100%),
                )).flatten()
            )
        }
    )
}

/*
 * FOOTER
 */

#let cool_cell(org) = {
    block(
        inset: 4pt,
        width: 100%,
        height: 100%,
        fill: white-fill,
        //stroke: grid-stroke,
        {   
            align(center + horizon, {
              image(assets-path + org.logo, height: 86pt)
              v(2pt)
              if org.name != "" {
                  text(size: 14pt, weight: "bold", org.name)
                  linebreak()
              }
              if org.description != "" {
                  text(size: 12pt, org.description)
                  linebreak()
              }
              text(size: 10pt, style: "italic", org.contact)
            })
        }
    )
}


#let cool_cell2(org) = {
  align(horizon + center)[#grid(columns: 3, 
        align(left + horizon)[#image(assets-path + org.logo, height: 48pt)],
        h(2pt),
        align(left + horizon, {
              if org.name != "" {
                  text(size: 14pt, weight: "bold", org.name)
                  linebreak()
              }
              if org.description != "" {
                  text(size: 12pt, org.description)
                  linebreak()
              }
              text(size: 10pt, style: "italic", org.contact)
          })
        )]
}

#let render-footer(all_stuff: org-rows) = {
    grid(
        columns: (200pt,200pt,200pt,200pt,200pt,200pt,200pt,200pt),
        rows: (100pt, 100pt),
        column-gutter: 0pt,
        //stroke: grid-stroke,
        grid.cell(
            rowspan: 2,
            cool_cell(all_stuff.at(0))
        ),
        grid.cell(colspan: 3, rowspan: 2,
            grid(
              columns: (200pt,200pt,200pt), 
              rows: (100pt),
              //stroke: grid-stroke,
              ..all_stuff.slice(1,6).map(org => {
                  cool_cell2(org)
              }),
            )
        ),
        ..all_stuff.slice(6).map(org => {
            grid.cell(
                rowspan: 2,
                //stroke: grid-stroke,
                cool_cell(org)
            )
        })
    )
}

/* 
 * PAGE LAYOUT
 */

#set page(
    paper: "a2",
    flipped: true,
    margin: 12mm,
    //background: rect(width: 100%, height: 100%, fill: luma(255))
)

#set text(font: "Roboto", size: 9pt)

// Month grid — divide A2 width across all months
#grid(
    columns: months.map(_ => 1fr),
    column-gutter: 5pt,
    ..months.map(m => render-month(year, m))
)

#v(3pt)
#render-footer()