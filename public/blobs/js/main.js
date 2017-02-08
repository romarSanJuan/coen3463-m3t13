function getSearch() {
	localStorage.setItem("search", document.getElementById('search').value);
}

if (window.location.pathname === '/blobs/') {

	if (localStorage.getItem("search") === 'null') {

		  fetch('../api/v1/Blob?sort=date').then(function(res) {
		    res.json().then(function(Blob) {	
		      console.log('Blob', Blob);
		      var tbody = document.getElementById('table-body');
		      Blob.forEach(function(Blob) {
		        tbody.insertAdjacentHTML('beforeend', '<tr><td><a href="/blobs/' + Blob._id + '">'
		         + Blob.name + '</td><td>' + Blob.locale + ' </td><td>' 
		         + Blob.established + ' </td><td>' + Blob.date + ' </td><td></td></tr>');

		      });
		    })
		  });

		  fetch('../api/v1/Blob/count').then(function(res){
				res.json().then(function(count){
					console.log('count', count)
					var totalCount = document.getElementById('totalCount');
					setTimeout(function() {
						totalCount.innerHTML = count.count;
					}, 500)
					
				});
			});
	}	  
	if (localStorage.getItem("search") !== 'null') {
		fetch('../api/v1/Blob?query={"name":"~(' + localStorage.getItem("search") + ')"}').then(function(res) {
			res.json().then(function(result) {
				if (result.length === 1) {
					document.getElementById('totalCount').innerHTML = " Found " + result.length +
				" entry ";
				}
				else {
					document.getElementById('totalCount').innerHTML = " Found " + result.length +
				" entries ";
				}
				
				var tbody = document.getElementById('table-body');
				result.forEach(function(result) {
				 tbody.insertAdjacentHTML('beforeend', '<tr><td><a href="/blobs/' + result._id + '">'
		         + result.name + '</td><td>' + result.locale + ' </td><td>' 
		         + result.established + ' </td><td>' + result.date + ' </td><td></tr>');

				});
				localStorage.setItem("search", null);
			});
		});
	}
}