(function() {
    const lat = -25.332553;
    const lng = -57.573549;
    const mapa = L.map('mapa').setView([lat, lng ], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()