


//ejemplos funciones de orden superior, que devuelven funciones
const suma = asignarOperador("sumar");
console.log(suma(2, 3));
//ejemplos funciones de orden superior, que reciben funciones
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//porCadaUno(numeros, alert);
//porCadaUno(numeros, console.log);
//porCadaUno(numeros, (el) => { console.log(el * 2) });

console.log("Imprimo los pares de " + numeros);
const pares = miFiltrado(numeros, (el) => { return el % 2 == 0 });
console.log(pares);

alert("Bienvenido! Esto es un simulador que cuenta apariciones de letras.\nPara comenzar, por favor ingrese sus datos.")

document.getElementById('customForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var form = event.target;
    if (form.checkValidity()) {

        const inputMail = document.getElementById('inputMail');
        const inputName = document.getElementById('inputName');

        let inputCorrect = false;
        let letra;
        let mensaje = "Gracias por la informacion.\nIngrese una letra para contar cuántas veces aparece en su nombre y mail";
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
            alert("La letra " + letra + ", aparece " + contarLetra(letra, inputName.value + inputMail.value) + " veces en el mail y el nombre.")


    }
});

function contarLetra(letra, palabra) {
    console.log("Palabra ingresada: " + palabra);
    let apariciones = 0;
    letra = letra.toLowerCase();
    palabra = palabra.toLowerCase();

    for (let i = 0; i < palabra.length; i++) {
        if (palabra[i] == letra)
            apariciones++;
    }
    return apariciones;

}


//Funciones de orden superior que devuelven otra funcion
function mayoQue(n) {
    return (m) => m > n;
}

function asignarOperador(op) {
    if (op == "sumar")
        return (a, b) => a + b;
    else if (op = "restar")
        return (a, b) => a - b;
    else if (op = "multiplicar")
        return (a, b) => a * b;
}

//Funciones de orden superior que reciben funciones por parametros
function porCadaUno(array, funcion) {
    for (const elemento of array) {
        funcion(elemento);
    }
}


function miFiltrado(array, funcionCondicional) {
    const resultado = [];
    for (const item of array) {
        //Evaluamos usando la condicion de la funcionCOndicional, si cumple lo agregamos al resultados
        if (funcionCondicional(item))
            resultado.push(item);
    }
    return resultado;
}