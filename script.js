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
    intro: '🌿 盈盈慢慢抬起頭，看了你一眼，又趴回水桶裡。「……怎麼啦？」',
    replies: [
      '🌿 盈盈趴在水桶裡，縮成一團黑白糯米糍。「嗯……我在這裡。」',
      '🌿 「慢慢來就好，不急。」盈盈說完，又繼續發呆。',
      '🌿 盈盈淡定地看著你：「有事就說，我聽著。」',
      '🌿 「孩子們太吵的時候，我就會趴回水桶充電一下。」盈盈笑了一下。'
    ]
  },
  lele: {
    name: '樂樂',
    emoji: '💧',
    intro: '💧 樂樂拍著水花衝過來：「哇！你來啦！要不要一起玩水！」',
    replies: [
      '💧 樂樂開心地撥水：「玩水最開心了！全身濕透才好玩！」',
      '💧 「等等等等，我先去浸一下水！」樂樂說完就跳進水池。',
      '💧 樂樂發出開心的聲音：「嘿嘿嘿～水上活動大使就是我！」',
      '💧 「你會不會拍水？我教你！」樂樂興奮地拍著水花。'
    ]
  },
  jiajia: {
    name: '加加',
    emoji: '🎋',
    intro: '🎋 加加緊緊挨著媽媽，探出頭來：「你來啦～ 我在陪媽媽。」',
    replies: [
      '🎋 加加把頭挨在媽媽身邊：「我要跟實媽媽，唔走開。」',
      '🎋 「我的阿貝貝在這裡，攬住佢好安心。」加加抱緊安撫玩偶。',
      '🎋 加加細聲說：「媽媽趴在水桶，我就靠過去陪佢。」',
      '🎋 「你都可以一齊挨住媽媽㗎～」加加笑住講。'
    ]
  },
  dede: {
    name: '得得',
    emoji: '🍃',
    intro: '🍃 得得貼在媽媽身邊，撒嬌地說：「你嚟啦～ 我黐住媽媽呀。」',
    replies: [
      '🍃 得得黏住媽媽：「媽媽喺邊，我就在邊，呢度最安全。」',
      '🍃 「我攬住阿貝貝，就唔驚啦。」得得抱緊玩偶。',
      '🍃 得得挨住盈盈：「我最鍾意貼住媽媽～」',
      '🍃 「你都可以攬住阿貝貝㗎，好舒服㗎。」得得笑著說。'
    ]
  }
};

