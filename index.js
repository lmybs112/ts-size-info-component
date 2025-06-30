class InfoDisplayComponent extends HTMLElement {
    constructor() {
        super();
        // 創建 Shadow DOM
        this.attachShadow({
            mode: 'open'
        });

        // 建立 preconnect 連結並添加到主文檔 head
        const preconnect1 = document.createElement('link');
        preconnect1.setAttribute('rel', 'preconnect');
        preconnect1.setAttribute('href', 'https://fonts.googleapis.com');

        const preconnect2 = document.createElement('link');
        preconnect2.setAttribute('rel', 'preconnect');
        preconnect2.setAttribute('href', 'https://fonts.gstatic.com');
        preconnect2.setAttribute('crossorigin', '');

        // 建立字型 stylesheet 連結
        const fontLink = document.createElement('link');
        fontLink.setAttribute('rel', 'stylesheet');
        fontLink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Figtree:ital,wght@0,300..900;1,300..900&family=Noto+Sans+TC:wght@100..900&display=swap');

        // 檢查是否已經添加過相同的字體連結，避免重複
        const existingFontLink = document.head.querySelector('link[href*="fonts.googleapis.com/css2"]');
        const existingPreconnect1 = document.head.querySelector('link[href="https://fonts.googleapis.com"]');
        const existingPreconnect2 = document.head.querySelector('link[href="https://fonts.gstatic.com"]');

        if (!existingPreconnect1) {
            document.head.appendChild(preconnect1);
        }
        if (!existingPreconnect2) {
            document.head.appendChild(preconnect2);
        }
        if (!existingFontLink) {
            document.head.appendChild(fontLink);
        }

        // 組件數據 - 默認示例數據
        this.gson = {
            "sizeGuide": {
                "sizeChart": {
                    "description": "",
                    "imgSrc": "a.png",
                    "sizeTable": {
                        "hs": ["Size", "long", "long", "long", "long", "long"],
                        "sizeLong": [
                            ["S", "37", "58", "28.5", "27", "26.5"],
                            ["S", "37", "58", "28.5", "27", "26.5"],
                            ["S", "37", "58", "28.5", "27", "26.5"],
                            ["S", "37", "58", "28.5", "27", "26.5"],
                            ["S", "37", "58", "28.5", "27", "26.5"]
                        ]
                    }
                },
                "detailInformation": {
                    "description": "",
                    "details": [{
                            "tabName": "基本信息"
                        },
                        {
                            "feature": "彈性",
                            "level": ["a", "b", "c", "d"],
                            "choose": "b"
                        },
                        {
                            "feature": "版型",
                            "level": ["a", "b", "c", "d"],
                            "choose": "a"
                        },
                        {
                            "feature": "厚度",
                            "level": ["a", "b", "c", "d"],
                            "choose": "c"
                        },
                        {
                            "feature": "觸感",
                            "level": [],
                            "choose": ""
                        },
                                {}, {}
                ]
                },
                "additionalInformation": {
                    "description": "",
                    "notes": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis quia quasi perspiciatis tempora excepturi et quibusdam autem ad culpa ipsum cupiditate ex, quisquam a eveniet sed molestiae doloremque nesciunt fugit."
                }
            },
            "AIsize": {
                "description": ""
            }
        };

        // API 數據存儲
        this.apiData = null;
        this.isDataLoaded = false;

        // 初始化組件
        this.init();
    }

    // 兼容性輔助函數
    addClass(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    }

    removeClass(element, className) {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    hasClass(element, className) {
        if (element.classList) {
            return element.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
    }

    // 初始化方法
    init() {
        this.render();
        this.setupEventListeners();
        // 移除自動調用 getinfo，改為等待外部設置數據
        // this.getinfo();
    }
    

    /**
     * 設置 API 數據並渲染組件
     * @param {Object} data - 從 API 管理器獲取的處理後數據
     */
    setApiData(data) {
        this.apiData = data;
        this.isDataLoaded = true;
        console.log('組件接收到數據:', data);
        
        // 渲染組件內容
        this.renderWithApiData();
    }

    /**
     * 使用 API 數據渲染組件內容
     */
    renderWithApiData() {
        if (!this.apiData) {
            console.warn('沒有 API 數據，無法渲染');
            return;
        }

        const data = this.apiData;
        
        // 根據 collapsible 屬性決定是否添加折疊按鈕
        const collapseButton = this.isCollapsible ?
            '<button id="size-table-toggle" class="collapse-btn" aria-label="收合尺寸表">−</button>' : '';

        // 根據是否啟用折疊功能決定標題樣式
        const titleStyle = this.isCollapsible ?
            '' : 'border-bottom:1px solid;';

        const htmlContent = `<br /> <br /> <div id="size-info-table-container" class="inf-container"><h5 id="size-table-header" class="${this.isCollapsible ? 'collapsible-header' : ''}" style="display: flex; justify-content: space-between; align-items: center;"> <span style="${titleStyle}">尺寸表</span>${collapseButton}</h5><div class="size-table-content"><div class="custom-row"><div class="custom-col-7 custom-order-1 sizeinfo-col"> <div style=" text-align: left; color: #333; font-size: 12px; width: 100%; margin: auto; " > <span id="sizeinfo_punit"></span> </div> <div class="fixed-table-container"><table class="demo sizetable-demo" id="demo0"> <thead> <tr id="th_tr_size0"></tr> </thead> <tbody id="tbody_size0"></tbody> </table> </div></div> </div></div> <br /> </div> <br />  <br /> <br />`;

        const container = this.shadowRoot.querySelector('.component-container');
        if (container) {
            container.insertAdjacentHTML('beforeend', htmlContent);
        } else {
            this.shadowRoot.insertAdjacentHTML('beforeend', htmlContent);
        }

        // 渲染尺寸表
        if (data.sizeInfo) {
            this.showSizeTable(data.sizeInfo, '0');
            // 檢查是否需要限制 custom-col-7 的最大寬度
            this.checkAndApplyColWidthLimit(Object.keys(data.sizeInfo[0]));
        }

        // 渲染試穿資訊
        if (data.hasAvatar && data.avatarInfo) {
            this.showTryonReport(data.avatarInfo);
        }

        // 渲染商品屬性
        if (data.hasAttributes && data.attributeInfo) {
            this.clothes_attributes_display(data);
        }

        // 渲染 SVG 圖表
        if (data.hasChart && data.chartInfo) {
            this.svg_display(data);
        }

        // 渲染額外文字說明
        if (data.hasTextarea && data.sizeInfoTextarea) {
            const sizeInfoCol = this.shadowRoot.querySelector('.sizeinfo-col');
            if (sizeInfoCol) {
                sizeInfoCol.insertAdjacentHTML('beforeend', '<div style="text-align: left;color:#333;font-size:12px;width: 100%;margin: auto;border: 1px solid #e1e1e1;margin-top: 1rem;padding: 8px;">' + data.sizeInfoTextarea.replaceAll('\n', '<br>') + '</div>');
            }
        }

        // 設置折疊功能
        this.setupCollapseFeatures();

        // 自動觸發預設 active 的 filter button 點擊事件
        setTimeout(() => {
            const activeButton = this.shadowRoot.querySelector('.filter-button.active');
            if (activeButton) {
                activeButton.click();
            }
        }, 100);
    }

    /**
     * 設置折疊功能的事件監聽器
     */
    setupCollapseFeatures() {
        // 只有在啟用折疊功能時才添加事件監聽器
        if (this.isCollapsible) {
            const headerElement = this.shadowRoot.getElementById('size-table-header');
            const toggleBtn = this.shadowRoot.getElementById('size-table-toggle');
            const sizeTableContent = this.shadowRoot.querySelector('.size-table-content');

            if (headerElement && sizeTableContent) {
                // 檢查是否有外部配置的初始狀態
                const initialStates = this._initialStates || {
                    sizeTable: true,        // 尺寸表預設展開
                    tryonReport: false,     // 試穿資訊預設收合
                    attributes: false       // 商品屬性預設收合
                };

                // 使用配置的狀態進行初始化，避免閃爍
                this.initializeContentState(sizeTableContent, initialStates.sizeTable);

                // 設置初始按鈕內容和狀態
                if (toggleBtn) {
                    toggleBtn.innerHTML = this.getArrowIcon();
                    toggleBtn.setAttribute('aria-expanded', initialStates.sizeTable ? 'true' : 'false');
                    toggleBtn.setAttribute('aria-label', initialStates.sizeTable ? '收合尺寸表' : '展開尺寸表');
                }

                // 為整個 h5 標題添加點擊事件
                headerElement.addEventListener('click', (e) => {
                    // 阻止事件冒泡
                    e.stopPropagation();
                    const isCollapsed = !sizeTableContent.classList.contains('show');
                    this.animateCollapse(sizeTableContent, toggleBtn, isCollapsed, '尺寸表');
                });

                // 為按鈕添加點擊事件（阻止冒泡以免重複觸發）
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isCollapsed = !sizeTableContent.classList.contains('show');
                        this.animateCollapse(sizeTableContent, toggleBtn, isCollapsed, '尺寸表');
                    });
                }
            }
        }
    }

    /**
     * 使用 API 管理器獲取數據 (靜態方法，供外部調用)
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     * @returns {Promise} 返回數據
     */
    static async fetchData(clothID, brand) {
        if (!window.InfoDisplayAPIManager) {
            throw new Error('InfoDisplayAPIManager 未載入，請先引入 api-manager.js');
        }
        
        return await window.InfoDisplayAPIManager.getClothInfo(clothID, brand);
    }

    /**
     * 便利方法：獲取數據並設置到組件
     * @param {string} clothID - 服裝ID
     * @param {string} brand - 品牌
     */
    async loadData(clothID, brand) {
        try {
            const data = await InfoDisplayComponent.fetchData(clothID, brand);
            this.setApiData(data);
        } catch (error) {
            console.error('載入數據失敗:', error);
        }
    }

    // 設置 ResizeObserver 監聽父容器寬度
    setupResizeObserver() {
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const containerWidth = entry.contentRect.width;
                    console.log(`父容器寬度變化: ${containerWidth}px`);
                    this.updateLayout(containerWidth);
                }
            });

            // 監聽父容器的寬度變化
            const parentElement = this.parentElement;
            if (parentElement) {
                this.resizeObserver.observe(parentElement);
                console.log('ResizeObserver 已設置，監聽父容器');
            } else {
                console.log('找不到父元素，監聽組件本身');
                this.resizeObserver.observe(this);
            }
        } else {
            // 如果不支持 ResizeObserver，使用 window resize 作為後備
            window.addEventListener('resize', () => {
                const parentWidth = this.parentElement ? this.parentElement.offsetWidth : this.offsetWidth;
                console.log(`窗口調整，父容器寬度: ${parentWidth}px`);
                this.updateLayout(parentWidth);
            });
            console.log('使用 window resize 後備方案');
        }

        // 初始化時也檢查一次
        setTimeout(() => {
            const parentWidth = this.parentElement ? this.parentElement.offsetWidth : this.offsetWidth;
            console.log(`初始化父容器寬度: ${parentWidth}px`);
            this.updateLayout(parentWidth);
        }, 200);
    }

    // 根據容器寬度更新佈局
    updateLayout(containerWidth) {
        const container = this.shadowRoot.querySelector('#inffits-info-display-reference-component');
        if (!container) {
            console.log('找不到容器元素');
            return;
        }

        // 移除現有的響應式類
        container.classList.remove('mobile-layout', 'desktop-layout');

        // 根據父容器寬度添加相應的類
        if (containerWidth <= 768) {
            container.classList.add('mobile-layout');
            console.log(`應用移動端佈局 (寬度: ${containerWidth}px)`);
            // 檢查是否需要應用小型尺寸表樣式
            this.checkSmallSizeTableStyle();
        } else {
            container.classList.add('desktop-layout');
            console.log(`應用桌面端佈局 (寬度: ${containerWidth}px)`);
            
            // 桌面端移除小型尺寸表樣式
            container.classList.remove('small-size-table');
        }
    }

    /**
     * 檢查是否需要應用小型尺寸表樣式（僅在移動端）
     */
    checkSmallSizeTableStyle() {
        if (this.apiData && this.apiData.sizeInfo && this.apiData.sizeInfo.length > 0) {
            const sizeInfoKeys = Object.keys(this.apiData.sizeInfo[0]);
            if (sizeInfoKeys.length <= 3) {
                const container = this.shadowRoot.querySelector('#inffits-info-display-reference-component');
                if (container) {
                    container.classList.add('small-size-table');
                }
            } else {
                const container = this.shadowRoot.querySelector('#inffits-info-display-reference-component');
                if (container) {
                    container.classList.remove('small-size-table');
                }
            }
        }
    }

    // 渲染組件
    render() {
        const dataCollapsible = this.isCollapsible ? 'true' : 'false';
        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div id="inffits-info-display-reference-component" class="component-container" data-collapsible="${dataCollapsible}">
                <!-- 初始容器，內容將通過 JavaScript 動態添加 -->
            </div>
        `;
    }

    // 獲取樣式
    getStyles() {
        return `
#inffits-info-display-reference-component {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  font-family: "Chocolate Classical Sans", "Figtree", sans-serif;
  background-color: #fff;
  color: #000;
}

