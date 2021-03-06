// getting places from APIs
// function loadPlaces(position) {
function loadPlaces(position) {
    // const params = {
    //     radius: 300,    // search places not farther than this value (in meters)
    //     clientId: '<YOUR-CLIENT-ID>',
    //     clientSecret: 'YOUR-CLIENT-SECRET',
    //     version: '20300101',    // foursquare versioning, required but unuseful for this demo
    // };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API (limit param: number of maximum places to fetch)
    // const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
    //     &ll=${position.latitude},${position.longitude}
    //     &radius=${params.radius}
    //     &client_id=${params.clientId}
    //     &client_secret=${params.clientSecret}
    //     &limit=30 
    //     &v=${params.version}`;
    //way["shop"](43.46669501043081,-5.708215989569187,43.588927989569186,-5.605835010430813)->.a1;foreach.a1(convert node ::=::, ::geom = geom(),::id = id(), tileId = 0;out geom;)
    
    var x1 = position.latitude - 0.01 
    var y1 = position.longitude- 0.01 
    var x2 = position.latitude + 0.01 
    var y2 = position.longitude + 0.01 

    
    const endpoint = 'https://www.overpass-api.de/api/interpreter?data=[out:json];node["shop"](' + x1 + ','+ y1 +',' + x2 + ',' + y2+ ');out%20meta;';
     console.log(endpoint)



    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    var places = resp.elements 
                    return places
                    //console.log(resp.elements)
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

// 52.187229 21.014796
window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                console.info(places)
                // const icon = document.createElement('a-image');
                places.forEach((place) => {
                    const latitude = place.lat;
                    const longitude = place.lon;
                    const info =  JSON.stringify(place.tags);
                    // console.info(latitude, longitude)
                    // console.log(place)
                    // console.log( JSON.stringify(place.tags))
                    // add place name
                    const placeText = document.createElement('a-circle');
                    // placeText.setAttribute('rotation', '-90 0 0')
                    // placeText.setAttribute('src', '../assets/map-marker.png');
                    placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    placeText.setAttribute('title', place.tags.name );
                    placeText.setAttribute('titleColor', 'black');
                    placeText.setAttribute('look-at', '[gps-camera]');
                    placeText.setAttribute('scale', '10 10 10');
                    placeText.setAttribute('clickhandler','');
                    placeText.setAttribute('contentText', info);
                    
                    console.info(placeText.getAttributeNames())

                    console.log('funny log')

                    console.log('funny log')

                    console.warn('not funny')
                    console.warn('funny again')
                    // placeText.setAttribute('backgroundColor', 'green');
                    // placeText.setAttribute('borderColer', 'yellow');
              
                    // placeText.setAttribute('title', placeText.getAttribute('distanceMsg'));
                    placeText.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded') , { detail: { component: this.el }})
                    });

                    
                    const clickListener = function (ev) {
                        ev.stopPropagation();
                        ev.preventDefault();
            
                        const name = ev.target.getAttribute('name');
            
                        const el = ev.detail.intersection && ev.detail.intersection.object.el;
            
                        if (el && el === ev.target) {
                            const label = document.createElement('span');
                            const container = document.createElement('div');
                            container.setAttribute('id', 'place-label');
                            label.innerText = name;
                            container.appendChild(label);
                            document.body.appendChild(container);
            
                            setTimeout(() => {
                                container.parentElement.removeChild(container);
                            }, 1500);
                        }
                    };

                    placeText.addEventListener('click', clickListener);

                    scene.appendChild(placeText);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};