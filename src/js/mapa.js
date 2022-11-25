(function () {

    const lat = document.querySelector('#lat').value || -25.332642122576598;
    const lng = document.querySelector('#lng').value || -57.57355213165284;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    let marker;

    //utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService()
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    marker.on('moveend', function (e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
        //obtener la informacion de la calle
        geocodeService.reverse().latlng(posicion, 13).run(function (error, result) {
            //console.log(result);
            marker.bindPopup(result.address.LongLabel);
            document.querySelector('.calle').textContent = result?.address?.Address || '';
            document.querySelector('#calle').value = result?.address?.Address || '';
            document.querySelector('#lat').value = result?.latlng?.lat || '';
            document.querySelector('#lng').value = result?.latlng?.lng || '';
        });
    });


})()