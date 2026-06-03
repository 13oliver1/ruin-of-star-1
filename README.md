<<<<<<< HEAD
# 叹息的声音

```
因为他们遗忘了，这世界也要跟着遗忘，这个世界也不可能变得圆满，所有的人都在渴求，所有的人都在追逐，所以——他们失败了。
```

## 一、安装Git

下载地址：https://git-scm.com/download

安装过程配置环境变量。

查看安装完成：打开cmd窗口，输入 git -v

在任意文件夹中，右键--有Git Bash Here菜单项。

### **二、注册Github**

创建仓库，获取SSH地址

注：建议选择SSH，而不是HTTPS，因为HTTPS需要每次都输入密码，麻烦

比如仓库名：test2415

SSH地址：git@github.com:GerardDu/test2415.git

### **三、生成本地公钥，并配置Github仓库**

#### 1.生成：

打开cmd窗口，输入如下命令

ssh-keygen -t rsa -b 4096 -C "自己的电子邮件地址"

过程中，全部默认，按Enter即可。

查看方式1：cmd窗口直接查看

type %userprofile%\.ssh\id_rsa.pub

查看方式2：文件管理器打开此目录 C:\Users\杜宪\.ssh，然后以记事本打开id_rsa.pub文件。

#### 2.配置：

打开Github，点击个人头像--“Settings”（设置）页面，并点击“SSH and GPG keys”（SSH和GPG密钥）选项。

点击“New SSH key”（新建SSH密钥）按钮。

在标题字段中输入一个描述性的名称，比如“My Laptop Key”（我的笔记本电脑密钥）。

在Key字段中粘贴之前复制的公钥信息。

最后，点击“Add SSH key”（添加SSH密钥）按钮。

### **四、Git Bash中同步本地文件夹和远程仓库**

#### 1.前提：

Github中创建时，生成的分支名为main。

使用git init 命令创建本地仓库时默认会创建一个master分支。

#### 2.初始化本地项目为git管理

打开当前项目的文件夹，右键--Git Bash Here

顺序执行如下命令：

git init

注：此时文件夹内会自动创建一个.git的隐藏文件夹

此时应该在当前目录下，手动创建文件 .gitignore，以便在接下来的同步中，指定不需要同步的内容。

一个.gitignore文件内容参考如下：

```javascript
# 从这一行开始，摸索自己的配置 还有很多其他的内容如CMake相关 但我感觉目前用不到 2023年04月28日

# 去除根目录下的.idea文件
/.idea/
# 去除自身
.gitignore
# 去除log结尾的文件
*.log

# 解决java产生文件
*.class

# Package Files 用于Java web
*.jar
*.war
*.ear
*.zip
*.tar.gz
*.rar

# 解决maven产生的文件 Built application files and Maven
target/
**/target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties

# IntelliJ相关，项目默认生成
/out/
/target/
.idea
*.iws
*.iml
*.ipr
.flattened-pom.xml
.mvn
mvnw*

# VS Code
.vscode/
/mvnw.cmd
/mvnw
/.mvn/

# macOS
.DS_Store

# NetBeans
nbproject/private/
build/
nbbuild/
dist/
nbdist/
.nb-gradle/
generatorConfig.xml

# nacos
third-party/nacos/derby.log
third-party/nacos/data/
third-party/nacos/work/

# STS
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans

#others
.git
logs
rebel.xml
!.mvn/wrapper/maven-wrapper.jar
log.path_IS_UNDEFINED
offline_user.md
```

3.添加远程仓库

git remote add origin git@github.com:GerardDu/test2415.git

注：此时，不要使用git branch，即使用了也什么分支都查不到。也不建议在此时使用git checkout -b命令来创建新的分支。

4.初始化分支

git add .

git commit -m "inited"

注：此时可以使用git branch，会看到有master分支，但使用命令 git branch -a是看不到远程仓库的。

5.同步方式1：与github的main分支保持一致。

a.拉取远程代码

此时创建新分支main，因为本地的git主分支是master，而远程的Github仓库中主分支是main。

此时不能直接推送，因为可能远程的github仓库中main仓库有其他代码，为了保证本地和远程一致，需要在本地通过git pull命令来拉取远程仓库。

git checkout -b main

git pull origin main --allow-unrelated-histories

此时就可以在本地文件夹中，不仅可以看到原有的内容，还可以看到远程github中拷贝过来的新内容了。

注：git pull：命令的作用是从远程仓库获取最新版本并合并到本地仓库

命令格式：git pull 远程仓库简称 分支名称

注意：如果当前本地仓库不是从远程仓库克隆，而是本地创建的仓库，并且仓库中存在文件，此时再从远程仓库拉取文件的时候会报错（fatal: refusing to merge unrelated histories ）

解决此问题可以在git pull命令后加入参数--allow-unrelated-histories

b.推送本地代码

然后执行git push -u origin main。

此时打开Github的当前仓库，即可看到在main分支中已经有了本地文件夹中的内容。

注：今后所有的本地开发，都基于main分支操作，不需要再切换回master分支，这样就可以与Github中的当前分支保持一致了。

如果有代码修改，如上面，依次执行 git add和git commit命令，然后再执行git push命令。

此时及以后再使用git push即可，不需要再用git push -u origin main

c.此时查看分支有如下3种方式：

git branch 列出所有本地分支

git branch -r 列出所有远程分支

git branch -a 列出所有本地分支和远程分支

6.同步方式2：基于master分支同步到Github仓库时同时创建master分支

git push 

git push -u origin master

将本地仓库内容推送到远程仓库，命令格式：git push 远程仓库简称 分支名称

注：Github上的主分支名称是main，而不是master，此处相当于对仓库新建了分支。推送后，需要自己到Github上切换分支查看。

7.今后，就可以使用Git来管理本地程序项目，并通过Github仓库来做存储了。

同样，也可以用来存储本地的md笔记及图片等（作备份用）。
