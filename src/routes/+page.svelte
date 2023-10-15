<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import oauthUrl from '../lib/oauthUrl';

	export let data: PageData;

	function getLogin() {
		if (!browser) return; //Necessary for UUID generation

		const scopes = ['guilds.members.read'].join('%20');
		const state = self.crypto.randomUUID(); //TODO: verify state
		const redirect = oauthUrl;
		const url = `https://discord.com/oauth2/authorize?response_type=code&client_id=${data.discordId}&scope=${scopes}&state=${state}&redirect_uri=${redirect}`;

		return url;
	}
</script>

<div class="hero">
	<div class="hero-overlay bg-opacity-80" />
	<div class="hero-content text-center rounded-2xl">
		<div class="max-w-lg">
			<h1 class="mb-5 text-5xl font-bold">Welcome</h1>
			<p class="mb-2">Enter the fray of the Based Count Discord, where being terminally online is not a choice, but a challenge.</p>
			<p />
			<p class="mb-7">Tread carefully, for pure retardation awaits you beyond this point.</p>
			{#if data.id !== null}
				<a class="btn btn-primary btn-lg" href="/play">
					<i class="bx bx-play bx-sm" />
					play
				</a>
			{:else}
				<a class="btn btn-primary btn-lg" href={getLogin()}>
					<i class="bx bxl-discord-alt bx-sm" />
					enter with discord
				</a>
			{/if}
		</div>
	</div>
</div>
