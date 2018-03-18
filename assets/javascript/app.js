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

    // Alert
    alert("New train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
});


// Creates Firebase event for adding new train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    // Store everything into a variable
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var freq = childSnapshot.val().freq;




    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

    // Current Time
    //var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var remainder = diffTime % freq;

    // Minute Until Train
    var minsAway = freq - remainder;
   // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextArrival = moment().add(minsAway, "minutes");
    //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));







    // Prettify the employee start
    var empStartPretty = moment.unix(empStart).format("MM/DD/YY");

    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var empMonths = moment().diff(moment.unix(empStart, "X"), "months");
    console.log(empMonths);

    // Calculate the total billed rate
    var empBilled = empMonths * empRate;
    console.log(empBilled);

    // Add each employee's data into the table
    $("#train-info-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
        freq + "</td><td>" + nextArrival + "</td><td>" + minsAway + "</td></tr>");
});