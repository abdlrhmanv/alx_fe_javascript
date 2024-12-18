const quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The journey of a thousand miles begins with a single step.", category: "Motivation" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

function showRandomQuote () {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
         <p id="quoteText">"${randomQuote.text}"</p>
         <p id="quoteCategory'>— Category: ${randomQuote.category}</p>
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

    const quote = quoteInput.value.trim();
    const category = categoryInput.value.trim();

    if (quote === '' || category === '') {
        alert('Please enter both a quote and a category.');
        return;
    }

    quotes.push({text: quote, category: category });
    saveQuotes();

    quoteInput.value = '';
    categoryInput.value = '';

    alert('New quote added successfully!');

    showRandomQuote ();
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}


function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.hres = url;
    link.download = 'quotes.json';
    link.click();

    URL.revokeObjectURL(url);
}

function importFromJsonFile(event){
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            showRandomQuote();
        } catch (error) {
            alert('Invalid JSON file format. ');
        }
    };
    fileReader.readAsText(event.target.files[0]);
};

newQuoteBtn.addEventListener('click', showRandomQuote);
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote();
    createAddQuoteForm();

    const exportBtn =document.createElement('button');
    exportBtn.textContent = 'Export Quotes';
    exportBtn.addEventListener('click', exportQuotes);

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.id = 'importFile';
    importInput.accept = '.json';
    importInput.addEventListener('change', importFromJsonFile);

    document.body.appendChild(exportBtn);
    document.body.appendChild(importInput);

    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const parsedQuote = JSON.parse(lastViewedQuote);
        quoteDisplay.innerHTML = `
             <p id="quoteText">"${parsedQuote.text}"</p>
             <p id="quoteCategory">— Category: ${parsedQuote.category}</p>
        `;
    }
});