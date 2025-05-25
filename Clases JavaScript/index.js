function actualizarHora() {
    const ahora = new Date();
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();

    horas = horas < 10 ? '0' + horas : horas;
    minutos = minutos < 10 ? '0' + minutos : minutos;

    document.getElementById('time').textContent = horas + ':' + minutos;
}

setInterval(actualizarHora, 1);

let velocidad = 0; 
let incremento = 0.1; 

function actualizarVelocidad() {

    velocidad += incremento;

    if (velocidad >= 80) {
        incremento = -0.1; 
    } else if (velocidad <= 0) {
        incremento = 0.1; 
    }
    document.getElementById('speed').textContent = velocidad.toFixed(1) + ' km/h';
}
actualizarVelocidad();
setInterval(actualizarVelocidad, 35);