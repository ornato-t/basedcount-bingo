import type User from "$lib/userType";
import type { Collection } from "mongodb";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals { users: Collection<User> }
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
