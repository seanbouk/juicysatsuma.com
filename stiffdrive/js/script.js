var authResult;
var resumableSessionURI;
var fileSize;
var fileName;
var file;
var fileData;

$(document).ready(function()
{
    //$(":file").css("background-color", "red");

    $('input[type=file]').change(function() 
    {
        fileSize = this.files[0].size;
        fileName = $(this).val();
        file = this.files[0];

        console.log("file - " + fileName);
        console.log("filesize - " + fileSize);
        console.log("access token - " + authResult.access_token);


        fr = new FileReader(); // FileReader instance
        fr.onloadend = function () {
            // Do stuff on onload, use fr.result for contents of file
            fileData = fr.result;
            console.log("fileData.length = " + fileData.length);

            var img = document.createElement('img');
            img.src = fileData;
            document.body.appendChild(img);
        };
        //fr.readAsText( file );
        fr.readAsDataURL( file );
        //fr.readAsBinaryString(file);
        //fr.readAsArrayBuffer(file);

        $.ajax
        ({
            url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
            type: 'POST',
            headers:
            {
                "Authorization": "Bearer " + authResult.access_token,
                "Content-Type": "application/json; charset=UTF-8",
                "X-Upload-Content-Type": "image/jpg",
                "Content-transfer-encoding": "base64",
                "X-Upload-Content-Length": 0
            },
            success: function(data, testStatus, request) 
            {
                resumableSessionURI = request.getResponseHeader('location')

                console.log("POST successs - " + resumableSessionURI);

                uploadFile();
            },
            error: function(result) 
            {
                console.log("POST error - " + result);
            },
            complete: function(result) 
            {
                console.log("POST complete - " + result);
            }
        });
    });


});


function uploadFile()
{
    $.ajax
    ({
        url: resumableSessionURI,
        type: "PUT",
        headers:
        {
            "X-Upload-Content-Length": fileSize,
            "Content-transfer-encoding": "base64",
            "Content-Type": "image/jpg"
        },
        data: fileData
    });
}


// Your Client ID can be retrieved from your project in the Google
  // Developer Console, https://console.developers.google.com
  var CLIENT_ID = '621503548168-rp931jl263mdujujs2kq4ehjm43jhk2c.apps.googleusercontent.com';

  var SCOPES = ['https://www.googleapis.com/auth/drive'];

  /**
   * Check if current user has authorized this application.
   */
  function checkAuth() {
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, handleAuthResult);
  }

  /**
   * Handle response from authorization server.
   *
   * @param {Object} authResult Authorization result.
   */
  function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = 'none';
      loadDriveApi();
      this.authResult = authResult;
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      authorizeDiv.style.display = 'inline';
    }
  }

  /**
   * Initiate auth flow in response to user clicking authorize button.
   *
   * @param {Event} event Button click event.
   */
  function handleAuthClick(event) {
    gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult);
    return false;
  }

  /**
   * Load Drive API client library.
   */
  function loadDriveApi() {
    gapi.client.load('drive', 'v3', listFiles);
  }

  /**
   * Print files.
   */
  function listFiles() {
    var request = gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
      });

      request.execute(function(resp) {
        appendPre('Files:');
        var files = resp.files;
        if (files && files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            appendPre(file.name + ' (' + file.id + ')');
          }
        } else {
          appendPre('No files found.');
        }
      });
  }

  /**
   * Append a pre element to the body containing the given message
   * as its text node.
   *
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }
