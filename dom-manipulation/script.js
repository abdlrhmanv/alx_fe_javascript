const quotes = [
    { text: "The journey of a thousand miles begins with a single step.", category: "Motivation" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
];

const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory =document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

function showRandomQuote () {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
         <p id="quoteText">"${randomQuote.text}"</p>
         <p id="quoteCategory'>— Category: ${randomQuote.category}</p>
    `;
}

function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id ='newQuoteCategory';
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

function addQuote () {
    const quoteInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCtegory');

    const quote = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (quote === '' || category === '') {
        alert('Please enter both a quote and a category.');
        return;
    }

    quotes.push({text: quote, category: category });

    quoteInput.value = '';
    categoryInput.value = '';

    alert('New quote added successfully!');

    showRandomQuote ();
}

newQuoteBtn.addEventListener('click', showRandomQuote);
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote();
    createAddQuoteForm();
});