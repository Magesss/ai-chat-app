# 🔧 Cursor 编辑器 MCP 配置指南

## 📋 配置方式

### 方式一：通过 Cursor 设置界面

1. **打开 Cursor 设置**
   ```
   快捷键：Cmd + , (macOS)
   或菜单：Cursor > Preferences > Settings
   ```

2. **查找 AI/MCP 设置**
   - 在搜索框输入 "AI" 或 "Claude" 或 "MCP"
   - 查找相关的配置选项

3. **常见配置项**
   - `cursor.cpp.disabledLanguages`: 禁用特定语言的 AI 功能
   - `cursor.general.enableVisualStudioCodeCompatibility`: VS Code 兼容性
   - `cursor.ai.*`: AI 相关设置

### 方式二：通过 settings.json 配置

编辑文件：`~/Library/Application Support/Cursor/User/settings.json`

#### 基础 AI 配置
```json
{
  "cursor.ai.enabled": true,
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.ai.maxTokens": 4000,
  "cursor.ai.temperature": 0.3
}
```

#### MCP 服务器配置 (如果支持)
```json
{
  "cursor.mcp.servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/workspace"]
    }
  }
}
```

### 方式三：通过扩展配置

1. **安装 MCP 相关扩展**
   - 打开扩展面板 (`Cmd + Shift + X`)
   - 搜索 "MCP" 或 "Model Context Protocol"
   - 安装相关扩展

2. **配置扩展设置**
   - 每个扩展都有自己的配置选项
   - 在扩展详情页面查看配置说明

## 🛠️ 实用 MCP 工具

### 1. 文件系统访问
```bash
# 安装 filesystem MCP 服务器
npm install -g @modelcontextprotocol/server-filesystem
```

### 2. GitHub 集成
```bash
# 安装 GitHub MCP 服务器
npm install -g @modelcontextprotocol/server-github
```

### 3. 数据库访问
```bash
# SQLite
npm install -g @modelcontextprotocol/server-sqlite

# PostgreSQL
npm install -g @modelcontextprotocol/server-postgres
```

## 📝 配置示例

### 完整的 settings.json 示例
```json
{
  "window.commandCenter": 1,
  "terminal.integrated.enableMultiLinePasteWarning": "never",
  
  // AI 相关配置
  "cursor.ai.enabled": true,
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.ai.showCopilotTab": true,
  "cursor.ai.enableCodeActions": true,
  
  // MCP 配置 (如果支持)
  "cursor.mcp.enabled": true,
  "cursor.mcp.servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/magesss/Desktop/code"]
    }
  },
  
  // 其他有用的设置
  "editor.inlineSuggest.enabled": true,
  "editor.suggestOnTriggerCharacters": true,
  "files.autoSave": "afterDelay",
  "git.enableSmartCommit": true
}
```

## 🔍 验证配置

### 检查 AI 功能是否正常
1. 在代码文件中按 `Cmd + K` 打开 AI 命令面板
2. 尝试生成代码或解释代码
3. 查看是否有 MCP 工具可用

### 调试 MCP 连接
1. 打开开发者工具：`Help > Toggle Developer Tools`
2. 查看 Console 中的 MCP 相关日志
3. 检查网络请求和错误信息

## ⚠️ 注意事项

1. **版本兼容性**：不同版本的 Cursor 对 MCP 的支持可能不同
2. **权限设置**：确保 MCP 服务器有必要的文件访问权限
3. **API 密钥**：妥善保管 GitHub Token 等敏感信息
4. **网络连接**：MCP 服务器需要稳定的网络连接

## 🆘 常见问题

### Q: Cursor 不显示 MCP 选项？
A: 检查 Cursor 版本，较老版本可能不支持 MCP

### Q: MCP 服务器连接失败？
A: 检查网络连接、API 密钥和服务器配置

### Q: 如何查看 MCP 日志？
A: 打开开发者工具查看 Console 输出

## 🔗 相关资源

- [Cursor 官方文档](https://cursor.sh/docs)
- [MCP 官方规范](https://modelcontextprotocol.io/)
- [MCP 服务器列表](https://github.com/modelcontextprotocol)
