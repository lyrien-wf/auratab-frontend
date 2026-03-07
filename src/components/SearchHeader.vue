<template>
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

    <div class="sync-status">
      <span class="status-text">{{ appStore.syncStatus }}</span>
      <button @click="appStore.syncWithWebDAV" class="sync-btn">同步</button>
      <button @click="$emit('openSettings')" class="settings-btn">设置</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

defineEmits<{
  openSettings: []
}>()

const appStore = useAppStore()
</script>

<style scoped>
.search-header {
  background-color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.sync-status {
  position: absolute;
  top: 15px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-text {
  font-size: 14px;
  color: #666;
}

.sync-btn,
.settings-btn {
  padding: 8px 12px;
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.sync-btn:hover,
.settings-btn:hover {
  background-color: #3f51b5;
}

@media (max-width: 768px) {
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
