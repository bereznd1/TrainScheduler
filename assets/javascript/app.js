// Initializes Firebase
var config = {
    apiKey: "AIzaSyDaJLu_MeIlC9Ui49BHBSxSV6naduliDQE",
    authDomain: "train-scheduler-2b826.firebaseapp.com",
    databaseURL: "https://train-scheduler-2b826.firebaseio.com",
    projectId: "train-scheduler-2b826",
    storageBucket: "train-scheduler-2b826.appspot.com",
    messagingSenderId: "152849792041"
};
firebase.initializeApp(config);

// Creates variable for easy reference to Firebase's database
var database = firebase.database();

// Creates function that takes place when the Submit button is clicked
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#train-time-input").val().trim(), "HH:mm").format("X");
    var freq = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        freq: freq
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Alert when a train is added
    alert("New train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
});

// Creates Firebase event for adding new train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    // Stores everything into a variable
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var freq = childSnapshot.val().freq;

    // Changes First Train Time into military time from Unix time
    firstTrainTime = moment.unix(firstTrainTime).format("HH:mm");

    // Pushes First Train Time back 1 day to make sure it comes before current time
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "days");

    // Finds the difference between the Current Time & the First Train Time   
    var diffTime = moment().diff(firstTimeConverted, "minutes");

    // Finds the # of minutes since the last train came
    var remainder = (diffTime - 1440) % freq;

    //Finds the # of minute until the next train
    var minsAway = freq - remainder;

    //Finds the time of the next train in Unix time
    var nextArrival = moment().add(minsAway, "minutes");

    //Changes the time of the next train from Unix time to regular time
    nextArrival = moment(nextArrival).format("LT");

    //Adds each train's data into the table
    $("#train-info-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
        freq + "</td><td>" + nextArrival + "</td><td>" + minsAway + "</td></tr>");
});