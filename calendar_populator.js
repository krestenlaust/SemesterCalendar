const eventlist = {
    "2024-09-02": [{name: "=Semesterstart="}],
    "2024-10-30": [{name: "Brætspilsaften", logo: "adsl.png"}],
    "2024-11-27": [{name: "Brætspilsaften med Prosa", logo: "adsl.png"}],
    "2024-10-02": [{name: "Brætspilsaften med Prosa", logo: "adsl.png"}],
    "2024-10-23": [{name: "Generalforsamling 2024", logo: "adsl.png"}],


    "2024-09-12": [{name: "Filmafstemning", logo: "fkult.webp"}],
    "2024-09-13": [{name: "Foobar m. Medlemsindmelding", logo: "flogo.svg"}],

    "2024-09-19": [{name: "Syretrip på begge sider af Stillehavet", logo: "fkult.webp"}],
    "2024-09-20": [{name: "Generalforsamling 2024", logo: "flogo.svg"}],
    "2024-09-27": [{name: "Foobar m. Coolshop", logo: "flogo.svg"}],
    
    "2024-10-10": [{name: "Giorgios Favoritter", logo: "fkult.webp"}],
    "2024-10-11": [{name: "Farcrawl m. Topholt", logo: "flogo.svg"}],

    "2024-10-17": [{name: "Klassikkere som ingen af jer har set", logo: "fkult.webp"}],
    "2024-10-18": [{name: "Fyttetur 2024", logo: "flogo.svg"}],
    "2024-10-19": [{name: "Fyttetur 2024", logo: "flogo.svg"}],
    "2024-10-20": [{name: "Fyttetur 2024", logo: "flogo.svg"}],
    "2024-10-21": [{name: "Fyttetur 2024", logo: "flogo.svg"}],

    "2024-10-24": [{name: "Facking v6", logo: "fit.svg"}],
    "2024-10-25": [{name: "FLAN 10946.0", logo: "flan.webp"}],
    "2024-10-26": [{name: "FLAN 10946.0", logo: "flan.webp"}],
    "2024-10-27": [{name: "FLAN 10946.0", logo: "flan.webp"}],

    "2024-10-31": [{name: "2000s summed up <3", logo: "fkult.webp"}],
    "2024-11-01": [{name: "Fnugfald", logo: "flogo.svg"}],

    "2024-11-06": [{name: "Åben TREO-forsamling", logo: "flogo.svg"}],
    "2024-11-08": [{name: "F-dag", logo: "initiv.svg"}],

    "2024-11-09": [{name: "", logo: "de-klubben.png"}],
    // CreateJam
    "2024-11-08": [{name: "Create Jam Fall 2024", logo: "createjam.png"}],
    "2024-11-09": [{name: "DE-Klubben 25 års jubilæum / Create Jam Fall 2024", logo: ""}],
    "2024-11-10": [{name: "Create Jam Fall 2024", logo: "createjam.png"}],

    "2024-11-13": [{name: "Foret øver julesange", logo: "flogo.svg"}],
    "2024-11-14": [{name: "The Building", logo: "fkult.webp"}],
    "2024-11-15": [{name: "BIT LAN", logo: "bitlan2024.png"}],
    "2024-11-16": [{name: "BIT LAN", logo: "bitlan2024.png"}],
    "2024-11-17": [{name: "BIT LAN", logo: "bitlan2024.png"}],

    "2024-11-22": [{name: "Fjulestue", logo: "initiv.svg"}],
    "2024-11-28": [{name: "Over the top action comedy", logo: "fkult.webp"}],
    "2024-12-06": [{name: "Fjulefrokost", logo: "initiv.svg"}],
    "2024-12-12": [{name: "Julefilm", logo: "fkult.webp"}],

    "2024-12-20": [{name: "=Projektafleverings deadline="}],
};
const year = 2024;
const months = [9,10,11,12,1];
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
                logo.src = `assets/${activity.logo}`;
                elem.appendChild(logo);
            }
            elem.appendChild(activityItem);
        });
    }
}   