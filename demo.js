/**
 * Info Display Component Demo
 * 示範如何使用組件的測試腳本
 */

// 默認配置
const DEFAULT_CONFIG = {
    clothID: 'INFS_20240507MT2749',
    brand: 'INFS',
    containers: [
        { id: '.ProductDetail-description-title', collapsible: true },
        { id: '.ProductDetail-relatedProducts', collapsible: false }
    ]
};

/**
 * 創建並配置組件
 * @param {Object} data - API 數據
 * @param {Object} config - 組件配置
 * @returns {HTMLElement} 組件元素
 */
function createComponent(data, config = {}) {
    const component = document.createElement('info-display-component');
    
    // 設定折疊功能
    if (config.collapsible) {
        component.setAttribute('collapsible', 'true');
    }
    
    // 設定數據
    component.setApiData(data);
    
    return component;
}

/**
 * 將組件添加到指定容器
 * @param {HTMLElement} component - 組件元素
 * @param {string} containerSelector - 容器選擇器
 */
function appendToContainer(component, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn(`容器 ${containerSelector} 不存在`);
        return false;
    }
    
    container.appendChild(component);
    return true;
}

/**
 * 主要測試函數
 * @param {Object} config - 配置選項
 */
async function test(config = DEFAULT_CONFIG) {
    try {
        console.log('開始載入組件數據...');
        
        // 檢查 API 管理器是否存在
        if (!window.InfoDisplayAPIManager) {
            throw new Error('InfoDisplayAPIManager 未載入，請確認 api-manager.js 已正確引入');
        }
        
        // 獲取數據
        const data = await window.InfoDisplayAPIManager.getClothInfo(config.clothID, config.brand);
        console.log('數據載入完成:', config.clothID);
        
        // 創建並添加組件
        let successCount = 0;
        for (const containerConfig of config.containers) {
            const component = createComponent(data, containerConfig);
            const success = appendToContainer(component, containerConfig.id);
            if (success) {
                successCount++;
                console.log(`組件已添加到 ${containerConfig.id}${containerConfig.collapsible ? ' (可折疊)' : ' (不可折疊)'}`);
            }
        }
        
        console.log(`測試完成，成功創建 ${successCount}/${config.containers.length} 個組件`);
        
    } catch (error) {
        console.error('測試過程中發生錯誤:', error);
    }
}

/**
 * 初始化函數
 */
function init() {
    // 確保 DOM 準備完成後再執行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => test());
    } else {
        test();
    }
}

// 導出函數供外部使用（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { test, createComponent, appendToContainer };
}

// 自動初始化
init();
