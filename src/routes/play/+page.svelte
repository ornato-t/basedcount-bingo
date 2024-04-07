<script lang="ts">
	import type { PageData } from './$types';
	import BingoBoard from './bingoBoard.svelte';
	import CloseRoundModal from './closeRoundModal.svelte';
	import Log from './log.svelte';
	import type {Log as Log_t} from '$lib/log'
	import { hideCard } from '$lib/hideCardStore';
	import type { User } from '$lib/user';
	import type { CurrentUser } from '../+layout.server';

	export let data: PageData;

	const currentUserProp = data.currentUser as CurrentUser;

	function getCurrentBingos(users: User[], log: Log_t[]){
		//Extract the discord id of users with a bingo from the log
		const bingoDiscordIds = log.filter(el => el.type === 'bingo').map(el => el.discord_id);

		//Pair discord ids with user data; only select bingo players
		const bingoUsers = users.filter(user => bingoDiscordIds.includes(user.discord_id) && user.player);

		return bingoUsers;
	}
</script>

<main class="grid grid-cols-1 lg:grid-cols-4 gap-y-8 place-items-center lg:place-items-start">
	<section class="w-5/6 lg:w-full mx-auto">
		{#if data.currentUser}
			<div class="card card-compact w-full bg-base-100 shadow-xl image-full">
				{#if data.currentUser.banner}
					<figure><img src={data.currentUser?.banner} alt="" class="object-fill w-full" /></figure>
				{/if}
				<div class="card-body flex flex-row h-40">
					<img src={data.currentUser?.image} alt="" class="rounded-lg row-span-4 h-full" />
					<span class="grid grid-rows-4 lg:grid-rows-3 grid-cols-1 lg:grid-cols-3 w-full">
						<h2 class="card-title row-span-1 col-span-2">
							{data.currentUser?.name ?? ''}
						</h2>
						<span class="justify-self-end order-first lg:order-none">
							<button class="btn btn-square btn-primary {$hideCard ? '' : 'btn-outline'} btn-sm mr-1.5" title="Hide boxes" on:click={() => $hideCard = !$hideCard}>
								<i class="bx bx-hide text-lg" />
							</button>
							<a href="/leaderboard" class="btn btn-square btn-warning btn-outline btn-sm mr-1.5" data-sveltekit-preload-data="off" title="Leaderboard">
								<i class="bx bx-trophy text-lg" />
							</a>
							<a href="/logout" class="btn btn-square btn-error btn-outline btn-sm justify-self-end order-first lg:order-none" data-sveltekit-preload-data="off" title="Logout">
								<i class="bx bx-log-out text-lg" />
							</a>
						</span>
						<p class="col-span-full">
							{data.currentUser?.admin ? 'Admin' : 'Player'}
						</p>
						<p class="col-span-full">
							{data.currentUser?.victories}
							{data.currentUser.victories === 1 ? 'victory' : 'victories'}
						</p>
					</span>
				</div>
			</div>
		{/if}

		<span class="flex flex-col gap-3 mt-3">
			<a href="/play/add" class="btn btn-secondary"> Add a box </a>

			{#if data.currentUser !== null && data.currentUser.admin}
				<!-- svelte-ignore missing-declaration -->
				<button
					class="btn btn-secondary col-span-2"
					on:click={() => {
						// @ts-ignore
						closeRound.showModal();
					}}
				>
					Start a new round
				</button>
			{/if}
		</span>
	</section>

	<BingoBoard boxes={data.cards} token={data.token ?? ''} className={'col-span-2'} />

	<Log entries={data.log} token={data.token ?? ''} round={data.round} currentUser={currentUserProp}/>
</main>

<CloseRoundModal token={data.token ?? ''} users={getCurrentBingos(data.users, data.log)} />
