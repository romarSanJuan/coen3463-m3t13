if (window.location.pathname === '/blobs') {

	fetch('api/v1/Blob').then(function(res) {
		res.json().then(function(Blob) {
			console.log('Blob', Blob);
			var tbody = document.getElementById('data');
			setTimeout(function() {
				Blob.forEach(function(Blob) {
	        	tbody.insertAdjacentHTML('beforeend', '<tr><td>' + Blob.name + '</td><td>' +
	        		Blob.locale + '</td><td>' +
	        		Blob.established + '</td></tr>');
	      	});
	      }, 1500);
	    })
	 });
}