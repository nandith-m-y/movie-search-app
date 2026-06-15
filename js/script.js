const apiKey = "2c380c17";

const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const movieContainer = document.getElementById("movieContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const welcome = document.getElementById("welcome");

async function searchMovie() {
    const movieName = movieInput.value.trim();

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

        movieContainer.innerHTML = `
            <div class="movie-card">
                <img src="${data.Poster}" alt="${data.Title}">
                
                <div class="movie-info">
                    <h2>${data.Title}</h2>

                    <p><strong>Year:</strong> ${data.Year}</p>

                    <p><strong>IMDb Rating:</strong> ${data.imdbRating}</p>

                    <p><strong>Genre:</strong> ${data.Genre}</p>

                    <p><strong>Plot:</strong> ${data.Plot}</p>
                </div>
            </div>
        `;
    } catch (error) {
        loading.classList.add("hidden");
        errorMessage.classList.remove("hidden");
    }
}

searchBtn.addEventListener("click", searchMovie);

movieInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchMovie();
    }
});