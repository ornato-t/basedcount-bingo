<script lang="ts">
	import { enhance } from '$app/forms';
	import { getRelativeDate, isFinished } from './forcedNewRound';
	import { browser } from '$app/environment';

	export let time: Date;

	let displayed = relativeDate(time);
	$: finished = isFinished(displayed);

	const interval = setInterval(() => (displayed = relativeDate(time)), 1000);

	function relativeDate(roundStart: Date) {
		const diff = getRelativeDate(roundStart);

		if (finished && browser) {	//If on browser and duration is up, clear the interval and start a new round
			clearInterval(interval);
			const form = document.querySelector('form[action="?/forceNewRound"]')!;
			//@ts-ignore
			form.submit();
		}

		return diff;
	}
</script>

{#if finished}
	Round is being automatically terminated...
{:else}
	The current round will end in
	<div class="flex gap-5">
		<div>
			<span class="countdown font-mono text-3xl">
				<span style="--value:{Math.round(displayed.days)};" />
			</span>
			days
		</div>
		<div>
			<span class="countdown font-mono text-3xl">
				<span style="--value:{Math.round(displayed.hours)};" />
			</span>
			hours
		</div>
		<div>
			<span class="countdown font-mono text-3xl">
				<span style="--value:{Math.round(displayed.minutes)};" />
			</span>
			min
		</div>
		<div>
			<span class="countdown font-mono text-3xl">
				<span style="--value:{Math.round(displayed.seconds)};" />
			</span>
			sec
		</div>
	</div>
{/if}

<form action="?/forceNewRound" method="post" use:enhance class="hidden" />
