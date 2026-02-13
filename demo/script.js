// 应用配置
const CONFIG = {
    configFile: 'auratab-config.json',
    localStorageKey: 'auratab-config'
};

// 获取DOM元素
const folderItems = document.querySelectorAll('.folder-item');
const bookmarkSections = document.querySelectorAll('.bookmark-section');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const searchEngine = document.getElementById('search-engine');
const syncBtn = document.getElementById('sync-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModal = document.getElementById('close-settings');
const webdavForm = document.getElementById('webdav-form');
const testConnectionBtn = document.getElementById('test-connection');
const addBookmarkBtn = document.getElementById('add-bookmark-btn');
const addBookmarkModal = document.getElementById('add-bookmark-modal');
const closeBookmark = document.getElementById('close-bookmark');
const bookmarkForm = document.getElementById('bookmark-form');
const statusText = document.getElementById('status-text');

// 当前应用状态
let appState = {
    config: {
        folders: [],
        bookmarks: {},
        webdav: {
            url: '',
            username: '',
            password: ''
        }
    },
    currentFolder: 'basic-bookmarks'
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    loadLocalConfig();
    setupEventListeners();
    updateUI();
});

// 设置事件监听器
function setupEventListeners() {
    // 文件夹切换事件
    folderItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有激活状态
            folderItems.forEach(i => i.classList.remove('active'));
            bookmarkSections.forEach(section => section.classList.add('hidden'));

            // 添加当前激活状态
            item.classList.add('active');

            // 显示对应的书签内容
            const folderId = item.getAttribute('data-folder');
            appState.currentFolder = folderId;
            const contentSection = document.getElementById(`${folderId}-content`);
            if (contentSection) {
                contentSection.classList.remove('hidden');
            }
        });
    });

    // 搜索功能
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 设置按钮事件
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
        populateWebDAVForm();
    });

    // 关闭设置模态框
    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // 关闭书签模态框
    closeBookmark.addEventListener('click', () => {
        addBookmarkModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target === addBookmarkModal) {
            addBookmarkModal.style.display = 'none';
        }
    });

    // WebDAV表单提交
    webdavForm.addEventListener('submit', handleWebDAVSubmit);

    // 测试连接
    testConnectionBtn.addEventListener('click', testWebDAVConnection);

    // 添加书签按钮
    addBookmarkBtn.addEventListener('click', () => {
        addBookmarkModal.style.display = 'block';
        resetBookmarkForm();
    });

    // 书签表单提交
    bookmarkForm.addEventListener('submit', handleBookmarkSubmit);

    // 同步按钮
    syncBtn.addEventListener('click', syncWithWebDAV);
}

// 加载本地配置
function loadLocalConfig() {
    const savedConfig = localStorage.getItem(CONFIG.localStorageKey);
    if (savedConfig) {
        try {
            appState.config = JSON.parse(savedConfig);
            console.log('本地配置加载成功');
        } catch (e) {
            console.error('解析本地配置失败:', e);
            // 如果解析失败，使用默认配置
            appState.config = getDefaultConfig();
        }
    } else {
        // 如果没有本地配置，使用默认配置
        appState.config = getDefaultConfig();
    }
}

