const form = document.getElementById("form");
const result = document.getElementById("result");
const characters = document.getElementById("characters");
const searchAnimeInput = document.querySelector("#searchAnime");
const searchMangaInput = document.querySelector("#searchManga");
const getAnimeRecommendationsInput = document.querySelector("#getAnime");
const getMangaRecommendationsInput = document.querySelector("#getManga");
const spinner = document.querySelector(".loader");
const notFound = document.querySelector(".not-found");

const apiUrl = "https://myanimelist.p.rapidapi.com";

let typingTimer;

const typingDelay = 500;

const API_KEY = "YOUR_API_KEY";

const getRecommendations = async (type) => {
  result.innerHTML = "";
  characters.innerHTML = "";
  spinner.style.display = "block";
  const rawData = await fetch(
    `${apiUrl}/${type}/recommendations/1?rapidapi-key=${API_KEY}`
  );
  const data = await rawData.json();
  console.log("animeRecommendations here...", data);
  displayRecommendations(data.recommendations);
};

const search = async (type, query) => {
  spinner.style.display = "block";
  result.innerHTML = "";
  characters.innerHTML = "";
  const encodedQuery = encodeURIComponent(query);
  const rawData = await fetch(
    `${apiUrl}/${type}/search/${encodedQuery}?rapidapi-key=${API_KEY}`
  );
  const actualData = await rawData.json();
  const id = actualData[0].myanimelist_id;
  const animeRawData = await fetch(
    `${apiUrl}/${type}/${id}?rapidapi-key=${API_KEY}`
  );
  const dataToDisplay = await animeRawData.json();
  displayData(dataToDisplay);
};

const displayData = (actualData) => {
  const stringToTest = actualData.data;
  if (stringToTest && /^no anime found/.test(stringToTest)) {
    spinner.style.display = "none";
    notFound.style.display = "block";
  } else {
    notFound.style.display = "none";
    let output = "";
    let characterOutput = ``;

    output += `
          <div class="series ui-card">
              <div class="title">
                  <h1>${actualData.title_ov}</h1>
              </div>
              <div class="series-picture">
                <img class="anime-img" src="${actualData.picture_url}"/>
              </div>
              <div class="text">
                <p>
                    ${actualData.synopsis}
                </p>
              </div>
              
          </div>
          <h1 class="center">Characters:</h1>
      
      `;

    actualData.characters.map((c) => {
      characterOutput += `
        <div class="character ui-card">
  
              <div class="character-title">
                  <h2>${c.name}</h2>
              </div>
             
              <div class="small-picture">
                <img class="anime-img" src="${c.picture_url}"/>
              </div>

              <div class="character-title">
                <h2>V/A: ${c.voice_actor_name}</h2>
              </div>
            
              <div class="small-picture">
                <img class="anime-img" src="${c.voice_actor_picture_url}"/>
              </div>

              <div class="character-link">
                <a href="${c.voice_actor_myanimelist_url}" target="_blank">Voice Actor Page</a>
              </div>
          </div>
        `;
    });

    spinner.style.display = "none";
    result.innerHTML = output;
    characters.innerHTML = characterOutput;
  }
};

const displayRecommendations = (data) => {
  notFound.style.display = "none";
  let output = "";

  data.map((i) => {
    output += `
     
    <div class="recommendation ui-card">
        <div class="recommendation-title">
            <h1>${i.recommendation.title}</h1>
        </div>
        <div class="recommendation-picture">
        <img class="anime-img" src="${i.recommendation.picture_url}"/>
        </div>
        <div class="recommendation-description">
        <p>
            ${i.description}
        </p>
        <div>
          <h5>Author: ${i.author.name}</h5>
        </div>
        <div class="series-link">
          <a href="${i.author.url}" target="_blank">Author Page</a>
        </div>
        </div>
        
    </div>`;
  });

  spinner.style.display = "none";

  result.innerHTML = output;
};

searchAnimeInput.addEventListener("input", (e) => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => search("anime", e.target.value), typingDelay);
});

searchMangaInput.addEventListener("input", (e) => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => search("manga", e.target.value), typingDelay);
});

getAnimeRecommendationsInput.addEventListener("click", () => {
  getRecommendations("anime");
});

getMangaRecommendationsInput.addEventListener("click", () => {
  getRecommendations("manga");
});
