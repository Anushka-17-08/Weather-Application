const input = document.getElementById('locationInput');
const suggestions = document.getElementById('suggestions');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('weatherResult');
const apiKey = 'a3ec37d21346db0f97e8fbd7c8e69663';

const countries = ['London','Delhi','Paris','West Bengal','Mumbai','Kolkata','New York','Sydney','America','India','Asansol','Kulti','Sodepur'];

function debounce(func, delay){
    let timeout;
    return function(...args){
        clearTimeout(timeout);
        timeout = setTimeout( ()=>{
            func.apply(this, args);
        }, delay);
    }
}
function showSuggestions(value){
    suggestions.innerHTML = '';
    if(!value) return;
    const filtered = countries.filter(item => item.toLowerCase().startsWith(value.toLowerCase()));
    filtered.forEach(place =>{
        const li = document.createElement('li');
        li.textContent = place;
        li.onclick = ()=>{
            input.value = place;
            suggestions.innerHTML = '';
        };
        suggestions.appendChild(li);
    });
}

input.addEventListener('input', debounce( ()=>{
    showSuggestions(input.value);
}, 300));

searchBtn.addEventListener('click', ()=>{
    suggestions.innerHTML='';
    const location = input.value.trim();
    if(!location) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch (url)
      .then(res => res.json())
      .then(data => {
        if(data.cod !== 200){
            resultDiv.innerHTML = `<p> ${data.message}</p>`;
            return;
        }
        resultDiv.innerHTML = `
          <h2> ${data.name}, ${data.sys.country}</h2>
          <p> Temp: ${data.main.temp}C</p>
          <p> Humidity: ${data.main.humidity}%</p>
          <p> Weather: ${data.weather[0].description}</p>
        `;
      }) 
      .catch(err => {
        resultDiv.innerHTML = `<p>Failed to fetch weather data.</p>`;
      });     
});