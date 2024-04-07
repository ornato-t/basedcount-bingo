<script lang="ts">
	import { regexImage, getImgUrl } from '$lib/image';
	import { enhance } from '$app/forms';
	import type { LogContestation } from '$lib/log';
	import type { CurrentUser } from '../+layout.server';

	export let token: string;
	export let contestation: LogContestation;
	export let round: number;
	export let currentUser: CurrentUser;

	let ownVote: boolean;

	$: voteAgainst = getVoters(contestation, ownVote, true);
	$: voteFavour = getVoters(contestation, ownVote, false);

	function getVoters(log: LogContestation, ownVote: boolean, match: boolean): { discord_id: string; name: string; image: string }[] {
		let votes = log.votes
			.filter((el) => el.vote === match)
			.map((el) => ({
				discord_id: el.voter_discord_id,
				name: el.voter_name,
				image: el.voter_image
			}));
        
		if (ownVote === match && !votes.some((v) => v.discord_id === currentUser.discord_id)) {
			votes.push({
				discord_id: currentUser.discord_id,
				name: currentUser.name,
				image: currentUser.image
			});
		} else if (ownVote && ownVote !== match) {
            votes = votes.filter(v => v.discord_id !== currentUser.discord_id);
        }

		return votes;
	}
</script>

<dialog id="contestVoteBox" class="modal">
	<div class="modal-box max-w-xl">
		<h3 class="font-bold text-lg">Vote a contestation</h3>

		<p class="pt-4">
			<span class="font-mono">{contestation.name}</span>
			contests
			<span class="font-mono">{contestation.box_checker_name}</span>
			checking the following box:
		</p>
		{#if regexImage.test(contestation.text)}
			<div class="py-3 grid place-items-center w-full h-full">
				<img class="h-36" src={getImgUrl(contestation)} alt={getImgUrl(contestation)} />
			</div>
		{:else}
			<p class="pl-2 pt-3 font-mono">{contestation.text}</p>
		{/if}
		<p class="pt-3 pb-6">
			Reason provided:
			<br />
			<span class="pl-2 font-mono">{contestation.reason}</span>
		</p>

		<p>Cast your vote below.</p>

		<!-- svelte-ignore missing-declaration -->
		<form
			method="post"
			action="?/contestVote"
			class="modal-action grid grid-cols-1 gap-1"
			use:enhance
			on:submit={() => {
				// @ts-ignore
				contestVoteBox.close();
			}}
		>
			<div class="flex flex-row w-full">
				<input type="radio" id="radioVote1" name="vote" bind:group={ownVote} value={false} class="hidden" />
				<label for="radioVote1" class="rounded-xl border border-success grid grid-cols-4 flex-grow p-1">
					{#each voteFavour as vote}
						<div class="avatar">
							<div class="w-10 rounded-full">
								<img src={vote.image} alt="{vote.name}'s avatar" />
							</div>
						</div>
					{/each}
				</label>

				<div class="divider divider-horizontal">VS</div>

				<input type="radio" id="radioVote2" name="vote" class="hidden" bind:group={ownVote} value={true} />
				<label for="radioVote2" class="rounded-xl border border-error grid grid-cols-4 flex-grow p-1">
					{#each voteAgainst as vote}
						<div class="avatar">
							<div class="w-10 rounded-full">
								<img src={vote.image} alt="{vote.name}'s avatar" />
							</div>
						</div>
					{/each}
				</label>
			</div>

			<input name="token" type="hidden" value={token} />
			<input name="contester_discord_id" type="hidden" value={contestation.discord_id} />
			<input name="checker_discord_id" type="hidden" value={contestation.box_checker_discord_id} />
			<input name="box_id" type="hidden" value={contestation.box_id} />
			<input name="card_round_number" type="hidden" value={round} />

			<div class="mt-8 modal-action">
				<!-- svelte-ignore missing-declaration -->
				<button
					class="btn btn-secondary btn-outline"
					type="button"
					on:click={() => {
						// @ts-ignore
						contestVoteBox.close();
					}}
				>
					Close
				</button>
				<button type="submit" class="btn btn-secondary"> Confirm </button>
			</div>
		</form>
	</div>
</dialog>
