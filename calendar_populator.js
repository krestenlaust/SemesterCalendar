const events = {
    
}

/**
 * 
 * @param {HTMLTableElement} table_element
 */
function populate_calendar(table_element) {
    // Generate days in table

    for (let i = 1; i <= 30; i++) {
        table_element.appendChild(generate_table_row(i))        
    }
}

/**
 *
 * @param {Number} day One-indexed day.
 * @param {Number} month Zero-indexed month.
 * @param {Number} year One-indexed year (i think).
 */
function get_day_events(day, month, year){
    let firstDay = new Date(year, month, day)


}

/**
 * 
 * @param {Number} day
 * @returns {HTMLTableRowElement}
 */
function generate_table_row(day){
    const tablerowelem = document.createElement("tr");

    for (let i = 0; i < 5; i++) {
        const tabledataelem = document.createElement("td");
        tabledataelem.appendChild(generate_table_cell("F", day, []));
        tablerowelem.appendChild(tabledataelem);
    }

    return tablerowelem;
}

/**
 * 
 * @param {String} weekday
 * @param {Number} day
 * @param {Array} events
 * @returns {HTMLDivElement}
 */
function generate_table_cell(weekday, day, events){
    const celldiv = document.createElement("div");
    celldiv.className = "day";

    const weekdayelem = document.createElement("span");
    weekdayelem.innerText = weekday
    celldiv.appendChild(weekdayelem);

    const daynumberelem = document.createElement("span");
    daynumberelem.innerText = day;
    celldiv.appendChild(daynumberelem);

    // Add events as well.

    return celldiv;
}

populate_calendar(calendar)