console.log('Pre-request script from request start');

if (pm.request.method !== 'GET' && !(pm.request.headers.has('x-csrf-token'))){
    var csrfRequest = pm.request.clone();
    csrfRequest.method = 'GET';
    if (pm.request.method === 'POST'){
        csrfRequest.url = pm.request.url + '?$top=1';
    }
    
    csrfRequest.upsertHeader({
        key: 'x-csrf-token',
        value: 'fetch'
    });
    
    pm.sendRequest(csrfRequest, function(err, resp){
        console.log('pm.sendRequest start');
        if (err){
            console.log(err);
        } else {
            var csrfToken = resp.headers.get('x-csrf-token');
            if(csrfToken){
                console.log('csrfToken fetched: ' + csrfToken);
                pm.request.headers.upsert({
                    key: 'x-csrf-token',
                    value: csrfToken
                });
            } else {
                console.log('No csrf token fetched');
            }
        }
        console.log('pm.sendRequest end');
    });
}

console.log('Pre-request script from request end');
