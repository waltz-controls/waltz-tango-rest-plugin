import {Controller} from "@waltz-controls/middleware";
import {TangoRestApi, TangoRestApiRequest} from "@waltz-controls/tango-rest-client";
import {kUser} from "../context";
import {map, mergeMap, share, switchMap} from "rxjs/operators";
import {EMPTY, from} from "rxjs";
import {Pollable} from "../models/tango";

/**
 * Controller id
 *
 * @type {string}
 */
export const kControllerTangoTest = 'controller:tango_test';
/**
 * Context id
 *
 * @type {string}
 */
export const kTangoRestContext = 'context:tango_rest';

/**
 * Middleware channel id
 *
 * @type {string}
 */
export const kChannelTangoRest = "channel:tango_rest";

class DecoratedTangoRestApiRequest extends TangoRestApiRequest {
    constructor(request, middleware) {
        super(request.url,request.options);
        this.middleware = middleware;
    }

    get(what, options = {}){
        const request = super.get(what, options).pipe(
            share()
        );
        this.middleware.dispatchObservable('req',kChannelTangoRest, request);
        return request;
    }

    put(what, data, options = {}){
        const request = super.put(what, data, options).pipe(
            share()
        );
        this.middleware.dispatchObservable('req',kChannelTangoRest, request);
        return request;
    }

    post(what, data, options = {}){
        const request = super.post(what, data, options).pipe(
            share()
        );
        this.middleware.dispatchObservable('req',kChannelTangoRest, request);
        return request;
    }

    delete(what){
        const request = super.delete(what).pipe(
            share()
        );
        this.middleware.dispatchObservable('req',kChannelTangoRest, request);
        return request;
    }
}

class DecoratedTangoRestApi extends TangoRestApi {
    constructor(host = '', options = {}, middleware) {
        super(host, options);
        this.middleware = middleware;
    }

    toTangoRestApiRequest() {
        return new DecoratedTangoRestApiRequest(super.toTangoRestApiRequest(), this.middleware);
    }

    //TODO new decorated TangoXXX
}

/**
 * Initializes TangoRest context for Waltz. Requires kUser context
 *
 */
export class TangoRestController extends Controller {
    constructor(app) {
        super(kControllerTangoTest, app);
    }

    /**
     * Initializes TangoRest context for Waltz. Requires kUser context
     *
     * @return {Promise<void>}
     */
    async run(){
        const user = await this.app.getContext(kUser);
        this.app.registerContext(kTangoRestContext, new DecoratedTangoRestApi('',{
            // mode:'cors',
            headers:{
                ...user.headers
            }
        }, this.middleware))
    }

}

/**
 * Helper function that loads pollStatus from a rest tango device
 *
 * @param {TangoDevice} device
 * @return {Observable<Pollable>}
 */
export function pollStatus(device){
    return device.admin().pipe(
        mergeMap(admin => admin.devPollStatus(device.name)),
        mergeMap(resp => from(resp.output)),
        map(Pollable.fromDevPollStatus),
        share()
    );
}


/**
 *
 * @param {TangoDevice} device
 * @param {Pollable} pollable
 * @param {boolean} polled
 * @param {number} poll_rate
 * @return {Observable<any>}
 */
export function updatePolling(device, pollable, polled, poll_rate = 0){
    return device.admin().pipe(
        switchMap(admin => {
            if (polled)
                if (!pollable.polled)
                    return admin.addObjPolling({
                        lvalue: [poll_rate],
                        svalue: [device.name, pollable.polling_type, pollable.name]
                    });
                else
                    return admin.updObjPollingPeriod({
                        lvalue: [poll_rate],
                        svalue: [device.name, pollable.polling_type, pollable.name]
                    });
            else if (pollable.polled)
                return admin.remObjPolling([device.name, pollable.polling_type, pollable.name]);
            else
                return EMPTY;
        })
    );
}