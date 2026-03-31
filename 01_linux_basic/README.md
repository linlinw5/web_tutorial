[← 返回首页](../readme.md)

# 第 1 章：Linux 基础

## 课程目标

- 掌握常用 Linux 命令，能在终端中完成基本的文件操作
- 理解 SSH 远程连接的使用方式
- 区分 SSR（服务端渲染）与 CSR（客户端渲染）的本质差异
- 了解 Apache + PHP 的传统服务器搭建方式
- 安装 Node.js，成功运行第一个 Node.js 程序
- 使用 Node.js 原生 `http` 模块启动一个 HTTP 服务器

---

## 一、Linux 基础命令

以下命令在 Linux 虚拟机上进行演示，请打开终端跟随操作。

### 目录与文件导航

```bash
# 查看当前目录内容
ls          # 基本列表
ls -l       # 长格式，显示权限、大小、时间
ls -a       # 显示隐藏文件（以 . 开头）
ls -lh      # 长格式 + 人类可读的文件大小（KB/MB）

# 切换目录
cd /        # 进入根目录
cd ~        # 进入当前用户的 home 目录
cd -        # 返回上一个所在目录
cd ..       # 进入上一级目录
cd ./子目录  # 相对路径进入子目录

# 显示当前所在路径
pwd
```

> **绝对路径 vs 相对路径**
>
> - 绝对路径：从 `/` 出发，例如 `/var/www/html`
> - 相对路径：从当前目录出发，例如 `./html` 或 `../config`

### 查看文件内容

```bash
cat file.txt        # 输出文件全部内容
cat -n file.txt     # 显示行号
less file.txt       # 分页查看，按 q 退出
head file.txt       # 查看前 10 行
head -n 20 file.txt # 查看前 20 行
tail file.txt       # 查看后 10 行
tail -f file.txt    # 实时追踪文件末尾（常用于查看日志）
```

### 创建与删除

```bash
touch file.txt      # 创建空文件（或刷新文件的时间戳）
mkdir dir           # 创建目录
mkdir -p a/b/c      # 递归创建多级目录

rmdir dir           # 删除空目录
rm file.txt         # 删除文件
rm -r dir           # 递归删除目录及其内容
rm -rf dir          # 强制递归删除（谨慎使用）
```

### 复制、移动与重命名

```bash
cp file.txt backup.txt      # 复制文件
cp -r dir/ dir_backup/      # 递归复制目录

mv file.txt /tmp/           # 移动文件到 /tmp/
mv old_name.txt new_name.txt # 重命名文件
```

### 其他常用命令

```bash
echo "hello"        # 在终端输出文本
echo "hello" > file.txt    # 向文件中写入信息（覆盖）
echo "hello2" >> file.txt  # 向文件中写入信息（追加）
whoami              # 显示当前登录用户
uname -a            # 显示操作系统完整信息
date                # 显示当前时间
alias ll='ls -lh'   # 为命令创建别名
reboot              # 重启系统
poweroff            # 关机
```

---

## 二、Vim 文本编辑器

Vim 是 Linux 下最常用的终端文本编辑器，掌握基本操作即可应对日常需求。

```bash
vim file.txt   # 打开（或新建）文件
```

Vim 有三种模式：**普通模式**（默认）、**插入模式**（编辑文字）、**命令模式**（保存/退出）。

### 模式切换

| 按键  | 操作                               |
| ----- | ---------------------------------- |
| `i`   | 在光标前进入插入模式               |
| `a`   | 在光标后进入插入模式               |
| `o`   | 在当前行下方新起一行并进入插入模式 |
| `Esc` | 返回普通模式                       |

### 保存与退出（命令模式，先按 `:`）

| 命令  | 操作               |
| ----- | ------------------ |
| `:w`  | 保存               |
| `:q`  | 退出               |
| `:wq` | 保存并退出         |
| `:q!` | 强制退出（不保存） |

### 常用编辑操作（普通模式）

| 按键       | 操作                          |
| ---------- | ----------------------------- |
| `x`        | 删除光标处字符                |
| `dd`       | 删除整行                      |
| `yy`       | 复制整行                      |
| `p`        | 粘贴到光标后                  |
| `u`        | 撤销                          |
| `Ctrl + r` | 重做                          |
| `/text`    | 向下搜索                      |
| `n` / `N`  | 跳转到下一个 / 上一个搜索结果 |

---

## 三、SSH 远程连接

SSH（Secure Shell）用于从本机安全地连接到远程 Linux 服务器。

```bash
# 基本连接
ssh 用户名@服务器IP

# 示例：
ssh expert@192.168.151.128
```

连接后就像在服务器的终端里操作，所有命令都在远程执行。

### 开启 root 用户 SSH 登录

Linux 默认禁止 root 用户通过 SSH 直接登录，如需开启：

```bash
# 1. 编辑 SSH 配置文件
sudo vim /etc/ssh/sshd_config

# 找到下面这行，将值改为 yes：
# PermitRootLogin yes

# 2. 重启 SSH 服务使配置生效
sudo systemctl restart sshd

# 3. 修改 root 用户密码
sudo passwd root

# 4. 之后即可用 root 登录
ssh root@192.168.151.128
```

---

## 四、安装 Apache + PHP

Apache 是最经典的 Web 服务器之一，配合 PHP 可以搭建传统的服务端渲染网站。

