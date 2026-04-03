[← Back to Home](../readme.md)

# Chapter 1: Linux Basics

## Learning Objectives

- Master common Linux commands for basic file operations in the terminal
- Understand how to use SSH for remote connections
- Distinguish the fundamental difference between SSR (Server-Side Rendering) and CSR (Client-Side Rendering)
- Learn the traditional server setup with Apache + PHP
- Install Node.js and successfully run your first Node.js program
- Start an HTTP server using Node.js's native `http` module

---

## 1. Basic Linux Commands

The following commands are demonstrated on a Linux virtual machine. Open a terminal and follow along.

### Directory and File Navigation

```bash
# View current directory contents
ls          # Basic listing
ls -l       # Long format, shows permissions, size, time
ls -a       # Show hidden files (starting with .)
ls -lh      # Long format + human-readable file sizes (KB/MB)

# Change directory
cd /        # Go to root directory
cd ~        # Go to current user's home directory
cd -        # Return to previous directory
cd ..       # Go up one level
cd ./subdir # Enter subdirectory using relative path

# Display current path
pwd
```

> **Absolute Path vs Relative Path**
>
> - Absolute path: starts from `/`, e.g. `/var/www/html`
> - Relative path: starts from current directory, e.g. `./html` or `../config`

### Viewing File Contents

```bash
cat file.txt        # Output the full file contents
cat -n file.txt     # Show line numbers
less file.txt       # Paginated view, press q to quit
head file.txt       # View first 10 lines
head -n 20 file.txt # View first 20 lines
tail file.txt       # View last 10 lines
tail -f file.txt    # Follow the end of a file in real time (commonly used for logs)
```

### Creating and Deleting

```bash
touch file.txt      # Create an empty file (or update its timestamp)
mkdir dir           # Create a directory
mkdir -p a/b/c      # Recursively create nested directories

rmdir dir           # Delete an empty directory
rm file.txt         # Delete a file
rm -r dir           # Recursively delete a directory and its contents
rm -rf dir          # Force recursive delete (use with caution)
```

### Copying, Moving, and Renaming

```bash
cp file.txt backup.txt      # Copy a file
cp -r dir/ dir_backup/      # Recursively copy a directory

mv file.txt /tmp/           # Move a file to /tmp/
mv old_name.txt new_name.txt # Rename a file
```

### Other Common Commands

```bash
echo "hello"        # Print text to the terminal
echo "hello" > file.txt    # Write to a file (overwrite)
echo "hello2" >> file.txt  # Write to a file (append)
whoami              # Show the currently logged-in user
uname -a            # Show full operating system information
date                # Show the current time
alias ll='ls -lh'   # Create an alias for a command
reboot              # Restart the system
poweroff            # Shut down the system
```

---

## 2. Vim Text Editor

Vim is the most commonly used terminal text editor on Linux. Mastering the basic operations is enough for everyday needs.

```bash
vim file.txt   # Open (or create) a file
```

Vim has three modes: **Normal mode** (default), **Insert mode** (editing text), **Command mode** (save/quit).

### Mode Switching

| Key   | Action                                              |
| ----- | --------------------------------------------------- |
| `i`   | Enter insert mode before the cursor                 |
| `a`   | Enter insert mode after the cursor                  |
| `o`   | Open a new line below the current line and enter insert mode |
| `Esc` | Return to normal mode                               |

### Save and Quit (Command mode, press `:` first)

| Command | Action                  |
| ------- | ----------------------- |
| `:w`    | Save                    |
| `:q`    | Quit                    |
| `:wq`   | Save and quit           |
| `:q!`   | Force quit (without saving) |

### Common Editing Operations (Normal mode)

| Key        | Action                              |
| ---------- | ----------------------------------- |
| `x`        | Delete character under cursor       |
| `dd`       | Delete entire line                  |
| `yy`       | Copy entire line                    |
| `p`        | Paste after cursor                  |
| `u`        | Undo                                |
| `Ctrl + r` | Redo                                |
| `/text`    | Search downward                     |
| `n` / `N`  | Jump to next / previous search result |

---

## 3. SSH Remote Connection

SSH (Secure Shell) is used to securely connect from your local machine to a remote Linux server.

```bash
# Basic connection
ssh username@server_ip

# Example:
ssh expert@192.168.151.128
```

Once connected, you operate as if you are at the server's terminal — all commands execute remotely.

### Enabling Root SSH Login

Linux disables direct root SSH login by default. To enable it:

