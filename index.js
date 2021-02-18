
const input = document.querySelector('.input');
const form = document.querySelector('.form');
const autocompleteBox = document.querySelector('.autocompleteBox');
const resultBox = document.querySelector('.resultBox');


autocompleteBox.classList.add('autocompleteBox');
resultBox.classList.add('resultBox');

let searchRepositoriesDelay = debounce(searchRepositories, 1200);

input.addEventListener('input', searchRepositoriesDelay);

function searchRepositories(event) {

  const value = event.target.value;
  getPepositories(value);

}

async function getPepositories(name) {

  if (name === '') {
    autocompleteBox.innerHTML = '';
    return
  }

  const URL = `https://api.github.com/search/repositories?q=${name}`;

  const response = await fetch(URL);

  const data = await response.json();

  let result

  if (data.items.length > 5) {
    result = data.items.slice(0, 5)
  } else {
    result = data.items
  }

  renderAutoComplete(result)

}

function renderAutoComplete(result) {

  autocompleteBox.innerHTML = '';
  result.forEach( item => {
    const div = document.createElement('div');
    div.classList.add('autocompleteBox-item')
    div.addEventListener('click', () => addRepository(item))
    div.innerText = item.name;
    autocompleteBox.appendChild(div);
  })

  input.insertAdjacentHTML('beforeend', autocompleteBox)

}

let resultItems = [];

function addRepository(repo) {

  resultItems.push(repo)

  autocompleteBox.innerHTML = '';

  renderResultList(resultItems)

}

function deleteRepositoty(item) {

  resultItems = resultItems.filter(repo => repo.id !== item.id)
  renderResultList(resultItems)
}

function renderResultList(list) {

  resultBox.innerHTML = '';

  list.forEach( item => {
    const newElem = document.createElement('div');
    newElem.innerHTML = `
      <p>name: ${item.name}</p>
      <p>owner: ${item.owner.login}</p>
      <p>stars: ${item.stargazers_count}</p>
      <i class="fas fa-trash-alt"></i>
    `
    newElem.classList.add('result-item');

    newElem.addEventListener('click', (e) => {
      if (e.target.tagName === 'I') {
        deleteRepositoty(item)
      }
    })

    resultBox.appendChild(newElem)

  })
}


function debounce(fn, ms) {

  let timeOut

  return function() {

    const callFn = () => {
      fn.apply(this, arguments)
    }

    clearTimeout(timeOut)

    timeOut = setTimeout(callFn, ms)

  }
}
