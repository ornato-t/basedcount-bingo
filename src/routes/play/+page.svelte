<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="w-fit mx-auto">
	{#if data.user !== null}
		<div class="flex flex-col">
			<div>
				{data.user.name}
			</div>
			<div>
				{data.user.admin ? 'Admin' : 'Not an admin'}
			</div>
			<div>
				<img src={data.user.image} alt="Avatar" />
			</div>
			{#if data.user.banner !== null}
				<div>
					<img src={data.user.banner} alt="Banner" />
				</div>
			{/if}
			<a href="/play/add" class="btn btn-secondary btn-lg">
				Add a card
			</a>
		</div>
	{/if}
</main>
