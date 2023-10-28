<script lang="ts">
	import type { Player } from './proxy+page.server';

	export let player: Player;
    export let className: string = '';
</script>

<span class="flex flex-row items-center gap-x-4 {className}">
	<div class="avatar">
		<div class="w-9 h-9 rounded-full">
			<img src={player.image} alt="{player.name}'s avatar" />
		</div>
	</div>
	{player.name}
</span>
