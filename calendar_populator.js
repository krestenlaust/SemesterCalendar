const calendar = {
    
}

function populate_calendar(table_element) {
    // Generate days in table

}

/**
 *
 * @param day One-indexed day.
 * @param month Zero-indexed month.
 * @param year One-indexed year (i think).
 */
function get_day_events(day, month, year){
    let firstDay = new Date(year, month, day)


}

function generate_table_row(){

}

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

populate_calendar(document.getElementById("calendar"))