export default class Navigation {

	static onPopState = false;

	static popTimer = false;

	/**
     * @typedef {Object} NavigationRouteProps
     * @property {string} path
     * @property {any} state
     * @param {NavigationRouteProps} routeProps
     */
	static createRouteChangeEvent(routeProps) {
	    const { path, state, type } = routeProps;
	    return new CustomEvent('route', {
	        detail: {
	            type,
	            path,
	            state
	        }
	    });
	}

	static checkRedirect() {
	    return !window.zlockRedirect;
	}

	static zstacks = [];

	static hasLocked = false;

	static checkHasLoopBack(path) {
	    const stacks = Navigation.zstacks;
	    const now = new Date();

	    let count = 0;
	    for (let i = 0; i < stacks.length; i++) {
	        const u1 = stacks[i];
	        if(u1.link === path) {
	            if(now - u1.time <= 650) {
	                count++;
	            }
	        }
	    }

	    const first = stacks?.[0];
	    if(first?.link !== path) {
	        stacks.unshift({ time: now, link: path });
	    	stacks.splice(4, 100000);

	    } else {
	        first.time = now;
	    }

	    if(count >= 2) {
	        // Lock Navigation in 3 seconds
	        console.log('[PMS] Locked Loop ----------------: ', count, stacks);
	        Navigation.hasLocked = true;
	        window.setTimeout(() => {
	            Navigation.hasLocked = false;
	        }, 2250);

	        return true;
	    }

	    return false;
	}

	/**
     * @param {string} to
     * @param {any} state
     */
	static push(to, state, ignoreCheck) {
	    // console.log("On Push --------------------- : ", to, " :: ", state, " :: ", ignoreCheck);
	    // console.log('to ------------>', to);
	    // console.trace();
	    if (!window && !Navigation.checkRedirect()) return;
	    if (Navigation.onPopState) return;
	    if (Navigation.hasLocked) return;

	    const url = window.location;
	    const {origin} = url;
	    let path = url.pathname;

	    if(path.endsWith('/')) path = path.substr(0, path.length-1);

	    let npath = to.replace(origin, '');
	    if (Navigation.checkHasLoopBack(npath)) return;

	    // eslint-disable-next-line prefer-destructuring
	    npath = npath.split('?')[0];
	    if(npath.endsWith('/')) npath = npath.substr(0, npath.length-1);

	    if((path+url.search) === to) {
	        // console.log('--------- Same URL', to);
	        return;
	    }

	    // console.log("Push: ", to);
	    if(!ignoreCheck) {
	        if(path === npath) {
	            // window.history.replaceState({}, null, to);
	            // console.log('--------- Same PathName', path);
	            const event = this.createRouteChangeEvent({ path: to, state, type: 'replace' });
		        window.dispatchEvent(event);
	            return;
	        }
	    }

	    // window.history.pushState({}, null, to);
	    const type = (path === npath) ? 'replace' : 'push';

	    const now = new Date();
	    const deltaPush = now - (window.zLastPush||0);
	    window.zLastPush = now;

	    if(ignoreCheck || (deltaPush > 250)) { // 1 second
	        const event = this.createRouteChangeEvent({ path: to, state, type });
	        window.dispatchEvent(event);
	    }
	    // console.log("PUSH: ", npath, window.location.pathname,  deltaPush);
	}

	static goBack() {
	    if (!window) return;
	    const event = this.createRouteChangeEvent({ type: 'goBack' });
	    window.dispatchEvent(event);
	}
}

window.anav = Navigation;
window.onpopstate = function() {
    // console.log("On Pop state, ", window.history.length);
    Navigation.onPopState = true;

    window.clearTimeout(Navigation.popTimer);
    Navigation.popTimer = window.setTimeout(() => {
	  Navigation.onPopState = false;
    }, 720);
};
