const inputWordButton = document.getElementById("customPromptBtn"),
    startCountButton = document.getElementById("startCounBtn"),
    orderWordsButton = document.getElementById("orderWords"),
    customForm = document.getElementById('customForm'),
    reglas = document.getElementById('reglasDiv'),
    logginButton = document.getElementById('logginButton'),
    registerButton = document.getElementById('registerButton'),
    mailInput = document.querySelector("#emailInput"),
    passwordInput = document.querySelector("#passwordInput"),
    //nameInput = document.querySelector("#nameInput"),
    loginMsgLabel = document.querySelector("#loginMsgLabel"),
    userNameLabel = document.querySelector("#userNameLabel"),
    scoresText = document.querySelector("#scoresText"),
    ulWords = document.querySelector("#ulWords");

const vocales = ["a", "e", "i", "o", "u"];
const USER_NOT_FOUND = 0, WRONG_PASSWORD = 1, LOGIN_OK = 2;
class User {
    constructor(password, wordList, maxScore) {
        this.password = password;
        this.wordList = wordList;
        this.maxScore = maxScore;
    }
}

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

    borrarPuntaje() {
        this.puntajeObtenido_letras = 0;
        this.puntajeObtenido_palabras = 0;
    }

}

let currentWordList = [];

//Lleno la lista para la parte de testing (asi no tengo que ingresar todas a mano), en realidad el usuario ingresa todas. Las dejo comentadas para prox test
/*currentWordList.push(new InputWord("Hola", "L"));
currentWordList.push(new InputWord("Chau", "L"));
currentWordList.push(new InputWord("Mesa", "M"));
currentWordList.push(new InputWord("Milanesa", "N"));
currentWordList.push(new InputWord("Acondicionado", "N"));*/


//esto pasa en indx.html
if (registerButton)
    registerButton.addEventListener('click', function (event) {
        loginMsgLabel.textContent = '';

        if (customForm.checkValidity()) {
            const user = JSON.parse(localStorage.getItem(mailInput.value));
            if (user != null) {

                loginMsgLabel.textContent = 'El usuario ya existe!';
                loginMsgLabel.className = '';
                loginMsgLabel.classList.add('redLabel');
            }
            else {
                localStorage.setItem(mailInput.value, JSON.stringify(new User(passwordInput.value, [], 0)));
                mailInput.vale = "";
                passwordInput.value = "";
                loginMsgLabel.textContent = 'Registrado!';
                loginMsgLabel.className = '';
                loginMsgLabel.classList.add('greenLabel');
            }
        }
        else {
            loginMsgLabel.textContent = 'Complete ambos campos';
            loginMsgLabel.className = '';
            loginMsgLabel.classList.add('redLabel');
        }
        inputWordButton.style.display = 'none';
        startCountButton.style.display = 'none';
    });

//esto pasa en indx.html
if (customForm)
    customForm.addEventListener('submit', function (event) {
        event.preventDefault();
        switch (checkPasswordAndLoadList(mailInput.value, passwordInput.value)) {
            case USER_NOT_FOUND:
                console.log("Usuario No Encontrado");
                loginMsgLabel.textContent = 'Usuario no encontrado!';
                loginMsgLabel.className = '';
                loginMsgLabel.classList.add('redLabel');
                break;
            case WRONG_PASSWORD:
                console.log("Contraseña Incorrecta");
                loginMsgLabel.textContent = 'Contraseña incorrecta';
                loginMsgLabel.className = '';
                loginMsgLabel.classList.add('redLabel');
                break;
            case LOGIN_OK:
                console.log("Login ok usuario: " + mailInput.value + " -->> Voy a pagina del juego");
                sessionStorage.setItem("loggedUser", mailInput.value)
                window.location.href = '../paginas/game.html'
                break;
        }
    });


function checkPasswordAndLoadList(input_mail, input_password) {
    const user = JSON.parse(localStorage.getItem(input_mail));
    if (user === null)
        return USER_NOT_FOUND;
    else if (user.password != input_password)
        return WRONG_PASSWORD;
    else {
        return LOGIN_OK;
    }
}

