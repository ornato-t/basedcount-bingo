<script lang="ts">
	export let player: {name: string, image: string};
    export let className: string = '';
</script>

<span class="flex flex-row items-center gap-x-3 {className}">
	<div class="avatar">
		<div class="w-9 h-9 rounded-full">
			<img src={player.image} alt="{player.name}'s avatar" />
		</div>
	</div>
	{player.name}
</span>
