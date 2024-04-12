const express = require('express');
const app = express();
const db = require('./models');

// Sync Database
db.sequelize.sync().then(() => {
    console.log('Synced db');
}).catch((err) => {
    console.log('Failed to sync db ' + err.message);
});

app.use(express.json());
app.use(express.urlencoded( {extended: true }));

// Routers
const schoolRouter = require('./routes/schools.routes')(app);
const userRouter = require('./routes/users.routes')(app);
const rsoRouter = require('./routes/rso.routes')(app);
const eventRouter = require('./routes/events.routes')(app);
const commentRouter = require('./routes/comments.routes')(app);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

