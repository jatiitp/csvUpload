angular.module('excelUploadCtrl', []).controller('excelUploadCtrl', function($scope, $http) {


    $scope.snackBar = function(msg) {
        $scope.snackHead = msg;
        var x = document.getElementById("snackbar")
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    $scope.fetchDataOnLoad = function() {
        $http.get('/getData')
            .then(function(resp) {
                $scope.users = resp.data.docs;
            }, function(resp) {
                /* Failure */
                
            });
    }

    $scope.post  = function(url, data) {

        $http.post(url, data)
        .then(function(resp) {
            if (resp.data.success) {
                $scope.fetchDataOnLoad();
                $scope.snackBar('Succesful');
            } else {
                $scope.snackBar('Something is wrong');
            }
            /* Success */
           
        }, function(resp) {

            /* Failure */
            
        });
        
        // $scope.$apply();

    };
        
    $scope.fetchDataOnLoad();
    $scope.name = 'Vinod Jat';  
    $scope.uploadCSV = function(arr) {
        $scope.users = $scope.CSVToArray(arr, ',');
        /* Post data */
        $scope.post('/saveData',$scope.users);
        $scope.$apply();

    };

    $scope.name = '';
    $scope.email = '';
    $scope.age = '';

    $scope.addUser = function(name,email,age) {
        var obj = {
            'name' : name,
            'email' : email,
            'age' : age
        };
        $scope.users.push(obj);
        $scope.post('/saveDataManual', obj);
    };

    $scope.isEdit = false;
    $scope.editTable = function(name, email, age, index) {
        $scope.isEdit = true;
    };

    $scope.cancelEdit = function(name, email, age, index) {
        $scope.isEdit = false;
    };

    $scope.saveTable = function(users) {
        $scope.isEdit = false;
        $scope.post('/saveDataTable',users);

    };

    $scope.deleteUser = function(name, email, age, index) {
        var obj = {
            'name' : name,
            'email' : email,
            'age' : age
        };
        $scope.post('/deleteData', obj);
    };

    $scope.CSVToArray = function( strData, strDelimiter ) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }


    $scope.downloadTemplate = function() {
        var values ="Name,Email,Age";
        var fileName = "Template.csv";
        var link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + escape(values);
        link.style = "visibility:hidden";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    $scope.Upload = function() {

        var fileUpload = document.getElementById("fileUpload");
        var regex = /^([a-zA-Z0-9\\\\\\\s_\\.\-:])+(.csv|.txt |.xlsx)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
        var reader = new FileReader();
        reader.onload = function (e) {
        var rows = e.target.result.split("\\\\\\n");
        $scope.uploadCSV(rows);
        }
        reader.readAsText(fileUpload.files[0]);
        } else {
        alert("This browser does not support HTML5.");
        }
        } else {
        alert("Please upload a valid CSV file.");
        }
    }

});