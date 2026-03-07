<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? '编辑书签' : '添加书签' }}</h3>
        <span class="close-btn" @click="$emit('close')">&times;</span>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="bookmark-title">标题:</label>
            <input
              type="text"
              id="bookmark-title"
              v-model="form.title"
              placeholder="书签标题"
              required
            />
          </div>
          <div class="form-group">
            <label for="bookmark-url">网址:</label>
            <input
              type="url"
              id="bookmark-url"
              v-model="form.url"
              placeholder="https://example.com"
              required
            />
          </div>
          <div class="form-group">
            <label for="bookmark-desc">描述:</label>
            <input
              type="text"
              id="bookmark-desc"
              v-model="form.desc"
              placeholder="书签描述"
            />
          </div>
          <div class="form-group">
            <label for="bookmark-folder">收藏夹:</label>
            <select id="bookmark-folder" v-model="form.folderId">
              <option v-for="folder in appStore.folders" :key="folder.id" :value="folder.id">
                {{ folder.name }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">
              {{ isEditing ? '更新书签' : '添加书签' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Bookmark } from '@/types'

const props = defineProps<{
  bookmark?: Bookmark
}>()

const emit = defineEmits<{
  close: []
}>()

const appStore = useAppStore()

const isEditing = computed(() => !!props.bookmark)

const form = reactive({
  title: props.bookmark?.title ?? '',
  url: props.bookmark?.url ?? '',
  desc: props.bookmark?.desc ?? '',
  folderId: props.bookmark?.folderId ?? appStore.currentFolder,
})

const handleSubmit = () => {
  if (isEditing.value && props.bookmark) {
    appStore.updateBookmark({ ...form, id: props.bookmark.id })
  } else {
    appStore.addBookmark(form)
  }
  emit('close')
  alert(isEditing.value ? '书签已更新！' : '书签已添加！')
}
</script>

<style scoped>
.modal-overlay {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 0;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: modalopen 0.4s;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes modalopen {
  from {
    opacity: 0;
    transform: translateY(-60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.close-btn {
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  color: #aaa;
}

.close-btn:hover {
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

.form-group input,
.form-group select {
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
</style>