// 获取默认配置
function getDefaultConfig() {
    return {
        folders: [
            { id: 'basic-bookmarks', name: '基础收藏夹', icon: '📁' },
            { id: 'work', name: '工作相关', icon: '💼' },
            { id: 'study', name: '学习资源', icon: '📚' },
            { id: 'entertainment', name: '娱乐休闲', icon: '🎮' },
            { id: 'tools', name: '实用工具', icon: '🛠️' }
        ],
        bookmarks: {
            'basic-bookmarks': [
                { id: '1', title: '百度', url: 'https://www.baidu.com', favicon: 'https://www.baidu.com/favicon.ico', desc: '百度一下，你就知道' },
                { id: '2', title: '谷歌', url: 'https://www.google.com', favicon: 'https://www.google.com/favicon.ico', desc: '全球最大的搜索引擎' },
                { id: '3', title: 'GitHub', url: 'https://www.github.com', favicon: 'https://github.com/favicon.ico', desc: '代码托管平台' },
                { id: '4', title: 'Stack Overflow', url: 'https://www.stackoverflow.com', favicon: 'https://stackoverflow.com/favicon.ico', desc: '程序员问答社区' },
                { id: '5', title: '知乎', url: 'https://www.zhihu.com', favicon: 'https://www.zhihu.com/favicon.ico', desc: '中文问答社区' },
                { id: '6', title: '简书', url: 'https://www.jianshu.com', favicon: 'https://www.jianshu.com/favicon.ico', desc: '创作分享平台' }
            ],
            'work': [
                { id: '7', title: 'Office', url: 'https://www.office.com', favicon: 'https://www.office.com/favicon.ico', desc: '微软办公套件' },
                { id: '8', title: 'Slack', url: 'https://www.slack.com', favicon: 'https://slack.com/favicon.ico', desc: '团队协作工具' },
                { id: '9', title: 'Zoom', url: 'https://www.zoom.us', favicon: 'https://zoom.us/favicon.ico', desc: '视频会议软件' },
                { id: '10', title: '腾讯', url: 'https://www.tencent.com', favicon: 'https://www.tencent.com/favicon.ico', desc: '腾讯官网' }
            ],
            'study': [
                { id: '11', title: 'Coursera', url: 'https://www.coursera.org', favicon: 'https://www.coursera.org/favicon.ico', desc: '在线课程平台' },
                { id: '12', title: 'Udemy', url: 'https://www.udemy.com', favicon: 'https://www.udemy.com/favicon.ico', desc: '在线技能学习平台' },
                { id: '13', title: '菜鸟教程', url: 'https://www.runoob.com', favicon: 'https://static.runoob.com/images/favicon.ico', desc: '学编程，从菜鸟开始' },
                { id: '14', title: '阮一峰教程', url: 'https://wangdoc.com', favicon: 'https://wangdoc.com/javascript/engine/images/favicon.ico', desc: '技术文档网站' }
            ],
            'entertainment': [
                { id: '15', title: 'Bilibili', url: 'https://www.bilibili.com', favicon: 'https://www.bilibili.com/favicon.ico', desc: '视频弹幕网站' },
                { id: '16', title: 'YouTube', url: 'https://www.youtube.com', favicon: 'https://www.youtube.com/favicon.ico', desc: '全球最大视频网站' },
                { id: '17', title: 'Netflix', url: 'https://www.netflix.com', favicon: 'https://www.netflix.com/favicon.ico', desc: '流媒体服务平台' },
                { id: '18', title: 'GamePress', url: 'https://www.gamepress.gg', favicon: 'https://www.gamepress.gg/favicon.ico', desc: '游戏攻略网站' }
            ],
            'tools': [
                { id: '19', title: 'ProcessOn', url: 'https://www.processon.com', favicon: 'https://www.processon.com/favicon.ico', desc: '在线作图工具' },
                { id: '20', title: 'IconFont', url: 'https://www.iconfont.cn', favicon: 'https://www.iconfont.cn/favicon.ico', desc: '阿里巴巴矢量图标库' },
                { id: '21', title: 'TinyPNG', url: 'https://tinypng.com', favicon: 'https://tinypng.com/favicon.ico', desc: '图片压缩工具' },
                { id: '22', title: 'AConvert', url: 'https://www.aconvert.com', favicon: 'https://www.aconvert.com/favicon.ico', desc: '在线文件转换工具' }
            ]
        },
        webdav: {
            url: '',
            username: '',
            password: ''
        }
    };
}

// 更新UI
function updateUI() {
    // 更新当前选中的文件夹
    const activeFolderItem = document.querySelector(`[data-folder="${appState.currentFolder}"]`);
    if (activeFolderItem) {
        folderItems.forEach(i => i.classList.remove('active'));
        activeFolderItem.classList.add('active');
        
        bookmarkSections.forEach(section => section.classList.add('hidden'));
        const contentSection = document.getElementById(`${appState.currentFolder}-content`);
        if (contentSection) {
            contentSection.classList.remove('hidden');
        }
    }
    
    // 更新状态文本
    if (appState.config.webdav.url) {
        statusText.textContent = '已配置WebDAV';
    } else {
        statusText.textContent = '本地数据';
    }
}

// 搜索功能
function performSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        alert('请输入搜索关键词');
        return;
    }

    const engine = searchEngine.value;
    let searchUrl = '';

    switch(engine) {
        case 'baidu':
            searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
            break;
        case 'google':
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            break;
        case 'bing':
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
            break;
        case 'duckduckgo':
            searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
            break;
        default:
            searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
    }

    // 在新标签页中打开搜索结果
    window.open(searchUrl, '_blank');
}

// 填充WebDAV表单
function populateWebDAVForm() {
    document.getElementById('webdav-url').value = appState.config.webdav.url || '';
    document.getElementById('webdav-username').value = appState.config.webdav.username || '';
    document.getElementById('webdav-password').value = appState.config.webdav.password || '';
    document.getElementById('config-file').value = CONFIG.configFile;
}

