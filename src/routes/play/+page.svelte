<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<h1 class="text-3xl font-semibold">Your profile</h1>
	<div class="card card-compact w-80 bg-base-100 shadow-xl image-full">
		<figure><img src={data.currentUser?.banner} alt="" /></figure>
		<div class="card-body grid grid-rows-4 grid-cols-2">
			{#if data.currentUser}
				<img src={data.currentUser?.image} alt="" class="rounded-lg row-span-4 h-full" />
				<h2 class="card-title row-span-2">{data.currentUser?.name ?? ''}</h2>
				<p>
					{#if data.currentUser?.admin}Admin{/if}
				</p>
				<p>{data.currentUser?.victories} {data.currentUser.victories === 1 ? 'victory' : 'victories'}</p>
			{/if}
		</div>
	</div>

	<a href="/play/add" class="btn btn-secondary btn-lg mt-4"> Add a card </a>
</div>
