const inputWordButton = document.getElementById("inputWordButton"),
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
    ulWords = document.querySelector("#ulWords"),
    gameName = document.querySelector("#gameName"),
    instruction = document.querySelector("#instruction"),
    submitAnswer = document.querySelector("#submitAnswer"),
    answerInput = document.querySelector("#answerInput"),
    cancelButton = document.querySelector("#cancelButton"),
    answersDiv = document.querySelector("#answerDiv"),
    scoreh3 = document.querySelector("#scoreh3");

const vocales = ["a", "e", "i", "o", "u"];
const USER_NOT_FOUND = 0, WRONG_PASSWORD = 1, LOGIN_OK = 2;
class User {
    constructor(password, wordList, maxScore) {
        this.password = password;
        this.wordList = wordList;
        this.maxScore = maxScore;
    }
    serialize() {
        // Convert a User instance to a plain object
        return {
            password: this.password,
            maxScore: this.maxScore,
            wordList: this.wordList.map(inputWord => inputWord.serialize()),
        };
    }

    static deserialize(obj) {
        const user = new User(obj.password, [], obj.maxScore);
        user.wordList = obj.wordList.map(inputWordObj => deserializeInputWord(inputWordObj));
        return user;
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

    serialize() {
        return {
            word: this.word,
            letra: this.letra,
            cantidad: this.cantidad,
            puntajeObtenido_letras: this.puntajeObtenido_letras,
            puntajeObtenido_palabras: this.puntajeObtenido_palabras,
        };
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
            //const user = JSON.parse(localStorage.getItem(mailInput.value));
            const user = getUserFromLocalStorage(mailInput.value)
            if (user != null) {

                loginMsgLabel.textContent = 'El usuario ya existe!';
                loginMsgLabel.className = '';
                loginMsgLabel.classList.add('redLabel');
            }
            else {
                //localStorage.setItem(mailInput.value, JSON.stringify(new User(passwordInput.value, [], 0)));
                saveUserToLocalStorage(mailInput.value, new User(passwordInput.value, [], 0))
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
        /*         inputWordButton.style.display = 'none';
                startCountButton.style.display = 'none'; */
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
                window.location.href = 'paginas/game.html'
                break;
        }
    });


function checkPasswordAndLoadList(input_mail, input_password) {
    const user = getUserFromLocalStorage(input_mail);
    if (user === null)
        return USER_NOT_FOUND;
    else if (user.password != input_password)
        return WRONG_PASSWORD;
    else {
        return LOGIN_OK;
    }
}

let user, loggedUser;
//esto pasa en game.html

if (userNameLabel) {
    loggedUser = sessionStorage.getItem("loggedUser");
    if (loggedUser) {
        userNameLabel.textContent = "Usuario: " + loggedUser;
        //console.log("Usuario: " + loggedUser);
        user = getUserFromLocalStorage(loggedUser);
        console.log(user);
        scoresText.textContent = "Puntaje maximo: " + user.maxScore;
        currentWordList = user.wordList;
        console.log(currentWordList);
        mostrarLista(currentWordList);
    }
    else {
        console.log("Got here without user! How dare you? Send you back to login page ;)");
        window.location.href = '../index.html'
    }
}


function mostrarLista(arr) {
    let wordElement;
    ulWords.innerHTML = ''; //primero clear
    if (arr.length)
        for (const el of arr) {
            wordElement = `
            <li class="ulElement">
              <div class="ulColumn">${el.word}</div>
              <div class="ulColumn">Letra: ${el.letra}</div>
              <div class="ulColumn"><button class="roundedButton removeButton">Quitar</button></div>
            </li>
          `;            //se la agrego al contenedor
            ulWords.innerHTML += wordElement;
        }
    if (arr.length >= 5)
        showGameButtons();
}

if (ulWords)
    ulWords.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('removeButton')) {
            const word = target.parentElement.parentElement.querySelector('.ulColumn:first-child').textContent;
            deleteElementByWord(word);
            target.parentElement.parentElement.remove();
            console.log(currentWordList);
        }
    });

