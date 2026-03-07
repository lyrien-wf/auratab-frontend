<template>
  <aside class="sidebar">
    <div class="sidebar-actions">
      <button @click="$emit('addFolder')" class="btn-primary">+ 新建收藏夹</button>
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
        <span
          class="folder-item-actions"
          @click.stop
          @mouseover="hoveredFolder = folder.id"
          @mouseout="hoveredFolder = null"
        >
          <template v-if="hoveredFolder === folder.id">
            <button @click="$emit('editFolder', folder)" class="action-btn">✏️</button>
            <button @click="$emit('deleteFolder', folder)" class="action-btn">🗑️</button>
          </template>
          <template v-else>...</template>
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Folder } from '@/types'

defineEmits<{
  addFolder: []
  editFolder: [folder: Folder]
  deleteFolder: [folder: Folder]
}>()

const appStore = useAppStore()
const hoveredFolder = ref<string | null>(null)
</script>

<style scoped>
.sidebar {
  width: 300px;
  background-color: white;
  border-right: 1px solid #eee;
  overflow-y: auto;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-actions {
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

.folder-item-actions {
  display: none;
  gap: 5px;
  cursor: pointer;
  color: #aaa;
}

.folder-item:hover .folder-item-actions {
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

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #eee;
  }
}
</style>
