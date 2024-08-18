export async function addEquipSPSLayer(map) {
    try {
      const response = await fetch('geojson/equipamentos_sps2.geojson');
      const data = await response.json();
  
      // Inicializar array de marcadores se não existir
      if (!map.markers) {
        map.markers = [];
      }
  
      // Cria um array para armazenar os marcadores desta camada
      const equipSPSMarkers = [];
  
      data.features.forEach(feature => {
        if (feature.geometry && feature.geometry.coordinates && feature.properties) {
          const coords = feature.geometry.coordinates;
          const latLng = new google.maps.LatLng(coords[1], coords[0]);
  
          const marker = new google.maps.Marker({
            position: latLng,
            icon: {
              url: './icons/equip_sps_marker.png',
              scaledSize: new google.maps.Size(30, 30),
            },
            title: feature.properties.name,
          });
  
          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="card">
              <div class="card-body">
                <h5 class="card-title">Nome do Equipamento: ${feature.properties['nome_equipamento']}</h5>
                <p class="card-text">Endereço: ${feature.properties['logradouro']}</p>
                <p class="card-text">Bairro: ${feature.properties['bairro']}</p>
                <p class="card-text">Município: ${feature.properties['municipio']}</p>
              </div>
            </div>`,
          });
  
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
  
          // Adiciona o marcador ao array de marcadores de cozinha
          equipSPSMarkers.push(marker);
        } else {
          console.error('Propriedades não definidas no GeoJSON', feature);
        }
      });
  
      // Adiciona os marcadores de equipSPS ao array de marcadores do mapa
      map.markers.push(equipSPSMarkers);
  
      // Configura o evento de mudança do checkbox para mostrar/ocultar os marcadores
      const checkbox = document.getElementById('flexSwitchequipSPS');
      checkbox.addEventListener('change', function () {
        equipSPSMarkers.forEach(marker => {
          marker.setMap(checkbox.checked ? map : null);
        });
      });
    } catch (error) {
      console.error('Erro ao carregar GeoJSON:', error);
    }
  }
  