export const sleep = (time = 0) => {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};