#inffits-info-display-reference-component main {
  display: block;
}

#inffits-info-display-reference-component h1,
#inffits-info-display-reference-component h2,
#inffits-info-display-reference-component h3,
#inffits-info-display-reference-component h4,
#inffits-info-display-reference-component h5,
#inffits-info-display-reference-component h6,
#inffits-info-display-reference-component p,
#inffits-info-display-reference-component blockquote,
#inffits-info-display-reference-component figure,
#inffits-info-display-reference-component dl,
#inffits-info-display-reference-component dd {
  margin: 0;
  cursor: default;
}

#inffits-info-display-reference-component ul,
#inffits-info-display-reference-component ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

#inffits-info-display-reference-component a {
  color: inherit;
  text-decoration: none;
}

#inffits-info-display-reference-component img,
#inffits-info-display-reference-component picture,
#inffits-info-display-reference-component video,
#inffits-info-display-reference-component canvas,
#inffits-info-display-reference-component svg {
  display: block;
  max-width: 100%;
  height: auto;
}

#inffits-info-display-reference-component button,
#inffits-info-display-reference-component input,
#inffits-info-display-reference-component select,
#inffits-info-display-reference-component textarea {
  font: inherit;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  outline: none;
}

#inffits-info-display-reference-component table {
  border-collapse: collapse;
  border-spacing: 0;
}

#inffits-info-display-reference-component br {
    display: none;
}



#inffits-info-display-reference-component *,
#inffits-info-display-reference-component *::before,
#inffits-info-display-reference-component *::after {
        box-sizing: border-box;
}

    #inffits-info-display-reference-component .custom-container {
        width: 100%;
        margin: 0 auto;
        max-width: 1280px;
    }

    #inffits-info-display-reference-component .custom-row {
        display: flex;
        flex-direction: column;
    }
    
    /* 桌面端佈局 */
    #inffits-info-display-reference-component.desktop-layout .custom-row {
        flex-direction: row;
        align-items: flex-end;
    }

    #inffits-info-display-reference-component .custom-col-7 {
        position: relative;
        width: 100%;
        flex: 0 0 100%;
        max-width: 100%;
    }

    #inffits-info-display-reference-component .custom-col-5 {
        position: relative;
        width: 100%;
        flex: 0 0 100%;
        max-width: 100%;
    }

    /* 桌面端列寬度 */
    #inffits-info-display-reference-component.desktop-layout .custom-col-7 {
        flex: 0 0 58.333333%;
        max-width: 58.333333%;
    }

    #inffits-info-display-reference-component.desktop-layout .custom-col-5 {
        flex: 0 0 41.666667%;
        max-width: 41.666667%;
    }

    #inffits-info-display-reference-component .custom-order-1 {
        order: 2;
    }

    #inffits-info-display-reference-component .custom-order-2 {
        order: 1;
    }

    /* 桌面端順序 */
    #inffits-info-display-reference-component.desktop-layout .custom-order-1 {
        order: 1;
    }

    #inffits-info-display-reference-component.desktop-layout .custom-order-2 {
        order: 2;
    }

    #inffits-info-display-reference-component .custom-d-flex {
        display: flex;
    }

    #inffits-info-display-reference-component .custom-align-items-center {
        align-items: center;
    }

    #inffits-info-display-reference-component .custom-justify-content-center {
        justify-content: center;
    }

    /* 移動端樣式 */
    #inffits-info-display-reference-component.mobile-layout .sizeinfo-col {
            margin-top: 20px;
    }

    /* 桌面端佈局調整 */
    #inffits-info-display-reference-component.desktop-layout .custom-row {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }
        
    #inffits-info-display-reference-component td {
        font-family:  "Figtree", sans-serif;
  font-weight: 400;
    }

#inffits-info-display-reference-component th {
        font-family: "Chocolate Classical Sans", "Figtree", sans-serif;
  font-weight: 400;
    }

    #inffits-info-display-reference-component .sizetable-demo {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0px 6px;
        position: relative;
        margin: 0 auto;
    }

    /* 桌面端佈局時的 border-spacing */
    #inffits-info-display-reference-component.desktop-layout .sizetable-demo {
        border-spacing: 0px 12px;
    }

    /* 固定第一列的表格容器樣式 */
    #inffits-info-display-reference-component .fixed-table-container {
        position: relative;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    #inffits-info-display-reference-component .fixed-table-container::-webkit-scrollbar {
        display: none;
    }

    /* 表格樣式調整 */
    #inffits-info-display-reference-component .sizetable-demo {
        width: 100%;
        border-collapse: separate;
        position: relative;
    }

    /* 第一列固定樣式 */
    #inffits-info-display-reference-component .sizetable-demo th:first-child,
    #inffits-info-display-reference-component .sizetable-demo td:first-child {
        position: sticky;
        left: 0;
        z-index: 10;
        background-color: #fff;
    }

    /* 滾動時為第一列添加陰影效果 */
    #inffits-info-display-reference-component .fixed-table-container.scrolled .sizetable-demo th:first-child,
    #inffits-info-display-reference-component .fixed-table-container.scrolled .sizetable-demo td:first-child {
        box-shadow: 2px 0 4px rgba(0,0,0,0.1);
    }

    /* 確保第一列在選中狀態下保持背景色 */
    #inffits-info-display-reference-component .sizetable-demo .choosed td:first-child {
        background-color: #f5f5f5;
    }

    /* 滾動時選中狀態保持陰影 */
    #inffits-info-display-reference-component .fixed-table-container.scrolled .sizetable-demo .choosed td:first-child {
        background-color: #f5f5f5;
        box-shadow: 2px 0 4px rgba(0,0,0,0.1);
    }

    /* 確保其他列的左邊框不與第一列衝突 */
    #inffits-info-display-reference-component .sizetable-demo td:not(:first-child) {
        border-left: none;
    }

    /* 其他列最小寬度確保能夠滾動 */
    #inffits-info-display-reference-component .sizetable-demo th:not(:first-child),
    #inffits-info-display-reference-component .sizetable-demo td:not(:first-child) {
        min-width: 60px;
        max-width: 110px;
        white-space: nowrap;
    }

    #inffits-info-display-reference-component .sizeinfo-col {
        position: relative; 
    }

#inffits-info-display-reference-component #svg_size {
        right: 10px;
    }

           @media (min-width: 767px) {
  #inffits-info-display-reference-component #svg_size {
            right: 100px;
        }
    }
    
    #inffits-info-display-reference-component .sizetable-demo th, #inffits-info-display-reference-component .sizetable-demo td {
        text-align: center;
        vertical-align: middle;
        padding: 12px 18px;
    }

    /* 桌面端佈局時的 padding */
    #inffits-info-display-reference-component.desktop-layout .sizetable-demo th, 
    #inffits-info-display-reference-component.desktop-layout .sizetable-demo td {
        padding: 16px 36px;
    }

    #inffits-info-display-reference-component .sizetable-demo th {
        padding: 0px 15px;
        white-space: nowrap; 
        overflow-x: scroll; 
        -ms-overflow-style: none; 
        scrollbar-width: none; 
    }
    
    #inffits-info-display-reference-component .sizetable-demo tbody tr {
       cursor: pointer;
    }
    
    #inffits-info-display-reference-component .sizetable-demo th:first-child {
        width: 25%;
        padding: 12px 30px;
    }
    
    /* 桌面端佈局時第一列的 padding */
    #inffits-info-display-reference-component.desktop-layout .sizetable-demo th:first-child {
        padding: 16px 60px;
    }
    
    /* 移動端小螢幕樣式調整 */
    #inffits-info-display-reference-component.mobile-layout .sizetable-demo th {
        padding: 12px 18px;
    }

    #inffits-info-display-reference-component.mobile-layout .sizetable-demo th:first-child {
        padding: 12px 24px;
    }

    #inffits-info-display-reference-component.mobile-layout .sizetable-demo, 
    #inffits-info-display-reference-component.mobile-layout .table-container, 
    #inffits-info-display-reference-component.mobile-layout #TryonTable {
       color: var(--black-3-b-3-b-32, #3B3B32);
       text-align: center;
       font-family: "Chocolate Classical Sans", "Figtree", sans-serif;
       font-size: 13px;
       font-style: normal;
       font-weight: 400;
       line-height: 16px; /* 123.077% */
       letter-spacing: 0.52px;
    }

    #inffits-info-display-reference-component.desktop-layout .sizetable-demo, 
    #inffits-info-display-reference-component.desktop-layout .table-container, 
    #inffits-info-display-reference-component.desktop-layout #TryonTable {
       color: var(--black-3-b-3-b-32, #3B3B32);
       text-align: center;
       font-family: "Chocolate Classical Sans", "Figtree", sans-serif;
       font-size: 16px;
       font-weight: 500;
       line-height: 21px; /* 131.25% */
       letter-spacing: 0.52px;
    }

    #inffits-info-display-reference-component .sizetable-demo td {
        border-color: gray;
        color: gray;
    }
    
    #inffits-info-display-reference-component .sizetable-demo td {
  border-top: 1.5px solid #dee2e6;
        border-bottom: 1.5px solid #dee2e6;
    }
    
    #inffits-info-display-reference-component .sizetable-demo td:first-child {
  border-left: 1.5px solid #dee2e6;
    }
    
    #inffits-info-display-reference-component .sizetable-demo td:last-child {
  border-right: 1.5px solid #dee2e6;
    }
    
    #inffits-info-display-reference-component .sizetable-demo td:first-child {
  border-top-left-radius: 13px;
  border-bottom-left-radius: 13px;
    }
    
    #inffits-info-display-reference-component .sizetable-demo td:last-child {
  border-top-right-radius: 13px;
  border-bottom-right-radius: 13px;
}

#inffits-info-display-reference-component .sizetable-demo .choosed {
        background-color: #f5f5f5;
    }
    
#inffits-info-display-reference-component .sizetable-demo .choosed td {
        border-color: black;   
  color: black;
    }
    
    #inffits-info-display-reference-component #Clothes_Attributes .table-container {
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
    }
    
    #inffits-info-display-reference-component #Clothes_Attributes table {
        width: 100%;
        border-collapse: collapse;
    }
    
    #inffits-info-display-reference-component #Clothes_Attributes th, #inffits-info-display-reference-component #Clothes_Attributes td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: center;
    }
    
#inffits-info-display-reference-component #Clothes_Attributes td {
        color: gray;
    }
    
    #inffits-info-display-reference-component #Clothes_Attributes th {
        background-color: #f2f2f2;
        font-weight: 400;
        white-space: nowrap;
    }
    
    #inffits-info-display-reference-component #Clothes_Attributes .checkmark {
        font-size: 18px;
        color: black !important;
  display: flex;
  align-items: center;
  justify-content: center;
    }
  #inffits-info-display-reference-component #Clothes_Attributes .checkmark{
  padding: 0
  }
  #inffits-info-display-reference-component #Clothes_Attributes .checkmark span,
  #inffits-info-display-reference-component #Clothes_Attributes .materials-content{
  color: var(--black-3-b-3-b-32, #3B3B32);
text-align: center;
font-size: 13px;
font-style: normal;
font-weight: 400;
line-height: 16px; /* 123.077% */
letter-spacing: 0.52px;
  }

  #inffits-info-display-reference-component.desktop-layout #Clothes_Attributes .checkmark span,
  #inffits-info-display-reference-component.desktop-layout #Clothes_Attributes .materials-content{
