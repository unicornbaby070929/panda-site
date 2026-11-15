const tabButtons = document.querySelectorAll('.nav-buttons button');
const tabs = document.querySelectorAll('.tab');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // 移除所有 active
    tabButtons.forEach(b => b.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    // 加上 active
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});
// ===== 計時器 =====
let timeLeft = 25 * 60;   // 25 分鐘 = 1500 秒
let timerInterval = null;
let running = false;

const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

function updateDisplay() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  timeDisplay.textContent = `${m}:${s}`;
}

startBtn.addEventListener('click', () => {
  if (running) {
    // 暫停
    clearInterval(timerInterval);
    startBtn.textContent = '繼續';
    running = false;
  } else {
    // 開始
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        running = false;
        startBtn.textContent = '開始';
        alert('🐼 時間到！休息一下吧～');
      }
    }, 1000);
    startBtn.textContent = '暫停';
    running = true;
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timeLeft = 25 * 60;
  running = false;
  startBtn.textContent = '開始';
  updateDisplay();
});

updateDisplay();
// ===== 聊天 =====
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// 熊貓的隨機回覆
const pandaReplies = [
  '🐼 嗯嗯，我在聽～',
  '🍃 慢慢來，不著急。',
  '💚 你已經做得很好了！',
  '🎋 熊貓覺得你該休息一下了。',
  '🐼 要記得喝水喔～',
  '✨ 相信自己，你可以的！',
  '🌿 深呼吸，一切都會好的。',
  '🐼 今天也辛苦你了！'
];
// 關鍵字 → 對應回覆
const keywordReplies = [
  { keys: ['你好', '哈囉', 'hi', 'hello'], reply: '🐼 你好呀！今天過得怎麼樣？' },
  { keys: ['開心', '快樂', '高興'], reply: '🐼 聽到你開心，熊貓也開心了！🎋' },
  { keys: ['難過', '傷心', '不開心', '哭'], reply: '🐼 抱抱你，沒關係的，熊貓陪著你。🍃' },
  { keys: ['累', '疲倦', '想睡'], reply: '🐼 辛苦了，去休息一下吧，喝口水～' },
  { keys: ['謝謝', '感謝'], reply: '🐼 不客氣！能幫上忙就好 💚' },
  { keys: ['再見', '掰掰', 'bye'], reply: '🐼 掰掰～記得回來找熊貓喔！' },
  { keys: ['考試', '讀書', '學習'], reply: '🐼 加油！番茄鐘專注 25 分鐘試試？⏱️' },
  { keys: ['你', '熊貓'], reply: '🐼 我是一隻愛吃竹子的熊貓，最喜歡陪你了！' }
];

function getPandaReply(text) {
  // 先找關鍵字
  for (const item of keywordReplies) {
    if (item.keys.some(k => text.includes(k))) {
      return item.reply;
    }
  }
  // 沒對到關鍵字 → 隨機回
  return pandaReplies[Math.floor(Math.random() * pandaReplies.length)];
}

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';

  // 熊貓延遲 0.6 秒回覆，比較自然
  setTimeout(() => {
   const reply = getPandaReply(text);
    addMessage(reply, 'panda');
  }, 600);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
// ===== 學習待辦 =====
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// 從 localStorage 讀取已存的待辦
let todos = JSON.parse(localStorage.getItem('panda-todos')) || [];

// 存回 localStorage
function saveTodos() {
  localStorage.setItem('panda-todos', JSON.stringify(todos));
}

// 畫面渲染
function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '❌';

    // 點文字切換完成
    li.addEventListener('click', () => {
      todos[index].done = !todos[index].done;
      saveTodos();
      renderTodos();
    });

    // 點 ❌ 刪除（阻止冒泡，避免觸發上面的打勾）
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(textSpan);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

// 新增
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ text, done: false });
  saveTodos();
  renderTodos();
  todoInput.value = '';
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// 一打開就顯示已存的資料
renderTodos();
// ===== 吃飯提醒（系統通知）=====
const notifyBtn = document.getElementById('notify-btn');

// 檢查今天是否已提醒過（用 localStorage 記日期）
function getTodayKey() {
  return new Date().toDateString();
}

let mealRemindedToday =
  localStorage.getItem('meal-reminded') === getTodayKey();

// 按鈕：請求通知權限
notifyBtn.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    alert('😢 你的瀏覽器不支援通知功能');
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    notifyBtn.textContent = '✅ 提醒已開啟';
    notifyBtn.classList.add('enabled');
      new Notification('🐼 熊貓小站', {
      body: '姐姐，吃飯提醒已開啟！12:35 會提醒你吃飯～',
      icon: 'images/panda.png'
    });
  } else {
    alert('❌ 你拒絕了通知權限，請到瀏覽器設定裡重新允許');
  }
});

// 每 30 秒檢查一次時間
setInterval(() => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const today = getTodayKey();

  // 跨天就重置
  if (localStorage.getItem('meal-reminded') !== today) {
    mealRemindedToday = false;
  }

  // 12:35 且今天還沒提醒過 → 發通知
  if (h === 12 && m === 35 && !mealRemindedToday) {
    mealRemindedToday = true;
    localStorage.setItem('meal-reminded', today);

        if (Notification.permission === 'granted') {
      new Notification('🐼 姐姐該吃飯了！', {
        body: '姐姐～ 12:35 到囉，該去吃午餐了 🍚 熊貓陪你一起吃 🎋',
        icon: 'images/panda.jpg'
      });
    }
  }
}, 30000);
// ===== 飄落裝飾 =====
const petalsContainer = document.getElementById('petals');
const petalEmojis = ['🌸', '🍃', '🎋', '🌿', '✨'];

function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  petal.style.left = Math.random() * 100 + '%';
  petal.style.fontSize = (12 + Math.random() * 16) + 'px';
  petal.style.animationDuration = (6 + Math.random() * 8) + 's';
  petal.style.animationDelay = Math.random() * 2 + 's';
  petalsContainer.appendChild(petal);

  // 動畫結束後移除，避免累積太多元素
  setTimeout(() => petal.remove(), 15000);
}

// 每 0.8 秒產生一片
setInterval(createPetal, 800);

// 一開始先灑幾片
for (let i = 0; i < 5; i++) createPetal();

