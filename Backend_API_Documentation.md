# AuraTab 后端开发技术规格说明书

## 1. 项目架构概述

虽然前端可以直接与WebDAV通信，但仍需要后端服务，原因如下：

### 1.1 CORS限制
- 浏览器同源策略限制前端直接访问用户自定义的WebDAV服务器
- 需要后端作为代理服务绕过CORS限制

### 1.2 安全考虑
- 避免在前端暴露WebDAV凭据
- 提供更安全的身份验证和授权机制

### 1.3 功能增强
- 提供配置备份和恢复功能
- 实现配置版本管理
- 提供离线数据缓存

## 2. 技术栈选型

### 2.1 开发语言与框架
- **主要语言**: Java 17+
- **核心框架**: Spring Boot 3.x
- **Web框架**: Spring MVC / Spring WebFlux
- **WebDAV客户端**: Sardine (成熟的Java WebDAV客户端库)
- **JSON处理**: Jackson (处理配置信息的序列化与反序列化)
- **HTTP客户端**: Apache HttpClient 或 Spring WebClient

### 2.2 数据库（暂时不做考虑）
### 2.3 缓存
- **Redis**: 用于会话管理和临时数据缓存

### 2.4 依赖管理
- **构建工具**: Maven 3.8+
- **包管理**: 通过Maven管理项目依赖

## 3. WebDAV代理服务设计

### 3.1 WebDAV服务类 (WebDavService)
```java
@Service
public class WebDavProxyService {
    
    /**
     * 保存配置到WebDAV服务器
     * @param userId 用户ID（如果启用用户系统）
     * @param webDavUrl WebDAV服务器地址
     * @param username 用户名
     * @param password 密码
     * @param configJson 配置JSON字符串
     * @param fileName 配置文件名
     * @throws IOException 文件操作异常
     */
    public void saveConfigToWebDav(Long userId, String webDavUrl, String username, String password, 
                                   String configJson, String fileName) throws IOException;
    
    /**
     * 从WebDAV服务器读取配置
     * @param userId 用户ID（如果启用用户系统）
     * @param webDavUrl WebDAV服务器地址
     * @param username 用户名
     * @param password 密码
     * @param fileName 配置文件名
     * @return 配置JSON字符串
     * @throws IOException 文件操作异常
     */
    public String loadConfigFromWebDav(Long userId, String webDavUrl, String username, String password, 
                                       String fileName) throws IOException;
    
    /**
     * 测试WebDAV连接
     * @param webDavUrl WebDAV服务器地址
     * @param username 用户名
     * @param password 密码
     * @return 连接测试结果
     * @throws IOException 文件操作异常
     */
    public boolean testWebDavConnection(String webDavUrl, String username, String password) throws IOException;
}
```

## 4. API接口规范

### 4.1 WebDAV配置相关接口

#### 4.1.1 测试WebDAV连接
- **URL**: `/api/webdav/test`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "url": "https://dav.jianguoyun.com/dav/",
  "username": "your_username",
  "password": "your_password"
}
```
- **Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "connected": true
  },
  "message": "连接测试成功"
}
```
- **Response Error (400/401/500)**:
```json
{
  "success": false,
  "data": {
    "connected": false
  },
  "message": "连接测试失败: 错误详情"
}
```

#### 4.1.2 保存配置到WebDAV
- **URL**: `/api/webdav/save`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "webDavUrl": "https://dav.jianguoyun.com/dav/",
  "username": "your_username",
  "password": "your_password",
  "fileName": "auratab-config.json",
  "config": {
    "folders": [
      {
        "id": "basic-bookmarks",
        "name": "基础收藏夹",
        "icon": "📁"
      }
    ],
    "bookmarks": [
      {
        "id": "1",
        "title": "百度",
        "url": "https://www.baidu.com",
        "favicon": "https://www.baidu.com/favicon.ico",
        "desc": "百度一下，你就知道",
        "folderId": "basic-bookmarks"
      }
    ],
    "webdav": {
      "url": "",
      "username": "",
      "password": ""
    }
  }
}
```
- **Response Success (200)**:
```json
{
  "success": true,
  "data": null,
  "message": "配置已成功保存到WebDAV"
}
```
- **Response Error (400/500)**:
```json
{
  "success": false,
  "data": null,
  "message": "保存失败: 错误详情"
}
```

#### 4.1.3 从WebDAV加载配置
- **URL**: `/api/webdav/load`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "webDavUrl": "https://dav.jianguoyun.com/dav/",
  "username": "your_username",
  "password": "your_password",
  "fileName": "auratab-config.json"
}
```
- **Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "folders": [
      {
        "id": "basic-bookmarks",
        "name": "基础收藏夹",
        "icon": "📁"
      }
    ],
    "bookmarks": [
      {
        "id": "1",
        "title": "百度",
        "url": "https://www.baidu.com",
        "favicon": "https://www.baidu.com/favicon.ico",
        "desc": "百度一下，你就知道",
        "folderId": "basic-bookmarks"
      }
    ],
    "webdav": {
      "url": "",
      "username": "",
      "password": ""
    }
  },
  "message": "配置加载成功"
}
```
- **Response Error (400/404/500)**:
```json
{
  "success": false,
  "data": null,
  "message": "加载失败: 错误详情"
}
```

### 4.2 配置管理接口（可选，用于缓存和版本管理）

#### 4.2.1 保存本地配置缓存
- **URL**: `/api/config/cache`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "config": {
    "folders": [...],
    "bookmarks": [...],
    "webdav": {...}
  }
}
```
- **Response Success (200)**:
```json
{
  "success": true,
  "data": null,
  "message": "配置缓存保存成功"
}
```

#### 4.2.2 获取本地配置缓存
- **URL**: `/api/config/cache`
- **Method**: GET
- **Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "folders": [...],
    "bookmarks": [...],
    "webdav": {...},
    "lastModified": "2023-01-01T00:00:00Z"
  },
  "message": "配置缓存获取成功"
}
```

## 5. 业务逻辑说明

### 5.1 WebDAV代理逻辑
1. **接收前端请求**：从前端接收WebDAV操作请求
2. **执行WebDAV操作**：后端使用Sardine库执行相应的WebDAV操作
3. **返回结果**：将WebDAV服务器响应返回给前端

### 5.2 数据库使用场景（可选）
- **缓存管理**：缓存最近的WebDAV配置以提高访问速度
- **会话管理**：存储临时会话信息
- **操作日志**：记录重要的用户操作（可选）

### 5.3 安全考虑
- 不在数据库中长期存储用户WebDAV凭据
- 使用加密方式临时处理用户凭据
- 实现适当的访问控制和速率限制

## 6. 部署方案

### 6.1 单JAR部署
- 将Spring Boot应用打包为单个JAR文件
- 使用内嵌的H2数据库（轻量级场景）
- 适用于个人部署

### 6.2 容器化部署
- 打包为Docker镜像
- 支持外部数据库连接
- 适用于多用户场景

## 7. 总结

后端在AuraTab项目中的角色是：
1. **WebDAV代理**：解决前端CORS限制
2. **安全网关**：保护用户凭据安全
3. **功能扩展**：提供缓存、版本管理等增值服务

数据库的使用是**可选的**，主要用于缓存和增强功能，而非核心功能必需。