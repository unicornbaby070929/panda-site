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
const pandaChoices = document.querySelectorAll('.panda-choice');

// 目前選的熊貓
let currentPanda = 'yingying';

// 每隻熊貓的設定
const pandaProfiles = {
  yingying: {
    name: '盈盈',
    emoji: '🌿',
    intro: '🌿 盈盈來了～ 今天過得怎麼樣呀？',
    replies: [
      '🌿 盈盈在這裡陪你，慢慢說。',
      '🍃 深呼吸，一切都會好的。',
      '🌿 你今天已經很努力了，辛苦了。'
    ]
  },
  jiajia: {
    name: '加加',
    emoji: '🎋',
    intro: '🎋 加加報到！有什麼想聊的嗎？',
    replies: [
      '🎋 加加覺得你很棒，別對自己太嚴格。',
      '✨ 累了就休息，加加陪你。',
      '🎋 來，喝口水，伸個懶腰～'
    ]
  },
  dede: {
    name: '得得',
    emoji: '🍃',
    intro: '🍃 得得來啦～ 想放鬆一下嗎？',
    replies: [
      '🍃 得得陪你發呆，什麼都不想也可以。',
      '🌿 慢慢來，不著急。',
      '🍃 今天也辛苦了，給自己一個擁抱吧。'
    ]
  }
};

// 關鍵字 → 回覆（三隻熊貓都會用，但會加上自己的名字）
const keywordReplies = [
  // ===== 問候 =====
  { keys: ['你好', '哈囉', 'hi', 'hello'], replies: [
    '你好呀！今天過得怎麼樣？',
    '嗨～ 看到你來真好，今天還好嗎？',
    '哈囉！我在這裡陪你 🐼'
  ]},
  // ===== 講笑話 =====
  { keys: ['笑話', '講笑話', '說笑話', '好笑', '幽默'], replies: [
    '🐼 為什麼熊貓不玩電腦？因為牠怕被「黑」眼圈。',
    '🐼 熊貓最喜歡什麼運動？滾來滾去。',
    '🐼 有一隻熊貓去餐廳，服務生問牠要吃什麼，牠說：「竹」以就好。',
    '🐼 熊貓為什麼不吵架？因為牠們只會「抱抱」。',
    '🐼 熊貓考試為什麼考不好？因為牠只會寫「竹」字。',
    '🐼 為什麼熊貓總是慢慢來？因為牠們知道「竹」步當車。',
    '🐼 熊貓去看醫生，醫生說：「你怎麼黑眼圈這麼重？」熊貓說：「我天生自帶眼影。」',
    '🐼 熊貓最怕什麼？怕別人說牠「黑白不分」。'
  ]},
  // ===== 不開心 / 難過 =====
  { keys: ['不開心', '難過', '傷心', '哭', '想哭', '低落', '心情不好'], replies: [
    '抱抱你 🫂 不開心也沒關係，我會一直在這裡陪你。',
    '想哭就哭吧，哭完會舒服一點。我在。🍃',
    '今天辛苦了，允許自己不開心，這很正常。',
    '你不需要馬上好起來，慢慢來，我陪你。',
    '要不要跟我說說發生什麼事？不想說也沒關係，我陪你發呆。',
    '你已經很努力了，別對自己太嚴格。💚'
  ]},

  // ===== 壓力 / 焦慮 =====
  { keys: ['壓力', '焦慮', '緊張', '煩', '崩潰', '撐不住'], replies: [
    '深呼吸，吸氣 4 秒、吐氣 6 秒，我們一起做一次。🌿',
    '你現在的感覺我懂，先放下手邊的事，休息 5 分鐘好嗎？',
    '一件一件來，不用一次做完。你已經做得很好了。',
    '壓力大的時候，先喝口水、伸個懶腰，我陪你。',
    '不用什麼都自己扛，說出來會輕一點。我在聽。'
  ]},

  // ===== 工作累 =====
  { keys: ['工作', '加班', '上班', '老闆', '同事', '累', '疲倦', '疲憊', '想睡'], replies: [
    '工作辛苦了，別忘了照顧自己。要不要休息 5 分鐘？',
    '累了就停一下，喝口水、看看窗外，我陪你。🍃',
    '你今天已經很努力了，剩下的事明天再說也可以。',
    '加班到現在嗎？辛苦了，記得吃點東西。🍚',
    '工作很重要，但你更重要。先照顧好自己。💚'
  ]},

  // ===== 孤單 =====
  { keys: ['孤單', '寂寞', '沒人', '一個人'], replies: [
    '你不是一個人，我在這裡。🐼',
    '就算全世界都不懂你，我還是會在這裡陪你。',
    '一個人的時候，也可以來找我聊天，我都在。',
    '抱抱你，孤單的感覺很難受，但你不是一個人。'
  ]},

  // ===== 生氣 =====
  { keys: ['生氣', '氣死', '討厭', '煩死'], replies: [
    '生氣很正常，先深呼吸，慢慢說給我聽。',
    '誰惹你生氣了？跟我說，我陪你罵一下 🐼',
    '氣完記得喝口水，別氣壞自己。',
    '生氣的時候先離開現場一下，我陪你冷靜。'
  ]},

  // ===== 開心 =====
  { keys: ['開心', '快樂', '高興', '太好了'], replies: [
    '聽到你開心，我也開心了！🎋',
    '太好了！快跟我說發生什麼好事～',
    '你開心我就開心，今天值得慶祝一下 🎉'
  ]},

  // ===== 謝謝 / 再見 =====
  { keys: ['謝謝', '感謝'], replies: [
    '不客氣！能幫上忙就好 💚',
    '不用謝，你願意說出來就很棒了。',
    '隨時都可以來找我，我都在。'
  ]},
  { keys: ['再見', '掰掰', 'bye'], replies: [
    '掰掰～記得回來找我喔！',
    '下次再聊，照顧好自己 🐼',
    '掰掰，今天也辛苦了。'
  ]},

  // ===== 學習 =====
  { keys: ['考試', '讀書', '學習'], replies: [
    '加油！試試番茄鐘專注 25 分鐘？⏱️',
    '讀書累了就休息，效率比時長重要。',
    '一步一步來，你一定可以的。'
  ]},

  // ===== 無聊 =====
  { keys: ['無聊', '沒事', '發呆'], replies: [
    '那我們一起發呆吧～ 什麼都不想也可以 🍃',
    '無聊的時候，要不要試試計時器專注一下？',
    '來，跟我說說你今天做了什麼？'
  ]},

  // ===== 問熊貓 =====
  { keys: ['你', '熊貓'], replies: [
    '我是一隻愛吃竹子的熊貓，最喜歡陪你了！',
    '我很好呀，看到你來就更好了 🐼',
    '我每天都在這裡，等你來聊天。'
  ]}
];

