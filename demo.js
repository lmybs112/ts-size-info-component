/**
 * Info Display Component Demo
 * 示範如何使用線上組件的測試腳本
 * 使用線上資源：
 * - https://ts-size-info-component.vercel.app/index.js
 * - https://ts-size-info-component.vercel.app/api-manager.js
 */

/**
 * 插入選項使用範例：
 * 
 * 1. 基本插入（默認 append）:
 *    insertOptions: { position: 'append' }
 * 
 * 2. 插入到開頭:
 *    insertOptions: { position: 'prepend' }
 * 
 * 3. 插入到容器元素前面:
 *    insertOptions: { position: 'insertBefore' }
 * 
 * 4. 插入到容器元素後面:
 *    insertOptions: { position: 'insertAfter' }
 * 
 * 5. 插入到容器內指定元素前面:
 *    insertOptions: { 
 *        position: 'insertBefore', 
 *        targetSelector: '.some-element' 
 *    }
 * 
 * 6. 插入到容器內指定元素後面:
 *    insertOptions: { 
 *        position: 'insertAfter', 
 *        targetSelector: '.some-element' 
 *    }
 * 
 * 7. 替換容器元素本身:
 *    insertOptions: { position: 'replace' }
 * 
 * 8. 替換容器內指定元素:
 *    insertOptions: { 
 *        position: 'replace', 
 *        targetSelector: '.element-to-replace' 
 *    }
 * 
 * 9. 清空容器後插入:
 *    insertOptions: { 
 *        position: 'append', 
 *        clearContainer: true 
 *    }
 */

// 線上資源配置
const ONLINE_RESOURCES = {
    apiManager: 'https://ts-size-info-component.vercel.app/api-manager.js',
    component: 'https://ts-size-info-component.vercel.app/index.js'
};

// 默認配置
const DEFAULT_CONFIG = {
    clothID: 'INFS_20240507MT2749',
    brand: 'INFS',
    containers: [
        { 
            id: '.ProductDetail-description-title',
            collapsible: true,
            insertOptions: {
                position: 'insertAfter',
                clearContainer: false
            }
        },
        { 
            id: '.ProductDetail-relatedProducts',
            collapsible: false,
            insertOptions: {
                position: 'append',
                clearContainer: false
            }
        }
    ]
};

/**
 * 動態載入 JavaScript 文件
 * @param {string} url - JS 文件 URL
 * @param {Object} options - 載入選項
 * @returns {Promise} 載入完成的 Promise
 */
function loadScript(url, options = {}) {
    return new Promise((resolve, reject) => {
        // 檢查是否已經載入過
        const existingScript = document.querySelector(`script[src="${url}"]`);
        if (existingScript) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = url;
        
        // 設定 defer 屬性（雖然對動態創建的 script 效果有限）
        if (options.defer) {
            script.defer = true;
        }
        
        // 設定 async 屬性
        if (options.async) {
            script.async = true;
        }
        
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        
        // 添加到 head 或 body
        const target = options.appendTo === 'body' ? document.body : document.head;
        target.appendChild(script);
    });
}

/**
 * 載入所有必需的線上資源（標準載入）
 * @returns {Promise} 所有資源載入完成的 Promise
 */
async function loadOnlineResources() {
    try {
        console.log('開始載入線上資源...');
        
        // 按順序載入：先載入 API 管理器，再載入組件
        await loadScript(ONLINE_RESOURCES.apiManager);
        console.log('✓ API Manager 載入完成');
        
        await loadScript(ONLINE_RESOURCES.component);
        console.log('✓ Info Display Component 載入完成');
        
        // 等待組件註冊完成
        await customElements.whenDefined('info-display-component');
        console.log('✓ 組件註冊完成');
        
        return true;
    } catch (error) {
        console.error('載入線上資源失敗:', error);
        throw error;
    }
}

/**
 * 延遲載入所有必需的線上資源（模擬 defer 行為）
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Promise} 所有資源載入完成的 Promise
 */
async function loadOnlineResourcesDeferred(delay = 100) {
    try {
        console.log('開始延遲載入線上資源...');
        
        // 延遲一段時間，讓其他腳本先執行
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 按順序載入：先載入 API 管理器，再載入組件
        await loadScript(ONLINE_RESOURCES.apiManager, { defer: true });
        console.log('✓ API Manager 載入完成 (deferred)');
        
        await loadScript(ONLINE_RESOURCES.component, { defer: true });
        console.log('✓ Info Display Component 載入完成 (deferred)');
        
        // 等待組件註冊完成
        await customElements.whenDefined('info-display-component');
        console.log('✓ 組件註冊完成 (deferred)');
        
        return true;
    } catch (error) {
        console.error('延遲載入線上資源失敗:', error);
        throw error;
    }
}