let user;
//esto pasa en game.html
if (userNameLabel) {
    const loggedUser = sessionStorage.getItem("loggedUser");
    if (loggedUser) {
        userNameLabel.textContent = "Usuario: " + loggedUser;
        //console.log("Usuario: " + loggedUser);
        user = JSON.parse(localStorage.getItem(loggedUser));
        console.log(user);
        scoresText.textContent = "Puntaje maximo: " + user.maxScore;
        currentWordList = user.wordList;
        console.log(currentWordList);
        crearLista(currentWordList);
    }
    else {
        console.log("Got here without user! How dare you? Send you back to login page ;)");
        window.location.href = '../index.html'
    }
}


function crearLista(arr) {
    let wordElement;
    if (arr.length)
        for (const el of arr) {
            wordElement = `
      <li class=listElement> ${el.word} Letra: ${el.letra} <li>
      `;
            //se la agrego al contenedor
            // ulWords.appendChild(wordElement);.
            ulWords.innerHTML = ulWords.innerHTML + wordElement;
        }
}

//Manejo del prompt
if (inputWordButton)
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

            currentWordList.push(new InputWord(promptValues[0], promptValues[1]));
            if (currentWordList.length >= 5) {
                startCountButton.style.display = 'block';
                orderWordsButton.style.display = 'block'
            }
            console.log("--> Lista de palabras: ");
            console.log(currentWordList);


        } while (!inputCorrect && --tries !== 0);
    });

if (startCountButton)
    startCountButton.addEventListener("click", async () => {
        borrarPuntaje();
        for (const [index, element] of currentWordList.entries()) {
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
        console.log(currentWordList);

        //Sumo el puntaje total y lo muestro
        calcularYmostrarResultado('Cuenta de Letras', "puntajeObtenido_letras");
    });

if (orderWordsButton)
    orderWordsButton.addEventListener("click", async () => {
        borrarPuntaje();
        for (const [index, element] of currentWordList.entries()) {
            console.log("Analizando elemento: " + element.word);
            let userAnswer = prompt("Ingrese la " + (index + 1) + "° palabra ingresada previamente\nAprete Cancelar para salir");

            if (userAnswer === null || userAnswer == "FIN")
                break;


            const foundElement = currentWordList.find(el => el.word.toUpperCase() === userAnswer.toUpperCase());

            if (foundElement) {
                console.log("El usuario ingresó: " + userAnswer + " , y la respuesta correcta en la posicion " + index + " es: " + element.word);
                let indexOfFoundElement = currentWordList.indexOf(foundElement);
                console.log("La palabra igresada se encuentra en la posicion: " + indexOfFoundElement);
                const distancia = indexOfFoundElement - index;
                switch (distancia) {
                    case 0:        //Si esta en la posicion correcta suma su puntaje
                        element.puntajeObtenido_palabras += element.puntaje;
                        break;
                    case 1:            //Si esta a 1 orden de distancia suma la mitad (+1 o -1)
                    case -1:
                        element.puntajeObtenido_palabras += element.puntaje / 2;
                        break
                    default:        //si esta a mas de un orde de distancia no suma nada

                        break;
                }

                console.log("Suma en este palabra: " + element.puntajeObtenido_palabras);

            } else {
                console.log("No se encuentra el elemento, resta el puntaje de la palabra correcta");
                element.puntajeObtenido_palabras -= element.puntaje;
                continue; // sigo con la proxima palabra
            }
        }

        console.log("--->Resultados:")
        console.log(currentWordList);

        //Sumo el puntaje total y lo muestro
        calcularYmostrarResultado('Orden de Palabras', "puntajeObtenido_palabras");
    })


function hasNumbers(inputString) {
    return /\d/.test(inputString);
}

function calcularYmostrarResultado(nombreJuego, campo) {
    //TODO: Deberia chequear que campo pertenece a la clase InputWord
    let puntaje = 0;
    let puntajeMaximo = 0;

    currentWordList.forEach(el => {
        puntaje += el[campo];
        puntajeMaximo += el.puntaje;
    });

    const rendimiento = ((puntaje / puntajeMaximo) * 100).toFixed(0);

    alert("Puntaje obtenido en " + nombreJuego + ": " + puntaje + " de un máximo de " + puntajeMaximo + "\nRendimiento: " + rendimiento + "%");
}

function borrarPuntaje() {
    currentWordList.forEach(el => el.borrarPuntaje());
}