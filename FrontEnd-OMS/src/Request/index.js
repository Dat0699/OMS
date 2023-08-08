function process(method, url, body, header, opt) {
        const req = new XMLHttpRequest();

        const optObj = opt || {};
        const {downloadProgressCB} = optObj;
        if(downloadProgressCB) {
            req.onprogress = function(data) {
                downloadProgressCB(data);
            };
        }

        const {uploadProgressCB} = optObj;
        if(uploadProgressCB) {
            req.upload.onprogress = function(data) {
                uploadProgressCB(data);
            };
        }

        const { responseType } = optObj;
        if(responseType) {
            req.responseType = responseType;
        }

        req.onreadystatechange = async function() {
            const state = req.readyState;
            if(state === XMLHttpRequest.DONE) {
                const success = req.status === 200;

                // console.log("Req: ", req);
                let rsObj = false;
                if(responseType === 'blob') {
                    rsObj = { success };

                } else if(responseType === 'arraybuffer') {
                    rsObj = { success, arrayBuffer: req.response };
                }

                if(rsObj) {
	                // eslint-disable-next-line no-use-before-define
	                const blob = (optObj.blobURL||optObj.blobLink) ? getBlobLink(req.response) : req.response;
                    rsObj.blob = blob;
                }
                // Send last signal
                if(downloadProgressCB) {
                    try {
                        const length = req?.response?.byteLength || req?.response?.length || 0;
                        if(length <= 0) {
                            downloadProgressCB({loaded: 0, total: length});
                        }
                    // eslint-disable-next-line no-empty
                    } catch(e) { }
                }

                if(optObj.saveFile) {
                    // eslint-disable-next-line no-use-before-define
                    saveBlobFile(rsObj?.blob || req.response, optObj.saveFile);
                }

                if(rsObj) {
                    return cb(rsObj);
                }

                let rs = req.responseText;
                try {
                    rs = JSON.parse(rs);
                    // eslint-disable-next-line no-empty
                } catch(e) {}


                if(!success || (!rs || rs.code !== 200)) {
                    Util.processFailedResult((rs||{}).message || (rs||{}).data || (rs||{}).msg);

                } else {
                    // Collect cached data
                    // (response, reqMethod, reqUrl, resData)
                    await inspection.collect({url, data: body}, method, url, rs);
                }

                cb(rs);
                // console.log("Request finished: ", req);
            }
        };

        try {
	        req.open(method||'GET', reqUrl, true);

            const token = Auth.getToken();
            if(token) {
                req.setRequestHeader(Auth.CONFIG.storageTokenHeader, token);
            }

            let hasContentType = false;
            if(header && (typeof header === 'object')) {
                if(!Array.isArray(header)) {
                    const ks = Object.keys(header);
                    // eslint-disable-next-line array-callback-return
                    ks.map(k => {
                        if(['Content-Type', 'content-type'].indexOf(k) >= 0) {
                            hasContentType = header[k];

                        } else {
                            req.setRequestHeader(k, header[k]);
                        }
                    });
                }
            }


            let reqBody = inspection.getTranslateData(method, reqUrl, body || null);
            if(body && (typeof body === 'object')) {
                const typeName = body.constructor.name;
                if(Array.isArray(body) || (typeName === 'Object')) {
                    if(!hasContentType) {
	                    req.setRequestHeader('Content-Type', 'application/json');
	                }
                    
                	reqBody = JSON.stringify(reqBody);

                } else if(hasContentType) {
                    req.setRequestHeader('Content-Type', hasContentType);
                }
            }

            if(opt) {
                const keys = Object.keys(opt);
                keys.map(k => {
                    if(['responseType', 'saveFile', 'blobLink', 'blobURL', 'downloadProgressCB', 'uploadProgressCB'].indexOf(k) < 0) {
                    	req[k] = opt[k];
                    }
                });
            }

            // ------------- Send Request
            req.send(reqBody);

        } catch(e) {
            console.log('Request Exception: ', e);
        }
}

async function POST(url, body, header, opt) {
    return await process('POST', url, body, header, opt);
}

async function GET(url, body, header, opt) {
    return await process('GET', url, body, header, opt);
}

async function PUT(url, body, header, opt) {
    return await process('PUT', url, body, header, opt);
}

async function DELETE(url, body, header, opt) {
    return await process('DELETE', url, body, header, opt);
}

async function PATCH(url, body, header, opt) {
    return await process('PATCH', url, body, header, opt);
}

export const saveBlobFile = function(blob, fileName) {
    const blobURL = getBlobLink(blob);
    if(!blobURL) return;

    // console.log('Download Document: ', blobURL);
    const link = document.createElement('a');
    link.href = blobURL;
    link.download = fileName;
    document.body.appendChild(link);

    link.click();

    window.setTimeout(function() {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobURL);
    }, 2400);
};