/**
 * 使用 requestIdleCallback 空閒時載入資源
 * @returns {Promise} 所有資源載入完成的 Promise
 */
async function loadOnlineResourcesIdle() {
    return new Promise((resolve, reject) => {
        const loadFunction = async () => {
            try {
                console.log('開始空閒時間載入線上資源...');
                await loadOnlineResourcesDeferred(0);
                resolve();
            } catch (error) {
                reject(error);
            }
        };

        // 使用 requestIdleCallback 或 setTimeout 作為後備
        if (window.requestIdleCallback) {
            window.requestIdleCallback(loadFunction, { timeout: 2000 });
        } else {
            setTimeout(loadFunction, 100);
        }
    });
}

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
 * 將組件添加到指定容器的指定位置
 * @param {HTMLElement} component - 組件元素
 * @param {string} containerSelector - 容器選擇器
 * @param {Object} insertOptions - 插入選項
 * @returns {boolean} 是否成功插入
 */
function appendToContainer(component, containerSelector, insertOptions = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn(`容器 ${containerSelector} 不存在`);
        return false;
    }
    
    const {
        position = 'append',      // 'append' | 'prepend' | 'insertBefore' | 'insertAfter' | 'replace'
        targetSelector = null,    // 目標元素選擇器（可選，不設定時針對容器本身）
        clearContainer = false    // 是否先清空容器
    } = insertOptions;
    
    try {
        // 清空容器（如果需要）
        if (clearContainer) {
            container.innerHTML = '';
        }
        
        switch (position) {
            case 'prepend':
                container.insertBefore(component, container.firstChild);
                console.log(`組件已 prepend 到 ${containerSelector}`);
                break;
                
            case 'insertBefore':
                if (targetSelector) {
                    // 插入到容器內的指定元素前面
                    const beforeTarget = container.querySelector(targetSelector);
                    if (!beforeTarget) {
                        throw new Error(`在容器內找不到目標元素: ${targetSelector}`);
                    }
                    beforeTarget.parentNode.insertBefore(component, beforeTarget);
                    console.log(`組件已插入到容器內 ${targetSelector} 前面`);
                } else {
                    // 插入到容器元素本身的前面
                    container.parentNode.insertBefore(component, container);
                    console.log(`組件已插入到 ${containerSelector} 元素前面`);
                }
                break;
                
            case 'insertAfter':
                if (targetSelector) {
                    // 插入到容器內的指定元素後面
                    const afterTarget = container.querySelector(targetSelector);
                    if (!afterTarget) {
                        throw new Error(`在容器內找不到目標元素: ${targetSelector}`);
                    }
                    afterTarget.parentNode.insertBefore(component, afterTarget.nextSibling);
                    console.log(`組件已插入到容器內 ${targetSelector} 後面`);
                } else {
                    // 插入到容器元素本身的後面
                    container.parentNode.insertBefore(component, container.nextSibling);
                    console.log(`組件已插入到 ${containerSelector} 元素後面`);
                }
                break;
                
            case 'replace':
                if (targetSelector) {
                    // 替換容器內的指定元素
                    const replaceTarget = container.querySelector(targetSelector);
                    if (!replaceTarget) {
                        throw new Error(`在容器內找不到要替換的元素: ${targetSelector}`);
                    }
                    replaceTarget.parentNode.replaceChild(component, replaceTarget);
                    console.log(`組件已替換容器內的 ${targetSelector}`);
                } else {
                    // 替換容器元素本身
                    container.parentNode.replaceChild(component, container);
                    console.log(`組件已替換 ${containerSelector} 元素`);
                }
                break;
                
            case 'append':
            default:
                container.appendChild(component);
                console.log(`組件已 append 到 ${containerSelector}`);
                break;
        }
        
        return true;
        
    } catch (error) {
        console.error(`插入組件失敗:`, error.message);
        return false;
    }
}

/**
 * 檢查所有容器是否存在
 * @param {Array} containers - 容器配置陣列
 * @returns {boolean} 所有容器是否都存在
 */
