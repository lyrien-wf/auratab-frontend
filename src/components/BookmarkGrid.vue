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
  padding: 20px;
  overflow-y: auto;
  background-color: #fafafa;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-header h2 {
  color: #333;
  font-size: 24px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4285f4;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 140px;
}

.bookmark-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
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

.bookmark-item-actions {
  display: none;
  gap: 5px;
  margin-top: 10px;
  justify-content: center;
}

.bookmark-item:hover .bookmark-item-actions {
  display: flex;
}

.action-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 3px;
}

.action-btn:hover {
  background-color: #e9ecef;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}

@media (max-width: 768px) {
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
}
</style>
