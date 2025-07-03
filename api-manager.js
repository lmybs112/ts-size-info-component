/**
 * InfoDisplay API 管理器
 * 負責數據獲取和緩存，避免重複 API 調用
 * 優化版本：確保高並發下的唯一 API 調用
 */
class InfoDisplayAPIManager {
    constructor() {
        // 數據緩存
        this.cache = new Map();
        // 正在進行的請求，避免重複調用
        this.pendingRequests = new Map();
        // 請求統計
        this.requestStats = new Map();
        // 調試模式
        this.debugMode = false;
    }

    /**
     * 獲取服裝信息數據
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     * @returns {Promise} 返回處理後的數據
     */
    async getClothInfo(clothID, brand) {
        const cacheKey = `${brand}_${clothID}`;
        
        // 記錄請求統計
        this.recordRequestAttempt(cacheKey);
        
        // 檢查緩存
        if (this.cache.has(cacheKey)) {
            this.log(`✓ 使用緩存數據: ${cacheKey}`);
            return Promise.resolve(this.cache.get(cacheKey));
        }

        // 檢查是否已有相同請求在進行中
        if (this.pendingRequests.has(cacheKey)) {
            this.log(`⏳ 等待進行中的請求: ${cacheKey}`);
            return this.pendingRequests.get(cacheKey);
        }

        // 創建新的請求
        this.log(`🚀 發起新的 API 請求: ${cacheKey}`);
        const requestPromise = this.createApiRequest(clothID, brand, cacheKey);

        // 立即記錄正在進行的請求（防止並發調用）
        this.pendingRequests.set(cacheKey, requestPromise);
        
        return requestPromise;
    }

