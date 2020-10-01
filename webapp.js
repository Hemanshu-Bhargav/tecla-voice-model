const express = require('express');
const webapp = express();
const path = require('path');
const http = require('http').Server(webapp); //actually used by express under the hood (http.createServer),
const router = express.Router();

// Output the html, combined with dynamic JS variables from our express framework
const expressLayouts = require('express-ejs-layouts');

//const server = http.Server(webapp);

//handlebars uses webapp.engine, ejs doesn't
// launch the EJS handlers (templating engine which outputs html pages from expressJS)
webapp.use(expressLayouts);
webapp.set('view engine', 'ejs');

// Body Parser Middleware
webapp.use(express.json());
webapp.use(express.urlencoded({ extended: false })); //set to true to allow % encoding of special characters, see below why its needed even before serializing objects
//some sources say to use false. According to docs, false uses the standard querystring library whereas true uses the qs library (need require line) and can perform
//nested structuring (foo[bar] : bar instead of foo:bar. Basically a nested key.value pair)

//MAY NOT NEED. REPLACED ROUTES FOLDER CODE
//Specify the views folder
webapp.set("views", __dirname + "/views");
//Server's port number
webapp.set("port", 3000);
//MAY NOT NEED ABOVE 2 LINES (4 WITH COMMENTS)

// Set static folder
webapp.use(express.static(path.join(__dirname, '/public/')));

//____________________________________________________________________
//Whenever running a server, the port # is usually stored in an environment variable. So, check that env variable first for port 5000, and run on that or simply port 5000
//const PORT = process.env.PORT || 3000;
//Just logging to tell us the server is indeed running
//server.listen(PORT, () => console.log(`Server started on port ${PORT}`)); //--> USE http.listen if http = require().Server(webapp or express)

//redefine port (non constant) for socket.io
const port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

// _____________________________________________________________________________________
// ___________________________________________ Routing. Was index.js under routes directory

/* Welcome Page */
webapp.get('/', (req, res) => res.render('landingpage'));
webapp.get('/landingpage', (req, res) => res.render('landingpage'));
webapp.get('/microphone', (req, res) => res.render('microphone'));
webapp.get('/actionselection', (req, res) => res.render('actionselection'));
webapp.get('/welcome', (req, res) => res.render('welcome'));
webapp.get('/submitform', (req, res) => res.render('submitform'))
//form output is saved to this variable and will be global. On form input (from webapp.post),the variable will be reassigned
//Variables declared without var/let/const are global. Not the best practice but these names won't be re-used
formsubmission = {};
pyarg1 = JSON.stringify(formsubmission);
pyarg2 = JSON.stringify(formsubmission);
usermodelname = "";
/* After Form Submission */
webapp.post('/submitform', function(req, res) //,next
  {
    formsubmission = { storedhotword: req.body }; // --> sent this variable as JSON.stringify(storedhotword.name)
    //storedhotword itself is JSON ({"name":"Jack"}) and storedhotword.name is a string ("Jack")
    res.render('submitform', formsubmission);
    pyarg1 = JSON.stringify(formsubmission.storedhotword.hotword); //data is a nested JSON variable
    pyarg2 = JSON.stringify(formsubmission.storedhotword.age);
    pyarg3 = JSON.stringify(formsubmission.storedhotword.language);
    pyarg4 = JSON.stringify(formsubmission.storedhotword.voicetype); //alias for gender
    //pyarg3 = JSON.stringify(formsubmission.storedhotword.gain);

    /* Configure Model Name. Has nothing to do with /submitform but ensures that variables get form data from correct scope */
    console.log(pyarg1);
    usermodelname = pyarg1.replace(/\s/g, '');
    console.log(usermodelname);
    usermodelname = JSON.parse(usermodelname);
    console.log(usermodelname);
    //usermodelname.replace(/\s+/g, '');
    usermodelname = usermodelname + "model.pmdl";
    //Fix double-string type issue after concatentation in usermodelname
    pyarg1 = JSON.parse(pyarg1);
    pyarg2 = pyarg2.replace(/\s/g, '');
    pyarg2 = JSON.parse(pyarg2);
    pyarg3 = JSON.parse(pyarg3);
    pyarg4 = JSON.parse(pyarg4);
    console.log("Scope check");
    console.log(usermodelname);
});

//Command-line arguments for spawned python processes. These comprise of req.body.
// 1) Recording process arguments
// 2) Training Service Command-line arguments. These are generated from the spawned recording processes.
// 3) Snowboy Multiple-model Listener command-line arguments.

