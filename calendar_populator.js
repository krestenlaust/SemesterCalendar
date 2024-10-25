const eventlist = {
    "2024-02-01": [{name: "=Semesterstart="}],
    "2024-03-22": [{name: "F-dag", logo: "initiv.svg"}],
    "2024-02-02": [{name: "Tour de Fredagsbar m. Topholt", logo: "flogo.svg"}],
    "2024-02-16": [{name: "Foobar m. Norlys Energy Trading", logo: "flogo.svg"}],
    "2024-02-21": [{name: "Brætspilsaften m. Prosa", logo: "adsl.png"}],
    "2024-03-20": [{name: "Brætspilsaften m. IT-day", logo: "adsl.png"}],
    "2024-04-17": [{name: "Brætspilsaften", logo: "adsl.png"}],

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
};
const year = 2024;
const months = [2,3,4,5,6];
const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

const main = document.getElementsByTagName('main')[0];
for (month of months) {
    const monthElem = document.createElement('article');
    monthElem.classList.add('month');
    const day = new Date(year, month-1, 1);
    const lastdate = new Date(year, month, 0);
    const heading = document.createElement('h3');
    heading.innerText = day.toLocaleDateString('da-DK', { month: 'long' });
    monthElem.append(heading);

    while (day <= lastdate) {
        const weekday = document.createElement('p');
        weekday.innerText = day.toLocaleDateString('da-DK', { weekday: 'long' }).charAt(0);

        const date = document.createElement('p');
        date.innerText = day.getDate();

        const events = document.createElement('section');
        events.innerText = ` `;

        if (isWeekend(day)) {
            weekday.classList.add('weekend');
            date.classList.add('weekend');
            events.classList.add('weekend');
        }
        populate(day, events);
        monthElem.append(weekday, date, events);
        day.setDate(day.getDate() + 1);
    }
    main.appendChild(monthElem);
}

function isWeekend(day) {
    if ([0, 6].includes(day.getDay())) {
        return true;
    }
    return false;
}

function populate(day, elem) {
    const dayKey = day.toLocaleDateString('en-CA', options);
    if (eventlist[dayKey]) {
        eventlist[dayKey].forEach(activity => {
            console.log(activity.name);
            const activityItem = document.createElement('p');
            activityItem.innerText = activity.name;
            if (activity.logo) {
                const logo = document.createElement('img');
                logo.src = `/assets/${activity.logo}`;
                elem.appendChild(logo);
            }
            elem.appendChild(activityItem);
        });
    }
}   