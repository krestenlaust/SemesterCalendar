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
 * @returns {HTMLTableElement}
 */
function generate_table_cell(weekday, day, events){
    const tableelem = document.createElement("table");
    tableelem.className = "day";
    
    const weekdayelem = document.createElement("td");
    weekdayelem.innerText = weekday
    weekdayelem.className = "day-weekday";
    tableelem.appendChild(weekdayelem);

    const daynumberelem = document.createElement("td");
    daynumberelem.innerText = day;
    daynumberelem.className = "day-daynumber";
    tableelem.appendChild(daynumberelem);

    // Add events as well.
    const descelem = document.createElement("td");
    tableelem.appendChild(descelem);

    return tableelem;
}

populate_calendar(calendar)