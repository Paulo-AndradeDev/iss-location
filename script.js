let latitude, longitude;

			// Map & tiles
			const mymap = L.map('issMap').setView([0, 0], 1);

			
			const tilurl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
			const tiles = L.tileLayer(tilurl, {
		    	maxZoom: 19,
		    	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				}).addTo(mymap);

			// MArker & Custom Icon
			var issIcon = L.icon({
			    iconUrl: 'iss200.png',
			    iconSize: [50, 32],
			    iconAnchor: [25, 16],
				});

			const marker = L.marker([0, 0], {icon: issIcon}).addTo(mymap);


			const api_url = 'https://api.wheretheiss.at/v1/satellites/25544'

			
			async function getISS() {
				const response = await fetch(api_url);
				const data = await response.json();
			
				console.log(data)	

				const { latitude, longitude } = data;

				
				marker.setLatLng([latitude, longitude], 2);
					

				document.getElementById('lat').textContent = latitude;
				document.getElementById('lon').textContent = longitude;

				async function getLocationName(latitude, longitude) {
			    const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
		    try {
		        const response = await fetch(endpoint);
		        if (!response.ok) {
		            throw new Error(`HTTP error! Status: ${response.status}`);
		        }
		        const data = await response.json();
		        return data.display_name;
		    } catch (error) {
		        console.error("There was a problem with the fetch operation:", error.message);
		        return "Localização desconhecida"; // Retorne um valor padrão em caso de erro
		    }
				}


				// Get the location name using the coordinates
		    	const locationName = await getLocationName(latitude, longitude);
		    	document.getElementById('location').textContent = locationName;

			}

			// Obter o modal
			var modal = document.getElementById("videoModal");

			// Obter o elemento <span> que fecha o modal
			var span = document.getElementsByClassName("close")[0];

			// Quando o usuário passa o mouse sobre o ícone, abra o modal
			marker.on('mouseover', function() {
			    modal.style.display = "block";
			});

			// Quando o usuário clica em <span> (x), feche o modal
			span.onclick = function() {
			    modal.style.display = "none";
			}

			// Quando o usuário clica fora do modal, feche-o
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			    }
			}


			function setIconSizeBasedOnZoom() {
		    const zoomLevel = mymap.getZoom();
		    const baseSize = 32; // Base size of the icon at zoom level 1
		    const newSize = baseSize * zoomLevel / 2; // Adjust this formula as needed

		    issIcon = L.icon({
		        iconUrl: 'iss200.png',
		        iconSize: [newSize, newSize * (50 / 32)], // Assuming the original aspect ratio is 50:32
		        iconAnchor: [newSize / 2, newSize * (50 / 64)]
		    });

		    	marker.setIcon(issIcon);
			}

			mymap.on('zoomend', setIconSizeBasedOnZoom);

			setIconSizeBasedOnZoom();


			getISS();

			const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
