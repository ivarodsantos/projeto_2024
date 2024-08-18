export async function addPopulationLayer(map) {
    const resDensidadePopulacional = new google.maps.Data();
    try {
      const response = await fetch('geojson/densidade_populacional_por_bairro_fortaleza_2024.geojson');
      const data = await response.json();
      resDensidadePopulacional.addGeoJson(data);
    } catch (error) {
      console.error('Erro ao carregar GeoJSON:', error);
    }
  
    resDensidadePopulacional.setStyle(function (feature) {
      return {
        fillColor: setColorDensidadePopulacional(feature.getProperty("Densidade (km²)")),
        strokeWeight: 1,
        strokeColor: "#000",
        fillOpacity: 0.7,
        strokeOpacity: 1,
        zIndex: 0
      };
    });
  
    const checkDensidadePopulacional = document.getElementById('flexSwitchDensidadePopulacional');
    checkDensidadePopulacional.addEventListener('change', function () {
      if (checkDensidadePopulacional.checked) {
        resDensidadePopulacional.setMap(map);
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendDensidadePopulacional());
      } else {
        resDensidadePopulacional.setMap(null);
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legendDensidadePopulacional());
      }
    });
  
    resDensidadePopulacional.addListener('click', function (event) {
      const contentString = `<div class="card mb-3">
        <div class="card-header">Bairro: ${event.feature.getProperty("Bairro")}</div>
        <ul class="list-group list-group-flush">
        <li class="list-group-item">Área (km²): ${event.feature.getProperty("Área (km²)")}</li>
          <li class="list-group-item">Regional: ${event.feature.getProperty("Regional")}</li>
          <li class="list-group-item">População: ${event.feature.getProperty("População")}</li>
          <li class="list-group-item">Densidade Populacional por km²: ${event.feature.getProperty("Densidade (km²)")}</li>
          <li class="list-group-item">Total de domicílios: ${event.feature.getProperty("Total de domicílios")}</li>
          <li class="list-group-item">Média de moradores por domicílios: ${event.feature.getProperty("Média de moradores por domicílios")}</li>
          <li class="list-group-item">Fonte: ${event.feature.getProperty("Fonte")}</li>
          <li class="list-group-item">Ano: ${event.feature.getProperty("Ano")}</li>
        </ul>`;
      const infowindowDensidadePopulacional = new google.maps.InfoWindow();
      infowindowDensidadePopulacional.setContent(contentString);
      infowindowDensidadePopulacional.setPosition(event.latLng);
      infowindowDensidadePopulacional.open(map);
    });
  }
  
  function setColorDensidadePopulacional(score) {
    if (score > 25000) return '#4A0000'; // Para > 25.000
    else if (score > 20000) return '#BD0026'; // Para 20.001 - 25.000
    else if (score > 15000) return '#E31A1C'; // Para 15.001 - 20.000
    else if (score > 10000) return '#FC4E2A'; // Para 10.001 - 15.000
    else if (score > 5000) return '#FD8D3C'; // Para 5.001 - 10.000
    else return '#FEB24C'; // Para < 5.000
  }
  
  
  
  function legendDensidadePopulacional() {
    const div = document.createElement('div');
    div.className = 'info legend';
    const grades = [0, 5000, 10000, 15000, 20000, 25000];
    const labels = [
      '< 5.000',
      '5.001 - 10.000',
      '10.001 - 15.000',
      '15.001 - 20.000',
      '20.001 - 25.000',
      '> 25.000'
    ];
    div.innerHTML += '<h5>Densidade Populacional Fortaleza</h5><br>';
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += `<i style="background:${setColorDensidadePopulacional(grades[i] + 1)}"></i> ${labels[i]}<br>`;
    }
    return div;
  }
  
  
  