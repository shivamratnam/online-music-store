const express = require('express');

// init app
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>HomePage</h1>');
});

(() => {
    let port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
})();