function checkContainersExist(containers) {
    return containers.every(container => {
        const element = document.querySelector(container.id);
        const exists = element !== null;
        if (!exists) {
            console.log(`等待容器: ${container.id}`);
        }
        return exists;
    });
}

/**
 * 等待容器出現
 * @param {Array} containers - 容器配置陣列
 * @param {number} maxWaitTime - 最大等待時間（毫秒）
 * @returns {Promise} 容器準備完成的 Promise
 */
function waitForContainers(containers, maxWaitTime = 10000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        // 立即檢查一次
        if (checkContainersExist(containers)) {
            console.log('✓ 所有容器已找到');
            resolve();
            return;
        }
        
        console.log('等待容器元素出現...');
        
        // 使用 MutationObserver 監聽 DOM 變化
        const observer = new MutationObserver(() => {
            if (checkContainersExist(containers)) {
                observer.disconnect();
                console.log('✓ 所有容器已找到');
                resolve();
            } else if (Date.now() - startTime > maxWaitTime) {
                observer.disconnect();
                reject(new Error(`等待容器超時 (${maxWaitTime}ms)`));
            }
        });
        
        // 開始觀察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 備用輪詢檢查（每 500ms 檢查一次）
        const pollInterval = setInterval(() => {
            if (checkContainersExist(containers)) {
                clearInterval(pollInterval);
                observer.disconnect();
                console.log('✓ 所有容器已找到 (輪詢檢查)');
                resolve();
            } else if (Date.now() - startTime > maxWaitTime) {
                clearInterval(pollInterval);
                observer.disconnect();
                reject(new Error(`等待容器超時 (${maxWaitTime}ms)`));
            }
        }, 500);
    });
}

/**
 * 主要測試函數
 * @param {Object} config - 配置選項
 */
async function test(config = DEFAULT_CONFIG) {
    try {
        console.log('開始初始化組件系統...');
        
        // 根據配置選擇載入方式
        const loadMethod = config.loadMethod || 'standard';
        switch (loadMethod) {
            case 'deferred':
                await loadOnlineResourcesDeferred(config.deferDelay);
                break;
            case 'idle':
                await loadOnlineResourcesIdle();
                break;
            default:
                await loadOnlineResources();
                break;
        }
        
        // 檢查 API 管理器是否存在
        if (!window.InfoDisplayAPIManager) {
            throw new Error('InfoDisplayAPIManager 載入失敗');
        }
        
        console.log('開始載入組件數據...');
        
        // 獲取數據
        const data = await window.InfoDisplayAPIManager.getClothInfo(config.clothID, config.brand);
        console.log('數據載入完成:', config.clothID);
        
        // 創建並添加組件
        let successCount = 0;
        for (const containerConfig of config.containers) {
            const component = createComponent(data, containerConfig);
            const success = appendToContainer(component, containerConfig.id, containerConfig.insertOptions);
            if (success) {
                successCount++;
                console.log(`組件已添加到 ${containerConfig.id}${containerConfig.collapsible ? ' (可折疊)' : ' (不可折疊)'}`);
            }
        }
        
        console.log(`測試完成，成功創建 ${successCount}/${config.containers.length} 個組件`);
        
        // 返回創建的組件數量，供外部使用
        return { success: true, componentCount: successCount };
        
    } catch (error) {
        console.error('測試過程中發生錯誤:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 初始化函數
 * @param {Object} options - 初始化選項
 */
async function init(options = {}) {
    try {
        // 確保 DOM 準備完成
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        console.log('DOM 準備完成，等待容器元素...');
        
        // 合併配置
        const config = { ...DEFAULT_CONFIG, ...options };
        
        // 等待所有容器元素出現
        await waitForContainers(config.containers);
        
        // 執行測試
        await test(config);
        
    } catch (error) {
        console.error('初始化失敗:', error);
        
        // 如果等待容器超時，嘗試繼續執行（用於調試）
        if (error.message.includes('等待容器超時')) {
            console.warn('容器等待超時，仍嘗試執行測試...');
            try {
                await test(options);
            } catch (testError) {
                console.error('強制執行測試也失敗:', testError);
            }
        }
    }
}

// 導出函數供外部使用
window.InfoDisplayDemo = {
    test,
    createComponent,
    appendToContainer,
    loadOnlineResources,
    loadOnlineResourcesDeferred,
    loadOnlineResourcesIdle,
    DEFAULT_CONFIG,
    ONLINE_RESOURCES
};

// 自動初始化 - 使用空閒時間載入
init({ loadMethod: 'idle' });
