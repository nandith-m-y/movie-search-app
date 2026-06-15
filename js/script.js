const apiKey = "2c380c17";

const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const movieContainer = document.getElementById("movieContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const welcome = document.getElementById("welcome");
const themeToggle = document.getElementById("themeToggle");
const recentSearches = document.getElementById("recentSearches");

movieInput.focus();

loadTheme();
loadRecentSearches();

async function searchMovie(movie = null) {
    const movieName = movie || movieInput.value.trim();

    if (movieName === "") {
        alert("Please enter a movie name");
        return;
    }

    movieContainer.innerHTML = "";
    errorMessage.classList.add("hidden");
    welcome.classList.add("hidden");
    loading.classList.remove("hidden");

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&t=${movieName}`
        );

        const data = await response.json();

        loading.classList.add("hidden");

        if (data.Response === "False") {
            errorMessage.classList.remove("hidden");
            return;
        }

        saveRecentSearch(movieName);

        movieContainer.innerHTML = `
            <div class="movie-card">

                <img 
                    src="${data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300x450"}" 
                    alt="${data.Title}"
                >

                <div class="movie-info">

                    <h2>${data.Title}</h2>

                    <div class="rating">
                        ⭐ IMDb ${data.imdbRating}
                    </div>

                    <p><strong>📅 Year:</strong> ${data.Year}</p>

                    <p><strong>🎭 Genre:</strong> ${data.Genre}</p>

                    <p><strong>⏱ Runtime:</strong> ${data.Runtime}</p>

                    <p><strong>🎬 Director:</strong> ${data.Director}</p>

                    <p><strong>👨‍🎤 Actors:</strong> ${data.Actors}</p>

                    <p><strong>🌍 Language:</strong> ${data.Language}</p>

                    <p><strong>🏳 Country:</strong> ${data.Country}</p>

                    <p><strong>🏆 Awards:</strong> ${data.Awards}</p>

                    <p><strong>💰 Box Office:</strong> ${data.BoxOffice}</p>

                    <p><strong>📝 Plot:</strong></p>

                    <p>${data.Plot}</p>

                </div>

            </div>
        `;
    } catch (error) {
        loading.classList.add("hidden");
        errorMessage.classList.remove("hidden");
    }
}

function saveRecentSearch(movie) {

    let searches =
        JSON.parse(localStorage.getItem("recentMovies")) || [];

    searches = searches.filter(
        item => item.toLowerCase() !== movie.toLowerCase()
    );

    searches.unshift(movie);

    searches = searches.slice(0, 5);

    localStorage.setItem(
        "recentMovies",
        JSON.stringify(searches)
    );

    loadRecentSearches();
}

function loadRecentSearches() {

    const searches =
        JSON.parse(localStorage.getItem("recentMovies")) || [];

    if (searches.length === 0) {
        recentSearches.innerHTML = "";
        return;
    }

    recentSearches.innerHTML = `
        <h3>Recent Searches</h3>
        ${searches
            .map(
                movie =>
                    `<button onclick="searchMovie('${movie}')">${movie}</button>`
            )
            .join("")}
    `;
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
    } else {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
    }
});

function loadTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "light") {
        document.body.classList.add("light");
        themeToggle.textContent = "🌙";
    } else {
        themeToggle.textContent = "☀️";
    }
}

searchBtn.addEventListener("click", () => {
    searchMovie();
});

movieInput.addEventListener("keypress", event => {

    if (event.key === "Enter") {
        searchMovie();
    }
});