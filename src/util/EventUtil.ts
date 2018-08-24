export class EventUtil {
    private static observable = $({});

    /**
     * Subscribe to an event
     */
    public static subscribe = function (...args : any[]) {
        EventUtil.observable.on.apply(EventUtil.observable, args);
    };

    /**
     * unsubscribe to an event
     */
    public static unsubscribe = function (...args: any[]) {
        EventUtil.observable.off.apply(EventUtil.observable, args);
    };

    /**
     * publish an event
     */
    public static publish = function (...args: any[]) {
        EventUtil.observable.trigger.apply(EventUtil.observable, args);
    };
}