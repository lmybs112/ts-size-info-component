/**
 * Info Display Component Demo
 * 示範如何使用線上組件的測試腳本
 * 使用線上資源：
 * - https://ts-size-info-component.vercel.app/index.js
 * - https://ts-size-info-component.vercel.app/api-manager.js
 */

/**
 * 折疊狀態配置說明：
 * 
 * 當 collapsible 為 true 時，可以設定 defaultStates 來控制每個區塊的預設展開/收合狀態：
 * 
 * defaultStates: {
 *     sizeTable: true,        // 尺寸表預設展開
 *     tryonReport: false,     // 試穿資訊預設收合  
 *     attributes: false       // 商品屬性預設收合
 * }
 * 
 * 如果沒有設定 defaultStates，則使用以下預設值：
 * - 尺寸表：展開 (true)
 * - 試穿資訊：收合 (false)
 * - 商品屬性：收合 (false)
 * 
 * 配置範例：
 * 
 * 1. 全部展開：
 *    defaultStates: {
 *        sizeTable: true,
 *        tryonReport: true,
 *        attributes: true
 *    }
 * 
 * 2. 全部收合：
 *    defaultStates: {
 *        sizeTable: false,
 *        tryonReport: false,
 *        attributes: false
 *    }
 * 
 * 3. 只展開試穿資訊：
 *    defaultStates: {
 *        sizeTable: false,
 *        tryonReport: true,
 *        attributes: false
 *    }
 * 
 * 4. 部分設定（未設定的使用預設值）：
 *    defaultStates: {
 *        tryonReport: true    // 只設定試穿資訊展開，其他使用預設值
 *    }
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

/**
 * 完整配置範例：
 * 
 * const customConfig = {
 *     clothID: 'INFS_20240507MT2749',
 *     brand: 'INFS',
 *     loadMethod: 'idle',  // 'standard' | 'deferred' | 'idle'
 *     containers: [
 *         {
 *             id: '.ProductDetail-description-title',
 *             collapsible: true,
 *             defaultStates: {
 *                 sizeTable: true,        // 尺寸表展開
 *                 tryonReport: true,      // 試穿資訊展開  
 *                 attributes: false       // 商品屬性收合
 *             },
 *             insertOptions: {
 *                 position: 'insertAfter',
 *                 clearContainer: false
 *             }
 *         },
 *         {
 *             id: '.ProductDetail-relatedProducts',
 *             collapsible: false,  // 不可折疊時不需要設定 defaultStates
 *             insertOptions: {
 *                 position: 'append',
 *                 clearContainer: false
 *             }
 *         }
 *     ]
 * };
 * 
 * // 使用自定義配置
 * InfoDisplayDemo.test(customConfig);
 */

// 線上資源配置
const ONLINE_RESOURCES = {
    // apiManager: '/info-display-reference-component/api-manager.js',
    // component: '/info-display-reference-component/index.js'
    apiManager: 'https://ts-size-info-component.vercel.app/api-manager.js',
    component: 'https://ts-size-info-component.vercel.app/index.js'
};