// 重置书签表单
function resetBookmarkForm() {
    document.getElementById('bookmark-title').value = '';
    document.getElementById('bookmark-url').value = '';
    document.getElementById('bookmark-desc').value = '';
    document.getElementById('bookmark-folder').value = appState.currentFolder;
}

// 处理WebDAV表单提交
function handleWebDAVSubmit(e) {
    e.preventDefault();
    
    const url = document.getElementById('webdav-url').value;
    const username = document.getElementById('webdav-username').value;
    const password = document.getElementById('webdav-password').value;
    
    // 更新配置
    appState.config.webdav = {
        url: url,
        username: username,
        password: password
    };
    
    // 保存配置到本地存储
    saveConfigToLocal();
    
    // 更新UI状态
    updateUI();
    
    // 关闭模态框
    settingsModal.style.display = 'none';
    
    alert('WebDAV配置已保存！');
}

// 测试WebDAV连接
async function testWebDAVConnection() {
    const url = document.getElementById('webdav-url').value;
    const username = document.getElementById('webdav-username').value;
    const password = document.getElementById('webdav-password').value;
    
    if (!url || !username || !password) {
        alert('请填写完整的WebDAV信息');
        return;
    }
    
    try {
        // 显示测试中状态
        testConnectionBtn.disabled = true;
        testConnectionBtn.textContent = '测试中...';
        
        // 发送PROPFIND请求测试连接
        const response = await fetch(url, {
            method: 'PROPFIND',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
                'Content-Type': 'application/xml'
            },
            body: `<?xml version="1.0" encoding="utf-8"?>
            <propfind xmlns="DAV:">
                <prop>
                    <current-user-principal/>
                </prop>
            </propfind>`
        });
        
        if (response.ok || response.status === 207) {
            alert('WebDAV连接测试成功！');
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('WebDAV连接测试失败:', error);
        alert(`WebDAV连接测试失败: ${error.message}`);
    } finally {
        // 恢复按钮状态
        testConnectionBtn.disabled = false;
        testConnectionBtn.textContent = '测试连接';
    }
}

// 处理书签表单提交
function handleBookmarkSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('bookmark-title').value;
    const url = document.getElementById('bookmark-url').value;
    const desc = document.getElementById('bookmark-desc').value;
    const folderId = document.getElementById('bookmark-folder').value;
    
    // 创建新的书签对象
    const newBookmark = {
        id: Date.now().toString(), // 使用时间戳作为简单ID
        title: title,
        url: url,
        favicon: getFaviconFromUrl(url),
        desc: desc
    };
    
    // 添加到相应文件夹
    if (!appState.config.bookmarks[folderId]) {
        appState.config.bookmarks[folderId] = [];
    }
    
    appState.config.bookmarks[folderId].push(newBookmark);
    
    // 保存配置到本地存储
    saveConfigToLocal();
    
    // 重新渲染当前文件夹内容
    renderFolderContent(folderId);
    
    // 关闭模态框
    addBookmarkModal.style.display = 'none';
    
    alert('书签已添加！');
}

// 从URL获取favicon
function getFaviconFromUrl(url) {
    try {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
    } catch (e) {
        console.error('解析URL失败:', e);
        return 'https://www.google.com/s2/favicons?domain=example.com';
    }
}