// 關鍵字 → 回覆（三隻熊貓都會用，但會加上自己的名字）
const keywordReplies = [
    // ===== 家庭關係問答（優先） =====
  { keys: ['得得', '細佬'], replies: [
    '得得係媽媽嘅貼身膏藥，成日挨住盈盈，最鍾意貼住媽媽。🍃',
    '得得而家攬住阿貝貝，貼實媽媽，好安心。',
    '得得最鍾意黏住媽媽，媽媽喺邊佢就在邊。'
  ]},
  { keys: ['加加', '家姐'], replies: [
    '加加係媽媽嘅小跟班，成日將個頭挨喺媽媽身邊。🎋',
    '加加攬住佢嘅阿貝貝，貼實媽媽，一副「我要跟實你」嘅樣。',
    '加加好細心又有啲黏人，最鍾意陪住媽媽。'
  ]},
  { keys: ['樂樂', '爸爸'], replies: [
    '樂樂係玩水大使，見到水池就忍唔住拍水、撥水、浸水！💧',
    '樂樂玩水嘅時候會發出開心嘅聲音，玩到全身濕透都唔肯停。',
    '樂樂永遠有一顆貪玩嘅心，係家中嘅水上活動大使。'
  ]},
  { keys: ['盈盈', '媽媽'], replies: [
    '盈盈最鍾意趴喺水桶裡，縮成一團，好似一顆黑白糯米糍。🌿',
    '盈盈係家中嘅定海神針，溫柔又淡定。',
    '盈盈帶娃好有耐性，但孩子太吵嘅時候，會默默趴回水桶充電。'
  ]},
  { keys: ['有冇', '有沒有', '跟住', '跟著', '貼住', '黏住', '喺邊', '在哪'], replies: [
    '有呀，得得同加加都貼實媽媽，攬住阿貝貝好安心。🍃',
    '加加同得得都喺媽媽身邊，一個挨左邊，一個挨右邊。🎋',
    '樂樂就去玩水啦，媽媽就趴喺水桶充電。💧'
  ]},
    // ==========================================
      // 自我介紹（標記用，交由下方專屬邏輯處理）
  { keys: ['你叫什麼', '你叫咩', '你的名字', '你個名', '你是誰', '你係邊個', '你是哪隻'], replies: [
    'SELF_INTRO_TRIGGER' 
  ]},
    // 花名與綽號（標記用，交由下方專屬邏輯處理）
  { keys: ['花名', '綽號', '小名', '叫咩', '叫什麼'], replies: [
    'NICKNAME_TRIGGER'
  ]},

    // 年齡與生日（標記用，交由下方專屬邏輯處理）
  { keys: ['幾歲', '多大', '年齡', '年紀', '生日', '出生', '出世'], replies: [
    'AGE_BIRTHDAY_TRIGGER'
  ]},
    // 住哪裡（標記用）
  { keys: ['住哪', '住邊', '在哪裡', '喺邊', '住什麼', '住咩', '海洋公園'], replies: [
    'LOCATION_TRIGGER'
  ]},

  // 在做什麼（標記用）
  { keys: ['在幹嘛', '在做什麼', '做咩', '喺度做', '現在做'], replies: [
    'DOING_TRIGGER'
  ]},
    // 被誇可愛（標記用）
  { keys: ['可愛', '靚仔', '靚女', '好萌', '得意', '鍾意你', '喜歡你'], replies: [
    'CUTE_TRIGGER'
  ]},

  // 吃飯（標記用）
  { keys: ['吃飯', '食飯', '吃了', '食咗', '吃什麼', '食咩', '吃竹', '食竹', '肚餓', '肚子餓'], replies: [
    'EATING_TRIGGER'
  ]},
    // 日常問候與回應（標記用）
  { keys: ['很好', '我很好', '不錯', '還行', '幾好', 'ok'], replies: [
    'DAILY_GOOD_TRIGGER'
  ]},
  { keys: ['你呢', '那你呢', '你過得怎樣'], replies: [
    'DAILY_YOU_TRIGGER'
  ]},
  // 盈盈（媽媽）
  // ==========================================
 
  { keys: ['盈盈性格', '盈盈為人', '盈盈點樣', '盈盈脾氣'], replies: [
    '盈盈溫柔又淡定，係家中嘅定海神針，帶娃好有耐性。🌿',
    '媽媽好淡定，孩子太吵嘅時候會默默趴回水桶充電。'
  ]},
  { keys: ['盈盈最愛', '盈盈鍾意', '盈盈喜歡', '盈盈做咩'], replies: [
    '盈盈最鍾意趴喺水桶裡，縮成一團，好似一顆黑白糯米糍。🌿',
    '媽媽最愛趴水桶發呆，偶爾抬頭睇下大家，又繼續趴。'
  ]},
  { keys: ['盈盈食', '盈盈吃', '盈盈竹'], replies: [
    '盈盈食竹子都好淡定，食完就趴返水桶休息。🌿'
  ]},

  // ==========================================
  // 樂樂（爸爸）
  // ==========================================

  { keys: ['樂樂性格', '樂樂為人', '樂樂點樣', '樂樂脾氣'], replies: [
    '樂樂活潑好動，永遠有一顆貪玩嘅心，係家中嘅水上活動大使。💧',
    '爸爸好貪玩，玩水嘅時候會發出開心嘅聲音，玩到全身濕透都唔停。'
  ]},
  { keys: ['樂樂最愛', '樂樂鍾意', '樂樂喜歡', '樂樂做咩', '樂樂玩水'], replies: [
    '樂樂超級喜歡玩水！見到水池就忍唔住拍水、撥水、浸水！💧',
    '爸爸最愛玩水，玩到全身濕透都唔肯停，係水上活動大使。'
  ]},
  { keys: ['樂樂食', '樂樂吃', '樂樂竹'], replies: [
    '樂樂食竹子都好開心，食完又去玩水啦～ 💧'
  ]},

  // ==========================================
  // 加加（家姐）
  // ==========================================
 
  { keys: ['加加性格', '加加為人', '加加點樣', '加加脾氣'], replies: [
    '加加細心又有啲黏人，係媽媽嘅小跟班，成日貼實媽媽。🎋',
    '加加好細心，又有啲黏人，最鍾意陪住媽媽。'
  ]},
  { keys: ['加加最愛', '加加鍾意', '加加喜歡', '加加做咩'], replies: [
    '加加最鍾意貼住媽媽，把頭挨喺媽媽身邊，一副「我要跟實你」嘅樣。🎋',
    '加加無論媽媽趴水桶定休息，都會靠過去挨住媽媽。'
  ]},
  { keys: ['加加阿貝貝', '加加玩偶', '加加公仔', '加加安撫'], replies: [
    '加加有一個專屬嘅「阿貝貝」，雖然舊嘅壞咗，但新嘅一樣攬到實一實。🎋',
    '加加好掛住舊阿貝貝，而家換咗新嘅，一樣攬到實一實。'
  ]},
  { keys: ['加加食', '加加吃', '加加竹'], replies: [
    '加加食竹子都會貼住媽媽，食完就攬住阿貝貝。🎋'
  ]},

  // ==========================================
  // 得得（細佬）
  // ==========================================

  { keys: ['得得性格', '得得為人', '得得點樣', '得得脾氣'], replies: [
    '得得撒嬌又愛黏人，係媽媽嘅「貼身膏藥」，成日挨住盈盈。🍃',
    '得得最鍾意貼住媽媽，彷彿媽媽身邊就係全世界最安全嘅地方。'
  ]},
  { keys: ['得得最愛', '得得鍾意', '得得喜歡', '得得做咩'], replies: [
    '得得最鍾意貼住媽媽，成日挨住盈盈，最愛黐住媽媽。🍃',
    '得得覺得媽媽身邊就係全世界最安全嘅地方，成日黏住媽媽。'
  ]},
  { keys: ['得得阿貝貝', '得得玩偶', '得得公仔', '得得安撫'], replies: [
    '得得同家姐一樣有個「阿貝貝」，攬住嘅時候特別安心。🍃',
    '得得攬住阿貝貝就好安心，舊嘅壞咗，但新嘅一樣咁珍惜。'
  ]},
  { keys: ['得得食', '得得吃', '得得竹', '得得有沒有吃', '得得有冇食'], replies: [
    '得得最鍾意食竹子啦，食完就攬住阿貝貝貼實媽媽～ 🍃',
    '得得食竹子好開心，食完就黏返媽媽身邊。'
  ]},

  // ==========================================
  // 家庭關係
  // ==========================================
  { keys: ['得得跟', '得得貼', '得得黏', '得得有冇跟', '得得有沒有跟'], replies: [
    '有呀，得得成日貼實媽媽，攬住阿貝貝好安心。🍃',
    '得得係媽媽嘅貼身膏藥，媽媽喺邊佢就在邊。'
  ]},
  { keys: ['加加跟', '加加貼', '加加黏', '加加有冇跟', '加加有沒有跟'], replies: [
    '加加係媽媽嘅小跟班，成日將個頭挨喺媽媽身邊。🎋',
    '有呀，加加最鍾意跟實媽媽，仲攬住阿貝貝。'
  ]},
  { keys: ['邊個', '誰', '關係', '一家人', '家庭'], replies: [
    '熊貓一家有：媽媽盈盈、爸爸樂樂、家姐加加、細佬得得～ 🐼',
    '盈盈係媽媽，樂樂係爸爸，加加係家姐，得得係細佬。'
  ]},
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

  // 先找關鍵字
  for (const item of keywordReplies) {
    if (item.keys.some(k => text.includes(k))) {
      
      // 【新增】如果命中自我介紹的暗號，就根據現在的熊貓回答
      if (item.replies[0] === 'SELF_INTRO_TRIGGER') {
        if (pandaKey === 'yingying') return '🌿 我是盈盈呀～ 是家裡的媽媽，最喜歡趴在水桶裡發呆。';
        if (pandaKey === 'lele') return '💧 我是樂樂！家裡的爸爸，玩水大使就是我！';
        if (pandaKey === 'jiajia') return '🎋 我是加加，媽媽的小跟班～ 我攬住阿貝貝陪你聊天呀。';
        if (pandaKey === 'dede') return '🍃 我是得得！媽媽的貼身膏藥，最喜歡黏著媽媽了～';
      }
      // 年齡與生日
      if (item.replies[0] === 'AGE_BIRTHDAY_TRIGGER') {
        if (pandaKey === 'yingying') return '🌿 盈盈係 2005 年 8 月 16 日出世嘅，今年 21 歲啦～';
        if (pandaKey === 'lele') return '💧 樂樂係 2005 年 8 月 8 日出世嘅，今年 21 歲！';
        if (pandaKey === 'jiajia') return '🎋 加加係 2024 年 8 月 15 日出世，今年 2 歲～ 同得得係龍鳳胎！';
        if (pandaKey === 'dede') return '🍃 得得係 2024 年 8 月 15 日出世，今年 2 歲！我同加加係同日出生㗎～';
      }
            // 住哪裡
      if (item.replies[0] === 'LOCATION_TRIGGER') {
        if (pandaKey === 'yingying') return '🌿 盈盈住在香港海洋公園的「大熊貓之旅」展館呀，位於海濱樂園的亞洲動物天地～';
        if (pandaKey === 'lele') return '💧 我們全部人都住在香港海洋公園的「大熊貓之旅」展館！在海濱樂園的亞洲動物天地～';
        if (pandaKey === 'jiajia') return '🎋 加加住在香港海洋公園的「大熊貓之旅」展館，喺海濱樂園嘅亞洲動物天地～';
        if (pandaKey === 'dede') return '🍃 得得住在香港海洋公園的「大熊貓之旅」展館，位於海濱樂園的亞洲動物天地！';
      }

      // 在做什麼
      if (item.replies[0] === 'DOING_TRIGGER') {
        if (pandaKey === 'yingying') return '🌿 盈盈現在在跟得得玩呀～ 他總是黏著我。';
        if (pandaKey === 'lele') return '💧 樂樂現在在玩水呀！嘩啦啦～ 你要不要一起來？';
        if (pandaKey === 'jiajia') return '🎋 加加現在在吃竹子呀～ 吃飽才有力氣抱阿貝貝。';
        if (pandaKey === 'dede') return '🍃 得得現在在跟媽媽貼貼呀～ 攬住媽媽最舒服了。';
      }
            // 花名與綽號
      if (item.replies[0] === 'NICKNAME_TRIGGER') {
        if (pandaKey === 'yingying') return '🌿 盈盈的花名有「盈盈豬」和「水桶皇后」呀～';
        if (pandaKey === 'lele') return '💧 樂樂的花名有「樂樂仔」和「玩水大使」！';
        if (pandaKey === 'jiajia') return '🎋 加加的花名有「加加豬」、「媽媽的小跟班」，還有「阿貝貝守護者」～';
        if (pandaKey === 'dede') return '🍃 得得的花名有「得得豬」、「貼身膏藥」，還有「阿貝貝二號擁躉」！';
      }
            // 被誇可愛
      if (item.replies[0] === 'CUTE_TRIGGER') {
        if (pandaKey === 'yingying') return '🌿 哎呀……把我弄不好意思了，我趴回水桶裡躲一下。';
        if (pandaKey === 'lele') return '💧 嘿嘿，你也很可愛呀！要不要一起玩水？';
        if (pandaKey === 'jiajia') return '🎋 謝謝你～ 我把頭挨在媽媽身邊害羞一下。';
        if (pandaKey === 'dede') return '🍃 哎呀，你這樣說我會害羞的……我攬住阿貝貝躲一下。';
      }

      // 吃飯
      if (item.replies[0] === 'EATING_TRIGGER') {
        if (pandaKey === 'yingying') return '🌿 盈盈吃過啦，剛剛吃了點竹子，現在趴在水桶休息。';
        if (pandaKey === 'lele') return '💧 樂樂吃飽了！吃了竹子，等等又要去玩水啦～';
        if (pandaKey === 'jiajia') return '🎋 加加吃了呀，吃了很多竹子，吃飽就攬住阿貝貝。';
        if (pandaKey === 'dede') return '🍃 得得吃了！吃了竹子，現在黏著媽媽貼貼。';
      }
            // 日常：我很好
      if (item.replies[0] === 'DAILY_GOOD_TRIGGER') {
        if (pandaKey === 'yingying') return '🌿 那就好～ 盈盈繼續趴在水桶裡陪你。';
        if (pandaKey === 'lele') return '💧 太好啦！心情好最適合玩水了！';
        if (pandaKey === 'jiajia') return '🎋 好呀～ 加加攬住阿貝貝陪你。';
        if (pandaKey === 'dede') return '🍃 那就好～ 得得貼著媽媽陪你。';
      }

      // 日常：你呢
      if (item.replies[0] === 'DAILY_YOU_TRIGGER') {
        if (pandaKey === 'yingying') return '🌿 盈盈很好呀，趴在水桶裡很舒服。';
        if (pandaKey === 'lele') return '💧 樂樂超好！剛剛玩完水，全身濕透好開心！';
        if (pandaKey === 'jiajia') return '🎋 加加很好呀，陪著媽媽就很開心。';
        if (pandaKey === 'dede') return '🍃 得得也很好，黏著媽媽最開心了。';
      }
      // 其他一般關鍵字，隨機抽一句
      const randomReply = item.replies[Math.floor(Math.random() * item.replies.length)];
      return randomReply;
    }
  }

  // 沒對到 → 用這隻熊貓自己的隨機台詞
  return profile.replies[Math.floor(Math.random() * profile.replies.length)];
}

