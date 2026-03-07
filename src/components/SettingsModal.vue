<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>WebDAV 同步设置</h3>
        <span class="close-btn" @click="$emit('close')">&times;</span>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="webdav-url">WebDAV 地址:</label>
            <input
              type="url"
              id="webdav-url"
              v-model="appStore.webdavConfig.url"
              placeholder="例如: https://dav.jianguoyun.com/dav/"
              required
            />
          </div>
          <div class="form-group">
            <label for="webdav-username">用户名:</label>
            <input
              type="text"
              id="webdav-username"
              v-model="appStore.webdavConfig.username"
              placeholder="您的WebDAV用户名"
              required
            />
          </div>
          <div class="form-group">
            <label for="webdav-password">密码:</label>
            <input
              type="password"
              id="webdav-password"
              v-model="appStore.webdavConfig.password"
              placeholder="您的WebDAV密码"
              required
            />
          </div>
          <div class="form-group">
            <label for="config-file">配置文件名:</label>
            <input type="text" id="config-file" v-model="appStore.configFileName" required />
          </div>
          <div class="form-actions">
            <button type="button" @click="appStore.testWebDAVConnection" class="btn-secondary">
              测试连接
            </button>
            <button type="submit" class="btn-primary">保存设置</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const emit = defineEmits<{
  close: []
}>()

const appStore = useAppStore()

const handleSubmit = () => {
  appStore.saveConfigToLocal()

  if (appStore.webdavConfig.url) {
    appStore.syncStatus = '已配置WebDAV'
  } else {
    appStore.syncStatus = '本地数据'
  }

  emit('close')
  alert('WebDAV配置已保存！')
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

.form-group input {
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
</style>