```bash
# 更新软件包列表
sudo apt update

# 一键安装 Apache 和 PHP
sudo apt install apache2 php libapache2-mod-php -y

# 启动 Apache 服务
sudo systemctl start apache2

# 设置开机自启
sudo systemctl enable apache2

# 查看服务状态
sudo systemctl status apache2

# 验证版本
apache2 -v
php -v
```

安装完成后，在浏览器访问 `http://服务器IP` 即可看到 Apache 默认欢迎页面。

**Apache 的默认网站根目录为 `/var/www/html`**，将 HTML/PHP 文件放到这里即可通过浏览器访问。

> 可以使用 [FileZilla](https://filezilla-project.org) 通过 SFTP 协议向服务器上传文件。

---

## 五、SSR vs CSR

Web 开发中有两种主流的页面渲染方式：

|                   | SSR（服务端渲染）                | CSR（客户端渲染）                    |
| ----------------- | -------------------------------- | ------------------------------------ |
| **渲染位置**      | 服务器                           | 浏览器                               |
| **典型语言**      | PHP、Python、Java、Node.js       | JavaScript                           |
| **HTML 生成时机** | 请求时，服务器生成完整 HTML 返回 | 浏览器收到 JS 后，由 JS 动态生成页面 |
| **首次加载**      | 内容直接可见                     | 需等待 JS 执行完才显示内容           |

### SSR 示例：PHP（`codes/ssr_demo.php`）

PHP 在服务器上执行，将结果以完整 HTML 的形式返回给浏览器。浏览器收到的就是已经渲染好的页面，**JavaScript 不参与渲染**。

```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SSR Demo</title>
</head>
<body>
    <?php
    for ($i = 0; $i < 3; $i++) {
        echo "<h1>hello world!</h1>";
    }
    ?>
</body>
</html>
```

将此文件上传到 `/var/www/html/`，浏览器访问 `http://服务器IP/ssr_demo.php`，服务器执行 PHP 循环，直接返回三行 `<h1>hello world!</h1>`。

### CSR 示例：JavaScript（`codes/csr_demo.html`）

HTML 文件本身只有一个空的 `<div>`，页面的内容完全由浏览器中的 JavaScript 生成。服务器只负责传输文件，**渲染发生在浏览器端**。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CSR Demo</title>
  </head>
  <body>
    <div id="title"></div>
    <script>
      window.alert("hello world");

      const title = window.document.getElementById("title");
      title.innerHTML = "<h1>Hello World!</h1>";
      title.style.color = "red";
      title.style.fontSize = "100px";
    </script>
  </body>
</html>
```

直接在浏览器中打开这个 HTML 文件即可看到效果，无需服务器。

---

## 六、安装 Node.js

Node.js 让 JavaScript 可以脱离浏览器运行，直接在服务器（或本机终端）执行。

推荐使用 nvm（Node Version Manager）安装，方便管理多个 Node.js 版本：

```bash
# 1. 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 2. 重新加载 shell 配置（或重开终端）
. "$HOME/.nvm/nvm.sh"

# 3. 安装 Node.js 22（LTS 版本）
nvm install 22

# 4. 验证安装
node -v   # 应输出 v22.x.x
npm -v    # 应输出 10.x.x
```

---

## 七、运行第一个 Node.js 脚本

Node.js 可以直接在终端执行 `.js` 文件，完全不需要浏览器。

**示例代码（`codes/hello.js`）：**

```js
for (let i = 0; i < 3; i++) {
  console.log("hello world");
}
```

在终端中运行：

```bash
node codes/hello.js
```

输出：

```
hello world
hello world
hello world
```

这说明 JavaScript 已经可以像 Python、PHP 一样在命令行中执行，**不依赖浏览器**。

---

## 八、用 Node.js 启动 HTTP 服务器

Node.js 内置 `http` 模块，可以直接创建一个 HTTP 服务器，无需安装 Apache。

**示例代码（`codes/server.js`）：**

```js
import { createServer } from "http";

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello World!</h1>");
  res.end();
});

server.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
```

在终端中运行：

```bash
node codes/server.js
```

打开浏览器访问 `http://localhost:3000`，即可看到 **Hello World!**。

> `codes/` 目录下有 `package.json`（内含 `"type": "module"`），这是使用 `import` 语法所必需的配置。

---

## 课后练习

1. 远程 SSH 到 Linux 服务器（用户名 `alex`，密码 `cisco`），修改配置允许 root 用户 SSH 登录并使之生效。

2. 安装 Apache2 和 PHP，启动 Apache 服务，确认能在浏览器中访问到 Apache 默认示例页面。

3. 编写一个 `index.php`，上传到服务器 `/var/www/html/`，要求通过浏览器访问 `http://服务器IP` 时能输出**十行红色的 "Hello PHP!"**。

4. 编写一个 `world.html`，body 部分只包含一个 `id="title"` 的 `<div>`，使用 JavaScript 让它显示出**红色的 "Hello World!"**。上传到服务器后可通过 `http://服务器IP/world.html` 访问。

5. 安装 Node.js，确认 `node -v` 能正常输出版本号。

6. 在 `~` 目录下新建 `day2/` 目录，在其中创建 `hello.js`，使用 `node hello.js` 在命令行中输出**十行 "Hello Node.js!"**。

7. 在 `day2/` 目录下创建 `server.js`，启动一个监听在 **8000 端口**的 HTTP 服务器，访问 `http://服务器IP:8000` 时显示大标题 **"Congratulations!!!"**。
