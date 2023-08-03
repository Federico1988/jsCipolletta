document.getElementById('customForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var form = event.target;
    if (form.checkValidity()) {

        let inputMail = document.getElementById('inputMail');
        let inputName = document.getElementById('inputName');

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

        console.log("Tries ")

        if (tries === 0)
            alert("Se superó la cantidad de intentos...");
        else
            alert("La letra " + letra + ", aparece " + " veces en el mail y el nombre.")



        alert("Palabra ingresada: " + palabra);
    }
});


