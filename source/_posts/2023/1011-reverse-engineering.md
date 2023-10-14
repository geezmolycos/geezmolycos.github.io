---
title: 像维修衣服、家具一般维修电脑软件——逆向工程魔改软件的基础认知和工具推荐
author: geezmolycos
categories:
  - real
tags:
  - tech
  - 软件
  - 逆向工程
lang: zh-cmn-hans-cn
date:    2023-10-11 16:09:01
updated: 2023-10-15 01:14:58
---

~[（文章没有直接使用生成式AI辅助创作）]

## 前言

**太长不看版：**
为了更适合自己的需要，怎么用逆向工程的方式小幅修改电脑软件特性？这篇文章写了应该怎么判断电脑软件的架构、语言；怎么针对特定架构和语言制定逆向工程的方式，选择合适的工具；如何执行逆向工程修改的大概思路。还有上述过程需要的一些基础认知。

---

电脑软件在很多对电脑软件了解少~[* 即使对电脑了解多的人，也不一定对电脑软件了解多。我也不敢乱说我对电脑软件了解多，这里只是一种相对的说法]的人看来，就像一个黑箱子一样。它内部的工作方式很不透明，很难被用户察觉到。尤其是现在软件的抽象层次越来越高（不是说网络流行的那种「抽象」，而是说使用的中间层、框架等越来越多），就更难让普通用户认清它的工作方式。

我们买衣服、家具，很清楚它们的工作原理，也很容易维修，这两个例子都是工作方式很简单的物品。衣服如果破了一个洞，可以拿针线花一些时间和劳动力把它补上；桌子椅子坏了，可以用钉子、胶带、或者垫子补一下，就又能用了。如果衣服不合适，也可以拿到裁缝店，或者自己改一下，让物品更满足自己的需要。而电脑软件好像不能这样，或者对一般人来说，修改起来很难，但是我会根据我的经验，提供一些基础认知，还有方法指导，让电脑软件也有机会被魔改，就像裁裤边一样，能够改得更好的满足自己的需要。

这篇文章也适用于开源软件，开源软件虽然源代码可以自由获取，但是有的时候，普通用户难以搭建起编译环境，还会遇到各种错误，这些因素会导致软件生成失败，因此难以通过自己修改代码、自己编译来修复软件问题，或添加（删除）自己想要的功能。通过逆向工程，可以更快速解决问题。（参考根据修改后的图纸重新建一座房子，还有修补现有房子的区别）

理论上，这些方法也可以用于破解软件，但是作者不支持违反当地法律和相关规定，在逆向工程前，要看好软件的使用协议还有当地的法律法规，不要违法。文章中的例子涉及的软件协议均没有禁止逆向工程，而且这些例子也没有破坏软件或计算机系统，只是用于修改特性满足自己需要。

<!-- more -->

## 面向的操作系统

因为我接触 Windows 操作系统上的软件最多，这篇文章写的也大多是关于 Windows 软件的。但是因为网络应用（JavaScript, TypeScript, WebAssembly 等）、一些高级语言和框架（Python, Java, .net, Node.js 等）是跨平台的，也会介绍这些，应该也适用于其他桌面端操作系统（就是电脑操作系统）的。桌面端操作系统，Mac OS 相对封闭，商业化的软件很多，对这种个人小修补不太友好。其他的操作系统上高级语言和框架应该也有类似的工具可以用，操作方法也差不多，但是需要自己找一找。

