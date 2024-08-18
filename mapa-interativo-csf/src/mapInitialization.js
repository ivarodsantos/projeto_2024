export function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -4.9823072, lng: -39.3136536 },
      zoom: 7,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      zoomControl: true,
      mapId: "85f46ddfd84c22d6",
      gestureHandling: 'greedy' // Permite rolar o mapa sem a tecla Ctrl
    });
  
    return map;
  }
  