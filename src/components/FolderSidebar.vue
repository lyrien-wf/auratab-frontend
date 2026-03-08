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
  width: 280px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border-light);
  overflow-y: auto;
  padding: 20px 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-actions {
  padding: 0 16px 16px;
}

.btn-primary {
  width: 100%;
  padding: 10px 16px;
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

.folder-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  padding: 0 8px;
}

.folder-item {
  padding: 11px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition-normal);
  border-radius: var(--radius-md);
  position: relative;
  color: var(--color-text-secondary);
}

.folder-item:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.folder-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.folder-icon {
  font-size: 18px;
}

.folder-name {
  flex: 1;
  font-size: 14px;
}

.folder-item-actions {
  display: none;
  gap: 4px;
  cursor: pointer;
  color: var(--color-text-muted);
}

.folder-item:hover .folder-item-actions {
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

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--color-border-light);
  }
}
</style>
