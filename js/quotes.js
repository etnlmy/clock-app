const API_URL = "https://api.quotable.io/random";
const ROTATING = "rotating";
const HIDDEN = "hidden";

async function fetchRandomQuote() {
  const response = await fetch(API_URL);
  console.log(response);
  if (!response.ok) throw new Error('Something went wrong');
  const data = await response.json();
  return {
    quote: data.content,
    author: data.author
  };
}

function quotes({
  refreshButton,
  quoteElement,
  authorElement,
  errorElement
}) {

  const displayQuote = (data) => {
    quoteElement.textContent = `“${data.quote}”`;
    authorElement.textContent = data.author;
    refreshButton.classList.remove(ROTATING);
    refreshButton.disabled = false;
  }

  const displayError = (error) => {
    errorElement.textContent = error;
    errorElement.classList.remove(HIDDEN);
    refreshButton.classList.remove(ROTATING);
    refreshButton.disabled = false;
  }

  refreshButton.addEventListener("click", () => {
    errorElement.classList.add(HIDDEN);
    refreshButton.classList.add(ROTATING);
    refreshButton.disabled = true;
    fetchRandomQuote()
      .then(data => displayQuote(data))
      .catch(error => displayError(error));
  });

  fetchRandomQuote()
    .then(data => displayQuote(data))
    .catch(error => displayError(error));
}

quotes({
  refreshButton: document.querySelector("button.refresh"),
  quoteElement: document.getElementsByTagName("cite")[0],
  authorElement: document.getElementsByTagName("small")[0],
  errorElement: document.querySelector("p.error")
});