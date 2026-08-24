/*
 * CONFIGS
 */

#let config      = toml("config.toml")
#let year        = config.semester.year
#let months      = config.semester.months
#let assets-path = config.paths.assets

// Paper setup — read from config if present, otherwise fall back to a2/flipped.
#let paper-name = config.at("page", default: (:)).at("paper", default: "a2")
#let flipped    = config.at("page", default: (:)).at("flipped", default: true)

//#set box(stroke: red)

/*
 * SCALE FACTOR
 *
 * All absolute sizes below (row-height, column widths, font sizes, logo
 * sizes) are tuned for an a2 sheet in landscape (flipped). If the paper
 * size changes, `scale` grows/shrinks proportionally and every size in
 * the document is multiplied by it, so fonts/images/spacing stay
 * consistent relative to the page instead of staying fixed in pt.
 */

#let paper-dims-portrait = (
    "a0": (841mm, 1189mm),
    "a1": (594mm, 841mm),
    "a2": (420mm, 594mm),
    "a3": (297mm, 420mm),
    "a4": (210mm, 297mm),
)

#let ref-width = 594mm // design reference: a2, flipped, width

#let page-width = {
    let dims = paper-dims-portrait.at(paper-name)
    if flipped { dims.at(1) } else { dims.at(0) }
}

#let scale = page-width / ref-width

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
 * DIMENSIONS (all scaled)
 */

#let row-height = 24pt * scale
#let col-wd     = 22pt * scale   // weekday letter column
#let col-date   = 22pt * scale   // day number column

// Font sizes (all scaled)
#let fs-body   = 9pt * scale
#let fs-cell   = 16pt * scale
#let fs-cell2   = 12pt * scale
#let fs-title  = 32pt * scale
#let fs-org    = 14pt * scale
#let fs-desc   = 12pt * scale
#let fs-contact = 10pt * scale

// Logo sizes (all scaled, always square)
#let logo-size-event  = row-height - 4pt
#let logo-size-footer = 86pt * scale
#let logo-size-org    = 48pt * scale

/*
 * SQUARE LOGO HELPER
 *
 * Wraps an image in a fixed-size square box and uses fit: "contain" so
 * the image is scaled to fit inside without distortion, regardless of
 * its native aspect ratio. This is what keeps logo spacing consistent.
 */

#let square-logo(path, size) = box(
    width: size,
    height: size,
    clip: true,
    align(center + horizon, image(path, width: 100%, height: 100%, fit: "contain"))
)

/*
 * CELL
 */

#let cell(content, fill: white-fill, content-align: center, col-width: row-height) = block(
    fill: fill,
    width: col-width,
    height: row-height,
    clip: true,
    inset: (x: 2pt * scale, y: 2pt * scale),
    stroke: grid-stroke,
    align(content-align, content)
)


/*
 * SINGLE MONTH BLOCK
 */

/*
 * EVENT RENDERING
 *
 * Row height stays perfectly fixed (row-height) for every day. Long
 * titles are handled by clipping + repositioning instead of letting them
 * overflow:
 *   - single-line titles stay vertically centered, matching the icon
 *   - titles that wrap are top-aligned, then hard-clipped if they still
 *     don't fit -- nothing ever spills into the row above/below
 *
 * Icon + title use a nested 2-column grid (icon-width, 1fr) so Typst
 * sizes the title column itself -- no manual width arithmetic, which is
 * what caused layout corruption in an earlier attempt (a hand-computed
 * width can drift from the real column width and corrupt the whole grid).
 * Multiple events on one day (max ~2 in practice) get an equal-width
 * nested grid column each.
 */

