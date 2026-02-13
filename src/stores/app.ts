import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  // 应用配置
  const CONFIG = {
    configFile: 'auratab-config.json',
    localStorageKey: 'auratab-config'
  };

  // 响应式数据
  const searchQuery = ref('');
  const selectedEngine = ref('baidu');
  const currentFolder = ref('basic-bookmarks');
  const syncStatus = ref('本地数据');

  // WebDAV配置
  const webdavConfig = ref({
    url: '',
    username: '',
    password: ''
  });

  const configFileName = ref(CONFIG.configFile);

  // 应用状态
  const folders = ref([
    { id: 'basic-bookmarks', name: '基础收藏夹', icon: '📁' },
    { id: 'work', name: '工作相关', icon: '💼' },
    { id: 'study', name: '学习资源', icon: '📚' },
    { id: 'entertainment', name: '娱乐休闲', icon: '🎮' },
    { id: 'tools', name: '实用工具', icon: '🛠️' }
  ]);

  const bookmarks = ref([
    // 基础收藏夹
    { id: '1', title: '百度', url: 'https://www.baidu.com', desc: '百度一下，你就知道', folderId: 'basic-bookmarks' },
    { id: '2', title: '谷歌', url: 'https://www.google.com', desc: '全球最大的搜索引擎', folderId: 'basic-bookmarks' },
    { id: '3', title: 'GitHub', url: 'https://www.github.com', desc: '代码托管平台', folderId: 'basic-bookmarks' },
    { id: '4', title: 'Stack Overflow', url: 'https://www.stackoverflow.com', desc: '程序员问答社区', folderId: 'basic-bookmarks' },
    { id: '5', title: '知乎', url: 'https://www.zhihu.com', desc: '中文问答社区', folderId: 'basic-bookmarks' },
    { id: '6', title: '简书', url: 'https://www.jianshu.com', desc: '创作分享平台', folderId: 'basic-bookmarks' },

    // 工作相关
    { id: '7', title: 'Office', url: 'https://www.office.com', desc: '微软办公套件', folderId: 'work' },
    { id: '8', title: 'Slack', url: 'https://www.slack.com', desc: '团队协作工具', folderId: 'work' },
    { id: '9', title: 'Zoom', url: 'https://www.zoom.us', desc: '视频会议软件', folderId: 'work' },
    { id: '10', title: '腾讯', url: 'https://www.tencent.com', desc: '腾讯官网', folderId: 'work' },

    // 学习资源
    { id: '11', title: 'Coursera', url: 'https://www.coursera.org', desc: '在线课程平台', folderId: 'study' },
    { id: '12', title: 'Udemy', url: 'https://www.udemy.com', desc: '在线技能学习平台', folderId: 'study' },
    { id: '13', title: '菜鸟教程', url: 'https://www.runoob.com', desc: '学编程，从菜鸟开始', folderId: 'study' },
    { id: '14', title: '阮一峰教程', url: 'https://wangdoc.com', desc: '技术文档网站', folderId: 'study' },

    // 娱乐休闲
    { id: '15', title: 'Bilibili', url: 'https://www.bilibili.com', desc: '视频弹幕网站', folderId: 'entertainment' },
    { id: '16', title: 'YouTube', url: 'https://www.youtube.com', desc: '全球最大视频网站', folderId: 'entertainment' },
    { id: '17', title: 'Netflix', url: 'https://www.netflix.com', desc: '流媒体服务平台', folderId: 'entertainment' },
    { id: '18', title: 'GamePress', url: 'https://www.gamepress.gg', desc: '游戏攻略网站', folderId: 'entertainment' },

    // 实用工具
    { id: '19', title: 'ProcessOn', url: 'https://www.processon.com', desc: '在线作图工具', folderId: 'tools' },
    { id: '20', title: 'IconFont', url: 'https://www.iconfont.cn', desc: '阿里巴巴矢量图标库', folderId: 'tools' },
    { id: '21', title: 'TinyPNG', url: 'https://tinypng.com', desc: '图片压缩工具', folderId: 'tools' },
    { id: '22', title: 'AConvert', url: 'https://www.aconvert.com', desc: '在线文件转换工具', folderId: 'tools' }
  ]);

  // 方法
  const switchFolder = (folderId: string) => {
    currentFolder.value = folderId;
  };

  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      // 尝试获取 HTTPS 版本的 favicon，如果失败则回退到 HTTP
      return `https://${urlObj.host}/favicon.ico`;
    } catch (error) {
      // 如果URL无效，返回默认图标
      return 'https://cdn-icons-png.flaticon.com/512/1383/1383166.png'; // 默认网站图标
    }
  };

  const performSearch = () => {
    if (!searchQuery.value.trim()) {
      alert('请输入搜索关键词');
      return;
    }

    let searchUrl = '';
    switch(selectedEngine.value) {
      case 'baidu':
        searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`;
        break;
      case 'google':
        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`;
        break;
      case 'bing':
        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery.value)}`;
        break;
      case 'duckduckgo':
        searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery.value)}`;
        break;
      default:
        searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`;
    }

    // 在新标签页中打开搜索结果
    window.open(searchUrl, '_blank');
  };

  const getBookmarksByFolder = (folderId: string) => {
    return bookmarks.value.filter(bookmark => bookmark.folderId === folderId);
  };

  // WebDAV相关方法
  const syncWithWebDAV = async () => {
    if (!webdavConfig.value.url || !webdavConfig.value.username || !webdavConfig.value.password) {
      alert('请先配置WebDAV信息');
      return;
    }

    syncStatus.value = '同步中...';

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
      
      syncStatus.value = '同步完成';
      setTimeout(() => {
        syncStatus.value = '已同步';
      }, 2000);
    } catch (error) {
      console.error('同步失败:', error);
      syncStatus.value = '同步失败';
      alert(`同步失败: ${(error as Error).message}`);
    }
  };

  const downloadFromWebDAV = async (): Promise<any> => {
    try {
      const response = await fetch(`${webdavConfig.value.url}/${configFileName.value}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(webdavConfig.value.username + ':' + webdavConfig.value.password)
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
  };

  const uploadToWebDAV = async () => {
    try {
      const configData = {
        folders: folders.value,
        bookmarks: groupBookmarksByFolder(),
        webdav: webdavConfig.value
      };
      
      const configStr = JSON.stringify(configData, null, 2);
      
      const response = await fetch(`${webdavConfig.value.url}/${configFileName.value}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + btoa(webdavConfig.value.username + ':' + webdavConfig.value.password),
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
  };

  const testWebDAVConnection = async () => {
    const { url, username, password } = webdavConfig.value;
    
    if (!url || !username || !password) {
      alert('请填写完整的WebDAV信息');
      return;
    }
    
    try {
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
      alert(`WebDAV连接测试失败: ${(error as Error).message}`);
    }
  };

  const saveConfigToLocal = () => {
    try {
      const configData = {
        folders: folders.value,
        bookmarks: groupBookmarksByFolder(),
        webdav: webdavConfig.value
      };
      
      localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(configData));
      console.log('配置已保存到本地存储');
    } catch (e) {
      console.error('保存配置到本地存储失败:', e);
      alert('保存配置失败: ' + (e as Error).message);
    }
  };

  const loadConfigFromLocal = () => {
    const savedConfig = localStorage.getItem(CONFIG.localStorageKey);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        folders.value = parsedConfig.folders || [];
        bookmarks.value = flattenBookmarks(parsedConfig.bookmarks || {});
        webdavConfig.value = parsedConfig.webdav || { url: '', username: '', password: '' };
        
        if (webdavConfig.value.url) {
          syncStatus.value = '已配置WebDAV';
        }
        
        console.log('本地配置加载成功');
      } catch (e) {
        console.error('解析本地配置失败:', e);
        // 如果解析失败，使用默认配置
        initializeDefaultConfig();
      }
    } else {
      // 如果没有本地配置，使用默认配置
      initializeDefaultConfig();
    }
  };

  const initializeDefaultConfig = () => {
    // 已经在初始化时设置了默认值
    console.log('使用默认配置');
  };

  const groupBookmarksByFolder = () => {
    const grouped: Record<string, any[]> = {};
    
    folders.value.forEach(folder => {
      grouped[folder.id] = bookmarks.value.filter(b => b.folderId === folder.id);
    });
    
    return grouped;
  };

  const flattenBookmarks = (groupedBookmarks: Record<string, any[]>) => {
    const flattened: any[] = [];
    
    Object.keys(groupedBookmarks).forEach(folderId => {
      groupedBookmarks[folderId].forEach(bookmark => {
        flattened.push({ ...bookmark, folderId });
      });
    });
    
    return flattened;
  };

  const mergeConfigs = (remoteConfig: any) => {
    // 这里可以实现复杂的配置合并逻辑
    // 简单起见，我们使用远程配置覆盖本地配置，但保留本地新增的项目
    
    console.log('合并配置...');
    
    // 更新本地配置为远程配置
    folders.value = remoteConfig.folders || folders.value;
    bookmarks.value = flattenBookmarks(remoteConfig.bookmarks || groupBookmarksByFolder());
    webdavConfig.value = { ...webdavConfig.value, ...remoteConfig.webdav }; // 保留本地WebDAV配置
    
    // 保存合并后的配置到本地
    saveConfigToLocal();
  };

  // 初始化加载配置
  loadConfigFromLocal();

  return {
    // state
    searchQuery,
    selectedEngine,
    currentFolder,
    syncStatus,
    webdavConfig,
    configFileName,
    folders,
    bookmarks,
    
    // getters
    getBookmarksByFolder,
    
    // actions
    switchFolder,
    getFaviconUrl,
    performSearch,
    syncWithWebDAV,
    testWebDAVConnection,
    saveConfigToLocal,
    loadConfigFromLocal
  };
});