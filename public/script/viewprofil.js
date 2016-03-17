$(document).ready(function(){
	
 $('#checkbox1').change(
   function() {
  if ($('#checkbox1').is(':checked')){
     $('#help').fadeIn();
          }
  else $('#help').fadeOut();
                        });

//OnOff


// array contenant les positions des markers
    var locations = [
      ['Abidjdan', 5.345317, -4.024429],
      ['Gagnoa', 6.133333, -5.933333],
      ['Korogho', 9.416667, -5.616667]
    ];


// definit le type de map, le zoom et la position de depart de la carte
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: new google.maps.LatLng(48.866667, 2.333333),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

// l infozindo est la fenetre qui apparait lorsqu'on clique sur un marker
    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) { 
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

// s execute lorsque l on clique sur un marker
// c est un evenement definit par l api
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
});