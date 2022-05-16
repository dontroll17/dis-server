const express = require('express');
const app = express();
const PORT = process.env.PORT || 5555;

app.get('/', (req, res) => {
    res.send('It`s work');
});

app.listen(PORT, () => {
    console.log(`Blast-off on http://localhost:${PORT}`);
});