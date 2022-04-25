const express = require('express');
const apiRoutes = require('./routes/apiRoutes.js');
const htmlRoutes = require('./routes/htmlRoute');
const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./Develop/public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);




app.listen(PORT, function(){
    console.log('App listening on http://localhost:'+ PORT);
}); 