<script lang="ts">
	import type { User } from '$lib/user';

	export let token: string;
	export let users: User[];

	let selectedUser: User;
	let selectedUserList = new Set<User>();

	function addSelectedUser() {
		selectedUserList = new Set([...selectedUserList, selectedUser]);
	}

	function removeSelectedUser(user: User) {
        selectedUserList = new Set([...selectedUserList].filter(item => item !== user));
	}

    $: winners = [...selectedUserList].map(el => el.discord_id).join(';');
</script>

<dialog id="closeRound" class="modal">
	<div class="modal-box max-w-[30rem]">
		<h3 class="font-bold text-lg">Are you sure about that?</h3>

		<p class="py-4">You are trying to close the current round and start a new one.</p>

		<div class="min-h-[12.5rem]">
			<p>Select the winners of the round, if any.</p>
			<p>If the round ended inconclusively don't select any winners.</p>

			<select class="select select-primary w-full max-w-full mt-4" bind:value={selectedUser} on:change={addSelectedUser}>
				<option value="default" disabled selected>Select a winner</option>
				{#each users as user}
					<option value={user}>
						{user.name}
					</option>
				{/each}
			</select>
			<div class="grid my-2 gap-y-2">
				{#each selectedUserList as user}
					<span class="flex items-center">
						<button on:click={() => removeSelectedUser(user)}>
							<i class="bx bx-x text-error text-xl" />
						</button>
						<div class="avatar px-2">
							<div class="w-6 rounded-full">
								<img src={user.image} alt="{user.name}'s avatar" />
							</div>
						</div>
						{user.name}
					</span>
				{/each}
			</div>
		</div>

		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-secondary btn-outline">Close</button>
			</form>

			<form method="POST" action="?/startNewRound">
				<button type="submit" class="btn btn-secondary"> Start a new round </button>
				<input name="token" type="hidden" value={token} />
				<input name="winners" type="hidden" value={winners} />
			</form>
		</div>
	</div>
</dialog>
