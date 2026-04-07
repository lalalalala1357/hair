// ==========================================
// 0. 統一初始化 Firebase
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCfxDOOzTLbmQRfvW275hJrtOnX_t-6-yc",
  authDomain: "hsinformation.firebaseapp.com",
  projectId: "hsinformation",
  storageBucket: "hsinformation.firebasestorage.app",
  messagingSenderId: "245515525647",
  appId: "1:245515525647:web:00bf24514009bddd02cd7a"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// ==========================================
// 1. 產生導航列
// ==========================================
const adminHeaderHTML = `
<header>
  <h1>可莉兒 Hair Salon - 管理後台</h1>
  <nav>
    <ul style="display: flex; align-items: center; gap: 12px; margin: 0; padding: 0;">
      <li><a href="admin-calendar.html">行事曆管理</a></li>
      <li><a href="admin-news.html">公告管理</a></li>
      <li><a href="admin-message.html">留言管理</a></li>
      <li><a href="admin-product.html">產品上架</a></li>
      <li style="margin-left: auto;">
        <button id="logout-btn" style="background: #ff6666; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">登出</button>
      </li>
    </ul>
  </nav>
</header>
`;
document.getElementById('admin-navbar-placeholder').innerHTML = adminHeaderHTML;

// 2. 設定 active 狀態
const adminLinks = document.querySelectorAll('nav a');
const adminCurrentUrl = window.location.href;
adminLinks.forEach(link => {
  if (adminCurrentUrl.includes(link.getAttribute('href'))) {
    link.classList.add('active');
  }
});

// ==========================================
// 3. Firebase Authentication (純密碼版)
// ==========================================

// ⚠️ 這裡填入您在 Firebase 後台建立的那個信箱
const HIDDEN_ADMIN_EMAIL = "admin@salon.com"; 

// 建立登入畫面遮罩 (預設隱藏)
const overlay = document.createElement('div');
overlay.id = 'global-login-overlay';
overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#f7fff7; z-index:99999; display:none; justify-content:center; align-items:center;';
overlay.innerHTML = `
  <div style="background:#fff; padding:30px 20px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.15); text-align:center; width: 85%; max-width: 320px;">
      <h2 style="color:#4a7c53; margin-top:0; margin-bottom: 20px; font-size: 22px;">🔒 後台登入</h2>
      <input type="password" id="admin-pwd" placeholder="請輸入管理密碼" style="padding:12px; margin-bottom:20px; width:100%; box-sizing:border-box; border:1px solid #ddd; border-radius:6px; font-size:16px; text-align:center;">
      <button id="global-login-btn" style="background:#4a7c53; color:#fff; border:none; padding:12px 20px; border-radius:6px; cursor:pointer; width:100%; font-size:16px; font-weight:bold; transition: background 0.3s;">解鎖進入</button>
  </div>
`;
document.body.appendChild(overlay);

const pwdInput = document.getElementById('admin-pwd');
const loginBtn = document.getElementById('global-login-btn');
const logoutBtn = document.getElementById('logout-btn');

// 監聽使用者的登入狀態
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // 已登入：隱藏遮罩，恢復捲軸
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  } else {
    // 未登入：顯示遮罩，鎖定捲軸
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
});

// 執行登入
const doLogin = () => {
  const password = pwdInput.value.trim();
  if(!password) { alert('請輸入密碼！'); return; }

  loginBtn.textContent = "驗證中...";
  loginBtn.disabled = true;

  // 使用隱藏信箱 + 使用者輸入的密碼來登入
  firebase.auth().signInWithEmailAndPassword(HIDDEN_ADMIN_EMAIL, password)
    .then(() => {
      loginBtn.textContent = "解鎖進入";
      loginBtn.disabled = false;
      pwdInput.value = ''; // 清空密碼欄位
    })
    .catch((error) => {
      alert('❌ 密碼錯誤！');
      console.error(error);
      loginBtn.textContent = "解鎖進入";
      loginBtn.disabled = false;
      pwdInput.value = '';
    });
};

loginBtn.addEventListener('click', doLogin);
pwdInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doLogin(); });

// 執行登出
logoutBtn.addEventListener('click', () => {
  if(confirm('確定要登出後台嗎？')) {
    firebase.auth().signOut();
  }
});