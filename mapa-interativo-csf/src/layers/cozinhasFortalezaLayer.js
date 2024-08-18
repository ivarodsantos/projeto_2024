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
    const lotes = new Set();  // <-- Conjunto para armazenar lotes únicos
    const representantes = new Set();  // <-- Conjunto para armazenar representantes únicos

    data.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates && feature.properties) {
        const coords = feature.geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[1], coords[0]);

        const marker = new google.maps.Marker({
          position: latLng,
          icon: {
            url: './icons/cozinha_icon.png',
            scaledSize: new google.maps.Size(30, 40),
          },
          title: feature.properties.name,
          properties: feature.properties // <-- Adiciona todas as propriedades ao marcador
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
        lotes.add(feature.properties.Lote);  // <-- Adiciona o Lote ao conjunto
        representantes.add(feature.properties.representante);  // <-- Adiciona o Representante ao conjunto
      } else {
        console.error('Propriedades não definidas no GeoJSON', feature);
      }
    });

    // Adiciona os marcadores de cozinha ao array de marcadores do mapa
    map.markers.push(cozinhaMarkers);

    // Configura o evento de mudança do checkbox para mostrar/ocultar os marcadores
    const checkbox = document.getElementById('flexSwitchCozinhasFortaleza');
    const filtrosDiv = document.getElementById('filtrosCozinhas');  // <-- Referência ao div de filtros
    checkbox.addEventListener('change', function () {
      cozinhaMarkers.forEach(marker => {
        marker.setMap(checkbox.checked ? map : null);
      });
      if (checkbox.checked) {
        filtrosDiv.style.display = 'block';  // <-- Mostrar filtros quando layer está ativa
      } else {
        filtrosDiv.style.display = 'none';  // <-- Esconder filtros quando layer não está ativa
      }
    });

    // Preencher os filtros dinamicamente
    const filtroLote = document.getElementById('filtroLote');  // <-- Referência ao select de Lote
    const filtroRepresentante = document.getElementById('filtroRepresentante');  // <-- Referência ao select de Representante

    lotes.forEach(lote => {
      const checkbox = document.createElement('input'); // <-- Alteração: Mudança de select para checkbox
      checkbox.type = 'checkbox'; // <-- Alteração: Definição do tipo como checkbox
      checkbox.value = lote;
      checkbox.className = 'form-check-input';
      checkbox.id = `lote-${lote}`;
      filtroLote.appendChild(checkbox);

      const label = document.createElement('label'); // <-- Alteração: Adição de label para cada checkbox
      label.htmlFor = `lote-${lote}`;
      label.textContent = lote;
      label.className = 'form-check-label';
      filtroLote.appendChild(label);

      filtroLote.appendChild(document.createElement('br'));
    });

    // Ordena os representantes em ordem alfabética antes de preenchê-los no filtro
    const representantesOrdenados = Array.from(representantes).sort();

    representantesOrdenados.forEach(representante => {
      const checkbox = document.createElement('input'); // <-- Alteração: Mudança de select para checkbox
      checkbox.type = 'checkbox'; // <-- Alteração: Definição do tipo como checkbox
      checkbox.value = representante;
      checkbox.className = 'form-check-input';
      checkbox.id = `representante-${representante}`;
      filtroRepresentante.appendChild(checkbox);

      const label = document.createElement('label'); // <-- Alteração: Adição de label para cada checkbox
      label.htmlFor = `representante-${representante}`;
      label.textContent = representante;
      label.className = 'form-check-label';
      filtroRepresentante.appendChild(label);

      filtroRepresentante.appendChild(document.createElement('br'));
    });

    function aplicarFiltros() {
      const loteSelecionado = filtroLote.value;
      const representanteSelecionado = filtroRepresentante.value;

      cozinhaMarkers.forEach(marker => {
        const properties = marker.get("properties"); // Armazena as propriedades do marcador

        const showByLote = loteSelecionado === "" || properties.Lote === loteSelecionado;
        const showByRepresentante = representanteSelecionado === "" || properties.representante === representanteSelecionado;

        const showMarker = showByLote && showByRepresentante;

        marker.setMap(showMarker ? map : null);
      });
    }


    function aplicarFiltros() { // <-- Alteração: Função para aplicar filtros com múltiplos valores selecionados
      const lotesSelecionados = Array.from(filtroLote.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
      const representantesSelecionados = Array.from(filtroRepresentante.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

      cozinhaMarkers.forEach(marker => {
        const properties = marker.get("properties");

        const showByLote = lotesSelecionados.length === 0 || lotesSelecionados.includes(properties.Lote);
        const showByRepresentante = representantesSelecionados.length === 0 || representantesSelecionados.includes(properties.representante);

        const showMarker = showByLote && showByRepresentante;

        marker.setMap(showMarker ? map : null);
      });
    }

    filtroLote.addEventListener('change', aplicarFiltros); // <-- Alteração: Evento para aplicar filtros de lotes
    filtroRepresentante.addEventListener('change', aplicarFiltros);
  } catch (error) {
    console.error('Erro ao carregar GeoJSON:', error);
  }
}
