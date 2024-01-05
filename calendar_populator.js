const events = {
    "2024-02-14": ["Valentine's Day"],
    "2024-03-01": ["Event 1", "Event 2"],
}

const year = 2024;

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
 * @param {Number} day
 * @returns {HTMLTableRowElement}
 */
function generate_table_row(day) {
    const tablerowelem = document.createElement("tr");

    for (let i = 0; i < 5; i++) {
        const tabledataelem = document.createElement("td");
        const currentDate = new Date(year, 1 + i, day); // Assuming February as the start month (index 1)
        tabledataelem.appendChild(generate_table_cell(currentDate));
        tablerowelem.appendChild(tabledataelem);
    }

    return tablerowelem;
}

/**
 * 
 * @param {Date} currentDate
 * @returns {HTMLTableElement}
 */
function generate_table_cell(currentDate) {
    const tableelem = document.createElement("table");
    tableelem.className = "day";

    const weekdayelem = document.createElement("td");
    weekdayelem.innerText = getWeekday(currentDate.getDay());
    weekdayelem.className = "day-weekday";
    tableelem.appendChild(weekdayelem);

    const daynumberelem = document.createElement("td");
    daynumberelem.innerText = currentDate.getDate();
    daynumberelem.className = "day-daynumber";
    tableelem.appendChild(daynumberelem);

    // Add events
    const descelem = document.createElement("td");
    const eventsForDay = get_day_events(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
    eventsForDay.forEach(event => {
        const eventelem = document.createElement("div");
        eventelem.innerText = event;
        descelem.appendChild(eventelem);
    });
    tableelem.appendChild(descelem);

    return tableelem;
}

/**
 * 
 * @param {Number} day One-indexed day.
 * @param {Number} month Zero-indexed month.
 * @param {Number} year Four-digit year.
 * @returns {Array}
 */
function get_day_events(day, month, year) {
    const key = `${year}-${month + 1}-${day}`; // Months are zero-indexed in JavaScript
    return events[key] || [];
}

/**
 * 
 * @param {Number} dayIndex
 * @returns {String} Weekday name
 */
function getWeekday(dayIndex) {
    const weekdays = ["S", "M", "T", "O", "T", "F", "L"];
    return weekdays[dayIndex];
}

populate_calendar(calendar)