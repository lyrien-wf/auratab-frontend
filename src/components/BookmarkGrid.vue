<template>
  <main class="content-area">
    <div class="content-header">
      <h2 v-if="appStore.currentFolderInfo">{{ appStore.currentFolderInfo.name }}</h2>
      <button @click="$emit('addBookmark')" class="btn-primary">+ 添加书签</button>
    </div>

    <div class="bookmark-grid">
      <div
        v-for="bookmark in appStore.currentBookmarks"
        :key="bookmark.id"
        class="bookmark-item"
      >
        <a :href="bookmark.url" target="_blank">
          <img
            :src="appStore.getFaviconUrl(bookmark.url)"
            :alt="bookmark.title"
            class="bookmark-icon"
          />
          <span class="bookmark-title">{{ bookmark.title }}</span>
        </a>
        <div class="bookmark-item-actions">
          <button @click.stop="$emit('editBookmark', bookmark)" class="action-btn">✏️</button>
          <button @click.stop="$emit('deleteBookmark', bookmark.id)" class="action-btn">🗑️</button>
        </div>
      </div>
    </div>

    <div v-if="appStore.currentBookmarks.length === 0" class="empty-state">
      <p>当前收藏夹没有书签，点击上方按钮添加。</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import type { Bookmark } from '@/types'

defineEmits<{
  addBookmark: []
  editBookmark: [bookmark: Bookmark]
  deleteBookmark: [bookmarkId: string]
}>()

const appStore = useAppStore()
</script>

<style scoped>
.content-area {
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
  background: var(--color-bg);
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.content-header h2 {
  color: var(--color-text);
  font-size: 22px;
  font-weight: 600;
  position: relative;
  padding-bottom: 0;
  border-bottom: none;
}

.btn-primary {
  padding: 10px 18px;
  background: var(--color-primary-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: var(--transition-normal);
  box-shadow: 0 2px 8px rgba(124, 111, 234, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(124, 111, 234, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.bookmark-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 18px;
}

.bookmark-item {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 20px 16px;
  text-align: center;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 140px;
}

.bookmark-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
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
  margin-bottom: 12px;
  border-radius: var(--radius-md);
  object-fit: contain;
  background: var(--color-bg-warm);
  padding: 6px;
  border: 1px solid var(--color-border-light);
}

.bookmark-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  word-break: break-word;
  text-align: center;
  line-height: 1.4;
}

.bookmark-item-actions {
  display: none;
  gap: 4px;
  margin-top: 10px;
  justify-content: center;
}

.bookmark-item:hover .bookmark-item-actions {
  display: flex;
}

.action-btn {
  background: none;
  border: none;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.action-btn:hover {
  background: rgba(124, 111, 234, 0.1);
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 15px;
  font-weight: 400;
}

@media (max-width: 768px) {
  .content-area {
    min-height: auto;
    padding: 16px;
  }

  .bookmark-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 14px;
  }

  .bookmark-icon {
    width: 36px;
    height: 36px;
  }

  .bookmark-item {
    min-height: 120px;
    padding: 14px 12px;
  }
}
</style>
