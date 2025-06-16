document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const vehiclesGrid = document.getElementById("vehiclesGrid");
    const vehicleCards = vehiclesGrid.getElementsByClassName("vehicle-card");

    function filterVehicles() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;

        Array.from(vehicleCards).forEach(card => {
            const name = card.querySelector(".vehicle-name").textContent.toLowerCase();
            const category = card.getAttribute("data-category");
            const price = card.getAttribute("data-price");

            const matchesSearch = name.includes(searchTerm) || searchTerm === "";
            const matchesCategory = selectedCategory === "all" || selectedCategory === category;
            const matchesPrice = selectedPrice === "all" || selectedPrice === price;

            card.style.display = (matchesSearch && matchesCategory && matchesPrice) ? "" : "none";
        });
    }

    searchInput.addEventListener("input", filterVehicles);
    categoryFilter.addEventListener("change", filterVehicles);
    priceFilter.addEventListener("change", filterVehicles);

    const viewButtons = document.querySelectorAll('.view-details');
    const modal = document.getElementById('vehicleModal');
    const closeModal = document.getElementById('closeModal');
    const modalSlideshow = document.getElementById('modalSlideshow');
    const modalDots = document.getElementById('modalDots');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');

    let currentSlideIndex = 0;
    let currentSlides = [];

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.vehicle-card');
            const name = card.getAttribute('data-name');
            const price = card.querySelector('p').textContent;
            const description = card.getAttribute('data-description');

            // For slideshow: array of images separated by commas in data-img
            const images = card.getAttribute('data-img').split(',');

            currentSlides = images;
            currentSlideIndex = 0;

            renderSlideshow();
            renderDots();

            modalTitle.textContent = name;
            modalPrice.textContent = price;
            modalDescription.textContent = description;

            modal.style.display = 'flex';
        });
    });

    function renderSlideshow() {
        modalSlideshow.innerHTML = `
            <img src="${currentSlides[currentSlideIndex]}" alt="Vehicle Image" />
            <button class="prev-btn">&#10094;</button>
            <button class="next-btn">&#10095;</button>
        `;
        updateDots();

        modalSlideshow.querySelector('.prev-btn').onclick = () => {
            currentSlideIndex = (currentSlideIndex - 1 + currentSlides.length) % currentSlides.length;
            renderSlideshow();
        };
        modalSlideshow.querySelector('.next-btn').onclick = () => {
            currentSlideIndex = (currentSlideIndex + 1) % currentSlides.length;
            renderSlideshow();
        };
    }

    function renderDots() {
        modalDots.innerHTML = '';
        currentSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === currentSlideIndex) dot.classList.add('active');
            dot.onclick = () => {
                currentSlideIndex = index;
                renderSlideshow();
            };
            modalDots.appendChild(dot);
        });
    }

    function updateDots() {
        const dots = modalDots.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('active');
        }
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // ✅ Hero Slide Show (optional, for homepage)
    const slides = document.querySelectorAll('#heroSection .slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) {
        showSlide(currentSlide);
        setInterval(nextSlide, 4000);
    }
});

const form = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(form);

    // Basic frontend validation
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();

    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    // Send form to Formspree
    fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                successModal.style.display = 'flex';
                form.reset();
            } else {
                alert('There was a problem sending your message. Please try again.');
            }
        })
        .catch(() => {
            alert('Failed to connect to the server. Please try again later.');
        });
});

function closeModal() {
    successModal.style.display = 'none';
}