//header 
const header = document.getElementById("site-header");

let lastScroll = 0;

window.addEventListener("scroll", () => {

  const currentScroll = window.scrollY;

  // shrink effect
  if (currentScroll > 50) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }

  // hide when scrolling down
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScroll = currentScroll;
});

//Youtube Stats
const API_KEY = 'AIzaSyB8aWHdunckaXNz56Nmf22E6SB8-TT3I6g';
const CHANNEL_ID = 'UCc-BkhwXuODwaeGVaBQVJww';
const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;

async function getYouTubeStats() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const stats = data.items[0].statistics;

    document.getElementById('sub-count').innerText = stats.subscriberCount;
    document.getElementById('view-count').innerText = stats.viewCount;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getYouTubeStats();
setInterval(getYouTubeStats, 900000); 

// scroller
const container = document.getElementById('scrollContainer');

function scrollCarouselLeft() {
  container.scrollBy({ left: -300, behavior: 'smooth' });
}

function scrollCarouselRight() {
  container.scrollBy({ left: 300, behavior: 'smooth' });
}

const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.addEventListener("click", () => {
    card.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  });
});