```bash
# 1. Edit the SSH configuration file
sudo vim /etc/ssh/sshd_config

# Find the following line and change the value to yes:
# PermitRootLogin yes

# 2. Restart the SSH service to apply the changes
sudo systemctl restart sshd

# 3. Set the root user password
sudo passwd root

# 4. You can now log in as root
ssh root@192.168.151.128
```

---

## 4. Installing Apache + PHP

Apache is one of the most classic web servers; combined with PHP it can host a traditional server-side rendered website.

```bash
# Update the package list
sudo apt update

# Install Apache and PHP in one command
sudo apt install apache2 php libapache2-mod-php -y

# Start the Apache service
sudo systemctl start apache2

# Enable it to start on boot
sudo systemctl enable apache2

# Check service status
sudo systemctl status apache2

# Verify versions
apache2 -v
php -v
```

After installation, visit `http://server_ip` in your browser to see the Apache default welcome page.

**Apache's default website root directory is `/var/www/html`** — place HTML/PHP files here to access them through the browser.

> You can use [FileZilla](https://filezilla-project.org) to upload files to the server via the SFTP protocol.

---

## 5. SSR vs CSR

There are two mainstream page rendering approaches in web development:

|                    | SSR (Server-Side Rendering)                          | CSR (Client-Side Rendering)                                |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------------------- |
| **Where rendered** | Server                                               | Browser                                                    |
| **Typical languages** | PHP, Python, Java, Node.js                        | JavaScript                                                 |
| **When HTML is generated** | At request time; the server returns complete HTML | After the browser receives JS, the page is dynamically built by JS |
| **First load**     | Content is immediately visible                       | Must wait for JS to execute before content appears         |

### SSR Example: PHP (`codes/ssr_demo.php`)

PHP executes on the server and returns the result as complete HTML to the browser. What the browser receives is an already-rendered page — **JavaScript is not involved in rendering**.

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

Upload this file to `/var/www/html/`, then visit `http://server_ip/ssr_demo.php` in your browser. The server executes the PHP loop and directly returns three `<h1>hello world!</h1>` lines.

### CSR Example: JavaScript (`codes/csr_demo.html`)

The HTML file itself contains only an empty `<div>`. The page content is generated entirely by JavaScript running in the browser. The server only transfers the file — **rendering happens on the client side**.

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

Open this HTML file directly in a browser to see the result — no server required.

---

## 6. Installing Node.js

Node.js allows JavaScript to run outside of the browser, executing directly on a server (or local terminal).

Using nvm (Node Version Manager) is recommended for easy management of multiple Node.js versions:

```bash
# 1. Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 2. Reload shell configuration (or open a new terminal)
. "$HOME/.nvm/nvm.sh"

# 3. Install Node.js 22 (LTS version)
nvm install 22

# 4. Verify installation
node -v   # Should output v22.x.x
npm -v    # Should output 10.x.x
```

---

## 7. Running Your First Node.js Script

Node.js can execute `.js` files directly in the terminal — no browser required.

**Example code (`codes/hello.js`):**

```js
for (let i = 0; i < 3; i++) {
  console.log("hello world");
}
```

Run it in the terminal:

```bash
node codes/hello.js
```

Output:

```
hello world
hello world
hello world
```

This shows that JavaScript can now be executed from the command line just like Python or PHP — **without a browser**.

---

## 8. Starting an HTTP Server with Node.js

Node.js has a built-in `http` module that can create an HTTP server directly, without needing Apache.

**Example code (`codes/server.js`):**

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

Run it in the terminal:

```bash
node codes/server.js
```

Open your browser and visit `http://localhost:3000` to see **Hello World!**.

> The `codes/` directory contains a `package.json` (with `"type": "module"` inside), which is required for using `import` syntax.

---

## Exercises

1. SSH into the Linux server remotely (username `alex`, password `cisco`), modify the configuration to allow root SSH login, and apply the change.

2. Install Apache2 and PHP, start the Apache service, and confirm you can see the Apache default example page in your browser.

3. Write an `index.php`, upload it to the server at `/var/www/html/`, so that visiting `http://server_ip` in a browser outputs **ten lines of red "Hello PHP!"**.

4. Write a `world.html` whose body contains only a `<div>` with `id="title"`, and use JavaScript to make it display **red "Hello World!"**. After uploading to the server, it should be accessible at `http://server_ip/world.html`.

5. Install Node.js and confirm that `node -v` outputs the version number correctly.

6. In the `~` directory, create a `day2/` folder. Inside it, create `hello.js` and use `node hello.js` to print **ten lines of "Hello Node.js!"** from the command line.

7. In the `day2/` directory, create `server.js` that starts an HTTP server listening on **port 8000**. Visiting `http://server_ip:8000` should display the large heading **"Congratulations!!!"**.
