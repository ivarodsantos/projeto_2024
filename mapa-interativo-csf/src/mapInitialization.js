export function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -3.7768582, lng: -38.5591243 },
      zoom: 12,
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
  