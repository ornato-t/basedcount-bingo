<script lang="ts">
	import { onMount } from 'svelte';
	import { regexImage, getImgUrl } from '$lib/image';
	import type { Log } from '$lib/log';
	import { enhance } from '$app/forms';
	import { hoverBox } from '$lib/hoverBoxStore';
	import Counter from './counter.svelte';

	export let entries: Log[];
	export let token: string;
	export let round: { number: number; start_time: Date };

	let confirmed: number | null;
	let contesting: Log = entries[0];

	onMount(() => {
		const element = document.querySelector('.carousel-vertical')!;
		element.scrollTop = element.scrollHeight;
	});

	function newDay(entry: Log, i: number): boolean {
		if (i === 0) return true;

		const prev = entries[i - 1];
		if (entry.time.getDay() !== prev.time.getDay()) return true;

		return false;
	}

	function copyLink(box: Log, i: number) {
		confirmed = i;
		navigator.clipboard.writeText(box.url);
		setTimeout(() => (confirmed = null), 700);
	}
</script>

<aside class="h-96 lg:h-[35rem] w-full carousel carousel-vertical carousel-end rounded-lg bg-neutral pb-1.5">
	<div class="bg-neutral-focus sticky top-0 z-10 mx-auto w-full grid place-items-center px-2 py-1.5 gap-y-1">
		<Counter time={round.start_time} />
	</div>
	<div class="mx-auto mt-1.5 -mb-1 font-mono">Round begun on {round.start_time.toLocaleString()}</div>
	{#if entries.length === 0}
		<div class="mx-auto my-auto opacity-70">No boxes have been checked</div>
	{/if}
	{#each entries as log, i}
		{#if newDay(log, i)}
			<div class="divider mx-1.5">{log.time.toLocaleDateString()}</div>
		{/if}
		<div class="chat mx-1.5 {log.self ? 'chat-end grid-cols-[1fr,auto,auto]' : 'chat-start grid-cols-[auto,1fr,auto]'}">
			<div class="chat-image avatar">
				<div class="w-10 rounded-full">
					<img src={log.image} alt="{log.name}'s avatar" />
				</div>
			</div>
			<div class="chat-header">
				{log.name}
				<time class="text-xs opacity-50">{log.time.toLocaleTimeString()}</time>
			</div>
			{#if log.type === 'check'}
				<div class="chat-bubble chat-bubble-secondary" role="tooltip" on:mouseenter={() => hoverBox.set(log.box_id)} on:mouseleave={() => hoverBox.set(null)}>
					{#if regexImage.test(log.text)}
						<img src={getImgUrl(log)} alt={log.text} class="h-24 rounded-md" />
					{:else}
						{log.text}
					{/if}
				</div>
			{:else}
				<div class="chat-bubble chat-bubble-accent uppercase">bingo!</div>
			{/if}
			{#if !log.self && log.type === 'check'}
				<div class="self-end flex flex-row gap-1.5 mb-1.5">
					<!-- svelte-ignore missing-declaration -->
					<button
						class="btn btn-square btn-error btn-outline btn-sm"
						title="Contest box"
						on:click={() => {
							contesting = log;
							// @ts-ignore
							contestBox.showModal();
						}}
					>
						<i class="bx bx-comment-error text-lg" />
					</button>
					<button class="btn btn-square btn-ghost btn-outline btn-sm" on:click={() => copyLink(log, i)} title="Copy message link">
						<i class="bx {confirmed === i ? 'bx-check text-xl' : 'bx-copy text-lg'}" />
					</button>
				</div>
			{/if}
		</div>
	{/each}
</aside>

{#if entries.length > 0}
	<dialog id="contestBox" class="modal">
		<div class="modal-box max-w-md">
			<h3 class="font-bold text-lg">Provide a reason</h3>

			<p class="pt-4">
				You are contesting
				<span class="font-mono">{contesting.name}</span>
				checked the following box:
			</p>
			{#if regexImage.test(contesting.text)}
				<div class="py-4 grid place-items-center w-full h-full">
					<img class="h-36" src={getImgUrl(contesting)} alt={getImgUrl(contesting)} />
				</div>
			{:else}
				<p class="pl-2 py-4 font-mono">{contesting.text}</p>
			{/if}
			<p>Enter your complaint below. It will be sent on Discord and relayed to the admins.</p>

			<!-- svelte-ignore missing-declaration -->
			<form
				method="post"
				action="?/contest"
				class="modal-action flex flex-col"
				use:enhance
				on:submit={() => {
					// @ts-ignore
					contestBox.close();
				}}
			>
				<textarea
					name="reason"
					class="textarea textarea-bordered"
					placeholder="This box shouldn't have been checked because..."
					required
					autocapitalize="off"
					autocorrect="off"
					autosave="off"
				/>
				<input name="token" type="hidden" value={token} />
				<input name="box" type="hidden" value={contesting.box_id} />
				<input name="checker" type="hidden" value={contesting.discord_id} />
				<input name="url" type="hidden" value={contesting.url} />

				<div class="mt-8 modal-action">
					<!-- svelte-ignore missing-declaration -->
					<button
						class="btn btn-secondary btn-outline"
						type="button"
						on:click={() => {
							// @ts-ignore
							contestBox.close();
						}}
					>
						Close
					</button>
					<button type="submit" class="btn btn-secondary"> Confirm </button>
				</div>
			</form>
		</div>
	</dialog>
{/if}