// 默認配置
const DEFAULT_CONFIG = {
    clothID: 'INFS_20240507MT2749',
    brand: 'INFS',
    containers: [
        {
            id: '.pdcnt_info_size',
            collapsible: true,
            defaultStates: {
                sizeTable: false,        // 尺寸表預設展開
                tryonReport: false,     // 試穿資訊預設收合
                attributes: false       // 商品屬性預設收合
            },
            insertOptions: {
                position: 'insertAfter',
                clearContainer: false
            }
        },
        {
            id: `.pdcnt_tab_cnt:nth-child(2)`,
            collapsible: false,
            insertOptions: {
                position: 'insertAfter',
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
        // 按順序載入：先載入 API 管理器，再載入組件
        await loadScript(ONLINE_RESOURCES.apiManager);
        await loadScript(ONLINE_RESOURCES.component);
        
        // 等待組件註冊完成
        await customElements.whenDefined('info-display-component');
        
        return true;
    } catch (error) {
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
        // 延遲一段時間，讓其他腳本先執行
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 按順序載入：先載入 API 管理器，再載入組件
        await loadScript(ONLINE_RESOURCES.apiManager, { defer: true });
        await loadScript(ONLINE_RESOURCES.component, { defer: true });
        
        // 等待組件註冊完成
        await customElements.whenDefined('info-display-component');
        
        return true;
    } catch (error) {
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
 * 設定組件的初始折疊狀態
 * @param {HTMLElement} component - 組件元素
 * @param {Object} defaultStates - 默認狀態配置
 */
function setComponentInitialStates(component, defaultStates = {}) {
    // 如果沒有設定 defaultStates，使用系統預設值
    const states = {
        sizeTable: true,        // 尺寸表預設展開
        tryonReport: false,     // 試穿資訊預設收合
        attributes: false,      // 商品屬性預設收合
        ...defaultStates        // 覆蓋用戶設定的值
    };
    
    // 將狀態配置傳遞給組件，組件會在初始化時直接使用
    component._initialStates = states;
    
    // 簡單的驗證函數，在組件渲染後檢查狀態是否正確
    setTimeout(() => {
        if (component.shadowRoot) {
            applyInitialStates(component, states);
        }
    }, 500); // 延遲檢查，確保組件完全渲染
}

/**
 * 應用初始狀態到組件
 * @param {HTMLElement} component - 組件元素
 * @param {Object} states - 狀態配置
 */
function applyInitialStates(component, states) {
    if (!component.shadowRoot) {
        return;
    }
    
    try {
        // 組件現在會直接使用外部配置的狀態，無需再次設定
        // 這裡只是驗證狀態是否正確應用
        
        // 檢查尺寸表狀態
        const sizeTableContent = component.shadowRoot.querySelector('.size-table-content');
        const sizeTableToggle = component.shadowRoot.getElementById('size-table-toggle');
        if (sizeTableContent && sizeTableToggle) {
            const isExpanded = sizeTableContent.classList.contains('show');
        }
        
        // 檢查試穿資訊狀態
        const tryonReportContent = component.shadowRoot.querySelector('.tryon-report-content');
        const tryonReportToggle = component.shadowRoot.getElementById('tryon-report-toggle');
        if (tryonReportContent && tryonReportToggle) {
            const isExpanded = tryonReportContent.classList.contains('show');
        }
        
        // 檢查商品屬性狀態
        const attributesContent = component.shadowRoot.querySelector('.attributes-content');
        const attributesToggle = component.shadowRoot.getElementById('attributes-toggle');
        if (attributesContent && attributesToggle) {
            const isExpanded = attributesContent.classList.contains('show');
        }
        
    } catch (error) {
        // Handle error silently
    }
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
        
        // 設定初始狀態
        if (config.defaultStates) {
            setComponentInitialStates(component, config.defaultStates);
        } else {
            // 使用系統預設值
            setComponentInitialStates(component);
        }
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
                break;
                
            case 'insertBefore':
                if (targetSelector) {
                    // 插入到容器內的指定元素前面
                    const beforeTarget = container.querySelector(targetSelector);
                    if (!beforeTarget) {
                        throw new Error(`在容器內找不到目標元素: ${targetSelector}`);
                    }
                    beforeTarget.parentNode.insertBefore(component, beforeTarget);
                } else {
                    // 插入到容器元素本身的前面
                    container.parentNode.insertBefore(component, container);
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
                } else {
                    // 插入到容器元素本身的後面
                    container.parentNode.insertBefore(component, container.nextSibling);
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
                } else {
                    // 替換容器元素本身
                    container.parentNode.replaceChild(component, container);
                }
                break;
                
            case 'append':
            default:
                container.appendChild(component);
                break;
        }
        
        return true;
        
    } catch (error) {
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
        return element !== null;
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
            resolve();
            return;
        }
        
        // 使用 MutationObserver 監聽 DOM 變化
        const observer = new MutationObserver(() => {
            if (checkContainersExist(containers)) {
                observer.disconnect();
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
async function initInfoDisplay(config = DEFAULT_CONFIG) {
    try {
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
        
        // 獲取數據
        const data = await window.InfoDisplayAPIManager.getClothInfo(config.clothID, config.brand);
        
        // 創建並添加組件
        let successCount = 0;
        for (const containerConfig of config.containers) {
            const component = createComponent(data, containerConfig);
            const success = appendToContainer(component, containerConfig.id, containerConfig.insertOptions);
            if (success) {
                successCount++;
            }
        }
        
        // 返回創建的組件數量，供外部使用
        return { success: true, componentCount: successCount };
        
    } catch (error) {
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
        
        // 合併配置
        const config = { ...DEFAULT_CONFIG, ...options };
        
        // 等待所有容器元素出現
        await waitForContainers(config.containers);
        
        // 執行測試
        await initInfoDisplay(config);
        
    } catch (error) {
        // 如果等待容器超時，嘗試繼續執行（用於調試）
        if (error.message.includes('等待容器超時')) {
            try {
                await initInfoDisplay(options);
            } catch (testError) {
                // Handle error silently
            }
        }
    }
}

// 導出函數供外部使用
window.InfoDisplayDemo = {
    initInfoDisplay,
    createComponent,
    appendToContainer,
    loadOnlineResources,
    loadOnlineResourcesDeferred,
    loadOnlineResourcesIdle,
    setComponentInitialStates,
    applyInitialStates,
    DEFAULT_CONFIG,
    ONLINE_RESOURCES
};

// 移除自動初始化，防止重複渲染
init({ loadMethod: 'idle' });