font-size: 16px;
line-height: 21px; /* 131.25% */
letter-spacing: 0.64px;
  }

#inffits-info-display-reference-component #Clothes_Attributes td > span {
    color:rgba(59, 59, 50, 0.4);
    text-align: center;
    font-family: "Chocolate Classical Sans", "Figtree", sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px; /* 123.077% */
    letter-spacing: 0.52px;
    display: flex;
    padding: 5px 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 100px;
    max-width: fit-content;
    margin: 0 auto;
}

#inffits-info-display-reference-component.desktop-layout #Clothes_Attributes td > span {
      font-size: 16px;
    line-height: 19px;
      letter-spacing: 0.64px;
      padding: 8px 12px;
}

#inffits-info-display-reference-component #Clothes_Attributes .active > span {
    color: var(--black-1-e-1-e-19, #1E1E19);
    background: var(--white-f-3-f-3-ef, #F3F3EF);
}

#inffits-info-display-reference-component #TryonTable-container {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow-x: scroll;
    -ms-overflow-style: none;  
    scrollbar-width: none;  
}

#inffits-info-display-reference-component #TryonReport .filter-container {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: scroll;
}

/* 桌面端佈局時右對齊 */
#inffits-info-display-reference-component.desktop-layout #TryonReport .filter-container {
    justify-content: flex-end;
}

#inffits-info-display-reference-component #TryonReport .filter-btn-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    gap: 8px;
    padding: 2px 0;
}

#inffits-info-display-reference-component #TryonReport .filter-btn-container::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
}

#inffits-info-display-reference-component #TryonReport .filter-button {
    margin-left: 0;
    padding: 4px 10px;
    outline: none;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 100px;
    font-size: 14px;
    color: rgba(30, 30, 25, 0.4);
    font-family: "Figtree", sans-serif;
    white-space: nowrap;
    flex-shrink: 0;
    border-radius: 50px;
    border: 1px solid var(--black-101-e-1-e-1910, rgba(30, 30, 25, 0.10));
    background: var(--white-f-3-f-3-ef, #F3F3EF);
}

#inffits-info-display-reference-component #TryonReport .filter-button:hover {
    background-color: #ddd;
}

#inffits-info-display-reference-component #TryonReport .filter-button.active {
    background-color: #333;
    color: #fff;
}

#inffits-info-display-reference-component #TryonReport table {
    width: 100%;
    border-collapse: collapse;
    overflow-x: scroll;
}

#inffits-info-display-reference-component #TryonReport th, #inffits-info-display-reference-component #TryonReport td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  white-space: nowrap; 
  overflow-x: scroll; 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

#inffits-info-display-reference-component #TryonReport th {
    background-color: #f2f2f2;
}

#inffits-info-display-reference-component rect {
    fill: #333;
}

#inffits-info-display-reference-component text {
  fill: white;
  font-size: 11px;
}

#inffits-info-display-reference-component .svg-container {
      position: relative;
      text-align: center;
    }

#inffits-info-display-reference-component .garment-svg {
      position: relative;
      display: flex;
  width: 40%;
  min-width: 300px;
      height: auto;
  margin: auto;
  margin-bottom: 150px;
}

#inffits-info-display-reference-component #svg_unit, #inffits-info-display-reference-component #svg_size {
  color: black;
  font-size: 14px;
        display: flex;
        justify-content: flex-end;
    }

#inffits-info-display-reference-component #svg_size {
  display: none;
}

#inffits-info-display-reference-component #svg_imgsrc {
  width: 70%;
  height: 70%;
  margin: auto;
  transform: translate(0%, 20%);
  opacity: 0.5;
}

#inffits-info-display-reference-component #svgContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0; 
  display: none;
}

#inffits-info-display-reference-component .size-btn-wrapper {
  position: relative;
      width: 100%;
      margin: auto;
      overflow: scroll;
      justify-content: center;
      scrollbar-width: none;
      -ms-overflow-style: none;
      border-collapse: collapse;
    }

#inffits-info-display-reference-component .size-btn-wrapper .size-btn {
        border: 1px solid lightgray;
        padding: 12px 20px;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        display: table-cell;
        border: 1px solid #333;
        min-width: 80px;
  color: #333;
      }
      
#inffits-info-display-reference-component .size-btn-wrapper .size-btn.active {
      background: #858585;
  color: white;
}

/* 桌面端 SVG 尺寸位置調整 */
#inffits-info-display-reference-component.desktop-layout #svg_size {
    right: 100px;
}

/* 移動端篩選按鈕字體調整 - 基於父容器寬度 */
#inffits-info-display-reference-component.mobile-layout #TryonReport .filter-button {
    font-size: 12px !important; 
}

/* 折疊按鈕樣式 - Bootstrap Accordion 風格 */
#inffits-info-display-reference-component .collapse-btn {
    background: transparent;
    border: none;
    border-radius: 0;
    width: auto;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    color: #212529;
    transition: color 0.15s ease-in-out;
    padding: 0;
    margin: 0;
    line-height: 1;
    box-shadow: none;
    position: relative;
}

#inffits-info-display-reference-component .collapse-btn::before {
    display: none;
}

#inffits-info-display-reference-component .collapse-btn:hover {
    background: transparent;
    border: none;
    color: #0056b3;
    transform: none;
    box-shadow: none;
}

#inffits-info-display-reference-component .collapse-btn:hover::before {
    display: none;
}

#inffits-info-display-reference-component .collapse-btn:active {
    background: transparent;
    transform: none;
    box-shadow: none;
}

#inffits-info-display-reference-component .collapse-btn:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* 箭頭圖標樣式 - Bootstrap 風格 */
#inffits-info-display-reference-component .collapse-btn .arrow-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease-in-out;
    display: inline-block;
    fill: currentColor;
}

/* 展開狀態：箭頭向下 */
#inffits-info-display-reference-component .collapse-btn[aria-expanded="true"] .arrow-icon {
    transform: rotate(0deg);
}

/* 收合狀態：箭頭向右 */
#inffits-info-display-reference-component .collapse-btn[aria-expanded="false"] .arrow-icon {
    transform: rotate(-90deg);
}

#inffits-info-display-reference-component .collapse-btn .btn-icon {
    transition: transform 0.2s ease-in-out;
    display: inline-block;
}

#inffits-info-display-reference-component h5 > span{
    color: #333;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 15px; /* 115.385% */
}

#inffits-info-display-reference-component.desktop-layout h5 > span{
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 23px; /* 127.778% */
}

/* 確保標題行的佈局 - 預設 padding-top 為 0 */
#inffits-info-display-reference-component .inf-container h5 {
    padding-bottom: 20px;
    border-bottom: 1px solid #dee2e6;
    padding-top: 0;
}

#inffits-info-display-reference-component #TryonReport h5 {
    padding-bottom: 20px;
    border-bottom: 1px solid #dee2e6;
    padding-top: 0;
}

#inffits-info-display-reference-component #Clothes_Attributes h5 {
  padding-bottom: 20px;
  padding-top: 0;
}

/* 可點擊標題的樣式 */
#inffits-info-display-reference-component .collapsible-header {
    cursor: pointer;
    user-select: none;
    position: relative;
}

/* 有折疊功能時才應用的 attributes-content padding-top */
#inffits-info-display-reference-component[data-collapsible="true"] .attributes-content {
    padding-top: 18px;
}

/* 內容區域的過渡效果 - 只在有折疊功能時應用 */
#inffits-info-display-reference-component[data-collapsible="true"] .size-table-content,
#inffits-info-display-reference-component[data-collapsible="true"] .tryon-report-content,
#inffits-info-display-reference-component[data-collapsible="true"] .attributes-content {
    transition: height 0.25s ease-out;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 20px;
    overflow: hidden;
}

/* 簡化的折疊狀態 - 只在有折疊功能時應用 */
#inffits-info-display-reference-component[data-collapsible="true"] .size-table-content.collapse,
#inffits-info-display-reference-component[data-collapsible="true"] .tryon-report-content.collapse,
#inffits-info-display-reference-component[data-collapsible="true"] .attributes-content.collapse {
    height: 0;
    padding-bottom: 0;
    border-bottom: none;
    overflow: hidden;
}

/* 展開狀態 - 只在有折疊功能時應用 */
#inffits-info-display-reference-component[data-collapsible="true"] .size-table-content.show,
#inffits-info-display-reference-component[data-collapsible="true"] .tryon-report-content.show,
#inffits-info-display-reference-component[data-collapsible="true"] .attributes-content.show {
    /* height 將由 JavaScript 動態控制 */
    overflow: visible;
}

#inffits-info-display-reference-component[data-collapsible="true"] .size-table-content.collapsing,
#inffits-info-display-reference-component[data-collapsible="true"] .tryon-report-content.collapsing,
#inffits-info-display-reference-component[data-collapsible="true"] .attributes-content.collapsing {
    transition: height 0.2s ease-out;
    overflow: hidden !important;
}

#inffits-info-display-reference-component[data-collapsible="true"] .size-table-content.collapse:not(.show),
#inffits-info-display-reference-component[data-collapsible="true"] .tryon-report-content.collapse:not(.show),
#inffits-info-display-reference-component[data-collapsible="true"] .attributes-content.collapse:not(.show) {
    display: none;
}

#inffits-info-display-reference-component[data-collapsible="true"] .size-table-content.collapse.show,
#inffits-info-display-reference-component[data-collapsible="true"] .tryon-report-content.collapse.show,
#inffits-info-display-reference-component[data-collapsible="true"] .attributes-content.collapse.show {
    display: block;
}

/* 沒有啟用折疊功能時，移除padding和border */
#inffits-info-display-reference-component:not([data-collapsible="true"]) .inf-container h5,
#inffits-info-display-reference-component:not([data-collapsible="true"]) #TryonReport h5,
#inffits-info-display-reference-component:not([data-collapsible="true"]) #Clothes_Attributes h5 {
    border-color: transparent;
    padding-bottom: 24px;
    padding-top: 0;
}

/* 有折疊功能時，設置 padding-top 為 20px */
#inffits-info-display-reference-component[data-collapsible="true"] .inf-container h5,
#inffits-info-display-reference-component[data-collapsible="true"] #TryonReport h5,
#inffits-info-display-reference-component[data-collapsible="true"] #Clothes_Attributes h5 {
    padding-top: 20px;
}

/* 有折疊功能且狀態為展開時，移除h5的padding-bottom和border */
/* 有折疊功能且狀態為展開時，移除h5的padding-bottom和border */
#inffits-info-display-reference-component[data-collapsible="true"] .size-table-content.show ~ h5,
#inffits-info-display-reference-component[data-collapsible="true"] .tryon-report-content.show ~ h5,
#inffits-info-display-reference-component[data-collapsible="true"] .attributes-content.show ~ h5 {
    border-bottom: none;
}

/* 更精確的選擇器：直接選擇展開狀態的標題 */
#inffits-info-display-reference-component[data-collapsible="true"] .size-table-content.show + h5,
#inffits-info-display-reference-component[data-collapsible="true"] .tryon-report-content.show + h5,
#inffits-info-display-reference-component[data-collapsible="true"] .attributes-content.show + h5,
#inffits-info-display-reference-component[data-collapsible="true"] h5:has(+ .size-table-content.show),
#inffits-info-display-reference-component[data-collapsible="true"] h5:has(+ .tryon-report-content.show),
#inffits-info-display-reference-component[data-collapsible="true"] h5:has(+ .attributes-content.show) {
    border-bottom: none;
}

/* 開啟折疊功能且試穿資訊展開時，移除TryonReport h5的padding和border */
#inffits-info-display-reference-component[data-collapsible="true"] #TryonReport .tryon-report-content.show ~ h5,
#inffits-info-display-reference-component[data-collapsible="true"] #TryonReport h5:has(+ .tryon-report-content.show) {
    border-bottom: none;
}

