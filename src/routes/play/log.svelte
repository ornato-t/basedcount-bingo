<script lang="ts">
	import { onMount } from 'svelte';
	import type { Log } from './proxy+page.server';

	export let entries: Log[];

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
</script>

<aside class="h-96 lg:h-[35rem] w-full carousel carousel-vertical carousel-end rounded-lg bg-neutral p-1.5">
	{#if entries.length === 0}
		<div class="divider">No boxes have been ticked</div>
	{/if}
	{#each entries as log, i}
		{#if newDay(log, i)}
			<div class="divider">{log.time.toLocaleDateString()}</div>
		{/if}
		<div class="chat {log.self ? 'chat-end' : 'chat-start'}">
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
					{log.text}
				</div>
			{:else}
				<div class="chat-bubble chat-bubble-accent uppercase">bingo!</div>
			{/if}
		</div>
	{/each}
</aside>
