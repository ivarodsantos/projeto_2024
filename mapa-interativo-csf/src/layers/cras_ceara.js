export async function addCrasCearaLayer(map) {
    try {
      const response = await fetch('geojson/cras_ceara.geojson');
      const data = await response.json();
  
      // Inicializar array de marcadores se não existir
      if (!map.markers) {
        map.markers = [];
      }
  
      // Cria um array para armazenar os marcadores desta camada
      const crasCearaMarkers = [];
  
      data.features.forEach(feature => {
        if (feature.geometry && feature.geometry.coordinates && feature.properties) {
          const coords = feature.geometry.coordinates;
          const latLng = new google.maps.LatLng(coords[1], coords[0]);
  
          const marker = new google.maps.Marker({
            position: latLng,
            icon: {
              url: './icons/assist_soc_marker.png',
              scaledSize: new google.maps.Size(30, 30),
            },
            title: feature.properties.name,
          });
  
          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="card">
              <div class="card-body">
                <h5 class="card-title">Nome do Cras: ${feature.properties['nome']}</h5>
                <p class="card-text">Endereço: ${feature.properties['tipo']} ${feature.properties['logradouro']}, ${feature.properties['numero']}</p>
                <p class="card-text">Bairro: ${feature.properties['bairro']}</p>
                <p class="card-text">Município: ${feature.properties['municipio']}</p>
                <p class="card-text">Capacidade: ${feature.properties['capacidade']}</p>
              </div>
            </div>`,
          });
  
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
  
          // Adiciona o marcador ao array de marcadores de cozinha
          crasCearaMarkers.push(marker);
        } else {
          console.error('Propriedades não definidas no GeoJSON', feature);
        }
      });
  
      // Adiciona os marcadores de crasCeara ao array de marcadores do mapa
      map.markers.push(crasCearaMarkers);
  
      // Configura o evento de mudança do checkbox para mostrar/ocultar os marcadores
      const checkbox = document.getElementById('flexSwitchCrasCeara');
      checkbox.addEventListener('change', function () {
        crasCearaMarkers.forEach(marker => {
          marker.setMap(checkbox.checked ? map : null);
        });
      });
    } catch (error) {
      console.error('Erro ao carregar GeoJSON:', error);
    }
  }
  