function deleteElementByWord(palabra) {
    for (let i = 0; i < currentWordList.length; i++) {
        if (currentWordList[i].word === palabra) {
            currentWordList.splice(i, 1);
            user.wordList = currentWordList;
            saveUserToLocalStorage(loggedUser, user);
            break;
        }
    }
}

//Manejo del custom prompt. Lo deje porque es unp hecho a mano, no es el prompt default.
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
            /*             if (currentWordList.length >= 5) {
                            startCountButton.style.display = 'block';
                            orderWordsButton.style.display = 'block'
                        } */
            user.wordList = currentWordList;
            saveUserToLocalStorage(loggedUser, user);
            console.log("--> Lista de palabras: ");
            console.log(currentWordList);
            mostrarLista(currentWordList); // Refresco la lista


        } while (!inputCorrect && --tries !== 0);
    });

let gameInCurse = '';
let idx = 0;

//Seteo para el juego de cuenta de letras
if (startCountButton)
    startCountButton.addEventListener("click", async () => {
        commonSetupsBeforeGame();
        gameName.textContent = "Cuenta de letras!"
        gameInCurse = 'Cuenta de Letras';
        instruction.textContent = "Cuantas veces aparecía la letra solicitada en la " + (idx + 1) + "° palabra ingresada?";
    });


//Seteo para el juego de orden de palabras
if (orderWordsButton)
    orderWordsButton.addEventListener("click", async () => {
        commonSetupsBeforeGame();
        gameName.textContent = "Orden de Palabras!"
        gameInCurse = 'Orden de Palabras';
        instruction.textContent = "Ingrese la " + (idx + 1) + "° palabra ingresada previamente\Presione Cancelar para salir";
    })

function commonSetupsBeforeGame() {
    console.log("Restarting Game");
    idx = 0;
    hideWordList();
    borrarPuntaje();
    scoreh3.textContent = "";
    answerInput.style.display = 'block';
    submitAnswer.style.display = 'block';
    answersDiv.style.display = 'block';
    cancelButton.style.display = 'block';
}

function commonSetupsAfterGame() {
    console.log("Finish Game");
    idx = 0;
    showGameButtons();
    answersDiv.style.display = 'none';
    showWordList();
}

if (cancelButton)
    cancelButton.addEventListener('click', async () => {
        commonSetupsAfterGame();
    })

