import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBN2nI_MPDLD8fHSkp9Dnno2rSL2hklcLA",
  authDomain: "haps-58ff8.firebaseapp.com",
  projectId: "haps-58ff8",
  storageBucket: "haps-58ff8.appspot.com",
  messagingSenderId: "348213007637",
  appId: "1:348213007637:web:70a2691a4887a0073a851c",
  measurementId: "G-05YZ3DN1FE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Ініціалізуємо Firestore

let mainDate = ''; // Змінна для дати народження
let username = ''; // Змінна для username з телеграму
let balance = 0; // Змінна для балансу
let daysUntilBirthday = 0; // Змінна для кількості днів до дня народження

// Ініціалізуємо WebApp Telegram
const tg = window.Telegram ? window.Telegram.WebApp : null;
let id = ''; // Змінна для збереження Telegram ID

// Отримуємо дані користувача
if (tg && tg.initDataUnsafe?.user?.id) {
  id = tg.initDataUnsafe.user.id; // Записуємо Telegram ID
  username = tg.initDataUnsafe.user.username ? `@${tg.initDataUnsafe.user.username}` : 'Unknown'; // Записуємо @username або 'Unknown', якщо не знайдено
} else {
  id = 'admin'; // Якщо не знайдено, встановлюємо значення 'admin'
  username = 'admin'; // Якщо не знайдено, встановлюємо 'admin' для username
  alert('Telegram ID не знайдено, встановлено як admin.');
  document.querySelector('.main__home').style.display = 'block';
}

// Функція для перевірки користувача
async function checkUserExists() {
  if (!id) {
    alert('Telegram ID не знайдено. Ви не можете продовжити.');
    document.querySelector('.main__date').style.display = 'none';
    return; // Зупиняємо виконання, якщо немає Telegram ID
  }

  const docRef = doc(db, "users", `${id}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    mainDate = docSnap.data().dateOfBirth; // Отримуємо дату народження з бази
    balance = docSnap.data().balance; // Отримуємо баланс з бази
    daysUntilBirthday = docSnap.data().daysUntilBirthday; // Отримуємо кількість днів до дня народження
    document.querySelector('.balance__num').textContent = balance; // Оновлюємо відображення балансу
    document.querySelector('.main__date').style.display = 'none';
    document.querySelector('.main__home').style.display = 'block';
  } else {
    document.querySelector('.main__date').style.display = 'block';
  }
}

// Функція для збереження даних користувача
async function saveUserData(dateOfBirth) {
  const docRef = doc(db, "users", `${id}`);

  try {
    await setDoc(docRef, {
      userId: id, // Збереження Telegram ID або 'admin'
      dateOfBirth: dateOfBirth,
      username: username,
      balance: balance,
      daysUntilBirthday: calculateDaysUntilBirthday(dateOfBirth), // Зберігаємо кількість днів до дня народження
      lastBonusClaimed: null // Додаємо поле для дати останнього отримання бонусу
    });
    console.log("Дані користувача успішно записані в базу даних");
  } catch (error) {
    console.error("Помилка при записі в базу даних: ", error);
  }
}

// Функція для обчислення кількості днів до наступного дня народження
function calculateDaysUntilBirthday(birthdayFromDB) {
  const [day, month] = birthdayFromDB.split('/'); // Отримуємо день та місяць з дати
  const today = new Date();
  const currentYear = today.getFullYear();

  let nextBirthday = new Date(currentYear, month - 1, day); // Створюємо дату наступного дня народження
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1); // Якщо день народження вже пройшов цього року, додаємо рік
  }

  const diffTime = nextBirthday - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Обчислюємо різницю в днях
  console.log(`До наступного дня народження залишилось ${diffDays} днів.`);

  return diffDays; // Повертаємо кількість днів до дня народження
}

// Функція для оновлення балансу у базі даних
async function updateBalanceInDB(newBalance) {
  const docRef = doc(db, "users", `${id}`);

  try {
    await setDoc(docRef, {
      balance: newBalance,
      daysUntilBirthday: daysUntilBirthday // Оновлюємо кількість днів до дня народження
    }, { merge: true }); // Об'єднуємо нові дані з існуючими
    console.log("Баланс успішно оновлено в базі даних");
  } catch (error) {
    console.error("Помилка при оновленні балансу: ", error);
  }
}

// Форматування введеної дати
document.getElementById('dateInput').addEventListener('input', function (e) {
  let input = e.target;
  let value = input.value.replace(/\D/g, ''); // Забираємо все, що не є цифрою
  let formattedValue = '';

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

  if (!isValid && formattedValue.length === 10) {
    input.classList.add('invalid');
  } else {
    input.classList.remove('invalid');
  }
});

// Обробка натискання клавіш для збереження дати
document.getElementById('dateInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === 'Done') { // Для ПК Enter, для мобільних Done
    saveDate();
  }
});

// Функція для збереження дати
async function saveDate() {
  const input = document.getElementById('dateInput');
  const formattedValue = input.value;

  if (formattedValue.length === 10 && !input.classList.contains('invalid')) {
    mainDate = formattedValue; // Зберігаємо дату у змінну
    console.log("Дата збережена:", mainDate);

    const docRef = doc(db, "users", `${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await saveUserData(mainDate);
    }

    // Оновлюємо дні до дня народження
    daysUntilBirthday = calculateDaysUntilBirthday(mainDate);
    
    document.querySelector('.balance__num').textContent = balance; // Оновлюємо відображення балансу
    document.querySelector('.main__date').style.display = 'none';
    document.querySelector('.main__home').style.display = 'block';

  } else {
    alert('Введіть правильну дату.');
  }
}

// Функція для нарахування щоденного бонусу
async function claimDailyBonus() {
    const docRef = doc(db, "users", `${id}`);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const lastBonusClaimed = userData.lastBonusClaimed;
  
      const today = new Date().toDateString();
      const lastBonusDate = lastBonusClaimed ? lastBonusClaimed.toDate().toDateString() : null;
  
      if (lastBonusDate === today) {
        console.log('Ви сьогодні вже отримали бонус!');
      } else {
        // Переконайтеся, що daysUntilBirthday актуальний
        const daysUntilBirthday = calculateDaysUntilBirthday(mainDate); // Отримуємо кількість днів до дня народження
        const bonusAmount = 365 - daysUntilBirthday; // Сума бонусу - 365 - кількість днів до дня народження
        balance += bonusAmount; // Нараховуємо бонус
        await updateBalanceInDB(balance); // Оновлюємо баланс у базі даних
  
        // Оновлюємо дату останнього отримання бонусу
        await setDoc(docRef, {
          lastBonusClaimed: new Date()
        }, { merge: true });
  
        console.log('Бонус нараховано! Сума: ' + bonusAmount);
        document.querySelector('.balance__num').textContent = balance; // Оновлюємо відображення балансу
      }
    }
  }
  
  

// Додаємо обробник події для кнопки нарахування бонусу
document.getElementById('claimBonusButton').addEventListener('click', claimDailyBonus);

// Викликаємо функцію для перевірки користувача
checkUserExists();

// Прелоадер
window.addEventListener('load', function () {
  setTimeout(function () {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }

    // Навіть якщо ID не отримано, все одно показати секцію
    if (id) {
      checkUserExists();
    } else {
      document.querySelector('.main__home').style.display = 'block';
      alert('Telegram ID не знайдено, відображаємо домашню секцію.');
    }
  }, 2000);
});
















  
// Відображення імені користувача
const userButton = document.getElementById('UserShow');
if (userButton) {
    userButton.textContent = username !== 'Unknown' ? username : 'Admin'; // Показуємо username або "Admin"
}



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

