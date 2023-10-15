import type postgres from "postgres";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals { sql: postgres.Sql<> }
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
