<script lang="ts">
	import { onMount } from 'svelte';
	import { regexImage, getImgUrl } from '$lib/image';
	import type { Log } from './proxy+page.server';

	export let entries: Log[];

	let confirmed = -1;

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
		if (box.url === null) return;

		confirmed = i;
		navigator.clipboard.writeText(box.url);
		setTimeout(() => (confirmed = -1), 700);
	}
</script>

<aside class="h-96 lg:h-[35rem] w-full carousel carousel-vertical carousel-end rounded-lg bg-neutral p-1.5">
	{#if entries.length === 0}
		<div class="divider">No boxes have been ticked</div>
	{/if}
	{#each entries as log, i}
		{#if newDay(log, i)}
			<div class="divider">{log.time.toLocaleDateString()}</div>
		{/if}
		<div class="chat {log.self ? 'chat-end grid-cols-[1fr,auto,auto]' : 'chat-start grid-cols-[auto,1fr,auto]'}">
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
				<div class="chat-bubble chat-bubble-secondary">
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
					<button class="btn btn-square btn-error btn-outline btn-sm">
						<i class="bx bx-comment-error text-lg" />
					</button>
					<button class="btn btn-square btn-ghost btn-outline btn-sm" on:click={() => copyLink(log, i)}>
						<i class="bx {confirmed === i ? 'bx-check text-xl' : 'bx-copy text-lg'}" />
					</button>
				</div>
			{/if}
		</div>
	{/each}
</aside>