    /**
     * 創建 API 請求
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     * @param {string} cacheKey - 緩存鍵
     * @returns {Promise} 請求 Promise
     */
    createApiRequest(clothID, brand, cacheKey) {
        const dataUrl = "https://etpbgcktrk.execute-api.ap-northeast-1.amazonaws.com/v0/model";
        const params = `ClothID=${clothID}&Brand=${brand}`;
        
        return fetch(`${dataUrl}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(responseText => {
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(`JSON 解析失敗: ${parseError.message}`);
            }
            
            // 處理數據，準備好給組件使用的格式
            const processedData = this.processApiData(data, clothID, brand);
            
            // 緩存處理後的數據
            this.cache.set(cacheKey, processedData);
            
            // 記錄成功統計
            this.recordRequestSuccess(cacheKey);
            
            this.log(`✓ API 數據獲取完成: ${cacheKey}`);
            return processedData;
        })
        .catch(err => {
            this.log(`❌ API 調用失敗: ${cacheKey} - ${err.message}`);
            
            // 記錄失敗統計
            this.recordRequestFailure(cacheKey, err);
            
            throw err;
        })
        .finally(() => {
            // 清除正在進行的請求記錄
            this.pendingRequests.delete(cacheKey);
            this.log(`🧹 清除進行中請求記錄: ${cacheKey}`);
        });
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
     * 記錄請求嘗試
     * @param {string} cacheKey - 緩存鍵
     */
    recordRequestAttempt(cacheKey) {
        if (!this.requestStats.has(cacheKey)) {
            this.requestStats.set(cacheKey, {
                attempts: 0,
                successes: 0,
                failures: 0,
                firstAttempt: new Date(),
                lastAttempt: null,
                lastSuccess: null,
                lastFailure: null,
                errors: []
            });
        }
        
        const stats = this.requestStats.get(cacheKey);
        stats.attempts++;
        stats.lastAttempt = new Date();
        
        this.log(`📊 請求統計 ${cacheKey}: 嘗試 ${stats.attempts} 次`);
    }

    /**
     * 記錄請求成功
     * @param {string} cacheKey - 緩存鍵
     */
    recordRequestSuccess(cacheKey) {
        if (this.requestStats.has(cacheKey)) {
            const stats = this.requestStats.get(cacheKey);
            stats.successes++;
            stats.lastSuccess = new Date();
        }
    }

    /**
     * 記錄請求失敗
     * @param {string} cacheKey - 緩存鍵
     * @param {Error} error - 錯誤對象
     */
    recordRequestFailure(cacheKey, error) {
        if (this.requestStats.has(cacheKey)) {
            const stats = this.requestStats.get(cacheKey);
            stats.failures++;
            stats.lastFailure = new Date();
            stats.errors.push({
                timestamp: new Date(),
                message: error.message,
                stack: error.stack
            });
            
            // 只保留最近 5 個錯誤
            if (stats.errors.length > 5) {
                stats.errors = stats.errors.slice(-5);
            }
        }
    }

    /**
     * 清除指定的緩存
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     */
    clearCache(clothID, brand) {
        const cacheKey = `${brand}_${clothID}`;
        this.cache.delete(cacheKey);
        this.log(`🧹 清除緩存: ${cacheKey}`);
    }

    /**
     * 清除所有緩存
     */
    clearAllCache() {
        this.cache.clear();
        this.requestStats.clear();
        this.log('🧹 清除所有緩存和統計數據');
    }

    /**
     * 獲取緩存狀態
     */
    getCacheStatus() {
        const stats = {};
        this.requestStats.forEach((value, key) => {
            stats[key] = {
                attempts: value.attempts,
                successes: value.successes,
                failures: value.failures,
                successRate: value.attempts > 0 ? (value.successes / value.attempts * 100).toFixed(2) + '%' : '0%'
            };
        });

        return {
            cacheSize: this.cache.size,
            pendingRequests: this.pendingRequests.size,
            cachedKeys: Array.from(this.cache.keys()),
            pendingKeys: Array.from(this.pendingRequests.keys()),
            requestStats: stats
        };
    }

    /**
     * 強制刷新指定數據（忽略緩存）
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     * @returns {Promise} 返回處理後的數據
     */
    async forceRefresh(clothID, brand) {
        const cacheKey = `${brand}_${clothID}`;
        
        // 清除緩存
        this.cache.delete(cacheKey);
        
        // 如果有進行中的請求，等待它完成
        if (this.pendingRequests.has(cacheKey)) {
            this.log(`⏳ 等待進行中的請求完成後強制刷新: ${cacheKey}`);
            try {
                await this.pendingRequests.get(cacheKey);
            } catch (error) {
                // 忽略錯誤，繼續強制刷新
            }
        }
        
        this.log(`🔄 強制刷新數據: ${cacheKey}`);
        return this.getClothInfo(clothID, brand);
    }

    /**
     * 啟用/停用調試模式
     * @param {boolean} enabled - 是否啟用
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
        this.log(`🔧 調試模式: ${enabled ? '啟用' : '停用'}`);
    }

    /**
     * 日誌記錄
     * @param {string} message - 日誌訊息
     */
    log(message) {
        if (this.debugMode) {
            console.log(`[InfoDisplayAPIManager] ${message}`);
        }
    }

    /**
     * 檢查指定數據是否存在（不觸發 API 調用）
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     * @returns {boolean} 是否存在於緩存中
     */
    hasData(clothID, brand) {
        const cacheKey = `${brand}_${clothID}`;
        return this.cache.has(cacheKey);
    }

    /**
     * 預載入數據（可選）
     * @param {Array} clothList - 服裝列表 [{clothID, brand}, ...]
     * @returns {Promise} 所有數據載入完成的 Promise
     */
    async preloadData(clothList) {
        this.log(`🚀 開始預載入 ${clothList.length} 個服裝數據`);
        
        const promises = clothList.map(({clothID, brand}) => 
            this.getClothInfo(clothID, brand).catch(error => {
                this.log(`❌ 預載入失敗: ${brand}_${clothID} - ${error.message}`);
                return null; // 返回 null 而不是拋出錯誤
            })
        );
        
        const results = await Promise.all(promises);
        const successCount = results.filter(result => result !== null).length;
        
        this.log(`✓ 預載入完成: ${successCount}/${clothList.length} 成功`);
        return results;
    }
}

// 創建全局實例
if (!window.InfoDisplayAPIManager) {
    window.InfoDisplayAPIManager = new InfoDisplayAPIManager();
    // 可選：啟用調試模式
    // window.InfoDisplayAPIManager.setDebugMode(true);
}

// 導出（如果使用模塊系統）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfoDisplayAPIManager;
} 