#let event-one(ev, interior-height) = grid(
    columns: (logo-size-event, 1fr),
    column-gutter: 2pt * scale,
    align: horizon,
    square-logo(assets-path + ev.logo, logo-size-event),
    layout(size => context {
        let single-h = measure(text(size: fs-cell, "Ag")).height
        let par-body = {
            set par(leading: 2pt * scale)
            text(size: fs-cell, ev.title)
        }
        let full-h = measure(block(width: size.width, par-body)).height
        let wrapped = full-h > single-h * 1.3
        box(
            width: 100%,
            height: interior-height,
            clip: true,
            align(if wrapped { top } else { horizon }, par-body)
        )
    })
)

#let event-content(evs, interior-height) = {
    if evs.len() == 0 { return }
    grid(
        columns: (1fr,) * evs.len(),
        column-gutter: 6pt * scale,
        ..evs.map(ev => event-one(ev, interior-height))
    )
}

#let render-month(y, m) = {
    let days  = days-in-month(y, m)
    let start = first-weekday(y, m)
    let inset-y = 2pt * scale
    let interior-height = row-height - 2 * inset-y

    let day-data = range(1, days + 1).map(d => {
        let wd = calc.rem(start + d - 2, 7) + 1
        (
            wd: wd, d: d,
            fill: if is-weekend(wd) { weekend-fill } else { white-fill },
            evs: events-on(iso-date(y, m, d)),
        )
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
                inset: (x: 4pt * scale, y: 4pt * scale),
                stroke: grid-stroke,
                spacing: 0pt,
                align(center + horizon)[#text(size: fs-title, weight: "bold", month-name(m))]
            )
            // Day rows
            grid(
                columns: (col-wd, col-date, 1fr),
                rows: (row-height,) * days,
                align: (col, row) => if col == 2 { left + horizon } else { center + horizon },
                inset: (x: 2pt * scale, y: inset-y),
                stroke: grid-stroke,
                fill: (col, row) => day-data.at(row).fill,
                ..day-data.map(dd => (
                    text(size: fs-cell, weekday-letter(dd.wd)),
                    text(size: fs-cell, str(dd.d)),
                    event-content(dd.evs, interior-height),
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
        inset: 4pt * scale,
        width: 100%,
        height: 100%,
        fill: white-fill,
        //stroke: grid-stroke,
        {
            align(center + horizon, {
              square-logo(assets-path + org.logo, logo-size-footer)
              v(2pt * scale)
              if org.name != "" {
                  text(size: fs-org, weight: "bold", org.name)
                  linebreak()
              }
              if org.description != "" {
                  text(size: fs-desc, org.description)
                  linebreak()
              }
              text(size: fs-contact, style: "italic", org.contact)
            })
        }
    )
}


#let cool_cell2(org) = {
  align(horizon + center)[#grid(columns: 3, //stroke: green,
        align(left + horizon)[#square-logo(assets-path + org.logo, logo-size-org)],
        h(2pt * scale),
        align(left + horizon, {
              if org.name != "" {
                  text(size: fs-org, weight: "bold", org.name)
                  linebreak()
              }
              if org.description != "" {
                  text(size: fs-desc, org.description)
                  linebreak()
              }
              text(size: fs-contact, style: "italic", org.contact)
          })
        )]
}

#let render-footer(all_stuff: org-rows) = {
    grid(
        columns: (1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
        rows: (100pt * scale, 100pt * scale),
        column-gutter: 0pt,
        //stroke: grid-stroke,
        grid.cell(
            rowspan: 2,
            cool_cell(all_stuff.at(0))
        ),
        grid.cell(colspan: 3, rowspan: 2,
            grid(
              columns: (1fr, 1fr, 1fr),
              rows: (100pt * scale),
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
    paper: paper-name,
    flipped: flipped,
    margin: 12mm,
    //background: rect(width: 100%, height: 100%, fill: luma(255))
)

#set text(font: "Roboto", size: fs-body)

// Month grid — divide page width across all months
#grid(
    columns: months.map(_ => 1fr),
    column-gutter: 5pt * scale,
    ..months.map(m => render-month(year, m))
)

#v(3pt * scale)
#render-footer()

