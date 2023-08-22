let inputWordButton = document.getElementById("customPromptBtn");
let startCountButton = document.getElementById("startCounBtn");
let orderWordsButton = document.getElementById("orderWords");
let customForm = document.getElementById('customForm');

alert("Bienvenido! Esto es un juego de memoria, que cuenta apariciones de letras.\nPara comenzar, por favor ingrese sus datos.")
let vocales = ["a", "e", "i", "o", "u"];


class InputWord {
    constructor(word, letra) {
        this.word = word.toUpperCase();
        this.letra = letra.toUpperCase();
        this.cantidad = 1;
        this.asignarPuntaje();
        this.puntajeObtenido_letras = 0;
        this.puntajeObtenido_palabras = 0;
    }

    contarLetra() {
        console.log("Palabra: " + this.word);
        let apariciones = 0;

        for (let i = 0; i < this.word.length; i++) {
            if (this.word[i] == this.letra)
                apariciones++;
        }
        return apariciones;
    }

    agregarPalabra() { //Solo se usa si agrega la misma palabra y la misma letra!
        this.cantidad++;
    }

    asignarPuntaje() {
        this.puntaje = this.word.length;
        if (!vocales.includes(this.letra))
            this.puntaje *= 2; //Duplica puntos si elije una consonante
    }

    computarPuntaje(usrApariciones) {
        let resta = Math.abs(this.contarLetra() - usrApariciones);
        if (!vocales.includes(this.letra))
            resta *= 2;
        this.puntajeObtenido_letras = this.puntaje - resta; // mas resta cuanto mas se aleja de la cantidad correcta
    }

}

let wordsList = [];

//Lleno la lista para la parte de testing (asi no tengo que ingresar todas a mano), en realidad el usuario ingresa todas
wordsList.push(new InputWord("Hola", "L"));
wordsList.push(new InputWord("Chau", "L"));
wordsList.push(new InputWord("Mesa", "M"));
wordsList.push(new InputWord("Milanesa", "N"));
wordsList.push(new InputWord("Acondicionado", "N"));

customForm.addEventListener('reset', function (event) {

    inputWordButton.style.display = 'none';

    startCountButton.style.display = 'none';
});
customForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var form = event.target;
    if (form.checkValidity()) {
        inputWordButton.style.display = 'block';

    }
});

//Manejo del prompt
inputWordButton.addEventListener("click", async () => {
    let inputCorrect = false;
    let tries = 3;
    do {

        const { value: promptValues } = await Swal.fire({
            title: 'Ingrese una palabra, y la letra a contar',
            html:
                '<input id="palabra" class="swal2-input" placeholder="Palabra">' +
                '<input id="letra" class="swal2-input" placeholder="Letra a contar">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('palabra').value,
                    document.getElementById('letra').value
                ];
            }
        });

        if (promptValues[0].length == 0 || promptValues[1].length == 0) {
            alert("Por favor complete los 2 campos");
            inputCorrect = false;
            continue;
        }

        console.log("Palabra: ", promptValues[0]);
        console.log("Letra: ", promptValues[1]);

        if (promptValues[1].length != 1) {
            alert(`Se ingresó mas de un carater en el campo "Letra". Ingresar una letra únicamente`);
            inputCorrect = false;
            continue;
        }

        if (promptValues[1].toLowerCase() === promptValues[1].toUpperCase()) {
            alert(`Se ingresó "${promptValues[1]}" en el campo "Letra".\nSolo se admiten letras.`);
            inputCorrect = false;
            continue;
        }
        if (hasNumbers(promptValues[0])) {
            alert(`Se ingresó "${promptValues[0]}" en el campo "Palabra".\nSolo se admiten letras (sin numeros).`);
            inputCorrect = false;
            continue;
        }
        if (promptValues[0].length < 3) {
            alert(`Se ingresó " ${promptValues[1]}" en el campo "Palabra".\nPor favor ingrese una palabra de 3 letras o mas`);
            inputCorrect = false;
            continue;
        }

        inputCorrect = true;



        wordsList.push(new InputWord(promptValues[0], promptValues[1]));
        if (wordsList.length >= 5)
            startCountButton.style.display = 'block';
        console.log("--> Lista de palabras: ");
        console.log(wordsList);


    } while (!inputCorrect && --tries !== 0);
});

startCountButton.addEventListener("click", async () => {

    for (const [index, element] of wordsList.entries()) {
        console.log("Analizando elemento: " + element.word);
        let userAnswer = prompt("Cuantas veces aparecía la letra solicitada en la " + (index + 1) + "° palabra ingresada?\nAprete Cancelar salir");

        if (userAnswer === null || userAnswer == "FIN")
            break;

        console.log("El usuario ingresó: " + userAnswer + " , y la respuesta correcta es: " + element.contarLetra());

        let numAnswer = parseInt(userAnswer);
        element.computarPuntaje(numAnswer);
        console.log("Consiguio: " + element.puntajeObtenido_letras + " de " + element.puntaje)
    }

    console.log("--->Resultados:")
    console.log(wordsList);

    let puntaje = 0;
    let puntajeMaximo = 0;
    wordsList.forEach(el => {
        puntaje += el.puntajeObtenido_letras;
        puntajeMaximo += el.puntaje;
    })

    alert("Puntaje obtenido: " + puntaje + " de un máximo de: " + puntajeMaximo + "\nRendimiento: " + ((puntaje / puntajeMaximo) * 100).toFixed(0) + "%");
});

orderWordsButton.addEventListener("click", async () => {
    for (const [index, element] of wordsList.entries()) {
        console.log("Analizando elemento: " + element.word);
        let userAnswer = prompt("Ingrese la" + (index + 1) + "° palabra ingresada previamente\nAprete Cancelar salir");

        if (userAnswer === null || userAnswer == "FIN")
            break;

        wordsList.find()

        //Si no estaba resta su puntaje
        //Si esta a menos de 1 orden de distancia suma la mitad (+1 o -1)
        //si esta a mas de un orde de distancia no suma nada
        //Si esta en la posicion correcta suma su puntaje
        console.log("El usuario ingresó: " + userAnswer + " , y la respuesta correcta es: " + element.word);
        if (userAnswer.toUpperCase() === element.word.toUpperCase()) {
            element.puntajeObtenido_palabras += ele
        }


    }
})


function hasNumbers(inputString) {
    return /\d/.test(inputString);
}