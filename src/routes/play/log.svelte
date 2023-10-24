<script lang="ts">
	import { onMount } from 'svelte';
	import type { Log } from './proxy+page.server';

	export let entries: Log[];

	onMount(() => {
		const element = document.querySelector('.carousel-vertical')!;
		element.scrollTop = element.scrollHeight;
	});

	function newDay(entry: Log, i: number): boolean {
		if (i === 0) return false;

		const prev = entries[i - 1];
		if (entry.time.getDay() !== prev.time.getDay()) return true;

		return false;
	}
</script>

<aside class="h-[34rem] carousel carousel-vertical carousel-end">
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
				<div class="chat-bubble chat-bubble-accent uppercase">
					bingo!
				</div>
			{/if}
		</div>
	{/each}
</aside>
