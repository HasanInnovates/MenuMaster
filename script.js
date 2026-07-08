// === Cart ===
let cart = JSON.parse(localStorage.getItem('menuCart') || '[]');
const cartBadge = document.getElementById('cartBadge');

function saveCart() {
    localStorage.setItem('menuCart', JSON.stringify(cart));
}

function updateCart() {
    saveCart();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalItems;
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.menu-item, .offer-item');
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);

        const prep = parseInt(card.dataset.prepTime) || 15;
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, qty: 1, prep });
        }

        updateCart();

        const icon = btn.querySelector('i');
        icon.className = 'fas fa-check';
        btn.style.background = '#28a745';
        btn.style.color = '#fff';

        setTimeout(() => {
            icon.className = 'fas fa-plus';
            btn.style.background = '';
            btn.style.color = '';
        }, 1500);
    });
});

// === Category Filter ===
const categoryBtns = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');
const subCategoryContainer = document.getElementById('subCategoryContainer');
let activeSubCategory = 'all';

const subCategories = {
    appetizers: ['all', 'hot', 'cold', 'fried'],
    main: ['all', 'pizza', 'burgers', 'seafood', 'pasta'],
    desserts: ['all', 'cakes', 'icecream', 'pastries'],
    beverages: ['all', 'hot', 'cold', 'juices'],
    salads: ['all', 'green', 'pasta', 'dressings']
};

function buildSubCategoryBtns(category) {
    const subs = subCategories[category];
    if (!subs) return;
    subCategoryContainer.innerHTML = '';
    subCategoryContainer.style.display = 'flex';
    subs.forEach(sub => {
        const btn = document.createElement('button');
        btn.className = 'category-btn sub-category-btn' + (sub === 'all' ? ' active' : '');
        btn.dataset.subcategory = sub;
        btn.textContent = sub === 'all' ? 'All' : sub.charAt(0).toUpperCase() + sub.slice(1);
        subCategoryContainer.appendChild(btn);
    });
}

function filterItems(category, subcategory) {
    menuItems.forEach(item => {
        const matchCategory = category === 'all' || item.dataset.category === category;
        const matchSub = subcategory === 'all' || item.dataset.subcategory === subcategory;
        if (matchCategory && matchSub) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.4s ease';
        } else {
            item.style.display = 'none';
        }
    });
}

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.category;
        activeSubCategory = 'all';
        if (category === 'all') {
            subCategoryContainer.style.display = 'none';
            subCategoryContainer.innerHTML = '';
            filterItems('all', 'all');
        } else {
            buildSubCategoryBtns(category);
            filterItems(category, 'all');
        }
    });
});

updateCart();

subCategoryContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.sub-category-btn');
    if (!btn) return;
    document.querySelectorAll('.sub-category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    activeSubCategory = btn.dataset.subcategory;
    filterItems(activeCategory, activeSubCategory);
});
