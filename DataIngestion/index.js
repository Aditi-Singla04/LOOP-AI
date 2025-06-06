const express = require('express');
const ingestionRoutes = require('./routes/ingestionRoutes');

const app = express();
app.use(express.json());

app.use('/', ingestionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