/* 正確的選擇器：直接選擇展開狀態下的TryonReport h5 */
#inffits-info-display-reference-component[data-collapsible="true"] #TryonReport:has(.tryon-report-content.show) h5,
#inffits-info-display-reference-component[data-collapsible="true"] #TryonReport .tryon-report-content.show ~ * h5,
#inffits-info-display-reference-component[data-collapsible="true"] #TryonReport .tryon-report-content.collapsing ~ * h5 {
    border-bottom: none !important;
}

/* 確保在展開動畫開始時立刻移除border - 包含.collapsing狀態 */
#inffits-info-display-reference-component[data-collapsible="true"] #TryonReport h5:has(+ .tryon-report-content.show),
#inffits-info-display-reference-component[data-collapsible="true"] #TryonReport h5:has(+ .tryon-report-content.collapsing) {
    border-bottom: none !important;
}

/* 確保所有區塊在展開動畫開始時立刻移除border - 包含.collapsing狀態 */
#inffits-info-display-reference-component[data-collapsible="true"] h5:has(+ .size-table-content.show),
#inffits-info-display-reference-component[data-collapsible="true"] h5:has(+ .size-table-content.collapsing),
#inffits-info-display-reference-component[data-collapsible="true"] h5:has(+ .tryon-report-content.show),
#inffits-info-display-reference-component[data-collapsible="true"] h5:has(+ .tryon-report-content.collapsing),
#inffits-info-display-reference-component[data-collapsible="true"] h5:has(+ .attributes-content.show),
#inffits-info-display-reference-component[data-collapsible="true"] h5:has(+ .attributes-content.collapsing) {
    border-bottom: none !important;
}

/* 沒有啟用折疊功能時，為TryonReport和Clothes_Attributes添加padding-top */
#inffits-info-display-reference-component:not([data-collapsible="true"]) #TryonReport,
#inffits-info-display-reference-component:not([data-collapsible="true"]) #Clothes_Attributes {
    padding-top: 64px;
}

/* 桌面端佈局時增加 padding-top */
#inffits-info-display-reference-component.desktop-layout:not([data-collapsible="true"]) #TryonReport,
#inffits-info-display-reference-component.desktop-layout:not([data-collapsible="true"]) #Clothes_Attributes {
    padding-top: 100px;
}

