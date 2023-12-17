const events = {
    
}

/**
 * 
 * @param {HTMLTableElement} table_element
 */
function populate_calendar(table_element) {
    // Generate days in table

    table_element.appendChild(generate_table_row())
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
 * @returns {HTMLTableRowElement}
 */
function generate_table_row(){
    const tablerowelem = document.createElement("tr");

    const tabledataelem = document.createElement("td");
    tabledataelem.appendChild(generate_table_cell("F", 1, []));
    tablerowelem.appendChild(tabledataelem);

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