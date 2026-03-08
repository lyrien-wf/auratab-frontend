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
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 16px 24px;
  box-shadow: 0 1px 12px rgba(124, 111, 234, 0.06);
  border-bottom: 1px solid var(--color-border-light);
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
  padding: 12px 20px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: 15px;
  outline: none;
  background: var(--color-bg-warm);
  color: var(--color-text);
  transition: var(--transition-normal);
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-input:focus {
  border-color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: 0 0 0 3px rgba(124, 111, 234, 0.12);
}

.search-engine {
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-warm);
  color: var(--color-text);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: var(--transition-normal);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237c7394' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.search-engine:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(124, 111, 234, 0.12);
}

.search-btn {
  padding: 12px 22px;
  background: var(--color-primary-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  transition: var(--transition-normal);
  box-shadow: 0 2px 8px rgba(124, 111, 234, 0.25);
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(124, 111, 234, 0.35);
}

.search-btn:active {
  transform: translateY(0);
}

.sync-status {
  position: absolute;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-text {
  font-size: 13px;
  color: var(--color-text-muted);
  font-weight: 400;
}

.sync-btn,
.settings-btn {
  padding: 8px 14px;
  background: var(--color-surface);
  color: var(--color-primary);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  transition: var(--transition-normal);
}

.sync-btn:hover,
.settings-btn:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .sync-status {
    position: static;
    transform: none;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .search-container {
    flex-direction: column;
  }
}
</style>
