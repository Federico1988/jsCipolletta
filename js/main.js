

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

        } while (!inputCorrect && tries-- !== 0);

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
