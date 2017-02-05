if (window.location.pathname === '/blobs') {

	fetch('api/v1/Blob').then(function(res) {
		res.json().then(function(blobs) {
			console.log('blobs', blobs);
			var tbody = document.getElementById('data');
			setTimeout(function() {
				Blob.forEach(function(blob) {
	        	tbody.insertAdjacentHTML('beforeend', '<tr><td>' + blobs.name + '</td><td>' + blobs.locale + '</td><td>' + blobs.established + '</td></tr>');
	      	});
	      });
	    })
	 });
}