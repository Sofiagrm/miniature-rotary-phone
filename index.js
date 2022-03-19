//Quando o documento html está todo carregado a chama a função de javascript "Init"
document.addEventListener('DOMContentLoaded', init, false);

// Cada linha do json, vai representar cada filme
let elements = new Array();

// Filme a mostrar em grande
let moviePosition = 0;

// Guarda o identificador do filme que está a ser editado
let editMovieId = null;

let stageImage = document.querySelector('#fullScreenImageContainer img.fullScreen'); 

const pictures = new Map();

/*
//representa uma imagem e os seus dados
function Picture(id, image, author, type, location, category, year, score) {
  this.id = id;
  this.image = image;
  this.author = author;
  this.type = type;
  this.location = location;
  this.category = category;
  this.year = year;
  this.score = score;
}
*/

function init() {
  // Ler o conteudo do ficheiro data.json que se encontra no servidor ghibliapi.herokuapp.com 
  fetch('https://ghibliapi.herokuapp.com/films/')
    // Interpretar como se fosse json
    .then(response => response.json())
    // Quando acabar de ler o ficheiro faz:
    .then(jsonContent => {
      // percorrer os elementos do json
      jsonContent.map(a => {
        // prencher o array elements com cada elemento do json
        elements.push(a);
      });

      //Mostra os elementos
      initFilter(elements);
      prepareFilters(elements);

      //adicionar src para imagem na montra ao carregar a pagina no inicio
  });

  initButtonLeft();
  initButtonRight();

  // Chamar do função da meteorologia 
  setWeather();
  // Quando se escreve no filtro chama a função onChangeFilter
  document.getElementById('searchInput').addEventListener("input", onChangeFilter);
}

function initFilter(filter)
{
  showElements(filter);

  initStage(filter);
}

function initStage(elements)
{
  //adicionar src para imagem na montra ao carregar a pagina no inicio
  stageImage.src = elements[0].image;
  //ir a buscar o container da full screen image e appen child serve para adicionar conteudo a esse container
  document.getElementById('fullScreenImageContainer').appendChild(stageImage);
  // vamos buscar a tag correspondente ao tumbnail do filme atraves do id
  document.getElementById(elements[0].id).getElementsByClassName('thumbnail')[0].classList.add('color');
  document.getElementById(elements[0].id).scrollIntoView();
}


function initButtonLeft()
{
  document.querySelector(".button-left").addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    let currentColor = document.getElementsByClassName('color')[0];

    if(currentColor.parentElement.previousElementSibling != null){
      let previousColor = currentColor.parentElement.previousElementSibling.childNodes[0];

      stageImage.addEventListener('animationstart', (e) => {
        stageImage.src = previousColor.src;
      });

      stageImage.addEventListener('animationend', (e) => {
          stageImage.classList.remove('scaleIn');
          previousColor.parentElement.scrollIntoView();
      });
      
      stageImage.classList.add('scaleIn');
      currentColor.classList.remove('color');
      previousColor.classList.add('color');
    }
  });
}

function initButtonRight()
{
  document.querySelector(".button-right").addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    let currentColor = document.getElementsByClassName('color')[0];

    if(currentColor.parentElement.nextElementSibling != null){
      let nextColor = currentColor.parentElement.nextElementSibling.childNodes[0];

      stageImage.addEventListener('animationstart', (e) => {
        stageImage.src = nextColor.src;
      });

      stageImage.addEventListener('animationend', (e) => {
          stageImage.classList.remove('scaleIn');
          nextColor.parentElement.scrollIntoView();
      });

      stageImage.classList.add('scaleIn');
      currentColor.classList.remove('color');
      nextColor.classList.add('color');
    }
  });
}

function showElements(filterElements) {
  document.getElementById('thumbnailListContainer').innerHTML = "";
  // vai buscar o texto do search.
    let searchTxt = document.getElementById('searchInput').value;  
  // filtra o array de elementos pelo texto do search. 
    filterElements = filterElements.filter(element => (element.title.search(searchTxt) > -1));
  // Ler o conteudo do ficheiro data.json que se encontra no servidor ghibliapi.herokuapp.com 
  

  filterElements.map((element) => {
    // Criar um div para cada elemento do json
    let div = document.createElement("div");
    // atribui o identificador do filme ao div
    div.id = element.id;
    
    // Criar uma imagem e os butões de delete e edit dentro do div 
    //adicionar class e scr da imagem
    let img = new Image();
    img.src = element.image;
    img.className = 'thumbnail';

    img.addEventListener("click",  (e) =>  {
      e.stopImmediatePropagation();
      document.querySelector('img.fullScreen').src = element.image;
      document.querySelector("img.thumbnail.color").classList.remove('color');
      document.getElementById(element.id).getElementsByClassName('thumbnail')[0].classList.add('color');
      document.getElementById(element.id).scrollIntoView();
    });

    //por dentro da div thumbnailContainer a imagem
    div.appendChild(img);

    let iconDelete = document.createElement('i');
    iconDelete.className = "bi bi-trash icon-delete";

    let iconEdit = document.createElement('i');
    iconEdit.className = "bi bi-pencil-square icon-edit";

    div.appendChild(iconDelete);
    div.appendChild(iconEdit);

    // Adicionar a div thumbnailContainer a div thumbnailListContainer
    document.getElementById('thumbnailListContainer').appendChild(div);
  });
}


function prepareFilters(filterElements)
{
  document.getElementById('Hayao Miyazaki').addEventListener('click', () => {
    yearElements = filterElements.filter(element => (element.director === "Hayao Miyazaki"));
    console.log(yearElements);
    initFilter(yearElements)
  });

  document.getElementById('Isao Takahata').addEventListener('click', () => {
    yearElements = filterElements.filter(element => (element.director === "Isao Takahata"));
    console.log(yearElements);
    initFilter(yearElements)
  });
}

function setWeather() {
  // Ir a buscar a localização, verifica se o browser tem a capacidade
  if (navigator.geolocation) {
    // chama a função da localização
    navigator.geolocation.getCurrentPosition(showWeather);
  }
}

function showWeather(position) {
  // chamar a Api da metrologia
  fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=71b9a61410dcd5284934b2e4d6ba141b&units=metric")
    // Interpretar como se fosse json
    .then(response => response.json())
    // Quando acabar de ler o ficheiro faz:
    .then(jsonContent => {
      // atribui o nome da localidade e a temperatura ao elemento weather
      document.getElementById('weather').innerHTML = jsonContent.name + " " + jsonContent.main.temp + 'ºC';
    });
}

function onChangeFilter(e) {
  // vai buscar o texto do search atraves do atributo value
  let searchTxt = document.getElementById('searchInput').value;
  // filtra o array de elementos pelo texto do search. 
  let filterElements = elements.filter(element => (element.title.search(searchTxt) > -1));
  showElements(filterElements);
}


function deleteElement(evt) {
  // ir buscar o identificador do filme, que se encontra 2 divs acima
  let id = evt.currentTarget.parentNode.parentNode.getAttribute("id");
   // filtra o array de elementos pelo id diferentes
  elements = elements.filter(element => element.id != id);
  // Mostrar elementos
  showElements(elements);
}

document.getElementById("thumbnailListContainer").addEventListener("wheel", (e) => {
  e.preventDefault();
  e.currentTarget.scrollLeft += e.deltaY;
});