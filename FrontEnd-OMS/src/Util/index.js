let deb = false;

export const debounce = (time = 1000 , fn) => {
    return () => {
        if(deb) return;
        deb = true;
        setTimeout(() => {
            deb = false;
            fn();
        }, time)
    }
}


export function throttle(func, delay, args) {
    let lastCall = 0;
    return function () {
        const now = new Date().getTime();

        if (now - lastCall < delay) {
            return;
        }

        lastCall = now;
        return func(args);
    };
}