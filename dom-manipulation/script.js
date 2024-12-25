// Existing quotes or fetched from localStorage
const quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The journey of a thousand miles begins with a single step.", category: "Motivation" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.createElement('select');
categoryFilter.id = 'categoryFilter';

function populateCategories() {
    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Get unique categories
    const categories = [...new Set(quotes.map(q => q.category))];
    
    // Populate dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category from localStorage
    const lastFilter = localStorage.getItem('lastSelectedCategory');
    if (lastFilter) {
        categoryFilter.value = lastFilter;
    }
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;

    // Save the selected category to localStorage
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    // Filter quotes
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    // Show a random quote from the filtered list
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];

        quoteDisplay.innerHTML = `
            <p id="quoteText">"${randomQuote.text}"</p>
            <p id="quoteCategory">— Category: ${randomQuote.category}</p>
        `;
    } else {
        quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    }
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
        <p id="quoteText">"${randomQuote.text}"</p>
        <p id="quoteCategory">— Category: ${randomQuote.category}</p>
    `;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addQuoteBtn = document.createElement('button');
    addQuoteBtn.id = 'addQuoteBtn';
    addQuoteBtn.textContent = 'Add Quote';

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addQuoteBtn);

    document.body.appendChild(formContainer);

    addQuoteBtn.addEventListener('click', addQuote);
}

function addQuote() {
    const quoteInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const quote = quoteInput.value.trim();
    const category = categoryInput.value.trim();

    if (quote === '' || category === '') {
        alert('Please enter both a quote and a category.');
        return;
    }

    quotes.push({ text: quote, category: category });
    saveQuotes();

    quoteInput.value = '';
    categoryInput.value = '';

    alert('New quote added successfully!');

    populateCategories(); // Update the categories dropdown
    filterQuotes();
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Initial setup
newQuoteBtn.addEventListener('click', filterQuotes);

document.addEventListener('DOMContentLoaded', () => {
    // Create the filter dropdown
    document.body.insertBefore(categoryFilter, quoteDisplay);
    categoryFilter.addEventListener('change', filterQuotes);

    // Populate categories and show the initial quote
    populateCategories();
    filterQuotes();

    createAddQuoteForm();
});