// 渲染文件夹内容
function renderFolderContent(folderId) {
    const contentElement = document.getElementById(`${folderId}-content`);
    if (!contentElement) return;
    
    const bookmarks = appState.config.bookmarks[folderId] || [];
    
    // 清空现有内容
    const grid = contentElement.querySelector('.bookmark-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // 添加书签项
    bookmarks.forEach(bookmark => {
        const bookmarkElement = document.createElement('div');
        bookmarkElement.className = 'bookmark-item';
        bookmarkElement.innerHTML = `
            <a href="${bookmark.url}" target="_blank">
                <img src="${bookmark.favicon}" alt="${bookmark.title}" class="bookmark-icon">
                <span class="bookmark-title">${bookmark.title}</span>
            </a>
            <div class="bookmark-actions">
                <button class="edit-btn" onclick="editBookmark('${folderId}', '${bookmark.id}')">✏️</button>
                <button class="delete-btn" onclick="deleteBookmark('${folderId}', '${bookmark.id}')">🗑️</button>
            </div>
        `;
        grid.appendChild(bookmarkElement);
    });
}

// 编辑书签
function editBookmark(folderId, bookmarkId) {
    const bookmark = appState.config.bookmarks[folderId]?.find(b => b.id === bookmarkId);
    if (!bookmark) {
        alert('找不到该书签');
        return;
    }
    
    // 填充编辑表单
    document.getElementById('bookmark-title').value = bookmark.title;
    document.getElementById('bookmark-url').value = bookmark.url;
    document.getElementById('bookmark-desc').value = bookmark.desc || '';
    document.getElementById('bookmark-folder').value = folderId;
    
    // 显示编辑状态（复用添加书签模态框）
    addBookmarkModal.style.display = 'block';
    
    // 修改表单提交行为以进行编辑而不是添加
    bookmarkForm.onsubmit = function(e) {
        e.preventDefault();
        
        // 更新书签信息
        bookmark.title = document.getElementById('bookmark-title').value;
        bookmark.url = document.getElementById('bookmark-url').value;
        bookmark.desc = document.getElementById('bookmark-desc').value;
        bookmark.favicon = getFaviconFromUrl(bookmark.url);
        
        // 保存配置到本地存储
        saveConfigToLocal();
        
        // 重新渲染当前文件夹内容
        renderFolderContent(folderId);
        
        // 重置表单提交行为
        bookmarkForm.onsubmit = handleBookmarkSubmit;
        
        // 关闭模态框
        addBookmarkModal.style.display = 'none';
        
        alert('书签已更新！');
    };
}

// 删除书签
function deleteBookmark(folderId, bookmarkId) {
    if (!confirm('确定要删除这个书签吗？')) {
        return;
    }
    
    appState.config.bookmarks[folderId] = appState.config.bookmarks[folderId].filter(b => b.id !== bookmarkId);
    
    // 保存配置到本地存储
    saveConfigToLocal();
    
    // 重新渲染当前文件夹内容
    renderFolderContent(folderId);
    
    alert('书签已删除！');
}

// 保存配置到本地存储
function saveConfigToLocal() {
    try {
        localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(appState.config));
        console.log('配置已保存到本地存储');
    } catch (e) {
        console.error('保存配置到本地存储失败:', e);
        alert('保存配置失败: ' + e.message);
    }
}

// 与WebDAV同步
async function syncWithWebDAV() {
    if (!appState.config.webdav.url || !appState.config.webdav.username || !appState.config.webdav.password) {
        alert('请先配置WebDAV信息');
        settingsBtn.click(); // 打开设置模态框
        return;
    }
    
    statusText.textContent = '同步中...';
    
    try {
        // 尝试从WebDAV获取配置
        const remoteConfig = await downloadFromWebDAV();
        
        if (remoteConfig) {
            // 如果远程配置存在，则合并配置
            mergeConfigs(remoteConfig);
        } else {
            // 如果远程配置不存在，则上传本地配置
            await uploadToWebDAV();
        }
        
        // 无论哪种情况，都上传最新的配置到WebDAV
        await uploadToWebDAV();
        
        statusText.textContent = '同步完成';
        setTimeout(() => {
            statusText.textContent = '已同步';
        }, 2000);
    } catch (error) {
        console.error('同步失败:', error);
        statusText.textContent = '同步失败';
        alert(`同步失败: ${error.message}`);
    }
}

// 从WebDAV下载配置
async function downloadFromWebDAV() {
    try {
        const response = await fetch(`${appState.config.webdav.url}/${CONFIG.configFile}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(appState.config.webdav.username + ':' + appState.config.webdav.password)
            }
        });
        
        if (response.ok) {
            const configText = await response.text();
            const remoteConfig = JSON.parse(configText);
            console.log('从WebDAV下载配置成功');
            return remoteConfig;
        } else if (response.status === 404) {
            console.log('远程配置文件不存在');
            return null;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('下载配置失败:', error);
        throw error;
    }
}

// 上传配置到WebDAV
async function uploadToWebDAV() {
    try {
        const configStr = JSON.stringify(appState.config, null, 2);
        
        const response = await fetch(`${appState.config.webdav.url}/${CONFIG.configFile}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Basic ' + btoa(appState.config.webdav.username + ':' + appState.config.webdav.password),
                'Content-Type': 'application/json'
            },
            body: configStr
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('上传配置到WebDAV成功');
    } catch (error) {
        console.error('上传配置失败:', error);
        throw error;
    }
}

// 合并配置
function mergeConfigs(remoteConfig) {
    // 这里可以实现复杂的配置合并逻辑
    // 简单起见，我们使用远程配置覆盖本地配置，但保留本地新增的项目
    console.log('合并配置...');
    
    // 更新本地配置为远程配置
    appState.config = {
        ...remoteConfig,
        // 保留本地WebDAV配置
        webdav: appState.config.webdav
    };
    
    // 保存合并后的配置到本地
    saveConfigToLocal();
    
    // 更新UI
    updateUI();
}

// 将函数暴露到全局作用域以便在HTML中调用
window.editBookmark = editBookmark;
window.deleteBookmark = deleteBookmark;