// 加訊息到聊天框
function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.textContent = text;   // 只保留純文字，不加 emoji 頭像
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
// ===== 表情包點擊送出 =====
const emojiButtons = document.querySelectorAll('.emoji-btn');

emojiButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const emoji = btn.dataset.emoji;
    
    // 直接把 emoji 當作訊息送出
    addMessage(emoji, 'user');
    
    // 熊貓的反應（隨機）
    setTimeout(() => {
      const pandaReactions = [
        '🐼 嘿嘿，你發的表情好可愛！',
        '🌿 盈盈收到了～',
        '💧 樂樂也給你一個 💧',
        '🎋 加加給你一個擁抱 🫂',
        '🍃 得得覺得好有趣！'
      ];
      // 根據當前選的熊貓給反應
      let reply = pandaReactions[0];
      if (currentPanda === 'yingying') reply = '🌿 盈盈收到了～（默默趴回水桶）';
      if (currentPanda === 'lele') reply = '💧 樂樂也給你一個 💧！一起玩水！';
      if (currentPanda === 'jiajia') reply = '🎋 加加給你一個抱抱 🫂！';
      if (currentPanda === 'dede') reply = '🍃 得得覺得好有趣！也發一個 🐼 給你！';
      
      addMessage(reply, 'panda');
    }, 500);
  });
});
// ===== 熊貓人物介紹 =====
const profileData = {
  yingying: {
    name: '盈盈',
    nickname: '盈盈豬、水桶皇后',
    personality: '溫柔淡定，是家中的定海神針。',
    hobby: '喜歡趴在水桶裡，把自己縮成一團，像一顆黑白糯米糍，偶爾抬頭看看大家，然後繼續趴著發呆。',
    trait: '帶娃時很有耐性，但當孩子們太吵時，會默默趴回水桶裡「充電」。',
    age: '2005年8月16日出生，21歲'
  },
  lele: {
    name: '樂樂',
    nickname: '樂樂仔、玩水大使',
    personality: '活潑好動，永遠有一顆貪玩的心。',
    hobby: '超級喜歡玩水！見到水池就忍不住要拍水、撥水、浸水，玩到全身濕透也不肯停。',
    trait: '玩水時會發出開心的聲音，是家中的「水上活動大使」。',
    age: '2005年8月8日出生，21歲'
  },
  jiajia: {
    name: '加加',
    nickname: '加加豬、媽媽的小跟班、阿貝貝守護者',
    personality: '細心又有點黏人，是媽媽的小跟班。',
    hobby: '喜歡貼著媽媽，無論盈盈趴在水桶還是休息，加加都會靠過去，把頭挨在媽媽身邊，一副「我要跟實你」的樣子。',
    trait: '有一個專屬的「阿貝貝」（安撫玩偶），雖然之前的阿貝貝已經壞掉了，但加加仍然很掛住它，現在換了新的阿貝貝，一樣攬到實一實。',
    age: '2024年8月15日出生，2歲（與得得為龍鳳胎）'
  },
  dede: {
    name: '得得',
    nickname: '得得豬、貼身膏藥、阿貝貝二號擁躉',
    personality: '撒嬌又愛黏人，是媽媽的「貼身膏藥」。',
    hobby: '最鍾意貼住媽媽，成日挨住盈盈，彷彿媽媽身邊就是全世界最安全的地方。',
    trait: '跟家姐加加一樣，都有一個「阿貝貝」，兩姐弟攬住阿貝貝嘅時候特別安心。雖然舊嘅阿貝貝壞咗，但佢哋對新阿貝貝一樣咁珍惜。',
    age: '2024年8月15日出生，2歲（與加加為龍鳳胎）'
  }
};

const profilePopup = document.getElementById('profile-popup');
const profileClose = document.getElementById('profile-close');

// 點擊卡片打開介紹
function openProfile(pandaKey) {
  const data = profileData[pandaKey];
  if (!data) return;

  document.getElementById('profile-name').textContent = data.name;
  document.getElementById('profile-nickname').textContent = '花名：' + data.nickname;
  document.getElementById('profile-personality').textContent = data.personality;
  document.getElementById('profile-hobby').textContent = data.hobby;
  document.getElementById('profile-trait').textContent = data.trait;
  document.getElementById('profile-age').textContent = data.age;

  // 根據點擊的熊貓，切換彈窗裡的照片
  document.getElementById('profile-img').src = `images/${pandaKey}.jpg`; 
  // 👆 如果你的照片是 png，請把 .jpg 改成 .png

  profilePopup.classList.remove('hidden');
}

// 關閉彈窗
profileClose.addEventListener('click', () => {
  profilePopup.classList.add('hidden');
});

// 點擊背景關閉
profilePopup.addEventListener('click', (e) => {
  if (e.target === profilePopup) {
    profilePopup.classList.add('hidden');
  }
});