/* 小型尺寸表（移動端且 sizeInfo <= 3）的樣式 */
#inffits-info-display-reference-component.mobile-layout.small-size-table .custom-col-7 {
    max-width: 210px;
    margin: 0 auto;
}
    `;
    }

    // 設置事件監聽器
    setupEventListeners() {
        const sizeTable = this.gson.sizeGuide.sizeChart.sizeTable;
        const additionNotes = this.gson.sizeGuide.additionalInformation.notes;
        const datailTable = this.gson.sizeGuide.detailInformation.details;
        const imgSrc = this.gson.sizeGuide.sizeChart.imgSrc;

        // thead
        const dsizeTableHead = this.shadowRoot.querySelector(".d-size thead");
        if (dsizeTableHead) {
            const newRow = document.createElement("tr");
            for (let i = 0; i < sizeTable["hs"].length; i++) {
                const widthPercent = 100 / sizeTable["hs"].length;
                const th = document.createElement("th");
                th.style.width = widthPercent + "%";
                th.textContent = sizeTable["hs"][i];
                newRow.appendChild(th);
            }
            dsizeTableHead.appendChild(newRow);
        }

        // tbody
        const dsizeTableBody = this.shadowRoot.querySelector(".d-size tbody");
        if (dsizeTableBody) {
            for (let i = 0; i < sizeTable["sizeLong"].length; i++) {
                const newRow = document.createElement("tr");
                this.addClass(newRow, 'shad');

                for (let z = 0; z < sizeTable["sizeLong"][i].length; z++) {
                    const td = document.createElement("td");
                    td.textContent = sizeTable["sizeLong"][i][z];
                    newRow.appendChild(td);
                }
                dsizeTableBody.appendChild(newRow);
            }
        }

        // sizeChart imgSrc
        const sizeChartImg = this.shadowRoot.querySelector(".sizeChart img");
        if (sizeChartImg) {
            sizeChartImg.setAttribute("src", imgSrc);
        }

        // 處理詳細信息表格
        const dinformTableHead = this.shadowRoot.querySelector(".d-inform thead");
        const dinformTableBody = this.shadowRoot.querySelector(".d-inform tbody");

        if (dinformTableHead && dinformTableBody) {
            datailTable.forEach((row, index) => {
                if (index == 0) {
                    const newRow = document.createElement("tr");
                    const th = document.createElement("th");
                    th.setAttribute("colspan", "100%");
                    th.textContent = row["tabName"];
                    newRow.appendChild(th);
                    dinformTableHead.appendChild(newRow);
                } else {
                    const newRow = document.createElement("tr");
                    const th = document.createElement("th");
                    th.textContent = row["feature"];
                    newRow.appendChild(th);

                    const widthPercent = 200 / 3 / row["level"].length;

                    for (let i = 0; i < row["level"].length; i++) {
                        const td = document.createElement("td");
                        td.style.width = widthPercent + "%";

                        if (row["level"][i] == row["choose"]) {
                            const span = document.createElement("span");
                            span.textContent = row["level"][i];
                            td.appendChild(span);
                        } else {
                            td.textContent = row["level"][i];
                        }
                        newRow.appendChild(td);
                    }
                    dinformTableBody.appendChild(newRow);
                }
            });
        }
    }

    // SizeTable Display methods
    showSizeTable(sizeInfo, id_order) {
        let row_qty = 0;
        let col_qty = 0;
        let col_value = [];

        const morerow = (qty, headerdefault, id_order) => {
        if (row_qty == 0) {
                for (let k = 0; k < col_qty; k++) {
                    const thElement = this.shadowRoot.getElementById('th_tr_size' + id_order);
                    const th = document.createElement('th');
                th.id = 'header' + (k + 1) + id_order;
                    const span = document.createElement('span');
                span.textContent = headerdefault[(k + 1)];
                th.appendChild(span);
                thElement.appendChild(th);
            }
        }
        if (qty > 0) {
                for (let i = 0; i < qty; i++) {
                    const tbody = this.shadowRoot.getElementById('tbody_size' + id_order);
                    const tr = document.createElement('tr');
                    this.addClass(tr, 'size-btn');
                tr.id = 'row' + row_qty + id_order;
                tbody.appendChild(tr);

                    for (let k = 0; k < col_qty; k++) {
                        const td = document.createElement('td');
                    td.id = row_qty + '_' + k;
                    td.style.height = '48px';
                    tr.appendChild(td);

                    if (col_value[k] == null) {
                        col_value[k] = [];
                    }
                    col_value[k].push('');
                }
                row_qty++;
            }
            }
        };

        const displaytable = (Sizeinfo, table) => {
            const trs = table.rows;
            const trl = trs.length;
            const keys = Object.keys(Sizeinfo[0]);

            for (let i = 0; i < trl; i++) {
            if (i == 0) {
                    for (let j = 0; j < trs[i].children.length; j++) {
                        const info_header = keys[j];
                    trs[i].children[j].querySelector('span').innerHTML = info_header;
                }
            } else {
                    for (let j = 0; j < trs[i].children.length; j++) {
                    trs[i].children[j].textContent = Sizeinfo[i - 1][keys[j]];
                }
            }
        }
        };

        const addRowClickEvent = (tableId) => {
            const table = this.shadowRoot.getElementById(tableId);
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                row.addEventListener('click', () => {
                    const allChoosed = table.querySelectorAll('tr.choosed');
                    allChoosed.forEach(element => {
                        this.removeClass(element, 'choosed');
                    });
                    this.addClass(row, 'choosed');
            });
        });

            // 默認選中第一行
            if (rows.length > 0) {
                this.addClass(rows[0], 'choosed');
            }
        };

        const addCss = (tableID) => {
            const table = this.shadowRoot.getElementById(tableID);
            this.addClass(table, 'sizetable-demo');
        };

        col_qty = Object.keys(sizeInfo[0]).length;
        morerow(Object.keys(sizeInfo).length, Object.keys(sizeInfo[0]), id_order);
        displaytable(sizeInfo, this.shadowRoot.getElementById('demo' + id_order));
        addRowClickEvent('demo' + id_order);
        addCss('demo' + id_order);

        // 添加滾動檢測功能
        setTimeout(() => {
            const tableContainer = this.shadowRoot.querySelector('.fixed-table-container');
            if (tableContainer) {
                const handleScroll = () => {
                    if (tableContainer.scrollLeft > 0) {
                        this.addClass(tableContainer, 'scrolled');
                    } else {
                        this.removeClass(tableContainer, 'scrolled');
                    }
                };

                // 添加滾動事件監聽器
                tableContainer.addEventListener('scroll', handleScroll);
                
                // 初始檢查是否需要滾動
                const table = tableContainer.querySelector('table');
                if (table && table.offsetWidth > tableContainer.offsetWidth) {
                    // 表格寬度超過容器寬度，可能需要滾動
                    handleScroll(); // 檢查當前滾動狀態
                }
            }
        }, 100);
    }

    // TryonReport Display
    showTryonReport(avatarInfo) {
        // 自動觸發預設 active 的 filter button 點擊事件
        setTimeout(() => {
            const activeButton = this.shadowRoot.querySelector('.filter-button.active');
            if (activeButton) {
                activeButton.click();
            }
        }, 100);

        let row_qty_TR = 0;
        let col_qty_TR;
        let col_value_TR = [];

        const morerow_TR = (qty, headerdefault, n_150d, n_150, n_160, n_170, n_180u) => {
        if (row_qty_TR == 0) {
                for (let k = 0; k < col_qty_TR; k++) {
                    const thElement = this.shadowRoot.getElementById('th_tr_size_TR');
                    const th = document.createElement('th');
                th.id = 'headerTR' + k;
                    const span = document.createElement('span');
                span.textContent = headerdefault[k];
                th.appendChild(span);
                thElement.appendChild(th);
            }
        }

            for (let i = 0; i < n_150d; i++) {
                const tbody = this.shadowRoot.getElementById('tbody_size_TR');
                const tr = document.createElement('tr');
            tr.id = 'rowTR' + row_qty_TR;
                this.addClass(tr, '150d');
            tbody.appendChild(tr);

                for (let k = 0; k < col_qty_TR; k++) {
                    const td = document.createElement('td');
                td.id = row_qty_TR + '_' + k + 'TR';
                td.style.height = '30px';
                tr.appendChild(td);
                if (col_value_TR[k] == null) {
                    col_value_TR[k] = [];
                }
                col_value_TR[k].push('');
            }
            row_qty_TR++;
        }

            for (let i = 0; i < n_150; i++) {
                const tbody = this.shadowRoot.getElementById('tbody_size_TR');
                const tr = document.createElement('tr');
            tr.id = 'rowTR' + row_qty_TR;
                this.addClass(tr, '150');
            tr.style.display = 'none';
            tbody.appendChild(tr);

                for (let k = 0; k < col_qty_TR; k++) {
                    const td = document.createElement('td');
                td.id = row_qty_TR + '_' + k + 'TR';
                td.style.height = '30px';
                tr.appendChild(td);
                if (col_value_TR[k] == null) {
                    col_value_TR[k] = [];
                }
                col_value_TR[k].push('');
            }
            row_qty_TR++;
        }

            for (let i = 0; i < n_160; i++) {
                const tbody = this.shadowRoot.getElementById('tbody_size_TR');
                const tr = document.createElement('tr');
            tr.id = 'rowTR' + row_qty_TR;
                this.addClass(tr, '160');
            tr.style.display = 'none';
            tbody.appendChild(tr);

                for (let k = 0; k < col_qty_TR; k++) {
                    const td = document.createElement('td');
                td.id = row_qty_TR + '_' + k + 'TR';
                td.style.height = '30px';
                tr.appendChild(td);
                if (col_value_TR[k] == null) {
                    col_value_TR[k] = [];
                }
                col_value_TR[k].push('');
            }
            row_qty_TR++;
        }

            for (let i = 0; i < n_170; i++) {
                const tbody = this.shadowRoot.getElementById('tbody_size_TR');
                const tr = document.createElement('tr');
            tr.id = 'rowTR' + row_qty_TR;
                this.addClass(tr, '170');
            tr.style.display = 'none';
            tbody.appendChild(tr);

                for (let k = 0; k < col_qty_TR; k++) {
                    const td = document.createElement('td');
                td.id = row_qty_TR + '_' + k + 'TR';
                td.style.height = '30px';
                tr.appendChild(td);
                if (col_value_TR[k] == null) {
                    col_value_TR[k] = [];
                }
                col_value_TR[k].push('');
            }
            row_qty_TR++;
        }

            for (let i = 0; i < n_180u; i++) {
                const tbody = this.shadowRoot.getElementById('tbody_size_TR');
                const tr = document.createElement('tr');
            tr.id = 'rowTR' + row_qty_TR;
                this.addClass(tr, '180u');
            tr.style.display = 'none';
            tbody.appendChild(tr);

                for (let k = 0; k < col_qty_TR; k++) {
                    const td = document.createElement('td');
                td.id = row_qty_TR + '_' + k + 'TR';
                td.style.height = '30px';
                tr.appendChild(td);
                if (col_value_TR[k] == null) {
                    col_value_TR[k] = [];
                }
                col_value_TR[k].push('');
            }
            row_qty_TR++;
        }
        };

        const displaytable_TR = (Avatar, table, showChest) => {
            const trs = table.rows;
            const trl = trs.length;
            let keys;
            const Cup = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
            const CupV = [0, 2.5, 5, 7.5, 10, 12.5, 15];

        if (showChest) {
                keys = ['Name', 'Height', 'Weight', 'Chest', 'size', 'FitP'];
        } else {
                keys = ['Name', 'Height', 'Weight', 'size', 'FitP'];
            }

            const ResortAvatar = Avatar;
            ResortAvatar.sort((a, b) => {
            return parseInt(a.Order) - parseInt(b.Order);
        });

            const FitP_translater = (string) => {
                if (string == 'Tight') return '緊身';
                else if (string == 'Fit') return '合身';
                else if (string == 'Great') return '適中';
                else if (string == 'Comfort') return '舒適';
                else if (string == 'Loose') return '寬鬆';
                else return string;
            };

            const start = 'A';
            const startCharCode = start.charCodeAt(0) - 1;

            for (let i = 0; i < trl; i++) {
            if (i == 0) {
                    for (let j = 0; j < trs[i].children.length; j++) {
                        const info_header = keys[j];
                }
            } else {
                    for (let j = 0; j < trs[i].children.length; j++) {
                    if (keys[j] == 'Chest') {
                            trs[i].children[j].innerText = 'test';
                    } else if (keys[j] == 'Name' && Object.keys(ResortAvatar[i - 1]).includes('Image_src')) {
                        trs[i].children[j].innerHTML = '<div style="height: 60px;width: 60px;display: flex;align-items: center;margin: auto;"><img width=100% height=100% style="border-radius:60px" src="' + ResortAvatar[i - 1]['Image_src'] + '"></div>';
                    } else if (keys[j] == 'Name') {
                        trs[i].children[j].innerText = String.fromCharCode(startCharCode + i);
                    } else {
                        if (typeof ResortAvatar[i - 1][keys[j]] == 'undefined') {
                            trs[i].children[j].innerText = '-';
                        } else {
                            trs[i].children[j].innerText = FitP_translater(ResortAvatar[i - 1][keys[j]]);
                        }
                    }
                    }
                }
            }
        };

        const checkChest = (Avatar) => {
            const trl = Avatar.length;
            let showChest = true;
            for (let i = 0; i < trl; i++) {
            if (Avatar[i]['Chest'].includes('-')) {
                showChest = false;
            }
        }
            return showChest;
        };

        const group_by_height = (avatarInfo) => {
            for (let i = 0; i < avatarInfo.length; i++) {
            if (avatarInfo[i]['Height'] <= 150) {
                    height_group150down.push(avatarInfo[i]);
            } else if (avatarInfo[i]['Height'] <= 160 && avatarInfo[i]['Height'] >= 150) {
                    height_group150.push(avatarInfo[i]);
            } else if (avatarInfo[i]['Height'] <= 170 && avatarInfo[i]['Height'] >= 160) {
                    height_group160.push(avatarInfo[i]);
            } else if (avatarInfo[i]['Height'] >= 170 && avatarInfo[i]['Height'] <= 180) {
                    height_group170.push(avatarInfo[i]);
            } else if (avatarInfo[i]['Height'] >= 180) {
                    height_group180up.push(avatarInfo[i]);
                }
            }
        };

        let height_group150down = [];
        let height_group150 = [];
        let height_group160 = [];
        let height_group170 = [];
        let height_group180up = [];

        // 根據 collapsible 屬性決定是否添加折疊按鈕
        const collapseButton = this.isCollapsible ?
            '<button id="tryon-report-toggle" class="collapse-btn" aria-label="收合試穿資訊">−</button>' : '';

        // 根據是否啟用折疊功能決定標題樣式
        const titleStyle = this.isCollapsible ?
            '' : 'border-bottom:1px solid;';

        this.shadowRoot.querySelector('.inf-container').insertAdjacentHTML('beforeend', `
        <br><br><div id="TryonReport">
            <h5 id="tryon-report-header" class="${this.isCollapsible ? 'collapsible-header' : ''}" style="display: flex; justify-content: space-between; align-items: center;">
              <span style="${titleStyle}">
                試穿資訊
              </span>
              ${collapseButton}
            </h5>
            <div class="tryon-report-content">
            <br>
            <div class="filter-container">
                <div class="filter-btn-container">
                </div>
            </div>
            <div id="TryonTable-container">
            <table id="TryonTable"> 
                <thead> 
                    <tr id="th_tr_size_TR"> 
                    </tr> 
                </thead> 
                <tbody id="tbody_size_TR"></tbody> 
            </table>
            </div>
            </div>
            </div>`);

        group_by_height(avatarInfo);

        // 創建 filterTable 函數並綁定到組件實例
        this.filterTable = (heightRange, button) => {
            const table = this.shadowRoot.getElementById("TryonTable");
            const rows = table.getElementsByTagName("tr");

            for (let i = 1; i < rows.length; i++) {
                rows[i].style.display = "none";
                if (rows[i].classList.contains(heightRange)) {
                    rows[i].style.display = "";
                }
            }
            const buttons = this.shadowRoot.querySelectorAll('.filter-button');
            buttons.forEach(btn => {
                this.removeClass(btn, 'active');
            });
            this.addClass(button, 'active');
        };

        // 創建按鈕但不添加 onclick 屬性
        let isFirstButton = true;
        if (height_group150down.length) {
            this.shadowRoot.querySelector('.filter-btn-container').insertAdjacentHTML('beforeend', `<button class="filter-button${isFirstButton ? ' active' : ''}" data-range="150d">150 以下</button> `);
            isFirstButton = false;
        }
        if (height_group150.length) {
            this.shadowRoot.querySelector('.filter-btn-container').insertAdjacentHTML('beforeend', `<button class="filter-button${isFirstButton ? ' active' : ''}" data-range="150">150 ~ 160</button> `);
            isFirstButton = false;
        }
        if (height_group160.length) {
            this.shadowRoot.querySelector('.filter-btn-container').insertAdjacentHTML('beforeend', `<button class="filter-button${isFirstButton ? ' active' : ''}" data-range="160">160 ~ 170</button> `);
            isFirstButton = false;
        }
        if (height_group170.length) {
            this.shadowRoot.querySelector('.filter-btn-container').insertAdjacentHTML('beforeend', `<button class="filter-button${isFirstButton ? ' active' : ''}" data-range="170">170 ~ 180</button> `);
            isFirstButton = false;
        }
        if (height_group180up.length) {
            this.shadowRoot.querySelector('.filter-btn-container').insertAdjacentHTML('beforeend', `<button class="filter-button${isFirstButton ? ' active' : ''}" data-range="180u">180 以上</button> `);
            isFirstButton = false;
        }

        // 為所有按鈕添加事件監聽器
        setTimeout(() => {
            const filterButtons = this.shadowRoot.querySelectorAll('.filter-button');
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const heightRange = button.getAttribute('data-range');
                    this.filterTable(heightRange, button);
                    
                    // 智能滾動到合適位置
                    this.scrollToFilterButton(button);
                });
            });
        }, 100);

        const showChest = checkChest(avatarInfo);
    if (showChest) {
            col_qty_TR = 6;
            morerow_TR(Object.keys(avatarInfo).length, ['人員', '身高', '體重', '尺寸', '胸圍', '試穿偏好'], height_group150down.length, height_group150.length, height_group160.length, height_group170.length, height_group180up.length);
        } else {
            col_qty_TR = 5;
            morerow_TR(Object.keys(avatarInfo).length, ['人員', '身高', '體重', '尺寸', '試穿偏好'], height_group150down.length, height_group150.length, height_group160.length, height_group170.length, height_group180up.length);
        }

        displaytable_TR([...height_group150down, ...height_group150, ...height_group160, ...height_group170, ...height_group180up], this.shadowRoot.getElementById('TryonTable'), showChest);

        const widthPercentage = 100 / col_qty_TR;
        const tryonReportThs = this.shadowRoot.querySelectorAll('#TryonReport th');
        const tryonReportTds = this.shadowRoot.querySelectorAll('#TryonReport td');

        tryonReportThs.forEach(element => {
            element.style.width = widthPercentage + '%';
        });

        tryonReportTds.forEach(element => {
            element.style.width = widthPercentage + '%';
        });

        // 只有在啟用折疊功能時才添加事件監聽器
        if (this.isCollapsible) {
            setTimeout(() => {
                const headerElement = this.shadowRoot.getElementById('tryon-report-header');
                const toggleBtn = this.shadowRoot.getElementById('tryon-report-toggle');
                const tryonReportContent = this.shadowRoot.querySelector('.tryon-report-content');

                if (headerElement && tryonReportContent) {
                    // 檢查是否有外部配置的初始狀態
                    const initialStates = this._initialStates || {
                        sizeTable: true,
                        tryonReport: false,
                        attributes: false
                    };

                    // 使用配置的狀態進行初始化，避免閃爍
                    this.initializeContentState(tryonReportContent, initialStates.tryonReport);

                    // 設置初始按鈕內容和狀態
                    if (toggleBtn) {
                        toggleBtn.innerHTML = this.getArrowIcon();
                        toggleBtn.setAttribute('aria-expanded', initialStates.tryonReport ? 'true' : 'false');
                        toggleBtn.setAttribute('aria-label', initialStates.tryonReport ? '收合試穿資訊' : '展開試穿資訊');
                    }

                    // 為整個 h5 標題添加點擊事件
                    headerElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isCollapsed = !tryonReportContent.classList.contains('show');
                        this.animateCollapse(tryonReportContent, toggleBtn, isCollapsed, '試穿資訊');
                    });

                    // 為按鈕添加點擊事件（阻止冒泡以免重複觸發）
                    if (toggleBtn) {
                        toggleBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const isCollapsed = !tryonReportContent.classList.contains('show');
                            this.animateCollapse(tryonReportContent, toggleBtn, isCollapsed, '試穿資訊');
                        });
                    }
                }
            }, 100);
        }
    }

    // SVG Display
    svg_display(apiData) {
        const resize_svg = (data, Labels) => {
            const svgContainer = this.shadowRoot.getElementById('svgContainer');
            let squaresize = svgContainer ? svgContainer.offsetWidth : 0;
            
            // 如果容器寬度為 0，使用預設寬度
            if (squaresize === 0) {
                console.log('SVG 容器寬度為 0，使用預設寬度 300px');
                squaresize = 300;
            }
            
            console.log('SVG 渲染尺寸:', squaresize, 'px');

            const derive_svg_circum = (svg_data, a, b, centerX, centerY) => {
                let pathData = `M ${centerX} ${centerY - b} ` +
                    `a ${a} ${b} 0 1 0 0 ${2 * b} ` +
                    `a ${a} ${b} 0 1 0 0 ${-2 * b}`;

                const svg_dat = `<path d="${pathData}" stroke="rgb(27, 27, 27)" fill="none" stroke-dasharray="1, 1"/>`;
                svg_data += svg_dat;
                return svg_data;
            };

            const derive_svg_line = (svg_data, x1, y1, x2, y2) => {
                const m = 0;
                let x1_m, x2_m, y1_m, y2_m;

                if (y1 == y2) {
                    y1_m = y1;
                    y2_m = y2;
                    if (x1 > x2) {
                        x1_m = x1 - m;
                        x2_m = x2 + m;
                    } else {
                        x1_m = x1 + m;
                        x2_m = x2 - m;
                    }
                } else if (x1 == x2) {
                    x1_m = x1;
                    x2_m = x2;
                    if (y1 > y2) {
                        y1_m = y1 - m;
                        y2_m = y2 + m;
                    } else {
                        y1_m = y1 + m;
                        y2_m = y2 - m;
                    }
                } else {
                    x1_m = x1;
                    x2_m = x2;
                    y1_m = y1;
                    y2_m = y2;
                }

                const svg_dat = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgb(27, 27, 27)" stroke-width="1" stroke-dasharray="none"/>
                                <circle cx="${x1_m}" cy="${y1_m}" r="3" fill="rgb(27, 27, 27)"/>
                                <circle cx="${x2_m}" cy="${y2_m}" r="3" fill="rgb(27, 27, 27)"/>`;
                svg_data += svg_dat;
                return svg_data;
            };

            const derive_svg_exline = (svg_data, x1, y1, x2, y2, p, direction) => {
                const o_p = 15;
                let x1_p, x2_p, y1_p, y2_p;

                if (direction == 'Y') {
                    x1_p = x1;
                    x2_p = x2;
                    y1_p = y1 + p;
                    y2_p = y2 + p;
                    y1 -= o_p;
                    y2 -= o_p;
                } else if (direction == '-Y') {
                    x1_p = x1;
                    x2_p = x2;
                    y1_p = y1 - p;
                    y2_p = y2 - p;
                    y1 += o_p;
                    y2 += o_p;
                } else if (direction == 'X') {
                    x1_p = x1 + p;
                    x2_p = x2 + p;
                    x1 -= o_p;
                    x2 -= o_p;
                    y1_p = y1;
                    y2_p = y2;
                } else if (direction == '-X') {
                    x1_p = x1 - p;
                    x2_p = x2 - p;
                    x1 += o_p;
                    x2 += o_p;
                    y1_p = y1;
                    y2_p = y2;
                }
                const svg_dat = `<line x1="${x1}" y1="${y1}" x2="${x1_p}" y2="${y1_p}" stroke="darkgray" stroke-width="1" stroke-dasharray="1, 1"/>
                       <line x1="${x2}" y1="${y2}" x2="${x2_p}" y2="${y2_p}" stroke="darkgray" stroke-width="1" stroke-dasharray="1, 1"/>
                              `;
                svg_data += svg_dat;
                return svg_data;
            };

            let svg_data = '';

            for (let l = 0; l < Labels.length; l++) {
                if (data[Labels[l]].linetype_id == "DottedVertical" && 'angle' in data[Labels[l]].param) {
                    let x1 = data[Labels[l]].param.x1;
                    let x2 = data[Labels[l]].param.x2;
                    let y1 = data[Labels[l]].param.y1;
                    let y2 = data[Labels[l]].param.y2;
                    let avg_x = (parseFloat(x1) + parseFloat(x2)) / 2;
                    let avg_y = (parseFloat(y1) + parseFloat(y2)) / 2;

                    svg_data = derive_svg_line(svg_data, x1 * squaresize, y1 * squaresize, x2 * squaresize, y2 * squaresize);

                    let font_size = 11;
                    let rect_width = font_size * (data[Labels[l]].linename.length + (data[Labels[l]].value.length < 3 ? data[Labels[l]].value.length + 1 : data[Labels[l]].value.length)) * 1.1;
                    let rect_height = font_size * 1.5;
                    let x_offset = (avg_x * squaresize - 0.5 * rect_width) > 0 ? 0 : (1 - (avg_x * squaresize - 0.5 * rect_width));
                    svg_data = svg_data + `<rect x=${(avg_x * squaresize - 0.5 * rect_width > 0 ? avg_x * squaresize - 0.5 * rect_width : 1)} y=${avg_y * squaresize - 0.5 * rect_height} width=${rect_width} height=${rect_height} rx="10" ry="10" fill="white" stroke="rgb(27, 27, 27)" stroke-width="1"/><text letter-spacing="1px" x=${avg_x * squaresize + x_offset} y=${avg_y * squaresize } text-anchor="middle" dominant-baseline="central"  fill="rgb(27, 27, 27)" font-size="12">${data[Labels[l]].linename} ${['value' in data[Labels[l]] ? data[Labels[l]].value : '']}</text> `;

                } else if (data[Labels[l]].linetype_id == "Round") {
                    let a = data[Labels[l]].param.a;
                    let b = data[Labels[l]].param.b;
                    let X = data[Labels[l]].param.X;
                    let Y = data[Labels[l]].param.Y;
                    let avg_x = (parseFloat(X) + parseFloat(X)) / 2;
                    let avg_y = (parseFloat(Y) + parseFloat(Y)) / 2;
                    svg_data = derive_svg_circum(svg_data, a * squaresize, b * squaresize, X * squaresize, Y * squaresize);
                    let font_size = 11;
                    let rect_width = font_size * (data[Labels[l]].linename.length + (data[Labels[l]].value.length < 3 ? data[Labels[l]].value.length + 1 : data[Labels[l]].value.length)) * 1.1;
                    let rect_height = font_size * 1.5;
                    svg_data = svg_data + `<rect x=${avg_x * squaresize - 0.5 * rect_width} y=${avg_y * squaresize - 0.5 * rect_height} width=${rect_width} height=${rect_height} rx="10" ry="10" fill="white" stroke="rgb(27, 27, 27)" stroke-width="1"/><text letter-spacing="1px" x=${avg_x * squaresize} y=${avg_y * squaresize} text-anchor="middle" dominant-baseline="central"  fill="rgb(27, 27, 27)" font-size="12">${data[Labels[l]].linename} ${['value' in data[Labels[l]] ? data[Labels[l]].value : '']}</text> `;

                } else if (data[Labels[l]].linetype_id == "DottedRound") {
                    let x1 = data[Labels[l]].param.x1;
                    let x2 = data[Labels[l]].param.x2;
                    let y1 = data[Labels[l]].param.y1;
                    let y2 = data[Labels[l]].param.y2;
                    let avg_x = (parseFloat(x1) + parseFloat(x2)) / 2;
                    if (data[Labels[l]].linename_id != "ChestWidth") {
                        svg_data = derive_svg_exline(svg_data, x1 * squaresize, y1 * squaresize, x2 * squaresize, y2 * squaresize, 0.1 * squaresize, '-Y');
                    }
                    svg_data = derive_svg_line(svg_data, x1 * squaresize, y1 * squaresize, x2 * squaresize, y2 * squaresize);
                    let font_size = 11;
                    let rect_width = font_size * (data[Labels[l]].linename.length + (data[Labels[l]].value.length < 3 ? data[Labels[l]].value.length + 1 : data[Labels[l]].value.length)) * 1.1;
                    let rect_height = font_size * 1.5;
                    svg_data = svg_data + `<rect x=${avg_x * squaresize - 0.5 * rect_width} y=${y1 * squaresize - 0.5 * rect_height} width=${rect_width} height=${rect_height} rx="10" ry="10" fill="white" stroke="rgb(27, 27, 27)" stroke-width="1"/><text letter-spacing="1px" x=${avg_x * squaresize} y=${y1 * squaresize} text-anchor="middle" dominant-baseline="central"  fill="rgb(27, 27, 27)" font-size="12">${data[Labels[l]].linename} ${['value' in data[Labels[l]] ? data[Labels[l]].value : '']}</text> `;

                } else if (data[Labels[l]].linetype_id == "DottedVertical") {
                    let x1 = data[Labels[l]].param.x1;
                    let x2 = data[Labels[l]].param.x2;
                    let y1 = data[Labels[l]].param.y1;
                    let y2 = data[Labels[l]].param.y2;
                    let p = data[Labels[l]].param.p;
                    if (data[Labels[l]].linename_id == "ShoulderWidth") {
                        svg_data = derive_svg_exline(svg_data, (x1) * squaresize, (y1 * 1.6) * squaresize, x2 * squaresize, y2 * 1.6 * squaresize, p / 1.7 * squaresize, '-Y');
                        svg_data = derive_svg_line(svg_data, x1 * squaresize, (y1) * squaresize, x2 * squaresize, (y2) * squaresize);
                    } else {
                        svg_data = derive_svg_exline(svg_data, (x1) * squaresize, (y1) * squaresize, x2 * squaresize, y2 * squaresize, p * squaresize, '-Y');
                        svg_data = derive_svg_line(svg_data, x1 * squaresize, (y1) * squaresize, x2 * squaresize, (y2) * squaresize);
                    }
                    let avg_x = (parseFloat(x1) + parseFloat(x2)) / 2;
                    let avg_y = (parseFloat(y1) + parseFloat(y2)) / 2;
                    let font_size = 11;
                    let rect_width = font_size * (data[Labels[l]].linename.length + (data[Labels[l]].value.length < 3 ? data[Labels[l]].value.length + 1 : data[Labels[l]].value.length)) * 1.1;
                    let rect_height = font_size * 1.5;
                    svg_data = svg_data + `<rect x=${avg_x * squaresize - 0.5 * rect_width} y=${avg_y * squaresize - 0.5 * rect_height} width=${rect_width} height=${rect_height} rx="10" ry="10" fill="white" stroke="rgb(27, 27, 27)" stroke-width="1"/><text letter-spacing="1px" x=${avg_x * squaresize} y=${avg_y * squaresize} text-anchor="middle" dominant-baseline="central"  fill="rgb(27, 27, 27)" font-size="12">${data[Labels[l]].linename} ${['value' in data[Labels[l]] ? data[Labels[l]].value : '']}</text> `;
                }
            }

            const svgStructure = `<svg width="` + squaresize + `" height="` + 1.05 * squaresize + `" xmlns="http://www.w3.org/2000/svg">` +
                svg_data +
                `</svg>`;

            svgContainer.innerHTML = svgStructure;

            return {
                "data": data,
                "Labels": Labels
            };
        };

        let output_svg = apiData.chartInfo;
        let global_sizeinfo = apiData.sizeInfo; // 現在已經是陣列，不需要 JSON.parse
        let SizeStringList = [];
        for (let s = 0; s < global_sizeinfo.length; s++) {
            SizeStringList.push(global_sizeinfo[s]['尺寸']);
        }

        this.shadowRoot.querySelector('.sizeinfo-col').insertAdjacentHTML('beforebegin',
            `
    <div id="SVG-Display" class="custom-col-5 custom-order-2 custom-d-flex custom-align-items-center custom-justify-content-center" >
        <div >
            <div class='garment-svg' style="margin-bottom: 45px;">
                <img id="svg_imgsrc"  onerror="this.style.display='none';">
                <div id='svgContainer'></div>    
            </div>
            
            <div class="size-btn-wrapper" data-labels="${apiData.chartInfo.Labels}">
            </div>
            <div id="svg_size">Size:&nbsp;<span></span></div>
        </div>
    </div>
        `);

        this.shadowRoot.querySelector('.sizeinfo-col').insertAdjacentHTML('beforeend',
            `
    <div id="svg_unit">單位:&nbsp;<span></span></div>
       `);

        const svgImgSrc = this.shadowRoot.getElementById('svg_imgsrc');
        if (svgImgSrc) {
            svgImgSrc.src = "https://www.myinffits.com/images/garment_svgs/" + output_svg.data.filename + ".svg";

            svgImgSrc.onload = () => {
                this.initializeSVGDisplay();
            };

            svgImgSrc.onerror = () => {
                this.initializeSVGDisplay();
            };
        }

        const svgUnitSpan = this.shadowRoot.querySelector('#svg_unit span');
        if (apiData.punit == 'cm' && svgUnitSpan) {
            svgUnitSpan.textContent = 'cm(±2)';
        } else if (svgUnitSpan) {
            svgUnitSpan.textContent = '英吋inch(±2)';
        }

        const mapMeasurement = (input) => {
            const measurementGroups = {
                "ChestWidth": ['胸寬', '衣寬', '身寬'],
                "ChestCircum": ['胸圍', '衣圍', '上胸圍'],
                "ClothLength": ['衣長', '身長', '全長'],
                "HemWidth": ['下擺寬', '下擺'],
                "ShoulderWidth": ['肩寬'],
                "SleeveLength": ['袖長'],
                "HipCircum": ['臀圍'],
                "HipWidth": ['臀寬'],
                "PantHemWidth": ['褲口寬', '褲口'],
                "PantLength": ['褲長', '全長'],
                "SkirtLength": ['裙長', '全長'],
                "WaistCircum": ['腰圍'],
                "WaistWidth": ['腰寬']
            };

            for (const measurementType in measurementGroups) {
                if (measurementGroups.hasOwnProperty(measurementType)) {
                    const keywords = measurementGroups[measurementType];
                    if (keywords.some(keyword => input.includes(keyword))) {
                        return measurementType;
                    }
                }
            }

            return null;
        };

        this.initializeSVGDisplay = () => {
            const svgContainer = this.shadowRoot.getElementById('svgContainer');
            if (svgContainer) {
                svgContainer.style.display = 'block';
            }

            const svgSizeElement = this.shadowRoot.getElementById('svg_size');
            if (svgSizeElement) {
                svgSizeElement.style.display = 'flex';
            }

            // 檢查 SVG 容器是否可見，如果不可見則延遲初始化
            const checkAndInitializeSVG = () => {
                const svgContainer = this.shadowRoot.getElementById('svgContainer');
                if (!svgContainer) return;

                const containerWidth = svgContainer.offsetWidth;
                
                // 如果容器寬度為 0，表示可能被收合了，需要等待展開
                if (containerWidth === 0) {
                    console.log('SVG 容器寬度為 0，等待尺寸表展開後重新初始化');
                    
                    // 監聽尺寸表的展開事件
                    const sizeTableContent = this.shadowRoot.querySelector('.size-table-content');
                    if (sizeTableContent) {
                        const observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                    const target = mutation.target;
                                    if (target.classList.contains('show')) {
                                        console.log('尺寸表已展開，重新初始化 SVG');
                                        observer.disconnect();
                                        // 延遲一下確保動畫完成
                                        setTimeout(() => {
                                            checkAndInitializeSVG();
                                        }, 300);
                                    }
                                }
                            });
                        });
                        
                        observer.observe(sizeTableContent, {
                            attributes: true,
                            attributeFilter: ['class']
                        });
                    }
                    return;
                }

                console.log('SVG 容器寬度:', containerWidth, 'px，開始初始化 SVG');

                // 等待更長時間確保所有元素都創建完成
                setTimeout(() => {
                    const firstSizeBtn = this.shadowRoot.querySelector('.size-btn');
                    if (firstSizeBtn) {
                        // 手動觸發第一個按鈕的點擊邏輯，而不是依賴 click 事件
                        const sizeBtns = this.shadowRoot.querySelectorAll('.size-btn');

                        // 設置第一個按鈕為 active
                        sizeBtns.forEach(b => {
                            this.removeClass(b, 'active');
                            this.removeClass(b, 'choosed');
                        });
                        this.addClass(firstSizeBtn, 'active');
                        this.addClass(firstSizeBtn, 'choosed');

                        // 手動執行 SVG 更新邏輯
                        const activeIndex = 0;
                        const size_active = firstSizeBtn.querySelector('td:first-child') ? firstSizeBtn.querySelector('td:first-child').textContent : firstSizeBtn.textContent;

                        const svgSizeSpan = this.shadowRoot.querySelector('#svg_size span');
                        if (svgSizeSpan) {
                            svgSizeSpan.textContent = size_active;
                        }

                        const sizeBtnWrapper = this.shadowRoot.querySelector('.size-btn-wrapper');
                        if (sizeBtnWrapper) {
                            const dataname_list = sizeBtnWrapper.getAttribute('data-labels').split(',');

                            for (let gs = 1; gs < Object.keys(global_sizeinfo[0]).length; gs++) {
                                let size_header = Object.keys(global_sizeinfo[0])[gs];
                                if (dataname_list.includes(mapMeasurement(size_header))) {
                                    output_svg.data[mapMeasurement(size_header)].value = global_sizeinfo[activeIndex][size_header];
                                }
                            }

                            // 強制重新渲染 SVG
                            output_svg = resize_svg(output_svg.data, output_svg.Labels);

                            // 確保 SVG 文字顯示
                            setTimeout(() => {
                                const svgText = this.shadowRoot.querySelectorAll('#svgContainer text');
                                svgText.forEach(text => {
                                    text.style.display = '';
                                });
                            }, 100);
                        }
                    }
                }, 200);
            };

            // 開始檢查和初始化
            checkAndInitializeSVG();
        };

        // 為尺寸按鈕添加點擊事件（需要在 size table 創建後執行）
        setTimeout(() => {
            const sizeBtns = this.shadowRoot.querySelectorAll('.size-btn');
            sizeBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    // 移除所有選中狀態
                    sizeBtns.forEach(b => {
                        this.removeClass(b, 'active');
                        this.removeClass(b, 'choosed');
                    });
                    // 添加選中狀態
                    this.addClass(btn, 'active');
                    this.addClass(btn, 'choosed');

                    const activeIndex = index;
                    const size_active = btn.querySelector('td:first-child') ? btn.querySelector('td:first-child').textContent : btn.textContent;

                    const svgSizeSpan = this.shadowRoot.querySelector('#svg_size span');
                    if (svgSizeSpan) {
                        svgSizeSpan.textContent = size_active;
                    }

                    const sizeBtnWrapper = this.shadowRoot.querySelector('.size-btn-wrapper');
                    const dataname_list = sizeBtnWrapper.getAttribute('data-labels').split(',');

                    for (let gs = 1; gs < Object.keys(global_sizeinfo[0]).length; gs++) {
                        let size_header = Object.keys(global_sizeinfo[0])[gs];
                        if (dataname_list.includes(mapMeasurement(size_header))) {
                            output_svg.data[mapMeasurement(size_header)].value = global_sizeinfo[activeIndex][size_header];
                        }
                    }

                    output_svg = resize_svg(output_svg.data, output_svg.Labels);
                    const svgText = this.shadowRoot.querySelectorAll('#svgContainer text');
                    svgText.forEach(text => {
                        text.style.display = 'none';
                        setTimeout(() => {
                            text.style.display = '';
                        }, 50);
                    });
                });
            });

            // 確保第一個按鈕默認選中（在事件綁定完成後）
            if (sizeBtns.length > 0) {
                this.addClass(sizeBtns[0], 'active');
                this.addClass(sizeBtns[0], 'choosed');
            }
        }, 600);
    }

    // Attribute Display
    clothes_attributes_display(apiData) {
        const global_attributeinfo = apiData.attributeInfo;

        // 根據 collapsible 屬性決定是否添加折疊按鈕
        const collapseButton = this.isCollapsible ?
            '<button id="attributes-toggle" class="collapse-btn" aria-label="收合商品屬性">−</button>' : '';

        // 根據是否啟用折疊功能決定標題樣式
        const titleStyle = this.isCollapsible ?
            '' : 'border-bottom:1px solid;';

        this.shadowRoot.querySelector('.inf-container').insertAdjacentHTML('beforeend', `
        <br><br><div id="Clothes_Attributes">
        <h5 id="attributes-header" class="${this.isCollapsible ? 'collapsible-header' : ''}" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="${titleStyle}">商品屬性</span>
                ${collapseButton}
            </h5>
            <div class="attributes-content">
            <br>
        <div class="table-container">
        <table>
            <tr>
                <th class="properties-header" name="Elasticity">彈性</th>
                <td><span>無彈</span></td>
                <td><span>適中</span></td>
                <td><span>超彈</span></td>
            </tr>
            <tr>
                <th class="properties-header" name="Cut">版型</th>
                <td><span>合身</span></td>
                <td><span>適中</span></td>
                <td><span>寬鬆</span></td>
            </tr>
            <tr>
                <th class="properties-header" name="Thickness">厚度</th>
                <td><span>輕薄</span></td>
                <td><span>適中</span></td>
                <td><span>厚實</span></td>
            </tr>
            <tr>
                <th class="properties-header" name="Materials">材質</th>
                <td colspan="3" class="materials-content"></td>
            </tr>
            <tr>
                <th class="properties-header" name="Lining">內襯</th>
                <td colspan="3" style="text-align: center;"><span class="checkmark"><img src="https://inffits.com/webDesign/HTML/img/002-checked-symbol.png" width=18px></span></td>
            </tr>
        </table>
    </div>
               </div>    
               </div>    
                `);

        // 只有在啟用折疊功能時才添加事件監聽器
        if (this.isCollapsible) {
            setTimeout(() => {
                const headerElement = this.shadowRoot.getElementById('attributes-header');
                const toggleBtn = this.shadowRoot.getElementById('attributes-toggle');
                const attributesContent = this.shadowRoot.querySelector('.attributes-content');

                if (headerElement && attributesContent) {
                    // 檢查是否有外部配置的初始狀態
                    const initialStates = this._initialStates || {
                        sizeTable: true,
                        tryonReport: false,
                        attributes: false
                    };

                    // 使用配置的狀態進行初始化，避免閃爍
                    this.initializeContentState(attributesContent, initialStates.attributes);

                    // 設置初始按鈕內容和狀態
                    if (toggleBtn) {
                        toggleBtn.innerHTML = this.getArrowIcon();
                        toggleBtn.setAttribute('aria-expanded', initialStates.attributes ? 'true' : 'false');
                        toggleBtn.setAttribute('aria-label', initialStates.attributes ? '收合商品屬性' : '展開商品屬性');
                    }

                    // 為整個 h5 標題添加點擊事件
                    headerElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isCollapsed = !attributesContent.classList.contains('show');
                        this.animateCollapse(attributesContent, toggleBtn, isCollapsed, '商品屬性');
                    });

                    // 為按鈕添加點擊事件（阻止冒泡以免重複觸發）
                    if (toggleBtn) {
                        toggleBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const isCollapsed = !attributesContent.classList.contains('show');
                            this.animateCollapse(attributesContent, toggleBtn, isCollapsed, '商品屬性');
                        });
                    }
                }
            }, 100);
        }

        // 確保 attributeInfo 存在才處理
        if (apiData.attributeInfo) {
            for (let ca in apiData.attributeInfo) {
                const propertyHeaders = this.shadowRoot.querySelectorAll('.properties-header');
                propertyHeaders.forEach(header => {
                    if (header.getAttribute('name') == ca && ca !== "Lining") {
                        const siblings = [];
                        let nextSibling = header.nextElementSibling;
                        while (nextSibling) {
                            siblings.push(nextSibling);
                            nextSibling = nextSibling.nextElementSibling;
                        }

                        siblings.forEach(sibling => {
                            if (sibling.textContent.trim().replace(/\s+/g, ' ') == apiData.attributeInfo[ca]) {
                                this.addClass(sibling, 'active');
                            }
                        });
                    } else if (header.getAttribute('name') == ca && ca === "Lining") {
                        if (apiData.attributeInfo[ca] === '無') {
                            const nextElement = header.nextElementSibling;
                            if (nextElement && nextElement.children && nextElement.children[0]) {
                                // nextElement.children[0].innerHTML = '<img src="https://inffits.com/webDesign/HTML/img/cross-mark-on-a-black-circle-background.png" width=18px>';
                                nextElement.children[0].innerHTML = '<span>無</span>';
                            }
                        }
                    }
                });
            }

            // 檢查是否有 Materials 屬性並且是陣列
            if (apiData.attributeInfo.Materials && Array.isArray(apiData.attributeInfo.Materials)) {
                for (let M = 0; M < apiData.attributeInfo.Materials.length; M++) {
                    const materialsHeader = this.shadowRoot.querySelector('.properties-header[name="Materials"]');
                    const materialsSibling = materialsHeader && materialsHeader.nextElementSibling;
                    if (materialsSibling) {
                        materialsSibling.textContent += apiData.attributeInfo.Materials[M].split('(')[0] + ' ';
                    }
                }
            }
        }
    }

    // 連接回調
    connectedCallback() {
        // 組件被插入到 DOM 時調用
        // 使用 setTimeout 確保父元素已經正確設置
        setTimeout(() => {
            this.setupResizeObserver();
        }, 0);
    }

    // 斷開回調
    disconnectedCallback() {
        // 組件從 DOM 中移除時調用
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    // 屬性變更回調
    attributeChangedCallback(name, oldValue, newValue) {
        // 當觀察的屬性發生變化時調用
        if (name === 'collapsible' && oldValue !== newValue) {
            // 更新 data-collapsible 屬性
            const container = this.shadowRoot && this.shadowRoot.querySelector('#inffits-info-display-reference-component');
            if (container) {
                container.setAttribute('data-collapsible', this.isCollapsible ? 'true' : 'false');
            }

            // 如果組件已經初始化，重新渲染
            if (this.shadowRoot && this.shadowRoot.querySelector('.component-container')) {
                this.updateCollapseButton();
            }
        }
    }

    // 更新折疊按鈕的顯示狀態
    updateCollapseButton() {
        // 處理尺寸表折疊按鈕
        this.updateSectionCollapseButton('size-table-toggle', '.inf-container h5', '.size-table-content', '尺寸表');

        // 處理試穿資訊折疊按鈕
        this.updateSectionCollapseButton('tryon-report-toggle', '#TryonReport h5', '.tryon-report-content', '試穿資訊');

        // 處理商品屬性折疊按鈕
        this.updateSectionCollapseButton('attributes-toggle', '#Clothes_Attributes h5', '.attributes-content', '商品屬性');
    }

    // 更新單個區塊的折疊按鈕
    updateSectionCollapseButton(buttonId, titleSelector, contentSelector, sectionName) {
        const toggleBtn = this.shadowRoot.getElementById(buttonId);
        const titleElement = this.shadowRoot.querySelector(titleSelector);
        const contentElement = this.shadowRoot.querySelector(contentSelector);

        if (this.isCollapsible && !toggleBtn && titleElement) {
            // 需要添加折疊按鈕
            const collapseButton = document.createElement('button');
            collapseButton.id = buttonId;
            collapseButton.className = 'collapse-btn';

            // 檢查是否有外部配置的初始狀態
            const initialStates = this._initialStates || {
                sizeTable: true,
                tryonReport: false,
                attributes: false
            };

            // 根據區塊類型和外部配置設置狀態
            let isDefaultExpanded;
            if (sectionName === '尺寸表') {
                isDefaultExpanded = initialStates.sizeTable;
            } else if (sectionName === '試穿資訊') {
                isDefaultExpanded = initialStates.tryonReport;
            } else if (sectionName === '商品屬性') {
                isDefaultExpanded = initialStates.attributes;
            } else {
                isDefaultExpanded = false; // 未知區塊預設收合
            }

            collapseButton.innerHTML = this.getArrowIcon();

            if (isDefaultExpanded) {
                collapseButton.setAttribute('aria-label', `收合${sectionName}`);
                collapseButton.setAttribute('aria-expanded', 'true');
            } else {
                collapseButton.setAttribute('aria-label', `展開${sectionName}`);
                collapseButton.setAttribute('aria-expanded', 'false');
            }

            titleElement.appendChild(collapseButton);

            // 添加事件監聽器
            if (contentElement) {
                // 初始化內容狀態
                this.initializeContentState(contentElement, isDefaultExpanded);

                collapseButton.addEventListener('click', () => {
                    const isCollapsed = !contentElement.classList.contains('show');
                    this.animateCollapse(contentElement, collapseButton, isCollapsed, sectionName);
                });
            }
        } else if (!this.isCollapsible && toggleBtn) {
            // 需要移除折疊按鈕
            toggleBtn.remove();
            // 同時確保內容是展開狀態
            if (contentElement) {
                contentElement.classList.remove('collapse');
                contentElement.classList.add('collapse', 'show');
            }
        }
    }

    // 需要觀察的屬性
    static get observedAttributes() {
        return ['collapsible']; // 添加 collapsible 屬性
    }

    // 獲取是否啟用折疊功能
    get isCollapsible() {
        return this.hasAttribute('collapsible') && this.getAttribute('collapsible') !== 'false';
    }

    // 獲取箭頭 SVG 圖標
    getArrowIcon() {
        return `<svg class="arrow-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>`;
    }

    // Bootstrap Accordion 風格的折疊動畫函數 - 優化版本
    animateCollapse(contentElement, toggleBtn, isCollapsed, sectionName) {
        // 防止動畫衝突
        if (contentElement.classList.contains('collapsing')) {
            return;
        }

        if (isCollapsed) {
            // 展開動畫 - 使用簡化邏輯
            this.simpleShow(contentElement);
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.setAttribute('aria-label', `收合${sectionName}`);
            
            // 如果是尺寸表展開，需要重新初始化 SVG
            if (sectionName === '尺寸表') {
                setTimeout(() => {
                    this.reinitializeSVGIfNeeded();
                }, 350); // 等待展開動畫完成
            }
        } else {
            // 收合動畫 - 使用簡化邏輯
            this.simpleHide(contentElement);
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-label', `展開${sectionName}`);
        }
    }

    // 簡化的展開動畫 - 基於用戶提供的參照邏輯
    simpleShow(element) {
        if (element.classList.contains('show')) {
            return;
        }

        // 清理可能存在的事件監聽器
        if (element._currentTransitionHandler) {
            element.removeEventListener('transitionend', element._currentTransitionHandler);
            element._currentTransitionHandler = null;
        }

        // 先讓元素可見但高度為0
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.classList.remove('collapse');
        element.classList.add('show');

        // 獲取內容的實際高度
        const targetHeight = element.scrollHeight;

        // 立即開始展開動畫
        requestAnimationFrame(() => {
            element.style.height = targetHeight + 'px';
            
            // 動畫結束後設為 auto
            const transitionHandler = () => {
                element.style.height = 'auto';
                element.style.overflow = '';
                element.removeEventListener('transitionend', transitionHandler);
                element._currentTransitionHandler = null;
            };
            
            element.addEventListener('transitionend', transitionHandler, { once: true });
            element._currentTransitionHandler = transitionHandler;
            
            // 備用處理（防止 transitionend 事件丟失）
            setTimeout(() => {
                if (element._currentTransitionHandler) {
                    transitionHandler();
                }
            }, 300);
        });
    }

    // 簡化的收合動畫 - 基於用戶提供的參照邏輯
    simpleHide(element) {
        if (!element.classList.contains('show')) {
            return;
        }

        // 清理可能存在的事件監聽器
        if (element._currentTransitionHandler) {
            element.removeEventListener('transitionend', element._currentTransitionHandler);
            element._currentTransitionHandler = null;
        }

        // 先設置為實際高度
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';

        // 立即開始收合動畫
        requestAnimationFrame(() => {
            element.style.height = '0px';
            
            const transitionHandler = () => {
                element.classList.remove('show');
                element.classList.add('collapse');
                element.style.height = '';
                element.style.overflow = '';
                element.removeEventListener('transitionend', transitionHandler);
                element._currentTransitionHandler = null;
            };
            
            element.addEventListener('transitionend', transitionHandler, { once: true });
            element._currentTransitionHandler = transitionHandler;
            
            // 備用處理（防止 transitionend 事件丟失）
            setTimeout(() => {
                if (element._currentTransitionHandler) {
                    transitionHandler();
                }
            }, 300);
        });
    }

    // 超級簡化的展開動畫 - 無卡頓版本
    show(element) {
        // 使用新的簡化邏輯
        this.simpleShow(element);
    }

    // 超級簡化的收合動畫 - 無卡頓版本
    hide(element) {
        // 使用新的簡化邏輯
        this.simpleHide(element);
    }

    // 初始化內容區域狀態 - 簡化版本
    initializeContentState(contentElement, isDefaultExpanded = false) {
        // 清除所有可能的類和樣式
        contentElement.classList.remove('collapse', 'show', 'collapsing');
        contentElement.style.height = '';
        contentElement.style.overflow = '';
        
        if (isDefaultExpanded) {
            contentElement.classList.add('show');
        } else {
            contentElement.classList.add('collapse');
            contentElement.style.height = '0px';
            contentElement.style.overflow = 'hidden';
        }
    }

    // 智能滾動到篩選按鈕的合適位置
    scrollToFilterButton(button) {
        const container = this.shadowRoot.querySelector('.filter-btn-container');
        if (!container || !button) return;

        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        // 獲取容器的滾動位置
        const containerScrollLeft = container.scrollLeft;
        
        // 計算按鈕相對於容器的位置
        const buttonOffsetLeft = button.offsetLeft;
        const buttonWidth = button.offsetWidth;
        const containerWidth = container.clientWidth;
        
        // 設定邊距（讓按鈕不會緊貼邊緣）
        const margin = 16;
        
        let targetScrollLeft = containerScrollLeft;
        
        // 如果按鈕右邊被遮擋
        if (buttonOffsetLeft + buttonWidth > containerScrollLeft + containerWidth) {
            // 滾動讓按鈕右邊距離容器右邊有 margin 的距離
            targetScrollLeft = buttonOffsetLeft + buttonWidth - containerWidth + margin;
        }
        // 如果按鈕左邊被遮擋
        else if (buttonOffsetLeft < containerScrollLeft) {
            // 滾動讓按鈕左邊距離容器左邊有 margin 的距離
            targetScrollLeft = buttonOffsetLeft - margin;
        }
        
        // 確保滾動位置在有效範圍內
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        targetScrollLeft = Math.max(0, Math.min(maxScrollLeft, targetScrollLeft));
        
        // 平滑滾動到目標位置
        if (Math.abs(targetScrollLeft - containerScrollLeft) > 1) {
            container.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });
        }
    }

    /**
     * 檢查並應用列寬度限制
     * @param {Array} sizeInfoKeys - 尺寸資訊的欄位名稱陣列
     */
    checkAndApplyColWidthLimit(sizeInfoKeys) {
        // 檢查欄位數量是否 <= 3
        if (sizeInfoKeys && sizeInfoKeys.length <= 3) {
            // 添加特殊樣式類到主容器
            const container = this.shadowRoot.querySelector('#inffits-info-display-reference-component');
            if (container) {
                container.classList.add('small-size-table');
            }
        } else {
            // 移除特殊樣式類
            const container = this.shadowRoot.querySelector('#inffits-info-display-reference-component');
            if (container) {
                container.classList.remove('small-size-table');
            }
        }
    }

    // SizeTable Display methods

    /**
     * 重新初始化 SVG（如果需要）
     */
    reinitializeSVGIfNeeded() {
        const svgContainer = this.shadowRoot.getElementById('svgContainer');
        if (!svgContainer) return;

        const containerWidth = svgContainer.offsetWidth;
        console.log('重新檢查 SVG 容器寬度:', containerWidth, 'px');

        // 如果容器現在有寬度，但 SVG 內容為空或不正確，重新渲染
        if (containerWidth > 0) {
            const existingSVG = svgContainer.querySelector('svg');
            if (!existingSVG || existingSVG.getAttribute('width') === '0') {
                console.log('重新渲染 SVG');
                
                // 觸發 SVG 重新初始化
                if (this.initializeSVGDisplay) {
                    this.initializeSVGDisplay();
                }
            }
        }
    }

    // 簡化的展開動畫 - 基於用戶提供的參照邏輯
}

// 註冊自定義元素
customElements.define('info-display-component', InfoDisplayComponent);

// 導出組件（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfoDisplayComponent;
}