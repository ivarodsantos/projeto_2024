export async function addCozinhasFortalezaLayer(map) {
    try {
      const response = await fetch('geojson/cozinhas_fortaleza_representantes.geojson');
      const data = await response.json();
  
      // Inicializar array de marcadores se não existir
      if (!map.markers) {
        map.markers = [];
      }
  
      // Cria um array para armazenar os marcadores desta camada
      const cozinhaMarkers = [];
  
      data.features.forEach(feature => {
        if (feature.geometry && feature.geometry.coordinates && feature.properties) {
          const coords = feature.geometry.coordinates;
          const latLng = new google.maps.LatLng(coords[1], coords[0]);
  
          const marker = new google.maps.Marker({
            position: latLng,
            icon: {
              url: './icons/marker_csf_kitchen.png',
              scaledSize: new google.maps.Size(30, 30),
            },
            title: feature.properties.name,
          });
  
          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="card">
              <div class="card-body">
                <h5 class="card-title">Nome da Cozinha: ${feature.properties['Cozinha']}</h5>
                <p class="card-text">${feature.properties['Lote']}</p>
                <p class="card-text">Unidade Gerenciadora: ${feature.properties['Unidade Gerenciadora']}</p>
                <p class="card-text">Tipo: ${feature.properties['Tipo']}</p>
                <p class="card-text">Endereço: ${feature.properties['Endereço']}</p>
                <p class="card-text">Representante: ${feature.properties['representante']}</p>
              </div>
            </div>`,
          });
  
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
  
          // Adiciona o marcador ao array de marcadores de cozinha
          cozinhaMarkers.push(marker);
        } else {
          console.error('Propriedades não definidas no GeoJSON', feature);
        }
      });
  
      // Adiciona os marcadores de cozinha ao array de marcadores do mapa
      map.markers.push(cozinhaMarkers);
  
      // Configura o evento de mudança do checkbox para mostrar/ocultar os marcadores
      const checkbox = document.getElementById('flexSwitchCozinhasFortaleza');
      checkbox.addEventListener('change', function () {
        cozinhaMarkers.forEach(marker => {
          marker.setMap(checkbox.checked ? map : null);
        });
      });
    } catch (error) {
      console.error('Erro ao carregar GeoJSON:', error);
    }
  }
  