//Proceso respuestas que envia el usuario (Game Engine)
if (submitAnswer)
    submitAnswer.addEventListener('click', async () => {
        answerInput.focus();
        let userAnswer = answerInput.value;

        answerInput.value = "";
        if (userAnswer === null || userAnswer == "FIN")
            return;

        console.log("Analizando elemento: " + currentWordList[idx].word);

        if (gameInCurse == 'Cuenta de Letras') {
            console.log("El usuario ingresó: " + userAnswer + " , y la respuesta correcta es: " + currentWordList[idx].contarLetra());
            //TODO chequear que efectivamente ingreso un numero
            let numAnswer = parseInt(userAnswer);
            currentWordList[idx].computarPuntaje(numAnswer);
            console.log("Consiguio: " + currentWordList[idx].puntajeObtenido_letras + " de " + currentWordList[idx].puntaje);
            if (++idx < currentWordList.length)
                instruction.textContent = "Cuantas veces aparecía la letra solicitada en la " + (idx + 1) + "° palabra ingresada?";
            else
                calcularYmostrarResultado(gameInCurse, "puntajeObtenido_letras");

        }
        else if (gameInCurse = 'Orden de Palabras') {

            const foundElement = currentWordList.find(el => el.word.toUpperCase() === userAnswer.toUpperCase());

            if (foundElement) {
                console.log("El usuario ingresó: " + userAnswer + " , y la respuesta correcta en la posicion " + idx + " es: " + currentWordList[idx].word);
                let indexOfFoundElement = currentWordList.indexOf(foundElement);
                console.log("La palabra igresada se encuentra en la posicion: " + indexOfFoundElement);
                const distancia = indexOfFoundElement - idx;
                switch (distancia) {
                    case 0:        //Si esta en la posicion correcta suma su puntaje
                        currentWordList[idx].puntajeObtenido_palabras += currentWordList[idx].puntaje;
                        break;
                    case 1:            //Si esta a 1 orden de distancia suma la mitad (+1 o -1)
                    case -1:
                        currentWordList[idx].puntajeObtenido_palabras += currentWordList[idx].puntaje / 2;
                        break
                    default:        //si esta a mas de un orde de distancia no suma nada

                        break;
                }

                console.log("Suma en este palabra: " + currentWordList[idx].puntajeObtenido_palabras);

            } else {
                console.log("No se encuentra el elemento, resta el puntaje de la palabra correcta");
                currentWordList[idx].puntajeObtenido_palabras -= currentWordList[idx].puntaje;
                //continue; // sigo con la proxima palabra
            }

            if (++idx < currentWordList.length)
                instruction.textContent = "Ingrese la " + (idx + 1) + "° palabra ingresada previamente\Presione Cancelar para salir";
            else
                calcularYmostrarResultado('Orden de Palabras', "puntajeObtenido_palabras");
        }

    });


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

    let puntajeMax = false;
    if (puntaje > user.maxScore) {
        user.maxScore = puntaje;
        saveUserToLocalStorage(loggedUser, user);
        scoresText.textContent = "Puntaje maximo: " + user.maxScore;
        startFireworks();
        puntajeMax = true;
    }

    scoreh3.textContent = "Puntaje obtenido en " + nombreJuego + ": " + puntaje + " de un máximo de " + puntajeMaximo + "\nRendimiento: " + rendimiento + "%";
    scoreh3.textContent += puntajeMax ? "\nNuevo Puntaje Máximo!" : "";

    submitAnswer.style.display = 'none'
    answerInput.style.display = 'none';
    //commonSetupsAfterGame();
}

function borrarPuntaje() {
    currentWordList.forEach(el => el.borrarPuntaje());
}

function showGameButtons() {

    startCountButton.style.display = 'block';
    orderWordsButton.style.display = 'block';
}
function hideGameButtons() {

    startCountButton.style.display = 'none';
    orderWordsButton.style.display = 'none';
}

function deserializeInputWord(obj) {
    const inputWord = new InputWord(obj.word, obj.letra);
    inputWord.cantidad = obj.cantidad;
    inputWord.puntajeObtenido_letras = obj.puntajeObtenido_letras;
    inputWord.puntajeObtenido_palabras = obj.puntajeObtenido_palabras;
    return inputWord;
}

function hideWordList() {
    ulWords.style.display = 'none';
    inputWordButton.style.display = 'none'
}
function showWordList() {

    ulWords.style.display = 'block';
    inputWordButton.style.display = 'block'
}

//Serializo y guardo
function saveUserToLocalStorage(username, user) {
    localStorage.setItem(username, JSON.stringify(user.serialize()));
}

//Leo y de-serializo
function getUserFromLocalStorage(username) {
    const storedUser = JSON.parse(localStorage.getItem(username));
    if (storedUser) {
        return User.deserialize(storedUser);
    } else {
        return null;
    }
}

function startFireworks() {
    for (let i = 0; i < 15; i++) {
        setTimeout(createFirework, i * 500);
    }
}

function createFirework() {
    const firework = document.createElement("div");
    firework.classList.add("firework");

    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    firework.style.backgroundColor = randomColor;

    const maxX = window.innerWidth - 10;
    const maxY = window.innerHeight - 10;
    const randomX = Math.random() * maxX + 5;
    const randomY = Math.random() * maxY + 5;

    firework.style.left = randomX + "px";
    firework.style.top = randomY + "px";

    document.body.appendChild(firework);

    firework.addEventListener("animationend", () => {
        document.body.removeChild(firework);
    });
}
