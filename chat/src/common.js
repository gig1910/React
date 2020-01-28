export function getState(comp, callback) {
    comp.setState(state => callback(state));
}

