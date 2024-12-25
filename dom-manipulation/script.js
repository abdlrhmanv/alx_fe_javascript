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
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newQuote)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        newQuote.id = data.id;
        console.log('Success:', data);
        alert('Quote added to server (mock).');

        quotes.push(newQuote);
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

async function syncQuotes() {
    try {
        let syncedCount = 0;
        let conflictCount = 0;

        for (const quote of quotes) {
            if (!quote.id) {
                try {
                    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(quote)
                    });
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                    }
                    const data = await response.json();
                    quote.id = data.id;
                    console.log('Quote synced:', data);
                    syncedCount++;
                } catch (error) {
                    console.error("Error syncing a quote: ", error);
                    conflictCount++;
                }
            }
        }

        saveQuotes();

        let message = "";
        if (syncedCount > 0) {
            message += `Successfully synced ${syncedCount} quote${syncedCount > 1 ? 's' : ''}. `;
        }
        if (conflictCount > 0) {
            message += `Encountered ${conflictCount} conflict${conflictCount > 1 ? 's' : ''} during sync. Check the console for details.`;
        }
        if (syncedCount === 0 && conflictCount === 0) {
            message = "No new quotes to sync."
        }
        alert(message);
    } catch (error) {
        console.error('Error during sync:', error);
        alert('Error during sync. Check the console for details.');
    }
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await response.json();

        const serverData = serverQuotes.map(item => ({ text: item.title, category: "Server", id: item.id }));

        const mergedQuotes = [...serverData, ...quotes.filter(localQuote => !serverData.some(serverQuote => serverQuote.text === localQuote.text))];

        quotes.length = 0;
        quotes.push(...mergedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();

        alert('Data fetched from server successfully.');
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

const syncInterval = 5000;
let syncIntervalId;

function startSyncInterval() {
    if (!syncIntervalId) {
        syncIntervalId = setInterval(syncQuotes, syncInterval);
        console.log("Sync interval started.");
    }
}

function stopSyncInterval() {
    if (syncIntervalId) {
        clearInterval(syncIntervalId);
        syncIntervalId = null;
        console.log("Sync interval stopped.");
    }
}

newQuoteBtn.addEventListener('click', filterQuotes);

const syncBtn = document.createElement('button');
syncBtn.id = 'syncBtn';
syncBtn.textContent = 'Sync Now';
syncBtn.addEventListener('click', syncQuotes);

const toggleSyncBtn = document.createElement('button');
toggleSyncBtn.id = 'toggleSyncBtn';
toggleSyncBtn.textContent = 'Start Auto Sync';
toggleSyncBtn.addEventListener('click', () => {
    if (syncIntervalId) {
        stopSyncInterval();
        toggleSyncBtn.textContent = 'Start Auto Sync';
    } else {
        startSyncInterval();
        toggleSyncBtn.textContent = 'Stop Auto Sync';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    document.body.insertBefore(categoryFilter, quoteDisplay);
    categoryFilter.addEventListener('change', filterQuotes);

    populateCategories();
    filterQuotes();
    createAddQuoteForm();
    document.body.appendChild(syncBtn);
    document.body.appendChild(toggleSyncBtn);

    await fetchQuotesFromServer();
    startSyncInterval();
});