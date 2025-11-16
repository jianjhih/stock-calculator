// --- Cookie 處理函數 ---

/**
 * 設置 Cookie
 * @param {string} name - Cookie 名稱
 * @param {string} value - Cookie 值
 * @param {number} days - Cookie 有效天數
 */
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * 獲取 Cookie
 * @param {string} name - Cookie 名稱
 * @returns {string|null} - Cookie 值或 null
 */
function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return null;
}

// --- 應用程式邏輯 ---

const DISCOUNT_KEY = 'commissionDiscount';

/**
 * 載入儲存的手續費折扣，並監聽變動
 */
function loadDiscount() {
    const discountInput = document.getElementById('discount');
    const savedDiscount = getCookie(DISCOUNT_KEY);

    // 如果 Cookie 存在，就載入它的值
    if (savedDiscount) {
        discountInput.value = savedDiscount;
    }

    // 監聽折扣輸入框的變動，一有變動就儲存到 Cookie
    discountInput.addEventListener('change', (event) => {
        const newDiscount = event.target.value;
        // 儲存 Cookie，有效期 30 天
        setCookie(DISCOUNT_KEY, newDiscount, 30);
        // 同時重新計算
        calculateCost();
    });
}

/**
 * 股票買入成本計算邏輯 (與原先相同)
 */
function calculateCost() {
    // 獲取輸入值
    const price = parseFloat(document.getElementById('price').value);
    const shares = parseInt(document.getElementById('shares').value);
    const rate = parseFloat(document.getElementById('commissionRate').value) / 100;
    const min = parseFloat(document.getElementById('minCommission').value);
    const discount = parseFloat(document.getElementById('discount').value); // 這裡讀取最新的值

    // 檢查輸入是否有效
    if (isNaN(price) || isNaN(shares) || price <= 0 || shares <= 0) {
        // ... 錯誤提示
        return;
    }

    // 1. 股票價值
    const stockValue = price * shares;

    // 2. 原始手續費 (四捨五入到整數)
    const rawCommission = Math.round(stockValue * rate);

    // 3. 計算折扣後的手續費
    let discountedCommission = rawCommission * discount;

    // 4. 實付手續費 (考慮最低手續費)
    let actualCommission = discountedCommission;
    if (shares >= 1000 && discountedCommission < min) {
         actualCommission = min;
    } else {
        actualCommission = Math.round(discountedCommission);
    }
    
    // 5. 總成本
    const totalCost = stockValue + actualCommission;

    // 顯示結果 (使用 toLocaleString 格式化數字)
    document.getElementById('value').textContent = stockValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    document.getElementById('rawCommission').textContent = rawCommission.toLocaleString('en-US');
    document.getElementById('actualCommission').textContent = actualCommission.toLocaleString('en-US');
    document.getElementById('totalCost').textContent = totalCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}


// 頁面載入時：
window.addEventListener('load', () => {
    // 1. 載入並監聽折扣
    loadDiscount(); 
    // 2. 執行首次計算 (使用載入的折扣值)
    calculateCost();
    
    // 3. 註冊 Service Worker (PWA 核心)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker 註冊成功:', reg.scope))
            .catch(err => console.log('Service Worker 註冊失敗:', err));
    }
});
