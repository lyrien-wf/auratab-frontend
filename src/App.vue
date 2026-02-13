<template>
  <div id="app">
    <!-- 顶部搜索栏 -->
    <header class="search-header">
      <div class="search-container">
        <input
          type="text"
          v-model="appStore.searchQuery"
          @keyup.enter="appStore.performSearch"
          placeholder="请输入搜索关键词..."
          class="search-input"
        />
        <select v-model="appStore.selectedEngine" class="search-engine">
          <option value="baidu">百度</option>
          <option value="google">谷歌</option>
          <option value="bing">必应</option>
          <option value="duckduckgo">DuckDuckGo</option>
        </select>
        <button @click="appStore.performSearch" class="search-btn">搜索</button>
      </div>
      
      <!-- 同步状态指示器 -->
      <div class="sync-status">
        <span id="status-text">{{ appStore.syncStatus }}</span>
        <button @click="appStore.syncWithWebDAV" class="sync-btn">同步</button>
        <button @click="showSettingsModal = true" class="settings-btn">设置</button>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="main-container">
      <!-- 左侧收藏夹列表 -->
      <aside class="sidebar">
        <div class="folder-actions">
          <button @click="showAddFolderModal = true" class="btn-primary">+ 新建收藏夹</button>
        </div>
        <div class="folder-list">
          <div
            v-for="folder in appStore.folders"
            :key="folder.id"
            class="folder-item"
            :class="{ active: appStore.currentFolder === folder.id }"
            @click="appStore.switchFolder(folder.id)"
          >
            <span class="folder-icon">{{ folder.icon }}</span>
            <span class="folder-name">{{ folder.name }}</span>
            <span class="folder-actions" v-if="showFolderActions === folder.id">
              <button @click.stop="editFolder(folder)" class="edit-btn">✏️</button>
              <button @click.stop="deleteFolder(folder)" class="delete-btn">🗑️</button>
            </span>
            <span 
              class="action-trigger" 
              @mouseover="showFolderActions = folder.id" 
              @mouseout="showFolderActions = null"
            >
              ...
            </span>
          </div>
        </div>
      </aside>

      <!-- 右侧内容区域 -->
      <main class="content-area">
        <div class="bookmark-actions">
          <button @click="showAddBookmarkModal = true" class="btn-primary">+ 添加书签</button>
        </div>
        
        <div
          v-for="folder in appStore.folders"
          :key="folder.id"
          class="bookmark-section"
          :class="{ hidden: appStore.currentFolder !== folder.id }"
        >
          <h2>{{ folder.name }}</h2>
          <div class="bookmark-grid">
            <div
              v-for="bookmark in appStore.getBookmarksByFolder(folder.id)"
              :key="bookmark.id"
              class="bookmark-item"
            >
              <a :href="bookmark.url" target="_blank">
                <img :src="appStore.getFaviconUrl(bookmark.url)" :alt="bookmark.title" class="bookmark-icon">
                <span class="bookmark-title">{{ bookmark.title }}</span>
              </a>
              <div class="bookmark-actions">
                <button @click.stop="editBookmark(bookmark, folder.id)" class="edit-btn">✏️</button>
                <button @click.stop="deleteBookmark(bookmark.id, folder.id)" class="delete-btn">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- WebDAV设置模态框 -->
    <div class="modal" v-if="showSettingsModal" @click="closeSettingsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>WebDAV 同步设置</h3>
          <span class="close" @click="closeSettingsModal">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleWebDAVSubmit">
            <div class="form-group">
              <label for="webdav-url">WebDAV 地址:</label>
              <input 
                type="url" 
                id="webdav-url" 
                v-model="appStore.webdavConfig.url"
                placeholder="例如: https://dav.jianguoyun.com/dav/" 
                required
              >
            </div>
            <div class="form-group">
              <label for="webdav-username">用户名:</label>
              <input 
                type="text" 
                id="webdav-username" 
                v-model="appStore.webdavConfig.username"
                placeholder="您的WebDAV用户名" 
                required
              >
            </div>
            <div class="form-group">
              <label for="webdav-password">密码:</label>
              <input 
                type="password" 
                id="webdav-password" 
                v-model="appStore.webdavConfig.password"
                placeholder="您的WebDAV密码" 
                required
              >
            </div>
            <div class="form-group">
              <label for="config-file">配置文件名:</label>
              <input 
                type="text" 
                id="config-file" 
                v-model="appStore.configFileName"
                required
              >
            </div>
            <div class="form-actions">
              <button type="button" @click="appStore.testWebDAVConnection" class="btn-secondary">测试连接</button>
              <button type="submit" class="btn-primary">保存设置</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 添加书签模态框 -->
    <div class="modal" v-if="showAddBookmarkModal" @click="closeBookmarkModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingBookmark ? '编辑书签' : '添加书签' }}</h3>
          <span class="close" @click="closeBookmarkModal">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleBookmarkSubmit">
            <div class="form-group">
              <label for="bookmark-title">标题:</label>
              <input 
                type="text" 
                id="bookmark-title" 
                v-model="currentBookmark.title"
                placeholder="书签标题" 
                required
              >
            </div>
            <div class="form-group">
              <label for="bookmark-url">网址:</label>
              <input 
                type="url" 
                id="bookmark-url" 
                v-model="currentBookmark.url"
                placeholder="https://example.com" 
                required
              >
            </div>
            <div class="form-group">
              <label for="bookmark-desc">描述:</label>
              <input 
                type="text" 
                id="bookmark-desc" 
                v-model="currentBookmark.desc"
                placeholder="书签描述"
              >
            </div>
            <div class="form-group">
              <label for="bookmark-folder">收藏夹:</label>
              <select id="bookmark-folder" v-model="currentBookmark.folderId">
                <option v-for="folder in appStore.folders" :key="folder.id" :value="folder.id">
                  {{ folder.name }}
                </option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">
                {{ editingBookmark ? '更新书签' : '添加书签' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 添加收藏夹模态框 -->
    <div class="modal" v-if="showAddFolderModal" @click="closeFolderModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingFolder ? '编辑收藏夹' : '添加收藏夹' }}</h3>
          <span class="close" @click="closeFolderModal">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleFolderSubmit">
            <div class="form-group">
              <label for="folder-name">名称:</label>
              <input 
                type="text" 
                id="folder-name" 
                v-model="currentFolderData.name"
                placeholder="收藏夹名称" 
                required
              >
            </div>
            <div class="form-group">
              <label for="folder-icon">图标:</label>
              <input 
                type="text" 
                id="folder-icon" 
                v-model="currentFolderData.icon"
                placeholder="收藏夹图标" 
                required
              >
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">
                {{ editingFolder ? '更新收藏夹' : '添加收藏夹' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/stores/app';

// 使用store
const appStore = useAppStore();

// 响应式数据
const showSettingsModal = ref(false);
const showAddBookmarkModal = ref(false);
const showAddFolderModal = ref(false);
const showFolderActions = ref<string | null>(null);

// 当前编辑的书签和收藏夹
const editingBookmark = ref(false);
const editingFolder = ref(false);
const currentBookmark = ref({
  id: '',
  title: '',
  url: '',
  desc: '',
  folderId: ''
});
const currentFolderData = ref({
  id: '',
  name: '',
  icon: '📁'
});

// 方法
const handleWebDAVSubmit = () => {
  // 保存配置到本地存储
  appStore.saveConfigToLocal();
  
  // 更新UI状态
  if (appStore.webdavConfig.url) {
    appStore.syncStatus = '已配置WebDAV';
  } else {
    appStore.syncStatus = '本地数据';
  }
  
  // 关闭模态框
  showSettingsModal.value = false;
  
  alert('WebDAV配置已保存！');
};

const closeSettingsModal = () => {
  showSettingsModal.value = false;
};

// 书签管理方法
const addBookmark = () => {
  currentBookmark.value = {
    id: Date.now().toString(),
    title: '',
    url: '',
    desc: '',
    folderId: appStore.currentFolder
  };
  editingBookmark.value = false;
  showAddBookmarkModal.value = true;
};

const editBookmark = (bookmark: any, folderId: string) => {
  currentBookmark.value = { ...bookmark };
  currentBookmark.value.folderId = folderId;
  editingBookmark.value = true;
  showAddBookmarkModal.value = true;
};

const deleteBookmark = (bookmarkId: string, folderId: string) => {
  if (!confirm('确定要删除这个书签吗？')) {
    return;
  }
  
  // 从store中的bookmarks数组中找到并删除该书签
  const index = appStore.bookmarks.findIndex(b => b.id === bookmarkId && b.folderId === folderId);
  if (index !== -1) {
    appStore.bookmarks.splice(index, 1);
    appStore.saveConfigToLocal();
    alert('书签已删除！');
  }
};

const handleBookmarkSubmit = () => {
  if (editingBookmark.value) {
    // 更新现有书签
    const index = appStore.bookmarks.findIndex(b => b.id === currentBookmark.value.id);
    if (index !== -1) {
      appStore.bookmarks[index] = { ...currentBookmark.value };
    }
  } else {
    // 添加新书签
    appStore.bookmarks.push({ ...currentBookmark.value, id: Date.now().toString() });
  }
  
  appStore.saveConfigToLocal();
  closeBookmarkModal();
  alert(editingBookmark.value ? '书签已更新！' : '书签已添加！');
};

const closeBookmarkModal = () => {
  showAddBookmarkModal.value = false;
  editingBookmark.value = false;
};

// 收藏夹管理方法
const addFolder = () => {
  currentFolderData.value = {
    id: '',
    name: '',
    icon: '📁'
  };
  editingFolder.value = false;
  showAddFolderModal.value = true;
};

const editFolder = (folder: any) => {
  currentFolderData.value = { ...folder };
  editingFolder.value = true;
  showAddFolderModal.value = true;
};

const deleteFolder = (folder: any) => {
  if (folder.id === 'basic-bookmarks') {
    alert('不能删除基础收藏夹！');
    return;
  }
  
  if (!confirm(`确定要删除收藏夹 "${folder.name}" 吗？此操作无法撤销。`)) {
    return;
  }
  
  // 删除收藏夹
  const folderIndex = appStore.folders.findIndex(f => f.id === folder.id);
  if (folderIndex !== -1) {
    appStore.folders.splice(folderIndex, 1);
  }
  
  // 删除该收藏夹下的所有书签
  for (let i = appStore.bookmarks.length - 1; i >= 0; i--) {
    if (appStore.bookmarks[i].folderId === folder.id) {
      appStore.bookmarks.splice(i, 1);
    }
  }
  
  appStore.saveConfigToLocal();
  closeFolderModal();
  alert('收藏夹已删除！');
};

const handleFolderSubmit = () => {
  if (editingFolder.value) {
    // 更新现有收藏夹
    const index = appStore.folders.findIndex(f => f.id === currentFolderData.value.id);
    if (index !== -1) {
      appStore.folders[index] = { ...currentFolderData.value };
    }
  } else {
    // 添加新收藏夹
    const newFolderId = `folder_${Date.now()}`;
    appStore.folders.push({ 
      ...currentFolderData.value, 
      id: newFolderId 
    });
  }
  
  appStore.saveConfigToLocal();
  closeFolderModal();
  alert(editingFolder.value ? '收藏夹已更新！' : '收藏夹已添加！');
};

const closeFolderModal = () => {
  showAddFolderModal.value = false;
  editingFolder.value = false;
};
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 搜索栏样式 */
.search-header {
  background-color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #4285f4;
}

.search-engine {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  font-size: 14px;
  outline: none;
}

.search-btn {
  padding: 12px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #3367d6;
}

/* 同步状态栏样式 */
.sync-status {
  position: absolute;
  top: 15px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

#status-text {
  font-size: 14px;
  color: #666;
}

.sync-btn, .settings-btn {
  padding: 8px 12px;
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.sync-btn:hover, .settings-btn:hover {
  background-color: #3f51b5;
}

/* 主容器样式 */
.main-container {
  display: flex;
  min-height: calc(100vh - 70px); /* 减去搜索栏高度 */
  height: auto;
  overflow: hidden;
}

/* 左侧边栏样式 */
.sidebar {
  width: 300px;
  background-color: white;
  border-right: 1px solid #eee;
  overflow-y: auto;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.folder-actions {
  padding: 0 20px 15px;
}

.btn-primary {
  padding: 8px 15px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #3367d6;
}

.btn-secondary {
  padding: 8px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.folder-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.folder-item {
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
  border-left: 4px solid transparent;
  position: relative;
}

.folder-item:hover {
  background-color: #f8f9fa;
}

.folder-item.active {
  background-color: #e8f0fe;
  border-left: 4px solid #4285f4;
  color: #4285f4;
  font-weight: bold;
}

.folder-icon {
  font-size: 18px;
}

.folder-name {
  flex: 1;
}

.folder-actions {
  display: none;
  gap: 5px;
}

.folder-item:hover .folder-actions {
  display: flex;
}

.folder-actions button {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 3px;
}

.folder-actions button:hover {
  background-color: #e9ecef;
}

.action-trigger {
  display: none;
  cursor: pointer;
  color: #aaa;
}

.folder-item:hover .action-trigger {
  display: block;
}

/* 右侧内容区域样式 */
.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fafafa;
  min-height: 500px; /* 确保最小高度 */
  display: flex;
  flex-direction: column;
}

.bookmark-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.bookmark-section {
  display: block;
  opacity: 1;
  transition: opacity 0.3s ease;
  flex: 1;
}

.bookmark-section.hidden {
  display: none;
  opacity: 0;
  position: absolute;
  left: -9999px;
  top: 0;
}

.bookmark-section h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4285f4;
  display: inline-block;
}

/* 书签网格布局 */
.bookmark-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.bookmark-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 140px;
}

.bookmark-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.bookmark-item a {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1;
  justify-content: center;
}

.bookmark-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
  border-radius: 8px;
  object-fit: contain;
  background-color: white;
  padding: 4px;
  border: 1px solid #eee;
}

.bookmark-title {
  font-size: 14px;
  color: #333;
  word-break: break-word;
  text-align: center;
  line-height: 1.4;
}

.bookmark-actions {
  display: none;
  gap: 5px;
  margin-top: 10px;
  justify-content: center;
}

.bookmark-item:hover .bookmark-actions {
  display: flex;
}

.bookmark-actions button {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 3px;
}

.bookmark-actions button:hover {
  background-color: #e9ecef;
}

/* 模态框样式 */
.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 0;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  animation: modalopen 0.4s;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes modalopen {
  from {opacity: 0; transform: translateY(-60px);}
  to {opacity: 1; transform: translateY(0);}
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close {
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  color: #aaa;
}

.close:hover {
  color: #000;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .content-area {
    min-height: auto;
    padding: 15px;
  }

  .bookmark-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .bookmark-icon {
    width: 36px;
    height: 36px;
  }

  .bookmark-item {
    min-height: 120px;
    padding: 12px;
  }
  
  .sync-status {
    position: static;
    justify-content: flex-end;
    margin-top: 10px;
  }
  
  .search-container {
    flex-direction: column;
  }
}
</style>