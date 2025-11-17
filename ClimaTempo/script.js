
let currentLang = 'pt';


const dictionary = {
    pt: {
        titulo: "Previsão do Tempo",
        placeholder: "Digite a cidade...",
        umidade: "Umidade",
        vento: "Vento",
        erro: "Cidade não encontrada",
        buscando: "Buscando...",
        // Climas
        ceuLimpo: "Céu Limpo",
        nublado: "Nublado",
        chuva: "Chuva",
        tempestade: "Tempestade"
    },
    en: {
        titulo: "Weather Forecast",
        placeholder: "Enter city name...",
        umidade: "Humidity",
        vento: "Wind",
        erro: "City not found",
        buscando: "Searching...",
        // Climas
        ceuLimpo: "Clear Sky",
        nublado: "Cloudy",
        chuva: "Rain",
        tempestade: "Thunderstorm"
    }
};


function setLanguage(lang) {
    currentLang = lang;

   
    document.querySelector('[data-lang="titulo"]').innerText = dictionary[lang].titulo;
    document.querySelector('[data-lang="umidade"]').innerText = dictionary[lang].umidade;
    document.querySelector('[data-lang="vento"]').innerText = dictionary[lang].vento;
    document.getElementById('cityInput').placeholder = dictionary[lang].placeholder;

    
    document.querySelectorAll('.lang-switch button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}


document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    buscarCidade(city);
});

function buscarCidade(nome) {
    const listDiv = document.getElementById('cityList');
    const weatherDiv = document.getElementById('weatherBox');

    listDiv.innerHTML = `<p style="color:#ccc">${dictionary[currentLang].buscando}</p>`;
    weatherDiv.style.display = 'none';

    fetch(`api.php?acao=buscar&nome=${nome}`)
        .then(res => res.json())
        .then(resp => {
            listDiv.innerHTML = '';

            if (resp.status === 'sucesso') {
                
                if (resp.dados.length === 1) {
                    carregarClima(resp.dados[0]);
                } else {
                    
                    criarListaOpcoes(resp.dados);
                }
            } else {
                listDiv.innerHTML = `<p style="color:#ff4b4b">${dictionary[currentLang].erro}</p>`;
            }
        });
}

function criarListaOpcoes(lista) {
    const listDiv = document.getElementById('cityList');
    lista.forEach(cidade => {
        const item = document.createElement('div');
        
        item.innerHTML = `<strong>${cidade.nome}</strong> <small>${cidade.estado} (${cidade.pais})</small>`;
        item.onclick = () => {
            listDiv.innerHTML = ''; 
            carregarClima(cidade);
        };
        listDiv.appendChild(item);
    });
}


function carregarClima(cidadeDados) {
    const weatherDiv = document.getElementById('weatherBox');

    fetch(`api.php?acao=clima&lat=${cidadeDados.lat}&lon=${cidadeDados.lon}`)
        .then(res => res.json())
        .then(resp => {
            if (resp.status === 'sucesso') {
                const d = resp.dados;

                
                document.getElementById('cityName').innerText = cidadeDados.nome;
                document.getElementById('tempDisplay').innerText = Math.round(d.temp) + "°C";
                document.getElementById('humidityDisplay').innerText = d.umidade + "%";
                document.getElementById('windDisplay').innerText = d.vento + " km/h";

                
                atualizarVisual(d.codigo);

                weatherDiv.style.display = 'block';
            }
        });
}

function atualizarVisual(codigo) {
    const descDisplay = document.getElementById('descDisplay');
    const body = document.body;
    const txt = dictionary[currentLang];

    body.className = ''; 

    
    if (codigo === 0) {
        descDisplay.innerText = txt.ceuLimpo;
        body.classList.add('ensolarado');
    }
    else if (codigo >= 1 && codigo <= 48) {
        descDisplay.innerText = txt.nublado;
        body.classList.add('nublado');
    }
    else if (codigo >= 51 && codigo <= 82) {
        descDisplay.innerText = txt.chuva;
        body.classList.add('chuvoso');
    }
    else if (codigo >= 95) {
        descDisplay.innerText = txt.tempestade;
        body.classList.add('tempestade');
    } else {
        descDisplay.innerText = "---";
        body.classList.add('padrao');
    }
}