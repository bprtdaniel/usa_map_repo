
## Access the Story [Here](https://bprtdaniel.github.io/data_dark_money/)
19/05/2026

# Why the Story of U.S. Territorial Evolution is too often told as an American Adventure

This project presents a non-exhaustive map of pivotal moments in Native American land loss. The story argues that U.S. westward expansion is too often told as an American adventure, neglecting the magnitude of suffering it has inflicted on the native population.
It uses a single HTML to guide readers through the changing landscape of native and US territory.
The backend data was compiled with 2 main datasets: 1) A GIS-based account of most recordings of native american land cessions. 2) Shapefiles of the expansion of American territory towards the west.
Using the timestamps, I isolated 11 major steps in the history of this development and created an overlapping map that shows central moments and explains why some of the American stories lack objectivity.

Through a process of combining the base GIS maps, historical research and additional JSON data sources, such as expeditions and trails, the map presents an overview of the developments abd challenges the US centric view.


The Indian Land Removal and Cessions Dataset was accessed from [Here](https://www.arcgis.com/home/item.html?id=bc9ff78c9d1d440892fe72cd0d110296), and was published by Professor Claudio Saunt, University of Georgia. The [Newberry Library](https://publications.newberry.org/ahcb/downloads/index.html) was used to obtain the US map data

## Project Structure

```text
.
├── README.md
├── pre_processing.ipynb
└── scrolly
    ├── index.html
    ├── script.js
    ├── style.css
    └── data

ChatGPTwas used to create the JS neccesary to support the HTML. In addition AI supported the CSS section. All writing, ideation, concept and styling was not supported by AI.
No agentic tools were used.
