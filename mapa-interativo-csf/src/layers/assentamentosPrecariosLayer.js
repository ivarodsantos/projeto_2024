export async function addAssentamentosPrecariosLayer(map) {
    const layer = new google.maps.Data();
    try {
      const response = await fetch('geojson/assentamentos_precarios_2024.geojson');
      const data = await response.json();
      layer.addGeoJson(data);
    } catch (error) {
      console.error('Erro ao carregar GeoJSON:', error);
    }
  
    layer.setStyle({
      fillColor: 'red',
      strokeWeight: 1,
    });
  
    const checkbox = document.getElementById('flexSwitchAssentamentosPrecarios');
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        layer.setMap(map);
      } else {
        layer.setMap(null);
      }
    });
  
    layer.addListener('click', function (event) {
      const contentString = `<div class="card mb-3">
        <div class="card-header">Assentamento: ${event.feature.getProperty('name')}</div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Descrição: ${event.feature.getProperty('description')}</li>
        </ul>`;
      const infoWindow = new google.maps.InfoWindow();
      infoWindow.setContent(contentString);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    });
  }
  