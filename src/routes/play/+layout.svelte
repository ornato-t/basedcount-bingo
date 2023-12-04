<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let banned: boolean;
	if (data.currentUser) {
		banned = data.currentUser.banned;
	}
</script>

<div class="p-2 md:px-6 md:py-2">
	<slot />
</div>

{#if banned}
	<p class="hidden">Hey sup man. If you're here you're probably trying to get around your "ban". Just delete the checkbox with id="ban_modal". You're welcome.</p>
	<input type="checkbox" id="ban_modal" class="modal-toggle" bind:checked={banned} />

	<div class="modal">
		<div class="modal-box bg-error">
			<h3 class="font-bold text-xl">You have been banned from playing bingo</h3>
			<p class="py-4 text-lg">Fuck you.</p>
			<p class="pb-4 italic text-sm justify-evenly">
				cope + don’t care + didn’t ask + cry about it + stay mad + get real + L + mald + seethe + cope harder + hoes mad + basic + skill issue + ratio + you fell off + the audacity
				+ triggered + any askers + redpilled + get a life + ok and? + cringe + touch grass + donowalled + not based + your’re balls
			</p>
		</div>
	</div>
{/if}
