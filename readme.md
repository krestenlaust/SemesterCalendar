# Semaster Calendar

## Build typst

Fill/change `config.toml` with year and months defining the semester

Fill/change `events.csv` with the events of the semester

Fill/change `orgs.csv` with the differnect orgs and stuff (be wary, as the template might need to be fiddled with then!)

Download the Roboto font: `wget "https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-Regular.ttf"`

Compile the document (it is A5!): `typst c main.typ --font-path .`