export async function addEscolasEstaduaisLayer(map) {
    try {
      const response = await fetch('geojson/escolas_estaduais.geojson');
      const data = await response.json();
  
      // Inicializar array de marcadores se não existir
      if (!map.markers) {
        map.markers = [];
      }
  
      // Cria um array para armazenar os marcadores desta camada
      const escolasEstaduaisMarkers = [];
  
      data.features.forEach(feature => {
        if (feature.geometry && feature.geometry.coordinates && feature.properties) {
          const coords = feature.geometry.coordinates;
          const latLng = new google.maps.LatLng(coords[1], coords[0]);
  
          const marker = new google.maps.Marker({
            position: latLng,
            icon: {
              url: '../icons/school_marker.png',
              scaledSize: new google.maps.Size(30, 30),
            },
            title: feature.properties.name,
          });
  
          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="card">
              <div class="card-body">
                <h5 class="card-title">Nome da Escola: ${feature.properties.NOME_DA_3}</h5>
                <p class="card-text">Município: ${feature.properties.MUNICIPI1}</p>
                <p class="card-text">Modalidade: ${feature.properties.MODALIDA15}</p>
                <p class="card-text">Local: ${feature.properties.LOCAL5}</p>
                <p class="card-text">Tipo de localidade: ${feature.properties.TIPO_LOC6}</p>
                <p class="card-text">Endereço: ${feature.properties.ENDERECO7}, ${feature.properties.NUMERO8}</p>
                <p class="card-text">Bairro: ${feature.properties.BAIRRO10}</p>
                <p class="card-text">Situação: ${feature.properties.SITUACAO14}</p>
              </div>
            </div>`,
          });
  
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
  
          // Adiciona o marcador ao array de marcadores de escolasEstaduais
          escolasEstaduaisMarkers.push(marker);
        } else {
          console.error('Propriedades não definidas no GeoJSON', feature);
        }
      });
  
      // Adiciona os marcadores de escolasEstaduais ao array de marcadores do mapa
      map.markers.push(escolasEstaduaisMarkers);
  
      // Configura o evento de mudança do checkbox para mostrar/ocultar os marcadores
      const checkbox = document.getElementById('flexSwitchEcolasEstaduais');
      checkbox.addEventListener('change', function () {
        escolasEstaduaisMarkers.forEach(marker => {
          marker.setMap(checkbox.checked ? map : null);
        });
      });
    } catch (error) {
      console.error('Erro ao carregar GeoJSON:', error);
    }
  }
  