/*Record 1st Sample*/
webapp.get('/recordingpage1', (req,res) => res.render('recordingpage1')); //let recordingsuccess = {};
webapp.post('/recordingpage1', function(req,res)
{
  rec1form = {};
  rec1form = JSON.stringify(rec1form);
  console.log(pyarg1); //Check if scope is intact
  rec1form = {reqseconds : req.body};
  pyargrec1 = rec1form.reqseconds.reqaddseconds;
  console.log(pyargrec1);
  var child_process = require('child_process');
  console.log(req.body.reqaddseconds);
  console.log("Before command line terminal output");
  var spawn = child_process.spawn('python3', ["./record1.py", pyargrec1], {stdio: 'inherit'} );
  //   recordingsuccess = {msgalert: "Sample Recorded!"};
  res.render('recordingpage1');
});

/*Record 2nd Sample*/
webapp.get('/recordingpage2', (req,res) => res.render('recordingpage2')); //let recordingsuccess = {};
webapp.post('/recordingpage2', function(req,res)
{
  rec2form = {reqseconds : req.body};
  pyargrec2 = rec2form.reqseconds.reqaddseconds;
  var child_process = require('child_process');
  console.log("Before command line terminal output");
  var spawn = child_process.spawn('python3', ["./record2.py", pyargrec2], {stdio: 'inherit'} );
  res.render('recordingpage2');
});

/*Record 3rd Sample*/
webapp.get('/recordingpage3', (req,res) => res.render('recordingpage3')); //let recordingsuccess = {};
webapp.post('/recordingpage3', function(req,res)
{
  rec3form = {reqseconds : req.body};
  pyargrec3 = rec3form.reqseconds.reqaddseconds;
  var child_process = require('child_process');
  console.log("Before command line terminal output");
  var spawn = child_process.spawn('python3', ["./record3.py", pyargrec3], {stdio: 'inherit'} );
  res.render('recordingpage3');
});
/* Function to send live python bash output from raspberyy pi to node. Terminal output is Asynchronous */
function run_script(child, command, args, callback)
{
  // This function will output the lines from the script
  // AS is runs, AND will return the full combined output
  // as well as exit code when it's done (using the callback).
    //DOESN'T WORK//var child = processtospawn;
    console.log("Starting Process.");
    var scriptOutput = "";

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
        console.log('stderr: ' + data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.on('close', function(code) {
        callback(scriptOutput,code);
    });
}
/* Send to Training Service & Create Personal Model */
webapp.get('/modelcreation', function(req,res)
{
    console.log ("Continuing to do node things while the process runs at the same time...");
    var child_process = require('child_process');
    //Pyargs were not in same order as Snowboy parameter listing, and usermodelname was not enumerated
    //Below is the correct positional arugment ordering (1,4,usermodelname,3,2)
  //  var child = child_process.spawn('python3', ["./training_service.py", pyarg1, pyarg4, usermodelname, pyarg3, pyarg2],{stdio: 'inherit'});
    var child = child_process.spawn('python3', ["./training_service.py", pyarg1, pyarg4, usermodelname],{stdio: 'inherit'});
    console.log("Before command line terminal output");
  //  sendterminaloutput = {};
    res.render('modelcreation');

});

//The 3 recording buttons above have already generated the audio files 1.wav, 2.wav and 3.wav
/* Navigate back to step 1 */
//repeat all steps to create another personal model

/* Listen for personal models */
webapp.get('/listenformodels', (req,res) => res.render('listenformodels'));
webapp.post('/listenformodels', function(req,res)
{

    //For Socket.io
    var io = require('socket.io')(http);
    var child = require('child_process'); //child for socket.io spawn, child_process name redefined for python process
    var events = require('events');
    var eventEmitter = new events.EventEmitter();

    eventEmitter.on('logging', function(message) {
      io.emit('log_message', message);
    });

    //SPAWN process
    io.on('connection', function(socket){
    //	console.log('Continuing node activities while process spawns');

    	var python_process = child.spawn( 'python3', ['snowboymultiplemodels.py'], {stdio: ['pipe']}); //{stdio: ['pipe']}

      // below "3" lines output python console to node console as well
      //spit stdout to screen
      var chunk = '';

      python_process.stdout.on('data', function (data) {
      process.stdout.write(data.toString());
        chunk += data
        socket.emit('newdata', chunk);
        console.log(data.toString());
        });

      //spit stderr to screen
      python_process.stderr.on('data', function (data) {
        process.stderr.write(data.toString());
  //       console.log('Failed to start child process.'); //Outputs always because PyAudio always has some script output
         console.log(data.toString());
       });

      python_process.on('close', function (code)
      {
        console.log("Finished with code " + code);
      });

    //SPAWN PROCESS ENDS HERE
});
    // Override console.log
    var originConsoleLog = console.log;
    console.log = function(data) {
      eventEmitter.emit('logging', data);
      originConsoleLog(data);
    };

    res.render('listenformodels');
});
