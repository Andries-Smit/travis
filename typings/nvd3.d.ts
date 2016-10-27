declare namespace nv {
    interface Utils {
        windowResize(listener: (ev: Event) => any): { handle: Function, clear: Function };
    }
}