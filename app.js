const express = require('express');
const app = express();
const passport = require('passport');
const cors = require('cors');

const authRouter = require('./routes/auth');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(cors());
require('./config/passport')(passport);

app.use('/api',authRouter );
app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);