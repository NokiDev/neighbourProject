$(document).ready(function(){
	
 $('#checkbox1').change(
   function() {
  if ($('#checkbox1').is(':checked')){
     $('#help').fadeIn();
          }
  else $('#help').fadeOut();
                        });

//OnOff
console.log(profile.lattitude);

    console.log(JSON.stringify(neighbours[0]));

// array contenant les positions des markers
    var locations = [
      [profile.first_name, profile.lattitude, profile.longitude]
    ];


// definit le type de map, le zoom et la position de depart de la carte
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: new google.maps.LatLng(profile.lattitude, profile.longitude),
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