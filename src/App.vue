<template>
  <div id="app">
    <SearchHeader @open-settings="showSettingsModal = true" />

    <div class="main-container">
      <FolderSidebar
        @add-folder="openFolderModal()"
        @edit-folder="openFolderModal($event)"
        @delete-folder="handleDeleteFolder"
      />

      <BookmarkGrid
        @add-bookmark="openBookmarkModal()"
        @edit-bookmark="openBookmarkModal($event)"
        @delete-bookmark="handleDeleteBookmark"
      />
    </div>

    <SettingsModal v-if="showSettingsModal" @close="showSettingsModal = false" />

    <BookmarkModal
      v-if="showBookmarkModal"
      :bookmark="editingBookmark"
      @close="closeBookmarkModal"
    />

    <FolderModal
      v-if="showFolderModal"
      :folder="editingFolder"
      @close="closeFolderModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Bookmark, Folder } from '@/types'
import SearchHeader from '@/components/SearchHeader.vue'
import FolderSidebar from '@/components/FolderSidebar.vue'
import BookmarkGrid from '@/components/BookmarkGrid.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import BookmarkModal from '@/components/BookmarkModal.vue'
import FolderModal from '@/components/FolderModal.vue'

const appStore = useAppStore()

// 模态框状态
const showSettingsModal = ref(false)
const showBookmarkModal = ref(false)
const showFolderModal = ref(false)
const editingBookmark = ref<Bookmark | undefined>()
const editingFolder = ref<Folder | undefined>()

// 书签操作
const openBookmarkModal = (bookmark?: Bookmark) => {
  editingBookmark.value = bookmark
  showBookmarkModal.value = true
}

const closeBookmarkModal = () => {
  showBookmarkModal.value = false
  editingBookmark.value = undefined
}

const handleDeleteBookmark = (bookmarkId: string) => {
  if (!confirm('确定要删除这个书签吗？')) return
  appStore.removeBookmark(bookmarkId)
}

// 收藏夹操作
const openFolderModal = (folder?: Folder) => {
  editingFolder.value = folder
  showFolderModal.value = true
}

const closeFolderModal = () => {
  showFolderModal.value = false
  editingFolder.value = undefined
}

const handleDeleteFolder = (folder: Folder) => {
  if (folder.id === 'basic-bookmarks') {
    alert('不能删除基础收藏夹！')
    return
  }
  if (!confirm(`确定要删除收藏夹 "${folder.name}" 吗？此操作无法撤销。`)) return
  appStore.removeFolder(folder.id)
}
</script>

<style scoped>
.main-container {
  display: flex;
  min-height: calc(100vh - 70px);
  height: auto;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
}
</style>
