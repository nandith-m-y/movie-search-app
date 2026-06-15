const apiKey = "2c380c17";

const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const movieContainer = document.getElementById("movieContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const welcome = document.getElementById("welcome");
const themeToggle = document.getElementById("themeToggle");
const recentSearches = document.getElementById("recentSearches");
const favoritesContainer = document.getElementById("favorites");
const statsContainer = document.getElementById("stats");
const suggestions = document.getElementById("suggestions");

movieInput.focus();

loadTheme();
loadRecentSearches();
loadFavorites();
updateStats();

let currentMovie = null;

async function searchMovie(movie = null) {

    const movieName = movie || movieInput.value.trim();

    if (!movieName) {
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

        currentMovie = data;

        saveRecentSearch(movieName);
        increaseSearchCount();

        movieContainer.innerHTML = `
        <div class="movie-card">

            <img src="${
                data.Poster !== "N/A"
                    ? data.Poster
                    : "https://via.placeholder.com/300x450"
            }">

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

                <button class="favorite-btn"
                    onclick="addToFavorites('${data.Title}')">
                    ⭐ Add to Favorites
                </button>

                <button class="copy-btn"
                    onclick="copyMovieDetails()">
                    📋 Copy Details
                </button>

                <button class="download-btn"
                    onclick="downloadMovieDetails()">
                    ⬇ Download Details
                </button>

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

    if (!searches.length) {

        recentSearches.innerHTML = `
            <h3>Recent Searches</h3>
            <p>No recent searches.</p>
        `;

        return;
    }

    recentSearches.innerHTML = `
        <h3>
            Recent Searches
            <button onclick="clearRecentSearches()">
                Clear All
            </button>
        </h3>

        ${searches.map(movie => `
            <div style="margin:5px;">
                <button onclick="searchMovie('${movie}')">
                    ${movie}
                </button>

                <button onclick="removeRecentSearch('${movie}')">
                    ❌
                </button>
            </div>
        `).join("")}
    `;
}
function clearRecentSearches() {

    localStorage.removeItem("recentMovies");

    loadRecentSearches();
}
function removeRecentSearch(movie) {

    let searches =
        JSON.parse(localStorage.getItem("recentMovies")) || [];

    searches = searches.filter(
        item => item !== movie
    );

    localStorage.setItem(
        "recentMovies",
        JSON.stringify(searches)
    );

    loadRecentSearches();
}

function addToFavorites(movie) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(movie)) {

        favorites.push(movie);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        loadFavorites();
        updateStats();
    }
}

function loadFavorites() {

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.length) {

        favoritesContainer.innerHTML = `
            <h3>⭐ Favorites</h3>
            <p>No favorite movies yet.</p>
        `;

        return;
    }

    favoritesContainer.innerHTML = `
        <h3>
            ⭐ Favorites
            <button onclick="clearFavorites()">
                Clear All
            </button>
        </h3>

        ${favorites.map(movie => `
            <div style="margin:5px;">
                <button onclick="searchMovie('${movie}')">
                    ${movie}
                </button>

                <button onclick="removeFavorite('${movie}')">
                    🗑️
                </button>
            </div>
        `).join("")}
    `;
}
function clearFavorites() {

    localStorage.removeItem("favorites");

    loadFavorites();
    updateStats();
}
function removeFavorite(movie) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favorites = favorites.filter(
        item => item !== movie
    );

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadFavorites();
    updateStats();
}

function increaseSearchCount() {

    let count =
        Number(localStorage.getItem("searchCount")) || 0;

    count++;

    localStorage.setItem("searchCount", count);

    updateStats();
}

function updateStats() {

    const count =
        Number(localStorage.getItem("searchCount")) || 0;

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    statsContainer.innerHTML = `
        <p>🔍 Total Searches: ${count}</p>
        <p>⭐ Favorite Movies: ${favorites.length}</p>
    `;
}

function copyMovieDetails() {

    if (!currentMovie) return;

    const text = `
Movie: ${currentMovie.Title}
Year: ${currentMovie.Year}
IMDb: ${currentMovie.imdbRating}
Genre: ${currentMovie.Genre}
Director: ${currentMovie.Director}
Actors: ${currentMovie.Actors}
Plot: ${currentMovie.Plot}
`;

    navigator.clipboard.writeText(text);

    alert("Movie details copied!");
}

function downloadMovieDetails() {

    if (!currentMovie) return;

    const text = `
Movie: ${currentMovie.Title}
Year: ${currentMovie.Year}
IMDb: ${currentMovie.imdbRating}
Genre: ${currentMovie.Genre}
Director: ${currentMovie.Director}
Actors: ${currentMovie.Actors}
Plot: ${currentMovie.Plot}
`;

    const blob =
        new Blob([text], { type: "text/plain" });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = `${currentMovie.Title}.txt`;

    a.click();
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        localStorage.setItem("theme", "light");
        themeToggle.textContent = "☀️";

    } else {

        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "🌙";

    }
});

function loadTheme() {

    const theme =
        localStorage.getItem("theme");

    if (theme === "light") {

        document.body.classList.add("light");
        themeToggle.textContent = "☀️";

    } else {

        themeToggle.textContent = "🌙";

    }
}

searchBtn.addEventListener("click", () => {
    searchMovie();
});

movieInput.addEventListener("keypress", e => {

    if (e.key === "Enter") {
        searchMovie();
    }

});

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key === "k") {

        e.preventDefault();
        movieInput.focus();

    }

    if (e.key === "Escape") {

        movieInput.value = "";

    }

});

movieInput.addEventListener("input", async () => {

    const query = movieInput.value.trim();

    if (query.length < 3) {

        suggestions.innerHTML = "";
        return;

    }

    const response = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
    );

    const data = await response.json();

    if (!data.Search) {

        suggestions.innerHTML = "";
        return;

    }

    suggestions.innerHTML = data.Search
        .slice(0, 5)
        .map(
            movie =>
                `<li onclick="selectSuggestion('${movie.Title}')">
                    ${movie.Title}
                </li>`
        )
        .join("");
});

function selectSuggestion(title) {

    movieInput.value = title;
    suggestions.innerHTML = "";

    searchMovie(title);
}