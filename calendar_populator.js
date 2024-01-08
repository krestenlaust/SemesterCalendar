const events = {
    "2024-02-14": [{name: "Valentine's Day"}],
    "2024-03-15": [{name: "F-dag", logo: "initiv.svg"}],
    "2024-04-05": [{name: "F-easter", logo: "initiv.svg"}],
    "2024-02-10": [{name: "Kalender deadline"}],
    "2024-03-10": [{name: "Event 1"}, {name: "Event 2"}],
}

const startMonth = 1; // February, 0-indexed.
const year = 2024;

/**
 * 
 * @param {HTMLTableElement} table_element
 */
function populate_calendar(table_element) {
    // Generate days in table

    for (let i = 1; i <= 31; i++) {
        table_element.appendChild(generate_table_row(i))
    }
}

/**
 * 
 * @param {Number} dayIndex Index starting at 1.
 * @returns {HTMLTableRowElement}
 */
function generate_table_row(dayIndex) {
    const tablerowelem = document.createElement("tr");

    for (let i = 0; i < 5; i++) {
        const tabledataelem = document.createElement("td");
        const currentDate = new Date(year, startMonth + i, dayIndex);
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
    const weekday_index = currentDate.getDay();
    weekdayelem.innerText = get_weekday_symbol(weekday_index);
    weekdayelem.classList.add("day-weekday");

    if (is_weekend(weekday_index)) {
        tableelem.classList.add("day-weekend");
    }

    tableelem.appendChild(weekdayelem);

    const daynumberelem = document.createElement("td");
    daynumberelem.innerText = currentDate.getDate();
    daynumberelem.className = "day-daynumber";
    tableelem.appendChild(daynumberelem);

    // Add events
    const descelem = document.createElement("td");
    const eventsForDay = get_day_events(currentDate);
    eventsForDay.forEach(event => {
        const eventelem = document.createElement("span");
        eventelem.innerText = event.name;
        descelem.appendChild(eventelem);
    });
    tableelem.appendChild(descelem);

    return tableelem;
}

/**
 * 
 * @param {Date} date The date of the event.
 * @returns {Array}
 */
function get_day_events(date) {
    const key = date.toISOString().substring(0, 10);
    return events[key] || [];
}

/**
 * 
 * @param {Number} dayIndex Zero-indexed.
 * @returns {String} Symbol representing the weekday.
 */
function get_weekday_symbol(dayIndex) {
    const weekdays = ["S", "M", "T", "O", "T", "F", "L"];
    return weekdays[dayIndex];
}

/**
 * 
 * @param {Number} dayIndex Zero-indexed. 
 * @returns {Boolean} Whether the day is part of the weekend.
 */
function is_weekend(dayIndex) {
    return dayIndex == 0 || dayIndex == 6;
}

populate_calendar(calendar)