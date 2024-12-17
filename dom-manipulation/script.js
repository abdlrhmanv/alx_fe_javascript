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

function ShowRandomQuote () {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
         <p id="quoteText">"${randomQuote.text}"</p>
         <p id="quoteCategory'>— Category: ${randomQuote.category}</p>
    `;
}

function addQuote () {
    const quote = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (quote === '' || category === '') {
        alert('Please enter both a quote and a category.');
        return;
    }

    quotes.push({text: quote, category: category });

    newQuoteText.value = '';
    newQuoteCategory.value = '';

    alert('New quote added successfully!');

    ShowRandomQuote ();
}

newQuoteBtn.addEventListener('click', ShowRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

document.addEventListener('DOMContentLoaded', ShowRandomQuote);