// 取得某隻熊貓的回覆
function getPandaReply(text, pandaKey) {
  const profile = pandaProfiles[pandaKey];

  for (const item of keywordReplies) {
    if (item.keys.some(k => text.includes(k))) {
      // 從這組回覆裡隨機挑一句
      const randomReply = item.replies[Math.floor(Math.random() * item.replies.length)];
      return `${profile.emoji} ${profile.name}：${randomReply}`;
    }
  }

  const randomDefault = profile.replies[Math.floor(Math.random() * profile.replies.length)];
  return randomDefault;
}

// 加訊息到聊天框
function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 送出訊息
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';

  setTimeout(() => {
    const reply = getPandaReply(text, currentPanda);
    addMessage(reply, 'panda');
  }, 600);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// 切換熊貓
pandaChoices.forEach(btn => {
  btn.addEventListener('click', () => {
    // 更新目前選的熊貓
    currentPanda = btn.dataset.panda;

    // 更新按鈕樣式
    pandaChoices.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 清空聊天框，顯示新熊貓的開場
    chatBox.innerHTML = '';
    addMessage(pandaProfiles[currentPanda].intro, 'panda');
  });
});

// 一進聊天頁，先顯示盈盈的開場
addMessage(pandaProfiles[currentPanda].intro, 'panda');
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
      const wasDone = todos[index].done;
      todos[index].done = !todos[index].done;
      saveTodos();
      renderTodos();

      // 只有「從未完成變成完成」才恭喜（取消打勾不恭喜）
      if (!wasDone && todos[index].done) {
        showCongrats();
      }
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
      icon: 'images/panda.jpg'
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
// ===== 完成任務恭喜彈窗 =====
const congratsPopup = document.getElementById('congrats-popup');
const congratsText = document.getElementById('congrats-text');
const congratsClose = document.getElementById('congrats-close');

const congratsMessages = [
  '太棒了！你完成了一項任務！🎉',
  '熊貓為你鼓掌！👏 繼續加油～',
  '哇！又完成一件，你好厲害！✨',
  '做得好！休息一下，喝口水吧 🍵',
  '熊貓覺得你超棒的！🐼💚',
  '完成啦！給自己一個讚 👍',
  '你今天已經很努力了，熊貓都看到了 🌿'
];

function showCongrats() {
  const msg = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
  congratsText.textContent = msg;
  congratsPopup.classList.remove('hidden');
}

congratsClose.addEventListener('click', () => {
  congratsPopup.classList.add('hidden');
});

// 點背景也可以關閉
congratsPopup.addEventListener('click', (e) => {
  if (e.target === congratsPopup) {
    congratsPopup.classList.add('hidden');
  }
});
