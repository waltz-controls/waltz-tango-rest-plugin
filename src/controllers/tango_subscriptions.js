import {Controller} from "@waltz-controls/middleware";
import {kUser} from "../context";
import {Subscriptions} from "@waltz-controls/tango-rest-client";

const kControllerTangoSubscriptions = "controller:tango_subscriptions";
/**
 * Context id
 *
 * @type {string}
 */
export const kContextTangoSubscriptions = "context:tango_subscriptions";

/**
 * Initializes Tango Subscriptions Waltz context. Requires kUser context
 */
export class TangoSubscriptionsController extends Controller {
    constructor(app) {
        super(kControllerTangoSubscriptions, app);
    }

    /**
     * Initializes Tango Subscriptions Waltz context. Requires kUser context
     *
     * @return {Promise<void>}
     */
    async run(){
        const user = await this.app.getContext(kUser);
        this.app.registerContext(kContextTangoSubscriptions,  new Subscriptions('',{
            headers:{
                ...user.headers
            }
        }));
    }
}