/**
 * InfoDisplay API 管理器
 * 負責數據獲取和緩存，避免重複 API 調用
 */
class InfoDisplayAPIManager {
    constructor() {
        // 數據緩存
        this.cache = new Map();
        // 正在進行的請求，避免重複調用
        this.pendingRequests = new Map();
    }

    /**
     * 獲取服裝信息數據
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     * @returns {Promise} 返回處理後的數據
     */
    async getClothInfo(clothID, brand) {
        const cacheKey = `${brand}_${clothID}`;
        
        // 檢查緩存
        if (this.cache.has(cacheKey)) {
            // console.log(`使用緩存數據: ${cacheKey}`);
            return Promise.resolve(this.cache.get(cacheKey));
        }

        // 檢查是否已有相同請求在進行中
        if (this.pendingRequests.has(cacheKey)) {
            // console.log(`等待進行中的請求: ${cacheKey}`);
            return this.pendingRequests.get(cacheKey);
        }

        // 創建新的請求
        const dataUrl = "https://etpbgcktrk.execute-api.ap-northeast-1.amazonaws.com/v0/model";
        const params = `ClothID=${clothID}&Brand=${brand}`;
        
        const requestPromise = fetch(`${dataUrl}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain'
            }
        })
        .then(response => response.text())
        .then(responseText => {
            const data = JSON.parse(responseText);
            
            // 處理數據，準備好給組件使用的格式
            const processedData = this.processApiData(data, clothID, brand);
            
            // 緩存處理後的數據
            this.cache.set(cacheKey, processedData);
            
            // 清除正在進行的請求記錄
            this.pendingRequests.delete(cacheKey);
            
            // console.log(`API 數據獲取完成: ${cacheKey}`);
            return processedData;
        })
        .catch(err => {
            // console.error(`API 調用失敗: ${cacheKey}`, err);
            // 清除正在進行的請求記錄
            this.pendingRequests.delete(cacheKey);
            throw err;
        });

        // 記錄正在進行的請求
        this.pendingRequests.set(cacheKey, requestPromise);
        
        return requestPromise;
    }

    /**
     * 處理 API 返回的數據
     * @param {Object} rawData - 原始 API 數據
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     * @returns {Object} 處理後的數據
     */
    processApiData(rawData, clothID, brand) {
        const processedData = {
            clothID,
            brand,
            sizeInfo: rawData.SizeInfo ? JSON.parse(rawData.SizeInfo) : null,
            avatarInfo: rawData.Avatar ? JSON.parse(rawData.Avatar) : null,
            chartInfo: rawData.ChartInfo || null,
            attributeInfo: rawData.AttributeInfo || null,
            punit: rawData.punit || 'cm',
            sizeInfoTextarea: rawData.Sizeinfo_textarea || null,
            // 計算一些輔助信息
            genderClothID: `M&${clothID}&U`,
            hasAvatar: rawData.Avatar && !clothID.split('_')[1].match(/[A-Z]+/)[0].includes('A'),
            hasChart: !!rawData.ChartInfo,
            hasAttributes: !!rawData.AttributeInfo,
            hasTextarea: !!rawData.Sizeinfo_textarea
        };

        return processedData;
    }

    /**
     * 清除指定的緩存
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     */
    clearCache(clothID, brand) {
        const cacheKey = `${brand}_${clothID}`;
        this.cache.delete(cacheKey);
        // console.log(`清除緩存: ${cacheKey}`);
    }

    /**
     * 清除所有緩存
     */
    clearAllCache() {
        this.cache.clear();
        // console.log('清除所有緩存');
    }

    /**
     * 獲取緩存狀態
     */
    getCacheStatus() {
        return {
            cacheSize: this.cache.size,
            pendingRequests: this.pendingRequests.size,
            cachedKeys: Array.from(this.cache.keys())
        };
    }
}

// 創建全局實例
window.InfoDisplayAPIManager = window.InfoDisplayAPIManager || new InfoDisplayAPIManager();

// 導出（如果使用模塊系統）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfoDisplayAPIManager;
} 