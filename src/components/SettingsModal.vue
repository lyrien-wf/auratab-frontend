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
  background: rgba(59, 53, 87, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--color-surface);
  padding: 0;
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 480px;
  box-shadow: var(--shadow-xl);
  animation: modalopen 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--color-border-light);
}

@keyframes modalopen {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  padding: 24px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.close-btn:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.modal-body {
  padding: 0 24px 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.form-group input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-bg-warm);
  box-sizing: border-box;
  outline: none;
  transition: var(--transition-normal);
}

.form-group input::placeholder {
  color: var(--color-text-muted);
}

.form-group input:focus {
  border-color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: 0 0 0 3px rgba(124, 111, 234, 0.12);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-primary {
  padding: 10px 20px;
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

.btn-secondary {
  padding: 10px 20px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: var(--transition-normal);
}

.btn-secondary:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
