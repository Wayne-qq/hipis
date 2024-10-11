// Import Firebase and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBN2nI_MPDLD8fHSkp9Dnno2rSL2hklcLA",
    authDomain: "haps-58ff8.firebaseapp.com",
    projectId: "haps-58ff8",
    storageBucket: "haps-58ff8.appspot.com",
    messagingSenderId: "348213007637",
    appId: "1:348213007637:web:70a2691a4887a0073a851c",
    measurementId: "G-05YZ3DN1FE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

// Основні змінні
let mainDate = ''; // Змінна для дати народження
let username = ''; // Змінна для username з телеграму
let balance = 0; // Змінна для балансу

// Отримуємо Telegram API та ID користувача
const tg = window.Telegram ? window.Telegram.WebApp : null;
const tgUserId = tg && tg.initDataUnsafe?.user?.id ? tg.initDataUnsafe.user.id : 'Admin'; // Отримуємо Telegram ID або записуємо 'Admin', якщо ID не знайдено
username = tg && tg.initDataUnsafe?.user?.username ? `@${tg.initDataUnsafe.user.username}` : 'Unknown'; // Записуємо @username або 'Unknown', якщо не знайдено

// Перевірка наявності користувача в базі даних
async function checkUserExists() {
    const docRef = doc(db, "users", tgUserId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        console.log("Користувач вже існує в базі даних");
        // Якщо користувач вже є в базі, ховаємо блок з датою
        document.querySelector('.main__date').style.display = 'none';
        document.querySelector('.main__home').style.display = 'block';
    } else {
        // Якщо користувача не існує, показуємо блок з перевіркою дати
        document.querySelector('.main__date').style.display = 'block';
    }
}

// Функція для збереження даних користувача в базу
async function saveUserData(dateOfBirth) {
    const docRef = doc(db, "users", tgUserId); // Використовуємо Telegram ID або Admin

    // Записуємо всі дані в базу (dateOfBirth, username, balance)
    try {
        await setDoc(docRef, {
            dateOfBirth: dateOfBirth,
            username: username,
            balance: balance
        });
        console.log("Дані користувача успішно записані в базу даних");
    } catch (error) {
        console.error("Помилка при записі в базу даних: ", error);
    }
}

// Обробка введення дати
document.getElementById('dateInput').addEventListener('input', function (e) {
    let input = e.target;
    let value = input.value.replace(/\D/g, ''); // Забираємо все, що не є цифрою
    let formattedValue = '';

    // Форматуємо дату у вигляді DD/MM/YYYY
    if (value.length > 0) {
        formattedValue += value.substring(0, 2); // День
    }
    if (value.length > 2) {
        formattedValue += '/' + value.substring(2, 4); // Місяць
    }
    if (value.length > 4) {
        formattedValue += '/' + value.substring(4, 8); // Рік
    }
    input.value = formattedValue;

    // Валідація дня, місяця та року
    const [day, month, year] = formattedValue.split('/').map(Number);
    let isValid = true;

    if (day < 1 || day > 31) {
        isValid = false;
    }
    if (month < 1 || month > 12) {
        isValid = false;
    }
    if (year < 1919 || year > 2024) {
        isValid = false;
    }

    // Якщо дата невалідна, робимо бордер червоним
    if (!isValid && formattedValue.length === 10) {
        input.classList.add('invalid');
    } else {
        input.classList.remove('invalid');
    }
});

// Обробка натискання клавіші Enter або кнопки "Далі" на мобільному
document.getElementById('dateInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === 'Done') { // Для ПК Enter, для мобільних Done
        saveDate();
    }
});

// Функція для збереження дати і запису користувача в базу
async function saveDate() {
    const input = document.getElementById('dateInput');
    const formattedValue = input.value;

    // Перевірка, чи правильно введена дата (довжина 10 символів)
    if (formattedValue.length === 10 && !input.classList.contains('invalid')) {
        mainDate = formattedValue; // Зберігаємо дату у змінну
        console.log("Дата збережена:", mainDate);

        // Перевіряємо чи користувач існує і записуємо дані
        const docRef = doc(db, "users", tgUserId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // Якщо користувача не існує, записуємо його
            await saveUserData(mainDate);
        }

        // Ховаємо блок з датою і показуємо блок з користувачем
        document.querySelector('.main__date').style.display = 'none';
        document.querySelector('.main__home').style.display = 'block';

    } else {
        alert('Введіть правильну дату.');
    }
}

// Викликаємо функцію для перевірки користувача при завантаженні сторінки
checkUserExists();





// ПРЕЛОАДЕР ПРЕЛОАДЕР ПРЕЛОАДЕР ПРЕЛОАДЕР
window.addEventListener('load', function() {
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }

        // Після приховування прелодера перевіряємо, чи користувач є в базі
        checkUserExists();
    }, 2000);
});





document.getElementById('UserShow').addEventListener('click', function() {
    const mainHome = document.querySelector('.main__home');
    const mainUser = document.querySelector('.main__user');
    
    mainHome.style.display = 'none';
    mainUser.style.display = 'block';
});

document.getElementById('HomeShow').addEventListener('click', function() {
    const mainHome = document.querySelector('.main__home');
    const mainUser = document.querySelector('.main__user');
    
    mainUser.style.display = 'none';
    mainHome.style.display = 'block';
});

document.querySelector('.connect__wallet').addEventListener('click', function() {
    const mainUser = document.querySelector('.main__user');
    const mainWallet = document.querySelector('.main__wallet');
    
    mainUser.style.display = 'none';
    mainWallet.style.display = 'block';
});

document.getElementById('HomeShow2').addEventListener('click', function() {
    const mainHome = document.querySelector('.main__home');
    const mainWallet = document.querySelector('.main__wallet');
    
    mainWallet.style.display = 'none';
    mainHome.style.display = 'block';
});

document.getElementById('UserShow2').addEventListener('click', function() {
    const mainUser = document.querySelector('.main__user');
    const mainWallet = document.querySelector('.main__wallet');

    mainWallet.style.display = 'none';
    mainUser.style.display = 'block';
});


