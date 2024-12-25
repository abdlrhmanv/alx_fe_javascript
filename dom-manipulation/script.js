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
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastFilter = localStorage.getItem('lastSelectedCategory');
    if (lastFilter) {
        categoryFilter.value = lastFilter;
    }
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

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

async function addQuoteToServer(newQuote) {
    const serverQuotesUrl = 'https://jsonplaceholder.typicode.com/posts';

    try {
        const response = await fetch(serverQuotesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuote)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Success:', data);
        alert('Quote added to server (mock).');

        quotes.push(newQuote); // Update local quotes after successful mock server add
        saveQuotes();
        populateCategories();
        filterQuotes();

    } catch (error) {
        console.error('Error adding quote to server:', error);
        alert('Error adding quote to server.');
    }
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

    const newQuote = { text: quote, category: category, userId: 1 };
    addQuoteToServer(newQuote);

    quoteInput.value = '';
    categoryInput.value = '';
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

async function fetchQuotesFromServer() {
    const serverQuotesUrl = 'https://jsonplaceholder.typicode.com/posts';

    try {
        const response = await fetch(serverQuotesUrl);
        const serverQuotes = await response.json();

        const serverData = serverQuotes.map(item => ({ text: item.title, category: "Server" }));

        const mergedQuotes = [...serverData, ...quotes.filter(localQuote => !serverData.some(serverQuote => serverQuote.text === localQuote.text))];

        quotes.length = 0;
        quotes.push(...mergedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();

        alert('Data synced with server successfully.');
    } catch (error) {
        console.error('Error syncing with server:', error);
    }
}

newQuoteBtn.addEventListener('click', filterQuotes);

const syncBtn = document.createElement('button');
syncBtn.id = 'syncBtn';
syncBtn.textContent = 'Sync with Server';
syncBtn.addEventListener('click', fetchQuotesFromServer);

document.addEventListener('DOMContentLoaded', async () => {
    document.body.insertBefore(categoryFilter, quoteDisplay);
    categoryFilter.addEventListener('change', filterQuotes);

    populateCategories();
    filterQuotes();
    createAddQuoteForm();
    document.body.appendChild(syncBtn);

    await fetchQuotesFromServer(); // Fetch on initial load
});