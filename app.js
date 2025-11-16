/**
 * 股票買入成本計算邏輯
 * * 公式:
 * 1. 股票價值 = 股價 * 股數
 * 2. 原始手續費 = 股票價值 * (手續費率 / 100)
 * 3. 實付手續費 = MAX(最低手續費, 原始手續費 * 折扣)
 * 4. 總成本 = 股票價值 + 實付手續費
 */
function calculateCost() {
    // 獲取輸入值
    const price = parseFloat(document.getElementById('price').value);
    const shares = parseInt(document.getElementById('shares').value);
    const rate = parseFloat(document.getElementById('commissionRate').value) / 100; // 轉換為小數
    const min = parseFloat(document.getElementById('minCommission').value);
    const discount = parseFloat(document.getElementById('discount').value);

    // 檢查輸入是否有效
    if (isNaN(price) || isNaN(shares) || price <= 0 || shares <= 0) {
        alert('請輸入有效的股價和股數。');
        return;
    }

    // 1. 股票價值
    const stockValue = price * shares;

    // 2. 原始手續費 (四捨五入到整數，券商多為無條件捨去或四捨五入)
    const rawCommission = Math.round(stockValue * rate);

    // 3. 計算折扣後的手續費
    let discountedCommission = rawCommission * discount;

    // 4. 實付手續費 (考慮最低手續費)
    // 零股交易通常沒有最低手續費限制，但這裡為簡化設計為適用。
    // 實際情況需根據券商規定調整。
    let actualCommission = discountedCommission;
    if (shares >= 1000 && discountedCommission < min) {
         // 整股且折扣後低於最低手續費，則收最低手續費
         actualCommission = min;
    } else {
        // 零股或折扣後高於最低手續費，則四捨五入到整數 (通常是無條件捨去/進位，這裡用 round)
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

// 首次載入時執行一次，確保初始值已計算
window.onload = calculateCost;
