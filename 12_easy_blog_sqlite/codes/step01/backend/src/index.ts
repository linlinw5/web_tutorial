import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.static('public'));  // 指定静态文件的目录
app.set('view engine', 'ejs');      // 指定模板引擎
app.set('views', 'views');          // 指定视图文件夹 - 存放ejs模板的地方

app.get('/', (req, res) => {
  res.render('home.ejs', { title: 'Home Page' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});