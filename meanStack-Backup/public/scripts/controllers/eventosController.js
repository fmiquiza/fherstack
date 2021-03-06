'use strict';
angular.module('app')
	.controller('eventCtrl', function($scope,$http){
		var refresh=function(){
			$http.get('/apiEvents').success(function(response){
				$scope.events=response;
			});
		};
		refresh();
		$scope.eliminarEvento=function(id){
			
			$http.delete('/apiEvents/'+id).success(function(response){
				refresh();
			});
		};
		
		$scope.lblTitle="EVENTOS";	

	})
	.controller('createEventCtrl', function($scope,$http,$location,$timeout,$state,Upload){
		$scope.lblTitle="NUEVO EVENTO";
		$scope.btnGuardar="Guardar";
		$scope.texto = 'este es el  el contenido';	
		$scope.Evento={};
		var idLastEvent='';
		$scope.saveEvent=function(){
			
			$http.post('/apiEvents',$scope.Evento).success(function(response){
				idLastEvent=response._id;
				$timeout(function(){
					if ($scope.archivosEvento) {
	        			$scope.uploadFiles($scope.archivosEvento,idLastEvent);
	        		
	      			}
	      			$state.go('admin.events'); //luego de 1segundo se redirecciona 	
				},1000);
			});
		};

	    $scope.uploadFiles = function(files,id_event) {
	    	console.log(id_event);
	        $scope.files = files;
	        console.log($scope.files);
	        //$scope.errFiles = errFiles;
	        angular.forEach(files, function(file) {
	            file.upload = Upload.upload({
	                url: '/apiEvents/uploads',
	                data: {event_id:id_event},
	                file:file
	            });

	            file.upload.then(function (response) {
	                $timeout(function () {
	                    file.result = response.data;
	                    console.log(response);
	                });
	            }, function (response) {
	                if (response.status > 0)
	                    $scope.errorMsg = response.status + ': ' + response.data;
	            }, function (evt) {
	                file.progress = Math.min(100, parseInt(100.0 * 
	                                         evt.loaded / evt.total));
	                
	            });
	        });
    	};
    	$scope.quitarImagen = function(index) {
        	$scope.archivosEvento.splice(index,1);
      	}
      	$scope.isImage=function(url){
		   	var arr = [ "jpeg", "jpg", "gif", "png" ];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
			for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};

		}
		$scope.isOffice=function(url){
			var arr=["xlsx","xls","docx","doc","pptx","ppt"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};
		}
		$scope.getTypeOffice=function(url){
			var dir="images/office/";
			var arr=["xlsx","xls","docx","doc","pptx","ppt","pdf","zip","rar"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			dir=dir+arr[i]+'.png';
		   		}
		   	};
		   	if (dir=="images/office/") {
		   		dir=dir+'unknow.png';
		   	};
		   	return dir;
		}
		$scope.isVideo=function(url){
		   	var arr = [ "mp4", "flv", "3gp", "wmv" ];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
			for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}
		   	};
		}
		$scope.isCompress=function(url){
			var arr=["rar","zip","tar"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};
		}
		$scope.isPdf=function(url){
		   	var ext = url.substring(url.lastIndexOf(".")+1);
	   		if(ext=="pdf"){
	   			return true;
	   		}
		}
	})
	.controller('updateEventCtrl', function($scope,$http,$stateParams,$timeout,$state,Upload){
		var id=$stateParams.id;
		$scope.lblTitle="ACTUALIZAR EVENTO";
		$scope.btnGuardar="Actualizar";
		$scope.btnAtras="Atras";
		$scope.imagenes=[];
		var refreshUpdate=function(){
			$scope.imagenes=[];
			$http.get('/apiEvents/'+id).success(function(response){
				//console.log(response);
				$scope.Evento=response;
				angular.forEach(response.imagen, function(value, key) {
				      	
		        	$scope.imagenes.push(value);
		        });
			});
		}
		refreshUpdate();
		$scope.updateEvent=function(){
			$http.put('/apiEvents/'+ $scope.Evento._id,$scope.Evento).success(function(response){
				$timeout(function(){
					if ($scope.archivosEvento) {
	        			$scope.uploadFiles($scope.archivosEvento,$scope.Evento._id);
	        		
	      			}
					$state.go('admin.events');
				},1000)
			});
		
		}

		$scope.atras=function(){
			$state.go('^');
		}

		$scope.eliminarImagen = function(id_imagen,par_directorio) {
			var eventToDelete={
				_id:$scope.Evento._id,
				directorio:par_directorio

			}
        	$http.put('/apiEventsGallery/'+ id_imagen,eventToDelete).success(function(response){
				/*$timeout(function(){
					//$location.path('/events');
					$state.go('admin.events');
				},1000)*/
        		
			});
        	refreshUpdate();
      	}

      	$scope.quitarImagen = function(index) {
        	$scope.archivosEvento.splice(index,1);//para eliminar un eliminarEventoento de un array
        	
      	}
      	$scope.uploadFiles = function(files,id_event) {
	    	console.log(id_event);
	        $scope.files = files;
	        console.log($scope.files);
	        //$scope.errFiles = errFiles;
	        angular.forEach(files, function(file) {
	            file.upload = Upload.upload({
	                url: '/apiEvents/uploads',
	                data: {event_id:id_event},
	                file:file
	            });

	            file.upload.then(function (response) {
	                $timeout(function () {
	                    file.result = response.data;
	                    console.log(response);
	                });
	            }, function (response) {
	                if (response.status > 0)
	                    $scope.errorMsg = response.status + ': ' + response.data;
	            }, function (evt) {
	                file.progress = Math.min(100, parseInt(100.0 * 
	                                         evt.loaded / evt.total));
	                
	            });
	        });
    	};
    	$scope.isImage=function(url){
		   	var arr = [ "jpeg", "jpg", "gif", "png" ];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
			for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};

		}
		$scope.isOffice=function(url){
			var arr=["xlsx","xls","docx","doc","pptx","ppt"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};
		}
		$scope.getTypeOffice=function(url){
			var dir="images/office/";
			var arr=["xlsx","xls","docx","doc","pptx","ppt","pdf","zip","rar"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			dir=dir+arr[i]+'.png';
		   		}
		   	};
		   	if (dir=="images/office/") {
		   		dir=dir+'unknow.png';
		   	};
		   	return dir;
		}
		$scope.isVideo=function(url){
		   	var arr = [ "mp4", "flv", "3gp", "wmv" ];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
			for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}
		   	};
		}
		$scope.isCompress=function(url){
			var arr=["rar","zip","tar"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};
		}
		$scope.isPdf=function(url){
		   	var ext = url.substring(url.lastIndexOf(".")+1);
	   		if(ext=="pdf"){
	   			return true;
	   		}
		}
		
	})
	.controller('partialEventoCtrl', function($scope,$http,$state,$sce){
		$http.get('/apiEvents').success(function(response){
				$scope.listaEventos=response;
				console.log(response);
			});
		$scope.Limit = 100;
		$scope.leerMas=function(id){
				//$state.go('/:leerMas')
		}
		$scope.isImage=function(url){
		   	var arr = [ "jpeg", "jpg", "gif", "png" ];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
			for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};

		}
		$scope.isOffice=function(url){
			var arr=["xlsx","xls","docx","doc","pptx","ppt"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};
		}
		$scope.getTypeOffice=function(url){
			var dir="images/office/";
			var arr=["xlsx","xls","docx","doc","pptx","ppt","pdf","zip","rar"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			dir=dir+arr[i]+'.png';
		   		}
		   	};
		   	if (dir=="images/office/") {
		   		dir=dir+'unknow.png';
		   	};
		   	return dir;
		}
		$scope.isVideo=function(url){
		   	var arr = [ "mp4", "flv", "3gp", "wmv" ];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
			for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}
		   	};
		}
		$scope.isCompress=function(url){
			var arr=["rar","zip","tar"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};
		}
		$scope.isPdf=function(url){
		   	var ext = url.substring(url.lastIndexOf(".")+1);
	   		if(ext=="pdf"){
	   			return true;
	   		}
		}
		
	})
	.controller('vistaEventoCtrl', function($scope,$http,$stateParams,$timeout,$state){
		var id=$stateParams.id;
		$scope.imagenes=[];

		$http.get('/apiEvents/'+id).success(function(response){
			
			$scope.Evento=response;
			$scope.imagenes=response.imagen;
			
		});
		$scope.isImage=function(url){
		   	var arr = [ "jpeg", "jpg", "gif", "png" ];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
			for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};

		}
		$scope.isOffice=function(url){
			var arr=["xlsx","xls","docx","doc","pptx","ppt"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};
		}
		$scope.getTypeOffice=function(url){
			var dir="images/office/";
			var arr=["xlsx","xls","docx","doc","pptx","ppt","pdf","zip","rar"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			dir=dir+arr[i]+'.png';
		   		}
		   	};
		   	if (dir=="images/office/") {
		   		dir=dir+'unknow.png';
		   	};
		   	return dir;
		}
		$scope.isVideo=function(url){
		   	var arr = [ "mp4", "flv", "3gp", "wmv" ];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
			for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}
		   	};
		}
		$scope.isCompress=function(url){
			var arr=["rar","zip","tar"];
		   	var ext = url.substring(url.lastIndexOf(".")+1);
		   	for (var i = 0; i < arr.length; i++) {
		   		if(ext==arr[i]){
		   			return true;
		   		}

		   	};
		}
		$scope.isPdf=function(url){
		   	var ext = url.substring(url.lastIndexOf(".")+1);
	   		if(ext=="pdf"){
	   			return true;
	   		}
		}
		
	});

