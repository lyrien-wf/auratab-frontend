export interface Bookmark {
  id: string
  title: string
  url: string
  desc: string
  folderId: string
}

export interface Folder {
  id: string
  name: string
  icon: string
}

export interface WebDAVConfig {
  url: string
  username: string
  password: string
}

export interface AppConfig {
  folders: Folder[]
  bookmarks: Record<string, Bookmark[]>
  webdav: WebDAVConfig
}
