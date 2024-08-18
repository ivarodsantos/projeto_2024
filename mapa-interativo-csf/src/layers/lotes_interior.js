const loteColors = {};

function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

for (let i = 12; i <= 39; i++) {
  loteColors[`Lote ${i}`] = generateRandomColor();
}

function setColorLotesInterior(lote) {
  return loteColors[lote] || '#FFFFFF'; // Cor branca por padrão se o lote não for encontrado
}

export async function addLotesInteriorLayer(map) {
  const resLotesInterior = new google.maps.Data();
  try {
    const response = await fetch('geojson/lotes_interior2.geojson');
    const data = await response.json();
    resLotesInterior.addGeoJson(data);
  } catch (error) {
    console.error('Erro ao carregar GeoJSON:', error);
  }

  resLotesInterior.setStyle(function (feature) {
    return {
      fillColor: setColorLotesInterior(feature.getProperty("lotes_qtd_cozinhas_Lote")),
      strokeWeight: 1,
      strokeColor: "#000",
      fillOpacity: 0.7,
      strokeOpacity: 1,
      zIndex: 1000
    };
  });

  const checkLotesInterior = document.getElementById('flexSwitchLotesInterior');
  checkLotesInterior.addEventListener('change', function () {
    if (checkLotesInterior.checked) {
      resLotesInterior.setMap(map);
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legendLotesInterior());
    } else {
      resLotesInterior.setMap(null);
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].pop(legendLotesInterior());
    }
  });

  resLotesInterior.addListener('click', function (event) {
    const contentString = `<div class="card mb-3">
      <div class="card-header">Lote: ${event.feature.getProperty("lotes_qtd_cozinhas_Lote")}</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Quantidade de Cozinhas: ${event.feature.getProperty("lotes_qtd_cozinhas_Qtd_Cozinhas")}</li>
        <li class="list-group-item">Quantidade de Municípios: ${event.feature.getProperty("qtd_municipios_por_lote_Qtd Municipio")}</li>
      </ul>`;
    const infowindowLotesInterior = new google.maps.InfoWindow();
    infowindowLotesInterior.setContent(contentString);
    infowindowLotesInterior.setPosition(event.latLng);
    infowindowLotesInterior.open(map);
  });
}

function legendLotesInterior() {
  const div = document.createElement('div');
  div.className = 'info legend';
  div.innerHTML += '<h5>Lotes Interior</h5><br>';
  
  for (let i = 12; i <= 39; i++) {
    const lote = `Lote ${i}`;
    div.innerHTML += `<i style="background:${setColorLotesInterior(lote)}"></i> ${lote}<br>`;
  }
  return div;
}
