<template>
    <section class="hero-split">
        <!-- LEFT: Text panel -->
        <div class="hero-split__text">
            <h1>Croatia Air-Quality WebGIS</h1>
            <p>
                This project integrates high-resolution CAMS pollutant reanalysis (NO₂, PM₂.₅, PM₁₀)
                with ESA CCI land-cover (2013–2022) and population grids to analyze exposure patterns
                across Croatia. We produce monthly maps for December 2022, annual averages for 2022,
                and “annual average difference” maps relative to the 2017–2021 mean.
            </p>
            <router-link to="/results" class="btn btn-outline-light btn-lg rounded-pill">
                Get Started
            </router-link>
        </div>

        <!-- RIGHT: Full-cover image panel -->
        <div class="hero-split__image"></div>
    </section>
</template>

<script setup>
// (no JS needed here)
</script>

<style scoped>
.hero-split {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 1200px;
    margin: 3rem auto;
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.1);
    min-height: 70vh;
}

/* Left panel */
.hero-split__text {
    flex: 1;
    background: linear-gradient(135deg, #1864ab, #4dabf7);
    color: white;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.hero-split__text h1 {
    font-size: 2.75rem;
    margin-bottom: 1rem;
}

.hero-split__text p {
    font-size: 1.125rem;
    margin-bottom: 2rem;
}

/* Style the “Get Started” button */
.hero-split__text .btn {
    border: 2px solid rgba(255, 255, 255, 0.8);
    color: rgba(255, 255, 255, 0.9);
    padding: 0.75rem 2rem;
    font-size: 1.125rem;
    transition: background 0.3s, color 0.3s;
}

.hero-split__text .btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
}

/* Right panel: background image */
.hero-split__image {
    flex: 1;
    background: url('https://wallpapercave.com/wp/wp12394005.jpg') no-repeat center center;
    background-size: cover;
}

/* Responsive: stack text only on small screens */
@media (max-width: 768px) {
    .hero-split {
        flex-direction: column;
        min-height: 50vh;
    }

    .hero-split__image {
        display: none;
    }

    .hero-split__text {
        padding: 2rem;
        text-align: center;
    }
}
</style>