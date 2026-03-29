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

function animateCount(el, target, duration = 1500) {
  const start = 0;
  const range = target - start;
  const startTime = performance.now();

  function step(now) {
    const elapsed = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + range * elapsed);
    el.innerText = value.toLocaleString();

    if (elapsed < 1) {
      requestAnimationFrame(step);
    } else {
      el.innerText = target.toLocaleString();
    }
  }

  requestAnimationFrame(step);
}

function initCountups() {
  document.querySelectorAll('.countup').forEach(el => {
    const target = Number(el.dataset.target || el.innerText.replace(/,/g, ''));
    if (!isNaN(target)) {
      el.innerText = '0';
      animateCount(el, target);
    }
  });
}

async function getYouTubeStats() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const stats = data.items[0].statistics;

    const subEl = document.getElementById('sub-count');
    const viewEl = document.getElementById('view-count');

    if (subEl) {
      subEl.innerText = Number(stats.subscriberCount).toLocaleString();
    }

    if (viewEl) {
      viewEl.innerText = Number(stats.viewCount).toLocaleString();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getYouTubeStats();
setInterval(getYouTubeStats, 900000);

// run the countup class animation once on page load
window.addEventListener('DOMContentLoaded', initCountups); 

// experience
const container = document.getElementById('scrollContainer');
const cards = document.querySelectorAll(".card");
const details = document.querySelectorAll(".detail");

function scrollToCard(card) {
  const containerCenter = container.offsetWidth / 2;
  const cardCenter = card.offsetLeft + card.offsetWidth / 2;
  const scrollPosition = cardCenter - containerCenter;
  container.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  });
}
function getActiveCardIndex() {
  const containerCenter = container.scrollLeft + container.offsetWidth / 2;
  let closestIndex = 0;
  let closestDistance = Infinity;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(containerCenter - cardCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}
function scrollCarouselLeft() {
  let currentIndex = getActiveCardIndex();
  if (currentIndex > 0) {
    scrollToCard(cards[currentIndex - 1]);
  }
}
function scrollCarouselRight() {
  let currentIndex = getActiveCardIndex();
  if (currentIndex < cards.length - 1) {
    scrollToCard(cards[currentIndex + 1]);
  }
}
cards.forEach(card => {
  card.addEventListener("click", () => {
    scrollToCard(card);
  });
});
function updateActiveCard() {
  const currentIndex = getActiveCardIndex();
  cards.forEach((card, index) => {
    card.classList.toggle('active', index === currentIndex);
  });
}
container.addEventListener("scroll", () => {
  requestAnimationFrame(updateActiveCard);
});
updateActiveCard();

cards.forEach(card => {
  card.addEventListener("click", () => {
    card.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  });
});

function updateText() {
  const containerCenter =
    container.scrollLeft + container.offsetWidth / 2;
  let closestCard = null;
  let closestDistance = Infinity;

  cards.forEach(card => {
    const cardCenter =
    card.offsetLeft + card.offsetWidth / 2;

    const distance = Math.abs(containerCenter - cardCenter);

    if (distance < closestDistance) {
    closestDistance = distance;
    closestCard = card;
    }
  });
    if (!closestCard) return;
    const id = closestCard.dataset.id;
    details.forEach(d => d.style.display = "none");
    const active = document.getElementById(id);
    if (active) active.style.display = "block";
    cards.forEach(c => c.classList.remove("active"));
    closestCard.classList.add("active");
}

container.addEventListener("scroll", () => {
  requestAnimationFrame(updateText);
});

updateText();

const scrollText = document.querySelector('.scroll-text');
const text = scrollText.querySelector('p');

function updateScroll() {
  const containerWidth = scrollText.offsetWidth;
  text.style.setProperty('--container-width', containerWidth + 'px');
}

updateScroll();

window.addEventListener('resize', updateScroll);

//autoscroll
let autoScrollInterval;
let isVisible = false;
let restartTimeout;

function startAutoScroll() {
  if (!isVisible) return; 

  stopAutoScroll(); 
  autoScrollInterval = setInterval(() => {
    let currentIndex = getActiveCardIndex();

    if (currentIndex < cards.length - 1) {
      scrollToCard(cards[currentIndex + 1]);
    } else {
      scrollToCard(cards[0]);
    }
  }, 2500);
}
function stopAutoScroll() {
  clearInterval(autoScrollInterval);
}
function restartAutoScrollWithDelay(delay = 4000) {
  clearTimeout(restartTimeout);
  restartTimeout = setTimeout(() => {
    startAutoScroll();
  }, delay);
}
const experienceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      isVisible = true;
      startAutoScroll();
    } else {
      isVisible = false;
      stopAutoScroll();
    }
  });
}, {
  threshold: 0.5
});
experienceObserver.observe(container);
startAutoScroll();

const sectionContainer = document.querySelector("#experience"); 
sectionContainer.addEventListener("mouseenter", () => stopAutoScroll());
sectionContainer.addEventListener("mouseleave", () => restartAutoScrollWithDelay(1000));
sectionContainer.addEventListener("touchstart", stopAutoScroll);
sectionContainer.addEventListener("touchend", () => restartAutoScrollWithDelay(1000));

cards.forEach(card => {
  card.addEventListener("click", () => {
    stopAutoScroll();
    scrollToCard(card);
    startAutoScroll();
  });
});
cards.forEach(card => {
  card.addEventListener("click", () => {
    stopAutoScroll();
    scrollToCard(card);
    restartAutoScrollWithDelay();
  });
});


// Music
const iframes = document.querySelectorAll('.spotify iframe');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.2
});

iframes.forEach(iframe => {
    observer.observe(iframe);
});

// Skill 
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.animationPlayState = 'paused';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.animationPlayState = 'running';
  });
});

// Blur-on-enter behavior for headings and paragraphs
const blurTargets = document.querySelectorAll('h1, p');
const blurObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.2 });

blurTargets.forEach(el => {
  blurObserver.observe(el);
});