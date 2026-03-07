const http = require('http');

const server = http.createServer((req, res) => {
    //Устанавливаем заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Node.js Тест</title>
                <style>
                    body { font-family: Arial; padding: 20px; background: #f0f0f0; }
                    .info { background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                    h1 { color: #333; }
                    .success { color: green; }
                </style>
            </head>
            <body>
                <div class="info">
                    <h1>Node.js работает!</h1>
                    <p><strong>Версия Node:</strong> ${process.version}</p>
                    <p><strong>Платформа:</strong> ${process.platform}</p>
                    <p><strong>Архитектура:</strong> ${process.arch}</p>
                    <p><strong>Время запуска:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Текущая директория:</strong> ${process.cwd()}</p>
                </div>
            </body>
            </html>
        `);
    } else if (req.url === '/api/info') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            memory: process.memoryUsage(),
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        }, null, 2));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Страница не найдена');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Для просмотра информации откройте браузер`);
    console.log(`Нажмите Ctrl+C для остановки сервера`);
});

//Простой тест без сервера
console.log('Node.js успешно установлен и работает!');
console.log('='.repeat(40));
console.log('Информация о системе:');
console.log(`Версия Node: ${process.version}`);
console.log(`Платформа: ${process.platform} (${process.arch})`);
console.log(`PID процесса: ${process.pid}`);
console.log(`Текущая папка: ${process.cwd()}`);
console.log('='.repeat(40));

//Тест математических операций
const sum = (a, b) => a + b;
console.log(`Тест функции: 2 + 3 = ${sum(2, 3)}`);

//Тест работы с памятью
const memoryUsage = process.memoryUsage();
console.log('Использование памяти:');
console.log(`  RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)} MB`);
console.log(`  Heap Total: ${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`);
console.log(`  Heap Used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`);

console.log('='.repeat(40));
console.log('Тест завершен успешно!');