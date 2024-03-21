const events = {
    "2024-02-01": [{name: "=Semesterstart="}],
    "2024-03-22": [{name: "F-dag", logo: "initiv.svg"}],
    "2024-02-02": [{name: "Tour de Fredagsbar m. Topholt", logo: "flogo.svg"}],
    "2024-02-16": [{name: "Foobar m. Norlys Energy Trading", logo: "flogo.svg"}],
    "2024-02-21": [{name: "‎ Brætspilsaften m. Prosa", logo: "adsl.png"}],
    "2024-03-20": [{name: "‎ Brætspilsaften m. IT-day", logo: "adsl.png"}],
    "2024-04-17": [{name: "‎ Brætspilsaften", logo: "adsl.png"}],

    "2024-02-29": [{name: "Facking v5.0: Må den bedste editor VIMme", logo: "fit.svg"}],
    "2024-04-11": [{name: "Facking v5.5: Standard Issue", logo: "fit.svg"}],
    "2024-03-18": [{name: "=Kalenderen er opdateret="}],
    "2024-04-22": [{name: "=Kalenderen opdateres="}],
    "2024-02-26": [{name: "LaTeX kursus med Victor", logo: "fadase.jpg"}],
    "2024-03-27": [{name: "AI og Graph databaser med supercomputere", logo: "asck.png"}],
    "2024-04-10": [{name: "ConnectIT - Messe"}],

    "2024-04-27": [{name: "Tema-fest", logo: "fixd.png"}],
    "2024-02-08": [{name: "Filmafstemning", logo: "fkult.webp"}],
    "2024-02-22": [{name: "Dice 'n Drinks", logo: "fixd.png"}, {name: "Hüttels favoritter", logo: "fkult.webp"}],
    "2024-03-07": [{name: "Badaptations 2: Mediocre Boogaloo", logo: "fkult.webp"}],
    "2024-03-21": [{name: "Donanering og dets konsekvenser", logo: "fkult.webp"}],
    "2024-04-04": [{name: "Star Wars maraton, men Google har oversat den for mange gange", logo: "fkult.webp"}],
    "2024-04-18": [{name: "Tim Currys campy syretrip i en spooky villa", logo: "fkult.webp"}],
    "2024-05-02": [{name: "Weird indie gysere som indeholder virkelig mange mænd som laver...", logo: "fkult.webp"}],
    "2024-05-16": [{name: "Retro-resurrektion og rollespil romantik", logo: "fkult.webp"}],

    "2024-04-26": [{name: "Feaster", logo: "initiv.svg"}],
    "2024-04-12": [{name: "FLAN 6765.0", logo: "flan.webp"}],
    "2024-04-13": [{name: "FLAN 6765.0", logo: "flan.webp"}],
    "2024-04-14": [{name: "FLAN 6765.0", logo: "flan.webp"}],

    "2024-03-29": [{name: "Create Jam Spring 2024", logo: "createjam.png"}],
    "2024-03-30": [{name: "Create Jam Spring 2024", logo: "createjam.png"}],
    "2024-03-31": [{name: "Create Jam Spring 2024", logo: "createjam.png"}],

    "2024-04-19": [{name: "Datalogi/DVML Hyttetur"}],
    "2024-04-20": [{name: "Datalogi/DVML Hyttetur"}],
    "2024-04-21": [{name: "Datalogi/DVML Hyttetur"}],

    "2024-05-03": [{name: "F-sportsdag", logo: "initiv.svg"}],
    "2024-05-29": [{name: "Projektafleverings deadline"}],
    "2024-05-31": [{name: "Universitetsfesten 2024 - 50 års jubilæum"}]
}

const resource_root = "resources/";

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
        // If the date isn't correct, it's because it's wrapped into the next month.
        if (currentDate.getDate() == dayIndex) {
            tabledataelem.appendChild(generate_table_cell(currentDate));
        }

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
    const date_elem = document.createElement("td");
    date_elem.classList.add("day-events");

    const eventsForDay = get_day_events(currentDate);
    eventsForDay.forEach(event => {
        const event_elem = document.createElement("div");
        event_elem.classList.add("subclub-event");

        if (event.hasOwnProperty("logo")){
            const logo_elem = document.createElement("img");
            logo_elem.classList.add("subclub-logo-img");
            logo_elem.src = resource_root.split("/").concat(event.logo).join("/");
            event_elem.appendChild(logo_elem);
        }

        const desc_elem = document.createElement("span");
        desc_elem.innerText = event.name;
        event_elem.appendChild(desc_elem);

        date_elem.appendChild(event_elem);
    });
    tableelem.appendChild(date_elem);

    return tableelem;
}

/**
 * 
 * @param {Date} date The date of the event.
 * @returns {Array}
 */
function get_day_events(date) {
    date.setDate(date.getDate() + 1); // Add one to the date because there's an off-by-one error somewhere.
    const key = get_iso_date(date);
    return events[key] || [];
}

/**
 * @param {Date} date
 * @returns {String} ISO-formatted date.
 */
function get_iso_date(date) {
    return date.toISOString().substring(0, 10);
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