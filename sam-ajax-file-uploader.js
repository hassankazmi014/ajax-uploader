var samAjaxFileUploader = function () {
    
    // Variable to store your files and file names
    var files       = new Array();
    var filenames   = new Array();
  
    return {
        
        /**
         * 
         * Binds the file type inputs with the plugin function
         */
         init : function(){
                // Attach Event Handler
                $('input[type=file]').on('change', this.prepareUpload);
         },
         
         
         /**
          * 
          * @param {type} event
          * 
          * This set the array of files and file names
          */
         prepareUpload : function(event){
     
            var fileIndex        = $('input[type=file]').index(this);
            files[fileIndex]     = event.target.files[0];  
            filenames[fileIndex] = event.target.name;
         },
              
                 
                 
         /**
          * 
          * This function first upload the files and in the call back function it process the remaining form.
          * The function in first ajax call return the files data in json format, so in php action make the array like e.g.
          * 
          * $images = array(
          *     0 => array('fileElement' => file-input-name, 'fileName' => name-of-file-uploaded),
          *     1 => array('fileElement' => file-input-name, 'fileName' => name-of-file-uploaded)
          *     ......
          *     ..
          * )
          * And return json_encode($images);
          * 
          * This jason string will be parsed and then passed to callback function, 
          * so callback function written by you must have that argument as first, you can manipulate that at your own
          * 
          * @param {type} event
          * @param {type} upload_url
          * @param {type} callback function must have one argument that is passed to it by the calling function.
          * 
          */       
         uploadFiles : function (event, upload_url, callback) {
    
                event.stopPropagation(); // Stop stuff happening
                event.preventDefault();  // Totally stop stuff happening

                // start spinner here

                // Create a formdata object and add the files
                var data = new FormData();
                
                // append each file in form data
                $.each(files, function(key, value){ 
                      data.append(filenames[key], value);
                });

                //append csrf token in form data
                data.append( '_token',$("[name='_token']").val() );

                $.ajax({
                    url: upload_url,
                    type: 'POST',
                    data: data,
                    cache: false,
                    dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    complete: function(xhr, status){

                        if (status === 'error') {
                            console.log('error in file uploading');
                        } else {
                            console.log(xhr.responseText);
                            //return xhr.responseText.trim();
                            
                            var files = xhr.responseText.trim();

                            var json_parsed_files = $.parseJSON(files);

                            var serializedFilesData = '';
                            $.each(json_parsed_files, function(key, file){
                                 serializedFilesData += '&' + file.fileElement + '=' + encodeURIComponent(file.fileName);
                            });
                            
                            callback(serializedFilesData);
                        }
                    }
                });
         }
    }
}();