移动端操作系统（Android, iOS）因为软件封装得比较厉害（软件以应用商店分发，文件系统隔离，软件升级需要签名匹配等），市场上的手机给用户的权限小（比如 Huawei 不能解锁 Bootloader 刷入自己的系统，Xiaomi 手机解锁 Bootloader 需要申请。手机不刷机获取 root 用户权限难），所以移动端应用逆向工程不容易。移动端也没有像 chrome devtools 这种方便的前端调试工具，国产系统内置浏览器也不提供安装扩展/用户脚本的功能^[可以使用[via浏览器](https://viayoo.com/zh-cn/)加载用户脚本]，所以在移动端逆向网络应用也麻烦。所以你至少需要有一台电脑。

## 做出决定前

在决定「我要逆向工程，自己添加或删除功能」以前，要知道电脑软件工作起来都比较复杂。有时候，你想达到的目的可以有更简单的解决方法，可以先考虑一下这些方法（难度由低到高）：

1. 换一个能达到你的目的的软件
2. 在现有的软件设置里面修改设置，达到你的目的
3. 如果你的软件支持扩展程序或插件
   a. 如果软件有扩展程序市场，在市场里找一个能达到你目的的扩展程序
   b. 在网上搜索，找一个能达到你目的扩展程序（你需要学习这个软件怎么手动安装扩展程序）
   c. 自己查看扩展程序API，编写一个达到目的的扩展程序
4. 在网上搜索专门为这个软件设计的第三方软件或补丁
   - 例如为修改 `Minecraft` 游戏设计的 `fabric` 模组加载器
5. 如果软件是开源软件，尝试搭建构建（编译）环境，修改源码，实现你想要的功能
   - 一般来说，可以在软件网站上面找到 github/gitlab/sourceforge 等网站的项目链接，可以在这些网站里下载源码
   - 可以在上述网站项目主页的 readme 中找到软件的文档还有编译方式
   - github 上有 github actions，可以用 github 的服务器自动构建软件，可以参考 github actions 的配置(在项目`.github`目录下)在本地搭建环境；也可以 fork 后直接修改，让 github actions 自动生成软件的可执行文件。
     - 点击 `Actions` 项，打开最新的 workflow run，其中会根据配置文件生成 `artifacts`，可以直接下载，获取软件的可执行文件(需要登录 github)。

在考虑完上述所有方法后，还有一些难度不定的解决方法：

- 在开源软件平台（如 github/gitlab）的该软件项目主页上提交工单（issue），请求开发者实现功能或修复错误
- 向开发者发送邮件，请求开发者帮助
- 在相关论坛中请求其他用户或开发者的帮助
- 向别人付钱或给于别人好处，请别人帮忙解决（一定要谦虚）

如果第一部分的方法均不适用于你的情况，而经过评估以后你认为自己修改起来比第二部分的方法要容易，那么你可以继续遵循下文的思路，开始着手逆向工程，修改软件。

## 修改

### 判断软件架构，编程语言

现在你决定了要真正逆向工程，修改软件。取决于你要达到的目标，还有软件的架构~[* 这里说的是总体的设计，包括语言、所用的框架等，不光指软件二进制文件的目标 CPU 架构]，真正修改起来难度差别比较大。有的目标较容易达成，例如更改软件程序的图标，有的目标较难达成，例如修改软件的颜色、按钮、字体样式等。首先需要先考察一下软件是怎么组成的，使用的是什么编程语言，这样才能明确你达成目标需要怎么做。

### 判断本地或网络应用

刚开始，先要进行简单的判断，观察一下目标软件是本地应用或网络应用，这个过程很简单。如果软件不需要下载，也不需要安装，在浏览器里面打开链接就可以直接使用，那它就是网络应用，否则是本地应用~[* 这里将 Node.js 这种利用网络技术栈，或 Electron 本质上运行在浏览器引擎内的，也归为本地应用]。

{% note info %}
有的软件虽然是本地应用，但它利用网页作为 GUI。这些软件使用的时候，需要用浏览器打开本地（localhost, 127.0.0.1, [[::1]](https://en.wikipedia.org/wiki/IPv6_address) 等地址）的一个网页来操作，但是仍然需要下载（或安装），它在电脑上运行，必须要依靠本地运行的进程，因此也是本地应用。
{% endnote %}
^[如 [ActivityWatch](https://activitywatch.net/)]

### 修改本地应用

本地应用因为编程语言众多，时代跨度大，每种情况有不同的修改方法。

#### 确定几个目录

基于 Windows 安装程序安装的一些惯例，可以先找到目标软件的一些目录：

- **软件安装目录**，一般可在 `Program Files`/`Program Files (x86)` 找到。如果是给本用户安装的，可以在 `%LocalAppData%\Programs` 下找到（例如 `C:\Users\<你的用户名>\AppData\Local\Programs`）
  - 有些软件的安装目录的文件夹是软件名字，有些软件的文件夹会放到公司名文件夹中，也可以用下一条的方法寻找
  - 可以通过任务管理器找到，打开软件，在任务管理器中右键点击该程序，选择「打开文件位置」
  - 保存软件的可执行程序，还有资源文件等
- **AppData 目录**，在 `%appdata%` 中（例如 `C:\Users\<你的用户名>\AppData`），有三个文件夹，`Local`, `LocalLow`, `Roaming`，软件的 AppData 目录在三个文件夹中的一个或多个文件夹中都可能存在（也可能没有）
  - 这些目录一般会保存当前用户下，软件的配置还有数据
- **ProgramData 目录**，该目录在 Windows 安装盘的 `ProgramData` 文件夹下
  - 一般保存所有用户的软件配置和数据
  - 较少软件会使用这个目录
- **本用户目录**，一些软件会在用户目录下存储配置，即 `C:\Users\<你的用户名>` 下可能有软件名字的文件夹，或软件名字前加`.`
- **Documents 目录**，一些软件会在用户「文档」文件夹下储存配置和运行产生的文件
- **用户临时目录**，即 `%temp%`，例如`C:\Users\<你的用户名>\AppData\Local\Temp`，软件可能会在运行时产生临时文件，会保存到这个目录中，或保存到目录里面的一个文件夹中。这个目录中一般有不同软件产生的大量文件，可以按时间排序，方便查找

以及一些注册表（Registry）位置（使用 regedit 打开注册表编辑器）：

- **本用户注册表目录**：
  - `HKEY_CURRENT_USER\SOFTWARE\<软件名>`
  - `HKEY_CURRENT_USER\SOFTWARE\WOW6432Node\<软件名>`
- **所有用户注册表目录**：
  - `HKEY_LOCAL_MACHINE\SOFTWARE\<软件名>`
  - `HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\<软件名>`

{% note warning %}
修改这些位置的文件时要小心，防止影响其他软件的配置。在修改注册表时要防止不小心删除关键的项目，以免搞坏电脑或者损失数据。
{% endnote %}

{% note %}
**例**：
- [Blender] 可能的安装目录：`C:\Program Files\Blender Foundation\Blender\<Blender版本>`
- AppData 目录：`C:\Users\<你的用户名>\AppData\Roaming\Blender Foundation\Blender\<Blender版本>`

- [OpenSSH] 的本用户配置文件目录：`C:\Users\<你的用户名>\.ssh`

[Blender]: https://www.blender.org/
[OpenSSH]: https://github.com/PowerShell/Win32-OpenSSH
{% endnote %}

#### 确定要修改什么类型的文件

首先应该大致判断你要修改的目标，你想要的功能需要修改什么类型的文件才能达成。这里我给出了三种文件，可以通过经验判断，为了达成目标，最有可以要修改哪种文件（从易到难）。

- **配置文件**：这类文件在软件使用过程中可以变动，存储软件的配置信息或使用产生的数据。
  - 一些软件，在设置界面设置不了的东西，配置文件（或注册表配置项）里面可以修改
  - 可供寻找的位置（从最可能到最不可能）：
    - **AppData 目录**
    - **本用户注册表目录**/**所有用户注册表目录**
    - 其他相关目录
  - `config`/`settings`/`preference` 等目录或文件名，扩展名可能为 `.conf`/`.config`/`.cfg`/`.ini`/`.json`/`.yaml`/`.toml`/`.txt`/`.xml`等
- **资源文件**：这类文件在软件使用过程中不会变动，安装时就已经存在，或是初次运行时下载。
  - 如果要修改软件里的图片、图标、音乐、音效，还有部分软件的文本内容、字体，可以考虑修改资源文件
  - 资源文件可以是很多独立的文件，也可以是许多资源文件打包成一个文件包，还可以是嵌入到可执行程序或 dll 文件中的
  - 一般位于**软件安装目录**中
- **可执行文件**：这类文件是可执行程序，或 dll 动态链接库中的代码部分，或者（例如 Java）字节码文件，或（例如 lua）源码文件，安装时就已存在
  - 在软件本身没有提供配置的情况下，修改程序的逻辑，一般就要修改可执行文件，不同的语言有不同的方法，下面有详细说明
  - 一般位于**软件安装目录**中，原生(`.exe`/`.dll`)，Java包(`.jar`)，Java类(`.class`)，部分语言源码(`.js`/`.py`等)

#### 查看日志

日志是开发人员为了便于排除错误和调试，让软件输出的一些运行的信息。如果什么出错了，一般会输出到日志中。日志经常以 `.log` 或 `.txt` 作为扩展名。

有的软件日志固定输出到一个文件，每次运行时覆盖。有的软件会保存多个不同时间的日志。日志一般可以在**AppData 目录**或**用户临时目录**找到。

日志里一般是按行输出的，一次输出一行或者几行，而且一般会有日期，还有日志级别（类似 debug/info/warning/error/fatal，重要程度由低到高）。可以由此判断你修改的配置文件/资源文件等有没有出问题。

#### 修改配置文件

相对简单，找有没有你想要修改的，但是程序里面不能直接修改的配置项，看个人经验，看设置的名字，查找互联网的信息等等。

可能用到的方便工具：
- 文本编辑器
  - [Notepad3](https://github.com/rizonesoft/Notepad3)：免费；简单，启动迅速，贴近系统原生样式，高性能；不支持插件
  - [Notepad2-zufuliu](https://github.com/zufuliu/notepad2)：notepad2 的一个 fork
  - [Sublime Text](https://www.sublimetext.com/)：收费，但可以无限试用。样式丰富，支持插件
  - [Notepad++](https://github.com/notepad-plus-plus/notepad-plus-plus)：启动较迅速，但技术和风格均较古老；支持插件。开发者在官方网站上有较强的政治观点和偏好，请自己评判
  - [VSCodium](https://github.com/VSCodium/vscodium)：[VS Code](https://github.com/microsoft/vscode) 无微软服务（无 telemetry）的编译版。启动慢，功能强大，支持扩展。重量级，可以作为 IDE 使用
- 十六进制编辑器
  - [HxD](https://mh-nexus.de/en/hxd/)：简单，启动快
  - [ImHex](https://github.com/WerWolv/ImHex)：功能强大，但启动较慢，而且软件比较新，仍在持续开发中，可能不稳定

一些常见的配置文件格式的参考：
- INI
  - 扩展名有时也会是 `.cfg`/`.conf`
  - 由若干个节(Section)组成，每个节中有若干个键(key/property)
  - 技术比较古老的程序，或者比较简单的配置文件，经常用这种格式
  - [维基百科](https://en.wikipedia.org/wiki/INI_file)
- XML
  - 以尖括号引用的内容作为标签名，标签可以嵌套
  - Java，.net (C#) 等比较多使用，现在不太常用
  - [维基百科](https://en.wikipedia.org/wiki/XML)
- JSON
  - 广泛使用
  - JSON 可以使用在线格式化（[例](https://jsonformatter.org/)）工具格式化（让它更整齐，以便修改）
  - JSON 支持在字符串内用 Unicode 转义序列表示不便直接输入的字符，可以使用在线转换工具（[例](https://dencode.com/en/)）
  - [W3Schools的简介和教程](https://www.w3schools.com/js/js_json_intro.asp)
  - [维基百科](https://en.wikipedia.org/wiki/JSON)
  - [规范](https://www.json.org/json-en.html)
- YAML
  - 出现比较晚，使用的比较少
  - yaml 区分缩进，不能使用 tab 缩进，只能使用空格。可以开启文本编辑器显示空白字符（如 Notepad3 的 View -> Show Blanks）查看区别。可以开启转换 tab 成空格。
  - [runoob 教程](https://www.runoob.com/w3cnote/yaml-intro.html)；[阮一峰教程](https://www.ruanyifeng.com/blog/2016/07/yaml.html)
  - [维基百科](https://en.wikipedia.org/wiki/YAML)
  - [规范](https://yaml.org/)

{% note %}
此处应该有例子，但现在没有
{% endnote %}

#### 修改资源文件

资源文件可以是独立文件，或许多资源文件打包为一个文件，或嵌入到 `.exe` 或 `.dll` 文件中的。对独立文件来说，可以直接修改，其他两种就要先提取出资源文件，找到需要修改的，修改完成后重新打包或嵌入。修改资源文件，如图像文件、音频文件、语言（文本），只需要选择合适的工具，是比较直接的过程。这里主要分析对于打包的文件，或嵌入的文件，怎么提取并重新打包。

**打包的文件**，既有通用的压缩/归档文件格式，也有一些专有文件格式（以游戏使用较多）。对于普通的压缩/归档文件格式，这里列出几种还有他们的特征。有一些文件可能修改了扩展名，但其文件格式就是这些格式。这些打包的文件可以通过文件大小（资源文件一般占软件大小的大多数，如果有一个很大的文件，应该就是资源包）、文件头的特征（可以使用十六进制编辑器看）推断。应该也可以用一些工具来识别（我没有主动寻找过这种工具）

- zip
  - 一般扩展名为 `.zip`
  - 值得一提的是，[许多文件类型](https://www.youtube.com/watch?v=xGXTy_mwQZY)都使用 zip 文件格式，只是扩展名改变了。例如 `.docx`/`.xlsx`/`.pptx`/`.apk`/`.jar` 等
  - 文件头前两个字节为 `0x50 0x4b`（对应 ASCII 字符为 `PK`）
- tar
  - 一般扩展名为 `.tar`（`.tar.gz`/`.tgz` 不是`.tar` 文件，而是 `gzip` 压缩后的 `tar` 文件）
  - 文件头第一个元素是内含第一个文件的文件名，长度固定，因此，后面会有很多 `0x00` 来补充位置，从这一点可以看出是 `tar` 文件
- gzip
  - 只能压缩单个文件 (一般为 `.gz`)，因此压缩多个文件的话需要先用类似 `tar` 的工具打包，再压缩，文件名以 `.tar.gz` 结尾
  - 文件头为前两个字节为 `0x1f 0x8b`

游戏的资源文件包，通常可以用对应游戏框架的解包工具（官方提供或第三方编写，注意可疑的下载站点可能存在的病毒）解包。例如 RPG Maker, Gamemaker studio, Ren'py 制作的游戏均有工具解包。（请注意尊重作者版权）

**嵌入到 `.exe` 或 `.dll` 中的资源文件**，常见于技术较古老的软件中。这种资源文件储存在 PE 文件 (指 Windows 的可执行文件)的[`.rsrc` 段(section)](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#the-rsrc-section)中。这种方式可以用来存储文本、（windows原生）窗口的控件和文本、图标和工具栏图标等资源文件。

通过 [Detect It Easy](https://github.com/horsicq/Detect-It-Easy) 可以检测 PE 文件的结构，包括其中的段，内存映射，搜索字符串，反汇编，查壳等。有部分较老的教程可能会推荐使用 PEiD 检测 PE 文件还有查找壳(packer，用来压缩 PE 文件大小，或加密 PE 文件防止破解)，但这个软件非常古老，已经停止维护，对较新的软件检测结果可能不准确，因此我推荐使用较新的 Detect It Easy。

可以使用 [Resource Hacker](https://angusj.com/resourcehacker/) 这个工具提取和编辑这些文件。对 win32 编程的了解有助于理解这些资源文件（尤其是描述窗口的语法）的格式，还有怎么编辑，但 Resource Hacker 的 GUI 界面已经很易用了。如果不用 Resource Hacker，部分压缩软件也可以提取这些文件（直接用压缩软件打开 `.exe` 或 `.dll` 文件），但是我不确定是否能重新打包。

修改**普通资源文件**，有一些常见的工具，例如：

- 上述修改配置文件所用的十六进制编辑器和文本编辑器，这些工具在许多地方都好用
- 修改图片
  - Windows 自带的小画家(画图)程序，但不支持图层，功能较简单
  - [XnView](https://www.xnview.com/en/)：其实是图像查看器，但支持很多图像格式，可以方便地转换图像格式
  - [Paint.NET](https://www.getpaint.net/)：简单易用，支持图层
  - [GIMP](https://www.gimp.org/)：历史较长，功能强大
  - [Krita](https://krita.org/en/)：较新，主要用于绘画，但图像编辑功能也强大，不同颜色模式的支持好
  - [Inkscape](https://inkscape.org/)：主要用于矢量（向量）图绘制，可以用来设计图标
  - [Aseprite](https://www.aseprite.org/)：主要用作像素绘画，开源收费软件，自己编译允许自己使用
- 修改音频
  - [Audacity](https://www.audacityteam.org/)：功能完善，之前有一次[隐私政策改变的事件](https://www.youtube.com/watch?v=QfmDn1IaDmY)，但是现在可以放心使用
  - [Tenacity](https://codeberg.org/tenacityteam/tenacity)：经历上述事件后的 Audacity 的一条分支，与 Audacity 相比各有优劣
- 修改视频
  - [Kdenlive](https://kdenlive.org/en/)：免费自由软件，视频剪辑处理用
  - [FFmpeg](https://ffmpeg.org/)：功能丰富的视频格式转换和处理工具（也可以用来处理音频和图片），但需要学习命令行操作

#### 修改可执行文件

可执行文件包含软件运行的代码，可以是高级语言**源代码**（如 JavaScript），也可以是高级语言编译后的**虚拟机字节码**（如 Java），也可以是面向指定架构和指令集的二进制**机器代码**。一般，`.exe` 和 `.dll` 文件存放二进制机器代码，其他形式的可执行文件按语言的不同，有各自的文件类型还有存储方式。

要修改可执行文件，首先需要观察软件的语言，一些高级语言必须由**源代码**运行，这些软件的可执行文件就由源代码组成，例如 JavaScript、Python、Lua。这些语言易于修改，易于调试，通常可以使用现有的调试工具连接到运行的程序中（如使用 Chrome devtools 连接 Node.js），但这些软件不便于使用机器代码调试器（即一般的软件逆向工程提到的调试器，OllyDbg, x64dbg等）调试。这类语言也便于修改，调试结束以后直接把修改保存到对应的文件就可以了。因为其相对简单，下面不再讨论直接修改源代码的技术和工具，只要学会对应语言，懂得看别人的项目，就可以修改这些代码，而且这类软件能发布代码，也基本上会在网络上公开代码，大都是开源软件。

另外一些高级语言为了兼顾性能和可移植性，将软件的可执行文件以**字节码**的形式分发，运行在该语言的**虚拟机**上。这些软件的可执行文件是字节码，通过解释(interpretation)或二次编译(compilation)到机器代码的方式执行程序。这类语言流行的有 Java, C# 等，通常有单独针对这些语言的字节码反汇编器，或者调试器。下面会讨论 Java, C#(.net 平台语言)，以及 ActionScript(Adobe Flash 所采用的语言)。

较传统和古老的语言，如 Visual Basic，以及较底层的语言，例如C/C++，会直接编译为指定架构的**机器代码**，这种代码会直接加载到内存供CPU直接执行，这种代码修改起来最难，也有专门的工具分析修改这些代码，较传统的逆向工程指的就是这种代码。下面会详细讨论。

##### 修改 Java 类文件

Java 语言是一种编译为 **Java 字节码**的语言，字节码运行在 **Java 虚拟机**上。多个方法(method)还有其他信息组成一个类(class)，许多类按命名空间层级组成一个包(package)。编译好的类文件扩展名为`.class`，打包的包文件扩展名为`.jar`

针对 Java 的反汇编器（也是反编译器）现在较新的有 [Recaf](https://github.com/Col-E/Recaf)，可以直接重新编译修改的代码，也可以修改字节码。在 Recaf 之前，还有一款叫做 [JD-GUI](http://java-decompiler.github.io/) 的反汇编及反编译器，一些旧教程可能会推荐这款工具。它现在已经停止更新，且不支持直接修改，因此我不推荐使用。

虽然 Recaf 也支持直接修改反编译的 Java 代码，但是有时候反编译和重新编译也会出错。有时候也会要通过修改字节码来修改 Java 程序。要修改 Java 字节码，就需要了解 Java 虚拟机的工作方式，而且要获取 Java 虚拟机的指令集参考文档。[Java 虚拟机的最新文档](https://docs.oracle.com/javase/specs/index.html)包含有 Java 虚拟机的[指令集参考文档](https://docs.oracle.com/javase/specs/jvms/se20/html/jvms-6.html)。而 Java 虚拟机的工作方式，网上可以找到许多讲解的资料。

##### 修改 C# (.net)

C# 是一种编译成 [.net 框架中间语言(IL)](https://en.wikipedia.org/wiki/Common_Intermediate_Language)的高级语言，IL 字节码运行在 .net 虚拟机上，类似 Java。C#编译出的二进制文件可以使用 .net framework 提供的 [`ildasm.exe`](https://learn.microsoft.com/en-us/dotnet/framework/tools/ildasm-exe-il-disassembler) 反汇编为 IL 代码，但也有专用工具 [ILSpy](https://github.com/icsharpcode/ILSpy)提供了图形界面还有将 IL 反编译为 C# 代码的功能、调试功能。[ECMA-335](https://www.ecma-international.org/publications-and-standards/standards/ecma-335/) 中包含了 IL 的指令集参考。

如果你是 C# 应用程序的开发者，也许可以使用 [Harmony 库](https://github.com/pardeike/Harmony/tree/master)实现一个模组/扩展加载器，虽然我没有使用过。

##### 修改 ActionScript

ActionScript 是 Adobe Flash 使用的脚本语言，虽然 Flash 现在已经不受支持，是过时的技术，但将以 Flash 形式创作的历史内容保存下来，不同人都以不同的方式作出了很多努力，包括使用 Rust 语言编写的 Flash Player 模拟器 [ruffle](https://ruffle.rs/)，[Flashpoint 档案馆](https://flashpointarchive.org/)。修改 ActionScript 仍然是可能遇到的需求。

ActionScript 3 版本编译为 AVM 2 字节码，在 AVM 2 虚拟机上运行。与上面两种语言类似，也存在专门的工具反汇编、反编译及修改 AVM 2 字节码，如 [JPEXS Free Flash Decompiler](https://github.com/jindrapetrik/jpexs-decompiler)。该工具的 Wiki 页面中提供了[许多修改 ActionScript 有用的资料](https://github.com/jindrapetrik/jpexs-decompiler/wiki/Links)。

SWF 文件是通常 Adobe Flash 导出的文件，可以被 Flash Player 播放（运行），它将图像、音频、文字、代码等数据都打包到一起了，JPEXS 可以直接提取或编辑这些文件。

SWF 文件的文件头开始有[三种可能](https://github.com/rubinsaifi/swf-format-switcher)，`FWS` 表示没有压缩，`CWS` 表示 zlib 压缩，而 `ZWS` 表示 LZMA 压缩。如果编辑以后文件变小或变大，可能是因为压缩模式改变。

##### 修改机器代码

C 语言或 C++ 语言以及其他底层语言均会编译成机器代码，可以通过反汇编或反编译分析代码并修改，最后修改文件，或制作补丁或注入程序。

修改这种代码比较困难，需要学习 x86 和 x86-64 汇编，并对 Windows 操作系统有一定了解。但也有许多工具能加快分析速度，降低难度。分析和修改的总体思路是（也有其他教程有其他方法，我根据我的经验提供一些方法）

1. 观察程序外部现象，观察进程、线程和系统调用等信息，大致定位目标 exe 或 dll
2. 使用 PE 文件分析器分析各目标，定位到一个或几个 exe 或 dll
   - 如果有壳，使用脱壳器脱壳
   - 若脱壳后运行失败，可能程序存在自我检测，可以考虑制作注入程序（外挂程序）
3. 使用调试器加载程序
4. 查找字符串或使用 API 断点定位相关代码位置
5. 提前下断点，观察附近的代码执行，变量变化
   - 对函数的第一条指令（如push ebp）使用查找引用可以找到调用该函数的其他函数
6. 修改关键跳转，或使用 code cave 编写代码，以屏蔽或启用某个特定功能
7. 保存修改的文件，替换原来的程序文件（可以顺便备份原来的程序文件）

[ASLR]: https://en.wikipedia.org/wiki/Address_space_layout_randomization

下面详细描述每个步骤的工具和思路：

**观察程序外部现象**：

首先，需要观察程序现象和执行方式，定位要修改的 exe 或 dll 文件

- 可以利用 [Process Explorer](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer) 观察程序产生的进程，还有判断窗口对应的进程，程序的线程信息，还有程序打开的文件，命令行参数等
- 也可以利用 [Process Monitor](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon) 监测注册表、文件活动、进程创建

例如，你要让一个程序不保存配置文件，你可以先使用 Process Explorer 查找出这个程序窗口的进程名字，再使用 Process Monitor 监测这个进程所有的读写文件操作，监测完成以后，就决定了要修改的文件目标就是这个程序

**分析 PE 文件**：

可以利用 [Detect It Easy](https://github.com/horsicq/Detect-It-Easy) 检测程序的编译器信息，判断程序的语言，判断有没有壳，程序有几个段，有没有 [code cave](https://en.wikipedia.org/wiki/Code_cave)（关于 code cave，[cheat engine](https://www.cheatengine.org/) 自带的教程程序很有助于学习和理解）

壳(Packer)是为了减小程序文件大小，使用一个自解压程序代替原来的程序。带壳的程序运行以后，壳会在内存中自动解压程序，并自动运行原程序；另外还有一种加密壳(Crypter)，是为了加密程序代码，防止检测或者防止逆向工程的。Detect It Easy 中可以检测常见的壳。如果程序有壳，在修改之前需要先脱壳；如果没有壳，就可以直接修改。脱壳可以使用针对某个特定壳的专用脱壳器，或者支持很多壳的通用脱壳器，也可以使用下文要介绍的 x64dbg 的脱壳插件。也可以手动脱壳，网上有很多教程。

有些程序脱壳后，因为文件内容发生变化，程序会检测自身内容，并和预定好的 hash 值进行对比，如果不一致，就会运行失败。这种程序可以将检测代码屏蔽，或保持原文件不变，使用外部程序注入内存修改功能（类似狭义的游戏外挂）。这些方法已经超出了本文的目的，所以可以在网上寻找其他资料学习。

**调试器选择**：

调试器可以用来反汇编程序，分析代码结构，单步执行，在指定位置中断等。使用调试器调试的目的是定位关键代码，就是定位到某个特定功能对应的代码，之后通过修改代码修改特定功能。我推荐比较新近的调试器 [x64dbg](https://github.com/x64dbg/x64dbg/)，可以调试 x86 程序或 x86-64 程序。还有一些其他的调试器

- [Ollydbg](https://www.ollydbg.de/)，比较老的逆向工程教程里面经常推荐，还有各种插件包。但是这个调试器已经太老了，我感觉没有 x64dbg 好用
- [Ghidra](https://github.com/NationalSecurityAgency/ghidra)，美国国家安全局出品的逆向工程调试器，我感觉太重量级了，体积大，太多功能用不上，但是可以反编译到类似 C 的语言，x64dbg 不行
- [IDA](https://hex-rays.com/ida-pro/)，不免费

**定位代码位置**：

如果要修改的特性涉及到显示对话框、改变字符串，或读取固定文件等情况，可以先查找字符串。

先运行到程序入口点处，在本模块内查找字符串，在找出的字符串中搜索你感兴趣的字符串，找到以后定位到代码中，然后进行下一步。如果是涉及到操作文件、操作注册表等，可以使用 API 断点定位代码。详情请查阅网上资料，本教程只讲述大概思路。

**下断点**：

一般要先看一下字符串或者 API 断点中断处周围的代码，包括上层函数周围的代码，分析逻辑，寻找可能是关键跳转（或关键代码插入位置）的地方，在这些地方或前面设置断点，修改程序的输入，观察执行变化。

这一部分操作可能需要比较多的经验，可能要花一些时间。

**修改关键处**：

如果目标是启用或禁用某个特性，通常可以找到一个关键的条件跳转，特性执行和不执行的跳转与否不一样。这个时候，就可以把该跳转修改成 jmp（恒定跳转）或nop（不跳转）来禁用或启用这个特定特性。可能需要较多分析和尝试。

如果要实现的逻辑比较复杂，不限于屏蔽或启用功能，可以事先寻找可用的 code cave (可以在段开始和结束处寻找，可以利用插件寻找)，然后在关键位置跳转到 code cave 里，在 code cave 中实现逻辑（例如修改变量），在最后跳转回原来位置的下一条指令，使程序继续正常运行。这个方法在 [cheat engine](https://www.cheatengine.org/) 自带的教程程序里面有用到，可以使用那个教程，或者在网上查找资料学习这种方法。

code cave 中的代码，还有跳转代码应该要可重定位(relocatable)，不然 windows 的 [ASLR] 机制会随机程序加载的位置，会导致修改了可以用，但是保存到文件以后就不能用的情况。

**保存修改的文件**：

修改完成后，用调试器将修改后的程序保存为文件，然后替换原程序文件（可以顺便备份原程序文件，以免修改出错）。重新打开程序，验证修改可用。修改完成后，也可以[将错误或建议反馈给开发者](#反馈给开发者)。

### 修改网络应用

网络应用因为语言较单一，且 JavaScript 必须由源码运行，因此较容易修改。

**判断你要修改的对象位于前端还是后端（服务器上）** 前端指一切在你的浏览器中运行的东西，例如 HTML，JavaScript，CSS。后端是在其他设备上运行的东西。前端通过网络请求，让后端进行特定的操作，或获取后端的数据。前端是你可以直接控制的部分，后端不能直接控制。

网页内容都是在前端渲染的，JavaScript 也是在前端执行的，向后端发送的网络请求，也是在前端发送的；网页的 CSS 样式表也是在前端。因此，凡是这些内容都可以修改。基于 chromium 的浏览器提供了强大的 [devtools（开发者工具）](https://developer.chrome.com/docs/devtools/)来调试和编辑这些内容。网上有许多关于它的教程，在此不详细叙述。利用其控制台（Console），也可以自己编写脚本运行。

你可以选择一些方法（以下基于 chromium 内核浏览器，但 firefox 等浏览器也有类似方案）（由易到难）：
- 使用 [Stylus] 给网站（或网页）注入 CSS 样式，改变颜色、字号、字体等等，或隐藏元素
- 使用 [Header Editor] 按规则自动修改网络请求头
  - 可以用来给不同网站设置不同语言等
- 使用 [Tampermonkey] 或 [Greasemonkey] 等用户脚本加载器注入 JavaScript 用户脚本（使用用户脚本前，要尽量确保所用的用户脚本代码安全性，防止盗号、诈骗等）
- 临时用 devtools 修改网页元素，添加 CSS 规则，修改 JavaScript 代码（例如[教程](https://github.com/CompileYouth/front-end-study/blob/master/tool/devtools/Elements.md)）
  - 使用 [local override]，但只能在 devtools 启用时有效

[Stylus]: https://github.com/openstyles/stylus
[Tampermonkey]: https://www.tampermonkey.net/
[Greasemonkey]: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
[Header Editor]: https://github.com/FirefoxBar/HeaderEditor
[local override]: https://developer.chrome.com/docs/devtools/overrides/

一些问题的解决方法：
- **按F12不能打开 devtools**：网页可能阻止F12按键事件处理，可以用浏览器菜单打开 devtools
- **一打开 devtools 就无限触发 JavaScript 断点**：网站可能使用措施不断调用`debugger`语句让 devtools 中断，可以右键行号选择`never pause here`，如果无效，则点击禁用所有断点的图标（但这样会使得手动添加的断点也不能中断）
- **JS 代码被混淆了**：点击左下角大括号格式化按钮，可以好看一些，但是还需要手动分析

后端数据位于远端服务器上，不能直接修改，只能通过网络请求调用后端提供的接口。为了达到想要的目的，你可以选择一些方法（从易到难）：

- 将想要的操作转移到前端
  - 利用[现有的浏览器扩展](https://github.com/FirefoxBar/HeaderEditor)，截获请求或响应，并修改请求或响应
  - 查看 network 记录下请求的 Initiator，定位到发起请求的 JavaScript 代码，并根据需要修改
  - [monkey patch](https://en.wikipedia.org/wiki/Monkey_patch) [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 或其他关键 API
- 用 devtools 的 network 一栏记录下请求，施展类似[「重放攻击」（Replay Attack）](https://en.wikipedia.org/wiki/Replay_attack)的请求回放（请注意当地相关法律法规）
- 分析后端接口的数据格式和调用方法，按自己设计的方式调用后端接口，修改数据或作出操作（谨慎操作，对其他设备的滥用可能会被定性为攻击，请注意当地相关法律法规）
  - 需要登录的网站一般会将登录后获取的令牌（token, 身份验证信息）存储到请求的 Cookies 或自定义头中，可以将这些头的内容，或全部头记录下来，提供给如 Python, Node.js 等外部编程语言构造需要的请求
- 在本地搭建私有服务器，修改私有服务器的代码。并修改 hosts 或自己搭建 DNS 服务器让网站指向本地，或修改前端代码。这样做的话需要网站的后端是开源的，或自己能复刻网站后端，这样只会影响你自己，不会影响网站上的其他人

## 反馈给开发者

修改结束以后，可以将问题或建议反馈给开发者。

- 在开源软件平台（如 github/gitlab）上，自己 fork 原项目，修改代码以后[提交 pull request]
- 在开源软件平台（如 github/gitlab）的该软件项目主页上提交工单（issue），或给开发者发送邮件。
- 如果开发者是你的朋友，那直接给他当面说，甚至可以扇他巴掌（你为什么还要逆向工程？直接让他修嘛）

[提交 pull request]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request

可以参考：<https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way>
