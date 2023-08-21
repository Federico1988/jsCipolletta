let inputWordButton = document.getElementById("customPromptBtn");
let startCountButton = document.getElementById("startCounBtn");
let customForm = document.getElementById('customForm');

alert("Bienvenido! Esto es un juego de memoria, que cuenta apariciones de letras.\nPara comenzar, por favor ingrese sus datos.")
let vocales = ["a", "e", "i", "o", "u"];


class InputWord {
    constructor(word, letra) {
        this.word = word.toUpperCase();
        this.letra = letra.toUpperCase();
        this.cantidad = 1;
        this.asignarPuntaje();
        this.puntajeObtenido = 0;
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
        this.puntajeObtenido = this.puntaje - resta; // mas resta cuanto mas se aleja de la cantidad correcta
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
        /*   const inputMail = document.getElementById('inputMail');
           const inputName = document.getElementById('inputName');
   
           let inputCorrect = false;
           let letra;
           let mensaje = "Gracias por la informacion.\nIngrese una palabra para sumar a la lista";
           let tries = 5;
   
           do {
   
               letra = prompt(mensaje);
               if (letra.length != 1) {
                   alert("Ingresar una letra únicamente");
                   inputCorrect = false;
                   mensaje = "Ingrese una letra: ";
                   continue;
               }
   
               if (letra.toLowerCase() === letra.toUpperCase()) {
                   alert("No se ingresó una letra.\nSolo se admiten letras.");
                   inputCorrect = false;
                   mensaje = "Ingrese una letra: ";
                   continue;
               }
   
               inputCorrect = true;
   
           } while (!inputCorrect && --tries !== 0);
   
           console.log("Tries: " + tries);
   
           console.log("Texto a analizar: " + inputName.value + inputMail.value)
           if (tries === 0)
               alert("Se superó la cantidad de intentos...");
           else
               alert("La letra " + letra + ", aparece " + contarLetra(letra, inputName.value + inputMail.value) + " veces en el mail y el nombre.")*/
    }
});

/* function contarLetra(letra, palabra) {
    console.log("Palabra ingresada: " + palabra);
    let apariciones = 0;
    letra = letra.toLowerCase();
    palabra = palabra.toLowerCase();

    for (let i = 0; i < palabra.length; i++) {
        if (palabra[i] == letra)
            apariciones++;
    }
    return apariciones;

} */

//Manejo del prompt
inputWordButton.addEventListener("click", async () => {
    const { value: formValues } = await Swal.fire({
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

    if (formValues) {
        console.log("Palabra:", formValues[0]);
        console.log("Letra:", formValues[1]);
        //TODO: Verificaciones de input
        wordsList.push(new InputWord(formValues[0], formValues[1]));
        if (wordsList.length >= 5)
            startCountButton.style.display = 'block';
        console.log("--> Lista de palabras: ");
        console.log(wordsList);
    }
});

startCountButton.addEventListener("click", async () => {

    for (const [index, element] of wordsList.entries()) {
        console.log("Analizando elemento: " + element.word);
        let userAnswer = prompt("Cuantas veces aparecía la letra solicitada en la " + (index + 1) + "° palabra ingresada?\nIngrese FIN para salir");

        if (userAnswer != "FIN")
            console.log("El usuario ingresó: " + userAnswer + " , y la restpuesta correcta es: " + element.contarLetra());
        if (userAnswer == "FIN")
            return;
        let numAnswer = parseInt(userAnswer);
        element.computarPuntaje(numAnswer);
        console.log("Consiguio: " + element.puntajeObtenido + " de " + element.puntaje)
    }
    console.log("--->Resultados:")
    console.log(wordsList);

    let puntaje = 0;
    let puntajeMaximo = 0;
    wordsList.forEach(el => {
        puntaje += el.puntajeObtenido;
        puntajeMaximo += el.puntaje;
    })
    alert("Puntaje obtenido: " + puntaje + " de un maximo de: " + puntajeMaximo + "\nRendimiento: " + ((puntaje / puntajeMaximo) * 100).toFixed(0) + "%");
});


