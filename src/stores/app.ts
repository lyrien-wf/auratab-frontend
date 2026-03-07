import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bookmark, Folder, WebDAVConfig, AppConfig } from '@/types'

export const useAppStore = defineStore('app', () => {
  const CONFIG = {
    configFile: 'auratab-config.json',
    localStorageKey: 'auratab-config',
  }

  // 响应式数据
  const searchQuery = ref('')
  const selectedEngine = ref('baidu')
  const currentFolder = ref('basic-bookmarks')
  const syncStatus = ref('本地数据')

  // WebDAV配置
  const webdavConfig = ref<WebDAVConfig>({
    url: '',
    username: '',
    password: '',
  })

  const configFileName = ref(CONFIG.configFile)

  // 应用状态
  const folders = ref<Folder[]>([
    { id: 'basic-bookmarks', name: '基础收藏夹', icon: '📁' },
    { id: 'work', name: '工作相关', icon: '💼' },
    { id: 'study', name: '学习资源', icon: '📚' },
    { id: 'entertainment', name: '娱乐休闲', icon: '🎮' },
    { id: 'tools', name: '实用工具', icon: '🛠️' },
  ])

  const bookmarks = ref<Bookmark[]>([
    { id: '1', title: '百度', url: 'https://www.baidu.com', desc: '百度一下，你就知道', folderId: 'basic-bookmarks' },
    { id: '2', title: '谷歌', url: 'https://www.google.com', desc: '全球最大的搜索引擎', folderId: 'basic-bookmarks' },
    { id: '3', title: 'GitHub', url: 'https://www.github.com', desc: '代码托管平台', folderId: 'basic-bookmarks' },
    { id: '4', title: 'Stack Overflow', url: 'https://www.stackoverflow.com', desc: '程序员问答社区', folderId: 'basic-bookmarks' },
    { id: '5', title: '知乎', url: 'https://www.zhihu.com', desc: '中文问答社区', folderId: 'basic-bookmarks' },
    { id: '6', title: '简书', url: 'https://www.jianshu.com', desc: '创作分享平台', folderId: 'basic-bookmarks' },
    { id: '7', title: 'Office', url: 'https://www.office.com', desc: '微软办公套件', folderId: 'work' },
    { id: '8', title: 'Slack', url: 'https://www.slack.com', desc: '团队协作工具', folderId: 'work' },
    { id: '9', title: 'Zoom', url: 'https://www.zoom.us', desc: '视频会议软件', folderId: 'work' },
    { id: '10', title: '腾讯', url: 'https://www.tencent.com', desc: '腾讯官网', folderId: 'work' },
    { id: '11', title: 'Coursera', url: 'https://www.coursera.org', desc: '在线课程平台', folderId: 'study' },
    { id: '12', title: 'Udemy', url: 'https://www.udemy.com', desc: '在线技能学习平台', folderId: 'study' },
    { id: '13', title: '菜鸟教程', url: 'https://www.runoob.com', desc: '学编程，从菜鸟开始', folderId: 'study' },
    { id: '14', title: '阮一峰教程', url: 'https://wangdoc.com', desc: '技术文档网站', folderId: 'study' },
    { id: '15', title: 'Bilibili', url: 'https://www.bilibili.com', desc: '视频弹幕网站', folderId: 'entertainment' },
    { id: '16', title: 'YouTube', url: 'https://www.youtube.com', desc: '全球最大视频网站', folderId: 'entertainment' },
    { id: '17', title: 'Netflix', url: 'https://www.netflix.com', desc: '流媒体服务平台', folderId: 'entertainment' },
    { id: '18', title: 'GamePress', url: 'https://www.gamepress.gg', desc: '游戏攻略网站', folderId: 'entertainment' },
    { id: '19', title: 'ProcessOn', url: 'https://www.processon.com', desc: '在线作图工具', folderId: 'tools' },
    { id: '20', title: 'IconFont', url: 'https://www.iconfont.cn', desc: '阿里巴巴矢量图标库', folderId: 'tools' },
    { id: '21', title: 'TinyPNG', url: 'https://tinypng.com', desc: '图片压缩工具', folderId: 'tools' },
    { id: '22', title: 'AConvert', url: 'https://www.aconvert.com', desc: '在线文件转换工具', folderId: 'tools' },
  ])

  // computed
  const currentBookmarks = computed(() => {
    return bookmarks.value.filter((b) => b.folderId === currentFolder.value)
  })

  const currentFolderInfo = computed(() => {
    return folders.value.find((f) => f.id === currentFolder.value)
  })

  // 方法
  const switchFolder = (folderId: string) => {
    currentFolder.value = folderId
  }

  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return `https://www.google.com/s2/favicons?domain=${urlObj.host}&sz=64`
    } catch {
      return `https://www.google.com/s2/favicons?domain=example.com&sz=64`
    }
  }

  const performSearch = () => {
    if (!searchQuery.value.trim()) {
      alert('请输入搜索关键词')
      return
    }

    const engineUrls: Record<string, string> = {
      baidu: 'https://www.baidu.com/s?wd=',
      google: 'https://www.google.com/search?q=',
      bing: 'https://www.bing.com/search?q=',
      duckduckgo: 'https://duckduckgo.com/?q=',
    }

    const base = engineUrls[selectedEngine.value] || engineUrls.baidu
    window.open(base + encodeURIComponent(searchQuery.value), '_blank')
  }

  const getBookmarksByFolder = (folderId: string) => {
    return bookmarks.value.filter((b) => b.folderId === folderId)
  }

  // 工具方法：安全的 Base64 编码（支持非 ASCII 字符）
  const encodeBase64 = (str: string): string => {
    const bytes = new TextEncoder().encode(str)
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('')
    return btoa(binString)
  }

  const getAuthHeader = (): string => {
    return 'Basic ' + encodeBase64(webdavConfig.value.username + ':' + webdavConfig.value.password)
  }

  // WebDAV相关方法
  const syncWithWebDAV = async () => {
    if (!webdavConfig.value.url || !webdavConfig.value.username || !webdavConfig.value.password) {
      alert('请先配置WebDAV信息')
      return
    }

    syncStatus.value = '同步中...'

    try {
      const remoteConfig = await downloadFromWebDAV()

      if (remoteConfig) {
        mergeConfigs(remoteConfig)
      }

      // 上传合并后（或本地）的最新配置
      await uploadToWebDAV()

      syncStatus.value = '同步完成'
      setTimeout(() => {
        syncStatus.value = '已同步'
      }, 2000)
    } catch (error) {
      console.error('同步失败:', error)
      syncStatus.value = '同步失败'
      alert(`同步失败: ${(error as Error).message}`)
    }
  }

  const downloadFromWebDAV = async (): Promise<AppConfig | null> => {
    try {
      const response = await fetch(`${webdavConfig.value.url}/${configFileName.value}`, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      })

      if (response.ok) {
        const configText = await response.text()
        return JSON.parse(configText) as AppConfig
      } else if (response.status === 404) {
        return null
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('下载配置失败:', error)
      throw error
    }
  }

  const uploadToWebDAV = async () => {
    try {
      const configData: AppConfig = {
        folders: folders.value,
        bookmarks: groupBookmarksByFolder(),
        webdav: { url: webdavConfig.value.url, username: webdavConfig.value.username, password: '' },
      }

      const response = await fetch(`${webdavConfig.value.url}/${configFileName.value}`, {
        method: 'PUT',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData, null, 2),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('上传配置失败:', error)
      throw error
    }
  }

  const testWebDAVConnection = async () => {
    const { url, username, password } = webdavConfig.value

    if (!url || !username || !password) {
      alert('请填写完整的WebDAV信息')
      return
    }

    try {
      const response = await fetch(url, {
        method: 'PROPFIND',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/xml',
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
        <propfind xmlns="DAV:">
          <prop>
            <current-user-principal/>
          </prop>
        </propfind>`,
      })

      if (response.ok || response.status === 207) {
        alert('WebDAV连接测试成功！')
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('WebDAV连接测试失败:', error)
      alert(`WebDAV连接测试失败: ${(error as Error).message}`)
    }
  }

  const saveConfigToLocal = () => {
    try {
      const configData: AppConfig = {
        folders: folders.value,
        bookmarks: groupBookmarksByFolder(),
        webdav: webdavConfig.value,
      }

      localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(configData))
    } catch (e) {
      console.error('保存配置到本地存储失败:', e)
      alert('保存配置失败: ' + (e as Error).message)
    }
  }

  const loadConfigFromLocal = () => {
    const savedConfig = localStorage.getItem(CONFIG.localStorageKey)
    if (!savedConfig) return

    try {
      const parsedConfig = JSON.parse(savedConfig) as AppConfig
      folders.value = parsedConfig.folders || []
      bookmarks.value = flattenBookmarks(parsedConfig.bookmarks || {})
      webdavConfig.value = parsedConfig.webdav || { url: '', username: '', password: '' }

      if (webdavConfig.value.url) {
        syncStatus.value = '已配置WebDAV'
      }
    } catch (e) {
      console.error('解析本地配置失败:', e)
    }
  }

  const groupBookmarksByFolder = (): Record<string, Bookmark[]> => {
    const grouped: Record<string, Bookmark[]> = {}
    folders.value.forEach((folder) => {
      grouped[folder.id] = bookmarks.value.filter((b) => b.folderId === folder.id)
    })
    return grouped
  }

  const flattenBookmarks = (groupedBookmarks: Record<string, Bookmark[]>): Bookmark[] => {
    const flattened: Bookmark[] = []
    for (const folderId of Object.keys(groupedBookmarks)) {
      for (const bookmark of groupedBookmarks[folderId] ?? []) {
        flattened.push({ ...bookmark, folderId })
      }
    }
    return flattened
  }

  const mergeConfigs = (remoteConfig: AppConfig) => {
    folders.value = remoteConfig.folders || folders.value
    bookmarks.value = flattenBookmarks(remoteConfig.bookmarks || groupBookmarksByFolder())
    // 保留本地 WebDAV 密码，远程不存储密码
    webdavConfig.value = {
      ...webdavConfig.value,
      url: remoteConfig.webdav?.url || webdavConfig.value.url,
      username: remoteConfig.webdav?.username || webdavConfig.value.username,
    }
    saveConfigToLocal()
  }

  // 书签 CRUD
  const addBookmark = (bookmark: Omit<Bookmark, 'id'>) => {
    bookmarks.value.push({ ...bookmark, id: Date.now().toString() })
    saveConfigToLocal()
  }

  const updateBookmark = (bookmark: Bookmark) => {
    const index = bookmarks.value.findIndex((b) => b.id === bookmark.id)
    if (index !== -1) {
      bookmarks.value[index] = { ...bookmark }
      saveConfigToLocal()
    }
  }

  const removeBookmark = (bookmarkId: string) => {
    const index = bookmarks.value.findIndex((b) => b.id === bookmarkId)
    if (index !== -1) {
      bookmarks.value.splice(index, 1)
      saveConfigToLocal()
    }
  }

  // 收藏夹 CRUD
  const addFolder = (folder: Omit<Folder, 'id'>) => {
    folders.value.push({ ...folder, id: `folder_${Date.now()}` })
    saveConfigToLocal()
  }

  const updateFolder = (folder: Folder) => {
    const index = folders.value.findIndex((f) => f.id === folder.id)
    if (index !== -1) {
      folders.value[index] = { ...folder }
      saveConfigToLocal()
    }
  }

  const removeFolder = (folderId: string) => {
    if (folderId === 'basic-bookmarks') return

    folders.value = folders.value.filter((f) => f.id !== folderId)
    bookmarks.value = bookmarks.value.filter((b) => b.folderId !== folderId)

    if (currentFolder.value === folderId) {
      currentFolder.value = 'basic-bookmarks'
    }
    saveConfigToLocal()
  }

  // 初始化加载配置
  loadConfigFromLocal()

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

    // computed
    currentBookmarks,
    currentFolderInfo,

    // getters
    getBookmarksByFolder,

    // actions
    switchFolder,
    getFaviconUrl,
    performSearch,
    syncWithWebDAV,
    testWebDAVConnection,
    saveConfigToLocal,
    loadConfigFromLocal,
    addBookmark,
    updateBookmark,
    removeBookmark,
    addFolder,
    updateFolder,
    removeFolder,
  }
})
