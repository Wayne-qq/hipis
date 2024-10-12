// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
// import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyBN2nI_MPDLD8fHSkp9Dnno2rSL2hklcLA",
//     authDomain: "haps-58ff8.firebaseapp.com",
//     projectId: "haps-58ff8",
//     storageBucket: "haps-58ff8.appspot.com",
//     messagingSenderId: "348213007637",
//     appId: "1:348213007637:web:70a2691a4887a0073a851c",
//     measurementId: "G-05YZ3DN1FE"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app); // Initialize Firestore

// let mainDate = ''; // Змінна для дати народження
// let username = ''; // Змінна для username з телеграму
// let balance = 0; // Змінна для балансу

// // Ініціалізуємо WebApp Telegram
// const tg = window.Telegram ? window.Telegram.WebApp : null;
// let tgUserId = ''; // Змінна для збереження Telegram ID

// // Отримуємо дані користувача
// if (tg && tg.initDataUnsafe?.user?.id) {
//     tgUserId = tg.initDataUnsafe.user.id; // Записуємо Telegram ID
//     username = tg.initDataUnsafe.user.username ? `@${tg.initDataUnsafe.user.username}` : 'Unknown'; // Записуємо @username або 'Unknown', якщо не знайдено
// } else {
//     alert('Telegram ID не знайдено.');
//     document.querySelector('.main__home').style.display = 'block';
// }

// // Функція для перевірки користувача
// async function checkUserExists() {
//     if (!tgUserId) {
//         alert('Telegram ID не знайдено. Ви не можете продовжити.');
//         document.querySelector('.main__date').style.display = 'none';
//         return; // Зупиняємо виконання, якщо немає Telegram ID
//     }

//     const docRef = doc(db, "users", tgUserId);
//     const docSnap = await getDoc(docRef);
    
//     if (docSnap.exists()) {
//         console.log("Користувач вже існує в базі даних");
//         document.querySelector('.main__date').style.display = 'none';
//         document.querySelector('.main__home').style.display = 'block';
//     } else {
//         document.querySelector('.main__date').style.display = 'block';
//     }
// }

// // Функція для збереження даних користувача
// async function saveUserData(dateOfBirth) {
//     const docRef = doc(db, "users", tgUserId);

//     try {
//         await setDoc(docRef, {
//             userId: tgUserId, // Збереження Telegram ID
//             dateOfBirth: dateOfBirth,
//             username: username,
//             balance: balance
//         });
//         console.log("Дані користувача успішно записані в базу даних");
//     } catch (error) {
//         console.error("Помилка при записі в базу даних: ", error);
//     }
// }

// // Форматування введеної дати
// document.getElementById('dateInput').addEventListener('input', function (e) {
//     let input = e.target;
//     let value = input.value.replace(/\D/g, ''); // Забираємо все, що не є цифрою
//     let formattedValue = '';

//     if (value.length > 0) {
//         formattedValue += value.substring(0, 2); // День
//     }
//     if (value.length > 2) {
//         formattedValue += '/' + value.substring(2, 4); // Місяць
//     }
//     if (value.length > 4) {
//         formattedValue += '/' + value.substring(4, 8); // Рік
//     }
//     input.value = formattedValue;

//     const [day, month, year] = formattedValue.split('/').map(Number);
//     let isValid = true;

//     if (day < 1 || day > 31) {
//         isValid = false;
//     }
//     if (month < 1 || month > 12) {
//         isValid = false;
//     }
//     if (year < 1919 || year > 2024) {
//         isValid = false;
//     }

//     if (!isValid && formattedValue.length === 10) {
//         input.classList.add('invalid');
//     } else {
//         input.classList.remove('invalid');
//     }
// });

// // Обробка натискання клавіш для збереження дати
// document.getElementById('dateInput').addEventListener('keydown', function (e) {
//     if (e.key === 'Enter' || e.key === 'Done') { // Для ПК Enter, для мобільних Done
//         saveDate();
//     }
// });

// // Функція для збереження дати
// async function saveDate() {
//     const input = document.getElementById('dateInput');
//     const formattedValue = input.value;

//     if (formattedValue.length === 10 && !input.classList.contains('invalid')) {
//         mainDate = formattedValue; // Зберігаємо дату у змінну
//         console.log("Дата збережена:", mainDate);

//         const docRef = doc(db, "users", tgUserId);
//         const docSnap = await getDoc(docRef);

//         if (!docSnap.exists()) {
//             await saveUserData(mainDate);
//         }
//         document.querySelector('.main__date').style.display = 'none';
//         document.querySelector('.main__home').style.display = 'block';

//     } else {
//         alert('Введіть правильну дату.');
//     }
// }

// // Прелоадер
// window.addEventListener('load', function() {
//     setTimeout(function() {
//         const preloader = document.querySelector('.preloader');
//         if (preloader) {
//             preloader.style.display = 'none';
//         }

//         // Навіть якщо ID не отримано, все одно показати секцію
//         if (tgUserId) {
//             checkUserExists();
//         } else {
//             document.querySelector('.main__home').style.display = 'block';
//             alert('Telegram ID не знайдено, відображаємо домашню секцію.');
//         }
//     }, 2000);
// });


// // Відображення імені користувача
// const userButton = document.getElementById('UserShow');
// if (userButton) {
//     userButton.textContent = username !== 'Unknown' ? username : 'Admin'; // Показуємо username або "Admin"
// }



// document.getElementById('UserShow').addEventListener('click', function() {
//     const mainHome = document.querySelector('.main__home');
//     const mainUser = document.querySelector('.main__user');
    
//     mainHome.style.display = 'none';
//     mainUser.style.display = 'block';
// });

// document.getElementById('HomeShow').addEventListener('click', function() {
//     const mainHome = document.querySelector('.main__home');
//     const mainUser = document.querySelector('.main__user');
    
//     mainUser.style.display = 'none';
//     mainHome.style.display = 'block';
// });

// document.querySelector('.connect__wallet').addEventListener('click', function() {
//     const mainUser = document.querySelector('.main__user');
//     const mainWallet = document.querySelector('.main__wallet');
    
//     mainUser.style.display = 'none';
//     mainWallet.style.display = 'block';
// });

// document.getElementById('HomeShow2').addEventListener('click', function() {
//     const mainHome = document.querySelector('.main__home');
//     const mainWallet = document.querySelector('.main__wallet');
    
//     mainWallet.style.display = 'none';
//     mainHome.style.display = 'block';
// });

// document.getElementById('UserShow2').addEventListener('click', function() {
//     const mainUser = document.querySelector('.main__user');
//     const mainWallet = document.querySelector('.main__wallet');

//     mainWallet.style.display = 'none';
//     mainUser.style.display = 'block';
// });


