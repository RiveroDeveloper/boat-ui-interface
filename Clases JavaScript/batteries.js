let porcentaje = 100; 
let voltaje = 12.6; 
let decremento = 0.05;

function actualizarBateria() {

    porcentaje -= decremento;

    if (porcentaje <= 0) {
        porcentaje = 100;
        voltaje = 12.6; 
    } else {

        voltaje = (12.6 * (porcentaje / 100)).toFixed(2);
    }

    document.getElementById('voltage').textContent = `Batería: ${porcentaje.toFixed(1)}% (${voltaje}V)`;
}

actualizarBateria();
setInterval(actualizarBateria, 2000);

